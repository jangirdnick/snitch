import { type ApiErrorResponse, type ApiSuccess } from './api.type.js';
import type { UserResponseDto } from './user.type.js';

export interface AuthLogin {
  accessToken: string;
  user: UserResponseDto;
}

export type AuthLoginResponse = ApiSuccess<AuthLogin> | ApiErrorResponse;
