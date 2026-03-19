import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard')
      .then((res) => setEntries(res.data))
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

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 1) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-medium text-gray-500 w-5 text-center">{rank + 1}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 0) return 'bg-yellow-500/5 border-yellow-500/20';
    if (rank === 1) return 'bg-gray-500/5 border-gray-500/20';
    if (rank === 2) return 'bg-amber-500/5 border-amber-500/20';
    return 'bg-gray-900/30 border-white/5';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="w-7 h-7 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        </div>
        <p className="text-gray-400">Top quiz performers</p>
      </motion.div>

      {entries.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No entries yet</p>
          <p className="text-sm mt-1">Complete some quizzes to appear here!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${getRankBg(i)}`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(i)}
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                {entry.username[0].toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{entry.username}</p>
                <p className="text-xs text-gray-500">{entry.totalQuizzes} quizzes completed</p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">{entry.avgAccuracy}%</span>
                </div>
                <p className="text-xs text-gray-500">{entry.totalScore} pts</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
