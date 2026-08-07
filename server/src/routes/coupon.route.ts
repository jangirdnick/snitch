import { Router } from 'express';
import { AuthAdminGuard } from '@/middlewares/auth.middleware.js';
import { CouponController } from '@/controllers/coupon.controller.js';

const router: Router = Router();

// Public Routes
router.post('/validate', CouponController.validate);

// Admin Routes
router.use('/admin', AuthAdminGuard);

router.get('/admin', CouponController.getAll);
router.post('/admin', CouponController.create);
router.get('/admin/:id', CouponController.getById);
router.put('/admin/:id', CouponController.update);
router.delete('/admin/:id', CouponController.delete);

export default router;
