import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { CouponsTableSection } from '@/features/admin/coupons/components/CouponsTableSection';
import { CouponFormModal } from '@/features/admin/coupons/components/CouponFormModal';
import { useCoupons } from '@/features/admin/coupons/hook/useCoupons';
import type { Coupon } from '@snitch/types';
import { cn } from '@/lib/utils';

export default function CouponsPage() {
  const {
    items,
    pagination,
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
  } = useCoupons();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleCreate = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    loadCoupons(currentPage);
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 lg:gap-6 h-screen bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-1 overflow-y-scroll">
      <PageHeader
        title="Coupons Management"
        description="Create and manage discount codes, validity periods, and usage limits"
      >
        <Button
          onClick={handleCreate}
          className={cn(
            'group relative shrink-0 overflow-hidden rounded-xl h-10 px-3.5 sm:px-4',
            'bg-orange-800 text-[oklch(0.98_0_0)] hover:bg-orange-700',
            'font-semibold text-[12px] sm:text-[12.5px] tracking-wide',
            'shadow-[0_2px_12px_oklch(1_0_0_/0.12)] hover:shadow-[0_6px_20px_oklch(1_0_0_/0.22)]',
            'transition-all duration-300 ease-in-out active:scale-[0.98]',
            'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          )}
        >
          <Plus
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          <span className="font-semibold text-sm">Create Coupon</span>
        </Button>
      </PageHeader>

      <AdminFilters
        searchTerm={searchTerm}
        searchPlaceholder="Search by coupon code..."
        debouncedSearch={debouncedSearch}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { label: 'All Status', value: 'all' },
          {
            label: 'Active',
            value: 'active',
            dotClass: 'bg-[oklch(0.70_0.15_160)] shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]',
          },
          {
            label: 'Expired',
            value: 'expired',
            dotClass: 'bg-[oklch(0.65_0.20_22)] shadow-[0_0_6px_oklch(0.65_0.20_22_/_0.6)]',
          },
          {
            label: 'Inactive',
            value: 'inactive',
            dotClass: 'bg-[oklch(0.42_0_0)] shadow-[0_0_6px_oklch(0.42_0_0_/_0.4)]',
          },
        ]}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOptions={[
          { label: 'Newest First', value: 'createdAt-desc' },
          { label: 'Oldest First', value: 'createdAt-asc' },
          { label: 'Usage: High to Low', value: 'usedCount-desc' },
          { label: 'Value: High to Low', value: 'value-desc' },
        ]}
        onClearFilters={handleClearFilters}
      />

      <CouponsTableSection
        items={items}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={pagination?.hasNextPage || false}
        hasPreviousPage={pagination?.hasPreviousPage || false}
        onPageChange={(page) => loadCoupons(page)}
        onEdit={handleEdit}
        onDeleteConfirm={handleDeleteConfirm}
      />

      <CouponFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        coupon={editingCoupon}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
