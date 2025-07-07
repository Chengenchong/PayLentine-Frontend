import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
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
  Search,
  FilterList,
  Download,
  Add,
} from '@mui/icons-material';

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
    icon: <Home />, label: 'Transactions', active: false, hasDropdown: true,
  },
  { icon: <Payment />, label: 'Payments', hasDropdown: true },
  { icon: <Group />, label: 'Contacts', active: true },
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

const ROWS_PER_PAGE = 10;

const Content = () => {
  const [page, setPage] = useState(1);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ id: '', name: '' });
  const [contactsState, setContactsState] = useState(contacts);
  const pageCount = Math.ceil(contactsState.length / ROWS_PER_PAGE);
  const filteredContacts = contactsState.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filteredContacts.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const handleLogout = () => {
    window.location.href = '/';
  };
  const handleDownload = () => {
    alert('Download CSV feature coming soon!');
  };

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
                onClick={
                  item.label === 'Contacts'
                    ? () => { window.location.href = '/ContactsDashboard'; }
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
              {item.hasDropdown && item.label === 'Transactions' && transactionsOpen && (
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
                        background: '#F3F5F2',
                        '&:hover': {
                          background: '#F3F5F2',
                          color: COLORS.fontMain,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 20, color: '#B0B0B0', fontSize: 13 }}>
                        {React.cloneElement(sub.icon, { fontSize: 'small' })}
                      </ListItemIcon>
                      <ListItemText primary={sub.label} primaryTypographyProps={{ fontSize: 11 }} />
                    </ListItem>
                  ))}
                </List>
              )}
              {item.hasDropdown && item.label === 'Payments' && paymentsOpen && (
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
                      <ListItemIcon sx={{ minWidth: 20, color: '#B0B0B0', fontSize: 13 }}>
                        {React.cloneElement(sub.icon, { fontSize: 'small' })}
                      </ListItemIcon>
                      <ListItemText primary={sub.label} primaryTypographyProps={{ fontSize: 11 }} />
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
        {/* Page Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: COLORS.fontMain }}
          >
            Contacts
          </Typography>
          <Button
            variant="outlined"
            onClick={() => { window.location.href = '/duplicateddashboard'; }}
            sx={{
              ml: 'auto',
              color: COLORS.btnIconMain,
              borderColor: COLORS.btnIconMain,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: COLORS.btnIconMain,
                borderColor: COLORS.btnIconMain,
                color: '#fff',
              },
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              color: '#fff',
              backgroundColor: COLORS.btnIconMain,
              fontWeight: 600,
              ml: 1,
              '&:hover': {
                backgroundColor: COLORS.btnHoverMain,
              },
            }}
          >
            Add Contact
          </Button>
        </Box>

        {/* Search and Filter Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search by name"
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
                fontSize: 12,
                borderRadius: 2,
                background: '#fff',
                height: 36,
              },
            }}
            sx={{ flex: 1, maxWidth: 400 }}
          />
          <TextField
            select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterList sx={{ fontSize: 16 }} />
                </InputAdornment>
              ),
              sx: {
                fontSize: 12,
                borderRadius: 2,
                background: '#fff',
                height: 36,
              },
            }}
            sx={{ width: 200 }}
          >
            <MenuItem value="">All Contacts</MenuItem>
            {/* Add more filter options here if needed */}
          </TextField>
          <IconButton
            onClick={handleDownload}
            sx={{
              color: COLORS.btnIconMain,
              '&:hover': { backgroundColor: COLORS.bg },
            }}
          >
            <Download />
          </IconButton>
        </Box>

        {/* Contacts Table */}
        <Paper
          sx={{
            borderRadius: 3,
            px: 2,
            py: 1.5,
            background: '#fff',
            boxShadow: 1,
          }}
        >
          {/* Table Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '60px 200px 1fr',
              py: 2,
              borderBottom: '1px solid #F0F0F0',
              fontWeight: 600,
              color: COLORS.fontMain,
              fontSize: 12,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>N°</Box>
            <Box sx={{ textAlign: 'center' }}>ID</Box>
            <Box sx={{ textAlign: 'center' }}>Name</Box>
          </Box>

          {/* Contacts List */}
          <Box sx={{ minHeight: 400 }}>
            {paginated.length === 0 ? (
              <Typography sx={{ p: 4, textAlign: 'center', color: '#B0B0B0' }}>
                No contacts found.
              </Typography>
            ) : (
              paginated.map((contact, idx) => (
                <Box
                  key={contact.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '60px 200px 1fr',
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
                  <Box sx={{ textAlign: 'center', fontWeight: 600 }}>
                    {contact.id}
                  </Box>
                  <Box sx={{ textAlign: 'center', fontWeight: 600 }}>
                    {contact.name}
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              size="small"
            />
          </Box>
        </Paper>

        {/* Add Contact Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
            <TextField
              label="ID"
              value={newContact.id}
              onChange={e => setNewContact({ ...newContact, id: e.target.value })}
              fullWidth
            />
            <TextField
              label="Name"
              value={newContact.name}
              onChange={e => setNewContact({ ...newContact, name: e.target.value })}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                if (newContact.id && newContact.name) {
                  setContactsState([...contactsState, newContact]);
                  setNewContact({ id: '', name: '' });
                  setAddDialogOpen(false);
                }
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Content;
