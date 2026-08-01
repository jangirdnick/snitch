/**
 * useEditProduct.ts
 *
 * Orchestrates the Edit Product form.
 * Business logic fully decoupled from UI — mirrors useCreateProduct but:
 *   - Fetches existing product by ID on mount
 *   - Populates form via reset() with mapProductToFormValues()
 *   - Calls handleUpdateProduct instead of handleCreateProduct on submit
 *   - Exposes `isLoadingProduct` state for skeleton loading
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useBlocker } from 'react-router';
import { showToast } from '@/lib/toast';
import {
  productFormSchema,
  productFormDefaultValues,
  type ProductFormValues,
  type ExistingImage,
} from '../schema/product.form.schema';
import { useProduct } from './useProduct';
import { getProductById } from '../service/product.api';
import { setFormErrors } from '@/utils/form-errors.util';
import type { Product, ProductColorVariant, ProductImage } from '@snitch/types';

// ─── Data mapper — Product (server) → ProductFormValues (client) ──────────────

/**
 * Maps a server Product entity to the client form schema.
 *
 * Key conversions:
 *   - colors[].images: ProductImage[] → ExistingImage[] (satisfies ImageValue union)
 *   - price.discount.expiresAt: Date → datetime-local string
 *   - publishedAt: Date → datetime-local string
 *   - category: ObjectId → string (already a string in the response)
 */
function mapProductToFormValues(product: Product): ProductFormValues {
  const toDatetimeLocal = (date?: Date | string | null): string | undefined => {
    if (!date) return undefined;
    try {
      const d = new Date(date as string);
      // datetime-local format: "YYYY-MM-DDTHH:mm"
      return d.toISOString().slice(0, 16);
    } catch {
      return undefined;
    }
  };

  const colors = product.colors.map((color: ProductColorVariant) => ({
    name: color.name,
    hex: color.hex,
    isDefault: color.isDefault ?? false,
    sizes: color.sizes.map((s) => ({
      size: s.size,
      stock: s.stock ?? 0,
      sku: s.sku,
    })),
    // Existing server images become ExistingImage objects in the form
    images: color.images.map((img: ProductImage): ExistingImage => ({
      url: img.url,
      alt: img.alt ?? '',
      isPrimary: img.isPrimary ?? false,
      order: img.order ?? 0,
    })),
  }));

  const parseCategory = (c: Product | string | unknown) => {
    if (c == null) return '';
    return typeof c === 'object' && c !== null
      ? String((c as { _id?: string })._id || c)
      : String(c);
  };

  return {
    title: product.title ?? '',
    description: product.description ?? '',
    shortDescription: product.shortDescription ?? '',
    sku: product.sku ?? '',
    category: Array.isArray(product.category)
      ? product.category.map(parseCategory).filter(Boolean)
      : product.category
        ? [parseCategory(product.category)].filter(Boolean)
        : [],

    tags: product.tags ?? [],
    gender: product.gender,
    ageGroup: product.ageGroup ?? 'adult',

    fit: product.fit,
    fabric: product.fabric ?? '',
    careInstructions:
      (product as unknown as { careInstructions?: string[] }).careInstructions ?? [],
    pattern: product.pattern,
    occasion: product.occasion ?? [],
    season: product.season ?? [],
    neckType: product.neckType,
    sleeveType: product.sleeveType,
    clothingLength: product.clothingLength,
    countryOfOrigin: product.countryOfOrigin ?? 'India',

    price: {
      amount: product.price?.amount ?? 0,
      compareAtAmount: product.price?.compareAtAmount,
      currency: product.price?.currency ?? 'INR',
      discount: product.price?.discount
        ? {
            type: product.price.discount.type,
            value: product.price.discount.value,
            expiresAt: toDatetimeLocal(product.price.discount.expiresAt as unknown as string),
          }
        : undefined,
    },
    lowStockThreshold: product.lowStockThreshold ?? 5,

    status: product.status ?? 'draft',

    colors: colors as ProductFormValues['colors'],

    seo: {
      metaTitle: product.seo?.metaTitle ?? '',
      metaDescription: product.seo?.metaDescription ?? '',
      keywords: product.seo?.keywords ?? [],
    },

    publishedAt: toDatetimeLocal(product.publishedAt as unknown as string) as Date | undefined,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEditProduct(productId: string) {
  const navigate = useNavigate();
  const { handleUpdateProduct } = useProduct();

  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Track whether the form has been seeded with server data
  const seededRef = useRef(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: productFormDefaultValues as ProductFormValues,
    mode: 'onTouched',
  });

  // Destructure stable RHF methods so they can be used directly in dep arrays.
  // react-hook-form guarantees these references are stable across renders.
  const { reset: formReset, setError: formSetError } = form;

  const {
    formState: { isDirty, isSubmitting },
  } = form;

  // ─── Fetch existing product and seed the form ──────────────────────────────
  useEffect(() => {
    if (seededRef.current) return;

    let cancelled = false;

    async function loadProduct() {
      setIsLoadingProduct(true);
      setLoadError(null);

      try {
        const response = await getProductById(productId);

        if (cancelled) return;

        if (!response.success || !('data' in response)) {
          throw new Error('Failed to load product');
        }

        const formValues = mapProductToFormValues(response.data.product);
        formReset(formValues);
        seededRef.current = true;
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Failed to load product';
        setLoadError(message);
        showToast.error('Failed to load product', { description: message });
      } finally {
        if (!cancelled) setIsLoadingProduct(false);
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
    // formReset is a stable reference from react-hook-form.
  }, [productId, formReset]);

  // ─── Block navigation when form has unsaved changes ────────────────────────
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        isDirty && !isSubmitting && currentLocation.pathname !== nextLocation.pathname,
      [isDirty, isSubmitting],
    ),
  );

  // ─── Submit handler ────────────────────────────────────────────────────────
  const onSubmit = useCallback(
    async (data: ProductFormValues) => {
      // Exclude sku (server omits it from updateProductSchema)
      const { sku: _sku, ...updatePayload } = data;
      void _sku;

      const response = await handleUpdateProduct(productId, updatePayload);

      if (response.success) {
        showToast.success('Product updated successfully!', {
          description: `"${data.title}" has been saved as ${data.status}.`,
        });
        // Reset the form BEFORE navigating so isDirty becomes false.
        // Without this, useBlocker sees isDirty=true after isSubmitting drops
        // to false and intercepts the programmatic navigate() with the discard dialog.
        formReset(data);
        navigate('/admin/inventory', { replace: true });
      } else {
        if (response.fields && response.fields.length > 0) {
          setFormErrors(response.fields, formSetError);
        } else {
          showToast.error('Failed to update product', {
            description: response.message || 'An unexpected error occurred. Please try again.',
          });
        }
      }
    },
    [handleUpdateProduct, productId, navigate, formReset, formSetError],
  );

  const handleCancel = useCallback(() => {
    navigate('/admin/inventory');
  }, [navigate]);

  const confirmDiscard = useCallback(() => {
    if (blocker.state === 'blocked') {
      blocker.proceed();
    } else {
      navigate('/admin/inventory');
    }
  }, [blocker, navigate]);

  const cancelDiscard = useCallback(() => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  }, [blocker]);

  return {
    form,
    onSubmit,
    handleCancel,
    confirmDiscard,
    cancelDiscard,
    isBlocked: blocker.state === 'blocked',
    isSubmitting,
    isDirty,
    isLoadingProduct,
    loadError,
  };
}
