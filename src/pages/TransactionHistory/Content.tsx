import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Pagination,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  AccountBalanceWallet,
  Home,
  Payment,
  Group,
  BarChart,
  ExpandMore,
  Logout,
  ListAlt,
  Schedule,
  Autorenew,
  Repeat,
  RequestQuote,
  CallSplit,
  Menu,
  Close,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

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

// Simulate more transaction data for pagination (40+ rows)
const baseUsers = [
  { user: 'Bruno Hoffman', positive: true },
  { user: 'Vanessa Saldia', positive: true },
  { user: 'Chad Kenley', positive: false },
  { user: 'Manuel Rovira', positive: true },
  { user: 'Alice Smith', positive: true },
  { user: 'Bob Lee', positive: false },
  { user: 'Cathy Brown', positive: true },
  { user: 'David Kim', positive: false },
  { user: 'Eva Green', positive: true },
  { user: 'Frank White', positive: true },
];
const types = ['Receiving money', 'Payment', 'Refund', 'Top Up'];
const amounts = [
  '+$300',
  '+$400',
  '-$180',
  '+$260',
  '+$500',
  '-$120',
  '+$700',
  '-$90',
  '+$1000',
  '-$50',
];
const dates = [
  '2020-05-24',
  '2020-05-25',
  '2020-05-26',
  '2020-05-27',
  '2020-05-28',
  '2020-05-29',
  '2020-05-30',
  '2020-05-31',
  '2020-06-01',
  '2020-06-02',
];

const transactions = Array.from({ length: 40 }).map((_, i) => {
  const userIdx = i % baseUsers.length;
  return {
    id: String(900000289 - i),
    type: types[i % types.length],
    user: baseUsers[userIdx].user,
    amount: amounts[i % amounts.length],
    date: dates[i % dates.length],
    positive: baseUsers[userIdx].positive,
  };
});

const typeOptions = [
  { value: '', label: 'All Types' },
  ...types.map((t) => ({ value: t, label: t })),
];

const ROWS_PER_PAGE = 10;

const gridTemplate = '60px 200px 300px 1fr 180px 180px';

