import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Generate quiz with AI
router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { topic, difficulty = 'medium', numQuestions = 5 } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const sanitizedTopic = topic.trim().slice(0, 100);
    const clampedQuestions = Math.min(Math.max(Number(numQuestions) || 5, 3), 10);
    const validDifficulty = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let questions;
    let usedProvider = 'fallback';

    // Try Gemini first
    if (geminiKey && geminiKey !== 'your-gemini-api-key') {
      try {
        questions = await generateWithGemini(geminiKey, sanitizedTopic, validDifficulty, clampedQuestions);
        usedProvider = 'gemini';
      } catch (geminiError: any) {
        console.warn('⚠️ GEMINI FAILED:', {
          status: geminiError.status || geminiError.code || 'unknown',
          message: geminiError.message?.split('\n')[0],
        });
      }
    }

    // Fallback to GPT if Gemini failed or unavailable
    if (!questions && openaiKey && openaiKey !== 'your-openai-api-key') {
      try {
        questions = await generateWithGPT(openaiKey, sanitizedTopic, validDifficulty, clampedQuestions);
        usedProvider = 'gpt';
      } catch (gptError: any) {
        console.warn('⚠️ GPT FAILED:', {
          status: gptError.status || gptError.code || 'unknown',
          message: gptError.message?.split('\n')[0],
        });
      }
    }

    // Final fallback to template questions
    if (!questions) {
      questions = generateFallbackQuestions(sanitizedTopic, validDifficulty, clampedQuestions);
    }

    console.log(`🤖 AI QUIZ: provider=${usedProvider} topic="${sanitizedTopic}" difficulty=${validDifficulty} questions=${clampedQuestions}`);

    // Save to database
    const quiz = await prisma.quiz.create({
      data: {
        title: `AI Quiz: ${sanitizedTopic}`,
        description: `AI-generated quiz about ${sanitizedTopic} (${validDifficulty} difficulty)`,
        category: 'AI Generated',
        difficulty: validDifficulty,
        timeLimit: validDifficulty === 'easy' ? 20 : validDifficulty === 'medium' ? 30 : 45,
        isAIGenerated: true,
        createdById: req.userId!,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null,
          })),
        },
      },
      include: {
        questions: true,
        _count: { select: { questions: true } },
      },
    });

    res.status(201).json(quiz);
  } catch (error: any) {
    console.error('❌ AI GENERATION ERROR:', {
      message: error.message,
      code: error.code || error.status,
      stack: error.stack?.split('\n').slice(0, 4).join('\n'),
    });
    res.status(500).json({ error: 'Failed to generate quiz. Please try again.' });
  }
});

async function generateWithGemini(
  apiKey: string,
  topic: string,
  difficulty: string,
  numQuestions: number
) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `Generate a quiz with exactly ${numQuestions} multiple-choice questions about "${topic}" at ${difficulty} difficulty level.

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
[
  {
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of the correct answer"
  }
]

Requirements:
- Each question must have exactly 4 options
- correctAnswer is the 0-based index of the correct option
- Questions should be factually accurate
- ${difficulty === 'easy' ? 'Keep questions straightforward and beginner-friendly' : difficulty === 'hard' ? 'Make questions challenging and nuanced' : 'Balance difficulty for intermediate learners'}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Invalid AI response format');

  const questions = JSON.parse(jsonMatch[0]);

  // Validate structure
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Invalid questions array');
  }

  return questions.map((q: any) => ({
    text: String(q.text || '').slice(0, 500),
    options: Array.isArray(q.options) ? q.options.slice(0, 4).map((o: any) => String(o).slice(0, 200)) : ['A', 'B', 'C', 'D'],
    correctAnswer: typeof q.correctAnswer === 'number' ? Math.min(Math.max(q.correctAnswer, 0), 3) : 0,
    explanation: q.explanation ? String(q.explanation).slice(0, 500) : null,
  }));
}

async function generateWithGPT(
  apiKey: string,
  topic: string,
  difficulty: string,
  numQuestions: number
) {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({ apiKey });

  const prompt = `Generate a quiz with exactly ${numQuestions} multiple-choice questions about "${topic}" at ${difficulty} difficulty level.

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
[
  {
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of the correct answer"
  }
]

