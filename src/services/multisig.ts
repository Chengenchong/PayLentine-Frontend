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

// Update user's multi-signature settings using email-based API
export const updateMultiSignSettingsByEmail = async (settings: {
  isEnabled: boolean;
  thresholdAmount: number;
  signerEmail?: string;
  requiresSeedPhrase?: boolean;
}): Promise<any> => {
  try {
    const response = await apiRequest('/multisig/settings-by-email', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response;
  } catch (error) {
    console.error('Update multi-sig settings by email error:', error);
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
export const getPendingApprovals = async (
  transactionType?: string,
  page: number = 1,
  limit: number = 20
): Promise<MultiSignResponse<PendingTransaction[]>> => {
  const transactionTypes = ['wallet_transfer', 'payment', 'community_market', 'withdrawal'];
  
  try {
    // Build query string with all parameters
    const queryParams = new URLSearchParams();
    if (transactionType) {
      queryParams.set('transaction_type', transactionType);
    }
    queryParams.set('page', page.toString());
    queryParams.set('limit', limit.toString());
    
    const endpoint = `${API_ENDPOINTS.MULTISIG.PENDING_APPROVALS}?${queryParams.toString()}`;
    
    console.log('🔍 Fetching pending approvals from:', endpoint);
    console.log(`📄 Pagination: Page ${page}, ${limit} items per page`);
    
    const response = await apiRequest(endpoint, {
      method: 'GET',
    });
    
    // Transform backend response to match frontend expectations
    if (response.transactions) {
      return {
        success: true,
        data: response.transactions,
        message: 'Successfully fetched pending approvals',
        pagination: {
          currentPage: response.page || 1,
          totalPages: response.totalPages || 1,
          totalItems: response.total || 0,
          itemsPerPage: limit,
          hasNextPage: (response.page || 1) < (response.totalPages || 1),
          hasPreviousPage: (response.page || 1) > 1,
        }
      } as MultiSignResponse<PendingTransaction[]>;
    }
    
    return response as MultiSignResponse<PendingTransaction[]>;
  } catch (error) {
    console.error('Get pending approvals error:', error);
    
    // Check if it's the specific "undefined" parameter error
    if (error instanceof Error && error.message.includes('invalid "undefined" value')) {
      console.log('⚠️ Backend expects transaction_type parameter. Trying to fetch all transaction types...');
      
      // Try to get all transaction types and combine results
      const allTransactions: PendingTransaction[] = [];
      
      for (const type of transactionTypes) {
        try {
          const retryParams = new URLSearchParams();
          retryParams.set('transaction_type', type);
          retryParams.set('page', page.toString());
          retryParams.set('limit', limit.toString());
          
          const endpoint = `${API_ENDPOINTS.MULTISIG.PENDING_APPROVALS}?${retryParams.toString()}`;
          console.log(`🔄 Fetching transactions for type: ${type} (Page ${page}, ${limit} items)`);
          
          const response = await apiRequest(endpoint, {
            method: 'GET',
          });
          
          // Handle both new backend format and old format
          if (response.transactions && Array.isArray(response.transactions)) {
            allTransactions.push(...response.transactions);
          } else if (response.success && response.data && Array.isArray(response.data)) {
            allTransactions.push(...response.data);
          }
        } catch (typeError) {
          console.log(`⚠️ No transactions found for type: ${type}`);
          // Continue to next type
        }
      }
      
      console.log(`✅ Found ${allTransactions.length} total pending transactions across all types`);
      
      return {
        success: true,
        data: allTransactions,
        message: 'Successfully fetched pending approvals'
      } as MultiSignResponse<PendingTransaction[]>;
    }
    
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
