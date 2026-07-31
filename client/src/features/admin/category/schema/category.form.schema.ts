import { z, createCategorySchema, CATEGORY_STATUS } from '@snitch/schemas';

export { CATEGORY_STATUS };

// Ensure client-side validation is aligned with server
export const categoryFormSchema = createCategorySchema.extend({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
  status: z.enum(CATEGORY_STATUS).default('active'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryFormDefaultValues: Partial<CategoryFormValues> = {
  name: '',
  description: '',
  status: 'active',
};
