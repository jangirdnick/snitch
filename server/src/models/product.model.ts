import mongoose, { type Document, Schema, type Types, type Model } from 'mongoose';
import { randomUUID } from 'node:crypto';

// ─── Clothing Enums ───────────────────────────────────────

export const GENDER = ['men', 'women', 'unisex', 'kids'] as const;
export const AGE_GROUP = ['adult', 'teen', 'kids'] as const;

export const CLOTHING_SIZE = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL', // tops, dresses
  '28',
  '30',
  '32',
  '34',
  '36',
  '38',
  '40', // bottoms (waist)
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
  'longline', // tops
  'mini',
  'midi',
  'maxi', // dresses/skirts
  'ankle',
  'full', // bottoms
] as const;

export const CATEGORY_TYPE = [
  // Men
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
  // Women
  'dress',
  'top',
  'saree',
  'lehenga',
  'kurti',
  'skirt',
  'leggings',
  'palazzo',
  // Both
  'co_ord_set',
  'tracksuit',
  'activewear',
] as const;

// ─── Sub Interfaces ───────────────────────────────────────

interface IPrice {
  amount: number;
  compareAtAmount?: number;
  currency: 'INR' | 'USD' | 'EUR';
  discount?: {
    type: 'percentage' | 'flat';
    value: number;
    expiresAt?: Date;
  };
}

interface IImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

// ⭐ Clothing specific — size + stock per size
interface ISizeStock {
  size: (typeof CLOTHING_SIZE)[number];
  stock: number;
  sku: string; // SNT-BLU-SHIRT-L
}

// ⭐ Color variant — har color ke apne images
interface IColorVariant {
  name: string; // "Navy Blue"
  hex: string; // "#1B2A6B"
  images: IImage[]; // is color ki specific images
  sizes: ISizeStock[]; // is color me available sizes
  isDefault: boolean; // product open hone pe kaun sa color dikhao
}

// ─── Main Interface ───────────────────────────────────────

export interface IProduct extends Document {
  id: string;

  // ─── Basic Info ─────────────────────────────────────────
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string; // master SKU (per color+size alag hoga)

  // ─── Classification ─────────────────────────────────────
  category: Types.ObjectId[];
  tags: string[];

  // ─── Clothing Specific ──────────────────────────────────
  gender: (typeof GENDER)[number];
  ageGroup: (typeof AGE_GROUP)[number];

  colors: IColorVariant[]; // ⭐ size+stock color ke andar hai
  totalStock: number; // all colors + sizes ka sum

  fit?: (typeof FIT_TYPE)[number];
  fabric?: string; // "100% Cotton", "Polyester Blend"
  pattern?: (typeof PATTERN)[number];
  occasion?: (typeof OCCASION)[number][];
  season?: (typeof SEASON)[number][];
  neckType?: (typeof NECK_TYPE)[number];
  sleeveType?: (typeof SLEEVE_TYPE)[number];
  clothingLength?: (typeof CLOTHING_LENGTH)[number];
  countryOfOrigin: string; // "India"
  careInstructions?: string[];

  // ─── Pricing ────────────────────────────────────────────
  price: IPrice;

  // ─── Threshold & Status ─────────────────────────────────
  lowStockThreshold: number;

  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';

  review?: {
    average: number;
    count: number;
  };

