import orderModel from '@/models/order.model.js';
import { DatabaseOperationError } from '@/services/user.service.js';
import { createLogger } from '@/utils/logger.js';
import type { OrderQueryDto, UpdateOrderStatusDto, UpdateOrderTrackingDto } from '@snitch/schemas';
import type { PaginatedOrders, Order as OrderType } from '@snitch/types';

const logger = createLogger('ORDER-SERVICE');

export class OrderNotFoundError extends Error {
  public readonly statusCode = 404;
  constructor(identifier: string) {
    super(`Order not found: ${identifier}`);
    this.name = 'OrderNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class OrderOperationError extends Error {
  public readonly statusCode = 500;
  constructor(operation: string, cause?: unknown) {
    super(`Order operation error: ${operation}`);
    this.name = 'OrderOperationError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function isOrderError(error: unknown): boolean {
  return (
    error instanceof OrderNotFoundError ||
    error instanceof OrderOperationError ||
    error instanceof DatabaseOperationError
  );
}

export async function orderGetAll(query: OrderQueryDto): Promise<PaginatedOrders> {
  try {
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }
    if (query.search) {
      filter.$or = [{ orderNumber: { $regex: query.search, $options: 'i' } }];
    }

    const sortDir = query.sortOrder === 'asc' ? 1 : -1;
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      orderModel
        .find(filter)
        .populate('user', 'id firstName lastName email avatar')
        .populate('items.product', 'id title slug colors price category')
        .sort({ [query.sortBy]: sortDir, _id: 1 })
        .skip(skip)
        .limit(query.limit)
        .lean()
        .exec(),
      orderModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / query.limit) || 1;

    return {
      items: items as unknown as OrderType[],
      total,
      page: query.page,
      limit: query.limit,
      totalPages,
    };
  } catch (error) {
    if (isOrderError(error)) throw error;
    logger.error({ err: error, query }, 'Error fetching orders');
    throw new DatabaseOperationError('orderGetAll', error);
  }
}

export async function orderGetById(id: string): Promise<OrderType> {
  try {
    const order = await orderModel
      .findOne({ id })
      .populate('user', 'id firstName lastName email contact avatar')
      .populate('items.product', 'id title slug colors price category')
      .lean()
      .exec();

    if (!order) {
      throw new OrderNotFoundError(id);
    }
    return order as unknown as OrderType;
  } catch (error) {
    if (isOrderError(error)) throw error;
    logger.error({ err: error, id }, 'Error fetching order by ID');
    throw new DatabaseOperationError('orderGetById', error);
  }
}

export async function orderUpdateStatus(
  id: string,
  data: UpdateOrderStatusDto,
): Promise<OrderType> {
  try {
    const order = await orderModel.findOne({ id }).exec();
    if (!order) {
      throw new OrderNotFoundError(id);
    }

    order.status = data.status;
    order.timeline.push({
      status: data.status,
      note: data.note,
      timestamp: new Date(),
    });

    await order.save();

    const updated = await orderModel
      .findOne({ id })
      .populate('user', 'id firstName lastName email contact avatar')
      .populate('items.product', 'id title slug colors price category')
      .lean()
      .exec();

    return updated as unknown as OrderType;
  } catch (error) {
    if (isOrderError(error)) throw error;
    logger.error({ err: error, id }, 'Error updating order status');
    throw new DatabaseOperationError('orderUpdateStatus', error);
  }
}

export async function orderUpdateTracking(
  id: string,
  data: UpdateOrderTrackingDto,
): Promise<OrderType> {
  try {
    const order = await orderModel.findOne({ id }).exec();
    if (!order) {
      throw new OrderNotFoundError(id);
    }

    if (!order.shipping) {
      throw new OrderOperationError('Order has no shipping details');
    }

    order.shipping.trackingId = data.trackingId;
    order.shipping.carrier = data.carrier;

    if (order.status === 'new' || order.status === 'processing') {
      order.status = 'shipped';
      order.shipping.shippedAt = new Date();
      order.timeline.push({
        status: 'shipped',
        note: `Tracking added: ${data.carrier} - ${data.trackingId}`,
        timestamp: new Date(),
      });
    }

    await order.save();

    const updated = await orderModel
      .findOne({ id })
      .populate('user', 'id firstName lastName email contact avatar')
      .populate('items.product', 'id title slug colors price category')
      .lean()
      .exec();

    return updated as unknown as OrderType;
  } catch (error) {
    if (isOrderError(error)) throw error;
    logger.error({ err: error, id }, 'Error updating order tracking');
    throw new DatabaseOperationError('orderUpdateTracking', error);
  }
}
