import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Sparkles, ChevronRight } from 'lucide-react';
import { Quiz } from '../types';

const difficultyColors = {
  easy: 'from-emerald-500 to-green-500',
  medium: 'from-amber-500 to-orange-500',
  hard: 'from-red-500 to-rose-500',
};

const difficultyBg = {
  easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function QuizCard({ quiz, index }: { quiz: Quiz; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/quiz/${quiz.id}`}
        className="block group h-full"
      >
        <div className="relative h-full p-6 rounded-2xl bg-gray-900/50 border border-white/5 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5">
          {/* Gradient bar */}
          <div className={`absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r ${difficultyColors[quiz.difficulty]} rounded-b opacity-50 group-hover:opacity-100 transition-opacity`} />

          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{quiz.category}</p>
            </div>
            {quiz.isAIGenerated && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-xs font-medium border border-violet-500/20">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            )}
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-4">
            {quiz.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${difficultyBg[quiz.difficulty]}`}>
              {quiz.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {quiz.timeLimit}s
            </span>
            <span className="flex items-center gap-1">
              {quiz._count.questions} Q's
            </span>
            {quiz._count.attempts !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {quiz._count.attempts}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-1 text-violet-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Start Quiz
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
