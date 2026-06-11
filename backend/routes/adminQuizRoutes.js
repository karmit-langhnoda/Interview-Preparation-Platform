import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { generateOrRegenerateQuiz } from '../controllers/adminQuizController.js';

const router = express.Router();

router.post('/generate', adminMiddleware, generateOrRegenerateQuiz);

export default router;