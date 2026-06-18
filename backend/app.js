import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import dsaRoutes from './routes/dsaRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import adminQuizRoutes from './routes/adminQuizRoutes.js';
import adminDsaRoutes from './routes/adminDsaRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import streakRoutes from './routes/streakRoutes.js';

const app = express();

const sanitizeOrigin = (url) => {
  if (!url) return '';
  return url.trim().replace(/\/$/, '');
};

const allowedClientOrigins = new Set(
  [
    sanitizeOrigin(process.env.CLIENT_URL),
    'https://interview-preparation-platform-lake.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ].filter(Boolean)
);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const sanitized = sanitizeOrigin(origin);
  if (allowedClientOrigins.has(sanitized)) return true;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(sanitized);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin/quiz', adminQuizRoutes);
app.use('/api/admin/dsa', adminDsaRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/streak', streakRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'PrepDaily Backend' });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export default app;