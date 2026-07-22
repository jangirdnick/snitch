/**
 * product.form.schema.ts
 *
 * Client-side form schema for Create Product.
 *
 * RULE: Compose from @snitch/schemas — never duplicate or re-define.
 * We only override fields where the browser form needs a different type
 * than what the server expects post-upload:
 *
 *   1. `colors[].images`  → server expects { url, alt, isPrimary, order }[]
 *                           client accepts  File[] (upload transform happens in API hook)
 *   2. `category`         → server expects ObjectId (24-hex string)
 *                           client uses plain text input; ObjectId format
 *                           validation is relaxed until Category API is wired
 *   3. `price.discount.expiresAt` → string for <input type="datetime-local">
 */

import {
  z,
  createProductObjectSchema,
  GENDER,
  AGE_GROUP,
  CLOTHING_SIZE,
  FIT_TYPE,
  OCCASION,
  SEASON,
  PATTERN,
  NECK_TYPE,
  SLEEVE_TYPE,
  CLOTHING_LENGTH,
  CATEGORY_TYPE,
} from '@snitch/schemas';

// Re-export enum arrays for use in section components
export {
  GENDER,
  AGE_GROUP,
  CLOTHING_SIZE,
  FIT_TYPE,
  OCCASION,
  SEASON,
  PATTERN,
  NECK_TYPE,
  SLEEVE_TYPE,
  CLOTHING_LENGTH,
  CATEGORY_TYPE,
};

// ─── Client-side color variant (overrides images to File[]) ──────────────────

const clientSizeStockSchema = z.object({
  size: z.enum(CLOTHING_SIZE, {
    required_error: 'Size is required',
    invalid_type_error: 'Invalid size value',
  }),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  sku: z.string({ required_error: 'Variant SKU is required' }).trim().min(1, 'SKU cannot be empty'),
});

const clientColorVariantSchema = z.object({
  name: z
    .string({ required_error: 'Color name is required' })
    .trim()
    .min(1, 'Color name cannot be empty'),
  hex: z
    .string({ required_error: 'Hex color is required' })
    .regex(/^#([A-Fa-f0-9]{6})$/, 'Invalid hex color (e.g. #1B2A6B)'),
  images: z.array(z.instanceof(File)).min(1, 'At least one image is required per color'),
  sizes: z.array(clientSizeStockSchema).min(1, 'At least one size is required per color'),
  isDefault: z.boolean().default(false),
});

// ─── Client Form Schema ───────────────────────────────────────────────────────

export const productFormSchema = createProductObjectSchema.extend({
  // Relax category to plain string (future: CategorySelect from API)
  category: z.string().min(1, 'Category is required'),

  // Override colors: File[] images instead of URL objects
  colors: z.array(clientColorVariantSchema).min(1, 'At least one color variant is required'),

  // Override price to use datetime-local string for discount expiry
  price: createProductObjectSchema.shape.price.extend({
    discount: z
      .object({
        type: z.enum(['percentage', 'flat']),
        value: z.number().min(0, 'Discount value must be at least 0'),
        expiresAt: z.string().optional(),
      })
      .optional(),
  }),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// ─── Type helpers for nested structures ──────────────────────────────────────

export type ColorVariantFormValue = ProductFormValues['colors'][number];
export type SizeStockFormValue = ColorVariantFormValue['sizes'][number];

// ─── Default Values ───────────────────────────────────────────────────────────

export const productFormDefaultValues: Partial<ProductFormValues> = {
  title: '',
  description: '',
  shortDescription: '',
  sku: '',
  category: '',

  tags: [],
  gender: undefined,
  ageGroup: 'adult',
  fit: undefined,
  fabric: '',
  careInstructions: [],
  pattern: undefined,
  occasion: [],
  season: [],
  neckType: undefined,
  sleeveType: undefined,
  clothingLength: undefined,
  countryOfOrigin: 'India',
  price: {
    amount: 0,
    compareAtAmount: undefined,
    currency: 'INR',
    discount: undefined,
  },
  lowStockThreshold: 5,

  status: 'draft',

  colors: [],
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: [],
  },
  publishedAt: undefined,
};
