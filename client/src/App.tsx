import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import QuizPlay from './pages/QuizPlay';
import QuizResult from './pages/QuizResult';
import Leaderboard from './pages/Leaderboard';
import AIQuizGenerator from './pages/AIQuizGenerator';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><QuizPlay /></ProtectedRoute>} />
          <Route path="/quiz/:id/result" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/ai-generate" element={<ProtectedRoute><AIQuizGenerator /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
