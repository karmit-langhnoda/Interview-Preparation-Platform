import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getQuizList,
  getQuizBySubject,
  submitQuizAnswers,
  getMyQuizAttempts,
  getQuizAttemptById
} from '../controllers/quizController.js';

const router = express.Router();

router.get('/list', authMiddleware, getQuizList);
router.get('/my-attempts', authMiddleware, getMyQuizAttempts);
router.get('/attempt/:attemptId', authMiddleware, getQuizAttemptById);
router.get('/:subject', authMiddleware, getQuizBySubject);
router.post('/:quizId/submit', authMiddleware, submitQuizAnswers);

export default router;