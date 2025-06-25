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
  Grid,
  Divider,
  Link,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { PersonAdd, Email, Phone, Lock, Person } from '@mui/icons-material';

export default function RegisterContent() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subscribeNewsletter: false,
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

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

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Here you would typically send the data to your backend
      alert('Registration successful! Welcome to PayLentine!');
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #9C89B8 40%, #4DA1A9 86%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        pt: 12,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out',
            '&:hover': {
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
              transform: 'translateY(-8px) scale(1.02)',
              transition: 'all 0.3s ease-out',
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <PersonAdd sx={{ fontSize: 48, mb: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Join PayLentine
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Create your account and start revolutionizing currency exchange
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username */}
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={formData.username}
                onChange={handleInputChange('username')}
                error={!!errors.username}
                helperText={errors.username}
                InputLabelProps={{
                  sx: { color: '#171635' },
                }}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: '#4DA1A9' }} />,
                }}
              />

              {/* Password Fields */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputLabelProps={{
                      sx: { color: '#171635' },
                    }}
                    InputProps={{
                      startAdornment: <Lock sx={{ mr: 1, color: '#4DA1A9' }} />,
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputLabelProps={{
                      sx: { color: '#171635' },
                    }}
                    InputProps={{
                      startAdornment: <Lock sx={{ mr: 1, color: '#4DA1A9' }} />,
                    }}
                  />
                </Box>
              </Box>

              {/* Name Fields */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    InputLabelProps={{
                      sx: { color: '#171635' },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    InputLabelProps={{
                      sx: { color: '#171635' },
                    }}
                  />
                </Box>
              </Box>

              {/* Contact Information */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '250px' }}>
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
                    }}
                    InputProps={{
                      startAdornment: (
                        <Email sx={{ mr: 1, color: '#4DA1A9' }} />
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    variant="outlined"
                    value={formData.phoneNumber}
                    onChange={handleInputChange('phoneNumber')}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    InputLabelProps={{
                      sx: { color: '#171635' },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Phone sx={{ mr: 1, color: '#4DA1A9' }} />
                      ),
                    }}
                  />
                </Box>
              </Box>

              {/* Checkboxes */}
              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.subscribeNewsletter}
                    onChange={handleCheckboxChange('subscribeNewsletter')}
                    sx={{
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2">
                    Subscribe to our newsletter for updates and exclusive offers
                  </Typography>
                }
              />

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptTerms}
                      onChange={handleCheckboxChange('acceptTerms')}
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link
                        href="#"
                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                      >
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="#"
                        sx={{ color: 'primary.main', textDecoration: 'none' }}
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
                sx={{
                  mt: 3,
                  py: 2,
                  background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #856DA9, #41898F)',
                  },
                }}
              >
                Register Me Now!
              </Button>

              {/* Login Link */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
