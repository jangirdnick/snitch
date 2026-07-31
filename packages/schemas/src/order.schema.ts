import { z } from 'zod';

export const orderStatusEnum = z.enum([
  'new',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
]);

export const paymentStatusEnum = z.enum(['pending', 'paid', 'failed', 'refunded']);
export const paymentMethodEnum = z.enum(['cod', 'card', 'upi', 'netbanking', 'mock']);

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: orderStatusEnum.optional(),
  sortBy: z.enum(['createdAt', 'netAmount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
  note: z.string().optional(),
});

export const updateOrderTrackingSchema = z.object({
  trackingId: z.string().min(1, 'Tracking ID is required'),
  carrier: z.string().min(1, 'Carrier is required'),
});

export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
export type UpdateOrderTrackingDto = z.infer<typeof updateOrderTrackingSchema>;
