import type { NextFunction, Request, Response } from 'express';
import { getUsers, userUpdateBlockStatus, userDeleteById } from '@/services/user.service.js';
import { userQuerySchema, updateUserBlockStatusSchema } from '@snitch/schemas';

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
}
