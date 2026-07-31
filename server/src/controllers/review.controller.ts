import type { NextFunction, Request, Response } from 'express';
import { reviewGetAll, reviewUpdateStatus, reviewDeleteById } from '@/services/review.service.js';
import { reviewQuerySchema, updateReviewStatusSchema } from '@snitch/schemas';

export class ReviewFieldsError extends Error {
  public readonly statusCode = 400;
  public readonly fields: Record<string, string[] | undefined>;
  constructor(errorFields: Record<string, string[] | undefined>) {
    super('Review validation failed');
    this.name = 'ReviewFieldsError';
    this.fields = errorFields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ReviewRequestError extends Error {
  public readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ReviewRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ReviewController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParsed = reviewQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        throw new ReviewFieldsError(queryParsed.error.flatten().fieldErrors);
      }

      const result = await reviewGetAll(queryParsed.data);

      res.status(200).json({
        success: true,
        message: 'Reviews fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new ReviewRequestError('Review ID is required');
      }

      const bodyParsed = updateReviewStatusSchema.safeParse(req.body);
      if (!bodyParsed.success) {
        throw new ReviewFieldsError(bodyParsed.error.flatten().fieldErrors);
      }

      const updatedReview = await reviewUpdateStatus(id, bodyParsed.data);

      res.status(200).json({
        success: true,
        message: 'Review status updated successfully',
        data: { review: updatedReview },
      });
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new ReviewRequestError('Review ID is required');
      }

      await reviewDeleteById(id);

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
