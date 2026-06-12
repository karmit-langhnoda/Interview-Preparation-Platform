import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getStreakCalendar } from '../controllers/dashboardController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/calendar', getStreakCalendar);

export default router;