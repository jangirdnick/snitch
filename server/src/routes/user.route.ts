import { AuthController } from '@/controllers/auth.controller.js';
import { UserController } from '@/controllers/user.controller.js';
import { AuthUserGuard, AuthAdminGuard } from '@/middlewares/auth.middleware.js';
import { Router } from 'express';

const router: Router = Router();

router.get('/get/me', AuthUserGuard, AuthController.getMe);
router.put('/profile', AuthUserGuard, UserController.updateProfile);
router.put('/change-password', AuthUserGuard, UserController.changePassword);

// Account & Security Center Routes
router.get('/sessions', AuthUserGuard, UserController.getSessions);
router.delete('/sessions/:deviceId', AuthUserGuard, UserController.revokeSession);
router.delete('/account', AuthUserGuard, UserController.deleteAccount);
router.get('/export', AuthUserGuard, UserController.exportData);

// Admin Routes for Customers Management
router.get('/admin/all', AuthAdminGuard, UserController.getAll);
router.patch('/admin/:id/block', AuthAdminGuard, UserController.updateBlockStatus);
router.patch('/admin/:id/review-permission', AuthAdminGuard, UserController.updateReviewPermission);
router.delete('/admin/:id', AuthAdminGuard, UserController.delete);

export default router;
