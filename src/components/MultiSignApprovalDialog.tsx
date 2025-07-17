'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  TextField,
  Alert,
  IconButton,
  Collapse,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import type { PendingTransaction } from '../types/multisig';

interface ApprovalDialogProps {
  transaction: PendingTransaction | null;
  open: boolean;
  onClose: () => void;
  onApprove: (transactionId: number, message?: string) => Promise<void>;
  onReject: (transactionId: number, reason: string) => Promise<void>;
  isLoading?: boolean;
}

export default function MultiSignApprovalDialog({
  transaction,
  open,
  onClose,
  onApprove,
  onReject,
  isLoading = false,
}: ApprovalDialogProps) {
  const [approvalMessage, setApprovalMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = async () => {
    if (!transaction) return;
    setActionType('approve');
    try {
      await onApprove(transaction.id, approvalMessage || undefined);
      handleClose();
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setActionType(null);
    }
  };

  const handleReject = async () => {
    if (!transaction || !rejectionReason.trim()) return;
    setActionType('reject');
    try {
      await onReject(transaction.id, rejectionReason);
      handleClose();
    } catch (error) {
      console.error('Rejection failed:', error);
    } finally {
      setActionType(null);
    }
  };

  const handleClose = () => {
    setApprovalMessage('');
    setRejectionReason('');
    setShowDetails(false);
    setActionType(null);
    onClose();
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getTransactionTypeDisplay = (type: string) => {
    const types: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      wallet_transfer: { 
        label: 'Wallet Transfer', 
        color: '#2196F3', 
        icon: <PaymentIcon sx={{ fontSize: 16 }} />
      },
      community_market: { 
        label: 'Community Market', 
        color: '#4CAF50', 
        icon: <PaymentIcon sx={{ fontSize: 16 }} />
      },
      withdrawal: { 
        label: 'Withdrawal', 
        color: '#FF9800', 
        icon: <PaymentIcon sx={{ fontSize: 16 }} />
      },
      payment: { 
        label: 'Payment', 
        color: '#9C27B0', 
        icon: <PaymentIcon sx={{ fontSize: 16 }} />
      },
    };

    const config = types[type] || { label: type, color: '#666', icon: <PaymentIcon sx={{ fontSize: 16 }} /> };
    return config;
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expirationTime = new Date(expiresAt);
    const now = new Date();
    const hoursLeft = (expirationTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursLeft <= 2; // Consider expiring soon if less than 2 hours left
  };

  if (!transaction) return null;

  const typeConfig = getTransactionTypeDisplay(transaction.transactionType);
  const expiringSoon = isExpiringSoon(transaction.expiresAt);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 2, 
            backgroundColor: `${typeConfig.color}20`,
            color: typeConfig.color,
            display: 'flex',
            alignItems: 'center'
          }}>
            {typeConfig.icon}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Multi-Signature Approval Required
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {typeConfig.label} • {formatCurrency(transaction.amount, transaction.currency)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {expiringSoon && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            icon={<WarningIcon />}
          >
            <Typography variant="body2" fontWeight={600}>
              This approval request expires soon!
            </Typography>
            <Typography variant="body2">
              Expires at {format(new Date(transaction.expiresAt), 'MMM dd, yyyy h:mm a')}
            </Typography>
          </Alert>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Main Transaction Info */}
          <Box sx={{ flex: { md: 2 } }}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {transaction.initiatorName || `User ${transaction.initiatorUserId}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.initiatorEmail || 'Requesting approval for this transaction'}
                  </Typography>
                </Box>
                <Chip 
                  label={transaction.status.toUpperCase()} 
                  color="warning"
                  size="small"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Transaction Amount
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  {formatCurrency(transaction.amount, transaction.currency)}
                </Typography>
              </Box>

              {transaction.description && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon sx={{ fontSize: 16 }} />
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.description}
                  </Typography>
                </Box>
              )}

              {(transaction.recipientUserId || transaction.recipientAddress) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Recipient
                  </Typography>
                  <Typography variant="body2">
                    {transaction.recipientName || transaction.recipientAddress || `User ${transaction.recipientUserId}`}
                  </Typography>
                  {transaction.recipientEmail && (
                    <Typography variant="body2" color="text.secondary">
                      {transaction.recipientEmail}
                    </Typography>
                  )}
                </Box>
              )}
            </Card>

            {/* Transaction Details (Expandable) */}
            <Card variant="outlined" sx={{ p: 2 }}>
              <Button
                variant="text"
                onClick={() => setShowDetails(!showDetails)}
                startIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ p: 0, justifyContent: 'flex-start', textTransform: 'none' }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  Transaction Details
                </Typography>
              </Button>
              
              <Collapse in={showDetails}>
                <Box sx={{ mt: 2, pl: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Transaction ID:</strong> {transaction.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Type:</strong> {typeConfig.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Created:</strong> {format(new Date(transaction.createdAt), 'MMM dd, yyyy h:mm a')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Expires:</strong> {format(new Date(transaction.expiresAt), 'MMM dd, yyyy h:mm a')}
                  </Typography>
                  {transaction.transactionData && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Additional Data:</strong>
                      </Typography>
                      <Box sx={{ 
                        bgcolor: 'grey.50', 
                        p: 1, 
                        borderRadius: 1, 
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        maxHeight: 100,
                        overflow: 'auto'
                      }}>
                        {JSON.stringify(transaction.transactionData, null, 2)}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Card>
          </Box>

          {/* Action Panel */}
          <Box sx={{ flex: { md: 1 } }}>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon sx={{ fontSize: 20 }} />
                Action Required
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                As the designated signer, you need to approve or reject this transaction.
              </Typography>

              {/* Approval Message */}
              <TextField
                fullWidth
                label="Approval Message (Optional)"
                multiline
                rows={2}
                value={approvalMessage}
                onChange={(e) => setApprovalMessage(e.target.value)}
                placeholder="Add a note about your approval..."
                sx={{ mb: 2 }}
                size="small"
              />

              {/* Rejection Reason */}
              <TextField
                fullWidth
                label="Rejection Reason"
                multiline
                rows={2}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Required if rejecting..."
                sx={{ mb: 3 }}
                size="small"
                error={actionType === 'reject' && !rejectionReason.trim()}
                helperText={actionType === 'reject' && !rejectionReason.trim() ? 'Reason is required for rejection' : ''}
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  disabled={isLoading || actionType !== null}
                  startIcon={<CheckCircleIcon />}
                  fullWidth
                  sx={{ py: 1.2 }}
                >
                  {actionType === 'approve' ? 'Approving...' : 'Approve Transaction'}
                </Button>
                
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleReject}
                  disabled={isLoading || actionType !== null || !rejectionReason.trim()}
                  startIcon={<CancelIcon />}
                  fullWidth
                  sx={{ py: 1.2 }}
                >
                  {actionType === 'reject' ? 'Rejecting...' : 'Reject Transaction'}
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                This action cannot be undone once submitted
              </Typography>
            </Card>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
