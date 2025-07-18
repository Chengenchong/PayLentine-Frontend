# PayLentine Frontend - Backend Integration

This integration provides a complete authentication system that connects your PayLentine frontend with the backend API endpoints.

## Features

- ✅ User Registration
- ✅ User Login  
- ✅ User Profile Management
- ✅ Password Change
- ✅ Token Management
- ✅ Environment Switching (Production/Development)
- ✅ Form Validation
- ✅ Error Handling
- ✅ Loading States
- ✅ TypeScript Support

## Backend API Endpoints

The integration supports the following authentication endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/change-password` - Change user password

## Environment Configuration


The system supports two environments:

- **Production**: `https://paylentine-backend-1.onrender.com/api`
- **Development**: `http://localhost:3001/api`

By default, it uses the production environment. You can switch environments using the `ApiEnvironmentSwitcher` component.

## File Structure

```
src/
├── constants/
│   └── api.ts                    # API URLs and configuration
├── types/
│   └── auth.ts                   # TypeScript interfaces
├── services/
│   ├── api.ts                    # Base API client
│   └── auth.ts                   # Authentication services
├── hooks/
│   └── useAuth.ts                # React hooks for auth
├── components/
│   ├── AuthDialog.tsx            # Combined auth dialog
│   ├── EnhancedSignInForm.tsx    # Login form with backend
│   ├── EnhancedRegisterForm.tsx  # Registration form with backend
│   ├── ApiEnvironmentSwitcher.tsx # Environment switcher
│   └── AuthExampleUsage.tsx      # Usage example
└── index.ts                      # Exports
```

## Quick Integration

### 1. Replace your existing SignInForm

```tsx
import { AuthDialog } from '../path/to/auth/components';

// Instead of your old SignInForm:
<AuthDialog
  open={authDialogOpen}
  onClose={() => setAuthDialogOpen(false)}
  initialMode="login"
  showEnvironmentSwitcher={true}
/>
```

### 2. Use authentication hooks

```tsx
import { useAuth, useLogin, useRegister } from '../hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, logout } = useAuth();
  const { login, isLoading, error } = useLogin();
  
  // Use the hooks...
}
```

### 3. Environment switching

```tsx
import { ApiEnvironmentSwitcher } from '../components/ApiEnvironmentSwitcher';

// Add this to your settings page
<ApiEnvironmentSwitcher />
```

## Usage Examples

### Basic Authentication Dialog

```tsx
import React, { useState } from 'react';
import { AuthDialog } from './components/AuthDialog';

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setAuthOpen(true)}>
        Sign In
      </button>
      
      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="login"
      />
    </>
  );
}
```

### Using Authentication Hooks

```tsx
import { useAuth, useProfile } from './hooks/useAuth';

function UserProfile() {
  const { isAuthenticated, logout } = useAuth();
  const { profile, fetchProfile, isLoading } = useProfile();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {profile?.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Manual API Calls

```tsx
import { loginUser, registerUser } from './services/auth';

// Manual login
try {
  const response = await loginUser({
    email: 'user@example.com',
    password: 'password123'
  });
  
  if (response.success) {
    console.log('Login successful!');
  }
} catch (error) {
  console.error('Login failed:', error);
}
```

## Integration with Existing Components

### Update your Header component

```tsx
// In your Header.tsx or similar
import { useAuth } from '../hooks/useAuth';
import { AuthDialog } from '../components/AuthDialog';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  
  return (
    <header>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => setAuthOpen(true)}>Sign In</button>
      )}
      
      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </header>
  );
}
```

### Protect routes

```tsx
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProtectedPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }
  
  return <div>Protected content</div>;
}
```

## Error Handling

The integration includes comprehensive error handling:

- Network errors
- Validation errors  
- Authentication errors
- Server errors

Errors are automatically handled and displayed in the UI, but you can also handle them manually:

```tsx
import { useLogin } from '../hooks/useAuth';

function LoginForm() {
  const { login, error, isLoading } = useLogin();
  
  const handleSubmit = async (data) => {
    try {
      await login(data);
      // Success handling
    } catch (err) {
      // Additional error handling if needed
      console.error('Login error:', err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* form fields */}
    </form>
  );
}
```

## Token Management

The system automatically handles JWT tokens:

- Stores tokens in localStorage
- Includes tokens in API requests
- Removes tokens on logout
- Validates token presence

## TypeScript Support

All components and services are fully typed with TypeScript interfaces for:

- API requests and responses
- User data structures
- Error types
- Hook return types

## Security Features

- Password validation (strength requirements)
- Email format validation
- CSRF protection ready
- Secure token storage
- Request timeout handling

## Testing

You can test the integration using the `AuthExampleUsage` component:

```tsx
import AuthExampleUsage from './components/AuthExampleUsage';

// Add this to any page to test the auth system
<AuthExampleUsage />
```

## Customization

### Styling

All components use Material-UI and can be customized with the `sx` prop or theme overrides.

### Validation

You can modify validation rules in:
- `services/auth.ts` - Server-side validation helpers
- Individual form components - Client-side validation

### API Configuration

Update API URLs in `constants/api.ts`:

```tsx
export const API_ENVIRONMENTS = {
  PRODUCTION: 'https://your-production-api.com/api',
  DEVELOPMENT: 'http://localhost:3001/api',
} as const;
```

## Troubleshooting

### CORS Issues
Make sure your backend allows requests from your frontend domain.

### Token Issues
Check that tokens are being properly stored and sent in requests.

### Environment Issues
Use the `ApiEnvironmentSwitcher` to verify you're connecting to the right API.

### Network Issues
Check browser network tab for failed requests and error details.

## Next Steps

1. Replace your existing authentication forms with the enhanced versions
2. Add the authentication hooks to your existing components
3. Test with both development and production APIs
4. Implement protected routes using the `useAuth` hook
5. Add the environment switcher to your settings page

The integration is ready to use and will provide a robust authentication system for your PayLentine application!
