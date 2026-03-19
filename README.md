# 🧠 QuizAI — AI-Powered Quiz Platform

A full-stack, AI-powered quiz platform built with modern technologies. Generate quizzes on any topic using Google Gemini AI, compete on leaderboards, and track your learning progress.

![Tech Stack](https://img.shields.io/badge/React-18-blue?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square) ![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square) ![Prisma](https://img.shields.io/badge/Prisma-ORM-purple?style=flat-square) ![Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange?style=flat-square)

## ✨ Features

- **🤖 AI Quiz Generation** — Generate quizzes on any topic using Google Gemini AI
- **🔐 JWT Authentication** — Secure sign-up/login with bcrypt password hashing
- **📊 Analytics Dashboard** — Track performance with visual charts and category breakdown
- **🏆 Leaderboard** — Compete with other users globally
- **⏱️ Timed Quizzes** — Configurable time limits per question with animated timer
- **📝 Instant Feedback** — See correct answers and explanations immediately
- **🎨 Modern UI** — Glassmorphism design with Framer Motion animations
- **📱 Fully Responsive** — Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite + Prisma ORM |
| AI | Google Gemini API |
| Auth | JWT + bcrypt |
| Validation | Zod |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Setup database (migrations + seed data)
npm run db:setup

# 3. Start development servers
npm run dev
```

The app will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Demo Account
```
Email: demo@quizai.com
Password: demo123
```

## 🤖 AI Configuration (Optional)

To enable AI-powered quiz generation:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Update `server/.env`:
   ```
   GEMINI_API_KEY=your-actual-api-key
   ```

Without an API key, the app uses template-based question generation as a fallback.

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── types/          # TypeScript interfaces
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── middleware/     # Auth middleware
│   │   └── routes/         # API routes
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── seed.ts         # Seed data
└── package.json            # Root scripts
```

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/quizzes` | No | List all quizzes |
| GET | `/api/quizzes/:id` | No | Get quiz with questions |
| POST | `/api/quizzes/:id/attempt` | Yes | Submit quiz attempt |
| GET | `/api/quizzes/user/stats` | Yes | Get user statistics |
| GET | `/api/quizzes/user/history` | Yes | Get attempt history |
| GET | `/api/leaderboard` | No | Get global leaderboard |
| POST | `/api/ai/generate` | Yes | Generate AI quiz |

## 📄 License

MIT
