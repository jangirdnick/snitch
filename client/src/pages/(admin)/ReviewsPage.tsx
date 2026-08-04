import { useState, useCallback, useMemo } from 'react';
import { useReviews } from '@/features/admin/reviews/hook/useReviews';
import { PageHeader } from '@/components/ui/page-header';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { ReviewTableSection } from '@/features/admin/reviews/components/ReviewTableSection';
import { useDebounce } from '@/hooks/useDebounce';
import type { ReviewQueryDto } from '@snitch/schemas';
import { Star, MessageSquareQuote, ShieldAlert } from 'lucide-react';

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
    return params;
  }, [currentPage, statusFilter, sortBy, sortOrder]);

  const { data, isLoading, updateReviewStatus, deleteReview, updateUserPermission } =
    useReviews(queryParams);

  const items = useMemo(() => data?.items || [], [data?.items]);
  const totalReviews = data?.pagination.totalItems || items.length;

  // KPI Calculations
  const averageRating = useMemo(() => {
    if (!items.length) return '0.0';
    const sum = items.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / items.length).toFixed(1);
  }, [items]);

  const reportedCount = useMemo(() => {
    return items.filter((r) => r.status === 'reported' || r.status === 'blocked').length;
  }, [items]);

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
    <div className="space-y-4 md:space-y-6 h-full flex-1 flex flex-col justify-between overflow-y-auto">
      <PageHeader
        title="Reviews & Moderation"
        description="Monitor product ratings, customer feedback, and user review permissions."
      >
        <div className="grid max-md:grid-cols-2 grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Total Reviews Card */}
          <div className="flex-1 sm:flex-none flex items-center gap-2.5 bg-[oklch(1_0_0/0.03)] border border-[oklch(1_0_0/0.08)] rounded-xl px-3 sm:px-3.5 py-1.5 shadow-xs">
            <div className="bg-blue-500/20 text-blue-400 p-1.5 rounded-lg shrink-0">
              <MessageSquareQuote className="size-3.5" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-[oklch(0.55_0_0)] uppercase tracking-wider font-bold">
                Total Reviews
              </div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-[oklch(0.95_0_0)]">
                {totalReviews.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Average Rating Card */}
          <div className="flex-1 sm:flex-none flex items-center gap-2.5 bg-[oklch(1_0_0/0.03)] border border-[oklch(1_0_0/0.08)] rounded-xl px-3 sm:px-3.5 py-1.5 shadow-xs">
            <div className="bg-amber-500/20 text-amber-400 p-1.5 rounded-lg shrink-0">
              <Star className="size-3.5 fill-amber-400" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-[oklch(0.55_0_0)] uppercase tracking-wider font-bold">
                Avg Rating
              </div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-[oklch(0.95_0_0)]">
                {averageRating} / 5.0
              </div>
            </div>
          </div>

          {/* Moderation Alerts Card */}
          <div className="flex-1 max-md:col-span-2 sm:flex-none flex items-center gap-2.5 bg-[oklch(1_0_0/0.03)] border border-[oklch(1_0_0/0.08)] rounded-xl px-3 sm:px-3.5 py-1.5 shadow-xs">
            <div className="bg-red-500/20 text-red-400 p-1.5 rounded-lg shrink-0">
              <ShieldAlert className="size-3.5" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-[oklch(0.55_0_0)] uppercase tracking-wider font-bold">
                Flagged / Blocked
              </div>
              <div className="text-[12px] sm:text-[13px] font-semibold text-[oklch(0.95_0_0)]">
                {reportedCount} Items
              </div>
            </div>
          </div>
        </div>
      </PageHeader>

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
