// Multi-Signature React Hooks

import { useState, useEffect, useCallback } from 'react';
import {
  getPendingApprovals,
  getInitiatedTransactions,
  approveTransaction,
  rejectTransaction,
  cancelTransaction,
  getTransactionDetails,
  checkTransactionRequired,
} from '../services/multisig';
import type {
  PendingTransaction,
  ApproveTransactionRequest,
  RejectTransactionRequest,
} from '../types/multisig';

// Hook for managing pending approvals (for signers)
export const usePendingApprovals = (refreshInterval = 30000) => {
  const [transactions, setTransactions] = useState<PendingTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isMultiSigConfigured, setIsMultiSigConfigured] = useState<boolean | null>(null);

  const fetchPendingApprovals = useCallback(async () => {
    // Only fetch if multi-signature is properly configured
    if (isMultiSigConfigured === false || isMultiSigConfigured === null) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getPendingApprovals();
      if (response.success && response.data) {
        setTransactions(response.data);
        setLastUpdated(new Date());
      }
    } catch (err: any) {
      // Don't set error if multi-sig is not configured
      if (err.message?.includes('invalid "undefined" value') || 
          err.message?.includes('multi-signature not configured') ||
          err.message?.includes('500')) {
        setTransactions([]);
        setIsMultiSigConfigured(false);
      } else {
        setError(err.message || 'Failed to fetch pending approvals');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isMultiSigConfigured]);

  // Check if multi-signature is properly configured (enabled AND has partner)
  const checkMultiSigStatus = useCallback(async () => {
    try {
      const { getMultiSignSettings } = await import('../services/multisig');
      const response = await getMultiSignSettings();
      
      // Handle different response formats
      let settings = null;
      if (response.success && response.data) {
        settings = response.data;
      } else if (response.settings) {
        settings = response.settings;
      } else if (response.isEnabled !== undefined) {
        settings = response;
      }
      
      if (settings) {
        // Multi-sig is configured if it's enabled AND has a partner
        const isConfigured = settings.isEnabled && (settings.partnerEmail || settings.partnerUserId);
        setIsMultiSigConfigured(isConfigured);
      } else {
        setIsMultiSigConfigured(false);
      }
    } catch (err) {
      setIsMultiSigConfigured(false);
    }
  }, []);

  // Auto-refresh pending approvals
  useEffect(() => {
    checkMultiSigStatus().then(() => {
      if (isMultiSigConfigured === true) {
        fetchPendingApprovals();
      }
    });
    
    const interval = setInterval(() => {
      if (isMultiSigConfigured === true) {
        fetchPendingApprovals();
      }
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPendingApprovals, refreshInterval, isMultiSigConfigured]);

  const handleApprove = async (transactionId: number, data: ApproveTransactionRequest) => {
    try {
      const response = await approveTransaction(transactionId, data);
      if (response.success) {
        // Refresh the list
        await fetchPendingApprovals();
        return response;
      }
      throw new Error(response.message);
    } catch (err: any) {
      setError(err.message || 'Failed to approve transaction');
      throw err;
    }
  };

  const handleReject = async (transactionId: number, data: RejectTransactionRequest) => {
    try {
      const response = await rejectTransaction(transactionId, data);
      if (response.success) {
        // Refresh the list
        await fetchPendingApprovals();
        return response;
      }
      throw new Error(response.message);
    } catch (err: any) {
      setError(err.message || 'Failed to reject transaction');
      throw err;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    lastUpdated,
    refresh: fetchPendingApprovals,
    approveTransaction: handleApprove,
    rejectTransaction: handleReject,
    pendingCount: transactions.filter(t => t.status === 'pending').length,
  };
};

// Hook for managing initiated transactions (for initiators)
export const useInitiatedTransactions = () => {
  const [transactions, setTransactions] = useState<PendingTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInitiatedTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getInitiatedTransactions();
      if (response.success && response.data) {
        setTransactions(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch initiated transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitiatedTransactions();
  }, [fetchInitiatedTransactions]);

  const handleCancel = async (transactionId: number) => {
    try {
      const response = await cancelTransaction(transactionId);
      if (response.success) {
        // Refresh the list
        await fetchInitiatedTransactions();
        return response;
      }
      throw new Error(response.message);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel transaction');
      throw err;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    refresh: fetchInitiatedTransactions,
    cancelTransaction: handleCancel,
  };
};

// Hook for checking if a transaction requires approval
export const useTransactionCheck = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkRequired = async (amount: number, currency = 'USD') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await checkTransactionRequired(amount, currency);
      if (response.success) {
        return response.data;
      }
      throw new Error('Failed to check transaction requirements');
    } catch (err: any) {
      setError(err.message || 'Failed to check transaction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkRequired,
    isLoading,
    error,
  };
};

// Hook for transaction details
export const useTransactionDetails = (transactionId: number | null) => {
  const [transaction, setTransaction] = useState<PendingTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) {
      setTransaction(null);
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTransactionDetails(transactionId);
        if (response.success && response.data) {
          setTransaction(response.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transaction details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [transactionId]);

  return {
    transaction,
    isLoading,
    error,
  };
};
