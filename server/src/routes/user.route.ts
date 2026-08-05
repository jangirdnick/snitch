import { AuthController } from '@/controllers/auth.controller.js';
import { UserController } from '@/controllers/user.controller.js';
import { AuthUserGuard, AuthAdminGuard } from '@/middlewares/auth.middleware.js';
import { Router } from 'express';
import multer from 'multer';

const router: Router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

router.get('/get/me', AuthUserGuard, AuthController.getMe);
router.put('/profile', AuthUserGuard, upload.single('avatar'), UserController.updateProfile);
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
