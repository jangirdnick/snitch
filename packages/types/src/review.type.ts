import type { UserResponseDto } from './user.type.js';
import type { Product } from './product.type.js';

export interface Review {
  id: string;
  user: UserResponseDto | string;
  product: Product | string;
  rating: number;
  title: string;
  content: string;
  isEdited: boolean;
  status: 'active' | 'blocked' | 'reported';
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewResponseDto {
  id: string;
  user: UserResponseDto;
  product: {
    id: string;
    title: string;
    slug: string;
    primaryImage?: string;
  };
  rating: number;
  title: string;
  content: string;
  isEdited: boolean;
  status: 'active' | 'blocked' | 'reported';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedReviews {
  items: ReviewResponseDto[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
