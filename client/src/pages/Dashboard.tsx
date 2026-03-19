import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserStats } from '../types';
import {
  Trophy, Target, Zap, BookOpen, TrendingUp,
  ArrowRight, Sparkles, BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes/user/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Quizzes Taken',
      value: stats?.totalQuizzes || 0,
      icon: BookOpen,
      gradient: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Avg. Score',
      value: `${stats?.avgScore || 0}%`,
      icon: Target,
      gradient: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Questions Answered',
      value: stats?.totalQuestions || 0,
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Current Streak',
      value: `${stats?.streak || 0} days`,
      icon: Trophy,
      gradient: 'from-fuchsia-500 to-pink-500',
      bg: 'bg-fuchsia-500/10',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{user?.username}</span>
        </h1>
        <p className="text-gray-400 mt-1">Here's your learning progress</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-gray-900/50 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${stat.bg} mb-3`}>
              <stat.icon className={`w-5 h-5 bg-gradient-to-r ${stat.gradient} bg-clip-text`} style={{ color: 'inherit' }} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart */}
      {stats && stats.recentAttempts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-gray-900/50 border border-white/5 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Recent Performance</h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {stats.recentAttempts.map((attempt, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400">{attempt.score}%</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${attempt.score}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className={`w-full rounded-t-lg ${
                    attempt.score >= 80
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                      : attempt.score >= 50
                      ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                      : 'bg-gradient-to-t from-red-600 to-red-400'
                  }`}
                />
                <span className="text-[10px] text-gray-600 truncate w-full text-center">
                  {attempt.quizTitle}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category Performance */}
      {stats && stats.categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-gray-900/50 border border-white/5 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Category Performance</h2>
          </div>
          <div className="space-y-3">
            {stats.categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{cat.name}</span>
                  <span className="text-gray-400">{cat.accuracy}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.accuracy}%` }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/quizzes"
            className="block p-6 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 hover:border-violet-500/40 transition-all group"
          >
            <BookOpen className="w-8 h-8 text-violet-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Browse Quizzes</h3>
            <p className="text-sm text-gray-400 mb-3">Explore quizzes across various categories</p>
            <span className="inline-flex items-center gap-1 text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/ai-generate"
            className="block p-6 rounded-2xl bg-gradient-to-br from-fuchsia-600/20 to-pink-600/20 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all group"
          >
            <Sparkles className="w-8 h-8 text-fuchsia-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Generate with AI</h3>
            <p className="text-sm text-gray-400 mb-3">Create a custom quiz on any topic instantly</p>
            <span className="inline-flex items-center gap-1 text-fuchsia-400 text-sm font-medium group-hover:gap-2 transition-all">
              Generate <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
