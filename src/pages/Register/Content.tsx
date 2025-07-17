'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PersonAdd, Email, Phone, Lock, Person } from '@mui/icons-material';
import { useRegister } from '../../hooks/useAuth';

export default function RegisterContent() {
  const router = useRouter();
  const { register, isLoading, error: registerError } = useRegister();
  
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    };

  const handleCheckboxChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.checked,
      });
      // Clear error when user checks/unchecks
      if (errors[field]) {
        setErrors({
          ...errors,
          [field]: '',
        });
      }
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          // phoneNumber is optional, so we can include username as a display name or skip it
        });

        if (response.success && response.data?.seedPhrase) {
          console.log('Registration successful:', response);
          
          // Store the seed phrase temporarily in sessionStorage for the seedphrase page
          sessionStorage.setItem('tempSeedPhrase', response.data.seedPhrase);
          // Also store in localStorage as backup
          localStorage.setItem('tempSeedPhrase', response.data.seedPhrase);
          
          // Small delay to ensure storage is set before navigation
          setTimeout(() => {
            router.push('/seedphrase');
          }, 100);
        }
      } catch (error) {
        console.error('Registration failed:', error);
        // Error is already handled by the useRegister hook
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #9C89B8 40%, #4DA1A9 86%)',
      }}
    >
      {/* Left Side - Marketing Content */}
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
            <PersonAdd sx={{ fontSize: 40 }} />
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Join PayLentine Today!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            🎉
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
            Join the revolution in peer-to-peer currency exchange. Experience
            seamless transactions with better rates, lower fees, and unmatched
            security.
          </Typography>

          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <Typography
              variant="body1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2.5,
                fontSize: '1.1rem',
              }}
            >
              ⚡ Lightning-fast currency matching
            </Typography>
            <Typography
              variant="body1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2.5,
                fontSize: '1.1rem',
              }}
            >
              💰 Save up to 80% on exchange fees
            </Typography>
            <Typography
              variant="body1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2.5,
                fontSize: '1.1rem',
              }}
            >
              🌍 Support for 150+ global currencies
            </Typography>
            <Typography
              variant="body1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2.5,
                fontSize: '1.1rem',
              }}
            >
              🔒 Bank-level security & encryption
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}
            >
              🎁 Zero fees for your first 3 exchanges
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Form */}
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
            <PersonAdd sx={{ fontSize: 32, color: '#4DA1A9', mb: 2 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: '#171635', mb: 1 }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Fill in your details to get started
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {/* Error Alert */}
            {registerError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {registerError}
              </Alert>
            )}

            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={formData.username}
              onChange={handleInputChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isLoading}
              InputLabelProps={{ sx: { color: '#171635' } }}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: '#4DA1A9' }} />,
              }}
            />

            {/* Name Fields */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={isLoading}
                InputLabelProps={{ sx: { color: '#171635' } }}
              />
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={isLoading}
                InputLabelProps={{ sx: { color: '#171635' } }}
              />
            </Box>

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
              disabled={isLoading}
              InputLabelProps={{ sx: { color: '#171635' } }}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: '#4DA1A9' }} />,
              }}
            />

            {/* Password Fields */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                InputLabelProps={{ sx: { color: '#171635' } }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: '#4DA1A9' }} />,
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                InputLabelProps={{ sx: { color: '#171635' } }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: '#4DA1A9' }} />,
                }}
              />
            </Box>

            {/* Terms */}
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptTerms}
                    onChange={handleCheckboxChange('acceptTerms')}
                    disabled={isLoading}
                    sx={{
                      '&.Mui-checked': { color: '#FFA630' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    By creating an account, you agree to our{' '}
                    <Link
                      href="#"
                      sx={{ color: '#4DA1A9', textDecoration: 'none' }}
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="#"
                      sx={{ color: '#4DA1A9', textDecoration: 'none' }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {errors.acceptTerms && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {errors.acceptTerms}
                </Typography>
              )}
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  <Typography>Creating Account...</Typography>
                </Box>
              ) : (
                'Create Account →'
              )}
            </Button>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Already have an account?{' '}
                <Link
                  href="/login"
                  sx={{
                    color: '#4DA1A9',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
