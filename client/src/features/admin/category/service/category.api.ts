import { api } from '@/lib/axiosInstance';
import type { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from '@snitch/schemas';

export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  // status: 'active' | 'inactive' | 'archived';
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPaginatedResponse {
  items: Category[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const categoryService = {
  getAll: async (params?: CategoryQueryDto): Promise<CategoryPaginatedResponse> => {
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

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const res = await api.post('/category', data);
    return res.data.data.category;
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const res = await api.put(`/category/${id}`, data);
    return res.data.data.category;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/category/${id}`);
  },
};
