import { useState, useCallback, useEffect } from 'react';
import { fetchCoupons, deleteCoupon } from '../service/coupons.api';
import type { PaginatedCoupons } from '@snitch/types';
import { showToast } from '@/lib/toast';
import { useDebounce } from '@/hooks/useDebounce';
import { AxiosError } from 'axios';

export function useCoupons() {
  const [data, setData] = useState<PaginatedCoupons | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortValue, setSortValue] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadCoupons = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      const [sortField, sortOrder] = sortValue.split('-');

      try {
        const response = await fetchCoupons({
          page,
          limit: pageSize,
          search: debouncedSearch || undefined,
          status: statusFilter as 'all' | 'active' | 'inactive' | 'expired',
          sortField,
          sortOrder: sortOrder as 'asc' | 'desc',
        });

        if (response.success) {
          setData(response.data);
          setCurrentPage(page);
        } else {
          showToast.error(response.error?.message || 'Failed to fetch coupons');
        }
      } catch (err: unknown) {
        const error =
          err instanceof Error
            ? err.message
            : err instanceof AxiosError
              ? err.response?.data?.error?.message
              : 'Error fetching coupons';
        showToast.error(error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, statusFilter, sortValue],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCoupons(1);
  }, [loadCoupons]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      try {
        const response = await deleteCoupon(id);
        if (response.success) {
          showToast.success('Coupon deleted successfully');
          loadCoupons(currentPage);
          return true;
        } else {
          showToast.error(response.error?.message || 'Failed to delete coupon');
          return false;
        }
      } catch (err: unknown) {
        const error =
          err instanceof Error
            ? err.message
            : err instanceof AxiosError
              ? err.response?.data?.error?.message
              : 'Error deleting coupon';
        showToast.error(error);
        return false;
      }
    },
    [loadCoupons, currentPage],
  );

  return {
    items: data?.items || [],
    pagination: data?.pagination,
    loading,
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    statusFilter,
    setStatusFilter,
    sortValue,
    setSortValue,
    currentPage,
    loadCoupons,
    handleClearFilters,
    handleDeleteConfirm,
  };
}
