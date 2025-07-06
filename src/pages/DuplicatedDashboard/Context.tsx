'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Autocomplete,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Home,
  CreditCard,
  Send,
  Payment,
  PhoneIphone,
  ListAlt,
  Group,
  Star,
  Chat,
  Menu,
  Notifications,
  Person,
  Add,
  ArrowForwardIos,
  ArrowBackIos,
  TrendingUp,
  TrendingDown,
  Search,
  ChevronRight,
  Schedule,
  Autorenew,
  Repeat,
  RequestQuote,
  CallSplit,
  ExpandMore,
  BarChart,
  Logout,
  AddCircle,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Color palette
const COLORS = {
  bg: '#F8F6F6',
  fontMain: '#171635',
  btnIconMain: '#9C89B8',
  fontSub: '#FFA630',
  btnIcon2: '#4DA1A9',
  btnHoverMain: '#856DA9',
  btnHover2: '#41898F',
};

const sidebarItems = [
  {
    icon: <Home />,
    label: 'Transactions',
    active: true,
    hasDropdown: true,
  },
  { icon: <Payment />, label: 'Payments', hasDropdown: true },
  { icon: <Group />, label: 'Contacts' },
  { icon: <BarChart />, label: 'Insights' },
];

const transactionSubItems = [
  { icon: <ListAlt />, label: 'Transaction History' },
];

const paymentSubItems = [
  { icon: <Schedule />, label: 'Scheduled' },
  { icon: <Autorenew />, label: 'Direct Debits' },
  { icon: <Repeat />, label: 'Recurring card payments' },
  { icon: <RequestQuote />, label: 'Payment requests' },
  { icon: <CallSplit />, label: 'Bill splits' },
];

const currencyBalances = [
  {
    code: 'USD',
    name: 'US Dollar',
    balance: '$7,610.00',
    gradient: 'linear-gradient(135deg, #FFB347 0%, #FF6B6B 50%, #8B4CA6 100%)',
    upcoming: { amount: '$120', to: 'Netflix', date: '2025-06-10' },
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    balance: 'RM2,233.00',
    gradient: 'linear-gradient(135deg, #FFD93D 0%, #6BCF7F 100%)',
    upcoming: { amount: 'RM80', to: 'Astro', date: '2025-06-12' },
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    balance: '¥410.00',
    gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
    upcoming: { amount: '¥50', to: 'Tencent', date: '2025-06-15' },
  },
];

const transactions = [
  {
    id: '900000289',
    type: 'Receiving money',
    user: 'Bruno Hoffman',
    amount: '+$300',
    date: '2020-05-24',
    positive: true,
  },
  {
    id: '900000288',
    type: 'Receiving money',
    user: 'Vanessa Saldia',
    amount: '+$400',
    date: '2020-05-24',
    positive: true,
  },
  {
    id: '900000287',
    type: 'Receiving money',
    user: 'Chad Kenley',
    amount: '-$180',
    date: '2020-05-24',
    positive: false,
  },
  {
    id: '900000286',
    type: 'Receiving money',
    user: 'Manuel Rovira',
    amount: '+$260',
    date: '2020-04-20',
    positive: true,
  },
];

const currencies = ['USD', 'MYR', 'CNY'];
const exchangeData = [
  { date: '2025-06-01', rate: 4.7 },
  { date: '2025-06-02', rate: 4.8 },
  { date: '2025-06-03', rate: 4.75 },
  { date: '2025-06-04', rate: 4.78 },
  { date: '2025-06-05', rate: 4.72 },
];

const swapOptions = [
  {
    key: 'instant',
    label: 'Instant Swap (AMM Pool)',
    desc: 'Arrives Now',
    est: 'Instantly / Under 1 minute',
    method: 'AMM Pool (Instant)',
    rate: 4.712,
    fee: 0.5,
  },
  {
    key: 'batch',
    label: 'Wait for Batch Settlement',
    desc: 'Est. 15 mins',
    est: 'Est. 15 mins',
    method: 'Batch Settlement',
    rate: 4.72,
    fee: 0.3,
  },
  {
    key: 'smart',
    label: 'High Volume Smart Routing',
    desc: 'Est. 5 mins',
    est: 'Est. 5 mins',
    method: 'Smart Routing',
    rate: 4.715,
    fee: 0.4,
  },
];

