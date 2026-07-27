import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { logger } from '@/utils/logger.js';

/**
 * Middleware to ensure every request has a unique ID and a scoped logger.
 * Traces requests from the frontend or generates a new ID.
 */
export function requestTracingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Extract or generate Request ID
  const reqId = (req.headers['x-request-id'] as string) || randomUUID();

  // Attach to request object for downstream use
  req.requestId = reqId;

  // Add the ID to the response headers so the client can trace it back
  res.setHeader('X-Request-Id', reqId);

  // Create a child logger scoped with this Request ID
  req.logger = logger.child({ reqId, method: req.method, url: req.url });

  next();
}
