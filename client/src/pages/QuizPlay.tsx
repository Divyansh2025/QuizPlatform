import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Quiz, Question } from '../types';
import { useAuth } from '../context/AuthContext';
import Timer from '../components/Timer';
import toast from 'react-hot-toast';
import {
  ChevronRight, ChevronLeft, CheckCircle2, XCircle,
  Clock, Brain, ArrowRight
} from 'lucide-react';

export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const startTimeRef = useRef(Date.now());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/${id}`)
      .then((res) => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
      })
      .catch(() => {
        toast.error('Quiz not found');
        navigate('/quizzes');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !quiz || !quiz.questions) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const questions = quiz.questions;
  const question = questions[currentQ];
  const options: string[] = JSON.parse(question.options);
  const totalQuestions = questions.length;
  const progress = ((currentQ + 1) / totalQuestions) * 100;

  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(answers[currentQ + 1]);
      setIsAnswered(answers[currentQ + 1] !== null);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelectedAnswer(answers[currentQ - 1]);
      setIsAnswered(answers[currentQ - 1] !== null);
    }
  };

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true);
    }
    // Auto-advance after time up
    setTimeout(() => {
      if (currentQ < totalQuestions - 1) {
        handleNext();
      } else {
        handleSubmit();
      }
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to submit');
      navigate('/login');
      return;
    }
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    try {
      const { data } = await api.post(`/quizzes/${id}/attempt`, {
        answers: answers.map((a) => a ?? -1),
        timeTaken,
      });
      navigate(`/quiz/${id}/result`, {
        state: {
          attempt: data,
          quiz,
          answers: answers.map((a) => a ?? -1),
        },
      });
    } catch {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  // Pre-quiz start screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-gray-900/50 border border-white/10 text-center"
        >
          <div className="inline-flex p-4 rounded-2xl bg-violet-500/10 mb-6">
            <Brain className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{quiz.title}</h1>
          <p className="text-gray-400 mb-6">{quiz.description}</p>

          <div className="flex justify-center gap-6 mb-8 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {quiz.timeLimit}s per question
            </span>
            <span>{totalQuestions} questions</span>
            <span className="capitalize px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {quiz.difficulty}
            </span>
          </div>

          <button
            onClick={() => {
              setStarted(true);
              startTimeRef.current = Date.now();
            }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-lg transition-all"
          >
            Start Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Question {currentQ + 1} of {totalQuestions}
          </span>
          <Timer
            key={currentQ}
            duration={quiz.timeLimit}
            onTimeUp={handleTimeUp}
            isPaused={isAnswered}
          />
        </div>
        <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-2xl bg-gray-900/50 border border-white/10"
        >
          <h2 className="text-xl font-semibold text-white mb-6">{question.text}</h2>

          <div className="space-y-3">
            {options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === question.correctAnswer;
              const showCorrectness = isAnswered;

              let borderColor = 'border-white/10 hover:border-violet-500/30';
              let bgColor = 'bg-gray-800/30';

              if (showCorrectness) {
                if (isCorrect) {
                  borderColor = 'border-emerald-500/50';
                  bgColor = 'bg-emerald-500/10';
                } else if (isSelected && !isCorrect) {
                  borderColor = 'border-red-500/50';
                  bgColor = 'bg-red-500/10';
                }
              } else if (isSelected) {
                borderColor = 'border-violet-500/50';
                bgColor = 'bg-violet-500/10';
              }

              return (
                <motion.button
                  key={i}
                  whileHover={!isAnswered ? { scale: 1.01 } : {}}
                  whileTap={!isAnswered ? { scale: 0.99 } : {}}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={isAnswered}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${borderColor} ${bgColor}`}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold ${
                    showCorrectness && isCorrect
                      ? 'bg-emerald-500 text-white'
                      : showCorrectness && isSelected && !isCorrect
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {showCorrectness ? (
                      isCorrect ? <CheckCircle2 className="w-4 h-4" /> : isSelected ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className={`flex-1 ${showCorrectness && isCorrect ? 'text-emerald-300' : showCorrectness && isSelected && !isCorrect ? 'text-red-300' : 'text-gray-200'}`}>
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20"
            >
              <p className="text-sm text-blue-300">
                <span className="font-semibold">Explanation:</span> {question.explanation}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-white/10 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Question dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentQ(i);
                setSelectedAnswer(answers[i]);
                setIsAnswered(answers[i] !== null);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentQ
                  ? 'bg-violet-500 scale-125'
                  : answers[i] !== null
                  ? 'bg-violet-500/40'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {currentQ < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || answers.some((a) => a === null)}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Submitting...' : 'Finish Quiz'}
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
