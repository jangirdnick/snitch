import config from '@/config/config.js';
import jwt from 'jsonwebtoken';
import type { JwtAccessTokenPayload, JwtCookiePayload } from '@snitch/types';
import type { UserWithoutPassword } from '@/models/user.model.js';
import { UnauthorizedError } from '@/services/user.service.js';

interface GeneratedJwtTokens {
  accessToken: string;
  refreshToken: string;
}

export const generateJwtToken = (params: {
  user: UserWithoutPassword;
  deviceId: string;
}): GeneratedJwtTokens => {
  const { user, deviceId } = params;

  const accessTokenPayload: JwtAccessTokenPayload = {
    sub: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    email: user.email,
    emailVerified: user.emailVerified,
    contact: {
      countryCode: user.contact.countryCode,
      phoneNumber: user.contact.phoneNumber,
    },
    role: user.role,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  const refreshTokenPayload: JwtCookiePayload = { sub: user.id, deviceId };

  return {
    accessToken: jwt.sign(accessTokenPayload, config.JWT_SECRET, { expiresIn: '15m' }),
    refreshToken: jwt.sign(refreshTokenPayload, config.JWT_SECRET, { expiresIn: '7d' }),
  };
};

export function compairJwtToken(token: string): JwtCookiePayload {
  const result = jwt.verify(token, config.JWT_SECRET) as JwtCookiePayload;

  if (!result) {
    throw new UnauthorizedError('Authorization token is wrong');
  }
  return result;
}

export function verifyAccessToken(token: string): JwtAccessTokenPayload {
  try {
    const result = jwt.verify(token, config.JWT_SECRET) as JwtAccessTokenPayload;
    if (!result || !result.sub) {
      throw new UnauthorizedError('Invalid access token');
    }
    return result;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access token expired');
    }
    throw new UnauthorizedError('Invalid access token');
  }
}
