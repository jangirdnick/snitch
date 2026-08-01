import { api } from '@/lib/axiosInstance';
import type { ApiSuccess, DashboardOverviewResponse } from '@snitch/types';

export async function fetchDashboardOverview(): Promise<DashboardOverviewResponse> {
  const { data } = await api.get<ApiSuccess<DashboardOverviewResponse>>('/dashboard/overview');
  return data.data;
}
