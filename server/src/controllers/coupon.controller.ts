import type { Request, Response, NextFunction } from 'express';
import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from '@/services/coupon.service.js';
import {
  couponQuerySchema,
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
} from '@snitch/schemas';

export class CouponRequestError extends Error {
  public readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'CouponRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CouponFieldsError extends Error {
  public readonly statusCode = 400;
  public readonly fields: Record<string, string[] | undefined>;
  constructor(fields: Record<string, string[] | undefined>) {
    super('Coupon validation failed');
    this.name = 'CouponFieldsError';
    this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const CouponController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = couponQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        throw new CouponFieldsError(parsed.error.flatten().fieldErrors);
      }
      const data = await getCoupons(parsed.data);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const data = await getCouponById(id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = createCouponSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new CouponFieldsError(parsed.error.flatten().fieldErrors);
      }
      const data = await createCoupon(parsed.data);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const parsed = updateCouponSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new CouponFieldsError(parsed.error.flatten().fieldErrors);
      }
      const data = await updateCoupon(id, parsed.data);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await deleteCoupon(id);
      res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  validate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = validateCouponSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new CouponFieldsError(parsed.error.flatten().fieldErrors);
      }
      const data = await validateCoupon(parsed.data.code, parsed.data.orderAmount);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
