import type { NextFunction, Request, Response } from 'express';
import {
  UserNotFoundError,
  UserAlreadyExistsError,
  EmailNotVerifiedError,
  DatabaseOperationError,
  ValidationError,
  InvalidCredentialsError,
} from '@/services/user.service.js';
import { createLogger } from '@/utils/logger.js';
import { EmailDeliveryError } from '@/services/email.service.js';
import { ZodError } from 'zod';
import { CookieOprationError } from '@/utils/cookie.util.js';
import {
  SessionCompareError,
  SessionInvalidError,
  SessionNotFoundError,
} from '@/services/session.service.js';

const logger = createLogger('HttpExceptionFilter');

type ErrorClass = new (...args: never[]) => Error;

// Known domain errors → status code mapping
const DOMAIN_ERROR_MAP = new Map<ErrorClass, number>([
  [UserNotFoundError, 404],
  [UserAlreadyExistsError, 409],
  [InvalidCredentialsError, 401],
  [SessionNotFoundError, 404],
  [SessionCompareError, 401],
  [SessionInvalidError, 401],
  [EmailNotVerifiedError, 401],
  [ValidationError, 400],
  [DatabaseOperationError, 500],
  [EmailDeliveryError, 502],
  [CookieOprationError, 500],
]);

export function globalErrorFilter(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        name: 'ZodError',
        message: error.message,
        fields: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });

    return;
  }

  const statusCode =
    DOMAIN_ERROR_MAP.get(error.constructor as ErrorClass) ??
    ('statusCode' in error ? (error as { statusCode: number }).statusCode : null) ??
    500;

  if (statusCode >= 500) {
    logger.error({ err: error, path: req.path, method: req.method }, 'Internal server error');
  } else {
    logger.warn({ err: error, path: req.path, method: req.method }, 'Client error');
  }

  res.status(statusCode).json({
    success: false,
    error: {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
}
