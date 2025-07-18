// Contact Types for API Integration

export interface Contact {
  id: number;
  ownerId: number; // Match backend camelCase
  contactUserId: number; // Match backend camelCase
  nickname: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Nested user information from backend include
  contactUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  // Computed properties for backward compatibility
  name?: string; // Will be computed from contactUser
  email?: string; // Will be computed from contactUser
}

export interface CreateContactRequest {
  email: string;
  nickname?: string; // Backend expects nickname, not name
}

export interface UpdateContactRequest {
  nickname?: string; // Backend only allows updating nickname
}

export interface ContactSearchQuery {
  nickname?: string;
  email?: string;
  name?: string;
  limit?: number;
  offset?: number;
}

export interface ContactVerificationRequest {
  // Add any verification specific fields if needed
}

export interface ContactApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export interface ContactListResponse extends ContactApiResponse {
  data: Contact[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ContactResponse extends ContactApiResponse {
  data: Contact;
}
