# User Context with React Query

This document explains how to use the refactored user context that now leverages React Query (TanStack Query) for better data fetching, caching, and state management.

## Overview

The user context has been refactored to use React Query instead of manual state management. This provides:

- **Automatic caching** with configurable stale times
- **Background refetching** when data becomes stale
- **Automatic retry logic** with exponential backoff
- **Optimistic updates** for mutations
- **Better error handling** and loading states
- **Cache invalidation** and updates

## Basic Usage

### Using the Context Provider

The `UserProvider` wraps your app and provides user data through React Query:

```tsx
import { UserProvider } from "@/context/userContext";

function App() {
  return (
    <UserProvider>
      <YourApp />
    </UserProvider>
  );
}
```

### Basic Hooks

#### `useUser()`

Returns the complete user context with user data, loading state, error, and actions:

```tsx
import { useUser } from "@/context/userContext";

function MyComponent() {
  const { user, loading, error, refetchUser, updateUser } = useUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={() => refetchUser()}>Refresh</button>
    </div>
  );
}
```

#### Convenience Hooks

```tsx
import {
  useCurrentUser,
  useUserLoading,
  useUserError,
  useIsAuthenticated,
  useIsAdmin,
  useIsSuperAdmin,
  useIsOnboarded,
} from "@/context/userContext";

function MyComponent() {
  const user = useCurrentUser();
  const loading = useUserLoading();
  const error = useUserError();
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const isSuperAdmin = useIsSuperAdmin();
  const isOnboarded = useIsOnboarded();

  // Use these values in your component
}
```

## Advanced Usage with React Query

### Direct Query Access

For more advanced use cases, you can access the React Query directly:

```tsx
import {
  useUserQuery,
  useUpdateUserMutation,
  useInvalidateUser,
} from "@/context/userContext";

function AdvancedUserComponent() {
  // Direct access to React Query
  const { data: user, isLoading, isError, error, refetch } = useUserQuery();

  // Direct access to mutation
  const updateMutation = useUpdateUserMutation();

  // Cache invalidation
  const invalidateUser = useInvalidateUser();

  const handleUpdateUser = async () => {
    try {
      await updateMutation.mutateAsync({
        userId: user!.id,
        updates: { name: "New Name" },
      });
      // Cache is automatically updated via onSuccess
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleRefresh = () => {
    invalidateUser(); // This will trigger a refetch
  };

  return <div>{/* Your component JSX */}</div>;
}
```

### Custom Query Configuration

You can create custom queries with different configurations:

```tsx
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/user-service";

function CustomUserComponent() {
  const { user: clerkUser } = useClerkUser();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", "custom", clerkUser?.id],
    queryFn: () => UserService.findOrCreateUser(clerkUser!.id),
    enabled: !!clerkUser?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return <div>{isLoading ? "Loading..." : user?.name}</div>;
}
```

## Configuration Options

### Query Configuration

The user query is configured with the following options:

- **`staleTime`**: 5 minutes - Data is considered fresh for 5 minutes
- **`gcTime`**: 10 minutes - Data stays in cache for 10 minutes after becoming unused
- **`retry`**: 3 attempts - Retry failed requests 3 times
- **`retryDelay`**: Exponential backoff with max 30 seconds

### Cache Keys

The user data is cached with the key: `['user', clerkUserId]`

This allows for:

- Automatic cache updates when user data changes
- Proper cache invalidation
- Multiple user contexts if needed

## Best Practices

### 1. Use the Context Provider

Always wrap your app with the `UserProvider`:

```tsx
// In your app layout or providers
<QueryClientProvider client={queryClient}>
  <UserProvider>
    <YourApp />
  </UserProvider>
</QueryClientProvider>
```

### 2. Handle Loading States

```tsx
function MyComponent() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

### 3. Error Handling

```tsx
function MyComponent() {
  const { user, error, refetchUser } = useUser();

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refetchUser}>Try Again</button>
      </div>
    );
  }

  return <div>User: {user?.name}</div>;
}
```

### 4. Optimistic Updates

For better UX, you can implement optimistic updates:

```tsx
function UpdateUserForm() {
  const { user, updateUser } = useUser();
  const queryClient = useQueryClient();

  const handleUpdate = async (updates: Partial<User>) => {
    // Optimistically update the cache
    queryClient.setQueryData(["user", user?.id], (old: User | undefined) => {
      if (!old) return old;
      return { ...old, ...updates };
    });

    try {
      await updateUser(updates);
    } catch (error) {
      // Revert on error
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdate({ name: "New Name" });
      }}
    >
      {/* Form fields */}
    </form>
  );
}
```

### 5. Cache Invalidation

```tsx
function LogoutButton() {
  const queryClient = useQueryClient();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    // Clear user cache
    queryClient.removeQueries({ queryKey: ["user"] });
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## Migration from Old Context

If you were using the old user context, the migration is straightforward:

### Before (Old Context)

```tsx
const { user, loading, error, refetchUser, updateUser } = useUser();
```

### After (React Query Context)

```tsx
// Same API - no changes needed!
const { user, loading, error, refetchUser, updateUser } = useUser();
```

The API remains the same, but now you get all the benefits of React Query under the hood.

## Troubleshooting

### Common Issues

1. **User not loading**: Make sure the `UserProvider` is wrapped inside `QueryClientProvider`
2. **Cache not updating**: Use `invalidateQueries` or `setQueryData` to update cache
3. **Multiple requests**: Check if you have multiple `UserProvider` instances

### Debug Mode

Enable React Query DevTools to debug cache behavior:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

## Performance Benefits

- **Reduced API calls**: Data is cached and reused
- **Background updates**: Data refreshes automatically when stale
- **Optimistic updates**: UI updates immediately, then syncs with server
- **Smart retries**: Failed requests are retried with exponential backoff
- **Memory management**: Unused data is garbage collected

This refactoring provides a much more robust and performant user data management system while maintaining the same simple API for components.
