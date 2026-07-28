import { memo } from 'react';
import { CategoryFormLayout } from './CategoryFormLayout';
import { useEditCategory } from '../hook/useEditCategory';

interface EditCategoryFormProps {
  categoryId: string;
}

export const EditCategoryForm = memo(function EditCategoryForm({
  categoryId,
}: EditCategoryFormProps) {
  const {
    form,
    onSubmit,
    handleCancel,
    confirmDiscard,
    cancelDiscard,
    isBlocked,
    isLoadingCategory,
  } = useEditCategory(categoryId);

  return (
    <CategoryFormLayout
      mode="edit"
      form={form}
      onSubmit={onSubmit}
      handleCancel={handleCancel}
      confirmDiscard={confirmDiscard}
      cancelDiscard={cancelDiscard}
      isBlocked={isBlocked}
      isLoadingCategory={isLoadingCategory}
    />
  );
});
