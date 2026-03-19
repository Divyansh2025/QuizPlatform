import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticateToken, generateToken, AuthRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.warn('📝 REGISTER VALIDATION FAILED:', error.errors.map(e => `${e.path}: ${e.message}`));
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('❌ REGISTER ERROR:', { message: error.message, stack: error.stack?.split('\n').slice(0, 3).join('\n') });
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.warn('📝 LOGIN VALIDATION FAILED:', error.errors.map(e => `${e.path}: ${e.message}`));
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('❌ LOGIN ERROR:', { message: error.message, stack: error.stack?.split('\n').slice(0, 3).join('\n') });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, username: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error: any) {
    console.error('❌ GET /me ERROR:', { message: error.message, userId: req.userId });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
