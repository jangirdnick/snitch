import type { NextFunction, Request, Response } from 'express';
import {
  orderGetAll,
  orderGetById,
  orderUpdateStatus,
  orderUpdateTracking,
} from '@/services/order.service.js';
import {
  orderQuerySchema,
  updateOrderStatusSchema,
  updateOrderTrackingSchema,
} from '@snitch/schemas';

export class OrderFieldsError extends Error {
  public readonly statusCode = 400;
  public readonly fields: Record<string, string[] | undefined>;
  constructor(errorFields: Record<string, string[] | undefined>) {
    super('Order validation failed');
    this.name = 'OrderFieldsError';
    this.fields = errorFields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class OrderRequestError extends Error {
  public readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'OrderRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class OrderController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParsed = orderQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        throw new OrderFieldsError(queryParsed.error.flatten().fieldErrors);
      }

      const result = await orderGetAll(queryParsed.data);

      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new OrderRequestError('Order ID is required');
      }

      const order = await orderGetById(id);
      res.status(200).json({
        success: true,
        message: 'Order fetched successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new OrderRequestError('Order ID is required');
      }

      const bodyParsed = updateOrderStatusSchema.safeParse(req.body);
      if (!bodyParsed.success) {
        throw new OrderFieldsError(bodyParsed.error.flatten().fieldErrors);
      }

      const order = await orderUpdateStatus(id, bodyParsed.data);
      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateTracking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        throw new OrderRequestError('Order ID is required');
      }

      const bodyParsed = updateOrderTrackingSchema.safeParse(req.body);
      if (!bodyParsed.success) {
        throw new OrderFieldsError(bodyParsed.error.flatten().fieldErrors);
      }

      const order = await orderUpdateTracking(id, bodyParsed.data);
      res.status(200).json({
        success: true,
        message: 'Order tracking updated successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };
}
