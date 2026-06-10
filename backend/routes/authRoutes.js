import express from 'express';
import { userSignup, login, getCurrentUser, logout } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logout);
router.post('/admin/logout', adminMiddleware, logout);

export default router;