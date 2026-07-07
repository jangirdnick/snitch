import { ValidationError, UnauthorizedError, userFindById } from '@/services/user.service.js';
import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '@/utils/jwt.util.js';
import { redisGetObject, redisSetObject } from '@/services/redis.service.js';
import { mapUserResponse } from '@/controllers/auth.controller.js';
import type { UserWithoutPassword } from '@/models/user.model.js';

export async function AuthGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization header with Bearer token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Bearer token is missing');
    }

    const decodedToken = verifyAccessToken(token);
    const userId = decodedToken.sub;

    // Fast path: Check Redis for cached user profile
    const cacheKey = `user:profile:${userId}`;
    let user = await redisGetObject<UserWithoutPassword>(cacheKey);

    // If not in cache, fetch from DB and cache for 5 minutes
    if (!user) {
      user = await userFindById(userId);
      if (!user) {
        throw new ValidationError('User not found or suspended');
      }
      await redisSetObject({
        key: cacheKey,
        value: user,
        ttl: 5 * 60, // 5 minutes
      });
    }

    // Map fetched user object to UserResponseDto format
    const mappedUser = mapUserResponse(user);
    req.user = {
      ...mappedUser,
      lastLoginAt: new Date(mappedUser.lastLoginAt),
      createdAt: new Date(mappedUser.createdAt),
      updatedAt: new Date(mappedUser.updatedAt),
    };
    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
}
