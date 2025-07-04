'use client';

import { Box, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from '../Dashboard/Context';

export default function PreDashboardContent() {
  const [welcomeText, setWelcomeText] = useState('');
  const [readyText, setReadyText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const router = useRouter();

  const welcomeFullText = 'Welcome to PayLentine!';
  const readyFullText = 'Ready to Pay?';

  useEffect(() => {
    // Typewriter effect for welcome text
    const welcomeTimer = setTimeout(() => {
      let currentIndex = 0;
      const welcomeInterval = setInterval(() => {
        if (currentIndex <= welcomeFullText.length) {
          setWelcomeText(welcomeFullText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(welcomeInterval);

          // Start ready text after welcome is complete
          setTimeout(() => {
            let readyIndex = 0;
            const readyInterval = setInterval(() => {
              if (readyIndex <= readyFullText.length) {
                setReadyText(readyFullText.substring(0, readyIndex));
                readyIndex++;
              } else {
                clearInterval(readyInterval);

                // Show button after ready text is complete
                setTimeout(() => setShowButton(true), 1000);
              }
            }, 100);
          }, 500);
        }
      }, 100);
    }, 1000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  const handleLetsPay = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowDashboard(true);
    }, 1000);
  };

  if (showDashboard) {
    return <DashboardContent />;
  }

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
        `}
      </style>
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {/* Blurred Dashboard Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            filter: fadeOut ? 'blur(0px)' : 'blur(8px)',
            transition: 'filter 1s ease-out',
            zIndex: 1,
          }}
        >
          <DashboardContent />
        </Box>

        {/* Animation Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: fadeOut ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.3)',
            transition: 'background 1s ease-out',
            zIndex: 2,
            opacity: fadeOut ? 0 : 1,
          }}
        >
          {/* Welcome Text */}
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Pacifico", cursive',
              fontWeight: 400,
              color: 'white',
              textAlign: 'center',
              mb: 2,
              opacity: welcomeText ? 1 : 0,
              transform: welcomeText ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 2s ease-out',
              fontSize: { xs: '2.5rem', md: '4rem' },
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
              minHeight: '80px',
            }}
          >
            {welcomeText}
          </Typography>

          {/* Ready Text */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Pacifico", cursive',
              fontWeight: 400,
              color: 'white',
              textAlign: 'center',
              mb: 4,
              opacity: readyText ? 1 : 0,
              transform: readyText ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 2s ease-out',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
              minHeight: '60px',
            }}
          >
            {readyText}
          </Typography>

          {/* Let's Pay Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleLetsPay}
            sx={{
              opacity: showButton ? 1 : 0,
              transform: showButton ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 2s ease-out',
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 600,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              background: '#9C89B8',
              boxShadow: '0 8px 20px rgba(156, 137, 184, 0.4)',
              '&:hover': {
                background: '#856DA9',
                boxShadow: '0 12px 25px rgba(133, 109, 169, 0.6)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Let's Pay!
          </Button>
        </Box>
      </Box>
    </>
  );
}
