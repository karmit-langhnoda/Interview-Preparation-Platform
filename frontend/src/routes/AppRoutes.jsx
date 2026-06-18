import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/Common/ProtectedRoute';
import Layout from '../components/Layout/Layout';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import QuizList from '../pages/QuizList';
import QuizPlay from '../pages/QuizPlay';
import QuizResult from '../pages/QuizResult';
import QuizAttemptReview from '../pages/QuizAttemptReview';
import Notes from '../pages/Notes';
import Interview from '../pages/Interview';
import Profile from '../pages/Profile';
import DsaProblem from '../pages/DsaProblem';
import AdminQuizGenerate from '../pages/AdminQuizGenerate';
import AdminDsaGenerate from '../pages/AdminDsaGenerate';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quiz-history/:attemptId" element={<QuizAttemptReview />} />
          <Route path="/quiz/:subject" element={<QuizPlay />} />
          <Route path="/quiz/:subject/result" element={<QuizResult />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/quiz" element={<AdminQuizGenerate />} />
          <Route path="/admin/dsa" element={<AdminDsaGenerate />} />
          <Route path="/dsa" element={<DsaProblem />} />
          <Route path="/dsa/:difficulty" element={<DsaProblem />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;