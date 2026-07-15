import { validate } from '@/middlewares/validate.middleware.js';
import { Router } from 'express';
import { createUserSchema, emailVerified, loginUserSchema } from '@snitch/schemas';
import { AuthController } from '@/controllers/auth.controller.js';
import passport from 'passport';
const router = Router();

router.post('/register', validate(createUserSchema), AuthController.register);
router.post(
  '/email/send-verification',
  validate(emailVerified),
  AuthController.sendEmailVerification,
);
router.post('/login', validate(loginUserSchema), AuthController.login);
router.post('/session/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.post('/logout-all-deviced', AuthController.logoutAllDevices);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  AuthController.googleCallback,
);

export default router;
