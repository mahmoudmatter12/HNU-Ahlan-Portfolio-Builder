"use client"

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/user.service';
import { setUserIdHeader } from '@/lib/axios';
import { User } from '@/types/user';

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    refetchUser: () => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

// Query keys for React Query
const USER_QUERY_KEY = 'user';

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
    const queryClient = useQueryClient();

    // Fetch user data using React Query
    const {
        data: user,
        isLoading: loading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey: [USER_QUERY_KEY, clerkUser?.id],
        queryFn: async () => {
            if (!clerkUser?.id) {
                setUserIdHeader(null);
                return null;
            }

            const userData = await UserService.findOrCreateUser(clerkUser.id);
            // Convert date strings to Date objects
            const user: User = {
                ...userData,
                createdAt: new Date(userData.createdAt),
                updatedAt: new Date(userData.updatedAt),
            };

            setUserIdHeader(user.id);
            return user;
        },
        enabled: clerkLoaded && !!clerkUser?.id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Update user mutation using React Query
    const updateUserMutation = useMutation({
        mutationFn: async (updates: Partial<User>) => {
            if (!user?.id) throw new Error('No user to update');
            return await UserService.updateUser(user.id, updates);
        },
        onSuccess: (updatedUserData) => {
            // Convert date strings to Date objects
            const updatedUser: User = {
                ...updatedUserData,
                createdAt: new Date(updatedUserData.createdAt),
                updatedAt: new Date(updatedUserData.updatedAt),
            };

            // Update the cache with the new user data
            queryClient.setQueryData([USER_QUERY_KEY, clerkUser?.id], updatedUser);
        },
        onError: (error) => {
            console.error('Error updating user:', error);
        },
    });

    // Handle clerk user changes
    useEffect(() => {
        if (clerkLoaded && !clerkUser?.id) {
            // Clear user data when clerk user is null
            queryClient.setQueryData([USER_QUERY_KEY, null], null);
            setUserIdHeader(null);
        }
    }, [clerkLoaded, clerkUser?.id, queryClient]);

    const refetchUser = async () => {
        await refetch();
    };

    const updateUser = async (updates: Partial<User>) => {
        await updateUserMutation.mutateAsync(updates);
    };

    // Convert React Query error to string
    const error = queryError ? (queryError as Error).message : null;

    const value: UserContextType = {
        user: user || null,
        loading,
        error,
        refetchUser,
        updateUser,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Convenience hooks for common use cases
export const useCurrentUser = (): User | null => {
    const { user } = useUser();
    return user;
};

export const useUserLoading = (): boolean => {
    const { loading } = useUser();
    return loading;
};

export const useUserError = (): string | null => {
    const { error } = useUser();
    return error;
};

export const useIsAuthenticated = (): boolean => {
    const { user, loading } = useUser();
    return !loading && user !== null;
};

export const useIsAdmin = (): boolean => {
    const { user } = useUser();
    return user?.userType === 'ADMIN';
};

export const useIsSuperAdmin = (): boolean => {
    const { user } = useUser();
    return user?.userType === 'SUPERADMIN';
};

export const useIsOnboarded = (): boolean => {
    const { user } = useUser();
    return user?.onboarded ?? false;
};

// Additional React Query hooks for advanced use cases
export const useUserQuery = () => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();

    return useQuery({
        queryKey: [USER_QUERY_KEY, clerkUser?.id],
        queryFn: async () => {
            if (!clerkUser?.id) {
                setUserIdHeader(null);
                return null;
            }

            const userData = await UserService.findOrCreateUser(clerkUser.id);
            const user: User = {
                ...userData,
                createdAt: new Date(userData.createdAt),
                updatedAt: new Date(userData.updatedAt),
            };

            setUserIdHeader(user.id);
            return user;
        },
        enabled: clerkLoaded && !!clerkUser?.id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    const { user: clerkUser } = useClerkUser();

    return useMutation({
        mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
            return await UserService.updateUser(userId, updates);
        },
        onSuccess: (updatedUserData) => {
            const updatedUser: User = {
                ...updatedUserData,
                createdAt: new Date(updatedUserData.createdAt),
                updatedAt: new Date(updatedUserData.updatedAt),
            };

            // Update the cache with the new user data
            queryClient.setQueryData([USER_QUERY_KEY, clerkUser?.id], updatedUser);
        },
        onError: (error) => {
            console.error('Error updating user:', error);
        },
    });
};

// Hook to invalidate user cache
export const useInvalidateUser = () => {
    const queryClient = useQueryClient();
    const { user: clerkUser } = useClerkUser();

    return () => {
        queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, clerkUser?.id] });
    };
};
