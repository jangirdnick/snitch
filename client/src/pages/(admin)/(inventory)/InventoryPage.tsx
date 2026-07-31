import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useInventory } from '@/features/admin/inventory/hook/useInventory';
import { InventoryHeader } from '@/features/admin/inventory/components/InventoryHeader';
import { InventoryStats } from '@/features/admin/inventory/components/InventoryStats';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { InventoryTableSection } from '@/features/admin/inventory/components/InventoryTableSection';
import type { Product } from '@snitch/types';

export default function InventoryPage() {
  const navigate = useNavigate();
  const {
    // Redux State
    items,
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
  } = useInventory();

  const handleCreateClick = useCallback(() => {
    navigate('/admin/inventory/create');
  }, [navigate]);

  const handleCreateCategoryClick = useCallback(() => {
    navigate('/admin/categories/create');
  }, [navigate]);

  const handleEditClick = useCallback(
    (product: Product) => {
      const idToUse = product._id;
      navigate(`/admin/inventory/edit/${idToUse}`);
    },
    [navigate],
  );

  const handleViewClick = useCallback(
    (product: Product) => {
      navigate(`/admin/inventory/${product.sku}`);
    },
    [navigate],
  );

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 lg:gap-6 h-screen bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-1 overflow-y-scroll">
      <InventoryHeader
        onCreateClick={handleCreateClick}
        onCreateCategoryClick={handleCreateCategoryClick}
      />

      <InventoryStats
        totalItems={totalItems ?? items.length}
        activeCount={activeCount}
        outOfStockCount={outOfStockCount}
        draftCount={draftCount}
        loading={loading}
      />

      <AdminFilters
        searchTerm={searchTerm}
        searchPlaceholder="Search by name or SKU..."
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
            label: 'Draft',
            value: 'draft',
            dotClass: 'bg-[oklch(0.55_0_0)] shadow-[0_0_6px_oklch(0.55_0_0_/_0.6)]',
          },
          {
            label: 'Inactive',
            value: 'inactive',
            dotClass: 'bg-[oklch(0.42_0_0)] shadow-[0_0_6px_oklch(0.42_0_0_/_0.4)]',
          },
          {
            label: 'Out of Stock',
            value: 'out_of_stock',
            dotClass: 'bg-[oklch(0.65_0.20_22)] shadow-[0_0_6px_oklch(0.65_0.20_22_/_0.6)]',
          },
        ]}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOptions={[
          { label: 'Newest First', value: 'createdAt-desc' },
          { label: 'Oldest First', value: 'createdAt-asc' },
          { label: 'Price: High to Low', value: 'price-desc' },
          { label: 'Price: Low to High', value: 'price-asc' },
          { label: 'Best Selling', value: 'soldCount-desc' },
        ]}
        onClearFilters={handleClearFilters}
      />

      <InventoryTableSection
        items={items}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={fetchProducts}
        onEdit={handleEditClick}
        onView={handleViewClick}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
