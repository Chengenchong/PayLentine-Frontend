'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Avatar,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function LoginHeader() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/duplicateddashboard');
  };

  const handleProfileClick = () => {
    router.push('/profile');
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
              transition: 'opacity 0.2s ease',
            }}
            onClick={handleLogoClick}
          >
            <img
              src="/Paylentine_logo.jpg"
              alt="PayLentine Logo"
              style={{
                width: 32,
                height: 32,
                objectFit: 'contain',
                borderRadius: 6,
              }}
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

          <IconButton
            onClick={handleProfileClick}
            sx={{
              ml: 2,
              p: 1,
              '&:hover': {
                backgroundColor: 'rgba(23, 22, 53, 0.04)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#171635',
                color: '#F8F6F6',
              }}
            >
              <Person fontSize="small" />
            </Avatar>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
