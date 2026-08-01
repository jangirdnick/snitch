import { Router } from 'express';
import { DashboardController } from '@/controllers/dashboard.controller.js';
import { AuthAdminGuard } from '@/middlewares/auth.middleware.js';

const router: Router = Router();

// Protect all dashboard routes
router.use(AuthAdminGuard);

router.get('/overview', DashboardController.getOverview);

export default router;
