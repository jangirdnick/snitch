import { api } from '@/lib/axiosInstance';
import type { ApiResponse, AuthLoginResponse, AuthUserResponse } from '@snitch/types';

import {
  type CreateUserDto,
  type LoginUserDto,
  type UpdateProfileDto,
  type ChangePasswordDto,
} from '@snitch/schemas';

export async function getMe(): Promise<AuthUserResponse> {
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
  const { data } = await api.post('/auth/logout-all-devices');
  return data;
}

export async function updateProfile(payload: UpdateProfileDto): Promise<AuthUserResponse> {
  const { data } = await api.put('/user/profile', payload);
  return data;
}

export async function changePassword(payload: ChangePasswordDto): Promise<ApiResponse> {
  const { data } = await api.put('/user/change-password', payload);
  return data;
}

export async function getSessions() {
  const { data } = await api.get('/user/sessions');
  return data;
}

export async function revokeSession(deviceId: string): Promise<ApiResponse> {
  const { data } = await api.delete(`/user/sessions/${deviceId}`);
  return data;
}

export async function deleteAccount(payload: { password: string }): Promise<ApiResponse> {
  const { data } = await api.delete('/user/account', { data: payload });
  return data;
}

export async function exportAccountData() {
  const { data } = await api.get('/user/export');
  return data;
}
