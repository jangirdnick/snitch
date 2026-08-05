import type { ICategory } from '@/models/category.model.js';
import categoryModel from '@/models/category.model.js';
import { createLogger } from '@/utils/logger.js';
import { DatabaseOperationError } from './user.service.js';
import type { CreateCategoryDto, CategoryQueryDto, UpdateCategoryDto } from '@snitch/schemas';

const logger = createLogger('CATEGORY-SERVICE');

export class CategoryNotFoundError extends Error {
  public readonly statusCode = 404;
  public readonly identifier: string;

  constructor(identifier: string, message?: string) {
    super(message ?? `Category not found: ${identifier}`);
    this.name = 'CategoryNotFoundError';
    this.identifier = identifier;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CategoryOperationError extends Error {
  public readonly statusCode = 500;

  constructor(operation: string, cause?: unknown) {
    super(`Category operation failed: ${operation}`);
    this.name = 'CategoryOperationError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function isCategoryError(error: unknown): boolean {
  return (
    error instanceof CategoryNotFoundError ||
    error instanceof CategoryOperationError ||
    error instanceof DatabaseOperationError
  );
}

export interface PaginatedCategories {
  items: ICategory[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function getCategories(query: CategoryQueryDto): Promise<PaginatedCategories> {
  try {
    const filter: Record<string, unknown> = {};

    if (query.search) filter.$text = { $search: query.search };
    if (query.status) filter.status = query.status;

    const sortField = query.sortBy === 'name' ? 'name' : 'createdAt';
    const sortDir = query.sortOrder === 'asc' ? 1 : -1;

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      categoryModel
        .find(filter)
        .select('id name slug description image status createdAt updatedAt')
        .sort({ [sortField]: sortDir, _id: 1 })
        .skip(skip)
        .limit(query.limit)
        .lean()
        .exec() as unknown as ICategory[],
      categoryModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      items,
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
    if (isCategoryError(error)) throw error;
    logger.error({ err: error, query }, 'Error fetching categories');
    throw new DatabaseOperationError('While fetching categories');
  }
}

export async function getCategoryBySlug(slug: string): Promise<ICategory> {
  try {
    const category = (await categoryModel
      .findOne({ slug })
      .lean()
      .exec()) as unknown as ICategory | null;

    if (!category) throw new CategoryNotFoundError(slug);
    return category;
  } catch (error) {
    if (isCategoryError(error)) throw error;
    logger.error({ err: error, slug }, 'Error fetching category by slug');
    throw new DatabaseOperationError('While fetching category by slug');
  }
}

export async function getCategoryById(id: string): Promise<ICategory> {
  try {
    const category = (await categoryModel
      .findById(id)
      .lean()
      .exec()) as unknown as ICategory | null;

    if (!category) throw new CategoryNotFoundError(id);
    return category;
  } catch (error) {
    if (isCategoryError(error)) throw error;
    logger.error({ err: error, id }, 'Error fetching category by id');
    throw new DatabaseOperationError('While fetching category by id');
  }
}

export async function categoryCreate(params: CreateCategoryDto): Promise<ICategory> {
  try {
    const created = await categoryModel.create(params);
    return created as unknown as ICategory;
  } catch (error) {
    if (isCategoryError(error)) throw error;
    logger.error({ err: error }, 'Error creating category');
    throw new DatabaseOperationError('Failed to create category');
  }
}

export async function categoryUpdate({
  categoryId,
  category,
}: {
  categoryId: string;
  category: UpdateCategoryDto;
}): Promise<ICategory> {
  try {
    const updated = (await categoryModel
      .findByIdAndUpdate(categoryId, { $set: category }, { new: true, runValidators: true })
      .lean()) as unknown as ICategory | null;

    if (!updated) throw new CategoryNotFoundError(categoryId);
    return updated;
  } catch (error) {
    if (isCategoryError(error)) throw error;
    logger.error({ err: error, categoryId }, 'Error updating category');
    throw new DatabaseOperationError('Failed to update category');
  }
}

export async function categoryDeleteById(categoryId: string): Promise<void> {
  try {
    const result = await categoryModel.findByIdAndDelete(categoryId);
    if (!result) throw new CategoryNotFoundError(categoryId);
  } catch (error) {
    if (isCategoryError(error)) throw error;
    logger.error({ err: error, categoryId }, 'Error deleting category');
    throw new DatabaseOperationError('Failed to delete category');
  }
}
