// API Configuration Constants

export const API_ENVIRONMENTS = {
  PRODUCTION: 'https://paylentine-backend-1.onrender.com/api', // Production API for deployment
  DEVELOPMENT: 'http://localhost:3001/api',
} as const;

// Use production API for deployment, development API for local development
export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? API_ENVIRONMENTS.DEVELOPMENT
    : API_ENVIRONMENTS.PRODUCTION;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  CONTACTS: {
    BASE: '/contacts',
    ADD_BY_EMAIL: '/contacts/add-by-email',
    SEARCH: '/contacts/search',
    BY_ID: '/contacts', // Will append /{contactId}
    VERIFY: '/contacts', // Will append /{contactId}/verify
  },
  MULTISIG: {
    SETTINGS: '/multisig/settings',
    CHECK_REQUIRED: '/multisig/check-required',
    CREATE_PENDING: '/multisig/create-pending',
    PENDING_APPROVALS: '/multisig/pending-approvals',
    INITIATED_TRANSACTIONS: '/multisig/initiated-transactions',
    TRANSACTION_DETAILS: '/multisig/transaction',
    APPROVE: '/multisig/transaction',
    REJECT: '/multisig/transaction',
    CANCEL: '/multisig/transaction',
    STATS: '/multisig/stats',
    VALIDATE_SEED: '/multisig/validate-seed-phrase',
  },
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

// Common headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;
