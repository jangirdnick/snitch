/**
 * product.controller.ts
 *
 * Handles all Product CRUD operations.
 *
 * ─── Create image convention ──────────────────────────────────────────────────
 * POST /api/product  →  multipart/form-data with two fields:
 *   • `data`   — JSON string of the full product payload.
 *                Each color object includes an `imageIndices` field (number[])
 *                that references positions in the flat `images` file array.
 *   • `images` — Flat array of image files (uploaded via multer).
 *
 * Example `data` colors entry:
 *   { name: "Red", hex: "#FF0000", imageIndices: [0, 1], sizes: [...], isDefault: true }
 *
 * The controller maps files[imageIndices[n]] → color.images before validation.
 * Zod strips the non-schema `imageIndices` field automatically during parse.
 *
 * ─── Update convention ───────────────────────────────────────────────────────
 * PUT /api/product/:id  →  Same multipart convention as create.
 *   Omit `colors` in `data` to leave colors/images unchanged.
 *   Provide `colors` with `imageIndices` to replace all color images.
 */

import type { NextFunction, Request, Response } from 'express';
import { mediaService } from '@/services/media.service.js';
import redis from '@/config/redis.config.js';
import mongoose from 'mongoose';
import {
  getProducts,
  getLimitProducts,
  getProductById,
  getProductBySlug,
  getSearchProduct,
  productCreate,
  productDeleteById,
  productUpdate,
} from '@/services/product.service.js';
import type {
  CreateProductDto,
  CreateProductValidationDto,
  UpdateProductDto,
} from '@snitch/schemas';
import {
  createProductValidationSchema,
  updateProductSchema,
  productQuerySchema,
} from '@snitch/schemas';
import { createLogger } from '@/utils/logger.js';

const logger = createLogger('PRODUCT-CONTROLLER');

// ─── Controller-scoped Errors ─────────────────────────────────────────────────

