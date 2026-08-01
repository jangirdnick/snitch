import { Router } from 'express';
import { AnalyticsController } from '@/controllers/analytics.controller.js';
import { AuthAdminGuard } from '@/middlewares/auth.middleware.js';

const router: Router = Router();

router.use(AuthAdminGuard);

router.get('/dashboard', AnalyticsController.getDashboard);
router.get('/recent-delivered', AnalyticsController.getRecentDeliveredOrders);

export default router;
