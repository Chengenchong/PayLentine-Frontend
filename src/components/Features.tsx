'use client';

import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import {
  Security,
  FlashOn,
  TrendingDown,
  Groups,
  Public,
  LocalAtm,
} from '@mui/icons-material';
import AnimatedSection from './AnimatedSection';

const features = [
  {
    icon: <Security sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Bank-Level Security',
    description:
      'Advanced encryption and multi-layer security protocols protect your transactions and personal data.',
  },
  {
    icon: <FlashOn sx={{ fontSize: 48, color: 'warning.main' }} />,
    title: 'Lightning Fast',
    description:
      'Complete currency exchanges in under 30 seconds with our optimized matching algorithm.',
  },
  {
    icon: <TrendingDown sx={{ fontSize: 48, color: 'success.main' }} />,
    title: 'Lower Costs',
    description:
      'Save up to 80% on traditional exchange fees with our peer-to-peer matching system.',
  },
  {
    icon: <Groups sx={{ fontSize: 48, color: 'secondary.main' }} />,
    title: 'Global Community',
    description:
      'Join thousands of users worldwide who trust PayLentine for their currency exchange needs.',
  },
  {
    icon: <Public sx={{ fontSize: 48, color: 'info.main' }} />,
    title: 'Worldwide Coverage',
    description:
      'Exchange between 150+ currencies across 190+ countries with competitive rates.',
  },
  {
    icon: <LocalAtm sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Smart Pricing',
    description:
      'Get the best exchange rates through our intelligent C2C matching and real-time optimization.',
  },
];

export default function Features() {
  return (
    <Box sx={{ py: 12, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <AnimatedSection direction="up" threshold={0.2}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Why Choose PayLentine?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Experience the future of currency exchange with our innovative Web
              2.5 platform
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </AnimatedSection>
      </Container>
    </Box>
  );
}
