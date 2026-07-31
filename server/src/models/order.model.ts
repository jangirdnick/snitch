import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import crypto from 'node:crypto';

function generateOrderNumber() {
  return 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

export interface IOrder extends Document {
  id: string;
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    title: string;
    sku: string;
    price: number;
    quantity: number;
    primaryImage?: string;
    size?: string;
    color?: string;
  }[];
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  netAmount: number;
  coupon?: mongoose.Types.ObjectId;
  payment: {
    method: 'cod' | 'card' | 'upi' | 'netbanking' | 'mock';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
  };
  shipping: {
    address: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    trackingId?: string;
    carrier?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
  };
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  timeline: {
    status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    note?: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    primaryImage: { type: String },
    size: { type: String },
    color: { type: String },
  },
  { _id: false },
);

const orderSchema: Schema<IOrder> = new Schema(
  {
    id: { type: String, default: () => randomUUID(), unique: true, index: true },
    orderNumber: { type: String, default: generateOrderNumber, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    netAmount: { type: Number, required: true, min: 0 },
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    payment: {
      method: { type: String, enum: ['cod', 'card', 'upi', 'netbanking', 'mock'], required: true },
      status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
      transactionId: { type: String },
    },
    shipping: {
      address: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
      },
      trackingId: { type: String },
      carrier: { type: String },
      shippedAt: { type: Date },
      deliveredAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['new', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'new',
      index: true,
    },
    timeline: [
      {
        status: {
          type: String,
          enum: ['new', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
          required: true,
        },
        note: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

orderSchema.pre('save', function (this: IOrder) {
  if (this.isNew && this.timeline.length === 0) {
    this.timeline.push({ status: 'new', timestamp: new Date() });
  }
});

const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
