import {
  userCreate,
  userExistByEmail,
  userFindByEmailPassword,
  userFindById,
  ValidationError,
  UnauthorizedError,
  userFindByEmail,
} from '@/services/user.service.js';
import type { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { verificationMailTemplate } from '@/emails/verification.email.js';
import sendEmail from '@/services/email.service.js';
import { redisDel, redisGet, redisSet } from '@/services/redis.service.js';
import { welcomeEmail } from '@/emails/welcome.email.js';
import { CreateUserDto, LoginUserDto } from '@snitch/schemas';
import { UserResponseDto } from '@snitch/types';
import { compairJwtToken, generateJwtToken } from '@/utils/jwt.util.js';
import { clearCookie, setCookie } from '@/utils/cookie.util.js';
import {
  createSession,
  validateAndExpireAllSessions,
  validateAndExpireSession,
} from '@/services/session.service.js';
import userModel, { IUser, UserWithoutPassword } from '@/models/user.model.js';
import config from '@/config/config.js';
import { GoogleUser } from '@/types/auth.type.js';

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const REFRESH_COOKIE_NAME = '__snitch_rt';
export const OTP_TTL_SECONDS = 5 * 60; // 5 minutes
export const MAX_OTP_ATTEMPTS = 5; // soft cap per email per TTL window

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function generateOTP(): string {
  return crypto.randomInt(100_000, 1_000_000).toString();
}

function generateDeviceId() {
  return crypto.randomBytes(16).toString('hex');
}

export async function tokenChecker({
  sessionExp,
  req,
}: {
  sessionExp: 'SINGLE' | 'MULTIPAL';
  req: Request;
}) {
  const token: string | undefined = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    throw new ValidationError('Authorization token is required');
  }

  const decodedToken = compairJwtToken(token);
  const user = await userFindById(decodedToken.sub);

  if (sessionExp === 'SINGLE') {
    await validateAndExpireSession({
      userId: decodedToken.sub,
      deviceId: decodedToken.deviceId,
      token,
    });
  } else {
    await validateAndExpireAllSessions({
      userId: decodedToken.sub,
      deviceId: decodedToken.deviceId,
      token,
    });
  }

  return {
    user,
    token,
  };
}

export const mapUserResponse = (user: IUser | UserWithoutPassword): UserResponseDto => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  avatar: user.avatar,
  email: user.email,
  emailVerified: user.emailVerified,
  role: user.role,
  contact: user.contact,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/* ------------------------------------------------------------------ */
/* Register                                                           */
/* ------------------------------------------------------------------ */
export const authRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      firstName,
      lastName,
      email,
      otp,
      contact: { countryCode, phoneNumber },
      password,
    } = req.body as CreateUserDto;
    await userExistByEmail({ email });

    const OTPKey = `otp:${email}`;
    const attemptsKey = `otp:attempts:${email}`;

    const redisEmailOTP = await redisGet(OTPKey);
    if (!redisEmailOTP) {
      res.status(400).json({
        success: false,
        error: 'OTP not found',
      });
      return;
    }

    if (redisEmailOTP !== otp) {
      try {
        const attemptsRaw = await redisGet(attemptsKey);
        const attempts = attemptsRaw ? Number(attemptsRaw) + 1 : 1;
        await redisSet({ key: attemptsKey, value: String(attempts), ttl: OTP_TTL_SECONDS });
        if (attempts >= MAX_OTP_ATTEMPTS) {
          await redisDel({ key: OTPKey });
          throw new Error('Too many incorrect attempts. Please request a new OTP');
        }
      } catch (error) {
        next(error);
        return;
      }
      res.status(400).json({
        success: false,
        error: 'Invalid OTP',
      });
      return;
    }

    const createdUser = await userCreate({
      firstName,
      lastName,
      email,
      emailVerified: true,
      contact: {
        countryCode: countryCode,
        phoneNumber: phoneNumber,
      },
      password,
      lastLoginAt: new Date(),
    });

    await Promise.all([redisDel({ key: OTPKey }), redisDel({ key: attemptsKey })]).catch(() => {
      // not fatal — TTL will reclaim it
    });

    const welcomeTemplate = welcomeEmail(
      `${createdUser.firstName} ${createdUser.lastName ?? ''}`.trim(),
    );

    sendEmail({ to: createdUser.email, subject: 'Welcome to Snitch', html: welcomeTemplate });
    res.status(201).json({
      success: true,
      message: `🎉 ${createdUser.firstName} account created successfully`,
    });
  } catch (error) {
    next(error);
    return;
  }
};

