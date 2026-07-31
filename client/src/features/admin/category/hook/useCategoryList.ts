import { useState, useCallback, useEffect } from 'react';
import { categoryService, type Category } from '../service/category.api';
import type { CategoryQueryDto } from '@snitch/schemas';

export function useCategoryList(initialQuery?: CategoryQueryDto) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialQuery?.page ?? 1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Local query state
  const [search, setSearch] = useState(initialQuery?.search ?? '');
  const [status, setStatus] = useState(initialQuery?.status);

  const fetchCategories = useCallback(
    async (pageToFetch = currentPage) => {
      try {
        setLoading(true);
        const res = await categoryService.getAll({
          page: pageToFetch,
          limit: 50,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          search: search || undefined,
          status: status,
        });
        setCategories(res.items);
        setTotalItems(res.pagination.totalItems);
        setTotalPages(res.pagination.totalPages);
        setCurrentPage(res.pagination.currentPage);
        setHasNextPage(res.pagination.hasNextPage);
        setHasPreviousPage(res.pagination.hasPreviousPage);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, search, status],
  );

  // Initial fetch
  useEffect(() => {
    void (async () => {
      await fetchCategories(1);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]); // Re-fetch on filter change

  return {
    categories,
    loading,
    totalItems,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    search,
    setSearch,
    status,
    setStatus,
    fetchCategories,
  };
}
