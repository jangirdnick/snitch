import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description must not exceed 5000 characters'),
  shortDescription: z
    .string()
    .max(300, 'Short description must not exceed 300 characters')
    .optional(),
  sku: z.string().min(1, 'SKU is required'),

  category: z.string().optional(),
  tags: z.array(z.string()).default([]),

  price: z.object({
    amount: z.number().min(0, 'Price amount must be at least 0'),
    compareAtAmount: z.number().min(0, 'Compare at amount must be at least 0').optional(),
    currency: z.enum(['INR', 'USD', 'EUR']).default('INR'),
    discount: z
      .object({
        type: z.enum(['percentage', 'flat']),
        value: z.number().min(0),
        expiresAt: z.union([z.string().datetime(), z.date()]).optional(),
      })
      .optional(),
  }),

  stock: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).default(5),

  hasVariants: z.boolean().optional().default(false),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, 'Variant name is required'),
        options: z.array(
          z.object({
            label: z.string().min(1, 'Option label is required'),
            stock: z.number().min(0).default(0),
            priceModifier: z.number().default(0),
            sku: z.string().min(1, 'Option SKU is required'),
          }),
        ),
      }),
    )
    .optional()
    .default([]),

  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().default(''),
        isPrimary: z.boolean().default(false),
        order: z.number().default(0),
      }),
    )
    .min(1, 'At least one image is required'),

  specifications: z.record(z.string(), z.string()).optional(),

  dimensions: z
    .object({
      weight: z.number().min(0),
      length: z.number().min(0),
      width: z.number().min(0),
      height: z.number().min(0),
    })
    .optional(),

  status: z.enum(['draft', 'active', 'inactive', 'out_of_stock']).default('draft'),
  isFeatured: z.boolean().default(false),

  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Validation schema: request mein images = multer files (Buffer wali)
// Pure duck-type check — no external deps needed in shared schema package
export const createProductValidationSchema = createProductSchema.extend({
  images: z
    .array(
      z.custom<{ originalname: string; buffer: unknown }>(
        (val) =>
          val != null &&
          typeof val === 'object' &&
          'originalname' in (val as object) &&
          'buffer' in (val as object),
        { message: 'Each image must be a valid uploaded file' },
      ),
    )
    .min(1, 'At least one image is required'),
});

export const updateProductValidationSchema = createProductValidationSchema.partial();

// DTO types: images = string[] (cloud upload ke baad URLs)
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type CreateProductValidationDto = z.infer<typeof createProductValidationSchema>;
export type UpdateProductValidationDto = z.infer<typeof updateProductValidationSchema>;
