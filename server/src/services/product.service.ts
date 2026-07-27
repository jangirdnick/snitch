import mongoose from 'mongoose';
import type { IProduct } from '@/models/product.model.js';
import productModel from '@/models/product.model.js';
import { createLogger } from '@/utils/logger.js';
import { DatabaseOperationError } from './user.service.js';
import type { CreateProductDto, ProductQueryDto, UpdateProductDto } from '@snitch/schemas';

const logger = createLogger('PRODUCT-SERVICE');

// ─── Custom Errors ─────────────────────────────────────────────────────────────

export class ProductNotFoundError extends Error {
  public readonly statusCode = 404;
  public readonly identifier: string;

  constructor(identifier: string, message?: string) {
    super(message ?? `Product not found: ${identifier}`);
    this.name = 'ProductNotFoundError';
    this.identifier = identifier;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProductOperationError extends Error {
  public readonly statusCode = 500;

  constructor(operation: string, cause?: unknown) {
    super(`Product operation failed: ${operation}`);
    this.name = 'ProductOperationError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function isProductError(error: unknown): boolean {
  return (
    error instanceof ProductNotFoundError ||
    error instanceof ProductOperationError ||
    error instanceof DatabaseOperationError
  );
}

// ─── Pagination Result Type ────────────────────────────────────────────────────

export interface PaginatedProducts {
  items: IProduct[];
  pagination: {
    // page: number;
    // limit: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Paginated, filtered, sorted product list.
 * Matches the full productQuerySchema interface.
 */
export async function getProducts(query: ProductQueryDto): Promise<PaginatedProducts> {
  try {
    const filter: Record<string, unknown> = {};

    // Full-text search (requires text index on title, description, tags)
    if (query.search) filter.$text = { $search: query.search };

    // Exact-match filters
    if (query.category) filter.category = new mongoose.Types.ObjectId(query.category);
    if (query.brand) filter.brand = query.brand;
    if (query.gender) filter.gender = query.gender;
    if (query.ageGroup) filter.ageGroup = query.ageGroup;
    if (query.fit) filter.fit = query.fit;
    if (query.pattern) filter.pattern = query.pattern;
    if (query.status) filter.status = query.status;

    // Array membership filters ($in because fields are arrays on the model)
    if (query.occasion) filter.occasion = { $in: [query.occasion] };
    if (query.season) filter.season = { $in: [query.season] };

    // Nested path filters (colors sub-documents)
    if (query.size) filter['colors.sizes.size'] = query.size;
    if (query.color) filter['colors.name'] = { $regex: query.color, $options: 'i' };

    // Price range
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (query.minPrice !== undefined) priceFilter.$gte = query.minPrice;
      if (query.maxPrice !== undefined) priceFilter.$lte = query.maxPrice;
      filter['price.amount'] = priceFilter;
    }

    // Sort
    const sortFieldMap: Record<string, string> = {
      price: 'price.amount',
      createdAt: 'createdAt',
      soldCount: 'soldCount',
      ratings: 'ratings.average',
      viewCount: 'viewCount',
    };
    const sortField = sortFieldMap[query.sortBy] ?? 'createdAt';
    const sortDir = query.sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      productModel
        .find(filter)
        .select(
          'id title slug sku category colors price lowStockThreshold status publishedAt createdAt updatedAt',
        )
        .sort({ [sortField]: sortDir, _id: 1 })
        .skip(skip)
        .limit(query.limit)
        .lean()
        .exec() as unknown as IProduct[],
      productModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      items,
      pagination: {
        currentPage: query.page,
        itemsPerPage: query.limit,
        totalItems: total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, query }, 'Error fetching products');
    throw new DatabaseOperationError('While fetching products');
  }
}

/**
 * Single product by URL slug — used for public product detail pages.
 */
export async function getProductBySlug(slug: string): Promise<IProduct> {
  try {
    const product = (await productModel
      .findOne({ slug })
      .lean()
      .exec()) as unknown as IProduct | null;

    if (!product) throw new ProductNotFoundError(slug);
    return product;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, slug }, 'Error fetching product by slug');
    throw new DatabaseOperationError('While fetching product by slug');
  }
}

/**
 * Single product by MongoDB _id — used by the admin Edit Product page.
 */
export async function getProductById(id: string): Promise<IProduct> {
  try {
    const product = (await productModel.findById(id).lean().exec()) as unknown as IProduct | null;

    if (!product) throw new ProductNotFoundError(id);
    return product;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, id }, 'Error fetching product by id');
    throw new DatabaseOperationError('While fetching product by id');
  }
}

