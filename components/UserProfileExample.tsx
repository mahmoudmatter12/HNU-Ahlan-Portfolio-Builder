"use client"

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    useUser,
    useCurrentUser,
    useUserLoading,
    useUserError,
    useIsAuthenticated,
    useIsAdmin,
    useIsSuperAdmin,
    useIsOnboarded,
    useUserQuery,
    useUpdateUserMutation,
    useInvalidateUser
} from '@/context/userContext';
import { User } from '@/types/user';
import { RefreshCw, Edit, Save, X, User as UserIcon, Shield, Crown, CheckCircle } from 'lucide-react';

export const UserProfileExample: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const queryClient = useQueryClient();

    // Basic context usage
    const { user, loading, error, refetchUser, updateUser } = useUser();

    // Convenience hooks
    const currentUser = useCurrentUser();
    const isLoading = useUserLoading();
    const userError = useUserError();
    const isAuthenticated = useIsAuthenticated();
    const isAdmin = useIsAdmin();
    const isSuperAdmin = useIsSuperAdmin();
    const isOnboarded = useIsOnboarded();

    // Advanced React Query hooks
    const userQuery = useUserQuery();
    const updateMutation = useUpdateUserMutation();
    const invalidateUser = useInvalidateUser();

    // Handle edit mode
    const handleEdit = () => {
        if (user) {
            setEditName(user.name || '');
            setIsEditing(true);
        }
    };

    // Handle save
    const handleSave = async () => {
        if (!user) return;

        try {
            // Method 1: Using context updateUser
            await updateUser({ name: editName });

            // Method 2: Using direct mutation (alternative approach)
            // await updateMutation.mutateAsync({
            //   userId: user.id,
            //   updates: { name: editName }
            // });

            setIsEditing(false);
            toast.success('User updated successfully!');
        } catch (error) {
            toast.error('Failed to update user');
            console.error('Update error:', error);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setIsEditing(false);
        setEditName('');
    };

    // Handle refresh
    const handleRefresh = async () => {
        try {
            await refetchUser();
            toast.success('User data refreshed!');
        } catch (error) {
            toast.error('Failed to refresh user data');
        }
    };

    // Handle cache invalidation
    const handleInvalidate = () => {
        invalidateUser();
        toast.success('Cache invalidated!');
    };

    // Optimistic update example
    const handleOptimisticUpdate = async () => {
        if (!user) return;

        const newName = `Updated ${Date.now()}`;

        // Optimistically update the cache
        queryClient.setQueryData(['user', user.id], (old: User | undefined) => {
            if (!old) return old;
            return { ...old, name: newName };
        });

        try {
            await updateUser({ name: newName });
            toast.success('Optimistic update successful!');
        } catch (error) {
            // Revert on error
            queryClient.invalidateQueries({ queryKey: ['user', user.id] });
            toast.error('Update failed, reverted changes');
        }
    };

    if (isLoading) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (userError) {
        return (
            <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50">
                <CardHeader>
                    <CardTitle className="text-red-800">Error Loading User</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-600 mb-4">{userError}</p>
                    <div className="space-x-2">
                        <Button onClick={handleRefresh} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                        <Button onClick={handleInvalidate} variant="outline" size="sm">
                            Invalidate Cache
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!isAuthenticated) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Not Authenticated</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">Please log in to view your profile.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main User Profile Card */}
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                            <CardTitle>User Profile</CardTitle>
                        </div>
                        <div className="flex items-center space-x-1">
                            {isSuperAdmin && (
                                <Badge variant="destructive" className="text-xs">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Super Admin
                                </Badge>
                            )}
                            {isAdmin && (
                                <Badge variant="secondary" className="text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Admin
                                </Badge>
                            )}
                            {isOnboarded && (
                                <Badge variant="default" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Onboarded
                                </Badge>
                            )}
                        </div>
                    </div>
                    <CardDescription>
                        React Query-powered user context example
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* User Info */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        {isEditing ? (
                            <div className="flex space-x-2">
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={handleSave} size="sm" disabled={updateMutation.isPending}>
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button onClick={handleCancel} variant="outline" size="sm">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-900">{user?.name || 'No name set'}</span>
                                <Button onClick={handleEdit} variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <span className="text-gray-900">{user?.email || 'No email'}</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">User Type</label>
                        <span className="text-gray-900">{user?.userType || 'Unknown'}</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Created</label>
                        <span className="text-gray-900">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Test React Query features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        className="w-full"
                        disabled={userQuery.isRefetching}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${userQuery.isRefetching ? 'animate-spin' : ''}`} />
                        {userQuery.isRefetching ? 'Refreshing...' : 'Refresh User Data'}
                    </Button>

                    <Button
                        onClick={handleInvalidate}
                        variant="outline"
                        className="w-full"
                    >
                        Invalidate Cache
                    </Button>

                    <Button
                        onClick={handleOptimisticUpdate}
                        variant="outline"
                        className="w-full"
                        disabled={updateMutation.isPending}
                    >
                        Optimistic Update
                    </Button>
                </CardContent>
            </Card>

            {/* Query State Card */}
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Query State</CardTitle>
                    <CardDescription>React Query internal state</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Is Loading:</span>
                        <Badge variant={userQuery.isLoading ? "default" : "secondary"}>
                            {userQuery.isLoading ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span>Is Fetching:</span>
                        <Badge variant={userQuery.isFetching ? "default" : "secondary"}>
                            {userQuery.isFetching ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span>Is Error:</span>
                        <Badge variant={userQuery.isError ? "destructive" : "secondary"}>
                            {userQuery.isError ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span>Is Success:</span>
                        <Badge variant={userQuery.isSuccess ? "default" : "secondary"}>
                            {userQuery.isSuccess ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span>Data Updated At:</span>
                        <span className="text-gray-600">
                            {userQuery.dataUpdatedAt ? new Date(userQuery.dataUpdatedAt).toLocaleTimeString() : 'Never'}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 