const recipientCountries = [
  { code: 'MY', name: 'Malaysia', currency: 'MYR' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'EU', name: 'Eurozone', currency: 'EUR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' },
  { code: 'NO', name: 'Norway', currency: 'NOK' },
  { code: 'DK', name: 'Denmark', currency: 'DKK' },
  { code: 'TH', name: 'Thailand', currency: 'THB' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR' },
  { code: 'PH', name: 'Philippines', currency: 'PHP' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'TR', name: 'Turkey', currency: 'TRY' },
  { code: 'RU', name: 'Russia', currency: 'RUB' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'EG', name: 'Egypt', currency: 'EGP' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT' },
  { code: 'VN', name: 'Vietnam', currency: 'VND' },
  { code: 'AR', name: 'Argentina', currency: 'ARS' },
  { code: 'CO', name: 'Colombia', currency: 'COP' },
  { code: 'CL', name: 'Chile', currency: 'CLP' },
  { code: 'PE', name: 'Peru', currency: 'PEN' },
  { code: 'PL', name: 'Poland', currency: 'PLN' },
  { code: 'CZ', name: 'Czech Republic', currency: 'CZK' },
  { code: 'HU', name: 'Hungary', currency: 'HUF' },
  { code: 'IL', name: 'Israel', currency: 'ILS' },
  { code: 'QA', name: 'Qatar', currency: 'QAR' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD' },
  { code: 'OM', name: 'Oman', currency: 'OMR' },
  { code: 'BH', name: 'Bahrain', currency: 'BHD' },
  { code: 'UA', name: 'Ukraine', currency: 'UAH' },
  { code: 'RO', name: 'Romania', currency: 'RON' },
  { code: 'BG', name: 'Bulgaria', currency: 'BGN' },
  { code: 'HR', name: 'Croatia', currency: 'HRK' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
  { code: 'GH', name: 'Ghana', currency: 'GHS' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
  { code: 'UG', name: 'Uganda', currency: 'UGX' },
  { code: 'MA', name: 'Morocco', currency: 'MAD' },
  { code: 'DZ', name: 'Algeria', currency: 'DZD' },
  { code: 'TN', name: 'Tunisia', currency: 'TND' },
  { code: 'SD', name: 'Sudan', currency: 'SDG' },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB' },
  { code: 'SN', name: 'Senegal', currency: 'XOF' },
  { code: 'CM', name: 'Cameroon', currency: 'XAF' },
  { code: 'CI', name: 'Ivory Coast', currency: 'XOF' },
  { code: 'AO', name: 'Angola', currency: 'AOA' },
  { code: 'MZ', name: 'Mozambique', currency: 'MZN' },
  { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL' },
  { code: 'KZ', name: 'Kazakhstan', currency: 'KZT' },
  { code: 'UZ', name: 'Uzbekistan', currency: 'UZS' },
  { code: 'KH', name: 'Cambodia', currency: 'KHR' },
  { code: 'LA', name: 'Laos', currency: 'LAK' },
  { code: 'MM', name: 'Myanmar', currency: 'MMK' },
  { code: 'LK', name: 'Sri Lanka', currency: 'LKR' },
  { code: 'NP', name: 'Nepal', currency: 'NPR' },
  { code: 'BT', name: 'Bhutan', currency: 'BTN' },
  { code: 'MV', name: 'Maldives', currency: 'MVR' },
  { code: 'MN', name: 'Mongolia', currency: 'MNT' },
  { code: 'GE', name: 'Georgia', currency: 'GEL' },
  { code: 'AM', name: 'Armenia', currency: 'AMD' },
  { code: 'AZ', name: 'Azerbaijan', currency: 'AZN' },
  { code: 'BY', name: 'Belarus', currency: 'BYN' },
  { code: 'MD', name: 'Moldova', currency: 'MDL' },
  { code: 'RS', name: 'Serbia', currency: 'RSD' },
  { code: 'ME', name: 'Montenegro', currency: 'EUR' },
  { code: 'AL', name: 'Albania', currency: 'ALL' },
  { code: 'MK', name: 'North Macedonia', currency: 'MKD' },
  { code: 'BA', name: 'Bosnia and Herzegovina', currency: 'BAM' },
  { code: 'SI', name: 'Slovenia', currency: 'EUR' },
  { code: 'SK', name: 'Slovakia', currency: 'EUR' },
  { code: 'EE', name: 'Estonia', currency: 'EUR' },
  { code: 'LV', name: 'Latvia', currency: 'EUR' },
  { code: 'LT', name: 'Lithuania', currency: 'EUR' },
  { code: 'FI', name: 'Finland', currency: 'EUR' },
  { code: 'IE', name: 'Ireland', currency: 'EUR' },
  { code: 'PT', name: 'Portugal', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'GR', name: 'Greece', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'BE', name: 'Belgium', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'LU', name: 'Luxembourg', currency: 'EUR' },
  { code: 'AT', name: 'Austria', currency: 'EUR' },
  { code: 'MT', name: 'Malta', currency: 'EUR' },
  { code: 'CY', name: 'Cyprus', currency: 'EUR' },
];

const contacts = [
  { id: 'C001', name: 'Bruno Hoffman' },
  { id: 'C002', name: 'Vanessa Saldia' },
  { id: 'C003', name: 'Chad Kenley' },
  { id: 'C004', name: 'Manuel Rovira' },
  { id: 'C005', name: 'Alice Smith' },
  { id: 'C006', name: 'Bob Lee' },
  { id: 'C007', name: 'Cathy Brown' },
  { id: 'C008', name: 'David Kim' },
  { id: 'C009', name: 'Eva Green' },
  { id: 'C010', name: 'Frank White' },
];

function ExchangeRateChart() {
  const [base, setBase] = React.useState('USD');
  const [target, setTarget] = React.useState('MYR');

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Select
          value={base}
          onChange={(e) => setBase(e.target.value)}
          size="small"
        >
          {currencies.map((cur) => (
            <MenuItem key={cur} value={cur}>
              {cur}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body1" sx={{ alignSelf: 'center' }}>
          to
        </Typography>
        <Select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          size="small"
        >
          {currencies.map((cur) => (
            <MenuItem key={cur} value={cur}>
              {cur}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={exchangeData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="date" fontSize={10} />
          <YAxis fontSize={10} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

// Helper to calculate MYR amount for an option
function getConvertedAmount(
  option:
    | {
        key: string;
        label: string;
        desc: string;
        est: string;
        method: string;
        rate: number;
        fee: number;
      }
    | undefined,
  usdAmount: string
) {
  const amount = parseFloat(usdAmount || '0');
  if (!option || isNaN(amount)) return '0.00';
  const net = Math.max(amount - option.fee, 0);
  return (net * option.rate).toFixed(2);
}

export default function DuplicatedDashboardPage() {
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyBalances[0]);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payForm, setPayForm] = useState({
    amount: '',
    recipient: '',
    recipientCountry: '',
    note: '',
    reference: '',
  });
  const [payStep, setPayStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(swapOptions[0].key);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(0);
  const [withdrawForm, setWithdrawForm] = useState({
    type: '',
    amount: '',
    destination: '',
    currency: selectedCurrency.code,
  });
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestStep, setRequestStep] = useState(0);
  const [requestForm, setRequestForm] = useState({
    amount: '',
    recipient: '',
    recipientCountry: '',
    note: '',
    reference: '',
  });
  const router = useRouter();

  // Get current date in 'D MMM YYYY' format
  const currentDate = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [payDialogOpen]);

  const handleLogout = () => {
    router.push('/');
  };

  const handlePayOpen = () => {
    setPayDialogOpen(true);
    setPayStep(0);
  };
  const handlePayClose = () => setPayDialogOpen(false);
  const handlePayChange = (e: { target: { name: any; value: any } }) =>
    setPayForm({ ...payForm, [e.target.name]: e.target.value });
  const handlePayNext = () => setPayStep((s) => s + 1);
  const handlePayBack = () => setPayStep((s) => s - 1);
  const handlePaySubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Here you would handle the payment logic
    setPayDialogOpen(false);
    setPayForm({
      amount: '',
      recipient: '',
      recipientCountry: '',
      note: '',
      reference: '',
    });
    setPayStep(0);
  };

  const handleRequestOpen = () => {
    setRequestDialogOpen(true);
    setRequestStep(0);
  };
  const handleRequestClose = () => setRequestDialogOpen(false);
  const handleRequestChange = (e: { target: { name: any; value: any } }) =>
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  const handleRequestNext = () => setRequestStep((s) => s + 1);
  const handleRequestBack = () => setRequestStep((s) => s - 1);
  const handleRequestSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Here you would handle the request logic
    setRequestDialogOpen(false);
    setRequestForm({
      amount: '',
      recipient: '',
      recipientCountry: '',
      note: '',
      reference: '',
    });
    setRequestStep(0);
  };

  const paymentMethod = {
    name: 'Your balance',
    logo: '/Paylentine_logo.jpg',
    provider: 'PayLentine',
  };
  const scheduleDetails = {
    sending: currentDate,
    arrival: 'by Wednesday 09:00',
    repeats: 'Never',
  };

  const paySteps = ['Amount', 'Recipient', 'Option', 'Review & Pay'];
  const requestSteps = ['Amount', 'Recipient', 'Review & Request'];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: COLORS.bg }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 160,
          background: '#fff',
          m: 0,
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
          borderRadius: 0,
          borderRight: '1px solid #F0F0F0',
          minHeight: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <List sx={{ px: 0, pt: 0, mt: '80px' }}>
          {sidebarItems.map((item, idx) => (
            <React.Fragment key={item.label}>
              <ListItem
                component="button"
                onClick={item.label === 'Contacts' ? () => { window.location.href = '/ContactsDashboard'; } : item.hasDropdown ? () => {
                  if (item.label === 'Transactions') {
                    setTransactionsOpen((open) => !open);
                  } else if (item.label === 'Payments') {
                    setPaymentsOpen((open) => !open);
                  }
                } : undefined}
                sx={{
                  borderRadius: item.active ? 2 : 0,
                  background: item.active ? '#F3F5F2' : 'transparent',
                  mb: 2,
                  p: 0,
                  color: item.active ? COLORS.fontMain : '#6B6B6B',
                  fontWeight: item.active ? 700 : 500,
                  minHeight: 32,
                  px: 1.5,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: '#F3F5F2',
                    color: COLORS.fontMain,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 24,
                    color: item.active ? COLORS.fontMain : '#B0B0B0',
                    fontSize: 16,
                  }}
                >
                  {React.cloneElement(item.icon, { fontSize: 'small' })}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: item.active ? 700 : 500,
                    color: item.active ? COLORS.fontMain : '#6B6B6B',
                    fontSize: 12,
                  }}
                />
                {item.hasDropdown && (
                  <ExpandMore
                    sx={{
                      color: '#B0B0B0',
                      fontSize: 14,
                      ml: -0.5,
                      transform:
                        (item.label === 'Transactions' && transactionsOpen) ||
                        (item.label === 'Payments' && paymentsOpen)
                          ? 'rotate(180deg)'
                          : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                )}
              </ListItem>
              {item.hasDropdown &&
                item.label === 'Transactions' &&
                transactionsOpen && (
                  <List disablePadding>
                    {transactionSubItems.map((sub, subIdx) => (
                      <ListItem
                        key={sub.label}
                        component="button"
                        onClick={() => {
                          if (sub.label === 'Transaction History') {
                            window.location.href = '/transaction-history';
                          }
                        }}
                        sx={{
                          pl: 3.5,
                          pr: 1.5,
                          py: 0.25,
                          mb: 1.5,
                          minHeight: 26,
                          color: '#6B6B6B',
                          fontWeight: 500,
                          fontSize: 11,
                          borderRadius: 2,
                          background: 'transparent',
                          '&:hover': {
                            background: '#F3F5F2',
                            color: COLORS.fontMain,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{ minWidth: 20, color: '#B0B0B0', fontSize: 13 }}
                        >
                          {React.cloneElement(sub.icon, { fontSize: 'small' })}
                        </ListItemIcon>
                        <ListItemText
                          primary={sub.label}
                          primaryTypographyProps={{ fontSize: 11 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              {item.hasDropdown &&
                item.label === 'Payments' &&
                paymentsOpen && (
                  <List disablePadding>
                    {paymentSubItems.map((sub, subIdx) => (
                      <ListItem
                        key={sub.label}
                        component="button"
                        sx={{
                          pl: 3.5,
                          pr: 1.5,
                          py: 0.25,
                          mb: 1.5,
                          minHeight: 26,
                          color: '#6B6B6B',
                          fontWeight: 500,
                          fontSize: 11,
                          borderRadius: 2,
                          background: 'transparent',
                          '&:hover': {
                            background: '#F3F5F2',
                            color: COLORS.fontMain,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{ minWidth: 20, color: '#B0B0B0', fontSize: 13 }}
                        >
                          {React.cloneElement(sub.icon, { fontSize: 'small' })}
                        </ListItemIcon>
                        <ListItemText
                          primary={sub.label}
                          primaryTypographyProps={{ fontSize: 11 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
            </React.Fragment>
          ))}
        </List>
        <Box flexGrow={1} />
        <Button
          startIcon={<Logout fontSize="small" />}
          onClick={handleLogout}
          sx={{
            m: 2,
            mb: 3,
            color: '#B0B0B0',
            fontWeight: 600,
            fontSize: 13,
            justifyContent: 'flex-start',
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            py: 1,
            '&:hover': {
              background: '#F3F5F2',
              color: COLORS.fontMain,
            },
          }}
          fullWidth
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          ml: '160px',
          mt: '80px',
        }}
      >
        {/* Top Cards and Balance */}
        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
          {/* Wallet Cards */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center',
              minWidth: 220,
            }}
          >
            {currencyBalances.map((currency, idx) => (
              <Box
                key={currency.code}
                onClick={() => setSelectedCurrency(currency)}
                sx={{
                  width: 220,
                  minHeight: 70,
                  background: currency.gradient,
                  color: '#fff',
                  borderRadius: 1,
                  boxShadow: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: 2,
                  py: 1.5,
                  mb: 1,
                  cursor: 'pointer',
                  outline:
                    selectedCurrency.code === currency.code
                      ? '3px solid #171635'
                      : 'none',
                  opacity: selectedCurrency.code === currency.code ? 1 : 0.7,
                  transition: 'outline 0.2s, opacity 0.2s',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, fontWeight: 500, fontSize: 13 }}
                >
                  {currency.code}{' '}
                  <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.8 }}>
                    ({currency.name})
                  </span>
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ my: 0.5, fontSize: 20 }}
                >
                  {currency.balance}
                </Typography>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<Add />}
              sx={{
                mt: 1.5,
                color: COLORS.btnIconMain,
                borderColor: COLORS.btnIconMain,
                fontWeight: 700,
                fontSize: 15,
                px: 2,
                py: 1,
                minWidth: 220,
                background: '#fff',
                '&:hover': {
                  background: COLORS.bg,
                  borderColor: COLORS.btnHoverMain,
                  color: COLORS.btnHoverMain,
                },
              }}
            >
              Add Currency
            </Button>
          </Box>

          {/* Balance and Chart */}
          <Box
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Total Balance */}
              <Card
                sx={{
                  flex: 1,
                  borderRadius: 4,
                  p: 3,
                  minWidth: 280,
                  background: '#fff',
                  color: COLORS.fontMain,
                }}
              >
                <Typography variant="body2" color={COLORS.btnIconMain}>
                  Total balance
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ my: 1, color: COLORS.fontMain }}
                >
                  {selectedCurrency.balance}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.btnIconMain }}
                  >
                    ▲ $4,220.13
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.btnIcon2 }}>
                    ▲ $998.60
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handlePayOpen}
                    sx={{ boxShadow: 3, minWidth: 115, px: 4 }}
                  >
                    Pay
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setWithdrawDialogOpen(true);
                      setWithdrawStep(0);
                    }}
                    sx={{ ml: 0 }}
                  >
                    Withdraw
                  </Button>
                </Box>
                {/* Quick Actions */}
                <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 1 }}>
                  <Button
                    startIcon={<RequestQuote />}
                    size="small"
                    onClick={handleRequestOpen}
                    sx={{
                      color: COLORS.btnIcon2,
                      borderColor: COLORS.btnIcon2,
                      borderRadius: 2,
                      fontWeight: 500,
                      textTransform: 'none',
                      border: '1px solid',
                      px: 2,
                      py: 0.5,
                      minWidth: 0,
                    }}
                  >
                    Request
                  </Button>
                  <Button
                    startIcon={<AddCircle />}
                    size="small"
                    sx={{
                      color: COLORS.fontSub,
                      borderColor: COLORS.fontSub,
                      borderRadius: 2,
                      fontWeight: 500,
                      textTransform: 'none',
                      border: '1px solid',
                      px: 2,
                      py: 0.5,
                      minWidth: 0,
                    }}
                    onClick={() => router.push('/topup')}
                  >
                    Top Up
                  </Button>
                </Box>
                {/* Upcoming Scheduled Payment */}
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    background: COLORS.bg,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: COLORS.fontMain,
                      fontSize: 13,
                    }}
                  >
                    Upcoming Payment:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: COLORS.fontSub,
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {selectedCurrency.upcoming.amount}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: COLORS.fontMain, fontSize: 13 }}
                  >
                    to {selectedCurrency.upcoming.to} on{' '}
                    {selectedCurrency.upcoming.date}
                  </Typography>
                </Box>
              </Card>
              {/* Chart Placeholder */}
              <Card
                sx={{
                  flex: 1,
                  borderRadius: 4,
                  p: 3,
                  minWidth: 280,
                  minHeight: 300,
                  background: '#fff',
                }}
              >
                <ExchangeRateChart />
              </Card>
            </Box>

            {/* Transaction History Table */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: COLORS.fontMain }}
              >
                Transaction History
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => router.push('/transaction-history')}
                startIcon={<RequestQuote />}
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  color: '#fff',
                  background: COLORS.btnIconMain,
                  textTransform: 'none',
                  px: 2,
                  py: 0.5,
                  minWidth: 0,
                  height: 36,
                  boxShadow: 1,
                  '&:hover': {
                    background: COLORS.btnHoverMain,
                    color: '#fff',
                  },
                }}
              >
                View All
              </Button>
            </Box>
            <Card
              sx={{
                borderRadius: 3,
                px: 2,
                py: 1.5,
                background: '#fff',
                mt: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Box />
                <TextField
                  size="small"
                  placeholder="Search"
                  sx={{ width: 200 }}
                  InputProps={{
                    startAdornment: <Search sx={{ fontSize: 16 }} />,
                    sx: {
                      fontSize: 12,
                      borderRadius: 2,
                      background: COLORS.bg,
                      height: 36,
                    },
                  }}
                />
              </Box>
              <TableContainer
                component={Paper}
                sx={{ boxShadow: 'none', background: 'none' }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {[
                        'N°',
                        'ID',
                        'Transfer Type',
                        'User',
                        'Amount',
                        'Date',
                      ].map((label) => (
                        <TableCell
                          key={label}
                          align="center"
                          sx={{ fontSize: 12, fontWeight: 600 }}
                        >
                          {label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx, idx) => (
                      <TableRow
                        key={tx.id}
                        onClick={() => router.push('/transaction-history')}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { background: '#f3eaff' },
                        }}
                      >
                        <TableCell align="center" sx={{ fontSize: 11 }}>
                          {idx + 1}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: 11 }}>
                          {tx.id}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: 11 }}>
                          {tx.type}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: 11 }}>
                          {tx.user}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: 11,
                            color: tx.positive
                              ? COLORS.btnIcon2
                              : COLORS.fontSub,
                          }}
                        >
                          {tx.amount}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: 11 }}>
                          {tx.date}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Pagination count={3} page={1} size="small" />
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Payment Dialog */}
      <Dialog
        open={payDialogOpen}
        onClose={handlePayClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: COLORS.fontMain, fontWeight: 700 }}>
          Send Payment ({selectedCurrency.code})
        </DialogTitle>
        <Stepper
          activeStep={payStep}
          alternativeLabel
          sx={{ mb: 2, background: 'transparent', color: COLORS.btnIconMain }}
        >
          {paySteps.map((label, idx) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    color: COLORS.fontMain,
                    fontWeight: 600,
                  },
                  '& .MuiStepIcon-root': {
                    color: COLORS.btnIconMain + ' !important',
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handlePaySubmit}>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {payStep === 0 && (
              <TextField
                label="Amount"
                name="amount"
                value={payForm.amount}
                onChange={handlePayChange}
                fullWidth
                required
                InputProps={{ startAdornment: selectedCurrency.code }}
              />
            )}
            {payStep === 1 && (
              <>
                <Autocomplete
                  freeSolo
                  options={contacts.map((c) => ({ label: `${c.name} (${c.id})`, id: c.id, name: c.name }))}
                  value={payForm.recipient}
                  onChange={(_, newValue) => {
                    if (typeof newValue === 'string') {
                      setPayForm({ ...payForm, recipient: newValue });
                    } else if (newValue && newValue.id) {
                      setPayForm({ ...payForm, recipient: newValue.id });
                    } else {
                      setPayForm({ ...payForm, recipient: '' });
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    setPayForm({ ...payForm, recipient: newInputValue });
                  }}
                  renderOption={(props, option) => {
                    // Destructure key and other props to avoid React warning
                    const { key, ...otherProps } = props;
                    return (
                      <li 
                        key={key} 
                        {...otherProps} 
                        style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                      >
                        <span style={{ textAlign: 'left', flex: 1 }}>{option.name}</span>
                        <span style={{ textAlign: 'right', minWidth: 60, color: '#888' }}>{option.id}</span>
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Recipient (select from contacts or enter ID)"
                      name="recipient"
                      required
                      fullWidth
                    />
                  )}
                />
                <TextField
                  select
                  label="Recipient Country"
                  name="recipientCountry"
                  value={payForm.recipientCountry}
                  onChange={handlePayChange}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                >
                  {recipientCountries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name} ({country.currency})
                    </MenuItem>
                  ))}
                </TextField>
                {payForm.recipientCountry && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ color: COLORS.btnIcon2 }}>
                      Recipient will receive in{' '}
                      <b>
                        {
                          recipientCountries.find(
                            (c) => c.code === payForm.recipientCountry
                          )?.currency
                        }
                      </b>
                    </Typography>
                  </Box>
                )}
                <TextField
                  label="Note"
                  name="note"
                  value={payForm.note}
                  onChange={handlePayChange}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{ mt: 2 }}
                />
              </>
            )}
            {payStep === 2 && (
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ color: COLORS.fontMain, fontWeight: 600, mb: 1 }}
                >
                  Select Swap Option
                </FormLabel>
                <RadioGroup
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  {swapOptions.map((opt) => (
                    <FormControlLabel
                      key={opt.key}
                      value={opt.key}
                      control={
                        <Radio
                          sx={{
                            color: COLORS.btnIconMain,
                            '&.Mui-checked': { color: COLORS.btnIconMain },
                          }}
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 600, color: COLORS.fontMain }}
                          >
                            {opt.label}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 13, color: COLORS.btnIcon2 }}
                          >
                            {opt.desc} →{' '}
                            <b>
                              {
                                recipientCountries.find(
                                  (c) => c.code === payForm.recipientCountry
                                )?.currency
                              }{' '}
                              {getConvertedAmount(opt, payForm.amount)}
                            </b>
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 1, alignItems: 'flex-start' }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
            {payStep === 3 && (
              <Box sx={{ p: 1, background: COLORS.bg, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: COLORS.fontMain,
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'center',
                  }}
                >
                  Review & Pay
                </Typography>
                <Box
                  sx={{
                    background: '#fff',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 1,
                  }}
                >
                  {/* Transaction Summary */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: COLORS.fontMain, fontWeight: 700, mb: 1 }}
                    >
                      Transaction Summary
                    </Typography>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">You Send:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {selectedCurrency.code} {payForm.amount}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Receiver Gets:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {
                          recipientCountries.find(
                            (c) => c.code === payForm.recipientCountry
                          )?.currency
                        }{' '}
                        {getConvertedAmount(
                          swapOptions.find((opt) => opt.key === selectedOption),
                          payForm.amount
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Exchange Rate:</Typography>
                      <Typography variant="body2">
                        1 {selectedCurrency.code} ={' '}
                        {
                          swapOptions.find((opt) => opt.key === selectedOption)
                            ?.rate
                        }{' '}
                        {
                          recipientCountries.find(
                            (c) => c.code === payForm.recipientCountry
                          )?.currency
                        }
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Fees:</Typography>
                      <Typography variant="body2">
                        {selectedCurrency.code}{' '}
                        {
                          swapOptions.find((opt) => opt.key === selectedOption)
                            ?.fee
                        }{' '}
                        (FX + platform)
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Method:</Typography>
                      <Typography variant="body2">
                        {
                          swapOptions.find((opt) => opt.key === selectedOption)
                            ?.method
                        }
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Arrival Time:</Typography>
                      <Typography variant="body2">
                        {
                          swapOptions.find((opt) => opt.key === selectedOption)
                            ?.est
                        }
                      </Typography>
                    </Box>
                  </Box>
                  {/* Payment method */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src={paymentMethod.logo}
                        alt="logo"
                        style={{ width: 32, height: 32, borderRadius: 6 }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: COLORS.fontMain }}
                      >
                        {paymentMethod.name}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      sx={{
                        color: COLORS.btnIcon2,
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                      onClick={() => setPayStep(0)}
                    >
                      Change
                    </Button>
                  </Box>
                  {/* Swap Option summary */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: COLORS.fontMain, fontWeight: 700 }}
                    >
                      Selected Option
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: COLORS.btnIconMain, fontWeight: 600 }}
                    >
                      {(() => {
                        const opt = swapOptions.find(
                          (opt) => opt.key === selectedOption
                        );
                        const currency = recipientCountries.find(
                          (c) => c.code === payForm.recipientCountry
                        )?.currency;
                        return `${opt?.label} (${
                          opt?.desc
                        } → ${currency} ${getConvertedAmount(
                          opt,
                          payForm.amount
                        )})`;
                      })()}
                    </Typography>
                  </Box>
                  {/* Transfer details */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: COLORS.fontMain, fontWeight: 700 }}
                      >
                        Transfer details
                      </Typography>
                      <Button
                        size="small"
                        sx={{
                          color: COLORS.btnIconMain,
                          fontWeight: 600,
                          textTransform: 'none',
                        }}
                        onClick={() => setPayStep(0)}
                      >
                        Edit
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2">You send exactly</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {payForm.amount} {selectedCurrency.code}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">
                        Total fees (included)
                      </Typography>
                      <Typography variant="body2">
                        {
                          swapOptions.find((opt) => opt.key === selectedOption)
                            ?.fee
                        }{' '}
                        {selectedCurrency.code}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">
                        Total amount we'll send
                      </Typography>
                      <Typography variant="body2">
                        {payForm.amount} {selectedCurrency.code}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">
                        {payForm.recipient} gets exactly
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {
                          recipientCountries.find(
                            (c) => c.code === payForm.recipientCountry
                          )?.currency
                        }{' '}
                        {getConvertedAmount(
                          swapOptions.find((opt) => opt.key === selectedOption),
                          payForm.amount
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Recipient details */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: COLORS.fontMain, fontWeight: 700 }}
                      >
                        Recipient details
                      </Typography>
                      <Button
                        size="small"
                        sx={{
                          color: COLORS.btnIcon2,
                          fontWeight: 600,
                          textTransform: 'none',
                        }}
                        onClick={() => setPayStep(1)}
                      >
                        Change
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2">
                        Account holder name
                      </Typography>
                      <Typography variant="body2">
                        {payForm.recipient}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Account provider</Typography>
                      <Typography variant="body2">PayLentine</Typography>
                    </Box>
                  </Box>
                  {/* Schedule details */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: COLORS.fontMain, fontWeight: 700 }}
                      >
                        Schedule details
                      </Typography>
                      <Button
                        size="small"
                        sx={{
                          color: COLORS.btnIconMain,
                          fontWeight: 600,
                          textTransform: 'none',
                        }}
                        onClick={() => setPayStep(0)}
                      >
                        Edit
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2">Sending</Typography>
                      <Typography variant="body2">
                        {scheduleDetails.sending}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Should arrive</Typography>
                      <Typography variant="body2">
                        {scheduleDetails.arrival}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Repeats</Typography>
                      <Typography variant="body2">
                        {scheduleDetails.repeats}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Reference field */}
                  <TextField
                    label={`Reference for ${
                      payForm.recipient || 'recipient'
                    } (optional)`}
                    name="reference"
                    value={payForm.reference}
                    onChange={handlePayChange}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            {payStep > 0 && payStep < 3 && (
              <Button onClick={handlePayBack} sx={{ color: COLORS.fontMain }}>
                Back
              </Button>
            )}
            {payStep < 3 && (
              <Button
                onClick={handlePayNext}
                variant="contained"
                sx={{
                  background: COLORS.btnIconMain,
                  color: '#fff',
                  fontWeight: 600,
                }}
                disabled={
                  payStep === 0
                    ? !payForm.amount
                    : payStep === 1
                    ? !(payForm.recipient && payForm.recipientCountry)
                    : !selectedOption
                }
              >
                Next
              </Button>
            )}
            {payStep === 3 && (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: COLORS.fontMain,
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                Send Payment
              </Button>
            )}
            <Button onClick={handlePayClose} sx={{ color: COLORS.fontSub }}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog
        open={withdrawDialogOpen}
        onClose={() => setWithdrawDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: COLORS.fontMain, fontWeight: 700 }}>
          Withdraw Funds ({selectedCurrency.code})
        </DialogTitle>
        <Stepper
          activeStep={withdrawStep}
          alternativeLabel
          sx={{ mb: 2, background: 'transparent', color: COLORS.btnIconMain }}
        >
          {["Withdraw", "Review & Confirm"].map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    color: COLORS.fontMain,
                    fontWeight: 600,
                  },
                  '& .MuiStepIcon-root': {
                    color: COLORS.btnIconMain + ' !important',
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={e => { e.preventDefault(); setWithdrawStep(1); }}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {withdrawStep === 0 && (
              <>
                <RadioGroup
                  value={withdrawForm.type}
                  onChange={e => setWithdrawForm({ ...withdrawForm, type: e.target.value })}
                >
                  <FormControlLabel value="ewallet" control={<Radio />} label="Withdraw to E-Wallet" />
                  <FormControlLabel value="bank" control={<Radio />} label="Withdraw to Bank" />
                  <FormControlLabel value="currency" control={<Radio />} label="Withdraw to Other Currency Balance" />
                </RadioGroup>
                <TextField
                  label="Amount"
                  name="amount"
                  value={withdrawForm.amount}
                  onChange={e => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  fullWidth
                  required
                  InputProps={{ startAdornment: selectedCurrency.code }}
                />
                {(withdrawForm.type === 'ewallet' || withdrawForm.type === 'bank') && (
                  <TextField
                    label={withdrawForm.type === 'ewallet' ? 'E-Wallet Account' : 'Bank Account'}
                    name="destination"
                    value={withdrawForm.destination}
                    onChange={e => setWithdrawForm({ ...withdrawForm, destination: e.target.value })}
                    fullWidth
                    required
                  />
                )}
                {withdrawForm.type === 'currency' && (
                  <TextField
                    select
                    label="Target Currency"
                    name="currency"
                    value={withdrawForm.currency}
                    onChange={e => setWithdrawForm({ ...withdrawForm, currency: e.target.value })}
                    fullWidth
                    required
                  >
                    {currencies.map(cur => (
                      <MenuItem key={cur} value={cur}>{cur}</MenuItem>
                    ))}
                  </TextField>
                )}
              </>
            )}
            {withdrawStep === 1 && (
              <Box sx={{ p: 1, background: COLORS.bg, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: COLORS.fontMain, fontWeight: 700, mb: 2, textAlign: 'center' }}>
                  Review & Confirm
                </Typography>
                <Box sx={{ background: '#fff', borderRadius: 2, p: 2, boxShadow: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: COLORS.fontMain, fontWeight: 700, mb: 1 }}>
                    Withdrawal Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Type:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {withdrawForm.type === 'ewallet' ? 'E-Wallet' : withdrawForm.type === 'bank' ? 'Bank' : 'Other Currency Balance'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Amount:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {selectedCurrency.code} {withdrawForm.amount}
                    </Typography>
                  </Box>
                  {(withdrawForm.type === 'ewallet' || withdrawForm.type === 'bank') && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Destination:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {withdrawForm.destination}
                      </Typography>
                    </Box>
                  )}
                  {withdrawForm.type === 'currency' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Target Currency:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {withdrawForm.currency}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            {withdrawStep === 1 ? (
              <>
                <Button onClick={() => setWithdrawStep(0)}>Back</Button>
                <Button variant="contained" onClick={() => setWithdrawDialogOpen(false)}>
                  Confirm
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setWithdrawDialogOpen(false)}>Cancel</Button>
                <Button variant="contained" type="submit">
                  Next
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>

      {/* Request Dialog */}
      <Dialog
        open={requestDialogOpen}
        onClose={handleRequestClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: COLORS.fontMain, fontWeight: 700 }}>
          Request Payment ({selectedCurrency.code})
        </DialogTitle>
        <Stepper
          activeStep={requestStep}
          alternativeLabel
          sx={{ mb: 2, background: 'transparent', color: COLORS.btnIconMain }}
        >
          {requestSteps.map((label, idx) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    color: COLORS.fontMain,
                    fontWeight: 600,
                  },
                  '& .MuiStepIcon-root': {
                    color: COLORS.btnIconMain + ' !important',
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleRequestSubmit}>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {requestStep === 0 && (
              <TextField
                label="Amount to Request"
                name="amount"
                value={requestForm.amount}
                onChange={handleRequestChange}
                fullWidth
                required
                InputProps={{ startAdornment: selectedCurrency.code }}
              />
            )}
            {requestStep === 1 && (
              <>
                <Autocomplete
                  freeSolo
                  options={contacts.map((c) => ({ label: `${c.name} (${c.id})`, id: c.id, name: c.name }))}
                  value={requestForm.recipient}
                  onChange={(_, newValue) => {
                    if (typeof newValue === 'string') {
                      setRequestForm({ ...requestForm, recipient: newValue });
                    } else if (newValue && newValue.id) {
                      setRequestForm({ ...requestForm, recipient: newValue.id });
                    } else {
                      setRequestForm({ ...requestForm, recipient: '' });
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    setRequestForm({ ...requestForm, recipient: newInputValue });
                  }}
                  renderOption={(props, option) => {
                    // Destructure key and other props to avoid React warning
                    const { key, ...otherProps } = props;
                    return (
                      <li 
                        key={key} 
                        {...otherProps} 
                        style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                      >
                        <span style={{ textAlign: 'left', flex: 1 }}>{option.name}</span>
                        <span style={{ textAlign: 'right', minWidth: 60, color: '#888' }}>{option.id}</span>
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Recipient (select from contacts or enter ID)"
                      name="recipient"
                      required
                      fullWidth
                    />
                  )}
                />
                <TextField
                  select
                  label="Recipient Country"
                  name="recipientCountry"
                  value={requestForm.recipientCountry}
                  onChange={handleRequestChange}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                >
                  {recipientCountries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name} ({country.currency})
                    </MenuItem>
                  ))}
                </TextField>
                {requestForm.recipientCountry && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ color: COLORS.btnIcon2 }}>
                      Recipient will pay in{' '}
                      <b>
                        {
                          recipientCountries.find(
                            (c) => c.code === requestForm.recipientCountry
                          )?.currency
                        }
                      </b>
                    </Typography>
                  </Box>
                )}
                <TextField
                  label="Note"
                  name="note"
                  value={requestForm.note}
                  onChange={handleRequestChange}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{ mt: 2 }}
                  placeholder="What is this payment request for?"
                />
              </>
            )}
            {requestStep === 2 && (
              <Box sx={{ p: 1, background: COLORS.bg, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: COLORS.fontMain,
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'center',
                  }}
                >
                  Review & Request
                </Typography>
                <Box
                  sx={{
                    background: '#fff',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 1,
                  }}
                >
                  {/* Request Summary */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: COLORS.fontMain, fontWeight: 700, mb: 1 }}
                    >
                      Request Summary
                    </Typography>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">You're requesting:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {selectedCurrency.code} {requestForm.amount}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">From:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {requestForm.recipient}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Recipient's currency:</Typography>
                      <Typography variant="body2">
                        {
                          recipientCountries.find(
                            (c) => c.code === requestForm.recipientCountry
                          )?.currency
                        }
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Note:</Typography>
                      <Typography variant="body2">
                        {requestForm.note || 'No note provided'}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Request details */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: COLORS.fontMain, fontWeight: 700 }}
                      >
                        Request details
                      </Typography>
                      <Button
                        size="small"
                        sx={{
                          color: COLORS.btnIconMain,
                          fontWeight: 600,
                          textTransform: 'none',
                        }}
                        onClick={() => setRequestStep(0)}
                      >
                        Edit
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2">You're requesting exactly</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {requestForm.amount} {selectedCurrency.code}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">
                        {requestForm.recipient} will receive a payment request
                      </Typography>
                      <Typography variant="body2">
                        via PayLentine
                      </Typography>
                    </Box>
                  </Box>
                  {/* Recipient details */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: COLORS.fontMain, fontWeight: 700 }}
                      >
                        Recipient details
                      </Typography>
                      <Button
                        size="small"
                        sx={{
                          color: COLORS.btnIcon2,
                          fontWeight: 600,
                          textTransform: 'none',
                        }}
                        onClick={() => setRequestStep(1)}
                      >
                        Change
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2">
                        Account holder name
                      </Typography>
                      <Typography variant="body2">
                        {requestForm.recipient}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Account provider</Typography>
                      <Typography variant="body2">PayLentine</Typography>
                    </Box>
                  </Box>
                  {/* Reference field */}
                  <TextField
                    label={`Reference for ${
                      requestForm.recipient || 'recipient'
                    } (optional)`}
                    name="reference"
                    value={requestForm.reference}
                    onChange={handleRequestChange}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            {requestStep > 0 && requestStep < 2 && (
              <Button onClick={handleRequestBack} sx={{ color: COLORS.fontMain }}>
                Back
              </Button>
            )}
            {requestStep < 2 && (
              <Button
                onClick={handleRequestNext}
                variant="contained"
                sx={{
                  background: COLORS.btnIconMain,
                  color: '#fff',
                  fontWeight: 600,
                }}
                disabled={
                  requestStep === 0
                    ? !requestForm.amount
                    : !(requestForm.recipient && requestForm.recipientCountry)
                }
              >
                Next
              </Button>
            )}
            {requestStep === 2 && (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: COLORS.fontMain,
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                Send Request
              </Button>
            )}
            <Button onClick={handleRequestClose} sx={{ color: COLORS.fontSub }}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}