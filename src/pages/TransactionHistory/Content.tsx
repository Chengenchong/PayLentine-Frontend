import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Button, TextField, InputAdornment, MenuItem, IconButton, Pagination } from '@mui/material';
import { Search, FilterList, Download, AccountBalanceWallet } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

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
const amounts = ['+$300', '+$400', '-$180', '+$260', '+$500', '-$120', '+$700', '-$90', '+$1000', '-$50'];
const dates = ['2020-05-24', '2020-05-25', '2020-05-26', '2020-05-27', '2020-05-28', '2020-05-29', '2020-05-30', '2020-05-31', '2020-06-01', '2020-06-02'];

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
  ...types.map(t => ({ value: t, label: t })),
];

const ROWS_PER_PAGE = 10;

const gridTemplate = '60px 200px 300px 1fr 180px 180px';

const Content = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter(tx => {
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
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  // Download CSV stub
  const handleDownload = () => {
    // In a real app, generate and download CSV here
    alert('Download CSV feature coming soon!');
  };

  const handlePageChange = (_: any, value: number) => setPage(value);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f7f7fa 0%, #e9e6ff 100%)', py: 6, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <Paper sx={{ width: 2000, maxWidth: '98vw', p: 0, borderRadius: 6, boxShadow: '0 8px 32px #a78bfa22', overflow: 'hidden', background: 'rgba(255,255,255,0.98)' }}>
        {/* Top Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderBottom: '1px solid #ede9fe', background: '#fff', position: 'sticky', top: 0, zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountBalanceWallet sx={{ color: '#7c3aed', fontSize: 36 }} />
            <Typography variant="h4" fontWeight={900} color="#7c3aed" sx={{ letterSpacing: 1 }}>
              Transactions
            </Typography>
          </Box>
          <Button variant="outlined" color="primary" size="medium" sx={{ fontWeight: 700, borderRadius: 2, px: 3, fontSize: 18 }} onClick={() => router.push('/transactions')}>
            Back
          </Button>
        </Box>
        {/* Search, Filter, Download */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2, background: '#fff', borderBottom: '1px solid #ede9fe', position: 'sticky', top: 80, zIndex: 1 }}>
          <TextField
            size="medium"
            placeholder="Search by user, type, or ID"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 22, color: '#b5a7e6' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, background: '#f7f7fa', fontSize: 18 },
            }}
            sx={{ flex: 1, minWidth: 0 }}
          />
          <TextField
            select
            size="medium"
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterList sx={{ fontSize: 22, color: '#b5a7e6' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, background: '#f7f7fa', fontSize: 18 },
            }}
            sx={{ width: 200 }}
          >
            {typeOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <IconButton onClick={handleDownload} sx={{ color: '#7c3aed', borderRadius: 2, fontSize: 22 }}>
            <Download fontSize="inherit" />
          </IconButton>
        </Box>
        {/* Table Header */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          px: 3,
          py: 2,
          background: '#ede9fe',
          borderBottom: '2px solid #7c3aed',
          fontWeight: 900,
          color: '#7c3aed',
          fontSize: 20,
          position: 'sticky',
          top: 144,
          zIndex: 1,
          letterSpacing: 0.5,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}>
          <Box sx={{ textAlign: 'center' }}>No.</Box>
          <Box sx={{ textAlign: 'center' }}>ID</Box>
          <Box sx={{ textAlign: 'center' }}>Transfer Type</Box>
          <Box sx={{ textAlign: 'center' }}>User</Box>
          <Box sx={{ textAlign: 'center' }}>Amount</Box>
          <Box sx={{ textAlign: 'center' }}>Date</Box>
        </Box>
        {/* Transaction List */}
        <Box sx={{ background: 'transparent', minHeight: 400, maxHeight: 600, overflowY: 'auto', p: 0 }}>
          {paginated.length === 0 ? (
            <Typography sx={{ p: 4, textAlign: 'center', color: '#b5a7e6' }}>No transactions found.</Typography>
          ) : (
            paginated.map((tx, idx) => (
              <Box
                key={tx.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: gridTemplate,
                  alignItems: 'center',
                  px: 3,
                  py: 2.5,
                  background: idx % 2 === 0 ? '#f7f7fa' : '#fff',
                  borderBottom: idx === paginated.length - 1 ? 'none' : '1px solid #e0e7ff',
                  cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    background: '#e9e6ff',
                    boxShadow: '0 2px 12px #a78bfa22',
                  },
                  fontSize: 18,
                }}
              >
                <Box sx={{ textAlign: 'center', fontWeight: 700, color: '#7c3aed' }}>{(page - 1) * ROWS_PER_PAGE + idx + 1}</Box>
                <Box sx={{ textAlign: 'center', fontWeight: 500, letterSpacing: 1 }}>{tx.id}</Box>
                <Box sx={{ textAlign: 'center', fontWeight: 500 }}>{tx.type}</Box>
                <Box sx={{ textAlign: 'center', fontWeight: 700, color: '#171635' }}>{tx.user}</Box>
                <Box sx={{ textAlign: 'center', fontWeight: 900, color: tx.positive ? '#4DA1A9' : '#FFA630', fontSize: 20 }}>{tx.amount}</Box>
                <Box sx={{ textAlign: 'center', color: '#b5a7e6', fontWeight: 600 }}>{tx.date}</Box>
              </Box>
            ))
          )}
        </Box>
        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', px: 3, py: 2, background: '#fff', borderTop: '1px solid #ede9fe' }}>
          <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" size="large" />
        </Box>
      </Paper>
    </Box>
  );
};

export default Content; 