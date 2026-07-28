import { z } from 'zod';

export const CATEGORY_STATUS = ['active', 'inactive', 'archived'] as const;

// ─── Base Category Schema ─────────────────────────────────

const baseCategorySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),

  description: z.string().trim().max(500, 'Description must not exceed 500 characters').optional(),

  status: z.enum(CATEGORY_STATUS).default('active'),
});

// ─── Create & Update Schemas ──────────────────────────────

export const createCategorySchema = baseCategorySchema;

// Name and status are optional in update
export const updateCategorySchema = baseCategorySchema.partial();

// ─── Query Schema ─────────────────────────────────────────

export const categoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(CATEGORY_STATUS).optional(),
  sortBy: z.enum(['name', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Types ────────────────────────────────────────────────

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type CategoryQueryDto = z.infer<typeof categoryQuerySchema>;
