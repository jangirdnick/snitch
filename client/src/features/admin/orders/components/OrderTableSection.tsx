import { useState, useEffect, useMemo, useCallback } from 'react';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { OrderTable } from './OrderTable';
import { useOrders } from '../hook/useOrders';
import { AdminPagination } from '@/components/admin/AdminPagination';
import type { OrderQueryDto } from '@snitch/schemas';
import { cn } from '@/lib/utils';

interface OrderTableSectionProps {
  initialStatus?: OrderQueryDto['status'];
}

export function OrderTableSection({ initialStatus }: OrderTableSectionProps) {
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortValue, setSortValue] = useState('createdAt-desc');
  const [page, setPage] = useState(1);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const queryParams = useMemo<OrderQueryDto>(
    () => ({
      limit: 10,
      page,
      status: statusFilter !== 'all' ? (statusFilter as OrderQueryDto['status']) : undefined,
      search: debouncedSearch || undefined,
      sortBy: sortValue.split('-')[0] as 'createdAt' | 'netAmount',
      sortOrder: sortValue.split('-')[1] as 'asc' | 'desc',
    }),
    [statusFilter, debouncedSearch, sortValue, page],
  );

  const { data, isLoading, error, updateOrderStatus, updateOrderTracking } = useOrders(queryParams);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter(initialStatus || 'all');
    setSortValue('createdAt-desc');
    setPage(1);
  }, [initialStatus]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        debouncedSearch={debouncedSearch}
        searchPlaceholder="Search order number or customer..."
        statusFilter={statusFilter}
        onStatusChange={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
        statusOptions={[
          { label: 'All Statuses', value: 'all' },
          { label: 'New', value: 'new' },
          { label: 'Processing', value: 'processing' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'Returned', value: 'returned' },
        ]}
        sortValue={sortValue}
        onSortChange={(v) => {
          setSortValue(v);
          setPage(1);
        }}
        sortOptions={[
          { label: 'Newest First', value: 'createdAt-desc' },
          { label: 'Oldest First', value: 'createdAt-asc' },
          { label: 'Amount: High to Low', value: 'netAmount-desc' },
          { label: 'Amount: Low to High', value: 'netAmount-asc' },
        ]}
        onClearFilters={handleClearFilters}
      />

      {error ? (
        <div className="p-4 bg-[oklch(0.12_0.01_260)] text-[oklch(0.6_0.18_22)] rounded-md border border-[oklch(0.2_0.02_260)] text-center">
          {error}
        </div>
      ) : (
        <div
          className={cn(
            'group relative rounded-2xl flex-1 flex flex-col justify-between',
            'md:overflow-y-scroll md:min-h-0 md:h-full',
            'bg-linear-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)]',
            'border border-[oklch(1_0_0/0.055)] hover:border-[oklch(1_0_0/0.11)]',
            'transition-all duration-500 ease-in-out',
            'shadow-[0_4px_24px_oklch(0_0_0/0.35)] hover:shadow-[0_8px_32px_oklch(0_0_0/0.5)]',
            'mx-4 md:mx-6 lg:mx-0',
          )}
        >
          <OrderTable
            orders={data?.items || []}
            isLoading={isLoading}
            onUpdateStatus={updateOrderStatus}
            onUpdateTracking={updateOrderTracking}
          />

          {data && data.totalPages > 1 && (
            <div className="border-t border-[oklch(1_0_0/0.055)] px-4 py-3 shrink-0 bg-[oklch(1_0_0/0.015)]">
              <AdminPagination
                currentPage={data.page}
                totalPages={data.totalPages}
                hasNextPage={data.page < data.totalPages}
                hasPreviousPage={data.page > 1}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
