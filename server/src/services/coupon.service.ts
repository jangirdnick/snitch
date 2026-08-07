import { CouponModel, type ICouponDocument } from '@/models/coupon.model.js';
import type { CreateCouponDto, UpdateCouponDto, CouponQueryDto } from '@snitch/schemas';
import type { Coupon, PaginatedCoupons } from '@snitch/types';
import type { QueryFilter } from 'mongoose';

export class CouponNotFoundError extends Error {
  constructor(message = 'Coupon not found') {
    super(message);
    this.name = 'CouponNotFoundError';
  }
}

export class CouponOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CouponOperationError';
  }
}

const mapCouponToResponse = (doc: ICouponDocument): Coupon => {
  return {
    id: doc._id.toString(),
    code: doc.code,
    type: doc.type,
    value: doc.value,
    minOrder: doc.minOrder,
    maxDiscount: doc.maxDiscount,
    validFrom: doc.validFrom,
    validUntil: doc.validUntil,
    usageLimit: doc.usageLimit,
    usedCount: doc.usedCount,
    isActive: doc.isActive,
    applicableProducts: doc.applicableProducts.map((p) => p.toString()),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

export const getCoupons = async (query: CouponQueryDto): Promise<PaginatedCoupons> => {
  const { page, limit, search, status, sortField, sortOrder } = query;

  const filter: QueryFilter<ICouponDocument> = {};

  if (search) {
    filter.code = { $regex: search, $options: 'i' };
  }

  if (status && status !== 'all') {
    const now = new Date();
    if (status === 'active') {
      filter.isActive = true;
      filter.validFrom = { $lte: now };
      filter.validUntil = { $gt: now };
    } else if (status === 'inactive') {
      filter.isActive = false;
    } else if (status === 'expired') {
      filter.validUntil = { $lte: now };
    }
  }

  const sort: Record<string, 1 | -1> = {};
  sort[sortField] = sortOrder === 'asc' ? 1 : -1;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    CouponModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
    CouponModel.countDocuments(filter).exec(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items: items.map(mapCouponToResponse),
    pagination: {
      totalItems: total,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getCouponById = async (id: string): Promise<Coupon> => {
  const coupon = await CouponModel.findById(id).exec();
  if (!coupon) throw new CouponNotFoundError();
  return mapCouponToResponse(coupon);
};

export const createCoupon = async (data: CreateCouponDto): Promise<Coupon> => {
  const existing = await CouponModel.findOne({ code: data.code }).exec();
  if (existing) {
    throw new CouponOperationError('Coupon with this code already exists');
  }

  const coupon = new CouponModel({
    ...data,
    code: data.code.toUpperCase(),
  });

  await coupon.save();
  return mapCouponToResponse(coupon);
};

export const updateCoupon = async (id: string, data: UpdateCouponDto): Promise<Coupon> => {
  if (data.code) {
    const existing = await CouponModel.findOne({
      code: data.code.toUpperCase(),
      _id: { $ne: id },
    }).exec();
    if (existing) {
      throw new CouponOperationError('Coupon with this code already exists');
    }
  }

  const coupon = await CouponModel.findByIdAndUpdate(
    id,
    { ...data, ...(data.code && { code: data.code.toUpperCase() }) },
    { new: true },
  ).exec();

  if (!coupon) throw new CouponNotFoundError();
  return mapCouponToResponse(coupon);
};

export const deleteCoupon = async (id: string): Promise<void> => {
  const coupon = await CouponModel.findByIdAndDelete(id).exec();
  if (!coupon) throw new CouponNotFoundError();
};

export const validateCoupon = async (code: string, orderAmount: number): Promise<Coupon> => {
  const coupon = await CouponModel.findOne({ code: code.toUpperCase() }).exec();
  if (!coupon) throw new CouponNotFoundError('Invalid coupon code');

  if (!coupon.isActive) throw new CouponOperationError('Coupon is not active');

  const now = new Date();
  if (coupon.validFrom > now) throw new CouponOperationError('Coupon is not yet valid');
  if (coupon.validUntil < now) throw new CouponOperationError('Coupon has expired');

  if (coupon.minOrder !== undefined && orderAmount < coupon.minOrder) {
    throw new CouponOperationError(`Minimum order amount of ${coupon.minOrder} is required`);
  }

  if (coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
    throw new CouponOperationError('Coupon usage limit has been reached');
  }

  return mapCouponToResponse(coupon);
};
