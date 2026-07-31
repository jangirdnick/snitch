import { api } from '@/lib/axiosInstance';
import type { OrderQueryDto, UpdateOrderStatusDto, UpdateOrderTrackingDto } from '@snitch/schemas';
import type { PaginatedOrders, Order } from '@snitch/types';

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
}

export const orderService = {
  getAll: async (params?: OrderQueryDto): Promise<PaginatedOrders> => {
    const res = await api.get<ApiResponse<PaginatedOrders>>('/order/admin', { params });
    return res.data.data;
  },

  getById: async (id: string): Promise<Order> => {
    const res = await api.get<ApiResponse<Order>>(`/order/admin/${id}`);
    return res.data.data;
  },

  updateStatus: async (id: string, data: UpdateOrderStatusDto): Promise<Order> => {
    const res = await api.patch<ApiResponse<Order>>(`/order/admin/${id}/status`, data);
    return res.data.data;
  },

  updateTracking: async (id: string, data: UpdateOrderTrackingDto): Promise<Order> => {
    const res = await api.patch<ApiResponse<Order>>(`/order/admin/${id}/tracking`, data);
    return res.data.data;
  },
};
