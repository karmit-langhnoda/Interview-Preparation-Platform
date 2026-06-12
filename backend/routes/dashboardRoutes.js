import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getStreakCalendar } from '../controllers/dashboardController.js';

import {
  getStats,
  getRecent,
  getToday
} from '../controllers/dashboardController.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/streak-calendar', getStreakCalendar);
router.get('/stats', authMiddleware, getStats);
router.get('/recent', authMiddleware, getRecent);
router.get('/today', authMiddleware, getToday);

export default router;