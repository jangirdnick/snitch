import { cn } from '@/lib/utils';
import { CouponsTable } from './CouponsTable';
import { AdminPagination } from '@/components/admin/AdminPagination';
import type { Coupon } from '@snitch/types';

interface CouponsTableSectionProps {
  items: Coupon[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onEdit: (coupon: Coupon) => void;
  onDeleteConfirm: (id: string) => Promise<boolean>;
}

export function CouponsTableSection({
  items,
  loading,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onEdit,
  onDeleteConfirm,
}: CouponsTableSectionProps) {
  return (
    <div
      className={cn(
        'group relative rounded-2xl flex-1 flex flex-col justify-between',
        'md:overflow-y-scroll md:min-h-0 md:h-full',
        'bg-gradient-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)]',
        'border border-[oklch(1_0_0_/_0.055)] hover:border-[oklch(1_0_0_/_0.11)]',
        'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'shadow-[0_4px_24px_oklch(0_0_0_/_0.35)] hover:shadow-[0_8px_32px_oklch(0_0_0_/_0.5)]',
        'mx-4 md:mx-6 lg:mx-0',
      )}
    >
      <CouponsTable
        coupons={items}
        isLoading={loading}
        onEdit={onEdit}
        onDeleteConfirm={onDeleteConfirm}
      />

      {totalPages > 1 && (
        <div className="border-t border-[oklch(1_0_0_/0.055)] px-4 py-3 shrink-0 bg-[oklch(1_0_0_/0.015)]">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
