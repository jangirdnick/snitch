/**
 * CreateProductForm.tsx
 *
 * Thin wrapper that wires useCreateProduct → ProductFormLayout for create mode.
 * All layout & UI lives in ProductFormLayout — this component is pure composition.
 */

import { memo } from 'react';
import { ProductFormLayout } from './ProductFormLayout';
import { useCreateProduct } from '../hook/useCreateProduct';

export const CreateProductForm = memo(function CreateProductForm() {
  const { form, onSubmit, handleCancel, confirmDiscard, cancelDiscard, isBlocked } =
    useCreateProduct();

  return (
    <ProductFormLayout
      mode="create"
      form={form}
      onSubmit={onSubmit}
      handleCancel={handleCancel}
      confirmDiscard={confirmDiscard}
      cancelDiscard={cancelDiscard}
      isBlocked={isBlocked}
    />
  );
});
