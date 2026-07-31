import reviewModel, { type IReview } from '@/models/review.model.js';
import { DatabaseOperationError } from '@/services/user.service.js';
import { createLogger } from '@/utils/logger.js';
import type { ReviewQueryDto, UpdateReviewStatusDto } from '@snitch/schemas';
import type { PaginatedReviews, ReviewResponseDto } from '@snitch/types';

const logger = createLogger('REVIEW-SERVICE');

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

    // Mongoose populate changes _id. We'll map the shape correctly for Dto.
    const mappedItems = items.map((item: IReview) => ({
      id: item.id,
      user: item.user,
      product: item.product,
      rating: item.rating,
      title: item.title,
      content: item.content,
      isEdited: item.isEdited,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })) as unknown as ReviewResponseDto[];

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

    return {
      id: review.id,
      user: review.user,
      product: review.product,
      rating: review.rating,
      title: review.title,
      content: review.content,
      isEdited: review.isEdited,
      status: review.status,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
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
  } catch (error) {
    if (isReviewError(error)) throw error;
    logger.error({ err: error, id }, 'Error deleting review');
    throw new DatabaseOperationError('reviewDeleteById', error);
  }
}
