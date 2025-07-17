// Multi-Signature API Service Functions

import { apiRequest } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  MultiSignSettings,
  PendingTransaction,
  CreatePendingTransactionRequest,
  ApproveTransactionRequest,
  RejectTransactionRequest,
  MultiSignStatsResponse,
  CheckRequiredResponse,
  MultiSignResponse,
  ValidateSeedPhraseRequest,
} from '../types/multisig';

// Get user's multi-signature settings
export const getMultiSignSettings = async (): Promise<any> => {
  try {
    const response = await apiRequest(API_ENDPOINTS.MULTISIG.SETTINGS, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Get multi-sig settings error:', error);
    throw error;
  }
};

// Update user's multi-signature settings
export const updateMultiSignSettings = async (settings: Partial<MultiSignSettings>): Promise<any> => {
  try {
    const response = await apiRequest(API_ENDPOINTS.MULTISIG.SETTINGS, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response;
  } catch (error) {
    console.error('Update multi-sig settings error:', error);
    throw error;
  }
};

// Check if a transaction requires multi-signature approval
export const checkTransactionRequired = async (amount: number, currency: string = 'USD'): Promise<CheckRequiredResponse> => {
  try {
    const response = await apiRequest(
      `${API_ENDPOINTS.MULTISIG.CHECK_REQUIRED}?amount=${amount}&currency=${currency}`,
      {
        method: 'GET',
      }
    );
    return response as CheckRequiredResponse;
  } catch (error) {
    console.error('Check transaction required error:', error);
    throw error;
  }
};

// Create a pending transaction for approval
export const createPendingTransaction = async (transaction: CreatePendingTransactionRequest): Promise<MultiSignResponse<PendingTransaction>> => {
  try {
    const response = await apiRequest(API_ENDPOINTS.MULTISIG.CREATE_PENDING, {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
    return response as MultiSignResponse<PendingTransaction>;
  } catch (error) {
    console.error('Create pending transaction error:', error);
    throw error;
  }
};

// Get transactions pending user's approval
export const getPendingApprovals = async (): Promise<MultiSignResponse<PendingTransaction[]>> => {
  try {
    const response = await apiRequest(API_ENDPOINTS.MULTISIG.PENDING_APPROVALS, {
      method: 'GET',
    });
    return response as MultiSignResponse<PendingTransaction[]>;
  } catch (error) {
    console.error('Get pending approvals error:', error);
    throw error;
  }
};

// Get user's initiated transactions
export const getInitiatedTransactions = async (): Promise<MultiSignResponse<PendingTransaction[]>> => {
  try {
    const response = await apiRequest(API_ENDPOINTS.MULTISIG.INITIATED_TRANSACTIONS, {
      method: 'GET',
    });
    return response as MultiSignResponse<PendingTransaction[]>;
  } catch (error) {
    console.error('Get initiated transactions error:', error);
    throw error;
  }
};

// Get transaction details
export const getTransactionDetails = async (transactionId: number): Promise<MultiSignResponse<PendingTransaction>> => {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.MULTISIG.TRANSACTION_DETAILS}/${transactionId}`, {
      method: 'GET',
    });
    return response as MultiSignResponse<PendingTransaction>;
  } catch (error) {
    console.error('Get transaction details error:', error);
    throw error;
  }
};

// Approve a pending transaction
export const approveTransaction = async (transactionId: number, data: ApproveTransactionRequest): Promise<MultiSignResponse<PendingTransaction>> => {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.MULTISIG.APPROVE}/${transactionId}/approve`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response as MultiSignResponse<PendingTransaction>;
  } catch (error) {
    console.error('Approve transaction error:', error);
    throw error;
  }
};

// Reject a pending transaction
export const rejectTransaction = async (transactionId: number, data: RejectTransactionRequest): Promise<MultiSignResponse<PendingTransaction>> => {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.MULTISIG.REJECT}/${transactionId}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response as MultiSignResponse<PendingTransaction>;
  } catch (error) {
    console.error('Reject transaction error:', error);
    throw error;
  }
};

// Cancel a pending transaction (initiator only)
export const cancelTransaction = async (transactionId: number): Promise<MultiSignResponse<PendingTransaction>> => {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.MULTISIG.CANCEL}/${transactionId}/cancel`, {
      method: 'POST',
    });
    return response as MultiSignResponse<PendingTransaction>;
  } catch (error) {
    console.error('Cancel transaction error:', error);
    throw error;
  }
};

// Get multi-signature statistics
export const getMultiSignStats = async (): Promise<MultiSignStatsResponse> => {
  try {
    const response = await apiRequest(API_ENDPOINTS.MULTISIG.STATS, {
      method: 'GET',
    });
    return response as MultiSignStatsResponse;
  } catch (error) {
    console.error('Get multi-sig stats error:', error);
    throw error;
  }
};

// Validate seed phrase for sensitive operations
export const validateSeedPhrase = async (seedPhrase: string): Promise<MultiSignResponse<{ valid: boolean }>> => {
  try {
    const response = await apiRequest(API_ENDPOINTS.MULTISIG.VALIDATE_SEED, {
      method: 'POST',
      body: JSON.stringify({ seedPhrase }),
    });
    return response as MultiSignResponse<{ valid: boolean }>;
  } catch (error) {
    console.error('Validate seed phrase error:', error);
    throw error;
  }
};
