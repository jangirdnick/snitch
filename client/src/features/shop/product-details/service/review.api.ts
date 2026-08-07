import { api } from '@/lib/axiosInstance';
import type { PaginatedReviews } from '@snitch/types';

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
  error?: { message: string };
}

export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ApiResponse<PaginatedReviews>> {
  const { data } = await api.get(`/review/product/${productId}`, {
    params: { page, limit },
  });
  return data;
}