/**
 * Fetch a limited set of products — lightweight for homepage / featured strips.
 */
export async function getLimitProducts(limit: number): Promise<IProduct[]> {
  try {
    const products = (await productModel
      .find({ status: 'active' })
      .limit(limit)
      .lean()
      .exec()) as unknown as IProduct[];

    return products;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, limit }, 'Error fetching limited products');
    throw new DatabaseOperationError('While fetching limited products');
  }
}

/**
 * Full-text search returning lightweight product cards.
 * Bug fixed: $searc → $search.
 * Bug fixed: select now includes `colors` (images live in colors sub-doc).
 */
export async function getSearchProduct(
  search: string,
  limit = 20,
): Promise<Pick<IProduct, '_id' | 'id' | 'title' | 'slug' | 'price' | 'category' | 'colors'>[]> {
  try {
    const products = (await productModel
      .find(
        { $text: { $search: search } }, // ← fixed typo ($searc → $search)
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .select('id title slug colors price category') // ← fixed: colors not images
      .lean()
      .exec()) as unknown as IProduct[];

    // Map to lightweight card shape — safe access on nested colors
    return products.map((product) => ({
      _id: product._id,
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      category: product.category,
      colors: product.colors,
      // Convenience: primary image URL derived from default color
      primaryImage:
        product.colors?.find((c) => c.isDefault)?.images?.find((img) => img.isPrimary)?.url ??
        product.colors?.[0]?.images?.[0]?.url,
    }));
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, search }, 'Error in product search');
    throw new DatabaseOperationError('While searching products');
  }
}

/**
 * Create a new product.
 * Caller (controller) is responsible for uploading images first and passing
 * a fully-formed CreateProductDto with URL-based color images.
 */
export async function productCreate(
  params: CreateProductDto,
  session?: mongoose.ClientSession,
): Promise<IProduct> {
  try {
    const [created] = await productModel.create([params], { session });
    return created as unknown as IProduct;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error }, 'Error creating product');
    throw new DatabaseOperationError('Failed to create product');
  }
}

/**
 * Partial update of a product by MongoDB _id.
 * Bug fixed: was calling updateOne() without await and returning stale data.
 * Now uses findByIdAndUpdate with { new: true, runValidators: true }.
 */
export async function productUpdate({
  productId,
  product,
}: {
  productId: string;
  product: UpdateProductDto;
}): Promise<IProduct> {
  try {
    const updated = (await productModel
      .findByIdAndUpdate(productId, { $set: product }, { new: true, runValidators: true })
      .lean()) as unknown as IProduct | null;

    if (!updated) throw new ProductNotFoundError(productId);
    return updated;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, productId }, 'Error updating product');
    throw new DatabaseOperationError('Failed to update product');
  }
}

/**
 * Hard delete a product by MongoDB _id.
 * Bug fixed: was calling deleteOne() without await — document was never removed.
 */
export async function productDeleteById(productId: string): Promise<void> {
  try {
    const result = await productModel.findByIdAndDelete(productId);
    if (!result) throw new ProductNotFoundError(productId);
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, productId }, 'Error deleting product');
    throw new DatabaseOperationError('Failed to delete product');
  }
}
