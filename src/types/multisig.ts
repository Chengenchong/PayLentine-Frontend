// Multi-Signature API Types

export interface MultiSignSettings {
  id?: number;
  isEnabled: boolean;
  thresholdAmount: number;
  requiresSeedPhrase?: boolean;
  locked?: boolean;
  partnerUserId?: number;
  partnerEmail?: string;
  partnerName?: string;
  // Backend might use these field names
  signerUserId?: number;
  signerEmail?: string;
  signerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PendingTransaction {
  id: number;
  initiatorUserId: number;
  signerUserId: number;
  transactionType: 'wallet_transfer' | 'community_market' | 'withdrawal' | 'payment';
  amount: number;
  currency: string;
  recipientUserId?: number;
  recipientAddress?: string;
  description: string;
  transactionData: {
    type: string;
    [key: string]: any;
  };
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
  expiresAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  approvalMessage?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for display
  initiatorName?: string;
  initiatorEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
}

export interface CreatePendingTransactionRequest {
  transactionType: 'wallet_transfer' | 'community_market' | 'withdrawal' | 'payment';
  amount: number;
  currency: string;
  recipientUserId?: number;
  recipientAddress?: string;
  description: string;
  transactionData: {
    type: string;
    [key: string]: any;
  };
  expiresInHours?: number;
}

export interface ApproveTransactionRequest {
  approvalMessage?: string;
}

export interface RejectTransactionRequest {
  reason: string;
}

export interface MultiSignStatsResponse {
  success: boolean;
  data: {
    totalPending: number;
    totalApproved: number;
    totalRejected: number;
    totalInitiated: number;
    monthlyStats: {
      month: string;
      pending: number;
      approved: number;
      rejected: number;
    }[];
  };
}

export interface CheckRequiredResponse {
  success: boolean;
  data: {
    requiresApproval: boolean;
    threshold: number;
    signerUserId?: number;
    signerName?: string;
  };
}

export interface MultiSignResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
  timestamp?: string;
  // Pagination metadata (when data is an array)
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ValidateSeedPhraseRequest {
  seedPhrase: string;
}
