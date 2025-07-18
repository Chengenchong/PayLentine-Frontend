// Usage Examples for Your Existing Forms with Backend Integration

## SignInForm with Backend Integration

Your existing `SignInForm.tsx` component now has full backend integration! Here's how it works:

### What's Changed:
- ✅ Real API calls to your backend (`/api/auth/login`)
- ✅ JWT token management (automatically stored in localStorage)
- ✅ Loading states during API calls
- ✅ Error handling from the backend
- ✅ Form disabled during loading
- ✅ Automatic redirect to dashboard on success

### How to Use (No changes needed!):
```tsx
import SignInForm from './components/SignInForm';

function MyComponent() {
  const [showLogin, setShowLogin] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowLogin(true)}>
        Sign In
      </button>
      
      <SignInForm
        open={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  );
}
```

## Register Form with Backend Integration

Your existing `Register/Content.tsx` component now has full backend integration! Here's what's changed:

### What's Changed:
- ✅ Real API calls to your backend (`/api/auth/register`)
- ✅ JWT token management (automatically stored in localStorage)
- ✅ Loading states during API calls
- ✅ Error handling from the backend
- ✅ Form disabled during loading
- ✅ Automatic redirect to seed phrase page on success

### How to Use (No changes needed!):
```tsx
import RegisterContent from './pages/Register/Content';

// Your register page at /register already works!
// The route in your app/register/page.tsx file will automatically use the enhanced form
```

## Additional Features Available

### API Environment Switching
Add this to any settings page to switch between production and development APIs:

```tsx
import ApiEnvironmentSwitcher from './components/ApiEnvironmentSwitcher';

function SettingsPage() {
  return (
    <div>
      <h2>Settings</h2>
      <ApiEnvironmentSwitcher />
    </div>
  );
}
```

### Authentication Hooks
Use these hooks in any component to check authentication status:

```tsx
import { useAuth, useProfile } from './hooks/useAuth';

function UserDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const { profile, isLoading } = useProfile();
  
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

### Manual API Calls (if needed)
```tsx
import { loginUser, registerUser, getUserProfile } from './services/auth';

// Manual login
const handleLogin = async () => {
  try {
    const response = await loginUser({
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('Login successful:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## Your Forms Are Now Production Ready!

Your existing beautiful UI designs now have:
- ✅ Full backend integration
- ✅ Production & development API support
- ✅ Secure JWT token management
- ✅ Comprehensive error handling
- ✅ Loading states and form validation
- ✅ TypeScript support

**No changes needed to your existing code!** Your forms will automatically use the new backend integration.

## Testing

1. **Production API**: Your forms will connect to `https://paylentine-backend-1.onrender.com/api`
2. **Development API**: Switch to `http://localhost:3001/api` using the ApiEnvironmentSwitcher
3. **Form Validation**: Client-side validation is enhanced with server-side error handling
4. **Loading States**: Forms show loading spinners during API calls
5. **Error Messages**: Backend errors are automatically displayed to users

Your existing beautiful UI is now fully functional with your backend! 🎉
