import { type ZodSchema } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Generic request-body validator for JSON routes.
 *
 * ⚠️  Do NOT apply this middleware to multipart/form-data routes.
 *     After Multer runs, `req.body` contains only text fields (e.g. `{ data: '...' }`),
 *     not the fully-shaped object your schema expects.
 *     Multipart routes must perform their own parsing and Zod validation
 *     inside the controller (see product.controller.ts → create/update).
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Guard: skip validation for multipart requests — controller handles it.
    const contentType = req.headers['content-type'] ?? '';
    if (contentType.includes('multipart/form-data')) {
      next();
      return;
    }

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;
    next();
  };
}
