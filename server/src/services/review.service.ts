import mongoose from 'mongoose';
import reviewModel, { type IReview } from '@/models/review.model.js';
import productModel from '@/models/product.model.js';
import { DatabaseOperationError } from '@/services/user.service.js';
import { mediaService } from '@/services/media.service.js';
import { createLogger } from '@/utils/logger.js';
import type { ReviewQueryDto, UpdateReviewStatusDto } from '@snitch/schemas';
import type { PaginatedReviews, ReviewResponseDto } from '@snitch/types';

const logger = createLogger('REVIEW-SERVICE');
const { generateUrl } = mediaService();

export class ReviewNotFoundError extends Error {
  public readonly statusCode = 404;
  constructor(identifier: string) {
    super(`Review not found: ${identifier}`);
    this.name = 'ReviewNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ReviewOperationError extends Error {
  public readonly statusCode = 500;
  constructor(operation: string, cause?: unknown) {
    super(`Review operation error: ${operation}`);
    this.name = 'ReviewOperationError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function isReviewError(error: unknown): boolean {
  return (
    error instanceof ReviewNotFoundError ||
    error instanceof ReviewOperationError ||
    error instanceof DatabaseOperationError
  );
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

function formatReviewMedia(review: Record<string, unknown>): Record<string, unknown> {
  if (!review) return review;
  const formatted = { ...review };

  if (formatted.user && typeof formatted.user === 'object') {
    const u = { ...(formatted.user as Record<string, unknown>) };
    if (typeof u.avatar === 'string' && u.avatar) {
      u.avatar = toPublicUrl(u.avatar);
    }
    formatted.user = u;
  }

  if (formatted.product && typeof formatted.product === 'object') {
    const p = { ...(formatted.product as Record<string, unknown>) };
    if (typeof p.primaryImage === 'string' && p.primaryImage) {
      p.primaryImage = toPublicUrl(p.primaryImage);
    }
    formatted.product = p;
  }

  return formatted;
}

export async function reviewGetAll(query: ReviewQueryDto): Promise<PaginatedReviews> {
  try {
    const filter: Record<string, unknown> = {};

    if (query.user) {
      filter.user = query.user;
    }
    if (query.product) {
      filter.product = query.product;
    }
    if (query.status) {
      filter.status = query.status;
    }

    const sortDir = query.sortOrder === 'asc' ? 1 : -1;
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      reviewModel
        .find(filter)
        .populate('user', 'id firstName lastName email avatar')
        .populate('product', 'id title slug primaryImage')
        .sort({ [query.sortBy]: sortDir, _id: 1 })
        .skip(skip)
        .limit(query.limit)
        .lean()
        .exec(),
      reviewModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    const mappedItems = items.map((item: IReview) => {
      const formatted = formatReviewMedia(item as unknown as Record<string, unknown>);
      return {
        id: formatted.id,
        user: formatted.user,
        product: formatted.product,
        rating: formatted.rating,
        title: formatted.title,
        content: formatted.content,
        isEdited: formatted.isEdited,
        status: formatted.status,
        createdAt: formatted.createdAt,
        updatedAt: formatted.updatedAt,
      };
    }) as unknown as ReviewResponseDto[];

    return {
      items: mappedItems,
      pagination: {
        currentPage: query.page,
        itemsPerPage: query.limit,
        totalItems: total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  } catch (error) {
    if (isReviewError(error)) throw error;
    logger.error({ err: error, query }, 'Error fetching reviews');
    throw new DatabaseOperationError('reviewGetAll', error);
  }
}

export async function reviewUpdateStatus(
  id: string,
  data: UpdateReviewStatusDto,
): Promise<ReviewResponseDto> {
  try {
    const review = await reviewModel
      .findOneAndUpdate(
        { id },
        { $set: { status: data.status } },
        { new: true, runValidators: true },
      )
      .populate('user', 'id firstName lastName email avatar')
      .populate('product', 'id title slug primaryImage')
      .lean()
      .exec();

    if (!review) {
      throw new ReviewNotFoundError(id);
    }

    // Sync rating after status update
    await syncProductReview(String(review.product)).catch((err: unknown) =>
      logger.error({ err }, 'Failed to sync rating after status update'),
    );

    const formatted = formatReviewMedia(review as unknown as Record<string, unknown>);

    return {
      id: formatted.id,
      user: formatted.user,
      product: formatted.product,
      rating: formatted.rating,
      title: formatted.title,
      content: formatted.content,
      isEdited: formatted.isEdited,
      status: formatted.status,
      createdAt: formatted.createdAt,
      updatedAt: formatted.updatedAt,
    } as unknown as ReviewResponseDto;
  } catch (error) {
    if (isReviewError(error)) throw error;
    logger.error({ err: error, id }, 'Error updating review status');
    throw new DatabaseOperationError('reviewUpdateStatus', error);
  }
}

export async function reviewDeleteById(id: string): Promise<void> {
  try {
    const review = await reviewModel.findOneAndDelete({ id }).exec();
    if (!review) {
      throw new ReviewNotFoundError(id);
    }

    // Sync rating after deletion
    await syncProductReview(String(review.product)).catch((err: unknown) =>
      logger.error({ err }, 'Failed to sync rating after deletion'),
    );
  } catch (error) {
    if (isReviewError(error)) throw error;
    logger.error({ err: error, id }, 'Error deleting review');
    throw new DatabaseOperationError('reviewDeleteById', error);
  }
}

export async function reviewGetByProductId(
  productId: string,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedReviews> {
  try {
    const filter: Record<string, unknown> = { product: productId, status: 'active' };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      reviewModel
        .find(filter)
        .populate('user', 'id firstName lastName avatar')
        .sort({ createdAt: -1, _id: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      reviewModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    const mappedItems = items.map((item: IReview) => {
      const formatted = formatReviewMedia(item as unknown as Record<string, unknown>);
      return {
        id: formatted.id,
        user: formatted.user,
        product: formatted.product,
        rating: formatted.rating,
        title: formatted.title,
        content: formatted.content,
        isEdited: formatted.isEdited,
        status: formatted.status,
        createdAt: formatted.createdAt,
        updatedAt: formatted.updatedAt,
      };
    }) as unknown as ReviewResponseDto[];

    return {
      items: mappedItems,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    if (isReviewError(error)) throw error;
    logger.error({ err: error, productId }, 'Error fetching reviews by product ID');
    throw new DatabaseOperationError('reviewGetByProductId', error);
  }
}

export async function syncProductReview(productId: string): Promise<void> {
  try {
    const filter = { product: new mongoose.Types.ObjectId(productId), status: 'active' as const };

    const result = await reviewModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$product',
          average: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    const reviewStats =
      result.length > 0
        ? { average: Number(result[0].average.toFixed(1)), count: result[0].count }
        : { average: 0, count: 0 };

    await productModel.findByIdAndUpdate(productId, {
      $set: { review: reviewStats },
    });
  } catch (error) {
    logger.error({ error, productId }, 'Failed to sync product review stats');
  }
}
