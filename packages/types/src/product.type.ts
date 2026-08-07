import type { ApiErrorResponse, ApiNormalResponse, ApiSuccess } from './api.type.js';

// ─── Enums / String Literals ───────────────────────────────────────────────────

export type ProductGender = 'men' | 'women' | 'unisex' | 'kids';
export type ProductAgeGroup = 'adult' | 'teen' | 'kids';
export type ProductSize =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | 'XXXL'
  | '28'
  | '30'
  | '32'
  | '34'
  | '36'
  | '38'
  | '40'
  | 'FREE_SIZE';
export type ProductFit = 'slim' | 'regular' | 'oversized' | 'relaxed' | 'skinny' | 'straight';
export type ProductOccasion =
  'casual' | 'formal' | 'party' | 'ethnic' | 'sports' | 'beach' | 'workwear' | 'loungewear';
export type ProductSeason = 'summer' | 'winter' | 'monsoon' | 'all_season';
export type ProductPattern =
  'solid' | 'striped' | 'printed' | 'checked' | 'embroidered' | 'colorblock' | 'graphic' | 'floral';
export type ProductNeckType =
  'round' | 'v_neck' | 'polo' | 'collar' | 'hooded' | 'turtle' | 'square' | 'off_shoulder';
export type ProductSleeveType =
  'full' | 'half' | 'sleeveless' | 'three_quarter' | 'cap' | 'puff' | 'raglan';
export type ProductLength =
  'crop' | 'regular' | 'longline' | 'mini' | 'midi' | 'maxi' | 'ankle' | 'full';
export type ProductCategoryType =
  | 't_shirt'
  | 'shirt'
  | 'jeans'
  | 'trousers'
  | 'shorts'
  | 'jacket'
  | 'hoodie'
  | 'sweatshirt'
  | 'suit'
  | 'kurta'
  | 'dress'
  | 'top'
  | 'saree'
  | 'lehenga'
  | 'kurti'
  | 'skirt'
  | 'leggings'
  | 'palazzo'
  | 'co_ord_set'
  | 'tracksuit'
  | 'activewear';
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'out_of_stock';
export type CurrencyCode = 'INR' | 'USD' | 'EUR';
export type DiscountType = 'percentage' | 'flat';

// ─── Sub Interfaces ────────────────────────────────────────────────────────────

export interface ProductPrice {
  amount: number;
  compareAtAmount?: number;
  currency: CurrencyCode;
  discount?: {
    type: DiscountType;
    value: number;
    expiresAt?: Date;
  };
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductSizeStock {
  size: ProductSize;
  stock: number;
  sku: string;
}

export interface ProductColorVariant {
  name: string;
  hex: string;
  images: ProductImage[];
  sizes: ProductSizeStock[];
  isDefault: boolean;
}

export interface ProductSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

// ─── Main Product Interface ────────────────────────────────────────────────────

export interface Product {
  readonly _id: string;
  readonly id: string;

  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  readonly sku: string;

  category: string[];
  brand?: string;
  tags: string[];

  gender: ProductGender;
  ageGroup: ProductAgeGroup;

  colors: ProductColorVariant[];
  readonly totalStock: number;

  fit?: ProductFit;
  fabric?: string;
  pattern?: ProductPattern;
  occasion?: ProductOccasion[];
  season?: ProductSeason[];
  neckType?: ProductNeckType;
  sleeveType?: ProductSleeveType;
  clothingLength?: ProductLength;
  countryOfOrigin: string;
  careInstructions?: string[];

  price: ProductPrice;
  lowStockThreshold: number;
  status: ProductStatus;

  review?: {
    average: number;
    count: number;
  };

  seo?: ProductSeo;

  publishedAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ─── Response Payload Types ────────────────────────────────────────────────────

export interface PaginationMeta {
  readonly totalItems: number;
  readonly totalPages: number;
  readonly currentPage: number;
  readonly itemsPerPage: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface PaginatedProducts {
  items: Product[];
  pagination: PaginationMeta;
}

export interface SearchProductCard {
  readonly _id: string;
  readonly id: string;
  title: string;
  slug: string;
  price: ProductPrice;
  category: string;
  colors: ProductColorVariant[];
  primaryImage?: string;
}

// ─── API Response Types ────────────────────────────────────────────────────────

// GET /api/product
export type ProductListResponse = ApiSuccess<PaginatedProducts> | ApiErrorResponse;

// GET /api/product/limited/:limit
export type ProductLimitedResponse = ApiSuccess<{ products: Product[] }> | ApiErrorResponse;

// GET /api/product/search/:search
export type ProductSearchResponse =
  ApiSuccess<{ products: SearchProductCard[] }> | ApiErrorResponse;

// GET /api/product/:slug
export type ProductDetailResponse = ApiSuccess<{ product: Product }> | ApiErrorResponse;

// POST /api/product
export type ProductCreateResponse = ApiSuccess<{ product: Product }> | ApiErrorResponse;

// PUT /api/product/:id
export type ProductUpdateResponse = ApiSuccess<{ product: Product }> | ApiErrorResponse;

// DELETE /api/product/:id
export type ProductDeleteResponse = ApiNormalResponse | ApiErrorResponse;
