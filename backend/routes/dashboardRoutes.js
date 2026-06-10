import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getStats,
  getRecent,
  getToday
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', authMiddleware, getStats);
router.get('/recent', authMiddleware, getRecent);
router.get('/today', authMiddleware, getToday);

export default router;