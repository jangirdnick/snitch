import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError, userExistByIdRole } from '@/services/user.service.js';
import { verifyAccessToken } from '@/utils/jwt.util.js';
import { redisGet, redisSet } from '@/services/redis.service.js';

/**
 * Factory function to create authentication guards based on roles.
 * Throttles database checks by caching user existence in Redis for 5 minutes.
 *
 * @param allowedRoles Array of roles required to access the route ('USER' | 'ADMIN').
 */
const AuthGuard = (allowedRoles: Array<'USER' | 'ADMIN'>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authorization header with Bearer token is required');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedError('Bearer token is missing');
      }

      // Synchronously verify and decode the JWT
      const decodedToken = verifyAccessToken(token);

      if (!allowedRoles.includes(decodedToken.role as 'USER' | 'ADMIN')) {
        throw new UnauthorizedError('Unauthorized access for this role');
      }

      const userId = decodedToken.sub;
      const userRole = decodedToken.role as 'USER' | 'ADMIN';

      // Cache key specifically for existence throttling
      const cacheKey = `auth:exists:${userId}`;

      // Fast path: Check Redis to see if we recently verified this user exists
      const userExistsInCache = await redisGet(cacheKey);

      if (!userExistsInCache || userExistsInCache !== decodedToken.sub) {
        // Verify user still exists in DB (throws if not found)
        await userExistByIdRole({ id: userId, role: userRole });

        // Cache the existence check, not the token payload, to save memory
        await redisSet({
          key: cacheKey,
          value: decodedToken.sub,
          ttl: 5 * 60, // 5 minutes cache TTL
        });
      }

      // Hydrate request with token payload data
      req.user = {
        ...decodedToken,
        // id: userId,
        lastLoginAt: new Date(decodedToken.lastLoginAt),
        createdAt: new Date(decodedToken.createdAt),
        updatedAt: new Date(decodedToken.updatedAt),
      };
      req.userId = userId;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const AuthUserGuard = AuthGuard(['USER', 'ADMIN']);
export const AuthAdminGuard = AuthGuard(['ADMIN']);
