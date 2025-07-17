# Authentication System

This document explains how the authentication system works in the application.

## Overview

The authentication system uses Clerk for user authentication and a custom database for user management and permissions. The system implements a "find-or-create" pattern to ensure users are automatically created in the database when they sign up or sign in with Clerk.

## Components

### 1. Find-or-Create User Function

**Location**: `services/user-service.ts`
```typescript
static async findOrCreateUser(clerkId: string) {
  const res = await api.post("/users/find-or-create", { clerkId });
  return res.data;
}
```

**Purpose**: This function attempts to find a user by their Clerk ID, and if not found, creates a new user in the database.

### 2. Find-or-Create API Endpoint

**Location**: `app/[locale]/api/users/find-or-create/route.ts`

**Functionality**:
- Receives a Clerk ID
- Checks if user exists in database
- If not found, fetches user data from Clerk and creates a new user
- Returns the user data with proper relationships included

### 3. Updated UserProvider

**Location**: `context/userContext.tsx`

**Changes**:
- Now uses `findOrCreateUser` instead of `getCurrentUser`
- Automatically creates users in database when they sign in
- Handles authentication state properly

### 4. AdminAuthGuard Component

**Location**: `components/AdminAuthGuard.tsx`

**Purpose**: Protects admin routes by checking:
- User is authenticated with Clerk
- User exists in database
- User has proper admin permissions

**Usage**:
```tsx
<AdminAuthGuard requireAdmin={true} requireSuperAdmin={false}>
  <AdminContent />
</AdminAuthGuard>
```

### 5. Authentication Hook

**Location**: `hooks/use-auth.ts`

**Provides**:
- Authentication status
- User permissions (Admin, SuperAdmin, Guest)
- Loading states
- User data

**Usage**:
```tsx
const { isAuthenticated, isAdmin, user, isLoading } = useAuthStatus();
```

## User Types

The system supports three user types:

1. **GUEST** (default): Basic user with limited access
2. **ADMIN**: Can access admin panel and manage content
3. **SUPERADMIN**: Has all admin privileges plus super admin features

## Authentication Flow

1. **User signs up/signs in with Clerk**
2. **UserProvider detects Clerk authentication**
3. **findOrCreateUser is called with Clerk ID**
4. **API endpoint checks database for existing user**
5. **If user doesn't exist, creates new user with Clerk data**
6. **User is authenticated and can access appropriate areas**

## Webhook Integration

The Clerk webhook (`app/[locale]/api/webhook/clerk/route.ts`) also uses the same find-or-create logic to ensure users are created when Clerk events are received.

## Admin Panel Protection

The admin panel is protected by the `AdminAuthGuard` component which:
- Redirects unauthenticated users to sign-in
- Redirects non-admin users to home page
- Shows appropriate error messages for access denied

## Testing

Visit `/test-auth` to see the current authentication status and user information.

## Benefits

1. **Automatic User Creation**: Users are automatically created in the database when they sign up
2. **Consistent Authentication**: Same logic used in webhook and client-side
3. **Proper Permissions**: Clear separation between user types and permissions
4. **Admin Protection**: Only authenticated admins can access admin panel
5. **Fallback Handling**: Graceful handling of authentication failures

## Security Considerations

- All admin routes are protected by authentication guards
- User permissions are checked on both client and server side
- Clerk handles the secure authentication flow
- Database users are linked to Clerk users via unique Clerk ID 