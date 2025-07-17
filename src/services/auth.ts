// Authentication Service Functions

import { apiRequest, setAuthToken, removeAuthToken } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../types/auth';

// Register a new user
export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await apiRequest(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );

    // The response is already the RegisterResponse from your backend
    const registerResponse = response as RegisterResponse;

    // If registration successful and token provided, save it
    if (registerResponse.success && registerResponse.data?.token) {
      setAuthToken(registerResponse.data.token);
    }

    return registerResponse;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiRequest(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    // The response is already the LoginResponse from your backend
    const loginResponse = response as LoginResponse;

    // If login successful and token provided, save it
    if (loginResponse.success && loginResponse.data?.token) {
      setAuthToken(loginResponse.data.token);
    }

    return loginResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user profile
export const getUserProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await apiRequest(
      API_ENDPOINTS.AUTH.PROFILE,
      {
        method: 'GET',
      }
    );

    // The response is already the ProfileResponse from your backend
    return response as ProfileResponse;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

// Change user password
export const changeUserPassword = async (passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  try {
    const response = await apiRequest(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      }
    );

    // The response is already the ChangePasswordResponse from your backend
    return response as ChangePasswordResponse;
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
};

// Logout user (clear local token)
export const logoutUser = (): void => {
  removeAuthToken();
  // You can also add logic here to call a logout endpoint if your backend requires it
};

// Validate password strength (client-side helper)
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate email format (client-side helper)
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
