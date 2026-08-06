import { api } from '@/lib/axiosInstance';
import type { CategoryQueryDto } from '@snitch/schemas';
import type { Category, PaginatedCategories } from '@snitch/types';
import {
  type CategoryFormValues,
  type ExistingImage,
  isExistingImage,
} from '../schema/category.form.schema';

export type { Category, PaginatedCategories as CategoryPaginatedResponse };

function buildCategoryFormData(values: CategoryFormValues): {
  formData: FormData;
  hasFile: boolean;
} {
  const formData = new FormData();
  const { image, ...rest } = values;

  let imageFile: File | null = null;
  let existingImage: ExistingImage | null = null;

  if (Array.isArray(image) && image.length > 0) {
    const img = image[0];
    if (isExistingImage(img)) {
      existingImage = img;
    } else {
      imageFile = img as File;
    }
  }

  const jsonPayload = {
    ...rest,
    ...(existingImage
      ? { image: existingImage }
      : Array.isArray(image) && image.length === 0
        ? { image: null }
        : {}),
  };

  formData.append('data', JSON.stringify(jsonPayload));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return { formData, hasFile: !!imageFile };
}

export const categoryService = {
  getAll: async (params?: Partial<CategoryQueryDto>): Promise<PaginatedCategories> => {
    const res = await api.get('/category', { params });
    return res.data.data;
  },

  getById: async (id: string): Promise<Category> => {
    const res = await api.get(`/category/id/${id}`);
    return res.data.data.category;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const res = await api.get(`/category/${slug}`);
    return res.data.data.category;
  },

  create: async (values: CategoryFormValues): Promise<Category> => {
    const { formData, hasFile } = buildCategoryFormData(values);
    let payload: FormData | Record<string, unknown> = formData;
    let headers: Record<string, string> = {};

    if (hasFile) {
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      const { image, ...rest } = values;
      const existingImg =
        Array.isArray(image) && image.length > 0 && isExistingImage(image[0]) ? image[0] : null;
      payload = { ...rest, image: existingImg };
    }

    const res = await api.post('/category', payload, { headers });
    return res.data.data.category;
  },

  update: async (id: string, values: CategoryFormValues): Promise<Category> => {
    const { formData, hasFile } = buildCategoryFormData(values);
    let payload: FormData | Record<string, unknown> = formData;
    let headers: Record<string, string> = {};

    if (hasFile) {
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      const { image, ...rest } = values;
      const existingImg =
        Array.isArray(image) && image.length > 0 && isExistingImage(image[0]) ? image[0] : null;
      payload = { ...rest, image: existingImg };
    }

    const res = await api.put(`/category/${id}`, payload, { headers });
    return res.data.data.category;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/category/${id}`);
  },
};
