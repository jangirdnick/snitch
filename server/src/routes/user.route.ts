import { AuthController } from '@/controllers/auth.controller.js';
import { AuthUserGuard } from '@/middlewares/auth.middleware.js';
import { Router } from 'express';

const router: Router = Router();

router.get('/get/me', AuthUserGuard, AuthController.getMe);

export default router;
