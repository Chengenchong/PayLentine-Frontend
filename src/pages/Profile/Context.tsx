'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import {
  Edit,
  Save,
  Cancel,
  VerifiedUser,
  Security,
  AccountCircle,
  Business,
  LocationOn,
  Phone,
  Email,
  Badge,
  CreditCard,
  AccountBalance,
  ArrowBack,
} from '@mui/icons-material';

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  kyc: {
    status: 'pending' | 'verified' | 'rejected';
    documentType: string;
    documentNumber: string;
    verificationDate?: string;
    expiryDate?: string;
  };
  multiEKyc: {
    verifications: Array<{
      id: string;
      bankName: string;
      status: 'verified' | 'pending' | 'rejected';
      verificationDate?: string;
      accountVerified: boolean;
      accountType: 'Bank' | 'E-Wallet' | 'Universities';
    }>;
    overallStatus: 'verified' | 'partial' | 'not_verified';
    totalVerified: number;
  };
  employment: {
    employer: string;
    jobTitle: string;
    industry: string;
    annualIncome: string;
  };
  riskProfile: {
    level: 'low' | 'medium' | 'high';
    score: number;
    lastUpdated: string;
  };
}

const mockUserProfile: UserProfile = {
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1990-05-15',
  nationality: 'United States',
  address: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    country: 'United States',
    postalCode: '10001',
  },
  kyc: {
    status: 'verified',
    documentType: 'Passport',
    documentNumber: 'US123456789',
    verificationDate: '2024-01-15',
    expiryDate: '2034-01-15',
  },
  multiEKyc: {
    verifications: [
      {
        id: 'VER001',
        bankName: 'Chase Bank',
        status: 'verified',
        verificationDate: '2024-01-20',
        accountVerified: true,
        accountType: 'Bank',
      },
      {
        id: 'VER002',
        bankName: 'PayPal',
        status: 'verified',
        verificationDate: '2024-02-15',
        accountVerified: true,
        accountType: 'E-Wallet',
      },
      {
        id: 'VER003',
        bankName: 'MIT University',
        status: 'verified',
        verificationDate: '2024-03-08',
        accountVerified: true,
        accountType: 'Universities',
      },
    ],
    overallStatus: 'verified',
    totalVerified: 3,
  },
  employment: {
    employer: 'Tech Solutions Inc.',
    jobTitle: 'Software Engineer',
    industry: 'Technology',
    annualIncome: '$85,000 - $95,000',
  },
  riskProfile: {
    level: 'low',
    score: 85,
    lastUpdated: '2024-01-20',
  },
};

