import { mediaService } from '@/services/media.service.js';
import {
  getLimitProducts,
  getProductBySlug,
  getSearchProduct,
  productCreate,
  productDeleteById,
  productUpdate,
} from '@/services/product.service.js';
import {
  CreateProductDto,
  createProductValidationSchema,
  UpdateProductDto,
  updateProductSchema,
} from '@snitch/schemas';
import { NextFunction, Request, Response } from 'express';

export class ProductFieldsError extends Error {
  public readonly statusCode = 400;
  constructor(errorFields: string) {
    super(`Product field errors: ${errorFields}`);
    this.name = 'ProductFieldsError';
  }
}

export class CreadentialsMismatchError extends Error {
  public readonly statusCode = 401;
  constructor(message: string) {
    super(message);
    this.name = 'CreadentialsMismatchError';
  }
}

function isError(err: unknown): boolean {
  return err instanceof ProductFieldsError || err instanceof CreadentialsMismatchError;
}

export class ProductController {
  /* ------------------------------------------------------------------ */
  /* Get All Products                                                   */
  /* ------------------------------------------------------------------ */
  // static getAll = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  /* ------------------------------------------------------------------ */
  /* Get Limited Product                                                */
  /* ------------------------------------------------------------------ */
  static getLimited = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit } = req.params as { limit: string };
      if (!limit) {
        throw new CreadentialsMismatchError('Limit is required to get products');
      }

      const products = await getLimitProducts(parseInt(limit));
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Get Search Products                                                */
  /* ------------------------------------------------------------------ */
  static getSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.params as { search: string };
      if (!search) {
        throw new CreadentialsMismatchError('search is required to get products');
      }

      const products = await getSearchProduct(search);
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Get Product By Slug                                                */
  /* ------------------------------------------------------------------ */
  static getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params as { slug: string };
      if (!slug) {
        throw new CreadentialsMismatchError('Slug is required to get product');
      }
      const product = await getProductBySlug(slug);
      res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Create Product                                                     */
  /* ------------------------------------------------------------------ */
  static create = async (req: Request, res: Response, next: NextFunction) => {
    const { uploadMedia } = mediaService();
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const rawData = {
        ...req.body,
        images: files ?? [],
      };

      const validateDaat = createProductValidationSchema.safeParse(rawData);

      if (!validateDaat.success) {
        const errorFields = validateDaat.error.flatten().fieldErrors;
        throw new ProductFieldsError(JSON.stringify(errorFields));
      }

      const validatedImages = validateDaat.data.images as Express.Multer.File[];

      const imageUrls = await Promise.all(
        validatedImages.map(async (file) => {
          const result = await uploadMedia({
            file,
            fileName: file.originalname,
            fileType: file.mimetype,
            folder: validateDaat.data.category || 'products',
          });
          return result.data.imagePath;
        }),
      );

      const productDto: CreateProductDto = {
        ...validateDaat.data,
        images: imageUrls.map((url, index) => ({
          url: url,
          alt: validateDaat.data.title.split(' ', 5).join(' '),
          isPrimary: index === 0,
          order: index,
        })),
      };

      const createdProduct = await productCreate(productDto);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product: createdProduct },
      });
    } catch (error) {
      if (isError(error)) throw error;
      next(error);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Update Product                                                     */
  /* ------------------------------------------------------------------ */
  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug: productId } = req.params as { slug: string };
      const productData = req.body as UpdateProductDto;

      if (!productId) {
        throw new CreadentialsMismatchError('ProductId is required to update');
      }

      const validateDaat = updateProductSchema.safeParse(productData);
      if (!validateDaat.success) {
        const errorFields = validateDaat.error.flatten().fieldErrors;
        throw new ProductFieldsError(errorFields.toString());
      }

      const updatedProduct = await productUpdate({ productId, product: validateDaat.data });

      res.status(201).json({
        success: true,
        message: 'Product updated successfully',
        data: { product: updatedProduct },
      });
    } catch (error) {
      if (isError(error)) throw error;
      next(error);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Delete Product                                                     */
  /* ------------------------------------------------------------------ */
  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug: productId } = req.params as { slug: string };
      if (!productId) {
        throw new CreadentialsMismatchError('ProductId is required to delete');
      }

      await productDeleteById(productId);
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      if (isError(error)) throw error;
      next(error);
    }
  };
}
