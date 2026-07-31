/**
 * product.form.schema.ts
 *
 * Client-side form schema for Create & Edit Product.
 *
 * RULE: Compose from @snitch/schemas — never duplicate or re-define.
 * We only override fields where the browser form needs a different type
 * than what the server expects post-upload:
 *
 *   1. `colors[].images`  → server expects { url, alt, isPrimary, order }[]
 *                           client accepts  (File | ExistingImage)[]
 *                           Edit mode: existing server images represented as ExistingImage
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

// ─── ExistingImage — already uploaded to cloud storage ───────────────────────
// Used in edit mode to represent images already saved on the server.
// Distinct from File (new upload) by the presence of `url`.

export interface ExistingImage {
  readonly url: string;
  readonly alt: string;
  readonly isPrimary: boolean;
  readonly order: number;
}

/** Returns true when the value is an ExistingImage (not a File). */
export function isExistingImage(value: ImageValue): value is ExistingImage {
  return typeof value === 'object' && !(value instanceof File) && 'url' in value;
}

/** Union of a new browser File upload and a previously-saved cloud image. */
export type ImageValue = File | ExistingImage;

// ─── Client-side color variant (overrides images to ImageValue[]) ─────────────

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
  // Accept both new File objects and existing {url,...} image objects
  images: z
    .array(
      z.union([
        z.instanceof(File),
        z.object({ url: z.string(), alt: z.string(), isPrimary: z.boolean(), order: z.number() }),
      ]),
    )
    .min(1, 'At least one image is required per color'),
  sizes: z.array(clientSizeStockSchema).min(1, 'At least one size is required per color'),
  isDefault: z.boolean().default(false),
});

// ─── Client Form Schema ───────────────────────────────────────────────────────

export const productFormSchema = createProductObjectSchema.extend({
  // Relax category to array of strings for multi-select
  category: z.array(z.string()).min(1, 'At least one category is required'),

  // Override colors: ImageValue[] images instead of URL objects
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

  // careInstructions: server requires min(1) when present, but the UI lets it be
  // empty (user hasn't filled it in yet). Override to allow [] without erroring.
  // The server omits this field from the update payload when it's empty anyway.
  careInstructions: z.array(z.string().trim().min(1)).optional(),
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
  category: [],

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
