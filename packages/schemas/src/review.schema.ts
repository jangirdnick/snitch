import { z } from 'zod';

export const createReviewSchema = z.object({
  product: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product ID'),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(100),
  content: z.string().trim().min(10).max(1000),
});

export const updateReviewStatusSchema = z.object({
  status: z.enum(['active', 'blocked', 'reported'], {
    required_error: 'Status is required',
  }),
});

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  user: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid user ID')
    .optional(),
  product: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid product ID')
    .optional(),
  status: z.enum(['active', 'blocked', 'reported']).optional(),
  sortBy: z.enum(['createdAt', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
export type UpdateReviewStatusDto = z.infer<typeof updateReviewStatusSchema>;
export type ReviewQueryDto = z.infer<typeof reviewQuerySchema>;
