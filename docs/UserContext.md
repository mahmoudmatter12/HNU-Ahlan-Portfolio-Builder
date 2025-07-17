# User Context Documentation

## Overview

The User Context provides a global state management solution for user data across your application. It integrates with Clerk for authentication and provides easy access to user information, loading states, and user management functions.

## Features

- **Global User State**: Access user data from anywhere in your app
- **Loading States**: Built-in loading and error handling
- **User Management**: Update user data and refetch user information
- **Role-based Hooks**: Convenient hooks for checking user roles and permissions
- **TypeScript Support**: Full type safety with the User interface

## Setup

The UserProvider is already included in your global providers. Make sure your app is wrapped with the GlobalProviders:

```tsx
// app/layout.tsx
import { GlobalProviders } from '@/context/proiders';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlobalProviders>
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}
```

## Usage

### Basic Usage

```tsx
import { useUser } from '@/context/userContext';

function MyComponent() {
  const { user, loading, error, refetchUser } = useUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>User Type: {user.userType}</p>
    </div>
  );
}
```

### Convenience Hooks

```tsx
import { 
  useCurrentUser, 
  useIsAdmin, 
  useIsSuperAdmin, 
  useIsOnboarded,
  useIsAuthenticated 
} from '@/context/userContext';

function AdminPanel() {
  const user = useCurrentUser();
  const isAdmin = useIsAdmin();
  const isSuperAdmin = useIsSuperAdmin();
  const isOnboarded = useIsOnboarded();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return <div>Please log in</div>;
  if (!isAdmin) return <div>Access denied</div>;

  return (
    <div>
      <h1>Admin Panel</h1>
      {isSuperAdmin && <p>Super Admin Features</p>}
      {!isOnboarded && <p>Please complete onboarding</p>}
    </div>
  );
}
```

### Updating User Data

```tsx
import { useUser } from '@/context/userContext';

function UpdateProfile() {
  const { updateUser } = useUser();

  const handleUpdateName = async () => {
    try {
      await updateUser({ name: 'New Name' });
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <button onClick={handleUpdateName}>
      Update Name
    </button>
  );
}
```

### Refreshing User Data

```tsx
import { useUser } from '@/context/userContext';

function RefreshButton() {
  const { refetchUser } = useUser();

  return (
    <button onClick={refetchUser}>
      Refresh User Data
    </button>
  );
}
```

## Available Hooks

### Main Hook
- `useUser()` - Returns the full user context with user data, loading state, error, and functions

### Convenience Hooks
- `useCurrentUser()` - Returns the current user object or null
- `useUserLoading()` - Returns the loading state
- `useUserError()` - Returns any error message
- `useIsAuthenticated()` - Returns true if user is authenticated and loaded
- `useIsAdmin()` - Returns true if user is an ADMIN
- `useIsSuperAdmin()` - Returns true if user is a SUPERADMIN
- `useIsOnboarded()` - Returns true if user has completed onboarding

## User Interface

```typescript
interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  image?: string;
  onboarded: boolean;
  userType: "ADMIN" | "SUPERADMIN";
  collegeId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

The context uses these API endpoints:

- `GET /api/users/clerk/[clerkId]` - Fetch user by Clerk ID
- `PUT /api/users/[id]` - Update user data

## Error Handling

The context automatically handles:
- Network errors
- User not found errors
- Loading states
- Authentication state changes

## Best Practices

1. **Always check loading state** before accessing user data
2. **Handle errors gracefully** with user-friendly messages
3. **Use convenience hooks** for common checks like `useIsAdmin()`
4. **Update user data sparingly** - only when necessary
5. **Cache user data** - the context automatically caches and updates

## Example Component

See `components/UserProfile.tsx` for a complete example of how to use the user context in a React component. 