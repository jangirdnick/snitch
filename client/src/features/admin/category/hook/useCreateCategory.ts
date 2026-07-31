import { useState, useCallback } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { showToast } from '@/lib/toast';
import { setFormErrors, type FieldErrorItem } from '@/utils/form-errors.util';
import { categoryService } from '../service/category.api';
import {
  categoryFormSchema,
  categoryFormDefaultValues,
  type CategoryFormValues,
} from '../schema/category.form.schema';
import { AxiosError } from 'axios';

export function useCreateCategory() {
  const navigate = useNavigate();
  const [isBlocked, setIsBlocked] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as Resolver<CategoryFormValues>,
    defaultValues: categoryFormDefaultValues as CategoryFormValues,
    mode: 'onTouched',
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await categoryService.create(data);
      showToast.success('Category created successfully!');

      // Reset form so isDirty becomes false to prevent block modal
      form.reset(data);

      navigate('/admin/categories');
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : error instanceof AxiosError
            ? error.response?.data.message
            : 'Failed to create category';

      const fieldsError =
        error instanceof AxiosError && (error.response?.data?.error?.fields as FieldErrorItem[]);
      if (fieldsError) {
        setFormErrors(fieldsError, form.setError);
        showToast.error('Please check the form for errors.');
      } else {
        showToast.error(errMessage);
      }
    }
  };

  const handleCancel = useCallback(() => {
    if (form.formState.isDirty) {
      setIsBlocked(true);
    } else {
      navigate('/admin/categories');
    }
  }, [form.formState.isDirty, navigate]);

  const confirmDiscard = useCallback(() => {
    setIsBlocked(false);
    navigate('/admin/categories');
  }, [navigate]);

  const cancelDiscard = useCallback(() => {
    setIsBlocked(false);
  }, []);

  return {
    form,
    onSubmit,
    handleCancel,
    confirmDiscard,
    cancelDiscard,
    isBlocked,
  };
}
