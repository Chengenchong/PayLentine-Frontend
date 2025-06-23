'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Fade,
} from '@mui/material';
import {
  TrendingUp,
  Speed,
  AttachMoney,
  SwapHoriz,
  PlayArrow,
} from '@mui/icons-material';
import { useFadeInOnMount } from '../hooks/useScrollAnimation';
import AnimatedSection from './AnimatedSection';

export default function Hero() {
  const isVisible = useFadeInOnMount(300);

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #9C89B8 40%, #4DA1A9 86%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mt: 10 }}>
        <Fade in={isVisible} timeout={1000}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 6,
              alignItems: 'center',
            }}
          >
            <Fade
              in={isVisible}
              timeout={1200}
              style={{ transitionDelay: '200ms' }}
            >
              <Box sx={{ flex: 1 }}>
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
            </Fade>

            <Fade
              in={isVisible}
              timeout={1400}
              style={{ transitionDelay: '400ms' }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
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
            </Fade>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