export class ProductFieldsError extends Error {
  public readonly statusCode = 400;
  public readonly fields: Record<string, string[] | undefined>;
  constructor(errorFields: Record<string, string[] | undefined>) {
    super('Product validation failed');
    this.name = 'ProductFieldsError';
    this.fields = errorFields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProductRequestError extends Error {
  public readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ProductRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the database write fails during product creation.
 * Preserves the original DB error as `cause` for logging while
 * returning a generic 500 message to the client.
 */
export class ProductCreateError extends Error {
  public readonly statusCode = 500;
  constructor(cause?: unknown) {
    super('Failed to create product. Please try again.');
    this.name = 'ProductCreateError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProductConflictError extends Error {
  public readonly statusCode = 409;
  constructor(message: string) {
    super(message);
    this.name = 'ProductConflictError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the database write fails during a product update.
 * Preserves the original DB error as `cause` for logging while
 * returning a generic 500 message to the client.
 */
export class ProductUpdateError extends Error {
  public readonly statusCode = 500;
  constructor(cause?: unknown) {
    super('Failed to update product. Please try again.');
    this.name = 'ProductUpdateError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Safely parse a string field from multipart body as JSON.
 * Returns the parsed value or throws ProductFieldsError.
 */
function parseJsonField(raw: unknown, fieldName: string): unknown {
  const fieldStr = raw as string;
  if (typeof fieldStr !== 'string' || !fieldStr.trim()) {
    throw new ProductFieldsError({ [fieldName]: ['Must be a non-empty JSON string'] });
  }
  try {
    return JSON.parse(fieldStr);
  } catch {
    throw new ProductFieldsError({ [fieldName]: ['Contains invalid JSON'] });
  }
}

/**
 * Map a flat file array onto the colors using each color's `imageIndices`.
 * Strips `imageIndices` from the returned objects (Zod will also strip it,
 * but removing it here keeps types clean).
 */
interface RawColor {
  imageIndices?: number[];
  [key: string]: unknown;
}

function attachFilesToColors(
  rawColors: RawColor[],
  files: Express.Multer.File[],
): Record<string, unknown>[] {
  return rawColors.map((color) => {
    const { imageIndices, ...rest } = color;
    const images = (imageIndices ?? [])
      .map((i) => files[i])
      .filter((f): f is Express.Multer.File => f !== undefined);
    return { ...rest, images };
  });
}

function formatProductMedia<T extends { colors?: Array<{ images?: Array<{ url: string }> }> }>(
  product: T,
): T {
  product.colors?.forEach((color) => {
    color.images?.forEach((img) => {
      if (img.url && !/^(https?:\/\/|data:)/i.test(img.url)) {
        try {
          img.url = generateUrl({
            path: img.url,
            transformations: {
              width: 600,
              height: 800,
              format: 'webp',
              quality: 80,
            },
          });
        } catch {
          // Keep original url if generation fails
        }
      }
    });
  });
  return product;
}

// ─── Module-scoped media service (avoid re-instantiating per request) ────────
const { uploadMedia, deleteMedia, generateUrl } = mediaService();

// ─── ProductController ────────────────────────────────────────────────────────

export class ProductController {
  /* ─────────────────────────────────────────────────────────────────────────
   * GET /api/product
   * Query: gender, categoryType, fit, size, color, status, minPrice, maxPrice,
   *        isFeatured, isNewArrival, isBestSeller, search, page, limit, sortBy, sortOrder
   * ───────────────────────────────────────────────────────────────────────── */
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParsed = productQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        const errors = queryParsed.error.flatten().fieldErrors;
        throw new ProductFieldsError(errors);
      }

      const result = await getProducts(queryParsed.data);
      result.items.forEach((product) => formatProductMedia(product));

      res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
   * GET /api/product/limited/:limit
   * ───────────────────────────────────────────────────────────────────────── */
  static getLimited = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit } = req.params as { limit: string };
      if (!limit) {
        throw new ProductRequestError('limit is required');
      }
      const limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum < 1) {
        throw new ProductRequestError('limit must be a positive integer');
      }

      const products = await getLimitProducts(Math.min(limitNum, 100));
      products.forEach((product) => formatProductMedia(product));

      res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
   * GET /api/product/search/:search
   * ───────────────────────────────────────────────────────────────────────── */
  static getSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.params as { search: string };
      if (!search) {
        throw new ProductRequestError('Search term is required');
      }

      const products = await getSearchProduct(search);
      products.forEach((product) => formatProductMedia(product));

      res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
   * GET /api/product/id/:id  — fetch by MongoDB _id (admin edit)
   * ───────────────────────────────────────────────────────────────────────── */
  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      if (!id?.trim()) {
        throw new ProductRequestError('Product ID is required');
      }

      const product = await getProductById(id);
      formatProductMedia(product);

      res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
   * GET /api/product/:slug
   * ───────────────────────────────────────────────────────────────────────── */
  static getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params as { slug: string };
      if (!slug.trim()) {
        throw new ProductRequestError('Slug is required');
      }

      const product = await getProductBySlug(slug);
      formatProductMedia(product);

      res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
   * POST /api/product
   *
   * multipart/form-data:
   *   data:   JSON string — full product payload; colors include `imageIndices`
   *   images: flat array of image files
   *
   * Flow:
   *   1. Parse `data` JSON
   *   2. Attach multer files to each color via imageIndices
   *   3. Validate with createProductValidationSchema (file-aware)
   *   4. Upload all images per color to cloud storage
   *      ↳ Track every upload path so we can roll back on failure
   *   5. Replace file objects with URL objects
   *   6. Persist with productCreate
   *      ↳ On DB failure → roll back all uploaded images (best-effort)
   * ───────────────────────────────────────────────────────────────────────── */
  static create = async (req: Request, res: Response, next: NextFunction) => {
    /** Accumulates cloud paths of successfully uploaded images.
     *  Used for rollback if the DB write fails after partial/full uploads. */
    const uploadedPaths: string[] = [];
    const idempotencyKey = req.headers['idempotency-key'] as string | undefined;

    try {
      // ── Idempotency Check ──────────────────────────────────────────────────
      if (idempotencyKey) {
        const lockKey = `idempotency:product:create:${idempotencyKey}`;
        // Try to set the key. NX = only if not exists, EX = expire in 86400 seconds (24h)
        const acquired = await redis.set(lockKey, 'processing', 'EX', 86400, 'NX');
        if (!acquired) {
          throw new ProductConflictError(
            'A product creation request is already being processed or has been completed.',
          );
        }
      }

      const files = (req.files as Express.Multer.File[]) ?? [];

      // ── 1. Parse product data JSON ─────────────────────────────────────────
      const rawBody = parseJsonField(req.body?.data, 'data') as Record<string, unknown>;

      // ── 2. Attach multer files to colors via imageIndices ─────────────────
      if (!Array.isArray(rawBody.colors) || rawBody.colors.length === 0) {
        throw new ProductFieldsError({
          colors: ['At least one color variant is required'],
        });
      }

      const colorsWithFiles = attachFilesToColors(rawBody.colors as RawColor[], files);
      const rawData = { ...rawBody, colors: colorsWithFiles };

      // ── 3. Validate with file-aware schema ─────────────────────────────────
      const validation = createProductValidationSchema.safeParse(rawData);
      if (!validation.success) {
        throw new ProductFieldsError(validation.error.flatten().fieldErrors);
      }

      const { data: validated }: { data: CreateProductValidationDto } = validation;

      // ── 4 & 5. Upload all files and transform to URL objects ───────────────
      // NOTE: Images are uploaded in parallel for speed. If any upload fails,
      // the catch block rolls back all paths accumulated so far.
      const colorsWithUrls = await Promise.all(
        validated.colors.map(
          async (color: CreateProductValidationDto['colors'][number], colorIdx: number) => {
            const imageFiles = color.images;

            const uploadedImages = await Promise.all(
              imageFiles.map(async (file: Express.Multer.File, imgIdx: number) => {
                const result = await uploadMedia({
                  file,
                  fileName: `${validated.sku}-c${colorIdx}-i${imgIdx}-${file.originalname}`,
                  fileType: file.mimetype,
                  folder: `products/${validated.sku}`,
                });

                // Track path for rollback
                uploadedPaths.push(result.data.imagePath as string);

                return {
                  url: result.data.imagePath as string,
                  alt: `${validated.title} — ${color.name}`,
                  isPrimary: imgIdx === 0,
                  order: imgIdx,
                };
              }),
            );

            return {
              name: color.name,
              hex: color.hex,
              sizes: color.sizes,
              isDefault: color.isDefault,
              images: uploadedImages,
            };
          },
        ),
      );

      // ── 6. Persist — with MongoDB Transaction and cloud rollback ───────────
      let created;
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const productDto: CreateProductDto = {
          ...validated,
          colors: colorsWithUrls,
        };
        created = await productCreate(productDto, session);
        await session.commitTransaction();
      } catch (dbError) {
        await session.abortTransaction();

        // Best-effort rollback: attempt to delete every uploaded image.
        // allSettled ensures one failed delete doesn't block the others.
        const rollbackResults = await Promise.allSettled(
          uploadedPaths.map((path) => deleteMedia(path)),
        );

        const failedRollbacks = rollbackResults.filter((r) => r.status === 'rejected');
        if (failedRollbacks.length > 0) {
          req.logger.error(
            { failedRollbacks, uploadedPaths },
            `[PRODUCT CREATE] DB write failed and ${failedRollbacks.length}/${uploadedPaths.length} image rollbacks also failed — orphaned cloud assets`,
          );
        } else if (uploadedPaths.length > 0) {
          req.logger.info(
            { uploadedPaths },
            `[PRODUCT CREATE] DB write failed — rolled back ${uploadedPaths.length} uploaded images`,
          );
        }

        // Wrap the DB error in a domain-specific error so globalErrorFilter
        // maps it to 500 consistently. The original error is preserved as `cause`.
        throw new ProductCreateError(dbError);
      } finally {
        session.endSession();
      }

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product: created },
      });
    } catch (error) {
      // If any error occurs (validation, upload, db), clear the idempotency key
      // so the client can genuinely retry.
      if (idempotencyKey && !(error instanceof ProductConflictError)) {
        await redis.del(`idempotency:product:create:${idempotencyKey}`).catch((err) => {
          req.logger.error({ err, idempotencyKey }, 'Failed to clear idempotency key on error');
        });
      }
      next(error);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
   * PUT /api/product/:id
   *
   * Same multipart convention as create.
   * Partial update — all fields optional (except sku which is omitted from schema).
   * If `colors` is present in `data`, images must be provided via imageIndices.
   * If `colors` is absent, existing colors are left unchanged.
   *
   * Flow:
   *   1. Parse `data` JSON (or fall back to raw req.body for JSON requests)
   *   2. Attach multer files to colors if colors present
   *   3. Validate with updateProductSchema (partial, URL-based)
   *      OR updateProductValidationSchema (partial, file-based) if files present
   *   4. Upload new images if any
   *   5. Patch with productUpdate
   * ───────────────────────────────────────────────────────────────────────── */
  static update = async (req: Request, res: Response, next: NextFunction) => {
    /** Tracks cloud paths uploaded during this request for rollback on DB failure. */
    const uploadedPaths: string[] = [];

    try {
      const { id: productId } = req.params as { id: string };
      if (!productId.trim()) {
        throw new ProductRequestError('Product ID is required');
      }

      const files = (req.files as Express.Multer.File[]) ?? [];

      // ── 1. Fetch existing product for diffing and orphan cleanup ─────────────
      const existingProduct = await getProductById(productId);

      // ── 2. Parse body ────────────────────────────────────────────────────────
      // Support both multipart (data field) and raw JSON content-type
      let rawBody: Record<string, unknown>;
      if (req.body?.data) {
        rawBody = parseJsonField(req.body.data, 'data') as Record<string, unknown>;
      } else {
        rawBody = req.body as Record<string, unknown>;
      }

      // ── 3. Handle colors with new images ───────────────────────────────────
      let processedBody = { ...rawBody };

      if (Array.isArray(rawBody.colors) && rawBody.colors.length > 0) {
        interface RawColorUpdate {
          name?: string;
          hex?: string;
          isDefault?: boolean;
          sizes?: unknown[];
          existingImages?: Array<{ url: string; alt: string; isPrimary: boolean; order: number }>;
          imageIndices?: number[];
          [key: string]: unknown;
        }

        const colorsWithUrls = await Promise.all(
          (rawBody.colors as RawColorUpdate[]).map(async (color, colorIdx) => {
            const { existingImages = [], imageIndices = [], ...restColor } = color;

            // Upload new files referenced by imageIndices
            const uploadedImages = await Promise.all(
              imageIndices
                .map((i) => files[i])
                .filter((f): f is Express.Multer.File => f !== undefined)
                .map(async (file, imgIdx) => {
                  const result = await uploadMedia({
                    file,
                    fileName: `${productId}-c${colorIdx}-i${imgIdx}-${file.originalname}`,
                    fileType: file.mimetype,
                    folder: `products/${productId}`,
                  });

                  // Track for rollback
                  uploadedPaths.push(result.data.imagePath as string);

                  return {
                    url: result.data.imagePath as string,
                    alt: `${(rawBody.title as string) ?? ''} — ${color.name ?? ''}`,
                    isPrimary: existingImages.length === 0 && imgIdx === 0,
                    order: existingImages.length + imgIdx,
                  };
                }),
            );

            // Restore original paths for existing images (frontend sends full generated URLs)
            const restoredExistingImages = existingImages.map((existingImg) => {
              let matchedPath = existingImg.url;
              for (const c of existingProduct.colors ?? []) {
                const found = c.images.find((img) => existingImg.url.includes(img.url));
                if (found) {
                  matchedPath = found.url;
                  break;
                }
              }
              return { ...existingImg, url: matchedPath };
            });

            // Merge: existing images retain their position, new uploads appended
            const allImages = [...restoredExistingImages, ...uploadedImages];

            return { ...restColor, images: allImages };
          }),
        );

        processedBody = { ...processedBody, colors: colorsWithUrls };
      }

      // ── 4. Validate partial update with URL-based schema ───────────────────
      const validation = updateProductSchema.safeParse(processedBody);
      if (!validation.success) {
        throw new ProductFieldsError(validation.error.flatten().fieldErrors);
      }

      // ── 5. Build Minimal Update Payload ──────────────────────────────────────
      const minimalUpdate: Record<string, unknown> = {};
      const incoming = validation.data;

      // Compare primitives and deeply compare objects/arrays using JSON stringify
      for (const [key, value] of Object.entries(incoming)) {
        const existingValue = (existingProduct as UpdateProductDto)[key];
        if (JSON.stringify(existingValue) !== JSON.stringify(value)) {
          minimalUpdate[key] = value;
        }
      }

      // ── 6. Bail out early if no fields were changed ──────────────────────────
      if (Object.keys(minimalUpdate).length === 0) {
        return void res.status(200).json({
          success: true,
          message: 'No changes detected. Product is up to date.',
          data: { product: existingProduct },
        });
      }

      // ── 7. Snapshot existing image URLs (before update) for orphan cleanup ──
      // Only needed if colors are being replaced in this request.
      let previousImageUrls: string[] = [];
      if (minimalUpdate.colors !== undefined) {
        try {
          previousImageUrls =
            existingProduct.colors?.flatMap((c) => c.images.map((img) => img.url)) ?? [];
        } catch (snapshotErr) {
          // Non-fatal — worst case orphaned assets remain; log and continue
          logger.warn(
            { err: snapshotErr, productId },
            '[PRODUCT UPDATE] Could not snapshot existing image URLs for orphan cleanup',
          );
        }
      }

      // ── 8. Persist — roll back cloud uploads on DB failure ─────────────────
      let updated;
      try {
        updated = await productUpdate({ productId, product: minimalUpdate });
      } catch (dbError) {
        const rollbackResults = await Promise.allSettled(
          uploadedPaths.map((path) => deleteMedia(path)),
        );
        const failedRollbacks = rollbackResults.filter((r) => r.status === 'rejected');
        if (failedRollbacks.length > 0) {
          logger.error(
            { failedRollbacks, uploadedPaths, productId },
            `[PRODUCT UPDATE] DB write failed and ${failedRollbacks.length}/${uploadedPaths.length} image rollbacks also failed — orphaned cloud assets`,
          );
        } else if (uploadedPaths.length > 0) {
          logger.info(
            { uploadedPaths, productId },
            `[PRODUCT UPDATE] DB write failed — rolled back ${uploadedPaths.length} uploaded images`,
          );
        }
        // Wrap the DB error in a domain-specific error.
        throw new ProductUpdateError(dbError);
      }

      // ── 9. Clean up orphaned media (best-effort, never fail the request) ────
      // Compare old image URLs vs new ones; delete any that were removed.
      if (previousImageUrls.length > 0) {
        const newImageUrls = new Set<string>(
          updated.colors.flatMap((c) => c.images.map((img: { url: string }) => img.url)),
        );
        const staleUrls = previousImageUrls.filter((url) => !newImageUrls.has(url));

        if (staleUrls.length > 0) {
          logger.info(
            { staleUrls, productId },
            `[PRODUCT UPDATE] Cleaning up ${staleUrls.length} orphaned image(s)`,
          );
          const cleanupResults = await Promise.allSettled(staleUrls.map((url) => deleteMedia(url)));
          const failedCleanups = cleanupResults.filter((r) => r.status === 'rejected');
          if (failedCleanups.length > 0) {
            logger.error(
              { failedCleanups, staleUrls, productId },
              `[PRODUCT UPDATE] ${failedCleanups.length}/${staleUrls.length} orphaned image deletions failed`,
            );
          }
        }
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: { product: updated },
      });
    } catch (error) {
      next(error);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────
   * DELETE /api/product/:id
   * ───────────────────────────────────────────────────────────────────────── */
  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: productId } = req.params as { id: string };
      if (!productId.trim()) {
        throw new ProductRequestError('Product ID is required');
      }

      await productDeleteById(productId);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
