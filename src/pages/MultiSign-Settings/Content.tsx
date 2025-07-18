"use client";

import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  Slider,
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  RadioGroup,
  Radio,
  alpha,
  IconButton,
  Divider,
  Chip,
  Grid,
  Avatar,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  Language as LanguageIcon,
  CreditCard as CreditCardIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  VolumeUp as VolumeUpIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ColorLens as ColorLensIcon,
  TextFields as TextFieldsIcon,
  Tune as TuneIcon,
  ExpandMore as ExpandMoreIcon,
  NotificationsActive as NotificationsActiveIcon,
  AccessTime as AccessTimeIcon,
  AccountCircle as AccountCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Shield as ShieldIcon,
  Build as BuildIcon,
  ViewCompact as ViewCompactIcon,
  Dashboard as DashboardIcon,
  NotificationImportant as NotificationImportantIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from '@mui/icons-material';
import { useTheme as useAppTheme } from '../../components/ThemeProvider';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { 
  getMultiSignSettings, 
  updateMultiSignSettings, 
  updateMultiSignSettingsByEmail,
  validateSeedPhrase 
} from '../../services/multisig';
import type { MultiSignSettings as BackendMultiSignSettings } from '../../types/multisig';

// Safe theme hook that handles SSR
const useSafeAppTheme = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  try {
    const themeContext = useAppTheme();
    // During SSR or before hydration, return safe defaults
    if (!mounted) {
      return {
        mode: 'light' as const,
        setTheme: () => {},
        toggleTheme: () => {}
      };
    }
    return themeContext;
  } catch (error) {
    // Fallback for when context is not available
    return {
      mode: 'light' as const,
      setTheme: () => {},
      toggleTheme: () => {}
    };
  }
};

// --- MultiSign Context/Provider/Hook ---
export type Contact = { id: string; name: string; email?: string; };

