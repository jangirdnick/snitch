import { type ApiErrorResponse, type ApiSuccess } from './api.type.js';
import type { JwtAccessTokenPayload } from './jwt.type.js';

export interface AuthLogin {
  accessToken: string;
  user: JwtAccessTokenPayload;
}

export type AuthLoginResponse = ApiSuccess<AuthLogin> | ApiErrorResponse;
export type AuthUserResponse = ApiSuccess<{ user: JwtAccessTokenPayload }> | ApiErrorResponse;
