import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import quizRoutes from './routes/quiz';
import leaderboardRoutes from './routes/leaderboard';
import aiRoutes from './routes/ai';

dotenv.config();

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiKey: process.env.GEMINI_API_KEY ? '✅ configured' : '❌ missing',
    openaiKey: process.env.OPENAI_API_KEY ? '✅ configured' : '❌ missing',
  });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('\n❌ UNHANDLED ERROR:', {
    message: err.message,
    stack: err.stack?.split('\n').slice(0, 3).join('\n'),
    timestamp: new Date().toISOString(),
  });
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Keys Status:`);
  console.log(`   Gemini: ${process.env.GEMINI_API_KEY ? '✅ configured' : '❌ missing'}`);
  console.log(`   OpenAI: ${process.env.OPENAI_API_KEY ? '✅ configured' : '❌ missing'}`);
});
