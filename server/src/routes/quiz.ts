import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all quizzes
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: { select: { questions: true, attempts: true } },
        createdBy: { select: { username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(quizzes);
  } catch (error: any) {
    console.error('❌ GET /quizzes ERROR:', { message: error.message, stack: error.stack?.split('\n').slice(0, 3).join('\n') });
    res.status(500).json({ error: 'Server error' });
  }
});

// IMPORTANT: /user/* routes MUST be defined BEFORE /:id to avoid being caught
// Get user's quiz history
router.get('/user/history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: req.userId },
      include: {
        quiz: { select: { title: true, category: true, difficulty: true } },
      },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });
    res.json(attempts);
  } catch (error: any) {
    console.error('❌ GET /user/history ERROR:', { message: error.message, userId: req.userId });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user stats
router.get('/user/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: req.userId },
      include: { quiz: { select: { category: true, difficulty: true } } },
    });

    const totalQuizzes = attempts.length;
    const totalScore = attempts.reduce((sum: number, a) => sum + a.score, 0);
    const totalQuestions = attempts.reduce((sum: number, a) => sum + a.totalQuestions, 0);
    const avgScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    // Category breakdown
    const categoryMap = new Map<string, { total: number; correct: number }>();
    attempts.forEach((a) => {
      const cat = a.quiz.category;
      const existing = categoryMap.get(cat) || { total: 0, correct: 0 };
      existing.total += a.totalQuestions;
      existing.correct += a.score;
      categoryMap.set(cat, existing);
    });

    const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      accuracy: Math.round((data.correct / data.total) * 100),
      quizzesTaken: data.total,
    }));

    // Recent activity (last 7 attempts for chart)
    const recentAttempts = attempts.slice(0, 7).reverse().map((a) => ({
      date: a.completedAt,
      score: Math.round((a.score / a.totalQuestions) * 100),
      quizTitle: a.quiz.category,
    }));

    res.json({
      totalQuizzes,
      avgScore,
      totalQuestions,
      totalCorrect: totalScore,
      categories,
      recentAttempts,
      streak: Math.min(totalQuizzes, 7),
    });
  } catch (error: any) {
    console.error('❌ GET /user/stats ERROR:', { message: error.message, userId: req.userId });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get quiz by ID (with questions for playing) — after /user/* routes
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const quizId = req.params.id as string;
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          select: { id: true, text: true, options: true, correctAnswer: true, explanation: true },
        },
        _count: { select: { attempts: true } },
        createdBy: { select: { username: true } },
      },
    });
    if (!quiz) {
      console.warn(`⚠️ GET /quizzes/${quizId} — Quiz not found`);
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error: any) {
    console.error('❌ GET /quizzes/:id ERROR:', { message: error.message, quizId: req.params.id as string });
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit quiz attempt
router.post('/:id/attempt', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { answers, timeTaken } = req.body;
    const quizId = req.params.id as string;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Calculate score
    let score = 0;
    const parsedAnswers: number[] = answers;

    quiz.questions.forEach((question: any, index: number) => {
      if (parsedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        score,
        totalQuestions: quiz.questions.length,
        timeTaken: timeTaken || 0,
        answers: JSON.stringify(parsedAnswers),
        userId: req.userId!,
        quizId,
      },
    });

    console.log(`✅ QUIZ ATTEMPT: user=${req.userId} quiz=${quizId} score=${score}/${quiz.questions.length}`);

    res.status(201).json({
      ...attempt,
      percentage: Math.round((score / quiz.questions.length) * 100),
    });
  } catch (error: any) {
    console.error('❌ POST /quizzes/:id/attempt ERROR:', { message: error.message, quizId: req.params.id as string, userId: req.userId });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
