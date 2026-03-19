import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Brain, Sparkles, Trophy, Zap, ArrowRight, BookOpen } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Generation',
      desc: 'Generate quizzes on any topic instantly using Google Gemini AI',
      gradient: 'from-violet-500 to-fuchsia-500',
    },
    {
      icon: Zap,
      title: 'Real-Time Feedback',
      desc: 'Get instant feedback with explanations for every answer',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Trophy,
      title: 'Leaderboard & Stats',
      desc: 'Compete with others and track your progress with analytics',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: BookOpen,
      title: 'Rich Quiz Library',
      desc: 'Browse curated quizzes across programming, science, and more',
      gradient: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-gray-950 to-fuchsia-950/30" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="pt-20 pb-16 sm:pt-32 sm:pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              Learn Smarter with
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                AI Quizzes
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Generate custom quizzes on any topic, track your progress, compete on the leaderboard,
              and level up your knowledge — all powered by cutting-edge AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-lg transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>

          {/* Platform preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 relative"
          >
            <div className="p-1 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
              <div className="p-6 sm:p-8 rounded-xl bg-gray-950/90 backdrop-blur border border-white/5">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {['JavaScript', 'React', 'Python'].map((topic, i) => (
                    <div
                      key={topic}
                      className="p-4 rounded-xl bg-gray-900/50 border border-white/5"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                        i === 0 ? 'from-yellow-500 to-amber-500' :
                        i === 1 ? 'from-cyan-500 to-blue-500' :
                        'from-green-500 to-emerald-500'
                      } flex items-center justify-center text-white text-sm font-bold mb-2`}>
                        {topic[0]}
                      </div>
                      <p className="text-sm font-medium text-white">{topic}</p>
                      <p className="text-xs text-gray-500">8 questions</p>
                      <div className="mt-2 h-1.5 rounded bg-gray-800 overflow-hidden">
                        <div className={`h-full rounded bg-gradient-to-r ${
                          i === 0 ? 'from-yellow-500 to-amber-500' :
                          i === 1 ? 'from-cyan-500 to-blue-500' :
                          'from-green-500 to-emerald-500'
                        }`} style={{ width: `${70 + i * 10}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="py-16">
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-6 rounded-2xl bg-gray-900/30 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="py-16 text-center"
        >
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-6">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['React', 'TypeScript', 'Node.js', 'Prisma', 'Tailwind CSS', 'Framer Motion', 'Google Gemini', 'SQLite'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-lg bg-gray-900/50 border border-white/5 text-sm text-gray-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
