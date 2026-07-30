import { api } from '@/lib/axiosInstance';
import type { PaginatedUsers, UserResponseDto } from '@snitch/types';
import type { UserQueryDto } from '@snitch/schemas';

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
  error?: { message: string };
}

export const fetchCustomers = async (query: UserQueryDto): Promise<PaginatedUsers> => {
  const { data } = await api.get<ApiResponse<PaginatedUsers>>('/user/admin/all', {
    params: query,
  });
  return data.data;
};

export const blockCustomer = async (id: string, isBlocked: boolean): Promise<UserResponseDto> => {
  const { data } = await api.patch<ApiResponse<{ user: UserResponseDto }>>(
    `/user/admin/${id}/block`,
    {
      isBlocked,
    },
  );
  return data.data.user;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete<ApiResponse>(`/user/admin/${id}`);
};
