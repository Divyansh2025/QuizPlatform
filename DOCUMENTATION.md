# QuizAI — Complete Project Documentation
### From Basics to Advanced: Tech Stack, Architecture, Logic & Every Concept Explained

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack — What & Why](#2-tech-stack--what--why)
   - 2.1 React.js
   - 2.2 TypeScript
   - 2.3 Vite
   - 2.4 Tailwind CSS
   - 2.5 Framer Motion
   - 2.6 Node.js
   - 2.7 Express.js
   - 2.8 Prisma ORM
   - 2.9 SQLite
   - 2.10 JSON Web Tokens (JWT)
   - 2.11 bcrypt
   - 2.12 Zod
   - 2.13 Google Gemini AI
   - 2.14 Axios
   - 2.15 Concurrently
3. [Project Architecture](#3-project-architecture)
4. [Folder Structure — Every File Explained](#4-folder-structure--every-file-explained)
5. [Database Design (Prisma Schema)](#5-database-design-prisma-schema)
6. [Backend Deep Dive](#6-backend-deep-dive)
   - 6.1 Server Entry Point
   - 6.2 Authentication Middleware
   - 6.3 Auth Routes
   - 6.4 Quiz Routes
   - 6.5 Leaderboard Route
   - 6.6 AI Generation Route
   - 6.7 Database Seeding
7. [Frontend Deep Dive](#7-frontend-deep-dive)
   - 7.1 Entry Point & Routing
   - 7.2 Auth Context (State Management)
   - 7.3 API Service Layer
   - 7.4 Components
   - 7.5 Pages
8. [Authentication Flow — End to End](#8-authentication-flow--end-to-end)
9. [Quiz Flow — End to End](#9-quiz-flow--end-to-end)
10. [AI Quiz Generation — End to End](#10-ai-quiz-generation--end-to-end)
11. [Configuration Files Explained](#11-configuration-files-explained)
12. [Security Practices](#12-security-practices)
13. [Key Programming Concepts Used](#13-key-programming-concepts-used)
14. [Glossary of Every Term](#14-glossary-of-every-term)
15. [How to Explain This Project in an Interview](#15-how-to-explain-this-project-in-an-interview)

---

## 1. Project Overview

**QuizAI** is a full-stack, AI-powered quiz platform where users can:

- **Sign up / Log in** with secure authentication
- **Browse** a library of pre-built quizzes across categories (Programming, Science, System Design, etc.)
- **Play** timed quizzes with instant feedback and explanations
- **Generate custom quizzes** on ANY topic using Google Gemini AI
- **View results** with detailed answer reviews
- **Track progress** on an analytics dashboard with performance charts
- **Compete** on a global leaderboard

**Architecture Pattern:** Monorepo with separate `client/` and `server/` directories.

**Communication:** REST API — the React frontend makes HTTP requests to the Express backend. The backend queries the database and returns JSON responses.

---

## 2. Tech Stack — What & Why

### 2.1 React.js (v18)

**What it is:** A JavaScript library (by Meta/Facebook) for building user interfaces. It lets you create reusable UI components.

**Core Concepts Used in This Project:**

| Concept | What It Does | Where Used |
|---------|-------------|------------|
| **Components** | Reusable UI building blocks. Each file in `components/` and `pages/` is a component. | Every `.tsx` file |
| **JSX** | HTML-like syntax inside JavaScript. `<div className="text-white">Hello</div>` compiles to `React.createElement()` calls. | Every component |
| **useState** | Hook that adds state (changeable data) to a component. `const [count, setCount] = useState(0)` | Login.tsx, QuizPlay.tsx, etc. |
| **useEffect** | Hook that runs side effects (API calls, timers) after render. | Dashboard.tsx, QuizList.tsx, Timer.tsx |
| **useRef** | Hook that holds a mutable value that persists across renders without causing re-renders. | QuizPlay.tsx (`startTimeRef` to track time) |
| **useContext** | Hook to consume data from React Context (our auth state). | AuthContext.tsx, Navbar.tsx |
| **createContext** | Creates a "global" data container accessible by any child component. | AuthContext.tsx |
| **Conditional Rendering** | Show different UI based on state: `{user ? <Dashboard /> : <Landing />}` | App.tsx, Navbar.tsx |
| **Props** | Data passed from parent to child: `<QuizCard quiz={quiz} index={i} />` | QuizCard.tsx, Timer.tsx |
| **Event Handling** | Functions triggered by user actions: `onClick`, `onSubmit`, `onChange` | Login.tsx, QuizPlay.tsx |
| **Lists & Keys** | Rendering arrays with `.map()` and unique `key` props for React's diffing algorithm. | QuizList.tsx, QuizPlay.tsx |

**Why React over plain HTML/JS?**
- **Component Reusability**: Write once, use everywhere (QuizCard, Timer, Navbar)
- **Virtual DOM**: React updates only what changed, not the entire page → fast
- **Rich Ecosystem**: Huge library of packages (react-router, framer-motion, etc.)
- **Industry Standard**: Used by Meta, Netflix, Airbnb — great for resume

---

### 2.2 TypeScript (v5)

**What it is:** A superset of JavaScript that adds **static type checking**. Every variable, function parameter, and return value has a defined type.

**Why it matters:**
```typescript
// JavaScript — this bug only crashes at runtime
function addScore(score) {
  return score + 10; // What if score is "hello"? → "hello10" (string concatenation!)
}

// TypeScript — this bug is caught BEFORE running
function addScore(score: number): number {
  return score + 10; // TypeScript enforces: score MUST be a number
}
```

**Key TypeScript Features Used:**

| Feature | Syntax | Where Used |
|---------|--------|------------|
| **Interfaces** | `interface User { id: string; email: string; }` | `types/index.ts` — defines the shape of data |
| **Type Annotations** | `const [name, setName] = useState<string>('')` | Every component |
| **Generics** | `useState<Quiz \| null>(null)` — state can be Quiz or null | QuizPlay.tsx |
| **Union Types** | `difficulty: 'easy' \| 'medium' \| 'hard'` | types/index.ts |
| **Optional Properties** | `explanation?: string` — may or may not exist | types/index.ts |
| **Type Assertions** | `as { userId: string }` — tell TS "trust me, this is the type" | auth.ts middleware |
| **Non-null Assertion** | `req.userId!` — tell TS "this won't be null here" | quiz.ts routes |

**How `.ts` vs `.tsx` works:**
- `.ts` = TypeScript files (backend code, types, services)
- `.tsx` = TypeScript + JSX (React components with HTML-like syntax)

---

### 2.3 Vite

**What it is:** A modern build tool and development server for frontend projects. Replacement for older tools like Webpack and Create React App.

**What it does:**
1. **Dev Server** (`npm run dev`): Runs your React code locally with Hot Module Replacement (HMR) — changes appear instantly without full page reload
2. **Build** (`npm run build`): Bundles all your code into optimized files for production (minification, tree-shaking, code splitting)
3. **Proxy** (`vite.config.ts`): Forwards API requests from `localhost:3000/api/*` to `localhost:5000/api/*` so the frontend can talk to the backend without CORS issues in development

**Our Configuration (`vite.config.ts`):**
```typescript
export default defineConfig({
  plugins: [react()],        // Enable React/JSX support
  server: {
    port: 3000,              // Frontend runs on port 3000
    proxy: {
      '/api': {              // Any request to /api/... is forwarded to backend
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**Why Vite over Create React App (CRA)?**
- 10-100x faster dev server startup (uses native ES modules)
- Faster hot reloads
- Smaller, more modern build output
- CRA is deprecated/unmaintained — Vite is the industry standard now

---

### 2.4 Tailwind CSS (v3)

**What it is:** A utility-first CSS framework. Instead of writing CSS in separate files, you add small utility classes directly in HTML/JSX.

**Traditional CSS vs Tailwind:**
```css
/* Traditional CSS — you write classes in a .css file */
.button {
  background-color: rgb(124, 58, 237);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
}
```
```html
<!-- Tailwind — you compose utilities directly -->
<button className="bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold">
  Click Me
</button>
```

**Key Tailwind Classes Used in This Project:**

| Class | What It Does |
|-------|-------------|
| `bg-gray-950` | Dark background color |
| `text-white` | White text |
| `px-4 py-2` | Padding horizontal 1rem, vertical 0.5rem |
| `rounded-xl` | Border radius 0.75rem (rounded corners) |
| `flex items-center gap-2` | Flexbox layout, vertically centered, 0.5rem gap |
| `grid grid-cols-2 lg:grid-cols-4` | CSS Grid: 2 columns on mobile, 4 on large screens |
| `hover:bg-violet-500` | Change background on hover |
| `transition-all` | Smooth animation on property changes |
| `backdrop-blur-xl` | Glassmorphism blur effect on background |
| `bg-gradient-to-r from-violet-600 to-fuchsia-600` | Gradient from violet to fuchsia going right |
| `border border-white/10` | 1px border with 10% opacity white |
| `animate-spin` | CSS keyframe spin animation (used for loading spinners) |
| `sm:` `md:` `lg:` | Responsive breakpoints (small, medium, large screens) |

**Tailwind Configuration (`tailwind.config.js`):**
- `content`: Tells Tailwind which files to scan for class names (it removes unused CSS in production)
- `extend.animation`: Custom animations (`gradient`, `float`, `pulse-slow`)
- `extend.keyframes`: Defines the actual animation frames
- `extend.fontFamily`: Sets Inter as the default font

**How Tailwind Gets Processed:**
1. You write classes in JSX → 2. PostCSS finds them → 3. Tailwind generates only the CSS you used → 4. Result: ~6KB CSS instead of 100KB+

---

### 2.5 Framer Motion

**What it is:** An animation library for React. Makes it easy to add smooth animations, transitions, and gestures.

**Key Concepts Used:**

```tsx
// 1. MOUNT ANIMATION — element fades in and slides up when it appears
<motion.div
  initial={{ opacity: 0, y: 20 }}    // Start: invisible, 20px below
  animate={{ opacity: 1, y: 0 }}      // End: visible, at normal position
  transition={{ delay: 0.3 }}         // Wait 0.3s before starting
>

// 2. EXIT ANIMATION — smooth transition between quiz questions
<AnimatePresence mode="wait">
  <motion.div
    key={currentQ}                     // Unique key triggers animation on change
    initial={{ opacity: 0, x: 20 }}    // Slide in from right
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}      // Slide out to left
  >

// 3. HOVER/TAP — micro-interactions on quiz options
<motion.button
  whileHover={{ scale: 1.01 }}         // Slightly grow on hover
  whileTap={{ scale: 0.99 }}           // Slightly shrink on click
>

// 4. ANIMATED VALUES — score circle progress
<motion.circle
  initial={{ strokeDasharray: '0 100' }}
  animate={{ strokeDasharray: `${percentage} 100` }}
  transition={{ delay: 0.5, duration: 1 }}
/>
```

**Where each animation type is used:**
- **Page transitions**: Dashboard, QuizList, Leaderboard (fade + slide up on load)
- **Question transitions**: QuizPlay (slide left/right between questions)
- **Micro-interactions**: QuizCard hover, QuizPlay option buttons
- **Data visualization**: Dashboard charts (bars animate from 0 to value), Result page (score circle fills up)
- **Navbar**: Slides down from top on page load

---

### 2.6 Node.js

**What it is:** A JavaScript runtime that lets you run JavaScript OUTSIDE the browser — on a server. Built on Chrome's V8 engine.

**Why it's needed:**
- Browsers can only run JavaScript on the client side (user's computer)
- Servers need to handle databases, file systems, authentication — Node.js enables this
- Same language (JavaScript/TypeScript) on both frontend AND backend

**Key Node.js Concepts Used:**

| Concept | Explanation |
|---------|------------|
| **Event Loop** | Node.js is single-threaded but handles many connections via async I/O. When a database query runs, Node doesn't wait — it handles other requests and gets a callback when the query finishes. |
| **npm (Node Package Manager)** | Installs third-party libraries. `npm install` reads `package.json` and downloads dependencies into `node_modules/`. |
| **Modules** | Code is organized into files. `import/export` (ES Modules) or `require/module.exports` (CommonJS) share code between files. |
| **process.env** | Access environment variables (secrets like API keys, database URLs). Read from `.env` files. |

---

### 2.7 Express.js (v4)

**What it is:** The most popular web framework for Node.js. It handles HTTP requests and responses — it's the "server" in our backend.

**Core Concepts:**

```typescript
// 1. CREATE APP
const app = express();

// 2. MIDDLEWARE — functions that run on EVERY request
app.use(cors());          // Allow cross-origin requests
app.use(express.json());  // Parse JSON request bodies

// 3. ROUTES — define API endpoints
app.get('/api/quizzes', handler);       // GET = read data
app.post('/api/auth/login', handler);   // POST = send/create data

// 4. ROUTE HANDLERS — functions that process requests
async (req, res) => {
  // req = incoming request (headers, body, params)
  // res = outgoing response (send JSON, status codes)
  const quizzes = await prisma.quiz.findMany();
  res.json(quizzes);  // Send JSON response
}

// 5. ROUTER — group related routes
const router = Router();
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);    // :id is a URL parameter
app.use('/api/quizzes', router);    // Mount at /api/quizzes

// 6. LISTEN — start the server
app.listen(5000, () => console.log('Server running on port 5000'));
```

**Request-Response Lifecycle:**
```
Client Request → CORS Middleware → JSON Parser → Route Matcher → Auth Middleware (if protected) → Route Handler → Database Query → JSON Response
```

**HTTP Status Codes Used:**
| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful GET, login |
| `201` | Created | Successful registration, quiz attempt |
| `400` | Bad Request | Invalid input (validation error) |
| `401` | Unauthorized | No token, invalid credentials |
| `403` | Forbidden | Expired/invalid token |
| `404` | Not Found | Quiz/user doesn't exist |
| `500` | Internal Server Error | Unhandled server error |

---

### 2.8 Prisma ORM (v5)

**What it is:** An ORM (Object-Relational Mapping) for Node.js. It lets you interact with databases using TypeScript/JavaScript instead of raw SQL.

**Why ORM over raw SQL?**
```sql
-- Raw SQL — error-prone, no type safety, SQL injection risk
SELECT q.*, COUNT(a.id) as attempt_count
FROM quizzes q LEFT JOIN quiz_attempts a ON q.id = a.quiz_id
GROUP BY q.id ORDER BY q.created_at DESC;
```
```typescript
// Prisma — type-safe, auto-complete, SQL injection impossible
const quizzes = await prisma.quiz.findMany({
  include: { _count: { select: { attempts: true } } },
  orderBy: { createdAt: 'desc' },
});
// TypeScript knows quizzes is Quiz[] with _count.attempts: number
```

**Prisma Components:**

| Component | File | Purpose |
|-----------|------|---------|
| **Schema** | `prisma/schema.prisma` | Defines database tables, columns, and relationships |
| **Migrations** | `prisma/migrations/` | SQL files that create/modify tables (version control for DB) |
| **Client** | `@prisma/client` | Auto-generated TypeScript client with type-safe queries |
| **Seed** | `prisma/seed.ts` | Script to populate the database with initial data |

**Key Prisma Operations Used:**

```typescript
// CREATE — insert a new row
await prisma.user.create({ data: { email, username, password } });

// FIND ONE — get a single row
await prisma.user.findUnique({ where: { email: 'demo@quizai.com' } });

// FIND MANY — get multiple rows
await prisma.quiz.findMany({ orderBy: { createdAt: 'desc' } });

// INCLUDE — join related tables (like SQL JOIN)
await prisma.quiz.findMany({
  include: {
    questions: true,                                    // Include all questions
    createdBy: { select: { username: true } },          // Include only username
    _count: { select: { attempts: true } },             // Count attempts
  },
});

// UPSERT — create if doesn't exist, update if it does
await prisma.user.upsert({
  where: { email: 'demo@quizai.com' },
  update: {},
  create: { email, username, password },
});
```

---

### 2.9 SQLite

**What it is:** A lightweight, file-based relational database. The entire database is stored in a single file (`dev.db`).

**SQLite vs MongoDB vs PostgreSQL:**

| Feature | SQLite | MongoDB | PostgreSQL |
|---------|--------|---------|------------|
| Type | Relational (SQL) | Document (NoSQL) | Relational (SQL) |
| Storage | Single file | Server process | Server process |
| Setup | Zero config | Install + run server | Install + run server |
| Best for | Dev/small apps | Flexible schemas | Production apps |
| Relationships | Native (JOIN) | Manual ($lookup) | Native (JOIN) |

**Why SQLite for this project?**
- Zero setup — no database server to install or run
- Perfect for development and portfolio projects
- Data stored in `server/prisma/dev.db` — can be deleted and recreated with one command
- Easily swappable to PostgreSQL for production (just change `provider` and `DATABASE_URL` in schema.prisma)

---

### 2.10 JSON Web Tokens (JWT)

**What it is:** A compact, URL-safe token format for securely transmitting claims between client and server.

**How JWT Authentication Works in This Project:**

```
STEP 1: USER LOGS IN
─────────────────────
Client sends: POST /api/auth/login { email: "...", password: "..." }
Server verifies password → creates JWT → sends it back
JWT = eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjbHh...

STEP 2: CLIENT STORES TOKEN
────────────────────────────
localStorage.setItem('quizai_token', token);

STEP 3: CLIENT SENDS TOKEN ON EVERY REQUEST
────────────────────────────────────────────
Headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9..." }
(This is done automatically by the Axios interceptor)

STEP 4: SERVER VERIFIES TOKEN
──────────────────────────────
jwt.verify(token, JWT_SECRET) → { userId: "clx..." }
If valid → allow request
If invalid/expired → 401/403 error
```

**JWT Structure (3 parts separated by dots):**
```
HEADER.PAYLOAD.SIGNATURE

Header:    { "alg": "HS256", "typ": "JWT" }     — algorithm used
Payload:   { "userId": "clx...", "iat": 123... } — data stored in token
Signature: HMACSHA256(header + payload, SECRET)   — ensures token wasn't tampered
```

**Important:** JWTs are **signed**, not **encrypted**. Anyone can decode the payload. The signature only proves the server created it.

---

### 2.11 bcrypt (bcryptjs)

**What it is:** A password hashing library. It converts passwords into irreversible hashes.

**Why not store passwords directly?**
```
❌ Database stores: "demo123"           → If database leaks, all passwords exposed
✅ Database stores: "$2a$12$K8Y..." → If database leaks, passwords are unreadable
```

**How it works:**
```typescript
// HASHING (during registration)
const hashed = await bcrypt.hash('demo123', 12);
// Result: "$2a$12$K8Y5p3...." (different every time due to random salt)
// The "12" is the salt rounds (cost factor) — higher = slower + more secure

// COMPARING (during login)
const isMatch = await bcrypt.compare('demo123', '$2a$12$K8Y5p3...');
// Returns true or false — bcrypt extracts the salt from the hash and re-hashes
```

**Salt:** A random value added before hashing. Even if two users have the same password, their hashes will be different.

---

### 2.12 Zod

**What it is:** A TypeScript-first schema validation library. It validates that incoming data matches expected shapes.

**Why validate input?**
Without validation, a user could send `{ email: 123, password: null }` and cause database errors or security issues.

```typescript
// DEFINE SCHEMA — what valid data looks like
const registerSchema = z.object({
  email: z.string().email(),           // Must be a valid email format
  username: z.string().min(3).max(30), // 3-30 characters
  password: z.string().min(6),         // At least 6 characters
});

// VALIDATE — throws ZodError if invalid
const { email, username, password } = registerSchema.parse(req.body);
// If req.body = { email: "bad", username: "ab", password: "12" }
// Throws: "Invalid email", "String must contain at least 3 character(s)", etc.
```

**Where used:** `routes/auth.ts` — validates registration and login request bodies.

---

### 2.13 Google Gemini AI

**What it is:** Google's latest family of AI models. `gemini-2.0-flash` is a fast, free-tier model used for generating quiz questions.

**How AI Generation Works in This Project:**

```typescript
// 1. Initialize the client with API key
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// 2. Send a structured prompt
const prompt = `Generate 5 multiple-choice questions about "React Hooks" at medium difficulty.
Return ONLY valid JSON in this format: [{ "text": "...", "options": [...], "correctAnswer": 0, "explanation": "..." }]`;

// 3. Get and parse the response
const result = await model.generateContent(prompt);
const text = result.response.text();
const questions = JSON.parse(text.match(/\[[\s\S]*\]/)[0]); // Extract JSON array

// 4. Validate and sanitize (prevent malicious/malformed output)
questions.map(q => ({
  text: String(q.text).slice(0, 500),           // Limit length
  options: q.options.slice(0, 4),               // Max 4 options
  correctAnswer: Math.min(Math.max(q.correctAnswer, 0), 3), // Clamp 0-3
}));
```

**Fallback Mechanism:** If no API key is configured (or key is invalid), the app generates template-based questions so the feature still works.

---

### 2.14 Axios

**What it is:** An HTTP client library for making API requests from the browser (or Node.js).

**Axios vs fetch():**
```typescript
// fetch (built-in) — more verbose
const res = await fetch('/api/quizzes', {
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
});
if (!res.ok) throw new Error('Failed');
const data = await res.json();

// Axios — cleaner, with interceptors
const { data } = await api.get('/quizzes');
// Token is automatically added by the interceptor!
```

**Interceptors (Key Feature Used):**
```typescript
// REQUEST INTERCEPTOR — runs before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('quizai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE INTERCEPTOR — runs after every response
api.interceptors.response.use(
  (res) => res,                    // Success: pass through
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('quizai_token');
      window.location.href = '/login';  // Auto-redirect on expired token
    }
    return Promise.reject(error);
  }
);
```

---

### 2.15 Concurrently

**What it is:** An npm package that runs multiple commands simultaneously.

```json
"dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""
```

This starts BOTH the backend server (port 5000) AND the frontend dev server (port 3000) with a single `npm run dev` command. Output from both is shown in the same terminal with `[0]` and `[1]` prefixes.

---

## 3. Project Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐   │
│  │ Landing  │  │Dashboard │  │ QuizPlay │  │   AI Gen  │   │
│  │  Page    │  │  Page    │  │  Page    │  │   Page    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘   │
│       │              │              │               │        │
│  ┌────┴──────────────┴──────────────┴───────────────┴───┐    │
│  │              AuthContext (State Management)           │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────────────┴───────────────────────────────┐    │
│  │              API Service (Axios + Interceptors)       │    │
│  └──────────────────────┬───────────────────────────────┘    │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP Requests (JSON)
                          │ Authorization: Bearer <JWT>
┌─────────────────────────┼───────────────────────────────────┐
│                    SERVER (Express)                           │
│                         │                                    │
│  ┌──────────────────────┴───────────────────────────────┐    │
│  │              Middleware (CORS, JSON Parser, Auth)      │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         │                                    │
│  ┌──────────┐  ┌───────┴──┐  ┌──────────┐  ┌───────────┐   │
│  │  Auth    │  │  Quiz    │  │ Leader-  │  │    AI     │   │
│  │ Routes   │  │  Routes  │  │  board   │  │  Routes   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘   │
│       │              │              │               │        │
│  ┌────┴──────────────┴──────────────┴───────────────┴───┐    │
│  │              Prisma ORM (Database Client)             │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────────────┴───────────────────────────────┐    │
│  │              SQLite Database (dev.db)                  │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Google Gemini AI (External API)          │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Example (User Takes a Quiz):

```
1. User clicks "Start Quiz"
   └→ React component calls api.get('/quizzes/abc123')
      └→ Axios interceptor adds JWT token to header
         └→ Vite proxy forwards to localhost:5000/api/quizzes/abc123
            └→ Express matches route /:id
               └→ Auth not required (no middleware)
                  └→ Prisma queries: SELECT * FROM Quiz WHERE id='abc123' + JOIN questions
                     └→ SQLite returns data from dev.db
                        └→ Express sends JSON response
                           └→ React receives data, calls setQuiz(data)
                              └→ Component re-renders with quiz data
```

---

## 4. Folder Structure — Every File Explained

```
quiz app/
├── package.json              # Root: defines npm scripts (dev, build, setup)
├── .env.example              # Template showing required environment variables
├── .gitignore                # Files Git should ignore (node_modules, .env, *.db)
├── README.md                 # Project documentation
│
├── server/                   # ─── BACKEND ───
│   ├── package.json          # Server dependencies & scripts
│   ├── tsconfig.json         # TypeScript compiler configuration
│   ├── .env                  # Secret configuration (API keys, DB URL, JWT secret)
│   │
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema (tables, columns, relationships)
│   │   ├── seed.ts           # Script to insert initial quiz data
│   │   ├── dev.db            # SQLite database file (auto-generated)
│   │   └── migrations/       # SQL migration files (auto-generated)
│   │
│   └── src/
│       ├── index.ts          # Server entry point (creates Express app, mounts routes)
│       ├── middleware/
│       │   └── auth.ts       # JWT verification middleware & token generator
│       └── routes/
│           ├── auth.ts       # POST /register, POST /login, GET /me
│           ├── quiz.ts       # GET /quizzes, GET /:id, POST /:id/attempt, user stats
│           ├── leaderboard.ts # GET /leaderboard
│           └── ai.ts         # POST /ai/generate (Gemini AI integration)
│
└── client/                   # ─── FRONTEND ───
    ├── package.json          # Client dependencies & scripts
    ├── tsconfig.json         # TypeScript configuration for React
    ├── vite.config.ts        # Vite dev server & build configuration
    ├── tailwind.config.js    # Tailwind CSS theme customization
    ├── postcss.config.js     # PostCSS plugins (Tailwind + Autoprefixer)
    ├── index.html            # HTML shell (loads fonts, mounts React)
    │
    └── src/
        ├── main.tsx          # React entry: mounts <App /> into #root div
        ├── App.tsx           # Root component: routing, auth provider, toast
        ├── index.css         # Global styles: Tailwind imports, scrollbar, selection
        │
        ├── types/
        │   └── index.ts      # TypeScript interfaces (User, Quiz, Question, etc.)
        │
        ├── services/
        │   └── api.ts        # Axios instance with interceptors (token, error handling)
        │
        ├── context/
        │   └── AuthContext.tsx # React Context for auth state (user, login, logout)
        │
        ├── components/
        │   ├── Navbar.tsx     # Top navigation bar with links & user menu
        │   ├── ProtectedRoute.tsx # Wrapper that redirects to /login if not authenticated
        │   ├── QuizCard.tsx   # Card component showing quiz preview in grid
        │   └── Timer.tsx      # Circular countdown timer with SVG animation
        │
        └── pages/
            ├── Landing.tsx    # Homepage hero section (shown when not logged in)
            ├── Login.tsx      # Login form
            ├── Register.tsx   # Registration form
            ├── Dashboard.tsx  # User stats, performance charts, quick actions
            ├── QuizList.tsx   # Browse all quizzes with search & filters
            ├── QuizPlay.tsx   # Quiz gameplay (questions, options, timer, nav)
            ├── QuizResult.tsx # Results page (score, answer review)
            ├── Leaderboard.tsx # Global ranking of users
            └── AIQuizGenerator.tsx # Form to generate AI-powered quizzes
```

---

## 5. Database Design (Prisma Schema)

### Entity-Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│     User     │       │     Quiz     │       │   Question   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │──┐    │ id (PK)      │
│ email (UQ)   │  │    │ title        │  │    │ text         │
│ username (UQ)│  ├───<│ createdById  │  ├───<│ quizId (FK)  │
│ password     │  │    │ description  │  │    │ options (JSON)│
│ createdAt    │  │    │ category     │  │    │ correctAnswer│
└──────────────┘  │    │ difficulty   │  │    │ explanation  │
                  │    │ timeLimit    │  │    └──────────────┘
                  │    │ isAIGenerated│  │
                  │    │ createdAt    │  │
                  │    └──────────────┘  │
                  │                      │
                  │    ┌──────────────┐  │
                  │    │ QuizAttempt  │  │
                  │    ├──────────────┤  │
                  │    │ id (PK)      │  │
                  └───<│ userId (FK)  │  │
                       │ quizId (FK)  │>─┘
                       │ score        │
                       │ totalQuestions│
                       │ timeTaken    │
                       │ answers (JSON)│
                       │ completedAt  │
                       └──────────────┘

PK = Primary Key   FK = Foreign Key   UQ = Unique
< = One-to-Many relationship
```

### Schema Explained Field by Field

**User:**
| Field | Type | Attribute | Purpose |
|-------|------|-----------|---------|
| id | String | `@id @default(cuid())` | Unique identifier, auto-generated CUID |
| email | String | `@unique` | Login credential, must be unique |
| username | String | `@unique` | Display name, must be unique |
| password | String | — | bcrypt hash (never stored in plain text) |
| createdAt | DateTime | `@default(now())` | Timestamp of registration |
| quizzes | Quiz[] | relation | All quizzes this user created |
| attempts | QuizAttempt[] | relation | All quizzes this user attempted |

**Quiz:**
| Field | Type | Purpose |
|-------|------|---------|
| id | String | Unique identifier |
| title | String | Quiz name shown in UI |
| description | String | Brief description |
| category | String | Grouping (Programming, Science, AI Generated) |
| difficulty | String | "easy", "medium", or "hard" |
| timeLimit | Int | Seconds allowed per question |
| isAIGenerated | Boolean | true if created by Gemini AI |
| createdById | String? | Foreign key to User (optional, nullable) |

**Question:**
| Field | Type | Purpose |
|-------|------|---------|
| text | String | The question text |
| options | String | JSON array of 4 answer choices: `'["A","B","C","D"]'` |
| correctAnswer | Int | 0-based index of correct option |
| explanation | String? | Why the answer is correct (shown after answering) |
| quizId | String | Foreign key linking to parent Quiz |

**QuizAttempt:**
| Field | Type | Purpose |
|-------|------|---------|
| score | Int | Number of correct answers |
| totalQuestions | Int | Total questions in the quiz |
| timeTaken | Int | Total seconds spent |
| answers | String | JSON array of user's selected indices: `'[2,1,0,3]'` |
| userId | String | Who took the quiz |
| quizId | String | Which quiz was taken |
| completedAt | DateTime | When the attempt was submitted |

**CUID:** Collision-resistant Unique Identifier — like UUID but shorter, URL-safe, and sortable by creation time. Example: `cm3x7k9q40001...`

**Cascade Delete:** `onDelete: Cascade` on Question and QuizAttempt means: when a Quiz is deleted, all its questions and attempts are automatically deleted too.

---

## 6. Backend Deep Dive

### 6.1 Server Entry Point (`src/index.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();  // Load .env file into process.env

export const prisma = new PrismaClient();  // Create database connection (exported for use in routes)

const app = express();

// MIDDLEWARE CHAIN (executed in order for every request):
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],  // Allowed frontend origins
  credentials: true  // Allow cookies/auth headers
}));
app.use(express.json());  // Parse JSON request body into req.body

// MOUNT ROUTE GROUPS
app.use('/api/auth', authRoutes);         // /api/auth/login, /api/auth/register, etc.
app.use('/api/quizzes', quizRoutes);      // /api/quizzes, /api/quizzes/:id, etc.
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);            // /api/ai/generate

app.listen(PORT);  // Start listening for connections
```

**Key Concepts:**
- `export const prisma` — single database connection shared across all routes (Singleton pattern)
- `cors()` — Cross-Origin Resource Sharing: without this, browsers block requests from localhost:3000 to localhost:5000
- `express.json()` — without this, `req.body` would be `undefined` for POST requests

---

### 6.2 Authentication Middleware (`middleware/auth.ts`)

```typescript
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  // 1. Extract token from "Authorization: Bearer <token>" header
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // 2. Reject if no token
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  // 3. Verify token signature and expiration
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;  // Attach userId to request for route handlers
    next();  // Continue to the actual route handler
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}
```

**How middleware works in Express:**
```
Request → middleware1(req, res, next) → middleware2(req, res, next) → routeHandler(req, res)
                                    ↑
                            next() passes control
                            to the next function
```

If a middleware does NOT call `next()`, the request stops there (e.g., returning 401).

**Usage on routes:**
```typescript
// Public route (no middleware):
router.get('/', getAllQuizzes);

// Protected route (auth middleware):
router.post('/:id/attempt', authenticateToken, submitAttempt);
//                           ↑ runs first, adds req.userId
```

---

### 6.3 Auth Routes (`routes/auth.ts`)

**POST /api/auth/register**
```
1. Validate input with Zod (email format, username 3-30 chars, password 6+ chars)
2. Check if email or username already exists → 400 error if yes
3. Hash password with bcrypt (12 salt rounds)
4. Create user in database
5. Generate JWT token
6. Return { token, user: { id, email, username } }
```

**POST /api/auth/login**
```
1. Validate input with Zod
2. Find user by email → 401 "Invalid credentials" if not found
3. Compare password with stored hash → 401 if wrong
4. Generate JWT token (expires in 7 days)
5. Return { token, user: { id, email, username } }
```

**GET /api/auth/me** (Protected)
```
1. authenticateToken middleware extracts userId from JWT
2. Find user by id, select only safe fields (not password!)
3. Return user object
```

---

### 6.4 Quiz Routes (`routes/quiz.ts`)

**CRITICAL: Route Ordering**
```
/user/history  ← Defined FIRST (specific routes)
/user/stats    ← Defined SECOND
/:id           ← Defined LAST (catch-all parameter route)
```

Express matches routes top-to-bottom. If `/:id` came first, a request to `/user/stats` would match `/:id` with `id = "user"` and never reach the actual stats route.

**GET /api/quizzes** — List all quizzes with question count and attempt count
**GET /api/quizzes/user/stats** — Calculate user statistics:
```typescript
// Aggregation logic:
const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
const avgScore = Math.round((totalScore / totalQuestions) * 100);

// Category breakdown using Map:
const categoryMap = new Map<string, { total: number; correct: number }>();
attempts.forEach((a) => {
  const cat = a.quiz.category;
  const existing = categoryMap.get(cat) || { total: 0, correct: 0 };
  existing.total += a.totalQuestions;
  existing.correct += a.score;
  categoryMap.set(cat, existing);
});
```

**POST /api/quizzes/:id/attempt** — Submit quiz answers:
```typescript
// Score calculation:
quiz.questions.forEach((question, index) => {
  if (parsedAnswers[index] === question.correctAnswer) {
    score++;
  }
});
```

---

### 6.5 Leaderboard Route (`routes/leaderboard.ts`)

**GET /api/leaderboard** — Global ranking:
```
1. Fetch all users with their attempts
2. For each user: calculate total score, total questions, average accuracy
3. Filter out users with 0 attempts
4. Sort by total score (descending)
5. Return top 50
```

**Key Pattern — `.filter()` with type guard:**
```typescript
.filter((entry): entry is NonNullable<typeof entry> => entry !== null)
// This tells TypeScript: after filtering, entries are guaranteed non-null
// Without this, TypeScript would complain about possible null values
```

---

### 6.6 AI Generation Route (`routes/ai.ts`)

**POST /api/ai/generate** (Protected)

**Input Sanitization:**
```typescript
const sanitizedTopic = topic.trim().slice(0, 100);      // Limit to 100 chars
const clampedQuestions = Math.min(Math.max(num, 3), 10); // Clamp between 3-10
const validDifficulty = ['easy','medium','hard'].includes(difficulty) ? difficulty : 'medium';
```

**Output Sanitization (from AI response):**
```typescript
return questions.map(q => ({
  text: String(q.text || '').slice(0, 500),     // Force string, limit length
  options: q.options.slice(0, 4).map(o => String(o).slice(0, 200)),
  correctAnswer: Math.min(Math.max(q.correctAnswer, 0), 3),  // Clamp 0-3
}));
```

**Fallback Strategy:** If no API key → generate template-based questions about the topic. This ensures the feature works even without AI setup.

---

### 6.7 Database Seeding (`prisma/seed.ts`)

The seed script is run via `npx prisma db seed` and creates:
- 1 demo user (email: demo@quizai.com, password: demo123)
- 6 quizzes with 5-8 questions each across categories: JavaScript, React, Python, Data Science, System Design, General Science

**Prisma `upsert`** is used for the demo user — "create if doesn't exist, skip if already exists". This makes the seed script safe to run multiple times.

---

## 7. Frontend Deep Dive

### 7.1 Entry Point & Routing (`main.tsx` → `App.tsx`)

**Mounting the App:**
```tsx
// main.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>    {/* Enables additional development warnings */}
    <App />
  </React.StrictMode>
);
```

**Routing with React Router:**
```tsx
// App.tsx
<BrowserRouter>           {/* Enables client-side routing (URL changes without page reload) */}
  <AuthProvider>          {/* Wraps entire app with auth state */}
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>  {/* Wrapper: if not logged in → redirect to /login */}
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/quiz/:id" element={...} />   {/* :id is a URL parameter */}
      <Route path="*" element={<Navigate to="/" />} />  {/* Catch-all: redirect unknown URLs */}
    </Routes>
    <Toaster />           {/* Toast notification container */}
  </AuthProvider>
</BrowserRouter>
```

**How Client-Side Routing Works:**
- Traditional websites: clicking a link → browser requests a NEW HTML page from server
- React Router: clicking a link → JavaScript updates the URL AND swaps out the component, NO page reload
- The server always returns the same `index.html` — React handles which page to show based on URL

---

### 7.2 Auth Context — State Management (`AuthContext.tsx`)

**Problem:** Many components need the current user's data (Navbar, Dashboard, QuizPlay, etc.). Passing it through props every level would be messy ("prop drilling").

**Solution:** React Context creates a "global" data store that any component can access.

```tsx
// CREATE the context
const AuthContext = createContext<AuthContextType | null>(null);

// PROVIDE the context (wraps entire app)
function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // On app load: check localStorage for saved session
  useEffect(() => {
    const savedToken = localStorage.getItem('quizai_token');
    const savedUser = localStorage.getItem('quizai_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('quizai_token', data.token);
    localStorage.setItem('quizai_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('quizai_token');
    localStorage.removeItem('quizai_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// CONSUME the context (in any child component)
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// USAGE in a component:
function Navbar() {
  const { user, logout } = useAuth();  // Access auth state anywhere!
}
```

**Why Context instead of Redux?**
- Redux adds significant boilerplate (actions, reducers, store, selectors)
- For auth state (small, rarely changes), Context is simpler and sufficient
- Redux is better for complex state with many updates (e.g., real-time chat, collaborative editing)

---

### 7.3 API Service Layer (`services/api.ts`)

```typescript
const api = axios.create({ baseURL: '/api' });

// Automatically add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('quizai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Automatically handle expired sessions
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('quizai_token');
      window.location.href = '/login';  // Force redirect
    }
    return Promise.reject(error);
  }
);
```

**Why a centralized API service?**
- Without it: every component would need to manually add the token, handle 401s, set base URL
- With it: `api.get('/quizzes')` just works — token attached, errors handled

---

### 7.4 Components

**Navbar.tsx** — Sticky navigation bar
- Uses `useLocation()` to highlight the active nav item
- Shows user avatar (first letter of username) and logout button when logged in
- Shows "Sign In" button when logged out
- Responsive: horizontal scroll on mobile

**ProtectedRoute.tsx** — Route guard
```tsx
// If loading → show spinner
// If user exists → render children (the protected page)
// If no user → redirect to /login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <>{children}</> : <Navigate to="/login" />;
}
```

**QuizCard.tsx** — Quiz preview card
- Displays: title, category, difficulty badge, time limit, question count, attempt count
- Color-coded difficulty badges (green/amber/red)
- AI-generated quizzes get a sparkle "AI" badge
- Hover effect: border glow, "Start Quiz →" text appears

**Timer.tsx** — Circular countdown timer
- SVG circle with `strokeDasharray` animation (ring fills counterclockwise)
- Turns red and pulses when ≤5 seconds remain
- Calls `onTimeUp` callback when timer reaches 0
- Resets when `duration` prop changes (new question)

---

### 7.5 Pages

**Landing.tsx** — Marketing homepage
- Hero section with gradient text and CTA buttons
- Feature grid (AI Generation, Real-time Feedback, Leaderboard, Rich Library)
- Tech stack badges
- Redirects to /dashboard if already logged in

**Login.tsx / Register.tsx** — Auth forms
- Glassmorphism card with animated background blobs
- Input fields with icons (Mail, Lock, User)
- Form validation (HTML5 `required`, `minLength`)
- Error display with animated red banner
- Loading state with spinner inside button
- Link to switch between login/register
- Demo credentials shown at bottom

**Dashboard.tsx** — Analytics dashboard
- **Stats grid**: Quizzes Taken, Avg. Score, Questions Answered, Streak
- **Performance chart**: Bar chart of last 7 attempts (colored by score: green ≥80, amber ≥50, red <50)
- **Category breakdown**: Progress bars showing accuracy per category
- **Quick actions**: Links to Browse Quizzes and AI Generate

**QuizList.tsx** — Quiz browser
- Search bar (filters by title and description)
- Category filter buttons (dynamically generated from quiz data)
- Difficulty filter buttons (Easy, Medium, Hard)
- Grid of QuizCard components
- Empty state when no quizzes match filters

**QuizPlay.tsx** — Quiz gameplay (most complex page)
```
States: Loading → Pre-Start Screen → Playing → Submitting → Result Page

Pre-Start Screen:
  Shows: title, description, time limit, difficulty, question count
  "Start Quiz" button → sets started=true, records start time

Playing State:
  - Progress bar (animated width based on current question / total)
  - Timer component (resets per question via key={currentQ})
  - Question text with 4 clickable option buttons
  - Option states: default → selected (violet) → correct (green) / incorrect (red)
  - Explanation panel (appears after answering)
  - Navigation: Previous / Next buttons + question dots
  - Time-up handler: auto-advance to next question

Submitting:
  - Calculates total time (Date.now() - startTimeRef)
  - POSTs answers array to /api/quizzes/:id/attempt
  - Navigates to result page with state (attempt data, quiz, answers)
```

**QuizResult.tsx** — Results page
- Animated score circle (SVG fills to percentage)
- Grade label based on score (Excellent ≥90, Great ≥70, Good ≥50, Keep Practicing <50)
- Stats row: Correct count, Time taken, Difficulty
- Answer review: each question shown with ✅ or ❌, user's answer vs correct, explanation
- Action buttons: Retry quiz, Browse more quizzes

**Leaderboard.tsx** — Global ranking
- Crown/medal icons for top 3
- User avatar (first letter), username, quizzes completed, accuracy %, total score
- Color-coded rows for top 3 (gold, silver, bronze backgrounds)

**AIQuizGenerator.tsx** — AI quiz generation form
- Topic input with quick-suggestion chips (Quantum Computing, Blockchain, etc.)
- Difficulty selector (3 color-coded buttons)
- Question count slider (3-10, range input)
- Info box explaining how AI generation works
- Loading state with spinner during generation
- On success: navigates to the generated quiz's play page

---

## 8. Authentication Flow — End to End

```
REGISTRATION FLOW:
══════════════════

┌─ Browser ─────────────────────────────────────────────────────────────┐
│                                                                        │
│  1. User fills form (username, email, password)                       │
│  2. handleSubmit() called → validates form                            │
│  3. Calls authContext.register(email, username, password)             │
│     └→ api.post('/auth/register', { email, username, password })      │
│                                                                        │
└──────────┬─────────────────────────────────────────────────────────────┘
           │ POST /api/auth/register
           │ Body: { "email": "...", "username": "...", "password": "..." }
           ▼
┌─ Server ──────────────────────────────────────────────────────────────┐
│                                                                        │
│  4. express.json() parses body → req.body available                   │
│  5. Zod validates: email format? username 3-30 chars? password 6+?   │
│  6. Prisma checks: does email/username already exist?                 │
│  7. bcrypt.hash("password", 12) → "$2a$12$..."                       │
│  8. prisma.user.create({ email, username, password: hashedPassword }) │
│  9. jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' })       │
│  10. Response: { token: "eyJ...", user: { id, email, username } }     │
│                                                                        │
└──────────┬─────────────────────────────────────────────────────────────┘
           │ 201 Created
           │ { token: "eyJ...", user: {...} }
           ▼
┌─ Browser ─────────────────────────────────────────────────────────────┐
│                                                                        │
│  11. localStorage.setItem('quizai_token', data.token)                 │
│  12. localStorage.setItem('quizai_user', JSON.stringify(data.user))   │
│  13. setUser(data.user) → triggers re-render                         │
│  14. App.tsx: user exists → <Navigate to="/dashboard" />              │
│  15. toast.success('Account created!')                                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

SUBSEQUENT REQUESTS:
════════════════════

  api.get('/quizzes/user/stats')
    └→ Axios interceptor reads localStorage → adds header:
       Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
    └→ Server: authenticateToken() verifies → req.userId = "clx..."
    └→ Route handler uses req.userId to query user's data
```

---

## 9. Quiz Flow — End to End

```
┌─ QuizList.tsx ─────────────────────────┐
│ User clicks on a QuizCard              │
│ → Link to="/quiz/cm3x7k9q40001"       │
└───────────┬────────────────────────────┘
            │ URL changes (no page reload)
            ▼
┌─ QuizPlay.tsx ─────────────────────────┐
│ useEffect: api.get('/quizzes/cm3x..') │
│ → Server returns quiz + questions      │
│ → setQuiz(data)                        │
│ → setAnswers([null, null, null, ...])  │
│                                         │
│ PRE-START SCREEN shown                 │
│ User clicks "Start Quiz"              │
│ → setStarted(true)                     │
│ → startTimeRef.current = Date.now()    │
│                                         │
│ QUESTION 1 shown                       │
│ Timer starts counting down             │
│ User clicks option B                   │
│ → setSelectedAnswer(1)                 │
│ → setIsAnswered(true)                  │
│ → answers[0] = 1                       │
│ → Options show correct/incorrect       │
│ → Explanation appears                  │
│                                         │
│ User clicks "Next"                     │
│ → setCurrentQ(1)                       │
│ → AnimatePresence slides question out  │
│ → New question slides in               │
│ → Timer resets (key={currentQ})         │
│                                         │
│ ... repeat for all questions ...       │
│                                         │
│ LAST QUESTION answered                 │
│ User clicks "Finish Quiz"             │
│ → timeTaken = (Date.now() - start)/1000│
│ → api.post('/quizzes/cm3x../attempt',  │
│     { answers: [1,2,0,3,...],          │
│       timeTaken: 142 })                │
│                                         │
│ → Server calculates score              │
│ → Returns { score: 6, total: 8, ... } │
│                                         │
│ → navigate('/quiz/cm3x../result',      │
│     { state: { attempt, quiz, answers}})│
└───────────┬────────────────────────────┘
            ▼
┌─ QuizResult.tsx ───────────────────────┐
│ Reads data from location.state         │
│ Calculates percentage, grade           │
│ Renders animated score circle          │
│ Shows answer review for each question  │
└────────────────────────────────────────┘
```

---

## 10. AI Quiz Generation — End to End

```
┌─ AIQuizGenerator.tsx ──────────────────┐
│ User types: "Quantum Computing"        │
│ Selects: medium difficulty, 5 questions│
│ Clicks "Generate Quiz"                 │
│ → setGenerating(true) → spinner shown  │
│ → api.post('/ai/generate', {           │
│     topic: "Quantum Computing",        │
│     difficulty: "medium",              │
│     numQuestions: 5 })                 │
└───────────┬────────────────────────────┘
            │
            ▼
┌─ Server: routes/ai.ts ────────────────┐
│ 1. Sanitize input:                     │
│    topic → trim, slice(0,100)          │
│    numQuestions → clamp 3-10           │
│    difficulty → validate enum          │
│                                         │
│ 2. Check if GEMINI_API_KEY exists      │
│    ├─ YES → call Gemini AI             │
│    └─ NO → use fallback templates      │
│                                         │
│ 3. GEMINI AI CALL:                     │
│    Prompt: "Generate 5 MCQ about       │
│    Quantum Computing at medium         │
│    difficulty. Return JSON..."         │
│                                         │
│    AI Response (raw text):             │
│    ```json                              │
│    [{"text": "What is superposition?", │
│      "options": ["A", "B", "C", "D"],  │
│      "correctAnswer": 1,              │
│      "explanation": "..."}]            │
│    ```                                  │
│                                         │
│ 4. Extract JSON with regex:            │
│    text.match(/\[[\s\S]*\]/)           │
│                                         │
│ 5. Parse + sanitize each question      │
│                                         │
│ 6. Save to database:                   │
│    prisma.quiz.create({                │
│      data: {                            │
│        title: "AI Quiz: Quantum...",   │
│        isAIGenerated: true,            │
│        questions: { create: [...] },   │
│      }                                  │
│    })                                   │
│                                         │
│ 7. Return created quiz with ID         │
└───────────┬────────────────────────────┘
            │ 201 Created
            │ { id: "cm3xy...", title: "AI Quiz: ...", ... }
            ▼
┌─ AIQuizGenerator.tsx ──────────────────┐
│ toast.success('Quiz generated!')       │
│ navigate('/quiz/cm3xy...')             │
│ → User lands on QuizPlay pre-start    │
└────────────────────────────────────────┘
```

---

## 11. Configuration Files Explained

### `package.json` (Root)
```json
{
  "scripts": {
    "dev": "concurrently ...",     // Run server + client simultaneously
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "cd client && npm run build",   // Production build
    "install:all": "npm install && cd server && npm install && cd ../client && npm install",
    "db:setup": "cd server && npx prisma migrate dev --name init && npx prisma db seed",
    "setup": "npm run install:all && npm run db:setup"   // One-command full setup
  }
}
```

### `tsconfig.json` (Server)
```json
{
  "compilerOptions": {
    "target": "ES2022",           // Compile to modern JavaScript
    "module": "commonjs",         // Use require/module.exports (Node.js standard)
    "strict": true,               // Enable all strict type checks
    "esModuleInterop": true,      // Allow import express from 'express' syntax
    "outDir": "./dist",           // Output compiled JS here
    "rootDir": "./src",           // Source TypeScript files
    "skipLibCheck": true          // Skip type checking of node_modules (faster)
  }
}
```

### `tsconfig.json` (Client)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",           // Use import/export (browser standard)
    "moduleResolution": "bundler", // Let Vite handle module resolution
    "jsx": "react-jsx",           // Enable JSX without importing React in every file
    "noEmit": true,               // Don't compile — Vite does that; just type-check
    "isolatedModules": true       // Required for Vite (each file compiled independently)
  }
}
```

### `postcss.config.js`
```js
export default {
  plugins: {
    tailwindcss: {},     // Process @tailwind directives
    autoprefixer: {},    // Add vendor prefixes (-webkit-, -moz-) for browser compatibility
  },
};
```

### `.env` (Server)
```
PORT=5000                              # Express server port
JWT_SECRET=quizai-dev-secret-key-2024  # Secret for signing JWTs
DATABASE_URL="file:./dev.db"           # SQLite database file path
GEMINI_API_KEY=AIza...                 # Google Gemini API key
```

### `.gitignore`
```
node_modules/     # Dependencies (reinstalled via npm install)
dist/             # Build output (regenerated via npm run build)
build/            # Alternative build folder
.env              # Secrets (NEVER commit to Git!)
*.db              # Database file (regenerated via prisma migrate)
*.db-journal      # SQLite journal file
```

---

## 12. Security Practices

| Practice | Implementation | Why |
|----------|---------------|-----|
| **Password Hashing** | bcrypt with 12 salt rounds | Passwords stored as irreversible hashes |
| **JWT Authentication** | Signed tokens with expiry (7 days) | Stateless auth, no server-side sessions |
| **Input Validation** | Zod schemas on all auth inputs | Prevents malformed data from reaching DB |
| **Input Sanitization** | `.trim().slice(0, 100)` on AI input | Prevents oversized payloads |
| **Output Sanitization** | Clamp/limit AI-generated content | AI might return unexpected data |
| **SQL Injection Prevention** | Prisma ORM (parameterized queries) | Never concatenates user input into SQL |
| **CORS Configuration** | Whitelist specific origins | Only our frontend can access the API |
| **Secrets in .env** | JWT_SECRET, GEMINI_API_KEY in .env file | Secrets never committed to Git |
| **Password not returned** | `select: { password: false }` | API never sends password hash to client |
| **Token in header (not URL)** | `Authorization: Bearer <token>` | Tokens not logged in server access logs |

---

## 13. Key Programming Concepts Used

### REST API Design
```
REST = Representational State Transfer

Resources are nouns: /quizzes, /users, /leaderboard
HTTP methods are verbs:
  GET     = Read     (GET /api/quizzes)
  POST    = Create   (POST /api/auth/register)
  PUT     = Replace  (not used here)
  PATCH   = Update   (not used here)
  DELETE  = Delete   (not used here)

Endpoints return JSON. Errors have consistent format: { error: "message" }
```

### Async/Await
```typescript
// PROBLEM: Database queries take time. We can't freeze the server.
// SOLUTION: async/await — non-blocking I/O

async (req, res) => {
  const quiz = await prisma.quiz.findUnique({...});
  // JavaScript runs OTHER requests while waiting for the database
  // When DB responds → execution resumes here
  res.json(quiz);
}
```

### Array Methods (Functional Programming)
```typescript
// These are used extensively throughout the project:

.map()     // Transform each element → new array
.filter()  // Keep elements that match condition → new array
.reduce()  // Accumulate values into single result
.forEach() // Execute function for each element (no return)
.find()    // Get first element matching condition
.some()    // Check if any element matches
.slice()   // Get a portion of the array

// Example from leaderboard:
users
  .map(user => calculateStats(user))     // Transform to stats
  .filter(entry => entry !== null)       // Remove users with 0 attempts
  .sort((a, b) => b.totalScore - a.totalScore)  // Sort descending
  .slice(0, 50)                          // Take top 50
```

### React Hooks Pattern
```
useState   → "I need to remember a value that triggers re-render when changed"
useEffect  → "I need to do something after render (API call, timer, cleanup)"
useRef     → "I need to remember a value WITHOUT triggering re-render"
useContext → "I need to read shared state from a parent provider"
useParams  → "I need the :id from the URL (React Router hook)"
useNavigate → "I need to programmatically change the URL"
useLocation → "I need the current URL or state passed during navigation"
```

### Conditional Rendering Patterns
```tsx
// Ternary
{user ? <Dashboard /> : <Landing />}

// Short-circuit (render only if truthy)
{isAnswered && question.explanation && <Explanation />}

// Early return
if (loading) return <Spinner />;
if (!quiz) return <NotFound />;
return <QuizContent />;
```

### Component Composition
```tsx
// Small, focused components composed together:
<App>
  <AuthProvider>        {/* Provides auth state */}
    <BrowserRouter>     {/* Provides routing */}
      <Navbar />        {/* Always visible */}
      <Routes>
        <Route element={
          <ProtectedRoute>    {/* Auth gate */}
            <Dashboard />     {/* The actual page */}
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />       {/* Toast notification container */}
    </BrowserRouter>
  </AuthProvider>
</App>
```

---

## 14. Glossary of Every Term

| Term | Definition |
|------|-----------|
| **API** | Application Programming Interface — a set of HTTP endpoints that allow the frontend to communicate with the backend |
| **Async/Await** | JavaScript syntax for handling asynchronous operations (like database queries) without blocking execution |
| **Authentication** | Verifying WHO a user is (login) |
| **Authorization** | Verifying what a user CAN DO (permissions) |
| **Autoprefixer** | PostCSS plugin that adds browser-specific CSS prefixes (-webkit-, -moz-) |
| **Base URL** | The root address for all API calls (`/api`) — set once in Axios config |
| **bcrypt** | Password hashing algorithm that includes a salt |
| **Bearer Token** | A type of auth token sent in HTTP headers: `Authorization: Bearer <token>` |
| **Build** | Process of compiling, minifying, and bundling source code for production |
| **Callback** | A function passed as an argument to another function, called later |
| **CDN** | Content Delivery Network — serves static files from geographically distributed servers |
| **Client** | The frontend (browser) that users interact with |
| **Component** | A reusable piece of UI in React (function that returns JSX) |
| **Concurrently** | npm package to run multiple processes at once |
| **Context** | React mechanism for sharing state without prop drilling |
| **CORS** | Cross-Origin Resource Sharing — security mechanism browsers use to control which domains can access an API |
| **CUID** | Collision-Resistant Unique Identifier — shorter, URL-safe alternative to UUID |
| **CRUD** | Create, Read, Update, Delete — the four basic database operations |
| **Dependency** | A third-party package your project relies on (listed in package.json) |
| **Destructuring** | JavaScript syntax to extract values: `const { name, age } = user;` |
| **DOM** | Document Object Model — browser's representation of the HTML page |
| **Endpoint** | A specific URL path + HTTP method that the API responds to |
| **Environment Variable** | Configuration values stored outside code (in .env files) |
| **ESLint** | JavaScript linter that finds and reports code quality issues |
| **Express** | Node.js web framework for building APIs and servers |
| **Framer Motion** | React animation library |
| **Generics** | TypeScript feature allowing types to accept parameters: `useState<Quiz \| null>()` |
| **Git** | Version control system for tracking code changes |
| **Glassmorphism** | UI design trend: frosted-glass effect with backdrop-blur and transparency |
| **Hash** | One-way function that converts input to a fixed-length string (irreversible) |
| **HMR** | Hot Module Replacement — Vite updates the browser instantly when you save a file |
| **Hook** | React function (prefixed with `use`) that lets you use state and lifecycle features |
| **HTTP** | HyperText Transfer Protocol — how browsers and servers communicate |
| **Idempotent** | An operation that produces the same result no matter how many times you call it |
| **Interceptor** | Axios feature that runs code before/after every request/response |
| **Interface** | TypeScript construct defining the shape of an object |
| **JSX** | JavaScript XML — HTML-like syntax used in React components |
| **JWT** | JSON Web Token — compact, self-contained token for authentication |
| **Key Prop** | Unique identifier React uses to track list items and optimize re-renders |
| **Lazy Loading** | Loading resources only when needed (not upfront) |
| **localStorage** | Browser storage that persists data across sessions (5-10MB per domain) |
| **Middleware** | Express function that processes requests before they reach route handlers |
| **Migration** | SQL script that changes database structure (add/remove tables/columns) |
| **Minification** | Removing whitespace, comments, shortening variable names in production builds |
| **Module** | A file that exports functionality for other files to import |
| **Monorepo** | Single repository containing multiple projects (client + server) |
| **MVC** | Model-View-Controller — architectural pattern separating data, UI, and logic |
| **Node.js** | JavaScript runtime for running JS outside the browser |
| **npm** | Node Package Manager — installs and manages dependencies |
| **ORM** | Object-Relational Mapping — interact with databases using code instead of SQL |
| **Parameterized Query** | Database query where user input is passed as parameters (prevents SQL injection) |
| **PostCSS** | CSS transformation tool (Tailwind and Autoprefixer are PostCSS plugins) |
| **Prisma** | TypeScript-first ORM for Node.js |
| **Promise** | JavaScript object representing a future value (resolved or rejected) |
| **Prop** | Data passed from parent to child component in React |
| **Prop Drilling** | Passing props through many component levels — Context/Redux solves this |
| **Proxy** | Vite dev server forwards `/api` requests to the backend (avoids CORS issues) |
| **React** | JavaScript library for building component-based UIs |
| **React Router** | Library for client-side routing in React |
| **Regex** | Regular Expression — pattern matching for strings |
| **Re-render** | React recreates the component's output when state/props change |
| **REST** | Architectural style for APIs using HTTP methods on resources |
| **Route** | URL path mapped to a handler function (Express) or component (React Router) |
| **Salt** | Random data added before hashing to prevent rainbow table attacks |
| **Schema** | Definition of database structure (tables, columns, types, relationships) |
| **Seed** | Pre-populate a database with initial/test data |
| **Server** | The backend application that processes requests and serves data |
| **Singleton** | Pattern where only one instance exists (our Prisma client) |
| **SQLite** | Lightweight, file-based SQL database |
| **State** | Data that a React component "remembers" between renders |
| **Static Typing** | TypeScript checks types at compile time (before code runs) |
| **SVG** | Scalable Vector Graphics — XML-based image format (used for Timer circle) |
| **Tailwind CSS** | Utility-first CSS framework (classes like `bg-violet-600 text-white px-4`) |
| **Template Literal** | JavaScript string with embedded expressions: `` `Hello ${name}` `` |
| **Toast** | Small popup notification (success, error messages) |
| **Token** | A string representing authentication credentials |
| **Tree-shaking** | Build optimization that removes unused code from the bundle |
| **TSX** | TypeScript + JSX (React component files) |
| **Type Guard** | TypeScript pattern that narrows a type: `(x): x is string =>` |
| **TypeScript** | JavaScript superset with static type checking |
| **URL Parameter** | Dynamic segment in URL: `/quiz/:id` → `req.params.id` |
| **Upsert** | Create if not exists, update if exists (Prisma operation) |
| **UUID/CUID** | Universally/Collision-Resistant Unique Identifier |
| **Virtual DOM** | React's in-memory representation of the real DOM (enables efficient updates) |
| **Vite** | Modern build tool and dev server for web projects |
| **Zod** | TypeScript-first data validation library |

---

## 15. How to Explain This Project in an Interview

### 30-Second Pitch
> "I built QuizAI, a full-stack, AI-powered quiz platform. Users can browse curated quizzes, generate custom quizzes on any topic using Google Gemini AI, take timed quizzes with instant feedback, and compete on a global leaderboard. The frontend uses React with TypeScript, Tailwind CSS, and Framer Motion for animations. The backend is Node.js with Express, Prisma ORM with SQLite, and JWT authentication with bcrypt password hashing."

### Technical Depth Questions & Answers

**Q: Why did you choose this tech stack?**
> "I chose React for its component-based architecture and massive ecosystem. TypeScript for type safety — catching bugs at compile time rather than production. Prisma as the ORM because it provides type-safe database queries that auto-complete in the editor. SQLite for zero-config development that's easily swappable to PostgreSQL for production. JWT for stateless authentication that scales horizontally."

**Q: How does the AI integration work?**
> "I use Google Gemini's API with structured prompts to generate quiz questions. The prompt specifies the topic, difficulty, count, and exact JSON output format. I parse the response, validate every field, and sanitize the data — clamping values, limiting string lengths — because AI output can be unpredictable. There's also a fallback mechanism with template-based questions if the API key isn't configured."

**Q: How did you handle authentication?**
> "JWT-based auth with bcrypt password hashing. On login, the server verifies credentials, generates a signed JWT with a 7-day expiry, and sends it to the client. The client stores it in localStorage and attaches it to every request via an Axios interceptor. The server middleware decodes the token and adds userId to the request object. Expired tokens trigger an automatic redirect to the login page."

**Q: What was the most challenging part?**
> "Route ordering in Express was a subtle bug I caught during testing. I had `/:id` before `/user/stats`, so Express matched 'user' as an ID parameter. Moving specific routes before parameterized routes fixed it. It taught me the importance of route ordering in Express."

**Q: How would you scale this for production?**
> "Swap SQLite to PostgreSQL (just change Prisma's datasource). Add Redis for caching leaderboard data. Deploy the frontend on Vercel/Netlify (static hosting + CDN) and the backend on Railway/Render. Add rate limiting on the AI generation endpoint to prevent abuse. Implement refresh tokens instead of long-lived JWTs."

---

*This document covers every technology, pattern, concept, and line of logic in the QuizAI project. Use it to understand the codebase, prepare for interviews, or explain architectural decisions.*
