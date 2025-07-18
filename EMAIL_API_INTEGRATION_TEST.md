# Multi-Signature Email API Integration Test Guide

## Overview
This document provides a comprehensive test guide for the new email-based multi-signature API integration.

## What Changed

### 1. New API Endpoint
- **Endpoint**: `/api/multisig/settings-by-email`
- **Method**: PUT
- **Purpose**: Update multi-signature settings using contact email addresses

### 2. Frontend Integration Points

#### Service Layer (`src/services/multisig.ts`)
```typescript
// NEW: Email-based API function
export const updateMultiSignSettingsByEmail = async (settings: {
  isEnabled: boolean;
  thresholdAmount: number;
  signerEmail?: string;
  requiresSeedPhrase?: boolean;
}): Promise<any>
```

#### Component Layer (`src/pages/MultiSign-Settings/Content.tsx`)
- **Updated**: `saveToBackend()` function now uses email-based API
- **Enhanced**: `loadFromBackend()` handles new response format with `signer` object
- **Added**: `handleThresholdChange()` function for threshold updates
- **Improved**: Error handling for email-specific validation errors

## Testing Scenarios

### ✅ Scenario 1: Enable Multi-Sig with Contact Email

**Steps:**
1. Open Multi-Signature Settings
2. Toggle "Enable Multi-Signature" to ON
3. Set threshold amount (e.g., $1,000)
4. Select a contact from dropdown (e.g., "Bruno Hoffman (bruno.hoffman@example.com)")
5. Click "Confirm Multi-Signature Setup"
6. Click "Confirm & Lock Settings"

**Expected Behavior:**
- Settings save successfully using `/api/multisig/settings-by-email`
- Backend receives: `{ isEnabled: true, thresholdAmount: 1000, signerEmail: "bruno.hoffman@example.com", requiresSeedPhrase: true }`
- Success message displays
- Settings become locked

**Debug Logs to Check:**
```
Contact selected: { id: "bruno.hoffman@example.com", name: "Bruno Hoffman", email: "bruno.hoffman@example.com" }
Email to be sent to backend: bruno.hoffman@example.com
Saving settings to email API: { isEnabled: true, thresholdAmount: 1000, signerEmail: "bruno.hoffman@example.com", requiresSeedPhrase: true }
Save response: { success: true, message: "Multi-signature settings updated successfully", settings: {...} }
```

### ✅ Scenario 2: Load Existing Settings

**Steps:**
1. Refresh the page or navigate away and back
2. Check that settings persist

**Expected Behavior:**
- Settings load with proper contact information
- Contact dropdown shows selected user
- Locked state preserved
- Threshold amount correct

**Debug Logs to Check:**
```
Backend response: { success: true, settings: { isEnabled: true, thresholdAmount: 1000, signer: { email: "bruno.hoffman@example.com", firstName: "Bruno", lastName: "Hoffman" } } }
Processed settings: { isEnabled: true, thresholdAmount: 1000, signer: {...} }
```

### ✅ Scenario 3: Error Handling

**Test Cases:**

#### A. Email Not in Contacts
- Try to manually set an email not in your contacts list
- **Expected**: Error message about email not being in contacts

#### B. Email Not Registered User
- Select a contact email that doesn't belong to a registered user
- **Expected**: Error message about user not being registered

#### C. Self-Selection
- Try to select your own email address
- **Expected**: Error message preventing self-selection

### ✅ Scenario 4: Update Threshold

**Steps:**
1. Unlock settings with seed phrase
2. Change threshold amount
3. Save settings

**Expected Behavior:**
- API call uses email-based endpoint
- Only threshold updates, other settings remain
- Backend receives updated `thresholdAmount`

### ✅ Scenario 5: Disable Multi-Sig

**Steps:**
1. Toggle "Enable Multi-Signature" to OFF
2. Enter seed phrase when prompted
3. Confirm disable

**Expected Behavior:**
- API call with `isEnabled: false`
- Settings unlock and reset
- Contact selection cleared

## Network Tab Verification

When testing, open Chrome DevTools → Network tab and look for:

### Successful Request
```
PUT /api/multisig/settings-by-email
Status: 200 OK

Request Payload:
{
  "isEnabled": true,
  "thresholdAmount": 1000,
  "signerEmail": "bruno.hoffman@example.com",
  "requiresSeedPhrase": true
}

Response:
{
  "success": true,
  "message": "Multi-signature settings updated successfully",
  "settings": {
    "id": 1,
    "isEnabled": true,
    "thresholdAmount": 1000,
    "signerUserId": 123,
    "requiresSeedPhrase": true,
    "signer": {
      "id": 123,
      "email": "bruno.hoffman@example.com",
      "firstName": "Bruno",
      "lastName": "Hoffman"
    }
  }
}
```

### Error Response
```
PUT /api/multisig/settings-by-email
Status: 400 Bad Request

Response:
{
  "success": false,
  "message": "The email bruno.hoffman@example.com is not in your contacts list"
}
```

## Implementation Details

### Key Changes Made

1. **New Service Function**: Added `updateMultiSignSettingsByEmail()` in `multisig.ts`
2. **Updated Save Logic**: `saveToBackend()` now uses email-based API with proper payload structure
3. **Enhanced Load Logic**: `loadFromBackend()` handles new response format with `signer` object
4. **Better Error Handling**: Displays specific error messages from backend
5. **Contact Integration**: Properly maps selected contact emails to API calls

### Data Flow

```
User selects contact → handleContactSelect() → setUserB() → saveToBackend() → updateMultiSignSettingsByEmail() → Backend API → Response handling → UI update
```

### Payload Mapping

| Frontend Field | API Field | Description |
|---------------|-----------|-------------|
| `enabled` | `isEnabled` | Multi-sig enabled state |
| `threshold` | `thresholdAmount` | Transaction threshold |
| `userB.email` | `signerEmail` | Selected contact's email |
| `locked` | `requiresSeedPhrase` | Locked state for settings |

## Troubleshooting

### Common Issues

1. **Contact not showing in dropdown**: Check that contacts array includes email addresses
2. **API 404 Error**: Verify backend is running and route is properly implemented
3. **Settings not persisting**: Check JWT token and authentication status
4. **Email validation errors**: Ensure selected contact is in your contacts list and is a registered user

### Debug Console Commands

```javascript
// Check current multi-sig context
console.log('MultiSign Context:', JSON.stringify(useMultiSign(), null, 2));

// Check selected contact
console.log('Selected Contact:', userB);

// Check API endpoint
console.log('API Base URL:', API_BASE_URL);
```

## Success Criteria

✅ **Integration is successful when:**
- Contact emails are properly sent to backend via `/api/multisig/settings-by-email`
- Settings persist across page refreshes
- Error messages display specific validation issues
- Network tab shows correct API calls with proper payloads
- Multi-sig functionality works end-to-end with email-based partner selection

## Next Steps

1. Test all scenarios listed above
2. Verify error handling with various edge cases
3. Confirm backend properly validates email addresses
4. Test with multiple different contacts
5. Verify locking/unlocking functionality works with new API

---

**Note**: This integration replaces the previous user ID-based approach with a more user-friendly email-based system, making it easier for users to select trusted contacts for multi-signature approval.
