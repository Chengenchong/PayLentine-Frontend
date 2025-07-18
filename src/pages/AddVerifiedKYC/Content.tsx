'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  VerifiedUser,
  AccountBalance,
  Security,
  ArrowForward,
  CheckCircle,
  Close,
} from '@mui/icons-material';

export default function AddVerifiedKYCContent() {
  const router = useRouter();
  const [step, setStep] = useState<'choice' | 'bank_login' | 'bank_success'>(
    'choice'
  );
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [bankCredentials, setBankCredentials] = useState({
    username: '',
    password: '',
  });
  const [isValidating, setIsValidating] = useState(false);

  const banks = [
    'Maybank',
    'CIMB Bank',
    'Public Bank',
    'RHB Bank',
    'Hong Leong Bank',
    'AmBank',
    'Bank Islam',
    'OCBC Bank',
    'Standard Chartered',
    'HSBC Bank',
  ];

  const handleVerifyNow = () => {
    setShowBankDialog(true);
  };

  const handleSkipKYC = () => {
    // Route to SetupE-KYC page for traditional ID upload
    router.push('/setupekyc');
  };

  const handleBankLogin = async () => {
    if (
      !selectedBank ||
      !bankCredentials.username ||
      !bankCredentials.password
    ) {
      alert('Please fill in all fields');
      return;
    }

    setIsValidating(true);

    try {
      // Simulate bank validation process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowBankDialog(false);
      setStep('bank_success');

      // Auto redirect to pre-dashboard after success
      setTimeout(() => {
        router.push('/pre-dashboard');
      }, 3000);
    } catch (error) {
      console.error('Bank validation failed:', error);
      alert('Bank validation failed. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCredentialChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setBankCredentials((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  // Choice Step - Initial screen with two options
  if (step === 'choice') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          background:
            'linear-gradient(135deg, rgba(156, 137, 184, 0.8) 40%, rgba(77, 161, 169, 0.8) 86%)',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 1,
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 8, md: 11 },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              maxWidth: 800,
              width: '100%',
              background: '#F8F6F6',
              boxShadow: 'none',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <VerifiedUser sx={{ fontSize: 64, color: '#4DA1A9', mb: 3 }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#171635',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Verify Your Identity
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 4,
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
              }}
            >
              To ensure the security of your account and comply with financial
              regulations, we need to verify your identity. Choose your
              preferred verification method.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexDirection: { xs: 'column', md: 'row' },
                mb: 4,
              }}
            >
              {/* Bank Verification Option */}
              <Card
                sx={{
                  flex: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '2px solid transparent',
                  '&:hover': {
                    border: '2px solid #4DA1A9',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(77, 161, 169, 0.15)',
                  },
                }}
                onClick={handleVerifyNow}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <AccountBalance
                    sx={{ fontSize: 48, color: '#4DA1A9', mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: '#171635', mb: 2 }}
                  >
                    Bank Verification
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                    Instantly verify your identity by logging into your bank
                    account. Quick, secure, and hassle-free.
                  </Typography>
                  <Chip
                    label="Recommended"
                    color="primary"
                    sx={{
                      background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </Card>

              {/* Traditional KYC Option */}
              <Card
                sx={{
                  flex: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '2px solid transparent',
                  '&:hover': {
                    border: '2px solid #FFA630',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(255, 166, 48, 0.15)',
                  },
                }}
                onClick={handleSkipKYC}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Security sx={{ fontSize: 48, color: '#FFA630', mb: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: '#171635', mb: 2 }}
                  >
                    Document Upload
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                    Upload your ID documents for manual verification. Takes
                    longer but works without a bank account.
                  </Typography>
                  <Chip
                    label="Alternative Method"
                    sx={{
                      backgroundColor: '#FFF3E0',
                      color: '#FFA630',
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </Card>
            </Box>

            <Alert severity="info" sx={{ textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Why verify?</strong> Identity verification helps protect
                your account and enables full access to all PayLentine features
                including higher transaction limits.
              </Typography>
            </Alert>
          </Paper>
        </Container>

        {/* Bank Login Dialog */}
        <Dialog
          open={showBankDialog}
          onClose={() => setShowBankDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Bank Account Verification
            <Button
              onClick={() => setShowBankDialog(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                minWidth: 'auto',
                p: 1,
              }}
            >
              <Close />
            </Button>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
              Select your bank and login with your online banking credentials to
              verify your identity.
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Your Bank</InputLabel>
              <Select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                label="Select Your Bank"
              >
                {banks.map((bank) => (
                  <MenuItem key={bank} value={bank}>
                    {bank}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Username/Account Number"
              value={bankCredentials.username}
              onChange={handleCredentialChange('username')}
              disabled={isValidating}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password/PIN"
              type="password"
              value={bankCredentials.password}
              onChange={handleCredentialChange('password')}
              disabled={isValidating}
              sx={{ mb: 3 }}
            />

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Security Notice:</strong> Your banking credentials are
                processed securely and are not stored on our servers. This
                verification is powered by secure banking APIs.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setShowBankDialog(false)}
              disabled={isValidating}
              sx={{ color: '#666' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBankLogin}
              variant="contained"
              disabled={
                isValidating ||
                !selectedBank ||
                !bankCredentials.username ||
                !bankCredentials.password
              }
              sx={{
                background: 'linear-gradient(90deg, #9C89B8, #4DA1A9)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #856DA9, #41898F)',
                },
              }}
            >
              {isValidating ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                  <Typography variant="body2">Verifying...</Typography>
                </Box>
              ) : (
                'Verify Account'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Bank Success Step
  if (step === 'bank_success') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          background:
            'linear-gradient(135deg, rgba(156, 137, 184, 0.8) 40%, rgba(77, 161, 169, 0.8) 86%)',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 1,
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: { xs: 8, md: 11 },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              maxWidth: 600,
              width: '100%',
              background: '#F8F6F6',
              boxShadow: 'none',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <CheckCircle sx={{ fontSize: 64, color: '#4CAF50', mb: 3 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#171635',
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.125rem' },
              }}
            >
              Verification Successful!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 4,
                fontSize: { xs: '0.9rem', md: '1rem' },
                lineHeight: 1.6,
              }}
            >
              Your identity has been successfully verified through your bank
              account. You now have full access to all PayLentine features.
            </Typography>

            <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Verification Complete!</strong> Your account is now
                fully verified. You can access all features including higher
                transaction limits.
              </Typography>
            </Alert>

            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              Redirecting to your dashboard in a few seconds...
            </Typography>
            <CircularProgress sx={{ color: '#4DA1A9' }} />
          </Paper>
        </Container>
      </Box>
    );
  }

  return null;
}