/* ------------------------------------------------------------------ */
/* Send verification email                                            */
/* ------------------------------------------------------------------ */
export const authSendEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    await userExistByEmail({ email });

    const OTP = generateOTP();
    const verificationTemplate = verificationMailTemplate(OTP);

    await sendEmail({ to: email, subject: 'Verify your email', html: verificationTemplate });

    await Promise.all([
      redisSet({ key: `otp:${email}`, value: `${OTP}`, ttl: OTP_TTL_SECONDS }),
      redisDel({ key: `otp:attempts:${email}` }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'OTP sent! Check your email and verify.',
    });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------------------------------------------ */
/* Login                                                              */
/* ------------------------------------------------------------------ */
export const authLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as LoginUserDto;
    const user = await userFindByEmailPassword({ email, password });
    user.updateOne({ lastLoginAt: new Date() });
    await user.save();

    const deviceId = generateDeviceId();

    const { accessToken, refreshToken } = generateJwtToken({ user, deviceId });
    await createSession({
      userId: user.id,
      user: user._id,
      deviceId,
      hashToken: refreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    setCookie({ name: REFRESH_COOKIE_NAME, refreshToken, res });

    res.status(201).json({
      success: true,
      message: `${user.firstName} logged in successfully`,
      data: {
        accessToken,
        user: mapUserResponse(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------------------------------------------ */
/* Refresh token                                                      */
/* ------------------------------------------------------------------ */
export const authRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = await tokenChecker({ sessionExp: 'SINGLE', req });

    const deviceId = generateDeviceId();
    const { accessToken, refreshToken } = generateJwtToken({ user, deviceId });
    await createSession({
      userId: user.id,
      user: user._id,
      hashToken: refreshToken, // store refreshToken (not accessToken) — consistent with login
      deviceId,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    setCookie({ name: REFRESH_COOKIE_NAME, refreshToken, res });

    res.status(201).json({
      success: true,
      message: 'New token generate successful',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------------------------------------------ */
/* Logout                                                             */
/* ------------------------------------------------------------------ */
export const authLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = await tokenChecker({ sessionExp: 'SINGLE', req });

    clearCookie({ name: REFRESH_COOKIE_NAME, res });

    res.status(201).json({
      success: true,
      message: `${user.firstName} logout successful`,
    });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------------------------------------------ */
/* Logout all deviced                                                 */
/* ------------------------------------------------------------------ */
export const authLogoutAllDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = await tokenChecker({ sessionExp: 'MULTIPAL', req });

    clearCookie({ name: REFRESH_COOKIE_NAME, res });

    res.status(201).json({
      success: true,
      message: `${user.firstName} logout successful`,
    });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------------------------------------------ */
/* Get me ( user info )                                               */
/* ------------------------------------------------------------------ */
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError('User not authenticated');
    }

    res.status(200).json({
      success: true,
      message: `${user.firstName} fetched successfully`,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------------------------------------------ */
/* Google login                                                       */
/* ------------------------------------------------------------------ */

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const requestUser = req.user as unknown as GoogleUser;
    const email = requestUser.emails?.[0]?.value;

    if (!email) {
      throw new ValidationError('Email not provided by Google');
    }

    let userDetail: UserWithoutPassword | undefined;
    try {
      userDetail = await userFindByEmail(email);
      // Update lastLoginAt for existing user
      await userModel.updateOne({ _id: userDetail._id }, { lastLoginAt: new Date() });
    } catch (error) {
      const { name } = error as Error;
      const isNewUserError = name === 'InvalidCredentialsError' || name === 'UserNotFoundError';

      const isUnverifiedUser = name === 'EmailNotVerifiedError';

      if (isNewUserError) {
        // New user — create account with Google profile data
        userDetail = await userCreate({
          id: requestUser.id,
          firstName: requestUser.name?.givenName || requestUser.displayName,
          lastName: requestUser.name?.familyName || undefined,
          email: email,
          emailVerified: requestUser.emails[0]?.verified || false,
          avatar: requestUser.photos?.[0]?.value || '',
          contact: {
            countryCode: '+00',
            phoneNumber: '0000000000',
          },
          password: crypto.randomBytes(16).toString('hex') + 'A1@',
          lastLoginAt: new Date(),
        });
      } else if (isUnverifiedUser) {
        // Existing user with unverified email — Google has verified it, so mark verified
        await userModel.updateOne(
          { email: email.toLowerCase().trim() },
          { emailVerified: true, lastLoginAt: new Date() },
        );
        userDetail = await userFindByEmail(email);
      } else {
        throw error;
      }
    }

    if (!userDetail) {
      throw new ValidationError('Failed to resolve user from Google profile');
    }

    const deviceId = generateDeviceId();

    const { accessToken, refreshToken } = generateJwtToken({ user: userDetail as IUser, deviceId });
    await createSession({
      userId: userDetail.id,
      user: userDetail._id,
      deviceId,
      hashToken: refreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    setCookie({ name: REFRESH_COOKIE_NAME, refreshToken, res });

    res.redirect(
      `${config.CORS_ORIGIN}?accessToken=${accessToken}&message=${userDetail.firstName} Login successful`,
    );
  } catch (error) {
    const message = encodeURIComponent((error as Error)?.message ?? 'Google login failed');
    res.redirect(`${config.CORS_ORIGIN}/auth/error?reason=${message}`);
  }
};
