/**
 * useCreateProduct.ts
 *
 * Orchestrates the Create Product form.
 * Business logic is fully decoupled from UI.
 * Connected to useProduct hook → product.api.ts → /api/product
 */

import { useCallback, useRef } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useBlocker } from 'react-router';
import { showToast } from '@/lib/toast';
import {
  productFormSchema,
  productFormDefaultValues,
  type ProductFormValues,
} from '../schema/product.form.schema';
import { useProduct } from './useProduct';
import { setFormErrors } from '@/utils/form-errors.util';

export function useCreateProduct() {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();

  // Persist an idempotency key per form lifecycle.
  // It only resets when a product is successfully created.
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: productFormDefaultValues as ProductFormValues,
    mode: 'onTouched',
  });

  const {
    formState: { isDirty, isSubmitting },
  } = form;

  // ─── Block navigation when form has unsaved changes ───────────────────────────
  useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        isDirty && !isSubmitting && currentLocation.pathname !== nextLocation.pathname,
      [isDirty, isSubmitting],
    ),
  );

  // ─── Submit handler ────────────────────────────────────────────────────────────
  const onSubmit = useCallback(
    async (data: ProductFormValues) => {
      const response = await handleCreateProduct(data, idempotencyKeyRef.current);

      if (response.success) {
        showToast.success('Product created successfully!', {
          description: `"${data.title}" has been saved as a ${data.status}.`,
        });

        // Reset the idempotency key for the next product
        idempotencyKeyRef.current = crypto.randomUUID();
        navigate('/admin/inventory', { replace: true });
      } else {
        if (response.fields && response.fields.length > 0) {
          setFormErrors(response.fields, form.setError);
        } else {
          showToast.error('Failed to create product', {
            description: response.message || 'An unexpected error occurred. Please try again.',
          });
        }
      }
    },
    [handleCreateProduct, navigate, form.setError],
  );

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate('/admin/inventory');
  }, [isDirty, navigate]);

  return {
    form,
    onSubmit,
    handleCancel,
    isSubmitting,
    isDirty,
  };
}
