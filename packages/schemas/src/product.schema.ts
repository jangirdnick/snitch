import { z } from 'zod';

// ─── Enums — Model se exact match ────────────────────────

export const GENDER = ['men', 'women', 'unisex', 'kids'] as const;
export const AGE_GROUP = ['adult', 'teen', 'kids'] as const;

export const CLOTHING_SIZE = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
  '28',
  '30',
  '32',
  '34',
  '36',
  '38',
  '40',
  'FREE_SIZE',
] as const;

export const FIT_TYPE = ['slim', 'regular', 'oversized', 'relaxed', 'skinny', 'straight'] as const;

export const OCCASION = [
  'casual',
  'formal',
  'party',
  'ethnic',
  'sports',
  'beach',
  'workwear',
  'loungewear',
] as const;

export const SEASON = ['summer', 'winter', 'monsoon', 'all_season'] as const;

export const PATTERN = [
  'solid',
  'striped',
  'printed',
  'checked',
  'embroidered',
  'colorblock',
  'graphic',
  'floral',
] as const;

export const NECK_TYPE = [
  'round',
  'v_neck',
  'polo',
  'collar',
  'hooded',
  'turtle',
  'square',
  'off_shoulder',
] as const;

export const SLEEVE_TYPE = [
  'full',
  'half',
  'sleeveless',
  'three_quarter',
  'cap',
  'puff',
  'raglan',
] as const;

export const CLOTHING_LENGTH = [
  'crop',
  'regular',
  'longline',
  'mini',
  'midi',
  'maxi',
  'ankle',
  'full',
] as const;

export const CATEGORY_TYPE = [
  't_shirt',
  'shirt',
  'jeans',
  'trousers',
  'shorts',
  'jacket',
  'hoodie',
  'sweatshirt',
  'suit',
  'kurta',
  'dress',
  'top',
  'saree',
  'lehenga',
  'kurti',
  'skirt',
  'leggings',
  'palazzo',
  'co_ord_set',
  'tracksuit',
  'activewear',
] as const;

// ─── Reusable Sub Schemas ─────────────────────────────────

const objectIdSchema = z
  .string({ required_error: 'ID is required' })
  .regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

