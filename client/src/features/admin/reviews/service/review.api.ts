import { api } from '@/lib/axiosInstance';
import type {
  ReviewQueryDto,
  UpdateReviewStatusDto,
  UpdateUserReviewPermissionDto,
} from '@snitch/schemas';
import type { PaginatedReviews, ReviewResponseDto, UserResponseDto } from '@snitch/types';

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
}

export const reviewService = {
  getAll: async (params?: ReviewQueryDto): Promise<PaginatedReviews> => {
    const res = await api.get<ApiResponse<PaginatedReviews>>('/review/admin', { params });
    return res.data.data;
  },

  updateStatus: async (id: string, data: UpdateReviewStatusDto): Promise<ReviewResponseDto> => {
    const res = await api.patch<ApiResponse<{ review: ReviewResponseDto }>>(
      `/review/admin/${id}/status`,
      data,
    );
    return res.data.data.review;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/review/admin/${id}`);
  },

  updateUserPermission: async (
    userId: string,
    data: UpdateUserReviewPermissionDto,
  ): Promise<UserResponseDto> => {
    const res = await api.patch<ApiResponse<{ user: UserResponseDto }>>(
      `/user/admin/${userId}/review-permission`,
      data,
    );
    return res.data.data.user;
  },
};
