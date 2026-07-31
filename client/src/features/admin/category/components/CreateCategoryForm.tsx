import { memo } from 'react';
import { CategoryFormLayout } from './CategoryFormLayout';
import { useCreateCategory } from '../hook/useCreateCategory';

export const CreateCategoryForm = memo(function CreateCategoryForm() {
  const { form, onSubmit, handleCancel, confirmDiscard, cancelDiscard, isBlocked } =
    useCreateCategory();

  return (
    <CategoryFormLayout
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
