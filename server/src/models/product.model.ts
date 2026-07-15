/**
 * ----------------------------------------------------------------------------
 * Product Model
 * ----------------------------------------------------------------------------
 *
 * MongoDB product document schema and model definition
 *
 * Responsibilities:
 * - Product catalog metadata management
 * - Inventory & stock level tracking
 * - Currency, pricing, and discount calculations
 * - Variant configuration (attributes & price modifiers)
 * - Ratings metrics and reviews analytics
 * - SEO meta tags optimization
 *
 * Indexes:
 * - Text index: title, description, tags (for search queries)
 * - Compound/Single indexes: price.amount, status/category, seller/status, isFeatured/status
 *
 * Middleware:
 * - Pre-save: Auto-generate slugs from the title
 * - Pre-save: Auto-update status to 'out_of_stock' when stock drops to 0
 *
 * Virtuals:
 * - salePrice: discounted amount based on active promotions
 * - stockStatus: calculated inventory status ('out_of_stock', 'low_stock', 'in_stock')
 * - primaryImage: fallback URL resolver for product thumbnail
 *
 */

import mongoose, { Document, Schema, Types } from 'mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';

// ─── Sub-interfaces ───────────────────────────────────────

/**
 * Interface representing product pricing structure, including discounts and comparison rates.
 */
interface IPrice {
  amount: number;
  compareAtAmount?: number; // original price (strike-through)
  currency: 'INR' | 'USD' | 'EUR';
  discount?: {
    type: 'percentage' | 'flat';
    value: number;
    expiresAt?: Date;
  };
}

/**
 * Interface representing a product image asset.
 */
interface IImage {
  url: string;
  alt: string;
  isPrimary: boolean; // thumbnail ke liye
  order: number; // display order
}

/**
 * Interface representing product variants like size and color.
 */
interface IVariant {
  name: string; // "Size", "Color"
  options: {
    label: string; // "XL", "Red"
    stock: number;
    priceModifier?: number; // +200 agar XL costly ho
    sku: string; // variant-specific SKU
  }[];
}

/**
 * Interface representing the physical dimensions of the product.
 */
interface IDimensions {
  weight: number; // grams me
  length: number; // cm
  width: number;
  height: number;
}

/**
 * Interface representing ratings metrics and score breakdown.
 */
interface IRatings {
  average: number; // 4.5
  count: number; // 120 reviews
  breakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// ─── Main Interface ───────────────────────────────────────

/**
 * Product document interface representing a catalog item.
 *
 * --------------------------------------------------------------------------
 * Required Fields
 * --------------------------------------------------------------------------
 *
 * @property title
 * The descriptive name of the product. Max length: 200 chars.
 *
 * @property slug
 * URL-friendly unique identifier generated from the title. Must be lowercase.
 *
 * @property description
 * Detailed description of the product. Max length: 5000 chars.
 *
 * @property sku
 * Unique Stock Keeping Unit identifier. Must be uppercase.
 *
 * @property category
 * Reference to the primary Category document.
 *
 * @property price
 * Pricing metadata including amounts, currency, and discounts.
 *
 * @property stock
 * Total inventory count. Must be non-negative.
 *
 * --------------------------------------------------------------------------
 * Optional / Default Fields
 * --------------------------------------------------------------------------
 *
 * @property shortDescription
 * Brief summary of the product for catalog cards. Max length: 300 chars.
 *
 * @property brand
 * Brand name of the product.
 *
 * @property subCategory
 * Optional reference to the sub-category Category document.
 *
 * @property tags
 * Search tags or labels associated with the product.
 *
 * @property lowStockThreshold
 * Threshold value under which a low stock alert is triggered. Default: 5.
 *
 * @property variants
 * List of configurable attributes (e.g. Size, Color) with options.
 *
 * @property hasVariants
 * Flag indicating if the product has variant properties. Default: false.
 *
 * @property images
 * Collection of image URLs and metadata for the product.
 *
 * @property specifications
 * Map of arbitrary product specifications (e.g. {"Material": "Cotton"}).
 *
 * @property dimensions
 * Physical weight and sizes of the product.
 *
 * @property warranty
 * Duration in months and policy description.
 *
 * @property status
 * Visibility status: 'draft', 'active', 'inactive', 'out_of_stock'. Default: 'draft'.
 *
 * @property isFeatured
 * Flag indicating if the product is featured on the homepage. Default: false.
 *
 * @property isDigital
 * Flag indicating if the product is downloadable/virtual. Default: false.
 *
 * @property ratings
 * Analytics data storing score averages and breakdown counts.
 *
 * @property viewCount
 * Total views counter.
 *
 * @property soldCount
 * Total sales counter.
 *
 * @property wishlistCount
 * Total times added to wishlists.
 *
 * @property seo
 * Search Engine Optimization metadata including metaTitle and metaDescription.
 *
 * @property publishedAt
 * Optional date when the product status was set to active.
 */

export interface IProduct extends Document {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;

