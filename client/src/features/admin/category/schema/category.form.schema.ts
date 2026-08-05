import { z, createCategorySchema, CATEGORY_STATUS } from '@snitch/schemas';
import {
  isExistingImage,
  type ExistingImage,
  type ImageValue,
} from '@/features/admin/inventory/schema/product.form.schema';

export { CATEGORY_STATUS, isExistingImage, type ExistingImage, type ImageValue };

// Ensure client-side validation is aligned with server
export const categoryFormSchema = createCategorySchema.extend({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
  status: z.enum(CATEGORY_STATUS).default('active'),
  image: z.custom<ImageValue[]>().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryFormDefaultValues: Partial<CategoryFormValues> = {
  name: '',
  description: '',
  status: 'active',
  image: [],
};
