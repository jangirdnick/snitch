import type { NextFunction, Request, Response } from 'express';
import {
  getUsers,
  userUpdateBlockStatus,
  userDeleteById,
  userUpdateReviewPermission,
  userUpdateProfile,
  userChangePassword,
  userFindByEmailPassword,
  userFindById,
} from '@/services/user.service.js';
import { getActiveSessions, revokeSessionByDeviceId } from '@/services/session.service.js';
import { mediaService } from '@/services/media.service.js';
import { clearCookie } from '@/utils/cookie.util.js';
import { REFRESH_COOKIE_NAME } from '@/controllers/auth.controller.js';
import { compairJwtToken } from '@/utils/jwt.util.js';
import {
  userQuerySchema,
  updateUserBlockStatusSchema,
  updateUserReviewPermissionSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from '@snitch/schemas';
import { mapUserResponse } from '@/controllers/auth.controller.js';

export class UserFieldsError extends Error {
  public readonly statusCode = 400;
  public readonly fields: Record<string, string[] | undefined>;
  constructor(errorFields: Record<string, string[] | undefined>) {
    super('User validation failed');
    this.name = 'UserFieldsError';
    this.fields = errorFields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UserRequestError extends Error {
  public readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'UserRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const { uploadMedia, deleteMedia, generateUrl } = mediaService();

export class UserController {
  /**
   * GET /api/user/admin/all
   * Fetches paginated users with optional search and filters.
   */
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParsed = userQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        throw new UserFieldsError(queryParsed.error.flatten().fieldErrors);
      }

      const result = await getUsers(queryParsed.data);
      result.items.forEach((user) => {
        if (user.avatar && !/^(https?:\/\/|data:)/i.test(user.avatar)) {
          try {
            user.avatar = generateUrl({
              path: user.avatar,
              transformations: { width: 400, height: 400, format: 'webp', quality: 80 },
            });
          } catch {
            // fallback
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/user/admin/:id/block
   * Updates the block status of a user.
   */
  static updateBlockStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new UserRequestError('User ID is required');
      }

      const bodyParsed = updateUserBlockStatusSchema.safeParse(req.body);
      if (!bodyParsed.success) {
        throw new UserFieldsError(bodyParsed.error.flatten().fieldErrors);
      }

      const { isBlocked } = bodyParsed.data;

      // Ensure we don't accidentally block the currently logged in admin
      // (though they could technically unblock themselves, we prevent it here for safety).
      if (isBlocked && id === req.userId) {
        throw new UserRequestError('You cannot block your own account.');
      }

      const updatedUser = await userUpdateBlockStatus(id, isBlocked);

      res.status(200).json({
        success: true,
        message: `User successfully ${isBlocked ? 'blocked' : 'unblocked'}`,
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/user/admin/:id
   * Hard deletes a user and cascades session deletion.
   */
  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new UserRequestError('User ID is required');
      }

      if (id === req.userId) {
        throw new UserRequestError('You cannot delete your own account.');
      }

      await userDeleteById(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/user/admin/:id/review-permission
   * Updates the user's canReview permission.
   */
  static updateReviewPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new UserRequestError('User ID is required');
      }

      const bodyParsed = updateUserReviewPermissionSchema.safeParse(req.body);
      if (!bodyParsed.success) {
        throw new UserFieldsError(bodyParsed.error.flatten().fieldErrors);
      }

      const { canReview } = bodyParsed.data;

      const updatedUser = await userUpdateReviewPermission(id, canReview);

      res.status(200).json({
        success: true,
        message: `User review permission successfully ${canReview ? 'granted' : 'revoked'}`,
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/user/profile
   * Updates personal profile information for the logged in user.
   */
  static updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    let newlyUploadedPath: string | null = null;
    try {
      const userId = req.userId;
      if (!userId) {
        throw new UserRequestError('User is not authenticated');
      }

      const existingUser = await userFindById(userId);

      let rawBody: Record<string, unknown>;
      if (req.body?.data) {
        try {
          rawBody = JSON.parse(req.body.data);
        } catch {
          throw new UserFieldsError({ data: ['Contains invalid JSON'] });
        }
      } else {
        rawBody = { ...req.body };
      }

      const file = req.file as Express.Multer.File | undefined;

      if (file) {
        const nameSlug = `user-${userId}-${Date.now()}`;
        const result = await uploadMedia({
          file,
          fileName: `${nameSlug}-${file.originalname}`,
          fileType: file.mimetype,
          folder: 'avatars',
        });

        newlyUploadedPath = result.data.imagePath;
        const avatarUrl = generateUrl({
          path: newlyUploadedPath,
          transformations: { width: 400, height: 400, format: 'webp', quality: 80 },
        });

        rawBody.avatar = avatarUrl;
      }

      const bodyParsed = updateProfileSchema.safeParse(rawBody);
      if (!bodyParsed.success) {
        throw new UserFieldsError(bodyParsed.error.flatten().fieldErrors);
      }

      const updatedUser = await userUpdateProfile(userId, bodyParsed.data);

      // Clean up previous avatar if replaced
      if (existingUser.avatar && existingUser.avatar !== updatedUser.avatar) {
        if (existingUser.avatar.includes('avatars/')) {
          await deleteMedia(existingUser.avatar).catch((err) => {
            req.logger?.error(
              { err, oldAvatar: existingUser.avatar },
              'Failed to delete old avatar image',
            );
          });
        }
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: mapUserResponse(updatedUser) },
      });
    } catch (error) {
      if (newlyUploadedPath) {
        await deleteMedia(newlyUploadedPath).catch((err) => {
          req.logger?.error({ err, newlyUploadedPath }, 'Failed to rollback uploaded avatar image');
        });
      }
      next(error);
    }
  };

  /**
   * PUT /api/user/change-password
   * Updates password for the logged in user after verifying current password.
   */
  static changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new UserRequestError('User is not authenticated');
      }

      const bodyParsed = changePasswordSchema.safeParse(req.body);
      if (!bodyParsed.success) {
        throw new UserFieldsError(bodyParsed.error.flatten().fieldErrors);
      }

      const result = await userChangePassword(userId, bodyParsed.data);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/user/sessions
   * Fetch active sessions for the current user.
   */
  static getSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UserRequestError('Unauthorized');
      }
      const sessions = await getActiveSessions(req.userId);
      const currentToken = req.cookies?.[REFRESH_COOKIE_NAME];
      let currentDeviceId = '';

      if (currentToken) {
        const payload = compairJwtToken(currentToken);
        currentDeviceId = payload.deviceId;
      }

      res.status(200).json({
        success: true,
        message: 'Sessions fetched successfully',
        data: sessions.map((s) => ({
          deviceId: s.deviceId,
          userAgent: s.userAgent,
          ipAddress: s.ipAddress,
          createdAt: s.createdAt,
          expiredAt: s.expiredAt,
          isCurrentSession: s.deviceId === currentDeviceId,
        })),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/user/sessions/:deviceId
   * Revoke a specific session.
   */
  static revokeSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deviceId } = req.params as { deviceId: string };
      if (!req.userId) {
        throw new UserRequestError('Unauthorized');
      }
      if (!deviceId) {
        throw new UserRequestError('Device ID is required');
      }

      await revokeSessionByDeviceId(req.userId, deviceId);

      res.status(200).json({
        success: true,
        message: 'Session revoked successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/user/account
   * Permanently delete user account.
   */
  static deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UserRequestError('Unauthorized');
      }

      const bodyParsed = deleteAccountSchema.safeParse(req.body);
      if (!bodyParsed.success) {
        throw new UserFieldsError(bodyParsed.error.flatten().fieldErrors);
      }

      const user = await userFindById(req.userId);

      if (user.role === 'ADMIN') {
        throw new UserRequestError('Admin accounts cannot be deleted here.');
      }

      // Verify password
      await userFindByEmailPassword({ email: user.email, password: bodyParsed.data.password });

      // Delete the user via service (which will handle DB deletion)
      await userDeleteById(req.userId);

      // We should ideally anonymize orders here or inside userDeleteById

      clearCookie({ name: REFRESH_COOKIE_NAME, res });

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/user/export
   * Export user data as JSON.
   */
  static exportData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UserRequestError('Unauthorized');
      }

      const user = await userFindById(req.userId);

      const exportData = {
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contact: user.contact,
          createdAt: user.createdAt,
        },
        // In a real app we'd fetch addresses, reviews, etc.
      };

      res.status(200).json({
        success: true,
        message: 'Data exported successfully',
        data: exportData,
      });
    } catch (error) {
      next(error);
    }
  };
}
