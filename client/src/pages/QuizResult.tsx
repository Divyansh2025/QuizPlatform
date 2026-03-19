import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react';

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { attempt, quiz, answers } = location.state || {};

  if (!attempt || !quiz) {
    navigate('/quizzes');
    return null;
  }

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const minutes = Math.floor(attempt.timeTaken / 60);
  const seconds = attempt.timeTaken % 60;

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: 'text-emerald-400', emoji: '🏆' };
    if (percentage >= 70) return { label: 'Great Job!', color: 'text-green-400', emoji: '🎉' };
    if (percentage >= 50) return { label: 'Good Effort!', color: 'text-amber-400', emoji: '👍' };
    return { label: 'Keep Practicing!', color: 'text-red-400', emoji: '💪' };
  };

  const grade = getGrade();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-2xl bg-gray-900/50 border border-white/10 text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-6xl mb-4"
        >
          {grade.emoji}
        </motion.div>

        <h1 className={`text-3xl font-bold mb-2 ${grade.color}`}>{grade.label}</h1>
        <p className="text-gray-400 mb-6">{quiz.title}</p>

        {/* Score circle */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800" />
            <motion.circle
              cx="18" cy="18" r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 100' }}
              animate={{ strokeDasharray: `${percentage} 100` }}
              transition={{ delay: 0.5, duration: 1 }}
              className={percentage >= 70 ? 'text-emerald-500' : percentage >= 50 ? 'text-amber-500' : 'text-red-500'}
            />
          </svg>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute text-3xl font-bold text-white"
          >
            {percentage}%
          </motion.span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <div className="p-3 rounded-xl bg-gray-800/50">
            <Target className="w-5 h-5 text-violet-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{attempt.score}/{attempt.totalQuestions}</p>
            <p className="text-xs text-gray-500">Correct</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-800/50">
            <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{minutes}:{seconds.toString().padStart(2, '0')}</p>
            <p className="text-xs text-gray-500">Time</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-800/50">
            <Trophy className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white capitalize">{quiz.difficulty}</p>
            <p className="text-xs text-gray-500">Difficulty</p>
          </div>
        </div>
      </motion.div>

      {/* Answer Review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3 mb-8"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Answer Review</h2>
        {quiz.questions.map((question: any, i: number) => {
          const opts = JSON.parse(question.options);
          const userAnswer = answers[i];
          const isCorrect = userAnswer === question.correctAnswer;

          return (
            <div
              key={question.id}
              className={`p-4 rounded-xl border ${
                isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 mb-2">{i + 1}. {question.text}</p>
                  {!isCorrect && (
                    <div className="text-xs space-y-1">
                      <p className="text-red-400">Your answer: {userAnswer >= 0 ? opts[userAnswer] : 'Not answered'}</p>
                      <p className="text-emerald-400">Correct: {opts[question.correctAnswer]}</p>
                    </div>
                  )}
                  {isCorrect && (
                    <p className="text-xs text-emerald-400">{opts[question.correctAnswer]}</p>
                  )}
                  {question.explanation && (
                    <p className="text-xs text-gray-500 mt-1">{question.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Link
          to={`/quiz/${quiz.id}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </Link>
        <Link
          to="/quizzes"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition"
        >
          <Home className="w-4 h-4" />
          Browse Quizzes
        </Link>
      </div>
    </div>
  );
}
