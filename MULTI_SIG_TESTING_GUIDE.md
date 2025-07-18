# 🧪 Multi-Signature Testing Guide

## 🚀 Quick Start Testing

### 1. Start Development Server

```bash
npm run dev
```

Your app will be available at: `http://localhost:3000`

### 2. Environment Configuration

**Current Setup:**
- **Development**: `http://localhost:3001/api` (when NODE_ENV=development)
- **Production**: `https://paylentine-backend-1.onrender.com/api` (when NODE_ENV=production)

**To test with your backend:**
- If your backend is running locally on port 3001, the app will automatically use it in development mode
- For production testing, it will use your deployed backend

## 📋 Complete Testing Workflow

### Phase 1: Authentication Setup (5 minutes)

1. **Register a New User**
   - Navigate to `/register`
   - Fill in user details
   - Check console for API calls to backend
   - Verify JWT token is stored

2. **Login Test**
   - Navigate to `/logindashboard` 
   - Login with credentials
   - Verify redirect to dashboard

### Phase 2: Multi-Signature Configuration (10 minutes)

3. **Access Multi-Sig Settings**
   - Navigate to `/multisign-settings`
   - Should load existing settings from backend
   - Check Network tab for API calls

4. **Enable Multi-Signature**
   - Toggle the "Enable Multi-Signature" switch
   - Set threshold amount (e.g., $1000)
   - Select a partner from dropdown
   - Click "Confirm Multi-Signature Setup"
   - Verify settings are saved to backend

5. **Lock Verification**
   - After confirmation, settings should be locked
   - Green lock indicator should appear
   - Partner selection should be disabled

### Phase 3: Transaction Approval Testing (15 minutes)

6. **Create Test Transactions** (Requires Backend)
   - Use backend API to create pending transactions above threshold
   - Or trigger transactions from other parts of your app

7. **Notification System Test**
   - Check notification bell icon in header
   - Should show badge count for pending approvals
   - Click to see transaction list

8. **Approval/Rejection Flow**
   - Click on pending transaction
   - Review transaction details in dialog
   - Test approve and reject functionality
   - Verify backend API calls

### Phase 4: Edge Cases & Error Handling (10 minutes)

9. **Network Error Testing**
   - Disconnect internet temporarily
   - Try to load settings or approve transactions
   - Verify error messages display correctly

10. **Invalid Data Testing**
    - Try invalid threshold amounts
    - Test with missing partner selection
    - Verify validation messages

## 🔧 Developer Tools Setup

### Browser Console Commands for Testing

```javascript
// Check current auth state
localStorage.getItem('token')

// Check multi-sig settings in network tab
// Look for calls to /api/multisig/settings

// Monitor pending approvals
// Look for calls to /api/multisig/pending-approvals

// Clear auth state for fresh testing
localStorage.clear()
sessionStorage.clear()
```

### Network Tab Monitoring

**Expected API Calls:**
1. `GET /api/multisig/settings` - Load existing settings
2. `PUT /api/multisig/settings` - Save new settings  
3. `GET /api/multisig/pending-approvals` - Check pending transactions
4. `POST /api/multisig/transaction/{id}/approve` - Approve transaction
5. `POST /api/multisig/transaction/{id}/reject` - Reject transaction

## 🐛 Common Issues & Solutions

### Issue: "Multi-signature not configured" errors
**Solution**: Ensure both `isEnabled: true` and `partnerEmail` are set

### Issue: Notifications not showing
**Solution**: Check if pending transactions exist and multi-sig is properly configured

### Issue: Settings not saving
**Solution**: Verify authentication token and backend connectivity

### Issue: API calls to wrong environment
**Solution**: Check NODE_ENV and restart development server

## 📊 Testing Checklist

### Backend Integration
- [ ] Authentication APIs working
- [ ] Multi-sig settings save/load
- [ ] Pending approvals fetching
- [ ] Transaction approval/rejection
- [ ] Error handling for network issues

### Frontend Features  
- [ ] Settings UI responds to backend data
- [ ] Notifications show/hide correctly
- [ ] Lock mechanism works after confirmation
- [ ] Form validation prevents invalid data
- [ ] Loading states during API calls

### User Experience
- [ ] Smooth navigation between pages
- [ ] Clear error messages
- [ ] Responsive design on mobile
- [ ] Intuitive workflow for setup
- [ ] Real-time updates after actions

## 🚨 Critical Test Scenarios

### Scenario 1: First-Time Setup
1. New user registers
2. Navigates to multi-sig settings
3. Enables multi-signature
4. Selects partner and threshold
5. Confirms and locks settings
6. Settings persist on page refresh

### Scenario 2: Pending Approval Flow
1. User has configured multi-sig
2. Transaction above threshold is created
3. Notification appears immediately
4. User reviews and approves/rejects
5. Notification disappears
6. Transaction status updates

### Scenario 3: Error Recovery
1. User loses internet connection
2. Tries to approve transaction
3. Error message appears
4. Connection restored
5. Retry works successfully

## 🔍 Backend API Testing

If you want to test backend APIs directly:

```bash
# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test multi-sig settings (replace TOKEN)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/multisig/settings

# Create test pending transaction
curl -X POST http://localhost:3001/api/multisig/create-pending \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":1500,"currency":"USD","transactionType":"wallet_transfer","recipientAddress":"test-address"}'
```

## 📈 Performance Testing

### Monitor These Metrics:
- Page load times
- API response times
- Memory usage during long sessions
- Network usage for real-time features

### Tools:
- Chrome DevTools Performance tab
- Network tab for API monitoring
- React DevTools for component profiling

---

**Next Steps**: Start with Phase 1 and work through each section systematically. The entire testing process should take about 40-50 minutes for comprehensive coverage.
