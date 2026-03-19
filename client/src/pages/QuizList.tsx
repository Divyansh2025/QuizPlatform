import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Quiz } from '../types';
import QuizCard from '../components/QuizCard';
import { Search, Filter } from 'lucide-react';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    api.get('/quizzes')
      .then((res) => setQuizzes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(quizzes.map((q) => q.category))];
  const difficulties = ['All', 'easy', 'medium', 'hard'];

  const filtered = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchSearch && matchCategory && matchDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-1">Explore Quizzes</h1>
        <p className="text-gray-400">Find a quiz that challenges you</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quizzes..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-2">
            <Filter className="w-4 h-4" />
            Filters:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-white/5 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="w-px h-6 bg-white/10 self-center mx-1" />
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                selectedDifficulty === diff
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-white/5 hover:border-white/10'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Quiz Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No quizzes found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((quiz, i) => (
            <QuizCard key={quiz.id} quiz={quiz} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
