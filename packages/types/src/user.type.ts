export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  avatar?: string | null;
  email: string;
  emailVerified: boolean;
  contact: {
    countryCode: string;
    phoneNumber: string;
  };
  password: string;
  role: 'USER' | 'SELLER';
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName?: string;
  avatar?: string | null;
  email: string;
  emailVerified: boolean;
  role: 'USER' | 'SELLER';
  contact: {
    countryCode: string;
    phoneNumber: string;
  };
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
