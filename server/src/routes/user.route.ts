import { getMe } from '@/controllers/auth.controller.js';
import { AuthGuard } from '@/middlewares/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.get('/get/me', AuthGuard, getMe);

export default router;
