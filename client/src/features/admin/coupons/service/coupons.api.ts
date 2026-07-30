import { api } from '@/lib/axiosInstance';
import type { Coupon, PaginatedCoupons } from '@snitch/types';
import type { CreateCouponDto, UpdateCouponDto, CouponQueryDto } from '@snitch/schemas';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    message: string;
    fields?: Record<string, string[]>;
  };
}

export const fetchCoupons = async (
  query: CouponQueryDto,
): Promise<ApiResponse<PaginatedCoupons>> => {
  const { data } = await api.get('/coupon/admin', { params: query });
  return data;
};

export const fetchCouponById = async (id: string): Promise<ApiResponse<Coupon>> => {
  const { data } = await api.get(`/coupon/admin/${id}`);
  return data;
};

export const createCoupon = async (payload: CreateCouponDto): Promise<ApiResponse<Coupon>> => {
  const { data } = await api.post('/coupon/admin', payload);
  return data;
};

export const updateCoupon = async (
  id: string,
  payload: UpdateCouponDto,
): Promise<ApiResponse<Coupon>> => {
  const { data } = await api.put(`/coupon/admin/${id}`, payload);
  return data;
};

export const deleteCoupon = async (id: string): Promise<ApiResponse<void>> => {
  const { data } = await api.delete(`/coupon/admin/${id}`);
  return data;
};
