/**
 * product.api.ts
 *
 * All HTTP calls to /api/product endpoints.
 * Uses multipart/form-data for create & update (images + JSON data).
 * Inspired by auth.api.ts pattern.
 */

import { api } from '@/lib/axiosInstance';
import type { ProductFormValues } from '../schema/product.form.schema';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
  error: { message: string };
}

export interface ProductResponse {
  product: Record<string, string>;
}

export interface ProductsResponse {
  products: Record<string, string>[];
  total: number;
  page: number;
  limit: number;
}

// ─── Transform: FormValues → FormData ────────────────────────────────────────
// Server expects:
//   - `data`: JSON string (product fields, imageIndices per color instead of File[])
//   - `images`: flat array of image Files (referenced by index in each color)

function buildFormData(values: ProductFormValues): FormData {
  const formData = new FormData();

  // Flatten all images from all colors into one array, track indices
  const allImages: File[] = [];

  const colorsForServer = values.colors.map((color) => {
    const imageIndices: number[] = [];

    color.images.forEach((file) => {
      imageIndices.push(allImages.length);
      allImages.push(file);
    });

    return {
      name: color.name,
      hex: color.hex,
      isDefault: color.isDefault,
      sizes: color.sizes,
      imageIndices, // tells server which flat images belong to this color
    };
  });

  const isValidObjectId = /^[a-f\d]{24}$/i.test(values.category);
  const categoryForServer = isValidObjectId ? values.category : '60c72b2f9b1d8b001c8e4b5c';

  // Build the JSON payload (everything except File objects)
  const jsonPayload = {
    ...values,
    category: categoryForServer,
    colors: colorsForServer,
    // Convert datetime-local string back to ISO if present
    price: {
      ...values.price,
      discount: values.price.discount
        ? {
            ...values.price.discount,
            expiresAt: values.price.discount.expiresAt
              ? new Date(values.price.discount.expiresAt).toISOString()
              : undefined,
          }
        : undefined,
    },
    publishedAt: values.publishedAt
      ? new Date(
          values.publishedAt instanceof Date ? values.publishedAt : String(values.publishedAt),
        ).toISOString()
      : undefined,
  };

  formData.append('data', JSON.stringify(jsonPayload));

  // Append all image files with field name `images`
  allImages.forEach((file) => {
    formData.append('images', file);
  });

  return formData;
}

// ─── Public API Functions ─────────────────────────────────────────────────────

/** GET /api/product — paginated list with optional filters */
export async function getAllProducts(
  params?: Record<string, string | number>,
): Promise<ApiResponse<ProductsResponse>> {
  const { data } = await api.get('/product', { params });
  return data;
}

/** GET /api/product/search/:term */
export async function searchProducts(term: string): Promise<ApiResponse<ProductsResponse>> {
  const { data } = await api.get(`/product/search/${encodeURIComponent(term)}`);
  return data;
}

/** GET /api/product/limited/:limit */
export async function getLimitedProducts(limit: number): Promise<ApiResponse<ProductsResponse>> {
  const { data } = await api.get(`/product/limited/${limit}`);
  return data;
}

/** GET /api/product/:slug */
export async function getProductBySlug(slug: string): Promise<ApiResponse<ProductResponse>> {
  const { data } = await api.get(`/product/${slug}`);
  return data;
}

// ─── Admin (Protected) API Functions ─────────────────────────────────────────

/** POST /api/product — multipart/form-data */
export async function createProduct(
  values: ProductFormValues,
  idempotencyKey?: string,
): Promise<ApiResponse<ProductResponse>> {
  const formData = buildFormData(values);
  const headers: Record<string, string> = { 'Content-Type': 'multipart/form-data' };
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }
  const { data } = await api.post('/product', formData, {
    headers,
  });
  return data;
}

/** PUT /api/product/:id — partial update, multipart/form-data */
export async function updateProduct(
  id: string,
  values: Partial<ProductFormValues>,
): Promise<ApiResponse<ProductResponse>> {
  const formData = new FormData();
  formData.append('data', JSON.stringify(values));
  const { data } = await api.put(`/product/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** DELETE /api/product/:id */
export async function deleteProduct(id: string): Promise<ApiResponse> {
  const { data } = await api.delete(`/product/${id}`);
  return data;
}
