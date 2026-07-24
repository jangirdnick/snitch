import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useProduct } from './useProduct';
import { useDebounce } from '@/hooks/useDebounce';
import type { Product } from '@snitch/types';

export function useInventory() {
  const { handleGetAllProducts, handleDeleteProduct } = useProduct();
  const {
    items,
    loading,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage,
    hasPreviousPage,
  } = useAppSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortValue, setSortValue] = useState('createdAt-desc');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchProducts = useCallback(
    (page = 1) => {
      const [sortBy, sortOrder] = sortValue.split('-');
      const params: Record<string, string | number> = {
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter !== 'all') params.status = statusFilter;

      handleGetAllProducts(params);
    },
    [debouncedSearch, statusFilter, sortValue, pageSize, handleGetAllProducts],
  );

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
  }, []);

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      const success = await handleDeleteProduct(id);
      if (success) {
        fetchProducts(currentPage);
      }
      return success;
    },
    [handleDeleteProduct, fetchProducts, currentPage],
  );

  // Compute derived state memoized
  const activeCount = useMemo(
    () => items.filter((p: Product) => p.status === 'active').length,
    [items],
  );

  const outOfStockCount = useMemo(
    () => items.filter((p: Product) => p.status === 'out_of_stock').length,
    [items],
  );

  const draftCount = useMemo(
    () => items.filter((p: Product) => p.status === 'draft').length,
    [items],
  );

  return {
    // Redux State
    items: items as Product[],
    loading,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,

    // Local State
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    statusFilter,
    setStatusFilter,
    sortValue,
    setSortValue,

    // Derived State
    activeCount,
    outOfStockCount,
    draftCount,

    // Actions
    fetchProducts,
    handleClearFilters,
    handleDeleteConfirm,
  };
}
