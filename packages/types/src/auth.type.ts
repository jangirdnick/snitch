import { ApiErrorResponse, ApiSuccess } from './api.type.js';
import { UserResponseDto } from './user.type.js';

export interface AuthLogin {
  accessToken: string;
  user: UserResponseDto;
}

export type AuthLoginResponse = ApiSuccess<AuthLogin> | ApiErrorResponse;
