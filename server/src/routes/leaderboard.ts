import { Router, Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Get global leaderboard
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        attempts: {
          select: { score: true, totalQuestions: true, completedAt: true },
        },
      },
    });

    const leaderboard = users
      .map((user) => {
        const totalAttempts = user.attempts.length;
        if (totalAttempts === 0) return null;

        const totalScore = user.attempts.reduce((s: number, a) => s + a.score, 0);
        const totalQuestions = user.attempts.reduce((s: number, a) => s + a.totalQuestions, 0);
        const avgAccuracy = Math.round((totalScore / totalQuestions) * 100);
        const lastActive = user.attempts.reduce(
          (latest: Date, a) => (a.completedAt > latest ? a.completedAt : latest),
          user.attempts[0].completedAt
        );

        return {
          id: user.id,
          username: user.username,
          totalQuizzes: totalAttempts,
          avgAccuracy,
          totalScore,
          lastActive,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 50);

    res.json(leaderboard);
  } catch (error: any) {
    console.error('❌ GET /leaderboard ERROR:', { message: error.message, stack: error.stack?.split('\n').slice(0, 3).join('\n') });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
