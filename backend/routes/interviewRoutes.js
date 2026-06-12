import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  startInterview,
  sendInterviewMessage,
  endInterview,
  deleteActiveInterviewsOnLogout,
  clearActiveInterviewSessions
} from '../controllers/interviewController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/start', startInterview);
router.post('/:sessionId/message', sendInterviewMessage);
router.post('/:sessionId/end', endInterview);
router.delete('/logout-clear', deleteActiveInterviewsOnLogout);
router.delete('/clear', authMiddleware, clearActiveInterviewSessions);
export default router;