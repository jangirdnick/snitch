import type { NextFunction, Request, Response } from 'express';
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  categoryCreate,
  categoryUpdate,
  categoryDeleteById,
} from '@/services/category.service.js';
import { createCategorySchema, updateCategorySchema, categoryQuerySchema } from '@snitch/schemas';

// ─── Controller-scoped Errors ─────────────────────────────────────────────────

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

// ─── CategoryController ────────────────────────────────────────────────────────

export class CategoryController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParsed = categoryQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        const errors = queryParsed.error.flatten().fieldErrors;
        throw new CategoryFieldsError(errors);
      }

      const result = await getCategories(queryParsed.data);

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
    try {
      const validation = createCategorySchema.safeParse(req.body);
      if (!validation.success) {
        throw new CategoryFieldsError(validation.error.flatten().fieldErrors);
      }

      const created = await categoryCreate(validation.data);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category: created },
      });
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: categoryId } = req.params as { id: string };
      if (!categoryId.trim()) {
        throw new CategoryRequestError('Category ID is required');
      }

      const validation = updateCategorySchema.safeParse(req.body);
      if (!validation.success) {
        throw new CategoryFieldsError(validation.error.flatten().fieldErrors);
      }

      const updated = await categoryUpdate({ categoryId, category: validation.data });

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: { category: updated },
      });
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: categoryId } = req.params as { id: string };
      if (!categoryId.trim()) {
        throw new CategoryRequestError('Category ID is required');
      }

      await categoryDeleteById(categoryId);

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
