// Contact Service API Functions

import { apiRequest } from './api';
import { API_ENDPOINTS } from '../constants/api';
import type {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  ContactSearchQuery,
  ContactVerificationRequest,
  ContactListResponse,
  ContactResponse,
  ContactApiResponse,
} from '../types/contacts';

/**
 * Get all contacts for the authenticated user
 */
export const getContacts = async (): Promise<ContactListResponse> => {
  try {
    const response = await apiRequest<Contact[]>(API_ENDPOINTS.CONTACTS.BASE, {
      method: 'GET',
    });
    
    // Transform backend response to include computed fields for compatibility
    const transformedContacts = (response.data || []).map(contact => ({
      ...contact,
      // Add computed fields for backward compatibility - always from database User table
      name: contact.contactUser 
        ? `${contact.contactUser.firstName} ${contact.contactUser.lastName}`.trim()
        : contact.nickname,
      email: contact.contactUser?.email || '',
      // Use verification status from the Contact table (isVerified field)
      isVerified: contact.isVerified ?? false,
      verified: contact.isVerified ?? false, // Legacy support
    }));
    
    return {
      success: true,
      data: transformedContacts,
      message: response.message,
    };
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return {
      success: false,
      data: [],
      errors: [{ message: error.message || 'Failed to fetch contacts' }],
    };
  }
};

/**
 * Create a new contact by email
 */
export const createContact = async (contactData: CreateContactRequest): Promise<ContactResponse> => {
  try {
    const response = await apiRequest<Contact>(API_ENDPOINTS.CONTACTS.ADD_BY_EMAIL, {
      method: 'POST',
      body: JSON.stringify({
        email: contactData.email,
        nickname: contactData.nickname || '', // Backend expects nickname as required field
      }),
    });
    
    // Transform backend response to include computed fields for compatibility
    const contact = response.data!;
    const transformedContact = {
      ...contact,
      // Add computed fields for backward compatibility
      name: contact.contactUser 
        ? `${contact.contactUser.firstName} ${contact.contactUser.lastName}`.trim()
        : contact.nickname,
      email: contact.contactUser?.email || '',
      isVerified: contact.isVerified ?? false, // Use Contact table isVerified
      verified: contact.isVerified ?? false, // Legacy support
    };
    
    return {
      success: true,
      data: transformedContact,
      message: response.message || 'Contact added successfully',
    };
  } catch (error: any) {
    console.error('Error creating contact:', error);
    return {
      success: false,
      data: {} as Contact,
      errors: error.response?.errors || [{ message: error.message || 'Failed to add contact' }],
    };
  }
};

/**
 * Search contacts by nickname or user information
 */
export const searchContacts = async (query: ContactSearchQuery): Promise<ContactListResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (query.nickname) searchParams.append('nickname', query.nickname);
    if (query.email) searchParams.append('email', query.email);
    if (query.name) searchParams.append('name', query.name);
    if (query.limit) searchParams.append('limit', query.limit.toString());
    if (query.offset) searchParams.append('offset', query.offset.toString());
    
    const url = `${API_ENDPOINTS.CONTACTS.SEARCH}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await apiRequest<Contact[]>(url, {
      method: 'GET',
    });
    
    return {
      success: true,
      data: response.data || [],
      message: response.message,
    };
  } catch (error: any) {
    console.error('Error searching contacts:', error);
    return {
      success: false,
      data: [],
      errors: [{ message: error.message || 'Failed to search contacts' }],
    };
  }
};

/**
 * Get a specific contact by ID
 */
export const getContactById = async (contactId: string): Promise<ContactResponse> => {
  try {
    const response = await apiRequest<Contact>(`${API_ENDPOINTS.CONTACTS.BY_ID}/${contactId}`, {
      method: 'GET',
    });
    
    return {
      success: true,
      data: response.data!,
      message: response.message,
    };
  } catch (error: any) {
    console.error('Error fetching contact:', error);
    return {
      success: false,
      data: {} as Contact,
      errors: [{ message: error.message || 'Failed to fetch contact' }],
    };
  }
};

/**
 * Update a contact
 */
export const updateContact = async (
  contactId: string,
  updateData: UpdateContactRequest
): Promise<ContactResponse> => {
  try {
    const response = await apiRequest<Contact>(`${API_ENDPOINTS.CONTACTS.BY_ID}/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    
    // Transform backend response to include computed fields for compatibility
    const contact = response.data!;
    const transformedContact = {
      ...contact,
      // Add computed fields for backward compatibility
      name: contact.contactUser 
        ? `${contact.contactUser.firstName} ${contact.contactUser.lastName}`.trim()
        : contact.nickname,
      email: contact.contactUser?.email || '',
      isVerified: contact.isVerified ?? false, // Use Contact table isVerified
      verified: contact.isVerified ?? false, // Legacy support
    };
    
    return {
      success: true,
      data: transformedContact,
      message: response.message || 'Contact updated successfully',
    };
  } catch (error: any) {
    console.error('Error updating contact:', error);
    return {
      success: false,
      data: {} as Contact,
      errors: error.response?.errors || [{ message: error.message || 'Failed to update contact' }],
    };
  }
};

/**
 * Delete a contact
 */
export const deleteContact = async (contactId: string): Promise<ContactApiResponse> => {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.CONTACTS.BY_ID}/${contactId}`, {
      method: 'DELETE',
    });
    
    return {
      success: true,
      message: response.message || 'Contact deleted successfully',
    };
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    return {
      success: false,
      errors: [{ message: error.message || 'Failed to delete contact' }],
    };
  }
};

/**
 * Verify a contact
 */
export const verifyContact = async (
  contactId: string,
  verificationData?: ContactVerificationRequest
): Promise<ContactResponse> => {
  try {
    const response = await apiRequest<Contact>(`${API_ENDPOINTS.CONTACTS.VERIFY}/${contactId}/verify`, {
      method: 'PATCH',
      body: verificationData ? JSON.stringify(verificationData) : undefined,
    });
    
    return {
      success: true,
      data: response.data!,
      message: response.message || 'Contact verified successfully',
    };
  } catch (error: any) {
    console.error('Error verifying contact:', error);
    return {
      success: false,
      data: {} as Contact,
      errors: error.response?.errors || [{ message: error.message || 'Failed to verify contact' }],
    };
  }
};

/**
 * Get contacts formatted for multi-signature selection
 */
export const getContactsForMultiSign = async (): Promise<Contact[]> => {
  try {
    const response = await getContacts();
    if (response.success && response.data) {
      // Return the contacts as they are already transformed by getContacts
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching contacts for multi-sign:', error);
    return [];
  }
};
