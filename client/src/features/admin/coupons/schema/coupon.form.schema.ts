import { z, createCouponSchema } from '@snitch/schemas';

// Convert Date to local datetime-local string format (YYYY-MM-DDThh:mm)
export const toLocalISOString = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

export const couponFormSchema = createCouponSchema
  .omit({
    validFrom: true,
    validUntil: true,
    applicableProducts: true,
  })
  .extend({
    productsString: z.string().optional(),
    validFrom: z.string().min(1, 'Valid from is required'),
    validUntil: z.string().min(1, 'Valid until is required'),
    value: z.number({ invalid_type_error: 'Value is required' }).positive('Value must be positive'),
  });

export type CouponFormValues = z.infer<typeof couponFormSchema>;

export const getDefaultCouponValues = (): Partial<CouponFormValues> => ({
  code: '',
  type: 'PERCENTAGE',
  value: undefined,
  minOrder: undefined,
  maxDiscount: undefined,
  validFrom: toLocalISOString(new Date()),
  validUntil: toLocalISOString(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  usageLimit: undefined,
  isActive: true,
  productsString: '',
});
