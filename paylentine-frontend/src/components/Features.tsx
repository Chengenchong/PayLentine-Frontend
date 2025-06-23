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
import ClientOnly from './ClientOnly';
import { useStaggeredAnimation } from '../hooks/useScrollAnimation';

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

// Static fallback component for SSR
function StaticFeatures() {
  return (
    <>
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
          Experience the future of currency exchange with our innovative Web 2.5
          platform
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
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
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
    </>
  );
}

// Animated component for client-side
function AnimatedFeatures() {
  const { ref, visibleItems } = useStaggeredAnimation(features.length, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  });

  return (
    <>
      <AnimatedSection direction="up" threshold={0.2} duration={800}>
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
      </AnimatedSection>

      <Box
        ref={ref}
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
              willChange: 'transform, opacity, box-shadow',
              transform: visibleItems[index]
                ? 'translate3d(0, 0, 0) scale(1)'
                : 'translate3d(0, 50px, 0) scale(0.9)',
              opacity: visibleItems[index] ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              '&:hover': {
                transform: visibleItems[index]
                  ? 'translate3d(0, -12px, 0) scale(1.02)'
                  : 'translate3d(0, 50px, 0) scale(0.9)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
              <Box
                sx={{
                  mb: 3,
                  transform: visibleItems[index]
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  opacity: visibleItems[index] ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: `${index * 100 + 200}ms`,
                }}
              >
                {feature.icon}
              </Box>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  transform: visibleItems[index]
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  opacity: visibleItems[index] ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: `${index * 100 + 300}ms`,
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  transform: visibleItems[index]
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  opacity: visibleItems[index] ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: `${index * 100 + 400}ms`,
                }}
              >
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
}

export default function Features() {
  return (
    <Box sx={{ py: 12, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <ClientOnly fallback={<StaticFeatures />}>
          <AnimatedFeatures />
        </ClientOnly>
      </Container>
    </Box>
  );
}
