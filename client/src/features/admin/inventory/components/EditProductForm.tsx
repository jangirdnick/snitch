/**
 * EditProductForm.tsx
 *
 * Thin wrapper that wires useEditProduct → ProductFormLayout for edit mode.
 * All layout & UI lives in ProductFormLayout — this component is pure composition.
 */

import { memo } from 'react';
import { ProductFormLayout } from './ProductFormLayout';
import { useEditProduct } from '../hook/useEditProduct';

interface EditProductFormProps {
  productId: string;
}

export const EditProductForm = memo(function EditProductForm({ productId }: EditProductFormProps) {
  const {
    form,
    onSubmit,
    handleCancel,
    confirmDiscard,
    cancelDiscard,
    isBlocked,
    isLoadingProduct,
  } = useEditProduct(productId);

  return (
    <ProductFormLayout
      mode="edit"
      form={form}
      onSubmit={onSubmit}
      handleCancel={handleCancel}
      confirmDiscard={confirmDiscard}
      cancelDiscard={cancelDiscard}
      isBlocked={isBlocked}
      isLoadingProduct={isLoadingProduct}
    />
  );
});
