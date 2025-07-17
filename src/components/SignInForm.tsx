'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Close,
  Email,
  Lock,
  Google,
  Facebook,
} from '@mui/icons-material';
import { AccountBalanceWallet } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLogin } from '../hooks/useAuth';

interface SignInFormProps {
  open: boolean;
  onClose: () => void;
}

export default function SignInForm({ open, onClose }: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  
  const { login, isLoading, error: loginError } = useLogin();

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }));
      }
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Close the form on success
        onClose();
        // Reset form
        setFormData({ email: '', password: '' });
        // Redirect to dashboard
        router.push('/duplicateddashboard');
      }
    } catch (error) {
      // Error is already handled by the useLogin hook
      console.error('Login failed:', error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Sign in with ${provider}`);
    // Implement social login logic here
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWallet
              sx={{ color: 'primary.main', fontSize: 28 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Welcome Back
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Sign in to your PayLentine account
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'primary.main', cursor: 'pointer' }}
            >
              Forgot password?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Sign up
              </Typography>
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: '#171635',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#0f0f23',
              },
              '&:disabled': {
                backgroundColor: '#cccccc',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Sign In'
            )}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              or continue with
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                py: 1.5,
                borderColor: '#db4437',
                color: '#db4437',
                '&:hover': {
                  borderColor: '#c23321',
                  backgroundColor: 'rgba(219, 68, 55, 0.04)',
                },
              }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              onClick={() => handleSocialLogin('Facebook')}
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                py: 1.5,
                borderColor: '#4267B2',
                color: '#4267B2',
                '&:hover': {
                  borderColor: '#365899',
                  backgroundColor: 'rgba(66, 103, 178, 0.04)',
                },
              }}
            >
              Facebook
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
