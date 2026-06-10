import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getTodayProblems, markSolved, getMyProgress, getTodayProblemByDifficulty } from '../controllers/dsaController.js';

const router = express.Router();

router.get('/today', authMiddleware, getTodayProblems);
router.get('/today/:difficulty', authMiddleware, getTodayProblemByDifficulty);
router.post('/solve', authMiddleware, markSolved);
router.get('/progress', authMiddleware, getMyProgress);

export default router;