'use client';

import { Box, Typography } from '@mui/material';

export default function DashboardContent() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #9C89B8 40%, #4DA1A9 86%)',
        color: 'white',
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 700, textAlign: 'center' }}>
        Dashboard Test Site
      </Typography>
    </Box>
  );
}



