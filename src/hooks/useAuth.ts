// Custom React Hooks for Authentication

import { useState, useEffect } from 'react';
import {
  registerUser,
  loginUser,
  getUserProfile,
  changeUserPassword,
  logoutUser,
  validateEmail,
  validatePassword,
} from '../services/auth';
import { getAuthToken, isAuthenticated } from '../services/api';
import type {
  RegisterRequest,
  LoginRequest,
  ChangePasswordRequest,
  UserProfile,
} from '../types/auth';

// Hook for user registration
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate email
      if (!validateEmail(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password
      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      const response = await registerUser(userData);
      
      if (response.success) {
        setSuccess(true);
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    success,
  };
};

// Hook for user login
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate email
      if (!validateEmail(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await loginUser(credentials);
      
      if (response.success) {
        setSuccess(true);
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    success,
  };
};

// Hook for user profile management
export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!isAuthenticated()) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserProfile();
      
      if (response.success && response.user) {
        setProfile(response.user);
        return response.user;
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchProfile();
    }
  }, []);

  return {
    profile,
    fetchProfile,
    isLoading,
    error,
  };
};

// Hook for password change
export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (passwordData: ChangePasswordRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate new password
      const passwordValidation = validatePassword(passwordData.newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      // Check if passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const response = await changeUserPassword(passwordData);
      
      if (response.success) {
        setSuccess(true);
        return response;
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (err: any) {
      setError(err.message || 'Password change failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
    error,
    success,
  };
};

// Hook for authentication state
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const currentToken = getAuthToken();
      setToken(currentToken);
      setIsAuthenticated(!!currentToken);
    };

    checkAuth();

    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setToken(null);
  };

  return {
    isAuthenticated,
    token,
    logout,
  };
};

// Hook for API environment switching
export const useApiEnvironment = () => {
  const [environment, setEnvironment] = useState<'PRODUCTION' | 'DEVELOPMENT'>('PRODUCTION');

  const switchEnvironment = (env: 'PRODUCTION' | 'DEVELOPMENT') => {
    setEnvironment(env);
    // You can also call the setApiEnvironment function here if needed
    // setApiEnvironment(env);
  };

  return {
    environment,
    switchEnvironment,
  };
};
