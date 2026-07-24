import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useInventory } from '@/features/inventory/hook/useInventory';
import { InventoryHeader } from '@/features/inventory/components/InventoryHeader';
import { InventoryStats } from '@/features/inventory/components/InventoryStats';
import { InventoryFilters } from '@/features/inventory/components/InventoryFilters';
import { InventoryTableSection } from '@/features/inventory/components/InventoryTableSection';
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

  const handleEditClick = useCallback(
    (product: Product) => {
      const idToUse = product.id;
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
    <div className="flex flex-col gap-5 lg:gap-6 min-h-screen bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)] pb-4">
      <InventoryHeader onCreateClick={handleCreateClick} />

      <InventoryStats
        totalItems={totalItems ?? items.length}
        activeCount={activeCount}
        outOfStockCount={outOfStockCount}
        draftCount={draftCount}
        loading={loading}
      />

      <InventoryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        debouncedSearch={debouncedSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortValue={sortValue}
        onSortChange={setSortValue}
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
