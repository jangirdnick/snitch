import type { NextFunction, Request, Response } from 'express';
import {
  orderGetAll,
  orderGetById,
  orderUpdateStatus,
  orderUpdateTracking,
} from '@/services/order.service.js';
import { mediaService } from '@/services/media.service.js';
import {
  orderQuerySchema,
  updateOrderStatusSchema,
  updateOrderTrackingSchema,
} from '@snitch/schemas';
import type { Order } from '@snitch/types';

const { generateUrl } = mediaService();

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

function toPublicUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return undefined;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return undefined;
  if (/^(https?:\/\/|data:)/i.test(trimmed)) {
    return trimmed;
  }
  try {
    return generateUrl({
      path: trimmed,
      transformations: { width: 800, height: 800, format: 'webp', quality: 80 },
    });
  } catch {
    return trimmed;
  }
}

function formatOrderMedia(order: Order): Order {
  if (!order) return order;

  if (order.user && typeof order.user === 'object' && order.user.avatar) {
    order.user.avatar = toPublicUrl(order.user.avatar);
  }

  order.items?.forEach((item) => {
    // 1. Process item's direct primaryImage
    if (item.primaryImage) {
      item.primaryImage = toPublicUrl(item.primaryImage);
    }

    // 2. Process populated product color variation images
    const prod = (item as unknown as Record<string, unknown>).product as
      Record<string, unknown> | undefined;
    if (prod && typeof prod === 'object' && Array.isArray(prod.colors)) {
      (
        prod.colors as Array<{
          isDefault?: boolean;
          images?: Array<{ url: string; isPrimary?: boolean }>;
        }>
      ).forEach((color) => {
        color.images?.forEach((img) => {
          if (img.url) {
            const resolvedUrl = toPublicUrl(img.url);
            if (resolvedUrl) {
              img.url = resolvedUrl;
              if (!item.primaryImage && (img.isPrimary || color.isDefault)) {
                item.primaryImage = resolvedUrl;
              }
            }
          }
        });
      });

      if (!item.primaryImage && prod.colors.length > 0) {
        const firstImg = prod.colors[0]?.images?.[0]?.url;
        if (firstImg) {
          item.primaryImage = toPublicUrl(firstImg);
        }
      }
    }
  });

  return order;
}

export class OrderController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParsed = orderQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        throw new OrderFieldsError(queryParsed.error.flatten().fieldErrors);
      }

      const result = await orderGetAll(queryParsed.data);
      result.items.forEach((order) => formatOrderMedia(order));

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
      formatOrderMedia(order);

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
      formatOrderMedia(order);

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
      formatOrderMedia(order);

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
