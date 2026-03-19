export interface User {
  id: string;
  email: string;
  username: string;
  createdAt?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  isAIGenerated: boolean;
  createdAt: string;
  createdBy?: { username: string };
  questions?: Question[];
  _count: { questions: number; attempts?: number };
}

export interface Question {
  id: string;
  text: string;
  options: string; // JSON string array
  correctAnswer: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  answers: string;
  completedAt: string;
  percentage?: number;
  quiz?: { title: string; category: string; difficulty: string };
}

export interface UserStats {
  totalQuizzes: number;
  avgScore: number;
  totalQuestions: number;
  totalCorrect: number;
  streak: number;
  categories: { name: string; accuracy: number; quizzesTaken: number }[];
  recentAttempts: { date: string; score: number; quizTitle: string }[];
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  totalQuizzes: number;
  avgAccuracy: number;
  totalScore: number;
  lastActive: string;
}
