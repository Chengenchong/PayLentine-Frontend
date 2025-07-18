// API Environment Switcher Component

'use client';

import React, { useState } from 'react';
import {
  Box,
  Switch,
  Typography,
  FormControlLabel,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import { setApiEnvironment, getCurrentBaseUrl } from '../services/api';

const ApiEnvironmentSwitcher: React.FC = () => {
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(getCurrentBaseUrl());

  const handleEnvironmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const useDevelopment = event.target.checked;
    setIsDevelopment(useDevelopment);
    
    const environment = useDevelopment ? 'DEVELOPMENT' : 'PRODUCTION';
    setApiEnvironment(environment);
    setCurrentUrl(getCurrentBaseUrl());
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        API Environment Settings
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isDevelopment}
              onChange={handleEnvironmentChange}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Use Development API</Typography>
              <Chip
                label={isDevelopment ? 'Development' : 'Production'}
                color={isDevelopment ? 'warning' : 'primary'}
                size="small"
              />
            </Box>
          }
        />
      </Box>

      <Alert severity={isDevelopment ? 'warning' : 'info'} sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Current API Base URL:</strong> {currentUrl}
        </Typography>
      </Alert>

      <Typography variant="body2" color="text.secondary">
        {isDevelopment
          ? '⚠️ Development mode: API calls will be made to your local backend server.'
          : '✅ Production mode: API calls will be made to the deployed backend server.'}
      </Typography>
    </Paper>
  );
};

export default ApiEnvironmentSwitcher;