Requirements:
- Each question must have exactly 4 options
- correctAnswer is the 0-based index of the correct option
- Questions should be factually accurate
- ${difficulty === 'easy' ? 'Keep questions straightforward and beginner-friendly' : difficulty === 'hard' ? 'Make questions challenging and nuanced' : 'Balance difficulty for intermediate learners'}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a quiz generator. Return ONLY valid JSON arrays, no other text.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });

  const text = completion.choices[0]?.message?.content || '';

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Invalid GPT response format');

  const questions = JSON.parse(jsonMatch[0]);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Invalid questions array from GPT');
  }

  return questions.map((q: any) => ({
    text: String(q.text || '').slice(0, 500),
    options: Array.isArray(q.options) ? q.options.slice(0, 4).map((o: any) => String(o).slice(0, 200)) : ['A', 'B', 'C', 'D'],
    correctAnswer: typeof q.correctAnswer === 'number' ? Math.min(Math.max(q.correctAnswer, 0), 3) : 0,
    explanation: q.explanation ? String(q.explanation).slice(0, 500) : null,
  }));
}

function generateFallbackQuestions(topic: string, difficulty: string, numQuestions: number) {
  const templates = [
    {
      text: `Which of the following best describes ${topic}?`,
      options: [
        `A fundamental concept in ${topic}`,
        `An advanced technique in ${topic}`,
        `A historical aspect of ${topic}`,
        `A modern application of ${topic}`,
      ],
      correctAnswer: 0,
      explanation: `This is a foundational concept in ${topic}.`,
    },
    {
      text: `What is a key benefit of understanding ${topic}?`,
      options: [
        'Better problem-solving skills',
        'Improved analytical thinking',
        'Enhanced career opportunities',
        'All of the above',
      ],
      correctAnswer: 3,
      explanation: `Understanding ${topic} provides multiple benefits.`,
    },
    {
      text: `Which skill is most important when studying ${topic}?`,
      options: [
        'Critical thinking',
        'Memorization',
        'Speed reading',
        'Multitasking',
      ],
      correctAnswer: 0,
      explanation: 'Critical thinking is essential for deep understanding.',
    },
    {
      text: `In what context is ${topic} most commonly applied?`,
      options: [
        'Academic research',
        'Industry applications',
        'Daily life',
        'All contexts',
      ],
      correctAnswer: 3,
      explanation: `${topic} has applications across many contexts.`,
    },
    {
      text: `What is the best approach to learning ${topic}?`,
      options: [
        'Practice and hands-on experience',
        'Only reading textbooks',
        'Watching videos passively',
        'Memorizing formulas',
      ],
      correctAnswer: 0,
      explanation: 'Active practice is the most effective learning method.',
    },
    {
      text: `How has ${topic} evolved in recent years?`,
      options: [
        'Significant technological advancement',
        'No major changes',
        'Decreased in relevance',
        'Became more restrictive',
      ],
      correctAnswer: 0,
      explanation: `${topic} has seen significant advancement and growth.`,
    },
    {
      text: `Which of these is a common misconception about ${topic}?`,
      options: [
        'It is only for experts',
        'It is easy to master',
        'It has no practical use',
        'It requires expensive tools',
      ],
      correctAnswer: 0,
      explanation: `${topic} is accessible to beginners willing to learn.`,
    },
    {
      text: `What foundational knowledge helps with ${topic}?`,
      options: [
        'Logical reasoning',
        'Artistic skills',
        'Physical fitness',
        'Musical talent',
      ],
      correctAnswer: 0,
      explanation: 'Logical reasoning forms the basis for understanding most topics.',
    },
    {
      text: `Which resource would be most helpful for studying ${topic}?`,
      options: [
        'Interactive tutorials and projects',
        'Social media posts',
        'Random blog articles',
        'Entertainment videos',
      ],
      correctAnswer: 0,
      explanation: 'Interactive, structured learning resources are most effective.',
    },
    {
      text: `What makes ${topic} important in today's world?`,
      options: [
        'Its growing relevance in technology and society',
        'It is a passing trend',
        'Historical significance only',
        'Limited to academic circles',
      ],
      correctAnswer: 0,
      explanation: `${topic} continues to grow in relevance and importance.`,
    },
  ];

  return templates.slice(0, numQuestions);
}

export default router;
