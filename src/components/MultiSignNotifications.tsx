'use client';

import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { format, isToday, isYesterday } from 'date-fns';
import { usePendingApprovals } from '../hooks/useMultiSig';
import MultiSignApprovalDialog from './MultiSignApprovalDialog';
import type { PendingTransaction } from '../types/multisig';

interface MultiSignNotificationsProps {
  onNotificationClick?: () => void;
}

export default function MultiSignNotifications({ onNotificationClick }: MultiSignNotificationsProps) {
  const { 
    transactions, 
    pendingCount, 
    approveTransaction, 
    rejectTransaction,
    isLoading,
    error 
  } = usePendingApprovals(10000); // Check every 10 seconds for pending approvals

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<PendingTransaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Log when component mounts and when pending approvals change
  useEffect(() => {
    console.log('🔔 MultiSignNotifications component mounted - listening for pending approvals every 10 seconds');
  }, []);

  useEffect(() => {
    if (pendingCount > 0) {
      console.log(`🔔 Pending approvals updated: ${pendingCount} transactions waiting for approval`);
    }
  }, [pendingCount, transactions]);

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onNotificationClick?.();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTransactionClick = (transaction: PendingTransaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleApprove = async (transactionId: number, message?: string) => {
    await approveTransaction(transactionId, { approvalMessage: message });
  };

  const handleReject = async (transactionId: number, reason: string) => {
    await rejectTransaction(transactionId, { rejectionReason: reason });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getTransactionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      wallet_transfer: '#2196F3',
      community_market: '#4CAF50',
      withdrawal: '#FF9800',
      payment: '#9C27B0',
    };
    return colors[type] || '#666';
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd');
    }
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expirationTime = new Date(expiresAt);
    const now = new Date();
    const hoursLeft = (expirationTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursLeft <= 2;
  };

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  
  // Don't render the notification icon if no pending transactions and no multi-sig setup
  if (pendingCount === 0 && !isLoading && !error) {
    return null;
  }

  return (
    <>
      <Tooltip title={`${pendingCount} pending approvals`}>
        <IconButton
          color="inherit"
          onClick={handleNotificationClick}
          sx={{
            position: 'relative',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Badge 
            badgeContent={pendingCount} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                minWidth: '18px',
                height: '18px',
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 420,
            maxHeight: 500,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Multi-Signature Approvals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pendingCount} transaction{pendingCount !== 1 ? 's' : ''} require{pendingCount === 1 ? 's' : ''} your approval
          </Typography>
        </Box>

        <Divider />

        {/* Error State */}
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">
              {error}
            </Alert>
          </Box>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Loading notifications...
            </Typography>
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && pendingTransactions.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No pending approvals
            </Typography>
          </Box>
        )}

        {/* Transactions List */}
        {!isLoading && pendingTransactions.length > 0 && (
          <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
            {pendingTransactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                <ListItem
                  component="button"
                  onClick={() => handleTransactionClick(transaction)}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: getTransactionTypeColor(transaction.transactionType) + '20',
                      color: getTransactionTypeColor(transaction.transactionType),
                      width: 36,
                      height: 36,
                    }}>
                      <PaymentIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </Typography>
                        {isExpiringSoon(transaction.expiresAt) && (
                          <Chip
                            icon={<WarningIcon sx={{ fontSize: 12 }} />}
                            label="Urgent"
                            size="small"
                            color="warning"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.transactionType.replace('_', ' ').toUpperCase()} • {' '}
                          from {transaction.initiatorName || `User ${transaction.initiatorUserId}`}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <TimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(transaction.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < pendingTransactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Footer */}
        {pendingTransactions.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={handleMenuClose}
                sx={{ textTransform: 'none' }}
              >
                View All Transactions
              </Button>
            </Box>
          </>
        )}
      </Menu>

      {/* Approval Dialog */}
      <MultiSignApprovalDialog
        transaction={selectedTransaction}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedTransaction(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={isLoading}
      />
    </>
  );
}
