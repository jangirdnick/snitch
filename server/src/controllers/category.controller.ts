import type { NextFunction, Request, Response } from 'express';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  categoryCreate,
  categoryUpdate,
  categoryDeleteById,
} from '@/services/category.service.js';
import { mediaService } from '@/services/media.service.js';
import { categoryQuerySchema, createCategorySchema, updateCategorySchema } from '@snitch/schemas';

const { uploadMedia, deleteMedia, generateUrl } = mediaService();

export class CategoryFieldsError extends Error {
  public readonly statusCode = 400;
  public readonly fields: Record<string, string[] | undefined>;

  constructor(errorFields: Record<string, string[] | undefined>) {
    super('Category validation failed');
    this.name = 'CategoryFieldsError';
    this.fields = errorFields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CategoryRequestError extends Error {
  public readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'CategoryRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function formatCategoryMedia<T extends { image?: { path?: string; url?: string } | null }>(
  cat: T,
): T {
  if (cat?.image) {
    const targetPath = cat.image.path || cat.image.url;
    if (targetPath && !/^(https?:\/\/|data:)/i.test(targetPath)) {
      try {
        cat.image.url = generateUrl({
          path: targetPath,
          transformations: { width: 800, height: 800, format: 'webp', quality: 80 },
        });
      } catch {
        // fallback
      }
    }
  }
  return cat;
}

export class CategoryController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParsed = categoryQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        const errors = queryParsed.error.flatten().fieldErrors;
        throw new CategoryFieldsError(errors);
      }

      const result = await getCategories(queryParsed.data);
      result.items.forEach((cat) => formatCategoryMedia(cat));

      res.status(200).json({
        success: true,
        message: 'Categories fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      if (!id?.trim()) {
        throw new CategoryRequestError('Category ID is required');
      }

      const category = await getCategoryById(id);
      formatCategoryMedia(category);

      res.status(200).json({
        success: true,
        message: 'Category fetched successfully',
        data: { category },
      });
    } catch (error) {
      next(error);
    }
  };

  static getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params as { slug: string };
      if (!slug.trim()) {
        throw new CategoryRequestError('Slug is required');
      }

      const category = await getCategoryBySlug(slug);
      formatCategoryMedia(category);

      res.status(200).json({
        success: true,
        message: 'Category fetched successfully',
        data: { category },
      });
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    let uploadedPath: string | null = null;
    try {
      let rawBody: Record<string, unknown>;
      if (req.body?.data) {
        try {
          rawBody = JSON.parse(req.body.data);
        } catch {
          throw new CategoryFieldsError({ data: ['Contains invalid JSON'] });
        }
      } else {
        rawBody = { ...req.body };
      }

      const file = req.file as Express.Multer.File | undefined;

      if (file) {
        const nameSlug =
          typeof rawBody.name === 'string'
            ? rawBody.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            : 'category';
        const result = await uploadMedia({
          file,
          fileName: `category-${nameSlug}-${Date.now()}-${file.originalname}`,
          fileType: file.mimetype,
          folder: 'categories',
        });

        uploadedPath = result.data.imagePath;
        const imageUrl = generateUrl({
          path: uploadedPath,
          transformations: { width: 800, height: 800, format: 'webp', quality: 80 },
        });

        rawBody.image = {
          path: uploadedPath,
          url: imageUrl,
          alt: (rawBody.alt as string) || (rawBody.name as string) || '',
        };
      }

      const validation = createCategorySchema.safeParse(rawBody);
      if (!validation.success) {
        throw new CategoryFieldsError(validation.error.flatten().fieldErrors);
      }

      let created;
      try {
        created = await categoryCreate(validation.data);
      } catch (dbError) {
        if (uploadedPath) {
          await deleteMedia(uploadedPath).catch((err) => {
            req.logger?.error(
              { err, uploadedPath },
              'Failed to delete uploaded media on DB failure',
            );
          });
        }
        throw dbError;
      }

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category: formatCategoryMedia(created) },
      });
    } catch (error) {
      if (uploadedPath) {
        await deleteMedia(uploadedPath).catch((err) => {
          req.logger?.error({ err, uploadedPath }, 'Failed to rollback uploaded media');
        });
      }
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    let newlyUploadedPath: string | null = null;
    try {
      const { id } = req.params as { id: string };
      if (!id?.trim()) {
        throw new CategoryRequestError('Category ID is required');
      }

      const existingCategory = await getCategoryById(id);

      let rawBody: Record<string, unknown>;
      if (req.body?.data) {
        try {
          rawBody = JSON.parse(req.body.data);
        } catch {
          throw new CategoryFieldsError({ data: ['Contains invalid JSON'] });
        }
      } else {
        rawBody = { ...req.body };
      }

      const file = req.file as Express.Multer.File | undefined;

      if (file) {
        const nameSlug =
          typeof rawBody.name === 'string'
            ? rawBody.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            : 'category';
        const result = await uploadMedia({
          file,
          fileName: `category-${nameSlug}-${Date.now()}-${file.originalname}`,
          fileType: file.mimetype,
          folder: 'categories',
        });

        newlyUploadedPath = result.data.imagePath;
        const imageUrl = generateUrl({
          path: newlyUploadedPath,
          transformations: { width: 800, height: 800, format: 'webp', quality: 80 },
        });

        rawBody.image = {
          path: newlyUploadedPath,
          url: imageUrl,
          alt: (rawBody.alt as string) || (rawBody.name as string) || '',
        };
      }

      const validation = updateCategorySchema.safeParse(rawBody);
      if (!validation.success) {
        throw new CategoryFieldsError(validation.error.flatten().fieldErrors);
      }

      let updated;
      try {
        updated = await categoryUpdate({ categoryId: id, category: validation.data });
      } catch (dbError) {
        if (newlyUploadedPath) {
          await deleteMedia(newlyUploadedPath).catch((err) => {
            req.logger?.error(
              { err, newlyUploadedPath },
              'Failed to delete newly uploaded media on DB failure',
            );
          });
        }
        throw dbError;
      }

      if (file && existingCategory.image?.path) {
        await deleteMedia(existingCategory.image.path).catch((err) => {
          req.logger?.error(
            { err, oldPath: existingCategory.image?.path },
            'Failed to delete old category image',
          );
        });
      }

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: { category: formatCategoryMedia(updated) },
      });
    } catch (error) {
      if (newlyUploadedPath) {
        await deleteMedia(newlyUploadedPath).catch((err) => {
          req.logger?.error({ err, newlyUploadedPath }, 'Failed to rollback uploaded media');
        });
      }
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      if (!id?.trim()) {
        throw new CategoryRequestError('Category ID is required');
      }

      const category = await getCategoryById(id);

      await categoryDeleteById(id);

      if (category.image?.path) {
        await deleteMedia(category.image.path).catch((err) => {
          req.logger?.error(
            { err, imagePath: category.image?.path },
            'Failed to delete category image from storage',
          );
        });
      }

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
