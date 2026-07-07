import { api } from '@/lib/axiosInstance';
import type {
  ApiResponse,
  ApiSuccess,
  ApiErrorResponse,
  AuthLoginResponse,
  UserResponseDto,
} from '@snitch/types';

import { type CreateUserDto, type LoginUserDto } from '@snitch/schemas';

export async function getMe(): Promise<ApiSuccess<{ user: UserResponseDto }> | ApiErrorResponse> {
  const { data } = await api.get('/user/get/me');
  return data;
}

export async function register(payload: CreateUserDto): Promise<ApiResponse> {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function verifyEmail(email: string): Promise<ApiResponse> {
  const { data } = await api.post('/auth/email/send-verification', { email });
  return data;
}

export async function login(payload: LoginUserDto): Promise<AuthLoginResponse> {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function logout(): Promise<ApiResponse> {
  const { data } = await api.post('/auth/logout');
  return data;
}

export async function logoutAllDevices(): Promise<ApiResponse> {
  const { data } = await api.post('/auth/logout-all-deviced');
  return data;
}
