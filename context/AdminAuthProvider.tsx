"use client";
import { useCurrentUser, useUserLoading } from '@/context/userContext';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface AdminProviderProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    redirectTo?: string;
    showAccessDenied?: boolean;
}

function AdminAuthProvider({
    children,
    fallback,
    redirectTo,
    showAccessDenied = true
}: AdminProviderProps) {
    const { isLoaded, isSignedIn } = useUser();
    const user = useCurrentUser();
    const loading = useUserLoading();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait for user data to load
        if (!isLoaded || loading) return;

        // If user is not signed in and we should redirect
        if (!isSignedIn && redirectTo) {
            router.push(redirectTo);
            return;
        }

        // If user is signed in but not admin and we should redirect
        if (isSignedIn && user?.userType !== "ADMIN" && user?.userType !== "SUPERADMIN" && redirectTo) {
            router.push(redirectTo);
            return;
        }

        setIsChecking(false);
    }, [isLoaded, isSignedIn, user, router, redirectTo, loading]);

    // Show loading state while checking authentication
    if (!isLoaded || isChecking || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
                </div>
            </div>
        );
    }

    // User is not signed in
    if (!isSignedIn) {
        if (fallback) return <>{fallback}</>;

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication Required</h1>
                    <p className="text-gray-600 dark:text-gray-400">Please sign in to access this area.</p>
                    <button
                        onClick={() => router.push('login')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    // User is signed in but not admin
    if (user?.userType !== "ADMIN" && user?.userType !== "SUPERADMIN") {
        if (fallback) return <>{fallback}</>;

        if (!showAccessDenied) return null;

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-center space-y-4 p-8 max-w-md">
                    <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        You dont have permission to access this admin area. Please contact your administrator if you believe this is an error.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // User is admin - render children
    return (
        <div className="admin-provider">
            {children}
        </div>
    );
}

export default AdminAuthProvider;