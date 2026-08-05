import type { ApiErrorResponse, ApiNormalResponse, ApiSuccess } from './api.type.js';
import type { CATEGORY_STATUS } from '@snitch/schemas';

export interface CategoryImage {
  path: string;
  url: string;
  alt?: string;
}

export interface Category {
  readonly _id: string;
  readonly id: string;
  name: string;
  slug: string;
  description?: string;
  image?: CategoryImage | null;
  status: (typeof CATEGORY_STATUS)[number];
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
}

export interface PaginatedCategories {
  items: Category[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type CategoryListResponse = ApiSuccess<PaginatedCategories> | ApiErrorResponse;
export type CategoryDetailResponse = ApiSuccess<{ category: Category }> | ApiErrorResponse;
export type CategoryCreateResponse = ApiSuccess<{ category: Category }> | ApiErrorResponse;
export type CategoryUpdateResponse = ApiSuccess<{ category: Category }> | ApiErrorResponse;
export type CategoryDeleteResponse = ApiNormalResponse | ApiErrorResponse;
