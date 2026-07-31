/**
 * EditProductPage.tsx
 *
 * Admin page for editing an existing product.
 * Route: /admin/inventory/edit/:productId
 *
 * productId = MongoDB _id (passed from InventoryPage via navigate()).
 * Delegates all logic to EditProductForm + useEditProduct.
 */

import { Navigate, useParams } from 'react-router';
import { EditProductForm } from '@/features/admin/inventory/components/EditProductForm';

export default function EditProductPage() {
  const { productId } = useParams<{ productId: string }>();

  if (!productId?.trim()) {
    return <Navigate to="/admin/inventory" replace />;
  }

  return (
    <div className="flex flex-col gap-2 lg:gap-4 h-full bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)]">
      <EditProductForm productId={productId} />
    </div>
  );
}
