import type { Response } from 'express';
import config from '@/config/config.js';
import { createLogger } from './logger.js';

const logger = createLogger('COOKIE-SERVICE');

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days — matches REFRESH_TOKEN_TTL_MS in auth.controller
const isProd = config.NODE_ENV === 'production';

type SameSite = 'lax' | 'strict' | 'none';
type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: SameSite;
  maxAge: number;
  path: string;
};

export class CookieOprationError extends Error {
  public readonly statusCode = 500;
  constructor(opration: 'set' | 'clear', cause?: unknown) {
    super(`Failed to ${opration} refresh token cookie`);
    this.name = 'CookieOprationError';
    this.cause = cause;
  }
}

function buildCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: REFRESH_TOKEN_TTL,
    path: '/',
  };
}

export const setCookie = ({
  name,
  refreshToken,
  res,
}: {
  name: string;
  refreshToken: string;
  res: Response;
}) => {
  try {
    res.cookie(name, refreshToken, buildCookieOptions());
  } catch (error: unknown) {
    logger.error({ err: error }, 'Failed to set refresh token cookie');
    throw new CookieOprationError('set', error);
  }
};

export const clearCookie = ({ name, res }: { name: string; res: Response }) => {
  try {
    res.clearCookie(name);
  } catch (error: unknown) {
    logger.error({ err: error }, 'Failed to clear refresh token cookie');
    throw new CookieOprationError('clear', error);
  }
};
