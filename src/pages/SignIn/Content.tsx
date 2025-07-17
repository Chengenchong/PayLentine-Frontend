'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AccountBalanceWallet,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
} from '@mui/icons-material';

export default function SignInContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({
          ...errors,
          [field]: '',
        });
      }
      setLoginError('');
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would typically make an API call to your backend
      console.log('Sign in attempt:', formData);

      // Redirect to dashboard on success
      router.push('/duplicateddashboard');
    } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Sign in with ${provider}`);
    // Implement social login logic here
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #9C89B8 40%, #4DA1A9 86%)',
      }}
    >
      {/* Left Side - Welcome Back Content */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          color: 'white',
        }}
      >
        <Box sx={{ maxWidth: 400, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              mx: 'auto',
            }}
          >
            <AccountBalanceWallet sx={{ fontSize: 40 }} />
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            👋
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
            Continue your journey with PayLentine. Access your secure wallet and
            enjoy seamless peer-to-peer currency exchanges with the best rates
            in the market.
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Sign In Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          pt: 12,
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            maxWidth: 650,
            width: 650,
            height: 'fit-content',
            background: '#F8F6F6',
            boxShadow: 'none',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: '#171635', mb: 1 }}
            >
              Sign in to your PayLentine account
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            )}

            {/* Email */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              InputLabelProps={{
                sx: { color: '#171635' },
                shrink: true,
              }}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: '#4DA1A9' }} />,
              }}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputLabelProps={{
                sx: { color: '#171635' },
                shrink: true,
              }}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: '#4DA1A9' }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'left' }}>
              <Link
                href="#"
                sx={{
                  color: '#4DA1A9',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, #856DA9, #41898F)',
                },
                '&:disabled': {
                  background: '#cccccc',
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Social Login Divider */}
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                or continue with
              </Typography>
            </Divider>

            {/* Social Login Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={() => handleSocialLogin('Google')}
                sx={{
                  py: 1.5,
                  borderColor: '#db4437',
                  color: '#db4437',
                  textTransform: 'none',
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
                sx={{
                  py: 1.5,
                  borderColor: '#4267B2',
                  color: '#4267B2',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#365899',
                    backgroundColor: 'rgba(66, 103, 178, 0.04)',
                  },
                }}
              >
                Facebook
              </Button>
            </Box>

            {/* Register Link */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Don't have an account?{' '}
                <Link
                  href="/register"
                  sx={{
                    color: '#4DA1A9',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
