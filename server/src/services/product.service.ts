import productModel, { IProduct } from '@/models/product.model.js';
import { createLogger } from '@/utils/logger.js';
import { DatabaseOperationError } from './user.service.js';
import { CreateProductDto, UpdateProductDto } from '@snitch/schemas';

const logger = createLogger('PRODUCT-SERVICE');

// ------ Custom Errors ----------------------------

export class ProductNotFoundError extends Error {
  public readonly statusCode = 404;
  public readonly identifier: string;

  constructor(identifier: string, message?: string) {
    super(message || `Product not found: ${identifier}`);
    this.name = 'ProductNotFoundError';
    this.identifier = identifier;
  }
}

export class ProductOprstionFailed extends Error {
  public readonly statusCode = 500;

  constructor(operation: string, cause?: unknown) {
    super(`Product operation failed: ${operation}`);
    this.name = 'ProductOperationFailed';
    this.cause = cause;
  }
}

function isProductError(error: unknown): boolean {
  return (
    error instanceof ProductNotFoundError ||
    error instanceof ProductOprstionFailed ||
    error instanceof DatabaseOperationError
  );
}

// ------ Service Functions --------------------

export async function getProductBySlug(slug: string): Promise<IProduct> {
  try {
    const product = await productModel.findOne({ slug }).populate('').lean();
    if (!product) {
      throw new ProductNotFoundError(slug);
    }
    return product;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, slug }, 'Error occurred while fetching product by slug');
    throw new DatabaseOperationError('While fetching product by slug');
  }
}

export async function getLimitProducts(limit: number): Promise<IProduct[]> {
  try {
    const product = await productModel.find().limit(limit).lean().exec();
    if (!product) {
      throw new ProductOprstionFailed('No products found');
    }
    return product;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, limit }, 'Error occurred while fetching limited products');
    throw new DatabaseOperationError('While fetching limited products');
  }
}

export async function getSearchProduct(
  search: string,
  limit = 20,
): Promise<Pick<IProduct, '_id' | 'id' | 'title' | 'slug' | 'price' | 'ratings' | 'category'>[]> {
  try {
    const products = await productModel
      .find(
        {
          $text: { $searc: search },
        },
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .select('id title slug images price ratings category')
      .lean()
      .exec();

    if (!products) {
      throw new ProductNotFoundError(`Matching ${search}`);
    }

    const formattedProducts = products.map((product) => ({
      _id: product._id,
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      ratings: product.ratings,
      category: product.category,
      image:
        product.images && product.images.length > 0
          ? product.images[0] // Sirf first image
          : null,
    }));

    return formattedProducts;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error, search }, 'Error occurred while fetching search products');
    throw new DatabaseOperationError('While fetching search products');
  }
}

export async function productCreate(params: CreateProductDto): Promise<IProduct> {
  try {
    const createProduct = await productModel.create(params);
    if (!createProduct) {
      throw new ProductOprstionFailed('While creating product');
    }
    return createProduct;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error }, 'Unexpected error while creating product:');
    throw new DatabaseOperationError('Failed to create product');
  }
}

export async function productUpdate({
  productId,
  product,
}: {
  productId: string;
  product: UpdateProductDto;
}): Promise<IProduct> {
  try {
    const existingProduct = await productModel.findOne({
      _id: productId,
    });
    if (!existingProduct) {
      throw new ProductNotFoundError(`Product not found: ${productId}`);
    }
    existingProduct.updateOne({ $set: { ...product } });

    return existingProduct;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error }, 'Unexpected error while updating product:');
    throw new DatabaseOperationError('Failed to update product');
  }
}

export async function productDeleteById(productid: string): Promise<void> {
  try {
    const existingProduct = await productModel.findOne({
      _id: productid,
    });
    if (!existingProduct) {
      throw new ProductNotFoundError(`Product not found: ${productid}`);
    }
    existingProduct.deleteOne();
    return;
  } catch (error) {
    if (isProductError(error)) throw error;
    logger.error({ err: error }, 'Unexpected error while deleting product:');
    throw new DatabaseOperationError('Failed to delete product');
  }
}
