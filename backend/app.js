// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import dsaRoutes from './routes/dsaRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
const app = express();

// Basic middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



//---------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/dashboard', dashboardRoutes);
//---------------------------------------
// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'PrepDaily Backend' });
});
// Global error handler placeholder
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export default app;