  category?: Types.ObjectId;
  tags: string[];

  price: IPrice;

  stock: number;
  lowStockThreshold: number;
  variants?: IVariant[];
  hasVariants?: boolean;

  images: IImage[];

  specifications: Map<string, string>;
  dimensions?: IDimensions;

  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  isFeatured: boolean;

  ratings: IRatings;
  viewCount: number;
  soldCount: number;
  wishlistCount: number;

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
      required: true,
      trim: true,
      maxlength: [200, 'Title 200 chars se zyada nahi'],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // URL lookup fast hoga
    },

    description: {
      type: String,
      required: true,
      maxlength: [5000, 'Description 5000 chars se zyada nahi'],
    },

    shortDescription: {
      type: String,
      maxlength: 300,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },

    tags: [{ type: String, lowercase: true, trim: true }],

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

    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },

    hasVariants: { type: Boolean, default: false },
    variants: [
      {
        name: { type: String, required: true },
        options: [
          {
            label: { type: String, required: true },
            stock: { type: Number, default: 0 },
            priceModifier: { type: Number, default: 0 },
            sku: { type: String, required: true },
          },
        ],
      },
    ],

    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
    ],

    specifications: {
      type: Map,
      of: String, // { "Material": "100% Cotton" }
    },

    dimensions: {
      weight: Number,
      length: Number,
      width: Number,
      height: Number,
    },

    status: {
      type: String,
      enum: ['draft', 'active', 'inactive', 'out_of_stock'],
      default: 'draft',
      index: true,
    },

    isFeatured: { type: Boolean, default: false },

    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
      breakdown: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },

    viewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },

    seo: {
      metaTitle: String,
      metaDescription: String,
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

/**
 * Text Search Index.
 *
 * Optimizes text-based search queries across title,
 * description, and tags fields.
 */
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });

/**
 * Product Query Filters Indexes.
 *
 * Optimizes performance for common query paths:
 * - Price filtering
 * - Category listing
 * - Merchant catalog retrieval
 * - Featured product queries
 */
ProductSchema.index({ 'price.amount': 1 });
ProductSchema.index({ status: 1, category: 1 });
ProductSchema.index({ isFeatured: 1, status: 1 });

// ─── Virtuals ─────────────────────────────────────────────

/**
 * Calculated Sale Price Virtual.
 *
 * Computes the final discounted selling price
 * based on flat or percentage deductions.
 *
 * Returns:
 * - number -> discounted sale price
 */
ProductSchema.virtual('salePrice').get(function () {
  const { amount, discount } = this.price;
  if (!discount?.value) return amount;

  if (discount.type === 'percentage') {
    return amount - (amount * discount.value) / 100;
  }
  return amount - discount.value;
});

/**
 * Inventory Stock Status Virtual.
 *
 * Resolves the current stock availability level.
 *
 * Returns:
 * - 'out_of_stock' -> stock is 0
 * - 'low_stock'    -> stock is at or below threshold
 * - 'in_stock'     -> stock is above threshold
 */
ProductSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

/**
 * Primary Product Image Virtual.
 *
 * Resolves the primary preview image URL, falling back
 * to the first image if no primary is specified.
 *
 * Returns:
 * - string -> image URL
 */
ProductSchema.virtual('primaryImage').get(function () {
  return this.images.find((img) => img.isPrimary)?.url || this.images[0]?.url;
});

// ─── Pre-save Hooks ───────────────────────────────────────

/**
 * Product Lifecycle Pre-Save Middleware.
 *
 * Purpose:
 * - Automatically generate URL-friendly slug from title if not set.
 * - Automatically update visibility status to 'out_of_stock' if inventory drops to 0.
 *
 * Behavior:
 * - Runs before saving the product document.
 */
ProductSchema.pre('save', function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Stock 0 ho gaya toh status update karo
  if (this.isModified('stock') && this.stock === 0) {
    this.status = 'out_of_stock';
  }
});

/**
 * Product Model
 *
 * Primary entry point for all product-related
 * database operations.
 */
const Product: Model<IProduct, Record<string, never>> = (mongoose.models.Product as Model<
  IProduct,
  Record<string, never>
>) || mongoose.model<IProduct, Record<string, never>>('Product', ProductSchema);

export default Product;
