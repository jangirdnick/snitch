import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller.js';
import { AuthAdminGuard } from '@/middlewares/auth.middleware.js';

const router: Router = Router();

// ============================================================================
// Admin Routes (Requires Authentication & Admin Role)
// ============================================================================

router.use('/admin', AuthAdminGuard);

router.get('/admin', OrderController.getAll);
router.get('/admin/:id', OrderController.getById);
router.patch('/admin/:id/status', OrderController.updateStatus);
router.patch('/admin/:id/tracking', OrderController.updateTracking);

export default router;
