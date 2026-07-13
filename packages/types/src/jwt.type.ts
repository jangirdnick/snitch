export interface JwtCookiePayload {
  sub: string;
  deviceId: string;
}

export interface JwtAccessTokenPayload {
  sub: string;
  firstName: string;
  lastName?: string;
  avatar?: string | null;
  email: string;
  emailVerified: boolean;
  contact: {
    countryCode: string;
    phoneNumber: string;
  };
  role: 'USER' | 'ADMIN';
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