const imageSchema = z.object({
  url: z.string({ required_error: 'Image URL/Path is required' }).min(1, 'Invalid image path'),
  alt: z.string().trim().default(''),
  isPrimary: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

// Multer file upload ke liye (server validation)
const imageFileSchema = z.custom<{ originalname: string; buffer: unknown }>(
  (val) =>
    val != null &&
    typeof val === 'object' &&
    'originalname' in (val as object) &&
    'buffer' in (val as object),
  { message: 'Each image must be a valid uploaded file' },
);

// ⭐ Size stock — har size ka alag stock aur SKU
const sizeStockSchema = z.object({
  size: z.enum(CLOTHING_SIZE, {
    required_error: 'Size is required',
    invalid_type_error: 'Invalid size value',
  }),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  sku: z
    .string({ required_error: 'Variant SKU is required' })
    .trim()
    .min(1, 'SKU cannot be empty')
    .toUpperCase(),
});

// ⭐ Color variant — images + sizes nested
const colorVariantSchema = z.object({
  name: z
    .string({ required_error: 'Color name is required' })
    .trim()
    .min(1, 'Color name cannot be empty'),
  hex: z
    .string({ required_error: 'Hex color is required' })
    .regex(/^#([A-Fa-f0-9]{6})$/, 'Invalid hex color code (e.g. #1B2A6B)'),
  images: z.array(imageSchema).min(1, 'At least one image is required per color'),
  sizes: z.array(sizeStockSchema).min(1, 'At least one size is required per color'),
  isDefault: z.boolean().default(false),
});

// Multer version of color variant
const colorVariantFileSchema = colorVariantSchema.extend({
  images: z.array(imageFileSchema).min(1, 'At least one image is required per color'),
});

const priceSchema = z.object({
  amount: z.number({ required_error: 'Price is required' }).min(0, 'Price cannot be negative'),
  compareAtAmount: z.number().min(0, 'Compare price cannot be negative').optional(),
  currency: z.enum(['INR', 'USD', 'EUR']).default('INR'),
  discount: z
    .object({
      type: z.enum(['percentage', 'flat'], {
        required_error: 'Discount type is required',
      }),
      value: z.number().min(0, 'Discount value cannot be negative'),
      expiresAt: z.union([z.string().datetime(), z.coerce.date()]).optional(),
    })
    .optional(),
});

const seoSchema = z.object({
  metaTitle: z.string().trim().max(60, 'Meta title must be under 60 characters').optional(),
  metaDescription: z
    .string()
    .trim()
    .max(160, 'Meta description must be under 160 characters')
    .optional(),
  keywords: z.array(z.string().trim()).optional(),
});

// ─── Base Product Schema ──────────────────────────────────

const baseProductSchema = z.object({
  // ─── Basic Info ───────────────────────────────────────
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),

  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),

  shortDescription: z
    .string()
    .trim()
    .max(300, 'Short description must not exceed 300 characters')
    .optional(),

  sku: z
    .string({ required_error: 'SKU is required' })
    .trim()
    .min(1, 'SKU cannot be empty')
    .toUpperCase(),

  // ─── Classification ───────────────────────────────────
  category: objectIdSchema,

  tags: z.array(z.string().trim().toLowerCase()).default([]),

  // ─── Clothing Specific ────────────────────────────────
  gender: z.enum(GENDER, {
    required_error: 'Gender is required',
    invalid_type_error: 'Invalid gender value',
  }),

  ageGroup: z.enum(AGE_GROUP).default('adult'),

  fit: z.enum(FIT_TYPE).optional(),
  fabric: z.string().trim().optional(),

  careInstructions: z
    .array(z.string().trim().min(1))
    .min(1, 'At least one care instruction is required')
    .optional(),

  pattern: z.enum(PATTERN).optional(),

  occasion: z.array(z.enum(OCCASION)).min(1, 'Select at least one occasion').optional(),

  season: z.array(z.enum(SEASON)).min(1, 'Select at least one season').optional(),

  neckType: z.enum(NECK_TYPE).optional(),
  sleeveType: z.enum(SLEEVE_TYPE).optional(),
  clothingLength: z.enum(CLOTHING_LENGTH).optional(),

  countryOfOrigin: z.string().trim().default('India'),

  // ─── Pricing ──────────────────────────────────────────
  price: priceSchema,

  lowStockThreshold: z.number().int().min(0).default(5),

  // ─── Status & Flags ───────────────────────────────────
  status: z.enum(['draft', 'active', 'inactive', 'out_of_stock']).default('draft'),

  // ─── SEO ──────────────────────────────────────────────
  seo: seoSchema.optional(),

  publishedAt: z.coerce.date().optional(),
});

// ─── Cross-field Validations ──────────────────────────────

function addRefinements<T extends z.ZodType>(schema: T) {
  return (
    (schema as unknown as z.ZodObject<z.ZodRawShape>)
      // compareAtAmount > amount
      .refine(
        (data) => {
          if (data.price?.compareAtAmount !== undefined) {
            return data.price.compareAtAmount > data.price.amount;
          }
          return true;
        },
        {
          message: 'Compare price must be greater than actual price',
          path: ['price', 'compareAtAmount'],
        },
      )
      // Percentage discount ≤ 100
      .refine(
        (data) => {
          if (data.price?.discount?.type === 'percentage') {
            return data.price.discount.value <= 100;
          }
          return true;
        },
        {
          message: 'Percentage discount cannot exceed 100%',
          path: ['price', 'discount', 'value'],
        },
      )
      // Flat discount < amount
      .refine(
        (data) => {
          if (data.price?.discount?.type === 'flat') {
            return data.price.discount.value < data.price.amount;
          }
          return true;
        },
        {
          message: 'Flat discount cannot exceed the product price',
          path: ['price', 'discount', 'value'],
        },
      )
      // Discount expiry future me honi chahiye
      .refine(
        (data) => {
          if (data.price?.discount?.expiresAt) {
            return new Date(data.price.discount.expiresAt) > new Date();
          }
          return true;
        },
        {
          message: 'Discount expiry must be in the future',
          path: ['price', 'discount', 'expiresAt'],
        },
      )
      // Sirf ek default color
      .refine(
        (data) => {
          if (data.colors?.length > 0) {
            const defaults = data.colors.filter((c: { isDefault: boolean }) => c.isDefault);
            return defaults.length <= 1;
          }
          return true;
        },
        {
          message: 'Only one color can be set as default',
          path: ['colors'],
        },
      )
      // Variant SKUs unique hone chahiye
      .refine(
        (data) => {
          if (data.colors?.length > 0) {
            const allSkus = data.colors.flatMap((c: { sizes: { sku: string }[] }) =>
              c.sizes.map((s) => s.sku),
            );
            return new Set(allSkus).size === allSkus.length;
          }
          return true;
        },
        {
          message: 'All variant SKUs must be unique',
          path: ['colors'],
        },
      )
  );
}

// ─── Create Schemas ───────────────────────────────────────

// URL version — cloud upload ke baad (frontend se)
export const createProductObjectSchema = baseProductSchema.extend({
  colors: z.array(colorVariantSchema).min(1, 'At least one color is required'),
});

export const createProductSchema = addRefinements(createProductObjectSchema);

// File version — multer files (server side validation)
export const createProductValidationObjectSchema = baseProductSchema.extend({
  colors: z.array(colorVariantFileSchema).min(1, 'At least one color is required'),
});

export const createProductValidationSchema = addRefinements(createProductValidationObjectSchema);

// ─── Update Schemas ───────────────────────────────────────

// sku aur category change nahi hone chahiye
export const updateProductSchema = addRefinements(
  createProductObjectSchema.partial().omit({ sku: true }),
);

export const updateProductValidationSchema = addRefinements(
  createProductValidationObjectSchema.partial().omit({ sku: true }),
);

// ─── Query Schema ─────────────────────────────────────────

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  category: objectIdSchema.optional(),

  gender: z.enum(GENDER).optional(),
  ageGroup: z.enum(AGE_GROUP).optional(),
  fit: z.enum(FIT_TYPE).optional(),
  pattern: z.enum(PATTERN).optional(),
  occasion: z.enum(OCCASION).optional(),
  season: z.enum(SEASON).optional(),
  size: z.enum(CLOTHING_SIZE).optional(),
  color: z.string().trim().optional(),
  status: z.enum(['draft', 'active', 'inactive', 'out_of_stock']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['price', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Types ────────────────────────────────────────────────

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type CreateProductValidationDto = z.infer<typeof createProductValidationSchema>;
export type UpdateProductValidationDto = z.infer<typeof updateProductValidationSchema>;
export type ProductQueryDto = z.infer<typeof productQuerySchema>;
