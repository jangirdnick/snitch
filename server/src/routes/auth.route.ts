import { validate } from '@/middlewares/validate.middleware.js';
import { Router } from 'express';
import { createUserSchema, emailVerified, loginUserSchema } from '@snitch/schemas';
import {
  authLogin,
  authLogout,
  authLogoutAllDevices,
  authRefreshToken,
  authRegister,
  authSendEmailVerification,
  googleCallback,
} from '@/controllers/auth.controller.js';
import passport from 'passport';
const router = Router();

router.post('/register', validate(createUserSchema), authRegister);
router.post('/email/send-verification', validate(emailVerified), authSendEmailVerification);
router.post('/login', validate(loginUserSchema), authLogin);
router.post('/session/refresh', authRefreshToken);
router.post('/logout', authLogout);
router.post('/logout-all-deviced', authLogoutAllDevices);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

export default router;
