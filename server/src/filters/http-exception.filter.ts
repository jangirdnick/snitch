import type { NextFunction, Request, Response } from 'express';
import {
  UserNotFoundError,
  UserAlreadyExistsError,
  EmailNotVerifiedError,
  DatabaseOperationError,
  ValidationError,
  UnauthorizedError,
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
import { ProductNotFoundError } from '@/services/product.service.js';
import {
  ImageProcessingError,
  MediaNotFoundError,
  MediaOperationError,
} from '@/services/media.service.js';
import {
  ProductFieldsError,
  ProductRequestError,
  ProductCreateError,
  ProductUpdateError,
  ProductConflictError,
} from '@/controllers/product.controller.js';
import { CategoryNotFoundError, CategoryOperationError } from '@/services/category.service.js';
import { CategoryFieldsError, CategoryRequestError } from '@/controllers/category.controller.js';
import { UserFieldsError, UserRequestError } from '@/controllers/user.controller.js';
import { CouponNotFoundError, CouponOperationError } from '@/services/coupon.service.js';
import { CouponFieldsError, CouponRequestError } from '@/controllers/coupon.controller.js';

const logger = createLogger('HttpExceptionFilter');

type ErrorClass = new (...args: never[]) => Error;

// Known domain errors → status code mapping
const DOMAIN_ERROR_MAP = new Map<ErrorClass, number>([
  [UserNotFoundError, 404],
  [UserAlreadyExistsError, 409],
  [UserFieldsError, 400],
  [UserRequestError, 400],
  [InvalidCredentialsError, 401],
  [SessionNotFoundError, 404],
  [SessionCompareError, 401],
  [SessionInvalidError, 401],
  [ProductNotFoundError, 404],
  [ProductFieldsError, 400],
  [ProductRequestError, 400],
  [ProductCreateError, 500],
  [ProductUpdateError, 500],
  [ProductConflictError, 409],
  [EmailNotVerifiedError, 401],
  [UnauthorizedError, 401],
  [ValidationError, 400],
  [DatabaseOperationError, 500],
  [EmailDeliveryError, 502],
  [CookieOprationError, 500],
  [MediaNotFoundError, 404],
  [MediaOperationError, 500],
  [ImageProcessingError, 500],
  [CategoryNotFoundError, 404],
  [CategoryOperationError, 500],
  [CategoryFieldsError, 400],
  [CategoryRequestError, 400],
  [CouponNotFoundError, 404],
  [CouponOperationError, 500],
  [CouponFieldsError, 400],
  [CouponRequestError, 400],
]);

export function globalErrorFilter(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let formattedFields: { field: string; message: string }[] | undefined;

  if (error instanceof ZodError) {
    formattedFields = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  } else if ('fields' in error && typeof error.fields === 'object' && error.fields !== null) {
    const fieldsObj = error.fields as Record<string, string[] | undefined>;
    formattedFields = Object.entries(fieldsObj)
      .filter(([_, messages]) => messages !== undefined)
      .map(([field, messages]) => ({
        field,
        message: Array.isArray(messages) ? messages[0] : String(messages),
      }));
  }

  if (
    error instanceof ZodError ||
    error instanceof UserFieldsError ||
    error instanceof ProductFieldsError ||
    error instanceof CategoryFieldsError ||
    error instanceof CouponFieldsError
  ) {
    res.status(400).json({
      success: false,
      error: {
        name: error.name,
        message: 'Validation failed',
        fields: formattedFields,
      },
    });

    return;
  }

  const statusCode =
    DOMAIN_ERROR_MAP.get(error.constructor as ErrorClass) ??
    ('statusCode' in error ? (error as { statusCode: number }).statusCode : null) ??
    500;

  const requestLogger = req.logger ?? logger;

  if (statusCode >= 500) {
    requestLogger.error(
      { err: error, path: req.path, method: req.method },
      'Internal server error',
    );
  } else {
    requestLogger.warn({ err: error, path: req.path, method: req.method }, 'Client error');
  }

  res.status(statusCode).json({
    success: false,
    error: {
      name: error.name,
      message: error.message,
      ...(formattedFields && { fields: formattedFields }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
}
