// Authentication API Types

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string | number;
      email: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      role?: string;
      isActive?: boolean;
      createdAt: string;
      updatedAt?: string;
    };
    token: string;
    seedPhrase: string;
  };
  timestamp?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string | number;
      email: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      role?: string;
      isActive?: boolean;
      lastLoginAt?: string;
      createdAt?: string;
      updatedAt?: string;
    };
    token: string;
  };
  timestamp?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

// Generic API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

// API Environment type
export type ApiEnvironment = 'PRODUCTION' | 'DEVELOPMENT';