export default function ProfileContent() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [editedProfile, setEditedProfile] =
    useState<UserProfile>(mockUserProfile);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleEmploymentChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      employment: {
        ...prev.employment,
        [field]: value,
      },
    }));
  };

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMultiEKYCStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'partial':
        return 'warning';
      case 'not_verified':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const currentProfile = isEditing ? editedProfile : profile;

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Back Button - To the left of the border */}
        <Button
          onClick={handleBack}
          startIcon={<ArrowBack />}
          sx={{
            background: 'linear-gradient(45deg, #6366f1, #ec4899)',
            color: 'white',
            borderRadius: 6,
            px: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            flexShrink: 0,
            mt: 3,
            mr: 4,
            '&:hover': {
              background: 'linear-gradient(45deg, #5855eb, #db2777)',
            },
          }}
        >
          Back
        </Button>

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              borderBottom: '1px solid #e0e0e0',
              bgcolor: '#fafafa',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#171635', width: 40, height: 40 }}>
                <AccountCircle />
              </Avatar>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: '#171635' }}
              >
                Profile & KYC Information
              </Typography>
            </Box>
            {!isEditing && (
              <IconButton onClick={handleEdit} sx={{ color: '#171635' }}>
                <Edit />
              </IconButton>
            )}
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Personal Information */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: '#171635' }}
                >
                  Personal Information
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={currentProfile.firstName}
                      onChange={(e) =>
                        handleChange('firstName', e.target.value)
                      }
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Badge sx={{ mr: 1, color: '#666' }} />,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={currentProfile.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Badge sx={{ mr: 1, color: '#666' }} />,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={currentProfile.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: '#666' }} />,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={currentProfile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: '#666' }} />,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={currentProfile.dateOfBirth}
                      onChange={(e) =>
                        handleChange('dateOfBirth', e.target.value)
                      }
                      disabled={!isEditing}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Nationality"
                      value={currentProfile.nationality}
                      onChange={(e) =>
                        handleChange('nationality', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Address Information */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: '#171635' }}
                >
                  Address Information
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 100%' }}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={currentProfile.address.street}
                      onChange={(e) =>
                        handleAddressChange('street', e.target.value)
                      }
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <LocationOn sx={{ mr: 1, color: '#666' }} />
                        ),
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="City"
                      value={currentProfile.address.city}
                      onChange={(e) =>
                        handleAddressChange('city', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      value={currentProfile.address.state}
                      onChange={(e) =>
                        handleAddressChange('state', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={currentProfile.address.country}
                      onChange={(e) =>
                        handleAddressChange('country', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      value={currentProfile.address.postalCode}
                      onChange={(e) =>
                        handleAddressChange('postalCode', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* KYC Information */}
              <Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#171635' }}
                  >
                    KYC Verification
                  </Typography>
                  <Chip
                    label={profile.kyc.status.toUpperCase()}
                    color={getKYCStatusColor(profile.kyc.status) as any}
                    size="small"
                    icon={<VerifiedUser />}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Document Type"
                      value={currentProfile.kyc.documentType}
                      onChange={(e) =>
                        handleChange('documentType', e.target.value)
                      }
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <CreditCard sx={{ mr: 1, color: '#666' }} />
                        ),
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Document Number"
                      value={currentProfile.kyc.documentNumber}
                      onChange={(e) =>
                        handleChange('documentNumber', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Box>
                  {profile.kyc.verificationDate && (
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                      <TextField
                        fullWidth
                        label="Verification Date"
                        value={profile.kyc.verificationDate}
                        disabled
                      />
                    </Box>
                  )}
                  {profile.kyc.expiryDate && (
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                      <TextField
                        fullWidth
                        label="Document Expiry"
                        value={profile.kyc.expiryDate}
                        disabled
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider />

              {/* Multi E-KYC Verification */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#171635' }}>
                      Multi E-KYC Verification
                    </Typography>
                    <Chip
                      label={profile.multiEKyc.overallStatus === 'verified' ? 'E-KYC VERIFIED' : 
                             profile.multiEKyc.overallStatus === 'partial' ? 'PARTIALLY VERIFIED' : 'NOT VERIFIED'}
                      color={getMultiEKYCStatusColor(profile.multiEKyc.overallStatus) as any}
                      size="small"
                      icon={<AccountBalance />}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AccountBalance />}
                    sx={{
                      color: '#171635',
                      borderColor: '#171635',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(23, 22, 53, 0.04)',
                      },
                    }}
                  >
                    Add New Verification
                  </Button>
                </Box>
                
                {/* Verifications Table */}
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <TableContainer 
                    component={Paper} 
                    sx={{ 
                      mb: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      width: '100%'
                    }}
                  >
                    <Table size="medium" sx={{ minWidth: 620 }}>
                      <TableHead>
                        <TableRow sx={{ 
                          bgcolor: '#f8f9fa',
                          '& .MuiTableCell-head': {
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            color: '#171635',
                            borderBottom: '2px solid #e0e0e0',
                            padding: '16px 12px',
                            whiteSpace: 'nowrap'
                          }
                        }}>
                          <TableCell sx={{ minWidth: 220 }}>Institution</TableCell>
                          <TableCell align="center" sx={{ minWidth: 140 }}>Verification Status</TableCell>
                          <TableCell align="center" sx={{ minWidth: 140 }}>Account Type</TableCell>
                          <TableCell align="center" sx={{ minWidth: 120 }}>Verified Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {profile.multiEKyc.verifications
                          .filter(verification => verification.status === 'verified')
                          .map((verification, index) => (
                          <TableRow
                            key={verification.id}
                            sx={{
                              '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                              '&:hover': { 
                                bgcolor: '#f0f7ff',
                                transform: 'scale(1.001)',
                                transition: 'all 0.2s ease',
                              },
                              borderLeft: '4px solid #4caf50',
                              '& .MuiTableCell-root': {
                                padding: '16px 12px',
                                borderBottom: '1px solid #e0e0e0'
                              }
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box 
                                  sx={{ 
                                    width: 40, 
                                    height: 40, 
                                    borderRadius: '50%', 
                                    bgcolor: '#e8f5e8',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  <AccountBalance sx={{ 
                                    fontSize: 22, 
                                    color: '#4caf50'
                                  }} />
                                </Box>
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                  <Typography variant="body1" sx={{ 
                                    fontWeight: 600, 
                                    color: '#171635',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.3,
                                    mb: 0.5
                                  }}>
                                    {verification.bankName}
                                  </Typography>
                                  <Typography variant="caption" sx={{ 
                                    color: '#666',
                                    fontSize: '0.8rem',
                                    display: 'block'
                                  }}>
                                    ID: {verification.id}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label="VERIFIED"
                                color="success"
                                size="medium"
                                sx={{ 
                                  fontWeight: 600,
                                  minWidth: 100,
                                  fontSize: '0.8rem',
                                  height: 32
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1" sx={{ 
                                fontWeight: 500,
                                color: '#171635',
                                fontSize: '0.95rem'
                              }}>
                                {verification.accountType}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body1" sx={{ 
                                color: '#171635',
                                fontSize: '0.95rem',
                                fontWeight: 400
                              }}>
                                {verification.verificationDate}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Summary Information */}
                {profile.multiEKyc.totalVerified > 0 && (
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    backgroundColor: '#e8f5e8', 
                    border: '1px solid #4caf50' 
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: '#2e7d32', 
                      fontWeight: 600, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      mb: 1
                    }}>
                      <VerifiedUser fontSize="small" />
                      Multi E-KYC Verification Confirmed
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                      This individual has been verified by {profile.multiEKyc.totalVerified} financial institution{profile.multiEKyc.totalVerified > 1 ? 's' : ''} through 
                      their Multi E-KYC processes, providing enhanced identity assurance and compliance with banking regulations.
                      {profile.multiEKyc.totalVerified > 1 && ' Multiple institution verifications provide additional security and trust.'}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Employment Information */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: '#171635' }}
                >
                  Employment Information
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Employer"
                      value={currentProfile.employment.employer}
                      onChange={(e) =>
                        handleEmploymentChange('employer', e.target.value)
                      }
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <Business sx={{ mr: 1, color: '#666' }} />
                        ),
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      value={currentProfile.employment.jobTitle}
                      onChange={(e) =>
                        handleEmploymentChange('jobTitle', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Industry"
                      value={currentProfile.employment.industry}
                      onChange={(e) =>
                        handleEmploymentChange('industry', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Annual Income"
                      value={currentProfile.employment.annualIncome}
                      onChange={(e) =>
                        handleEmploymentChange('annualIncome', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Risk Profile */}
              <Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#171635' }}
                  >
                    Risk Profile
                  </Typography>
                  <Chip
                    label={`${profile.riskProfile.level.toUpperCase()} RISK`}
                    color={getRiskLevelColor(profile.riskProfile.level) as any}
                    size="small"
                    icon={<Security />}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Risk Score"
                      value={profile.riskProfile.score}
                      disabled
                      InputProps={{
                        endAdornment: (
                          <Typography variant="caption">/100</Typography>
                        ),
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                    <TextField
                      fullWidth
                      label="Last Updated"
                      value={profile.riskProfile.lastUpdated}
                      disabled
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Actions */}
          <Box
            sx={{
              p: 3,
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              bgcolor: '#fafafa',
            }}
          >
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  startIcon={<Cancel />}
                  sx={{ color: '#666' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  startIcon={<Save />}
                  sx={{
                    bgcolor: '#171635',
                    '&:hover': { bgcolor: '#0f0f23' },
                  }}
                >
                  Save Changes
                </Button>
              </>
            ) : null}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
