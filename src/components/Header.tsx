'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { AccountBalanceWallet, TrendingUp } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/register');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWallet
              sx={{ color: 'primary.main', fontSize: 32 }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PayLentine
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Button
              color="inherit"
              sx={{ color: 'text.primary', fontWeight: 500 }}
            >
              How it Works
            </Button>
            <Button
              color="inherit"
              sx={{ color: 'text.primary', fontWeight: 500 }}
            >
              About
            </Button>
            <Button
              color="inherit"
              sx={{ color: 'text.primary', fontWeight: 500 }}
            >
              Contact
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: '#171635',
                borderColor: '#171635',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#171635',
                  borderColor: '#171635',
                  color: '#F8F6F6',
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              startIcon={<TrendingUp />}
              onClick={handleGetStarted}
              sx={{
                backgroundColor: '#171635',
                color: '#F8F6F6',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#F8F6F6',
                  color: '#171635',
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
