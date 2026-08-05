import { useState, useCallback, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { showToast } from '@/lib/toast';
import { setFormErrors } from '@/utils/form-errors.util';
import { categoryService } from '../service/category.api';
import {
  categoryFormSchema,
  categoryFormDefaultValues,
  type CategoryFormValues,
} from '../schema/category.form.schema';
import { AxiosError } from 'axios';

export function useEditCategory(categoryId: string) {
  const navigate = useNavigate();
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as unknown as Resolver<CategoryFormValues>,
    defaultValues: categoryFormDefaultValues as CategoryFormValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    let mounted = true;

    async function loadCategory() {
      try {
        const category = await categoryService.getById(categoryId);
        if (!mounted) return;

        form.reset({
          name: category.name,
          description: category.description || '',
          status: category.status,
          image: category.image?.url
            ? [{ url: category.image.url, alt: category.image.alt || '' }]
            : [],
        });
      } catch (error: unknown) {
        if (!mounted) return;
        const errMessage =
          error instanceof Error ? error.message : 'Category not found or failed to load';
        showToast.error(errMessage);
        navigate('/admin/categories');
      } finally {
        if (mounted) setIsLoadingCategory(false);
      }
    }

    if (categoryId) {
      loadCategory();
    }

    return () => {
      mounted = false;
    };
  }, [categoryId, form, navigate]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await categoryService.update(categoryId, data);
      showToast.success('Category updated successfully!');

      // Reset form so isDirty becomes false to prevent block modal
      form.reset(data);

      navigate('/admin/categories');
    } catch (error: unknown) {
      const fieldsError = error instanceof AxiosError && error.response?.data.failed;
      const errorMessage =
        error instanceof AxiosError ? error.response?.data.message : 'Failed to update category';
      if (fieldsError) {
        setFormErrors(fieldsError, form.setError);
        showToast.error('Please check the form for errors.');
      } else {
        showToast.error(errorMessage);
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
    isLoadingCategory,
  };
}
