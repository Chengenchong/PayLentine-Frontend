// API Configuration Constants

export const API_ENVIRONMENTS = {
  PRODUCTION: 'https://paylentine-backend-1.onrender.com/api',
  DEVELOPMENT: 'http://localhost:3001/api',
} as const;

// Default to production, can be changed via environment variable or user preference
export const BASE_URL = process.env.NODE_ENV === 'development' 
  ? API_ENVIRONMENTS.DEVELOPMENT 
  : API_ENVIRONMENTS.PRODUCTION;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

// Common headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;