  // ─── SEO ────────────────────────────────────────────────
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema Definition ────────────────────────────────────

const ProductSchema: Schema<IProduct> = new Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title must be under 200 characters'],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [5000, 'Description must be under 5000 characters'],
    },

    shortDescription: {
      type: String,
      maxlength: [300, 'Short description must be under 300 characters'],
    },

    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },

    // ─── Classification ─────────────────────────────────────
    category: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Category',
        },
      ],
      validate: {
        validator: (val: mongoose.Types.ObjectId[]) => val.length > 0,
        message: 'At least one category is required',
      },
      index: true,
    },

    tags: [{ type: String, lowercase: true, trim: true }],

    // ─── Clothing Specific ──────────────────────────────────
    gender: {
      type: String,
      enum: GENDER,
      required: [true, 'Gender is required'],
      index: true,
    },

    ageGroup: {
      type: String,
      enum: AGE_GROUP,
      default: 'adult',
    },

    // ⭐ Colors — sizes stock color ke andar
    colors: [
      {
        name: { type: String, required: true, trim: true },
        hex: {
          type: String,
          required: true,
          match: [/^#([A-Fa-f0-9]{6})$/, 'Invalid hex color code'],
        },
        images: [
          {
            url: { type: String, required: true },
            alt: { type: String, default: '' },
            isPrimary: { type: Boolean, default: false },
            order: { type: Number, default: 0 },
          },
        ],
        sizes: [
          {
            size: { type: String, enum: CLOTHING_SIZE, required: true },
            stock: { type: Number, default: 0, min: 0 },
            sku: { type: String, required: true, uppercase: true },
          },
        ],
        isDefault: { type: Boolean, default: false },
      },
    ],

    totalStock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },

    fit: { type: String, enum: FIT_TYPE },
    fabric: { type: String, trim: true },
    pattern: { type: String, enum: PATTERN },
    occasion: [{ type: String, enum: OCCASION }],
    season: [{ type: String, enum: SEASON }],
    neckType: { type: String, enum: NECK_TYPE },
    sleeveType: { type: String, enum: SLEEVE_TYPE },
    clothingLength: { type: String, enum: CLOTHING_LENGTH },
    countryOfOrigin: { type: String, trim: true, default: 'India' },
    careInstructions: [{ type: String, trim: true }],

    // ─── Pricing ────────────────────────────────────────────
    price: {
      amount: { type: Number, required: true, min: 0 },
      compareAtAmount: { type: Number, min: 0 },
      currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'INR',
      },
      discount: {
        type: { type: String, enum: ['percentage', 'flat'] },
        value: { type: Number, min: 0 },
        expiresAt: Date,
      },
    },

    status: {
      type: String,
      enum: ['draft', 'active', 'inactive', 'out_of_stock'],
      default: 'draft',
      index: true,
    },

    review: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },

    seo: {
      metaTitle: { type: String, maxlength: 60 },
      metaDescription: { type: String, maxlength: 160 },
      keywords: [String],
    },

    publishedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─── Indexes ──────────────────────────────────────────────

ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ gender: 1, status: 1 });

ProductSchema.index({ 'price.amount': 1 });
ProductSchema.index({ status: 1, category: 1 });

ProductSchema.index({ occasion: 1, status: 1 });
ProductSchema.index({ season: 1, status: 1 });

// ─── Pre-save Hooks ───────────────────────────────────────

ProductSchema.pre('validate', function () {
  // Auto slug generate
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Auto SEO metaTitle generate
  if (this.isModified('title') && !this.seo?.metaTitle) {
    if (!this.seo) this.seo = { metaTitle: '', metaDescription: '', keywords: [] };
    this.seo.metaTitle = this.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60);
  }

  // ⭐ totalStock — sab colors + sizes ka sum auto-calculate
  if (this.isModified('colors')) {
    this.totalStock = this.colors.reduce((total, color) => {
      return total + color.sizes.reduce((sum, s) => sum + s.stock, 0);
    }, 0);
  }

  // totalStock 0 → out_of_stock
  if (this.isModified('colors') && this.totalStock === 0) {
    this.status = 'out_of_stock';
  }

  // Sirf ek default color hona chahiye
  if (this.isModified('colors')) {
    const defaults = this.colors.filter((c) => c.isDefault);
    if (defaults.length === 0 && this.colors.length > 0) {
      this.colors[0].isDefault = true; // pehla color default
    }
  }
});

// ─── Virtuals ─────────────────────────────────────────────

// Sale price
ProductSchema.virtual('salePrice').get(function () {
  const { amount, discount } = this.price;
  if (!discount?.value) return amount;
  if (discount.type === 'percentage') {
    return amount - (amount * discount.value) / 100;
  }
  return amount - discount.value;
});

// Stock status
ProductSchema.virtual('stockStatus').get(function () {
  if (this.totalStock === 0) return 'out_of_stock';
  if (this.totalStock <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Default color ka primary image
ProductSchema.virtual('primaryImage').get(function () {
  const defaultColor = this.colors.find((c) => c.isDefault) || this.colors[0];
  return defaultColor?.images.find((img) => img.isPrimary)?.url || defaultColor?.images[0]?.url;
});

// ─── Model ────────────────────────────────────────────────

const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
