import { useState, useCallback, useMemo } from 'react';
import { useReviews } from '@/features/admin/reviews/hook/useReviews';
import { ReviewHeader } from '@/features/admin/reviews/components/ReviewHeader';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { ReviewTableSection } from '@/features/admin/reviews/components/ReviewTableSection';
import { useDebounce } from '@/hooks/useDebounce';
import type { ReviewQueryDto } from '@snitch/schemas';

export default function ReviewsPage() {
  // Local filter states
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  type StatusFilterType = NonNullable<ReviewQueryDto['status']> | 'all';
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [sortValue, setSortValue] = useState('createdAt-desc');

  // Parse sorting
  const [sortBy, sortOrder] = useMemo(() => {
    const parts = sortValue.split('-');
    return [parts[0] as 'createdAt' | 'rating', parts[1] as 'asc' | 'desc'];
  }, [sortValue]);

  // Derived query parameters
  const [currentPage, setCurrentPage] = useState(1);
  const queryParams = useMemo(() => {
    const params: ReviewQueryDto = {
      page: currentPage,
      limit: 10,
      sortBy,
      sortOrder,
    };
    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }
    // We don't have a direct string text search on review API currently implemented
    // in the service, but if we did, we'd pass it here. The schema has user/product id.
    // For now we just pass what we can.
    return params;
  }, [currentPage, statusFilter, sortBy, sortOrder]);

  const { data, isLoading, updateReviewStatus, deleteReview, updateUserPermission } =
    useReviews(queryParams);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortValue('createdAt-desc');
    setCurrentPage(1);
  }, []);

  const handleUpdateStatus = async (id: string, status: 'active' | 'blocked' | 'reported') => {
    const success = await updateReviewStatus(id, { status });
    return success;
  };

  const handleDeleteConfirm = async (id: string) => {
    const success = await deleteReview(id);
    return success;
  };

  const handleToggleUserPermission = async (userId: string, currentPermission: boolean) => {
    const success = await updateUserPermission(userId, { canReview: !currentPermission });
    return success;
  };

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 lg:gap-6 h-screen bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-1 overflow-y-scroll">
      <ReviewHeader />

      <AdminFilters
        searchTerm={searchTerm}
        searchPlaceholder="Filter by user or product..."
        debouncedSearch={debouncedSearch}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val as StatusFilterType);
          setCurrentPage(1);
        }}
        statusOptions={[
          { label: 'All Status', value: 'all' },
          {
            label: 'Active',
            value: 'active',
            dotClass: 'bg-[oklch(0.70_0.15_160)] shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]',
          },
          {
            label: 'Reported',
            value: 'reported',
            dotClass: 'bg-[oklch(0.7_0.2_60)] shadow-[0_0_6px_oklch(0.7_0.2_60_/_0.6)]',
          },
          {
            label: 'Blocked',
            value: 'blocked',
            dotClass: 'bg-[oklch(0.65_0.20_22)] shadow-[0_0_6px_oklch(0.65_0.20_22_/_0.6)]',
          },
        ]}
        sortValue={sortValue}
        onSortChange={(val) => {
          setSortValue(val);
          setCurrentPage(1);
        }}
        sortOptions={[
          { label: 'Newest First', value: 'createdAt-desc' },
          { label: 'Oldest First', value: 'createdAt-asc' },
          { label: 'Rating: High to Low', value: 'rating-desc' },
          { label: 'Rating: Low to High', value: 'rating-asc' },
        ]}
        onClearFilters={handleClearFilters}
      />

      <ReviewTableSection
        items={data?.items || []}
        loading={isLoading}
        currentPage={data?.pagination.currentPage || 1}
        totalPages={data?.pagination.totalPages || 1}
        hasNextPage={data?.pagination.hasNextPage || false}
        hasPreviousPage={data?.pagination.hasPreviousPage || false}
        onPageChange={(page) => setCurrentPage(page)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteConfirm={handleDeleteConfirm}
        onToggleUserPermission={handleToggleUserPermission}
      />
    </div>
  );
}
