import type { NextFunction, Request, Response } from 'express';
import {
  reviewGetAll,
  reviewUpdateStatus,
  reviewDeleteById,
  reviewGetByProductId,
} from '@/services/review.service.js';
import { mediaService } from '@/services/media.service.js';
import { reviewQuerySchema, updateReviewStatusSchema } from '@snitch/schemas';
import type { ReviewResponseDto } from '@snitch/types';

const { generateUrl } = mediaService();

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

function toPublicUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return undefined;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return undefined;
  if (/^(https?:\/\/|data:)/i.test(trimmed)) {
    return trimmed;
  }
  try {
    return generateUrl({
      path: trimmed,
      transformations: { width: 800, height: 800, format: 'webp', quality: 80 },
    });
  } catch {
    return trimmed;
  }
}

function formatReviewMedia<T extends ReviewResponseDto>(review: T): T {
  if (!review) return review;

  if (review.user && typeof review.user === 'object' && review.user.avatar) {
    review.user.avatar = toPublicUrl(review.user.avatar);
  }

  if (review.product && typeof review.product === 'object') {
    const prod = review.product as unknown as Record<string, unknown>;
    if (typeof prod.primaryImage === 'string' && prod.primaryImage) {
      prod.primaryImage = toPublicUrl(prod.primaryImage);
    }

    if (Array.isArray(prod.colors)) {
      (prod.colors as Array<{ images?: Array<{ url: string }> }>).forEach((color) => {
        color.images?.forEach((img) => {
          if (img.url) {
            const resolved = toPublicUrl(img.url);
            if (resolved) img.url = resolved;
          }
        });
      });
    }
  }

  return review;
}

export class ReviewController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParsed = reviewQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        throw new ReviewFieldsError(queryParsed.error.flatten().fieldErrors);
      }

      const result = await reviewGetAll(queryParsed.data);
      result.items.forEach((review) => formatReviewMedia(review));

      res.status(200).json({
        success: true,
        message: 'Reviews fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getByProductId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      if (!productId || typeof productId !== 'string') {
        throw new ReviewRequestError('Product ID is required');
      }

      const result = await reviewGetByProductId(productId, page, limit);
      result.items.forEach((review) => formatReviewMedia(review));

      res.status(200).json({
        success: true,
        message: 'Product reviews fetched successfully',
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
      formatReviewMedia(updatedReview);

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
