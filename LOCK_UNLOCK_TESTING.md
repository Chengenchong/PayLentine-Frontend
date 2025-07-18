# 🔒 Multi-Signature Lock/Unlock Testing Steps

## Testing the Lock and Persist Issue Fix

### What was Fixed:
1. **Lock State Persistence**: The `locked` state is now stored in the backend, not just local component state
2. **Page Refresh Issue**: Lock state will persist after page refresh because it's loaded from backend
3. **Unlock Functionality**: Added proper seed phrase validation for unlocking
4. **Backend Integration**: Lock state saves to and loads from your backend API

### Step-by-Step Testing:

#### 1. Navigate to Multi-Signature Settings
- Go to: `http://localhost:3000/multisign-settings`
- Check if existing settings load from backend

#### 2. Test Initial Setup
- Enable Multi-Signature toggle
- Set threshold amount (e.g., $1000)
- Select a partner from dropdown
- Click "Confirm Multi-Signature Setup"

#### 3. Test Lock Functionality
- Review dialog should appear with your settings
- Click "Lock Settings" in the review dialog
- Settings should lock and show green lock indicator
- Partner dropdown and threshold should be disabled

#### 4. Test Persistence (The Main Fix)
- **Refresh the page** (F5 or Ctrl+R)
- Settings should remain locked ✅
- Green lock indicator should still be visible ✅
- Partner and threshold should still be disabled ✅

#### 5. Test Unlock Functionality
- Click "Unlock to Modify" button
- Seed phrase dialog should appear
- Enter any 12 words (backend validation will determine if valid)
- Click confirm

### What to Watch in Browser DevTools:

#### Network Tab:
```
GET /api/multisig/settings - Should return locked: true
PUT /api/multisig/settings - Should send locked: true when locking
PUT /api/multisig/settings - Should send locked: false when unlocking
POST /api/multisig/validate-seed-phrase - When unlocking
```

#### Console Output:
- Check for any error messages
- API call success/failure logs

### Expected Backend Response Format:
```json
{
  "hasSettings": true,
  "settings": {
    "id": 1,
    "isEnabled": true,
    "thresholdAmount": 1000,
    "locked": true,
    "partnerEmail": "bruno.hoffman@example.com",
    "partnerName": "Bruno Hoffman",
    "createdAt": "2025-07-18T...",
    "updatedAt": "2025-07-18T..."
  }
}
```

### Testing Different Scenarios:

#### Scenario A: Fresh Setup (No Previous Settings)
1. New user, no settings in backend
2. Setup multi-sig and lock
3. Refresh page - should remain locked

#### Scenario B: Existing Unlocked Settings
1. User has settings but not locked
2. Load page - should show unlocked state
3. Lock the settings
4. Refresh - should remain locked

#### Scenario C: Existing Locked Settings
1. User has locked settings in backend
2. Load page - should show locked state immediately
3. Should not be able to modify without unlocking

### Debugging Tips:

#### If Lock State Doesn't Persist:
1. Check Network tab - is `locked: true` being sent to backend?
2. Check if backend is saving the `locked` field
3. Check if GET request returns `locked: true`

#### If Unlock Doesn't Work:
1. Check if seed phrase validation API is called
2. Check if backend validates seed phrase correctly
3. Check if `locked: false` is sent after successful validation

#### If Settings Don't Load:
1. Check authentication - token in localStorage
2. Check API endpoint connectivity
3. Check response format matches expected structure

### Console Commands for Quick Testing:

```javascript
// Check if user is authenticated
localStorage.getItem('token')

// Check current settings in network tab
// Look for: GET /api/multisig/settings

// Force refresh settings
window.location.reload()

// Clear auth and start fresh
localStorage.clear()
sessionStorage.clear()
```

---

## ✅ Success Criteria:

1. **Lock Persistence**: ✅ Settings remain locked after page refresh
2. **UI State**: ✅ Lock indicator appears immediately on page load
3. **Field Disabled**: ✅ Partner and threshold fields disabled when locked
4. **Unlock Flow**: ✅ Seed phrase dialog works and unlocks settings
5. **Backend Sync**: ✅ All state changes persist to backend

## 🐛 Common Issues to Watch For:

- Network errors during lock/unlock operations
- Seed phrase validation failures
- Authentication token expiration
- Backend field name mismatches
- Loading state race conditions

---

**Start Testing**: Go to `http://localhost:3000/multisign-settings` and follow the steps above!
