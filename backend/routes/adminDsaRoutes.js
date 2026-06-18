import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { regenerateTodayDsa } from '../controllers/adminDsaController.js';

const router = express.Router();

router.post('/generate', adminMiddleware, regenerateTodayDsa);

export default router;
