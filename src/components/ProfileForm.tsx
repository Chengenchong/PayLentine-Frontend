'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  Chip,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
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
} from '@mui/icons-material';


interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
}

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
    status: 'verified' | 'not_verified';
    bankName: string;
    verificationDate?: string;
    accountVerified: boolean;
    verificationLevel: 'basic' | 'enhanced' | 'premium';
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
    status: 'verified',
    bankName: 'Chase Bank',
    verificationDate: '2024-01-20',
    accountVerified: true,
    verificationLevel: 'enhanced',
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

export default function ProfileForm({ open, onClose }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(mockUserProfile);

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
    setEditedProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleEmploymentChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
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
      case 'not_verified':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getVerificationLevelColor = (level: string) => {
    switch (level) {
      case 'premium':
        return 'success';
      case 'enhanced':
        return 'info';
      case 'basic':
        return 'warning';
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#171635', width: 40, height: 40 }}>
            <AccountCircle />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#171635' }}>
            Profile & KYC Information
          </Typography>
        </Box>
        {!isEditing && (
          <IconButton onClick={handleEdit} sx={{ color: '#171635' }}>
            <Edit />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Personal Information */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#171635' }}>
              Personal Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={currentProfile.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
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
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={currentProfile.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Address Information */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#171635' }}>
              Address Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%' }}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={currentProfile.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: '#666' }} />,
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="City"
                  value={currentProfile.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="State/Province"
                  value={currentProfile.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Country"
                  value={currentProfile.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={currentProfile.address.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* KYC Information */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#171635' }}>
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
                  onChange={(e) => handleChange('documentType', e.target.value)}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <CreditCard sx={{ mr: 1, color: '#666' }} />,
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Document Number"
                  value={currentProfile.kyc.documentNumber}
                  onChange={(e) => handleChange('documentNumber', e.target.value)}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#171635' }}>
                Multi E-KYC Verification
              </Typography>
              <Chip
                label={profile.multiEKyc.status === 'verified' ? 'BANK VERIFIED' : 'NOT VERIFIED'}
                color={getMultiEKYCStatusColor(profile.multiEKyc.status) as any}
                size="small"
                icon={<AccountBalance />}
              />
              {profile.multiEKyc.status === 'verified' && (
                <Chip
                  label={profile.multiEKyc.verificationLevel.toUpperCase()}
                  color={getVerificationLevelColor(profile.multiEKyc.verificationLevel) as any}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={profile.multiEKyc.bankName}
                  disabled
                  InputProps={{
                    startAdornment: <AccountBalance sx={{ mr: 1, color: '#666' }} />,
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Verification Status"
                  value={profile.multiEKyc.status === 'verified' ? 'Verified by Bank' : 'Not Verified'}
                  disabled
                />
              </Box>
              {profile.multiEKyc.verificationDate && (
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                  <TextField
                    fullWidth
                    label="Bank Verification Date"
                    value={profile.multiEKyc.verificationDate}
                    disabled
                  />
                </Box>
              )}
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Account Verification"
                  value={profile.multiEKyc.accountVerified ? 'Account Verified' : 'Account Not Verified'}
                  disabled
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Verification Level"
                  value={`${profile.multiEKyc.verificationLevel.charAt(0).toUpperCase() + profile.multiEKyc.verificationLevel.slice(1)} Level`}
                  disabled
                  InputProps={{
                    startAdornment: <VerifiedUser sx={{ mr: 1, color: '#666' }} />,
                  }}
                />
              </Box>
            </Box>
            {profile.multiEKyc.status === 'verified' && (
              <Box sx={{ 
                mt: 2, 
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
                  gap: 1 
                }}>
                  <VerifiedUser fontSize="small" />
                  This individual has been verified by {profile.multiEKyc.bankName} through their Multi E-KYC process, 
                  providing enhanced identity assurance and compliance with banking regulations.
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Employment Information */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#171635' }}>
              Employment Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Employer"
                  value={currentProfile.employment.employer}
                  onChange={(e) => handleEmploymentChange('employer', e.target.value)}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Business sx={{ mr: 1, color: '#666' }} />,
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={currentProfile.employment.jobTitle}
                  onChange={(e) => handleEmploymentChange('jobTitle', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <TextField
                  fullWidth
                  label="Industry"
                  value={currentProfile.employment.industry}
                  onChange={(e) => handleEmploymentChange('industry', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Annual Income Range</InputLabel>
                  <Select
                    value={currentProfile.employment.annualIncome}
                    label="Annual Income Range"
                    onChange={(e) => handleEmploymentChange('annualIncome', e.target.value)}
                  >
                    <MenuItem value="$25,000 - $35,000">$25,000 - $35,000</MenuItem>
                    <MenuItem value="$35,000 - $50,000">$35,000 - $50,000</MenuItem>
                    <MenuItem value="$50,000 - $75,000">$50,000 - $75,000</MenuItem>
                    <MenuItem value="$75,000 - $100,000">$75,000 - $100,000</MenuItem>
                    <MenuItem value="$100,000 - $150,000">$100,000 - $150,000</MenuItem>
                    <MenuItem value="$150,000+">$150,000+</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Risk Profile */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#171635' }}>
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
                    endAdornment: <Typography variant="caption">/100</Typography>,
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
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
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
                '&:hover': { bgcolor: '#0f0f23' }
              }}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <Button
            onClick={onClose}
            variant="contained"
            sx={{ 
              bgcolor: '#171635',
              '&:hover': { bgcolor: '#0f0f23' }
            }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
} 