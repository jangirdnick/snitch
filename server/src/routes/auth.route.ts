import { validate } from '@/middlewares/validate.middleware.js';
import { Router } from 'express';
import { createUserSchema, emailVerified, loginUserSchema } from '@snitch/types';
import {
  authLogin,
  authLogout,
  authLogoutAllDevidec,
  authRefreshToken,
  authRegister,
  authSendEmailVerification,
} from '@/controllers/auth.controller.js';
const router = Router();

router.post('/register', validate(createUserSchema), authRegister);
router.post('/email/send-verification', validate(emailVerified), authSendEmailVerification);
router.post('/login', validate(loginUserSchema), authLogin);
router.post('/session/refresh', authRefreshToken);
router.post('/logout', authLogout);
router.post('/logout-all-deviced', authLogoutAllDevidec);

export default router;
