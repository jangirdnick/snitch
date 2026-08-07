import { api } from '@/lib/axiosInstance';
import type { Coupon } from '@snitch/types';

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
  error?: { message: string };
}

export async function validateCouponCode(
  code: string,
  orderAmount: number,
): Promise<ApiResponse<Coupon>> {
  const { data } = await api.post('/coupon/validate', { code, orderAmount });
  return data;
}
