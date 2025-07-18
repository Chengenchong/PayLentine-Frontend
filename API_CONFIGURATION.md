# API Configuration Guide

## Current Setup
The frontend is currently configured to use **localhost backend** for both development and production builds.

## API Base URLs
- **Local Development**: `http://localhost:3001/api` ✅ (Currently Active)
- **Remote Production**: `https://paylentine-backend-1.onrender.com/api` 💤 (Commented Out)

## How to Switch Back to Remote API

### Option 1: Quick Switch (Recommended)
1. In `src/constants/api.ts`:
   ```typescript
   export const API_ENVIRONMENTS = {
     PRODUCTION: 'https://paylentine-backend-1.onrender.com/api', // Uncomment this line
     // PRODUCTION: 'http://localhost:3001/api', // Comment out this line
     DEVELOPMENT: 'http://localhost:3001/api',
   } as const;

   // Uncomment the environment-based logic:
   export const BASE_URL = process.env.NODE_ENV === 'development' 
     ? API_ENVIRONMENTS.DEVELOPMENT 
     : API_ENVIRONMENTS.PRODUCTION;
   ```

2. In `src/services/api.ts`:
   ```typescript
   export const setApiEnvironment = (environment: 'PRODUCTION' | 'DEVELOPMENT') => {
     // Comment out the localhost-only line:
     // currentBaseUrl = 'http://localhost:3001/api';
     
     // Uncomment the environment switching logic:
     currentBaseUrl = environment === 'PRODUCTION' 
       ? 'https://paylentine-backend-1.onrender.com/api'  // Remote production API
       : 'http://localhost:3001/api';                     // Local development API
   };
   ```

### Option 2: Use the API Environment Switcher
The `ApiEnvironmentSwitcher` component in your app allows runtime switching between APIs (once the above changes are made).

## Files Modified
- `src/constants/api.ts` - Main API configuration
- `src/services/api.ts` - API client functions
- `src/components/ApiEnvironmentSwitcher.tsx` - Runtime API switching component

## Notes
- Make sure your local backend is running on port 3001 when using localhost
- The environment switcher component will show both modes as localhost until you uncomment the production URLs
- All original production API URLs are preserved as comments for easy restoration

## Backend Requirements
When using localhost, ensure your backend server is:
1. Running on `http://localhost:3001`
2. Has CORS configured to allow requests from your frontend
3. All API endpoints are properly implemented

## Quick Test
After switching to remote API, you can verify the connection by:
1. Running `npm run build` to test compilation
2. Checking the API Environment Switcher component in your app
3. Testing login/register functionality
