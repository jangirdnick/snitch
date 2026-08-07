import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20).toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive('Value must be positive'),
  minOrder: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  usageLimit: z.number().min(1).optional(),
  isActive: z.boolean().default(true),
  applicableProducts: z.array(z.string()).default([]),
});

export const updateCouponSchema = createCouponSchema.partial();

export const couponQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive', 'expired']).optional().default('all'),
  sortField: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateCouponDto = z.infer<typeof createCouponSchema>;
export type UpdateCouponDto = z.infer<typeof updateCouponSchema>;
export type CouponQueryDto = z.infer<typeof couponQuerySchema>;

export const validateCouponSchema = z.object({
  code: z.string().trim().toUpperCase(),
  orderAmount: z.number().positive(),
});

export type ValidateCouponDto = z.infer<typeof validateCouponSchema>;
