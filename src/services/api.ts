// API Client Configuration and Base Functions

import { BASE_URL, REQUEST_TIMEOUT, DEFAULT_HEADERS } from '../constants/api';
import type { ApiResponse, ApiError as ApiErrorType } from '../types/auth';

// API Environment switching
let currentBaseUrl = BASE_URL;

export const setApiEnvironment = (environment: 'PRODUCTION' | 'DEVELOPMENT') => {
  currentBaseUrl = environment === 'PRODUCTION' 
    ? 'https://paylentine-backend-1.onrender.com/api'
    : 'http://localhost:3001/api';
};

export const getCurrentBaseUrl = () => currentBaseUrl;

// Custom error class for API errors
export class PayLentineApiError extends Error {
  public status: number;
  public response?: any;

  constructor(message: string, status: number, response?: any) {
    super(message);
    this.name = 'PayLentineApiError';
    this.status = status;
    this.response = response;
  }
}

// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${currentBaseUrl}${endpoint}`;
  
  // Get auth token from localStorage if available
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      ...DEFAULT_HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new PayLentineApiError(
        data.message || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof PayLentineApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new PayLentineApiError('Request timeout', 408);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    throw new PayLentineApiError(errorMessage, 0, error);
  }
};

// Token management
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