const Content = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [transactionsOpen, setTransactionsOpen] = useState(false);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.user.toLowerCase().includes(search.toLowerCase()) ||
        tx.id.includes(search) ||
        tx.type.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter ? tx.type === typeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  // Pagination
  const pageCount = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  // Download CSV stub
  const handleDownload = () => {
    // In a real app, generate and download CSV here
    alert('Download CSV feature coming soon!');
  };

  const handlePageChange = (_: any, value: number) => setPage(value);

  const handleLogout = () => {
    router.push('/');
  };

  const handleMobileMenuToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: COLORS.bg }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleMobileMenuToggle}
          sx={{
            position: 'fixed',
            top: 90,
            left: 16,
            zIndex: 1300,
            background: '#fff',
            boxShadow: 2,
            '&:hover': {
              background: '#f5f5f5',
            },
          }}
        >
          <Menu />
        </IconButton>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
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
                  onClick={
                    item.label === 'Contacts'
                      ? () => {
                          window.location.href = '/ContactsDashboard';
                        }
                      : item.hasDropdown
                      ? () => {
                          if (item.label === 'Transactions') {
                            setTransactionsOpen((open) => !open);
                          } else if (item.label === 'Payments') {
                            setPaymentsOpen((open) => !open);
                          }
                        }
                      : undefined
                  }
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
                              // Already on transaction history page
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
                            background: '#F3F5F2',
                            '&:hover': {
                              background: '#F3F5F2',
                              color: COLORS.fontMain,
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 20,
                              color: '#B0B0B0',
                              fontSize: 13,
                            }}
                          >
                            {React.cloneElement(sub.icon, {
                              fontSize: 'small',
                            })}
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
                            sx={{
                              minWidth: 20,
                              color: '#B0B0B0',
                              fontSize: 13,
                            }}
                          >
                            {React.cloneElement(sub.icon, {
                              fontSize: 'small',
                            })}
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
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={handleMobileMenuToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              backgroundColor: '#fff',
            },
          }}
        >
          <Box
            sx={{
              mt: 2,
              mb: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              px: 1,
            }}
          >
            <IconButton onClick={handleMobileMenuToggle}>
              <Close />
            </IconButton>
          </Box>
          <List sx={{ px: 0, pt: 0 }}>
            {sidebarItems.map((item, idx) => (
              <React.Fragment key={item.label}>
                <ListItem
                  component="button"
                  onClick={
                    item.label === 'Contacts'
                      ? () => {
                          window.location.href = '/ContactsDashboard';
                          setMobileDrawerOpen(false);
                        }
                      : item.hasDropdown
                      ? () => {
                          if (item.label === 'Transactions') {
                            setTransactionsOpen((open) => !open);
                          } else if (item.label === 'Payments') {
                            setPaymentsOpen((open) => !open);
                          }
                        }
                      : undefined
                  }
                  sx={{
                    borderRadius: item.active ? 2 : 0,
                    background: item.active ? '#F3F5F2' : 'transparent',
                    mb: 2,
                    mx: 1,
                    p: 0,
                    color: item.active ? COLORS.fontMain : '#6B6B6B',
                    fontWeight: item.active ? 700 : 500,
                    minHeight: 40,
                    px: 2,
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
                      minWidth: 30,
                      color: item.active ? COLORS.fontMain : '#B0B0B0',
                      fontSize: 18,
                    }}
                  >
                    {React.cloneElement(item.icon, { fontSize: 'medium' })}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: item.active ? 700 : 500,
                      color: item.active ? COLORS.fontMain : '#6B6B6B',
                      fontSize: 14,
                    }}
                  />
                  {item.hasDropdown && (
                    <ExpandMore
                      sx={{
                        color: '#B0B0B0',
                        fontSize: 16,
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
                              // Already on transaction history page
                            }
                            setMobileDrawerOpen(false);
                          }}
                          sx={{
                            pl: 4,
                            pr: 2,
                            py: 1,
                            mx: 1,
                            mb: 1,
                            minHeight: 35,
                            color: '#6B6B6B',
                            fontWeight: 500,
                            fontSize: 13,
                            borderRadius: 2,
                            background: '#F3F5F2',
                            '&:hover': {
                              background: '#F3F5F2',
                              color: COLORS.fontMain,
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 25,
                              color: '#B0B0B0',
                              fontSize: 15,
                            }}
                          >
                            {React.cloneElement(sub.icon, {
                              fontSize: 'small',
                            })}
                          </ListItemIcon>
                          <ListItemText
                            primary={sub.label}
                            primaryTypographyProps={{ fontSize: 13 }}
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
                            pl: 4,
                            pr: 2,
                            py: 1,
                            mx: 1,
                            mb: 1,
                            minHeight: 35,
                            color: '#6B6B6B',
                            fontWeight: 500,
                            fontSize: 13,
                            borderRadius: 2,
                            background: 'transparent',
                            '&:hover': {
                              background: '#F3F5F2',
                              color: COLORS.fontMain,
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 25,
                              color: '#B0B0B0',
                              fontSize: 15,
                            }}
                          >
                            {React.cloneElement(sub.icon, {
                              fontSize: 'small',
                            })}
                          </ListItemIcon>
                          <ListItemText
                            primary={sub.label}
                            primaryTypographyProps={{ fontSize: 13 }}
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
            onClick={() => {
              handleLogout();
              setMobileDrawerOpen(false);
            }}
            sx={{
              m: 2,
              mb: 3,
              color: '#B0B0B0',
              fontWeight: 600,
              fontSize: 14,
              justifyContent: 'flex-start',
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 1.5,
              '&:hover': {
                background: '#F3F5F2',
                color: COLORS.fontMain,
              },
            }}
            fullWidth
          >
            Logout
          </Button>
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: isMobile ? 2 : 4,
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 2 : 3,
          ml: isMobile ? 0 : '160px',
          mt: isMobile ? '80px' : '80px',
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: 1,
            gap: isMobile ? 2 : 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: COLORS.fontMain,
              fontSize: isMobile ? '1.5rem' : '2.125rem',
            }}
          >
            Transaction History
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push('/duplicateddashboard')}
            sx={{
              ml: isMobile ? 0 : 'auto',
              color: COLORS.btnIconMain,
              borderColor: COLORS.btnIconMain,
              fontWeight: 600,
              fontSize: isMobile ? 12 : 14,
              px: isMobile ? 3 : 4,
              py: isMobile ? 1 : 1.5,
              '&:hover': {
                backgroundColor: COLORS.btnIconMain,
                borderColor: COLORS.btnIconMain,
                color: '#fff',
              },
            }}
          >
            Back
          </Button>
        </Box>

        {/* Search and Filter Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search by user, type, or ID"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 16 }} />
                </InputAdornment>
              ),
              sx: {
                fontSize: isMobile ? 13 : 12,
                borderRadius: 2,
                background: '#fff',
                height: isMobile ? 40 : 36,
              },
            }}
            sx={{ flex: 1, maxWidth: isMobile ? 'none' : 400 }}
          />
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexDirection: isMobile ? 'row' : 'row',
            }}
          >
            <TextField
              select
              size="small"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList sx={{ fontSize: 16 }} />
                  </InputAdornment>
                ),
                sx: {
                  fontSize: isMobile ? 13 : 12,
                  borderRadius: 2,
                  background: '#fff',
                  height: isMobile ? 40 : 36,
                },
              }}
              sx={{ width: isMobile ? 150 : 200 }}
            >
              {typeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
            <IconButton
              onClick={handleDownload}
              sx={{
                color: COLORS.btnIconMain,
                backgroundColor: '#fff',
                border: '1px solid #E0E0E0',
                width: isMobile ? 40 : 36,
                height: isMobile ? 40 : 36,
                '&:hover': {
                  backgroundColor: COLORS.bg,
                  borderColor: COLORS.btnIconMain,
                },
              }}
            >
              <Download />
            </IconButton>
          </Box>
        </Box>

        {/* Transaction Table */}
        <Paper
          sx={{
            borderRadius: 3,
            px: isMobile ? 1 : 2,
            py: 1.5,
            background: '#fff',
            boxShadow: 1,
          }}
        >
          {/* Table Header */}
          <Box
            sx={{
              display: isMobile ? 'none' : 'grid',
              gridTemplateColumns: gridTemplate,
              py: 2,
              borderBottom: '1px solid #F0F0F0',
              fontWeight: 600,
              color: COLORS.fontMain,
              fontSize: 12,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>N°</Box>
            <Box sx={{ textAlign: 'center' }}>ID</Box>
            <Box sx={{ textAlign: 'center' }}>Transfer Type</Box>
            <Box sx={{ textAlign: 'center' }}>User</Box>
            <Box sx={{ textAlign: 'center' }}>Amount</Box>
            <Box sx={{ textAlign: 'center' }}>Date</Box>
          </Box>

          {/* Transaction List */}
          <Box
            sx={{
              minHeight: isMobile ? 300 : 400,
              overflowX: isMobile ? 'auto' : 'visible',
            }}
          >
            {paginated.length === 0 ? (
              <Typography sx={{ p: 4, textAlign: 'center', color: '#B0B0B0' }}>
                No transactions found.
              </Typography>
            ) : (
              <>
                {/* Desktop Table View */}
                {!isMobile &&
                  paginated.map((tx, idx) => (
                    <Box
                      key={tx.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: gridTemplate,
                        alignItems: 'center',
                        py: 1.5,
                        borderBottom:
                          idx === paginated.length - 1
                            ? 'none'
                            : '1px solid #F0F0F0',
                        cursor: 'pointer',
                        '&:hover': { background: '#f3eaff' },
                        fontSize: 11,
                      }}
                    >
                      <Box sx={{ textAlign: 'center', fontWeight: 600 }}>
                        {(page - 1) * ROWS_PER_PAGE + idx + 1}
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>{tx.id}</Box>
                      <Box sx={{ textAlign: 'center' }}>{tx.type}</Box>
                      <Box sx={{ textAlign: 'center', fontWeight: 600 }}>
                        {tx.user}
                      </Box>
                      <Box
                        sx={{
                          textAlign: 'center',
                          fontWeight: 600,
                          color: tx.positive ? COLORS.btnIcon2 : COLORS.fontSub,
                        }}
                      >
                        {tx.amount}
                      </Box>
                      <Box sx={{ textAlign: 'center', color: '#B0B0B0' }}>
                        {tx.date}
                      </Box>
                    </Box>
                  ))}

                {/* Mobile Card View */}
                {isMobile &&
                  paginated.map((tx, idx) => (
                    <Box
                      key={tx.id}
                      sx={{
                        border: '1px solid #F0F0F0',
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                        cursor: 'pointer',
                        '&:hover': { background: '#f3eaff' },
                        '&:last-child': { mb: 0 },
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
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: 12,
                            color: COLORS.fontMain,
                          }}
                        >
                          #{(page - 1) * ROWS_PER_PAGE + idx + 1}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: '#B0B0B0' }}>
                          {tx.date}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: COLORS.fontMain,
                          }}
                        >
                          {tx.user}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: tx.positive
                              ? COLORS.btnIcon2
                              : COLORS.fontSub,
                          }}
                        >
                          {tx.amount}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: 11, color: '#6B6B6B' }}>
                          {tx.type}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: '#B0B0B0' }}>
                          ID: {tx.id}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
              </>
            )}
          </Box>

          {/* Pagination */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
              '& .MuiPagination-ul': {
                flexWrap: 'wrap',
                justifyContent: 'center',
              },
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: isMobile ? 12 : 14,
                  minWidth: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Content;
