import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../service/review.api';
import type {
  ReviewQueryDto,
  UpdateReviewStatusDto,
  UpdateUserReviewPermissionDto,
} from '@snitch/schemas';
import type { PaginatedReviews } from '@snitch/types';
import { showToast } from '@/lib/toast';
import { AxiosError } from 'axios';

export function useReviews(initialParams?: ReviewQueryDto) {
  const [data, setData] = useState<PaginatedReviews | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (params?: ReviewQueryDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reviewService.getAll(params);
      setData(response);
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error
          ? err.message
          : err instanceof AxiosError
            ? err.response?.data.message || err.response?.data.error
            : 'Failed to fetch reviews';
      setError(errMessage);
      showToast.error(errMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchReviews(initialParams);
    })();
  }, [fetchReviews, initialParams]);

  const updateReviewStatus = async (id: string, payload: UpdateReviewStatusDto) => {
    try {
      const updatedReview = await reviewService.updateStatus(id, payload);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) => (item.id === id ? updatedReview : item)),
        };
      });
      showToast.success('Review status updated successfully');
      return true;
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error
          ? err.message
          : err instanceof AxiosError
            ? err.response?.data.message || err.response?.data.error
            : 'Failed to update review status';
      setError(errMessage);
      showToast.error(errMessage);
      return false;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await reviewService.delete(id);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
          pagination: {
            ...prev.pagination,
            totalItems: prev.pagination.totalItems - 1,
          },
        };
      });
      showToast.success('Review deleted successfully');
      return true;
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error
          ? err.message
          : err instanceof AxiosError
            ? err.response?.data.message || err.response?.data.error
            : 'Failed to delete review';
      setError(errMessage);
      showToast.error(errMessage);
      return false;
    }
  };

  const updateUserPermission = async (userId: string, payload: UpdateUserReviewPermissionDto) => {
    try {
      const updatedUser = await reviewService.updateUserPermission(userId, payload);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) => {
            if (item.user.id === userId) {
              return {
                ...item,
                user: {
                  ...item.user,
                  canReview: updatedUser.canReview,
                },
              };
            }
            return item;
          }),
        };
      });
      showToast.success(
        `User review permission successfully ${payload.canReview ? 'granted' : 'revoked'}`,
      );
      return true;
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error
          ? err.message
          : err instanceof AxiosError
            ? err.response?.data.message || err.response?.data.error
            : 'Failed to update user review permission';
      setError(errMessage);
      showToast.error(errMessage);
      return false;
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchReviews,
    updateReviewStatus,
    deleteReview,
    updateUserPermission,
  };
}
