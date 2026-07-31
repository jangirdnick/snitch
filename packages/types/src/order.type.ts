import type { UserResponseDto } from './user.type.js';

export interface OrderItemSnapshot {
  product: string;
  title: string;
  sku: string;
  price: number;
  quantity: number;
  primaryImage?: string;
  size?: string;
  color?: string;
}

export interface PaymentDetails {
  method: 'cod' | 'card' | 'upi' | 'netbanking' | 'mock';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingDetails {
  address: ShippingAddress;
  trackingId?: string;
  carrier?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface OrderTimelineEvent {
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  note?: string;
  timestamp: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  user: UserResponseDto | string;
  items: OrderItemSnapshot[];
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  netAmount: number;
  coupon?: string;
  payment: PaymentDetails;
  shipping: ShippingDetails;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  timeline: OrderTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedOrders {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
