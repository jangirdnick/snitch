import { getMe } from '@/controllers/auth.controller.js';
import { AuthUserGuard } from '@/middlewares/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.get('/get/me', AuthUserGuard, getMe);

export default router;
