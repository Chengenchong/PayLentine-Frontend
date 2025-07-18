import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
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
  Edit,
  Delete,
  VerifiedUser,
} from '@mui/icons-material';
import { getContacts, createContact, updateContact, deleteContact, verifyContact } from '../../services/contacts';
import type { Contact } from '../../types/contacts';

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ email: '', nickname: '' });
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [contactsState, setContactsState] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Load contacts from backend on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await getContacts();
      if (response.success && response.data) {
        setContactsState(response.data);
        setError('');
      } else {
        setError(response.errors?.[0]?.message || 'Failed to load contacts');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.email.trim()) {
      setSnackbar({ open: true, message: 'Email is required', severity: 'error' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newContact.email)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address', severity: 'error' });
      return;
    }

    try {
      const response = await createContact({
        email: newContact.email,
        nickname: newContact.nickname || undefined, // Only send nickname if provided
      });
      if (response.success && response.data) {
        setContactsState(prev => [...prev, response.data]);
        setAddDialogOpen(false);
        setNewContact({ email: '', nickname: '' });
        setSnackbar({ open: true, message: 'Contact added successfully', severity: 'success' });
        
        // Emit custom event to notify other components about contact update
        window.dispatchEvent(new CustomEvent('contactUpdated'));
      } else {
        setSnackbar({ open: true, message: response.errors?.[0]?.message || 'Failed to add contact', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to add contact', severity: 'error' });
    }
    loadContacts(); // Refresh contacts after adding
  };

  const handleEditContact = async () => {
    if (!editContact || !editContact.nickname?.trim()) {
      setSnackbar({ open: true, message: 'Nickname is required', severity: 'error' });
      return;
    }

    try {
      const response = await updateContact(editContact.id.toString(), {
        nickname: editContact.nickname,
      });
      if (response.success && response.data) {
        setContactsState(prev => prev.map(c => c.id.toString() === editContact.id.toString() ? response.data : c));
        setEditDialogOpen(false);
        setEditContact(null);
        setSnackbar({ open: true, message: 'Contact updated successfully', severity: 'success' });
        
        // Emit custom event to notify other components about contact update
        window.dispatchEvent(new CustomEvent('contactUpdated'));
      } else {
        setSnackbar({ open: true, message: response.errors?.[0]?.message || 'Failed to update contact', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update contact', severity: 'error' });
    }
    loadContacts(); // Refresh contacts after adding
  };

  const handleDeleteContact = async (contactId: string | number) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await deleteContact(contactId.toString());
      if (response.success) {
        setContactsState(prev => prev.filter(c => c.id.toString() !== contactId.toString()));
        setSnackbar({ open: true, message: 'Contact deleted successfully', severity: 'success' });
        
        // Emit custom event to notify other components about contact update
        window.dispatchEvent(new CustomEvent('contactUpdated'));
      } else {
        setSnackbar({ open: true, message: response.errors?.[0]?.message || 'Failed to delete contact', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete contact', severity: 'error' });
    }
  };

  const handleVerifyContact = async (contactId: string | number) => {
    try {
      const response = await verifyContact(contactId.toString());
      if (response.success && response.data) {
        setContactsState(prev => prev.map(c => c.id.toString() === contactId.toString() ? response.data : c));
        setSnackbar({ open: true, message: 'Contact verified successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: response.errors?.[0]?.message || 'Failed to verify contact', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to verify contact', severity: 'error' });
    }
  };
  const filteredContacts = contactsState.filter((contact) =>
    (contact.name || contact.email || '').toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filteredContacts.length / ROWS_PER_PAGE);
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
          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
              <Button size="small" onClick={loadContacts} sx={{ ml: 2 }}>
                Retry
              </Button>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Table Header */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 120px 150px',
                  py: 3,
                  borderBottom: '2px solid #F0F0F0',
                  fontWeight: 700,
                  color: COLORS.fontMain,
                  fontSize: 16,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>Name</Box>
                <Box sx={{ textAlign: 'center' }}>Email</Box>
                <Box sx={{ textAlign: 'center' }}>Nickname</Box>
                <Box sx={{ textAlign: 'center' }}>Status</Box>
                <Box sx={{ textAlign: 'center' }}>Actions</Box>
              </Box>

              {/* Contacts List */}
              <Box sx={{ minHeight: 500 }}>
                {paginated.length === 0 ? (
                  <Typography sx={{ p: 6, textAlign: 'center', color: '#B0B0B0', fontSize: 16 }}>
                    {search ? 'No contacts found matching your search.' : 'No contacts yet. Add your first contact!'}
                  </Typography>
                ) : (
                  paginated.map((contact, idx) => (
                    <Box
                      key={contact.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 120px 150px',
                        alignItems: 'center',
                        py: 2.5,
                        borderBottom:
                          idx === paginated.length - 1
                            ? 'none'
                            : '1px solid #F0F0F0',
                        cursor: 'pointer',
                        '&:hover': { background: '#f3eaff' },
                        fontSize: 14,
                        minHeight: 60,
                      }}
                    >
                      <Box sx={{ textAlign: 'center', fontWeight: 600, px: 2 }}>
                        {contact.name || contact.email?.split('@')[0] || 'Unnamed Contact'}
                      </Box>
                      <Box sx={{ textAlign: 'center', fontWeight: 500, color: '#666', px: 2 }}>
                        {contact.email}
                      </Box>
                      <Box sx={{ textAlign: 'center', fontWeight: 500, color: '#666', px: 2 }}>
                        {contact.nickname || '-'}
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        {contact.isVerified ? (
                          <Typography variant="body2" sx={{ 
                            color: '#4CAF50', 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            fontSize: 14
                          }}>
                            <VerifiedUser sx={{ fontSize: 18 }} />
                            Verified
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#FFA630', fontWeight: 600, fontSize: 14 }}>
                            Unverified
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          size="medium" 
                          onClick={() => {
                            setEditContact(contact);
                            setEditDialogOpen(true);
                          }}
                          sx={{ color: COLORS.btnIcon2 }}
                        >
                          <Edit />
                        </IconButton>
                        {!contact.isVerified && (
                          <IconButton 
                            size="medium" 
                            onClick={() => handleVerifyContact(contact.id.toString())}
                            sx={{ color: '#4CAF50' }}
                          >
                            <VerifiedUser />
                          </IconButton>
                        )}
                        <IconButton 
                          size="medium" 
                          onClick={() => handleDeleteContact(contact.id.toString())}
                          sx={{ color: '#f44336' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </>
          )}

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, py: 2 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              size="medium"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: 16,
                  fontWeight: 500,
                }
              }}
            />
          </Box>
        </Paper>

        {/* Add Contact Dialog */}
        <Dialog 
          open={addDialogOpen} 
          onClose={() => {
            setAddDialogOpen(false);
            setNewContact({ email: '', nickname: '' });
          }}
        >
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Enter the email address of the person you want to add to your contacts. You can also add a nickname to help identify them.
            </Typography>
            <TextField
              label="Email Address"
              type="email"
              value={newContact.email}
              onChange={e => setNewContact(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
              required
              placeholder="example@email.com"
              helperText="Enter a valid email address"
            />
            <TextField
              label="Nickname (Optional)"
              value={newContact.nickname}
              onChange={e => setNewContact(prev => ({ ...prev, nickname: e.target.value }))}
              fullWidth
              placeholder="My Friend Chuck"
              helperText="Give this contact a friendly nickname"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setAddDialogOpen(false);
              setNewContact({ email: '', nickname: '' });
            }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddContact}
              disabled={!newContact.email.trim()}
            >
              Add Contact
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Contact Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              You can only edit the nickname for this contact. The name and email are managed by the user's profile.
            </Typography>
            <TextField
              label="Name"
              value={editContact?.name || ''}
              fullWidth
              disabled
              helperText="Name cannot be changed - managed by user profile"
            />
            <TextField
              label="Email"
              type="email"
              value={editContact?.email || ''}
              fullWidth
              disabled
              helperText="Email cannot be changed - managed by user profile"
            />
            <TextField
              label="Nickname"
              value={editContact?.nickname || ''}
              onChange={e => setEditContact(prev => prev ? { ...prev, nickname: e.target.value } : null)}
              fullWidth
              required
              helperText="Give this contact a friendly nickname"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleEditContact}
              disabled={!editContact?.nickname?.trim()}
            >
              Update Contact
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Content;
