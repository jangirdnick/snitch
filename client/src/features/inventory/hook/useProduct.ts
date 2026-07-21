/**
 * useProduct.ts
 *
 * Redux-connected hook for all product operations.
 * Dispatches to product.slice and calls product.api.
 * Inspired by useAuth.ts pattern.
 */

import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { AxiosError } from 'axios';
import {
  setProducts,
  setCurrentProduct,
  setLoading,
  setError,
  setMessage,
  clearError,
  clearMessage,
} from '../state/product.slice';
import {
  getAllProducts,
  searchProducts,
  getLimitedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../service/product.api';
import type { ProductFormValues } from '../schema/product.form.schema';
import type { FieldErrorItem } from '@/utils/form-errors.util';

// ─── Error helper (same pattern as useAuth) ───────────────────────────────────

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (error.response?.data?.error?.message as string) ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

function getErrorFields(error: unknown): FieldErrorItem[] | undefined {
  if (error instanceof AxiosError) {
    return error.response?.data?.error?.fields;
  }
  return undefined;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useProduct = () => {
  const dispatch = useAppDispatch();

  /** Fetch paginated/filtered products and store in Redux */
  const handleGetAllProducts = useCallback(
    async (params?: Record<string, string | number>) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const response = await getAllProducts(params);
        if (response.success) {
          dispatch(setProducts(response.data.products));
          return true;
        } else {
          dispatch(setError(response.error.message));
          return false;
        }
      } catch (error: unknown) {
        dispatch(setError(getErrorMessage(error)));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /** Search products by term */
  const handleSearchProducts = useCallback(
    async (term: string) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const response = await searchProducts(term);
        if (response.success) {
          dispatch(setProducts(response.data.products));
          return true;
        } else {
          dispatch(setError(response.error.message));
          return false;
        }
      } catch (error: unknown) {
        dispatch(setError(getErrorMessage(error)));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /** Fetch limited products (homepage, etc.) */
  const handleGetLimitedProducts = useCallback(
    async (limit: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const response = await getLimitedProducts(limit);
        if (response.success) {
          dispatch(setProducts(response.data.products));
          return true;
        } else {
          dispatch(setError(response.error.message));
          return false;
        }
      } catch (error: unknown) {
        dispatch(setError(getErrorMessage(error)));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /** Fetch a single product by slug and store as currentProduct */
  const handleGetProductBySlug = useCallback(
    async (slug: string) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const response = await getProductBySlug(slug);
        if (response.success) {
          dispatch(setCurrentProduct(response.data.product));
          return true;
        } else {
          dispatch(setError(response.error.message));
          return false;
        }
      } catch (error: unknown) {
        dispatch(setError(getErrorMessage(error)));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /** Create a new product — Admin only */
  const handleCreateProduct = useCallback(
    async (values: ProductFormValues, idempotencyKey?: string) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const response = await createProduct(values, idempotencyKey);
        if (response.success) {
          dispatch(setCurrentProduct(response.data.product));
          dispatch(setMessage(response.message));
          return { success: true as const };
        } else {
          dispatch(setError(response.error.message));
          return { success: false as const, message: response.error.message, fields: undefined };
        }
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        dispatch(setError(message));
        return { success: false as const, message, fields: getErrorFields(error) };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /** Update an existing product — Admin only */
  const handleUpdateProduct = useCallback(
    async (id: string, values: Partial<ProductFormValues>) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const response = await updateProduct(id, values);
        if (response.success) {
          dispatch(setCurrentProduct(response.data.product));
          dispatch(setMessage(response.message));
          return true;
        } else {
          dispatch(setError(response.error.message));
          return false;
        }
      } catch (error: unknown) {
        dispatch(setError(getErrorMessage(error)));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /** Delete a product — Admin only */
  const handleDeleteProduct = useCallback(
    async (id: string) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const response = await deleteProduct(id);
        if (response.success) {
          dispatch(setMessage(response.message));
          dispatch(clearMessage());
          return true;
        } else {
          dispatch(setError(response.error.message));
          return false;
        }
      } catch (error: unknown) {
        dispatch(setError(getErrorMessage(error)));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  return {
    handleGetAllProducts,
    handleSearchProducts,
    handleGetLimitedProducts,
    handleGetProductBySlug,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
};
