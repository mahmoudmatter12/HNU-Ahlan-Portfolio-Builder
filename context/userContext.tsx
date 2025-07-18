"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { UserService } from '@/services/user-service';
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

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        if (!clerkUser?.id) {
            setUser(null);
            setLoading(false);
            setUserIdHeader(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Use find-or-create instead of just get current user
            const userData = await UserService.findOrCreateUser(clerkUser.id);
            // Convert date strings to Date objects
            const user: User = {
                ...userData,
                createdAt: new Date(userData.createdAt),
                updatedAt: new Date(userData.updatedAt),
            };

            setUser(user);
            setUserIdHeader(user.id);
        } catch (err) {
            console.error('Error fetching user:', err);
            setError('Failed to fetch user data');
            setUser(null);
            setUserIdHeader(null);
        } finally {
            setLoading(false);
        }
    };

    const refetchUser = async () => {
        await fetchUser();
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);

            const updatedUserData = await UserService.updateUser(user.id, updates);

            // Convert date strings to Date objects
            const updatedUser: User = {
                ...updatedUserData,
                createdAt: new Date(updatedUserData.createdAt),
                updatedAt: new Date(updatedUserData.updatedAt),
            };

            setUser(updatedUser);
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user data');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clerkLoaded) {
            fetchUser();
        }
    }, [clerkUser?.id, clerkLoaded]);

    const value: UserContextType = {
        user,
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
