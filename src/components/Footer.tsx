'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  GitHub,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';
import AnimatedSection from './AnimatedSection';

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#171635',
        color: 'white',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <AnimatedSection direction="up" threshold={0.3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 6,
            }}
          >
            {/* Logo and Description */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 3,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <AccountBalanceWallet sx={{ color: 'white', fontSize: 32 }} />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #ffd700, #ff6b6b)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  PayLentine
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ mb: 4, maxWidth: 300, opacity: 0.9 }}
              >
                Revolutionizing currency exchange through innovative Web 2.5
                technology and peer-to-peer matching.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<TrendingUp />}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    color: 'white',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    },
                  }}
                >
                  Start Trading
                </Button>
              </Box>
            </Box>

            {/* Quick Links */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  How it Works
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  Supported Currencies
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  Security
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  Help Center
                </Typography>
              </Box>
            </Box>

            {/* Company */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  About Us
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  Careers
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  Press
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  Contact
                </Typography>
              </Box>
            </Box>

            {/* Social Links */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Connect
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <GitHub
                  sx={{
                    fontSize: 24,
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                />
                <Twitter
                  sx={{
                    fontSize: 24,
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                />
                <LinkedIn
                  sx={{
                    fontSize: 24,
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Copyright */}
          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              mt: 6,
              pt: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2024 PayLentine. All rights reserved. Built with ❤️ for the
              future of finance.
            </Typography>
          </Box>
        </AnimatedSection>
      </Container>
    </Box>
  );
}
