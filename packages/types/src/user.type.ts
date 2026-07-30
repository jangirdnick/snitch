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
  role: 'USER' | 'ADMIN';
  isBlocked: boolean;
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
  role: 'USER' | 'ADMIN';
  isBlocked: boolean;
  contact: {
    countryCode: string;
    phoneNumber: string;
  };
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedUsers {
  items: UserResponseDto[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