interface MultiSignSettings {
  enabled: boolean;
  threshold: number;
  userB: Contact | null;
  locked: boolean;
  setEnabled: (enabled: boolean) => void;
  setThreshold: (threshold: number) => void;
  setUserB: (user: Contact | null) => void;
  setLocked: (locked: boolean) => void;
  saveToBackend: () => Promise<void>;
  loadFromBackend: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const MultiSignContext = createContext<MultiSignSettings | undefined>(undefined);

export const MultiSignProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState(false);
  const [threshold, setThreshold] = useState(1000);
  const [userB, setUserB] = useState<Contact | null>(null);
  const [locked, setLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Load settings from backend
  const loadFromBackend = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMultiSignSettings();
      console.log('Backend response:', response); // Debug log
      
      // Handle different response formats
      let settings = null;
      if (response.success && response.data) {
        settings = response.data;
      } else if (response.settings) {
        settings = response.settings;
      } else if (response.hasSettings && response.settings) {
        settings = response.settings;
      } else if (response.isEnabled !== undefined) {
        settings = response;
      }
      
      if (settings) {
        console.log('Processed settings:', settings); // Debug log
        setEnabled(settings.isEnabled);
        setThreshold(settings.thresholdAmount || 1000);
        
        // Handle locked state - check multiple possible field names
        setLocked(settings.locked || settings.requiresSeedPhrase || false);
        
        // Handle partner information - prioritize new API response format
        if (settings.signer && settings.signer.email) {
          // New API format with signer object
          setUserB({
            id: settings.signer.email,
            name: `${settings.signer.firstName} ${settings.signer.lastName}`.trim(),
            email: settings.signer.email,
          });
        } else if (settings.partnerEmail) {
          // Legacy format with partnerEmail
          setUserB({
            id: settings.partnerEmail,
            name: settings.partnerName || settings.partnerEmail,
            email: settings.partnerEmail,
          });
        } else if (settings.signerUserId && settings.signerEmail) {
          // Alternative format with signerEmail
          setUserB({
            id: settings.signerEmail,
            name: settings.signerName || settings.signerEmail,
            email: settings.signerEmail,
          });
        } else if (settings.signerUserId) {
          // If we only have signerUserId, try to find the contact
          const contact = contacts.find(c => c.id === settings.signerUserId.toString() || c.email === settings.signerUserId);
          if (contact) {
            setUserB(contact);
          }
        }
      }
    } catch (err: any) {
      console.error('Load settings error:', err);
      setError(err.message || 'Failed to load multi-signature settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to backend using new email-based API
  const saveToBackend = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const settings = {
        isEnabled: enabled,
        thresholdAmount: threshold,
        signerEmail: userB?.email,
        requiresSeedPhrase: locked, // Use locked state to indicate if seed phrase is required
      };
      
      console.log('Selected contact:', userB); // Debug log
      console.log('Saving settings to email API:', settings); // Debug log
      
      // Use the new email-based API endpoint
      const response = await updateMultiSignSettingsByEmail(settings);
      console.log('Save response:', response); // Debug log
      
      // Check if the response indicates success
      if (response.success || (response.message && response.message.includes('successfully'))) {
        // Update local state with response data if available
        if (response.settings) {
          setEnabled(response.settings.isEnabled);
          setThreshold(response.settings.thresholdAmount);
          setLocked(response.settings.requiresSeedPhrase || false);
          
          // Update userB with response data
          if (response.settings.signer) {
            setUserB({
              id: response.settings.signer.email,
              name: `${response.settings.signer.firstName} ${response.settings.signer.lastName}`,
              email: response.settings.signer.email,
            });
          }
        }
        return;
      }
      
      if (!response.success) {
        const errorMessage = response.message || 'Failed to save settings';
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('Save settings error:', err);
      setError(err.message || 'Failed to save multi-signature settings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load settings on mount
  useEffect(() => {
    loadFromBackend();
  }, [isAuthenticated]);

  return (
    <MultiSignContext.Provider
      value={{ 
        enabled, 
        threshold, 
        userB, 
        locked,
        setEnabled, 
        setThreshold, 
        setUserB,
        setLocked,
        saveToBackend,
        loadFromBackend,
        isLoading,
        error
      }}
    >
      {children}
    </MultiSignContext.Provider>
  );
};

export function useMultiSign() {
  const ctx = useContext(MultiSignContext);
  if (!ctx) throw new Error('useMultiSign must be used within MultiSignProvider');
  return ctx;
}

// Safe version of useMultiSign that works during SSR
export function useSafeMultiSign() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  try {
    const ctx = useContext(MultiSignContext);
    if (!mounted || !ctx) {
      // Return safe defaults during SSR or when context is not available
      return {
        enabled: false,
        threshold: 1000,
        userB: null,
        locked: false,
        setEnabled: () => {},
        setThreshold: () => {},
        setUserB: () => {},
        setLocked: () => {},
        saveToBackend: async () => {},
        loadFromBackend: async () => {},
        isLoading: false,
        error: null
      };
    }
    return ctx;
  } catch (error) {
    // Fallback for when context is not available
    return {
      enabled: false,
      threshold: 1000,
      userB: null,
      locked: false,
      setEnabled: () => {},
      setThreshold: () => {},
      setUserB: () => {},
      setLocked: () => {},
      saveToBackend: async () => {},
      loadFromBackend: async () => {},
      isLoading: false,
      error: null
    };
  }
}

// Dummy contacts
const contacts = [
  { id: 'bruno.hoffman@example.com', name: 'Bruno Hoffman', email: 'bruno.hoffman@example.com' },
  { id: 'vanessa.saldia@example.com', name: 'Vanessa Saldia', email: 'vanessa.saldia@example.com' },
  { id: 'chad.kenley@example.com', name: 'Chad Kenley', email: 'chad.kenley@example.com' },
  { id: 'manuel.rovira@example.com', name: 'Manuel Rovira', email: 'manuel.rovira@example.com' },
  { id: 'alice.smith@example.com', name: 'Alice Smith', email: 'alice.smith@example.com' },
];

// Settings sections matching the screenshot
const settingsSections = [
  { 
    id: 'notifications', 
    label: 'Notifications', 
    icon: <NotificationsIcon />,
  },
  { 
    id: 'preferences', 
    label: 'Preferences', 
    icon: <SettingsIcon />,
  },
  { 
    id: 'custom', 
    label: 'Custom', 
    icon: <ColorLensIcon />,
  },
  { 
    id: 'security', 
    label: 'Security', 
    icon: <SecurityIcon />,
  },
  { 
    id: 'payment', 
    label: 'Payment', 
    icon: <PaymentIcon />,
  },
];

// Content Components
const PreferencesContent = () => {
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Eastern Time');
  const [currency, setCurrency] = useState('USD ($)');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('morning');
  const [autoReorder, setAutoReorder] = useState(true);
  const { mode, setTheme } = useSafeAppTheme();
  const theme = useMuiTheme();

  const handleThemeChange = (isDark: boolean) => {
    setTheme(isDark ? 'dark' : 'light');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Preferences
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 6 }}>
        {/* Left Column */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Language
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <MenuItem value="English">🇺🇸 English</MenuItem>
                <MenuItem value="Spanish">🇪🇸 Spanish</MenuItem>
                <MenuItem value="French">🇫🇷 French</MenuItem>
                <MenuItem value="German">🇩🇪 German</MenuItem>
                <MenuItem value="Chinese">🇨🇳 Chinese</MenuItem>
                <MenuItem value="Japanese">🇯🇵 Japanese</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Timezone
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <MenuItem value="Eastern Time">Eastern Time (UTC-5)</MenuItem>
                <MenuItem value="Central Time">Central Time (UTC-6)</MenuItem>
                <MenuItem value="Mountain Time">Mountain Time (UTC-7)</MenuItem>
                <MenuItem value="Pacific Time">Pacific Time (UTC-8)</MenuItem>
                <MenuItem value="GMT">Greenwich Mean Time (UTC+0)</MenuItem>
                <MenuItem value="CET">Central European Time (UTC+1)</MenuItem>
                <MenuItem value="JST">Japan Standard Time (UTC+9)</MenuItem>
                <MenuItem value="AEST">Australian Eastern Time (UTC+10)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Currency
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <MenuItem value="USD ($)">USD ($) - US Dollar</MenuItem>
                <MenuItem value="EUR (€)">EUR (€) - Euro</MenuItem>
                <MenuItem value="GBP (£)">GBP (£) - British Pound</MenuItem>
                <MenuItem value="JPY (¥)">JPY (¥) - Japanese Yen</MenuItem>
                <MenuItem value="CAD ($)">CAD ($) - Canadian Dollar</MenuItem>
                <MenuItem value="AUD ($)">AUD ($) - Australian Dollar</MenuItem>
                <MenuItem value="CHF (Fr)">CHF (Fr) - Swiss Franc</MenuItem>
                <MenuItem value="CNY (¥)">CNY (¥) - Chinese Yuan</MenuItem>
                <MenuItem value="MYR (RM)">MYR (RM) - Malaysian Ringgit</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              App Behavior
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1">Dark Mode</Typography>
                <Switch
                  checked={mode === 'dark'}
                  onChange={(e) => handleThemeChange(e.target.checked)}
                  color="primary"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Use dark theme for the interface
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1">Auto Reorder</Typography>
                <Switch
                  checked={autoReorder}
                  onChange={(e) => setAutoReorder(e.target.checked)}
                  color="primary"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Automatically reorder frequent services
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Preferred Time Slot
            </Typography>
            <RadioGroup
              value={preferredTimeSlot}
              onChange={(e) => setPreferredTimeSlot(e.target.value)}
            >
              <FormControlLabel
                value="morning"
                control={<Radio />}
                label="Morning (8AM - 12PM)"
              />
              <FormControlLabel
                value="afternoon"
                control={<Radio />}
                label="Afternoon (12PM - 6PM)"
              />
              <FormControlLabel
                value="evening"
                control={<Radio />}
                label="Evening (6PM - 10PM)"
              />
            </RadioGroup>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const NotificationsContent = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('immediate');
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Notifications
      </Typography>
      
      <Grid container spacing={4}>
        {/* General Notifications */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsActiveIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                General Notifications
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotificationsIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body1">Push Notifications</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive notifications directly on your device
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  color="primary"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body1">Email Notifications</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get important updates via email
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  color="primary"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SmsIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body1">SMS Notifications</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive critical alerts via SMS
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  color="primary"
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Notification Preferences */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TuneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Notification Preferences
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VolumeUpIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body1">Sound</Typography>
                </Box>
                <Switch
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  color="primary"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1">Vibration</Typography>
                </Box>
                <Switch
                  checked={vibrationEnabled}
                  onChange={(e) => setVibrationEnabled(e.target.checked)}
                  color="primary"
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Notification Timing
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={notificationTime} onChange={(e) => setNotificationTime(e.target.value)}>
                    <MenuItem value="immediate">Immediate</MenuItem>
                    <MenuItem value="5min">5 minutes delay</MenuItem>
                    <MenuItem value="15min">15 minutes delay</MenuItem>
                    <MenuItem value="1hour">1 hour delay</MenuItem>
                    <MenuItem value="digest">Daily digest</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const CustomContent = () => {
  const { mode, setTheme } = useSafeAppTheme();
  const theme = useMuiTheme();
  const [fontSize, setFontSize] = useState(16);
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [borderRadius, setBorderRadius] = useState(12);
  const [selectedAccent, setSelectedAccent] = useState('purple');
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const accentColors = [
    { name: 'purple', color: '#9C89B8', label: 'Purple' },
    { name: 'blue', color: '#4DA1A9', label: 'Blue' },
    { name: 'green', color: '#4CAF50', label: 'Green' },
    { name: 'orange', color: '#FF9800', label: 'Orange' },
    { name: 'red', color: '#F44336', label: 'Red' },
    { name: 'pink', color: '#E91E63', label: 'Pink' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Customize Your Experience
      </Typography>
      
      <Grid container spacing={4}>
        {/* Theme Selection */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ColorLensIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Theme Mode
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant={mode === 'light' ? 'contained' : 'outlined'}
                startIcon={<LightModeIcon />}
                onClick={() => setTheme('light')}
                sx={{ flex: 1 }}
              >
                Light
              </Button>
              <Button
                variant={mode === 'dark' ? 'contained' : 'outlined'}
                startIcon={<DarkModeIcon />}
                onClick={() => setTheme('dark')}
                sx={{ flex: 1 }}
              >
                Dark
              </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Theme Preview
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                p: 2, 
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 1 
                }} />
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  backgroundColor: theme.palette.secondary.main,
                  borderRadius: 1 
                }} />
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`
                }} />
              </Box>
            </Box>
          </Card>
        </Grid>



        {/* Typography Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextFieldsIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Typography
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Font Size: {fontSize}px
              </Typography>
              <Slider
                value={fontSize}
                onChange={(_, value) => setFontSize(value as number)}
                min={12}
                max={24}
                step={1}
                marks={[
                  { value: 12, label: 'Small' },
                  { value: 16, label: 'Medium' },
                  { value: 20, label: 'Large' },
                  { value: 24, label: 'Extra Large' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Border Radius: {borderRadius}px
              </Typography>
              <Slider
                value={borderRadius}
                onChange={(_, value) => setBorderRadius(value as number)}
                min={0}
                max={20}
                step={2}
                marks={[
                  { value: 0, label: 'Sharp' },
                  { value: 8, label: 'Rounded' },
                  { value: 16, label: 'Very Rounded' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            <Typography variant="body1" gutterBottom>
              Sample Text Preview
            </Typography>
            <Box sx={{ 
              p: 2, 
              backgroundColor: theme.palette.background.paper,
              borderRadius: `${borderRadius}px`,
              border: `1px solid ${theme.palette.divider}`,
              fontSize: `${fontSize}px`
            }}>
              <Typography variant="h6" sx={{ fontSize: `${fontSize + 4}px` }}>
                Sample Header
              </Typography>
              <Typography sx={{ fontSize: `${fontSize}px` }}>
                This is how your text will appear with the selected settings.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const SecurityContent = () => {
  const { 
    enabled, 
    setEnabled, 
    threshold, 
    setThreshold, 
    userB, 
    setUserB, 
    locked,
    setLocked,
    saveToBackend, 
    isLoading, 
    error 
  } = useMultiSign();
  const [showSeedDialog, setShowSeedDialog] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>(Array(12).fill(''));
  const [seedError, setSeedError] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  // New state for unlocking
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [unlockSeedPhrase, setUnlockSeedPhrase] = useState<string[]>(Array(12).fill(''));
  const [unlockSeedError, setUnlockSeedError] = useState('');
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = () => {
    if (enabled) {
      setShowSeedDialog(true);
    } else {
      setEnabled(true);
    }
  };

  const handleThresholdChange = (value: number) => {
    if (!locked) {
      setThreshold(value);
    }
  };

  const handleSeedChange = (idx: number, value: string) => {
    // Check if the value contains multiple words (pasted seed phrase)
    if (value.includes(' ') && value.trim().split(/\s+/).length > 1) {
      const words = value.trim().split(/\s+/);
      if (words.length === 12) {
        // If exactly 12 words, fill all boxes
        setSeedPhrase(words);
        setSeedError(''); // Clear any existing error
        return;
      } else if (words.length > 1) {
        // If multiple words but not 12, try to fill from current position
        const updated = [...seedPhrase];
        for (let i = 0; i < words.length && (idx + i) < 12; i++) {
          updated[idx + i] = words[i];
        }
        setSeedPhrase(updated);
        return;
      }
    }
    
    // Normal single word input
    const updated = [...seedPhrase];
    updated[idx] = value;
    setSeedPhrase(updated);
  };

  const handleSeedConfirm = () => {
    if (seedPhrase.some((w) => !w.trim())) {
      setSeedError('Please enter all 12 words.');
      return;
    }
    setEnabled(false);
    setShowSeedDialog(false);
    setSeedPhrase(Array(12).fill(''));
    setSeedError('');
    setLocked(false); // Reset locked state when disabling
  };

  // New handler functions for confirmation and unlocking
  const handleConfirmPartner = () => {
    if (enabled && userB && threshold) {
      setShowReviewDialog(true);
    }
  };

  const handleFinalConfirm = async () => {
    setIsSaving(true);
    try {
      setLocked(true); // Set locked state first
      await saveToBackend(); // Save to backend with locked state
      setShowReviewDialog(false);
    } catch (error) {
      console.error('Failed to save multi-signature settings:', error);
      setLocked(false); // Revert locked state on error
      // Error is already handled in the context
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnlockForModification = () => {
    setShowUnlockDialog(true);
  };

  const handleUnlockSeedChange = (idx: number, value: string) => {
    // Check if the value contains multiple words (pasted seed phrase)
    if (value.includes(' ') && value.trim().split(/\s+/).length > 1) {
      const words = value.trim().split(/\s+/);
      if (words.length === 12) {
        // If exactly 12 words, fill all boxes
        setUnlockSeedPhrase(words);
        setUnlockSeedError(''); // Clear any existing error
        return;
      } else if (words.length > 1) {
        // If multiple words but not 12, try to fill from current position
        const updated = [...unlockSeedPhrase];
        for (let i = 0; i < words.length && (idx + i) < 12; i++) {
          updated[idx + i] = words[i];
        }
        setUnlockSeedPhrase(updated);
        return;
      }
    }
    
    // Normal single word input
    const updated = [...unlockSeedPhrase];
    updated[idx] = value;
    setUnlockSeedPhrase(updated);
  };

  const handleUnlockConfirm = async () => {
    if (unlockSeedPhrase.some((w) => !w.trim())) {
      setUnlockSeedError('Please enter all 12 words.');
      return;
    }
    
    try {
      // Validate seed phrase with backend
      const { validateSeedPhrase } = await import('../../services/multisig');
      const seedString = unlockSeedPhrase.join(' ');
      const response = await validateSeedPhrase(seedString);
      
      if (response.success && response.data?.valid) {
        setLocked(false); // Unlock the settings
        await saveToBackend(); // Save unlocked state to backend
        setShowUnlockDialog(false);
        setUnlockSeedPhrase(Array(12).fill(''));
        setUnlockSeedError('');
      } else {
        setUnlockSeedError('Invalid seed phrase. Please try again.');
      }
    } catch (error) {
      console.error('Failed to validate seed phrase:', error);
      setUnlockSeedError('Failed to validate seed phrase. Please try again.');
    }
  };

  const handleContactSelect = (contact: Contact | null) => {
    if (!locked && contact) {
      console.log('Contact selected:', contact);
      console.log('Email to be sent to backend:', contact.email);
      setUserB(contact);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Security Settings
      </Typography>
      
      <Grid container spacing={4}>
        {/* Multi-Signature Settings */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShieldIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Multi-Signature Protection
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              backgroundColor: alpha('#4CAF50', 0.1),
              borderRadius: 2,
              border: `1px solid ${alpha('#4CAF50', 0.3)}`,
              mb: 3
            }}>
              <Typography variant="body2" sx={{ color: '#2E7D32' }}>
                💡 Multi-signature adds an extra layer of security by requiring approval from another user for transactions above your set threshold.
              </Typography>
            </Box>

            {/* Error Display */}
            {error && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha('#f44336', 0.1),
                borderRadius: 2,
                border: `1px solid ${alpha('#f44336', 0.3)}`,
                mb: 3
              }}>
                <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                  ⚠️ {error}
                </Typography>
              </Box>
            )}

            {/* Loading State */}
            {isLoading && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha('#2196f3', 0.1),
                borderRadius: 2,
                border: `1px solid ${alpha('#2196f3', 0.3)}`,
                mb: 3
              }}>
                <Typography variant="body2" sx={{ color: '#1976d2' }}>
                  🔄 Loading multi-signature settings...
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Enable Multi-Signature
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Require secondary approval for large transactions
                  </Typography>
                </Box>
                <Switch
                  checked={enabled}
                  onChange={handleToggle}
                  color="primary"
                />
              </Box>
            </Box>
            
            <Box sx={{ 
              opacity: enabled ? 1 : 0.5, 
              pointerEvents: enabled ? 'auto' : 'none',
              transition: 'opacity 0.3s ease'
            }}>
              <Typography variant="body1" fontWeight={600} gutterBottom>
                Transaction Threshold
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Set the maximum amount for transactions that don't require multi-signature approval
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
                <Box sx={{ flex: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Amount: {formatCurrency(threshold)}
                  </Typography>
                  <Slider
                    value={threshold}
                    onChange={(_, value) => handleThresholdChange(value as number)}
                    min={100}
                    max={10000}
                    step={100}
                    disabled={!enabled || locked}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatCurrency(value)}
                    marks={[
                      { value: 100, label: '$100' },
                      { value: 1000, label: '$1K' },
                      { value: 5000, label: '$5K' },
                      { value: 10000, label: '$10K' },
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        width: 20,
                        height: 20,
                      },
                      '& .MuiSlider-track': {
                        height: 6,
                      },
                      '& .MuiSlider-rail': {
                        height: 6,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Amount (USD)"
                    type="number"
                    value={threshold}
                    onChange={(e) => handleThresholdChange(Number(e.target.value))}
                    size="small"
                    fullWidth
                    disabled={!enabled || locked}
                    inputProps={{
                      min: 100,
                      max: 10000,
                      step: 100,
                    }}
                    InputProps={{
                      startAdornment: '$',
                    }}
                  />
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight={600} gutterBottom>
                  Multi-Signature Partner
                </Typography>
                
                {/* Partner Selection */}
                <Box sx={{ mb: 2 }}>
                  <Autocomplete
                    options={contacts}
                    getOptionLabel={(option) => `${option.name} (${option.email})`}
                    value={userB}
                    onChange={(_, val) => handleContactSelect(val)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Select trusted contact" 
                        size="small"
                        helperText={locked ? "Partner selection is locked. Use unlock button to modify." : "Choose a trusted contact who will approve transactions above the threshold"}
                      />
                    )}
                    disabled={!enabled || locked}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </Box>
                
                {/* Confirmation Section */}
                {enabled && userB && !locked && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleConfirmPartner}
                      sx={{ mr: 2 }}
                    >
                      Confirm Multi-Signature Setup
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Once confirmed, you'll need your seed phrase to modify these settings
                    </Typography>
                  </Box>
                )}
                
                {/* Locked Status */}
                {locked && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: alpha('#4CAF50', 0.1),
                      borderRadius: 2,
                      border: `1px solid ${alpha('#4CAF50', 0.3)}`,
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LockIcon sx={{ mr: 1, color: '#4CAF50' }} />
                          <Typography variant="body2" sx={{ color: '#2E7D32' }}>
                            🔒 Multi-signature setup is locked and secured
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          color="warning"
                          onClick={handleUnlockForModification}
                          startIcon={<LockOpenIcon />}
                        >
                          Unlock to Modify
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
              
              {enabled && userB && locked && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: alpha('#2196F3', 0.1),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#2196F3', 0.3)}`,
                }}>
                  <Typography variant="body2" sx={{ color: '#1976D2' }}>
                    ✅ Multi-signature is active with {userB.name} for transactions above {formatCurrency(threshold)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Authentication Settings */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Authentication
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body1">Two-Factor Authentication</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add an extra layer of security
                  </Typography>
                </Box>
                <Switch
                  checked={twoFA}
                  onChange={(e) => setTwoFA(e.target.checked)}
                  color="primary"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body1">Biometric Login</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use fingerprint or face recognition
                  </Typography>
                </Box>
                <Switch
                  checked={biometric}
                  onChange={(e) => setBiometric(e.target.checked)}
                  color="primary"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body1">Login Alerts</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notify about new device logins
                  </Typography>
                </Box>
                <Switch
                  checked={loginAlerts}
                  onChange={(e) => setLoginAlerts(e.target.checked)}
                  color="primary"
                />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Seed Phrase Dialog */}
      <Dialog open={showSeedDialog} onClose={() => setShowSeedDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Confirm Disable Multi-Signature</Typography>
            <IconButton onClick={() => setShowSeedDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Please enter your 12-word seed phrase to confirm disabling multi-signature protection.
          </Typography>
          <Box sx={{ 
            p: 2, 
            backgroundColor: alpha('#2196F3', 0.1),
            borderRadius: 2,
            border: `1px solid ${alpha('#2196F3', 0.3)}`,
            mb: 2
          }}>
            <Typography variant="body2" sx={{ color: '#1976D2' }}>
              💡 <strong>Tip:</strong> You can paste your complete 12-word seed phrase into any box and it will automatically fill all fields.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {seedPhrase.map((word, idx) => (
              <Box key={idx} sx={{ width: 'calc(33.33% - 8px)' }}>
                <TextField
                  value={word}
                  onChange={(e) => handleSeedChange(idx, e.target.value)}
                  size="small"
                  placeholder={`Word ${idx + 1}`}
                  fullWidth
                />
              </Box>
            ))}
          </Box>
          {seedError && (
            <Typography color="error" sx={{ mt: 1 }}>{seedError}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSeedDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSeedConfirm} color="error">
            Disable Multi-Signature
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unlock Multi-Signature Dialog */}
      <Dialog open={showUnlockDialog} onClose={() => setShowUnlockDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Unlock Multi-Signature Settings</Typography>
            <IconButton onClick={() => setShowUnlockDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Please enter your 12-word seed phrase to unlock and modify your multi-signature settings.
          </Typography>
          <Box sx={{ 
            p: 2, 
            backgroundColor: alpha('#2196F3', 0.1),
            borderRadius: 2,
            border: `1px solid ${alpha('#2196F3', 0.3)}`,
            mb: 2
          }}>
            <Typography variant="body2" sx={{ color: '#1976D2' }}>
              💡 <strong>Tip:</strong> You can paste your complete 12-word seed phrase into any box and it will automatically fill all fields.
            </Typography>
          </Box>
          <Box sx={{ 
            p: 2, 
            backgroundColor: alpha('#FF9800', 0.1),
            borderRadius: 2,
            border: `1px solid ${alpha('#FF9800', 0.3)}`,
            mb: 3
          }}>
            <Typography variant="body2" sx={{ color: '#F57C00' }}>
              ⚠️ This will temporarily unlock your multi-signature settings for modification. Make sure you're in a secure environment.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {unlockSeedPhrase.map((word, idx) => (
              <Box key={idx} sx={{ width: 'calc(33.33% - 8px)' }}>
                <TextField
                  value={word}
                  onChange={(e) => handleUnlockSeedChange(idx, e.target.value)}
                  size="small"
                  placeholder={`Word ${idx + 1}`}
                  fullWidth
                />
              </Box>
            ))}
          </Box>
          {unlockSeedError && (
            <Typography color="error" sx={{ mt: 1 }}>{unlockSeedError}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUnlockDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUnlockConfirm} color="warning">
            Unlock Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Multi-Signature Setup Dialog */}
      <Dialog open={showReviewDialog} onClose={() => setShowReviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Review Multi-Signature Setup</Typography>
            <IconButton onClick={() => setShowReviewDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            Please review your multi-signature configuration before confirming. Once confirmed, you'll need your seed phrase to make any changes.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Configuration Summary */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShieldIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Security Configuration
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Multi-Signature Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight={600}>
                      {enabled ? 'Enabled' : 'Disabled'}
                    </Typography>
                    <Chip 
                      label={enabled ? 'Active' : 'Inactive'} 
                      color={enabled ? 'success' : 'default'}
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction Threshold
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="primary.main">
                    {formatCurrency(threshold)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transactions above this amount will require approval
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Selected Partner
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                      {userB?.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {userB?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {userB?.id}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Security Notice */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <LockIcon sx={{ mr: 1, color: 'warning.main' }} />
                  Important Security Notice
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>What happens after confirmation:</strong>
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <li>
                      <Typography variant="body2">
                        Your multi-signature settings will be locked
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        You'll need your 12-word seed phrase to make changes
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        All transactions above {formatCurrency(threshold)} will require {userB?.name}'s approval
                      </Typography>
                    </li>
                  </Box>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  backgroundColor: alpha('#FF9800', 0.1),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#FF9800', 0.3)}`
                }}>
                  <Typography variant="body2" sx={{ color: '#F57C00' }}>
                    ⚠️ <strong>Make sure you have your seed phrase safely stored!</strong> You'll need it to unlock these settings in the future.
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Transaction Flow Preview */}
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  How Multi-Signature Works
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: alpha('#4CAF50', 0.1),
                    border: `1px solid ${alpha('#4CAF50', 0.3)}`,
                    flex: 1,
                    minWidth: 200
                  }}>
                    <Typography variant="body2" fontWeight={600} color="#2E7D32">
                      Transactions ≤ {formatCurrency(threshold)}
                    </Typography>
                    <Typography variant="body2">
                      ✅ Proceed automatically (no approval needed)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: alpha('#2196F3', 0.1),
                    border: `1px solid ${alpha('#2196F3', 0.3)}`,
                    flex: 1,
                    minWidth: 200
                  }}>
                    <Typography variant="body2" fontWeight={600} color="#1976D2">
                      Transactions {'>'}  {formatCurrency(threshold)}
                    </Typography>
                    <Typography variant="body2">
                      🔒 Requires approval from {userB?.name}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setShowReviewDialog(false)}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={() => setShowReviewDialog(false)}>
            Go Back to Edit
          </Button>
          <Button 
            variant="contained" 
            onClick={handleFinalConfirm} 
            color="primary"
            sx={{ ml: 1 }}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Confirm & Lock Settings'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const PaymentContent = () => {
  const [defaultPayment, setDefaultPayment] = useState('credit');
  const [autoPayment, setAutoPayment] = useState(false);
  const [savedCards, setSavedCards] = useState([
    { id: 1, type: 'visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'mastercard', last4: '8888', expiry: '03/26', isDefault: false },
  ]);
  const [receiptEmails, setReceiptEmails] = useState(true);
  const [paymentLimits, setPaymentLimits] = useState({
    daily: 5000,
    monthly: 50000,
  });
  const [transactionFees, setTransactionFees] = useState('standard');

  const paymentMethods = [
    { value: 'credit', label: 'Credit Card', icon: <CreditCardIcon /> },
    { value: 'debit', label: 'Debit Card', icon: <CreditCardIcon /> },
    { value: 'bank', label: 'Bank Transfer', icon: <AccountBalanceIcon /> },
    { value: 'paypal', label: 'PayPal', icon: <AccountCircleIcon /> },
  ];

  const handleSetDefault = (cardId: number) => {
    setSavedCards(cards => 
      cards.map(card => ({ ...card, isDefault: card.id === cardId }))
    );
  };

  const handleRemoveCard = (cardId: number) => {
    setSavedCards(cards => cards.filter(card => card.id !== cardId));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Payment Settings
      </Typography>
      
      <Grid container spacing={4}>
        {/* Payment Limits */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Payment Limits
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Daily Limit: ${paymentLimits.daily.toLocaleString()}
              </Typography>
              <Slider
                value={paymentLimits.daily}
                onChange={(_, value) => setPaymentLimits(prev => ({ ...prev, daily: value as number }))}
                min={1000}
                max={10000}
                step={500}
                marks={[
                  { value: 1000, label: '$1K' },
                  { value: 5000, label: '$5K' },
                  { value: 10000, label: '$10K' },
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value.toLocaleString()}`}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Monthly Limit: ${paymentLimits.monthly.toLocaleString()}
              </Typography>
              <Slider
                value={paymentLimits.monthly}
                onChange={(_, value) => setPaymentLimits(prev => ({ ...prev, monthly: value as number }))}
                min={10000}
                max={100000}
                step={5000}
                marks={[
                  { value: 10000, label: '$10K' },
                  { value: 50000, label: '$50K' },
                  { value: 100000, label: '$100K' },
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value.toLocaleString()}`}
              />
            </Box>
            
            <Box>
              <Typography variant="body1" gutterBottom>
                Transaction Fees
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={transactionFees}
                  onChange={(e) => setTransactionFees(e.target.value)}
                >
                  <MenuItem value="economy">Economy (2-3 days) - $0.50</MenuItem>
                  <MenuItem value="standard">Standard (1-2 days) - $1.00</MenuItem>
                  <MenuItem value="express">Express (Same day) - $2.50</MenuItem>
                  <MenuItem value="instant">Instant - $5.00</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Card>
        </Grid>

        {/* Saved Payment Methods */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Saved Payment Methods
                </Typography>
              </Box>
              <Button variant="outlined" size="small">
                Add New Card
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {savedCards.map((card) => (
                <Card key={card.id} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 1,
                        backgroundColor: card.type === 'visa' ? '#1A1F71' : '#EB001B'
                      }}>
                        <CreditCardIcon sx={{ fontSize: 16, color: 'white' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          •••• •••• •••• {card.last4}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expires {card.expiry}
                        </Typography>
                      </Box>
                    </Box>
                    {card.isDefault && (
                      <Chip label="Default" color="primary" size="small" />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!card.isDefault && (
                      <Button 
                        size="small" 
                        onClick={() => handleSetDefault(card.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => handleRemoveCard(card.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const SettingsContent = ({ activeSection }: { activeSection: string }) => {
  switch (activeSection) {
    case 'notifications':
      return <NotificationsContent />;
    case 'preferences':
      return <PreferencesContent />;
    case 'custom':
      return <CustomContent />;
    case 'security':
      return <SecurityContent />;
    case 'payment':
      return <PaymentContent />;
    default:
      return <PreferencesContent />;
  }
};

function MultiSignSettings() {
  const [activeSection, setActiveSection] = useState('preferences');
  const [mounted, setMounted] = useState(false);
  const theme = useMuiTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return null;
  }

  const handleSaveSettings = () => {
    // Handle save settings logic
    console.log('Settings saved!');
  };

  const handleBackToDashboard = () => {
    router
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: theme.palette.background.default,
      p: 3,
      pt: 10 
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header with Back Button */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your account preferences and security settings
                </Typography>
              </Box>
            </Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToDashboard}
              sx={{ 
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Compact Side Menu */}
          <Paper sx={{ 
            width: 240, 
            height: 'fit-content',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}>
            <List sx={{ p: 1 }}>
              {settingsSections.map((section) => (
                <ListItem key={section.id} disablePadding>
                  <ListItemButton
                    selected={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.15),
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 40,
                      color: activeSection === section.id ? theme.palette.primary.main : 'inherit' 
                    }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={section.label}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: activeSection === section.id ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Main Content Area */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ 
              p: 4,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              minHeight: 500,
            }}>
              <SettingsContent activeSection={activeSection} />
            </Paper>

            {/* Save Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 3 
            }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Save Settings
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MultiSignSettings;
