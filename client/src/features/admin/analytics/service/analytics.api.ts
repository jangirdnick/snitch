import { api } from '@/lib/axiosInstance';
import type { ApiSuccess, AnalyticsDashboardResponse, PaginatedOrders } from '@snitch/types';

export async function fetchDashboardAnalytics(): Promise<AnalyticsDashboardResponse> {
  const response = await api.get<ApiSuccess<AnalyticsDashboardResponse>>('/analytics/dashboard');
  return response.data.data;
}

export async function fetchRecentDeliveredOrders(
  page: number,
  limit: number,
): Promise<PaginatedOrders> {
  const response = await api.get<ApiSuccess<PaginatedOrders>>(`/analytics/recent-delivered`, {
    params: { page, limit },
  });
  return response.data.data;
}
