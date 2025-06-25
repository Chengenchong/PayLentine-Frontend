'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  AttachMoney,
  SwapHoriz,
  PlayArrow,
  Security,
  FlashOn,
  TrendingDown,
  Groups,
  Public,
  LocalAtm,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedSection from '../components/AnimatedSection';

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

const bubbleColors = ['#9C89B8', '#4DA1A9', '#E573C0', '#FFD600', '#7FC7FF'];
const bubbles: { size: number; left: string; top: string; delay: string; duration: string; opacity: number; color: string }[] = Array.from({ length: 10 }).map((_, i) => ({
  size: 80 + Math.random() * 80,
  left: `${5 + Math.random() * 90}%`,
  top: `${5 + Math.random() * 80}%`,
  delay: `${Math.random() * 2}s`,
  duration: `${2.5 + Math.random() * 2}s`,
  opacity: 0.13 + Math.random() * 0.09,
  color: bubbleColors[i % bubbleColors.length],
}));

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleStartTrading = () => {
    router.push('/community-market');
  };

  return (
    <>
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #bbaaff 0%, #c7bfff 40%, #a7bfff 70%, #b6e0fe 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Animated floating bubbles */}
      {bubbles.map((b, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          width: b.size,
          height: b.size,
          left: b.left,
          top: b.top,
          borderRadius: '50%',
          background: b.color,
          opacity: b.opacity,
          filter: 'blur(2.5px)',
          animation: `bubbleFloat ${b.duration} linear infinite`,
          animationDelay: b.delay,
          zIndex: 1,
        }} />
      ))}
      <style>{`
        @keyframes bubbleFloat {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-60px) scale(1.12); }
          100% { transform: translateY(0px) scale(1); }
        }
      `}</style>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, mt: 10 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 6,
            alignItems: 'center',
          }}
        >
          {/* Left side - Main content */}
          <Box
            sx={{
              flex: 1,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'all 0.7s ease-out 100ms',
            }}
          >
            <Chip
              label="🚀 Web 2.5 Innovation"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                mb: 3,
              }}
            />

            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
              }}
            >
              <Box
                component="span"
                sx={{
                  color: '#FFA630',
                  textShadow: '2px 2px 4px #171635',
                }}
              >
                Revolutionary
              </Box>
              <Box
                component="span"
                sx={{
                  color: '#F8F6F6',
                  display: 'block',
                  textShadow: '2px 2px 4px #171635',
                }}
              >
                Currency Exchange
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Eliminate exchange rate fluctuations, high fees, and slow
              transactions through our innovative C2C matchmaking platform.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<TrendingUp />}
                onClick={handleStartTrading}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  color: 'white',
                  fontWeight: 600,
                  py: 2,
                  px: 4,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                }}
              >
                Start Trading
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  fontWeight: 600,
                  py: 2,
                  px: 4,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Watch Demo
              </Button>
            </Box>
          </Box>

          {/* Right side - Feature cards */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
              transition: 'all 0.8s ease-out 200ms',
            }}
          >
            <Card
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CardContent
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <Speed sx={{ color: '#ffd700', fontSize: 40 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    Instant Transactions
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    Complete exchanges in seconds, not days
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CardContent
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <AttachMoney sx={{ color: '#4ade80', fontSize: 40 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    Zero Hidden Fees
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    Transparent pricing with no surprises
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CardContent
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <SwapHoriz sx={{ color: '#f472b6', fontSize: 40 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', fontWeight: 600 }}
                  >
                    Smart Matching
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    AI-powered C2C currency matching
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>

    {/* Features Section */}
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
                    sx={{ color: '#171635', lineHeight: 1.6 }}
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
    </>
  );
}
