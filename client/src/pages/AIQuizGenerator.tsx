import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Sparkles, Wand2, BookOpen, Zap, AlertTriangle } from 'lucide-react';

export default function AIQuizGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    try {
      const { data } = await api.post('/ai/generate', {
        topic: topic.trim(),
        difficulty,
        numQuestions,
      });
      toast.success('Quiz generated!');
      navigate(`/quiz/${data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const suggestions = [
    'Quantum Computing', 'Blockchain Technology', 'Machine Learning',
    'Cybersecurity', 'Cloud Architecture', 'TypeScript Advanced',
    'Docker & Kubernetes', 'GraphQL APIs', 'Rust Programming',
    'Web3 Development', 'Microservices', 'LLMs & Transformers',
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Quiz Generator</h1>
        </div>
        <p className="text-gray-400 mt-2">Generate a custom quiz on any topic using AI</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleGenerate}
        className="space-y-6"
      >
        <div className="p-6 rounded-2xl bg-gray-900/50 border border-white/10 space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1.5" />
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Machine Learning, React Hooks, Quantum Physics..."
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition"
              required
              maxLength={100}
            />
          </div>

          {/* Quick suggestions */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTopic(s)}
                  className="px-3 py-1 rounded-lg bg-gray-800/50 border border-white/5 text-xs text-gray-400 hover:text-violet-300 hover:border-violet-500/30 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Zap className="w-4 h-4 inline mr-1.5" />
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                    difficulty === d
                      ? d === 'easy'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : d === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-gray-800/50 text-gray-400 border border-white/5 hover:border-white/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Number of questions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Questions: {numQuestions}
            </label>
            <input
              type="range"
              min={3}
              max={10}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>3</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="flex gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-300/80">
            <p className="font-medium text-amber-300 mb-1">How it works</p>
            <p>
              If a Gemini API key is configured, questions are generated using Google's AI.
              Otherwise, template-based questions are used. Either way, a full quiz is created
              and saved to your account.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={generating || !topic.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating your quiz...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Wand2 className="w-5 h-5" />
              Generate Quiz
            </span>
          )}
        </button>
      </motion.form>
    </div>
  );
}
