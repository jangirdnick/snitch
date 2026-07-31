import { Router } from 'express';
import { ReviewController } from '@/controllers/review.controller.js';
import { AuthAdminGuard } from '@/middlewares/auth.middleware.js';

const router: Router = Router();

// Admin Routes for Reviews
router.get('/admin', AuthAdminGuard, ReviewController.getAll);
router.patch('/admin/:id/status', AuthAdminGuard, ReviewController.updateStatus);
router.delete('/admin/:id', AuthAdminGuard, ReviewController.delete);

export default router;
