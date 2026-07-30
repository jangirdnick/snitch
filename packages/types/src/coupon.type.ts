export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  validFrom: string | Date;
  validUntil: string | Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableProducts: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaginatedCoupons {
  items: Coupon[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
