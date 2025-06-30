import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'date', headerName: 'Date', width: 140 },
  { field: 'type', headerName: 'Type', width: 120 },
  { field: 'amount', headerName: 'Amount', width: 120, type: 'number' },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'reference', headerName: 'Reference', width: 180 },
];

const rows = [
  { id: 1, date: '2024-06-01', type: 'Top Up', amount: 100, status: 'Success', reference: 'TXN001' },
  { id: 2, date: '2024-06-02', type: 'Payment', amount: -50, status: 'Success', reference: 'TXN002' },
  { id: 3, date: '2024-06-03', type: 'Top Up', amount: 200, status: 'Pending', reference: 'TXN003' },
  { id: 4, date: '2024-06-04', type: 'Refund', amount: 50, status: 'Success', reference: 'TXN004' },
  { id: 5, date: '2024-06-05', type: 'Payment', amount: -30, status: 'Failed', reference: 'TXN005' },
];

const Content = () => (
  <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f7f7fa 0%, #e9e6ff 100%)', py: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Paper sx={{ width: 700, maxWidth: '98vw', p: 4, borderRadius: 4, boxShadow: '0 8px 32px #a78bfa22' }}>
      <Typography variant="h4" fontWeight={900} color="#7c3aed" mb={2} textAlign="center">
        Transaction History
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          sx={{
            background: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 8px #ede9fe',
            fontSize: 16,
            '& .MuiDataGrid-columnHeaders': { background: '#f3eaff', fontWeight: 700, fontSize: 16 },
            '& .MuiDataGrid-row': { fontWeight: 500 },
          }}
        />
      </Box>
    </Paper>
  </Box>
);

export default Content; 