import mongoose, { Schema, type Document, type Types } from 'mongoose';
import type { Coupon } from '@snitch/types';

export interface ICouponDocument
  extends
    Omit<
      Coupon,
      'id' | 'applicableProducts' | 'createdAt' | 'updatedAt' | 'validFrom' | 'validUntil'
    >,
    Document {
  applicableProducts: Types.ObjectId[];
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrder: { type: Number, min: 0, default: 0 },
    maxDiscount: { type: Number, min: 0 },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

export const CouponModel = mongoose.model<ICouponDocument>('Coupon', couponSchema);
