import type { KpiMetric } from './analytics.type.js';
import type { Order } from './order.type.js';
import type { Product } from './product.type.js';
import type { UserResponseDto } from './user.type.js';
import type { Review } from './review.type.js';

export interface DashboardOverviewMetrics {
  totalRevenue: KpiMetric;
  totalOrders: KpiMetric;
  activeCustomers: KpiMetric;
  totalProducts: KpiMetric;
}

export interface CouponSummary {
  active: number;
  expired: number;
  totalUsed: number;
}

export interface CategoryDistribution {
  name: string;
  count: number;
}

export interface DashboardOverviewResponse {
  metrics: DashboardOverviewMetrics;
  recentOrders: Order[];
  recentCustomers: UserResponseDto[];
  recentReviews: Review[];
  lowStockProducts: Product[];
  categoryDistribution: CategoryDistribution[];
  couponSummary: CouponSummary;
}
