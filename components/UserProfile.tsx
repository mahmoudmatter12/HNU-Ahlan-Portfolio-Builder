"use client"

import React from 'react';
import { useUser, useCurrentUser, useIsAdmin, useIsSuperAdmin, useIsOnboarded } from '@/context/userContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const UserProfile: React.FC = () => {
    const { user, loading, error, refetchUser } = useUser();
    const currentUser = useCurrentUser();
    console.log("currentUser", currentUser);
    const isAdmin = useIsAdmin();
    const isSuperAdmin = useIsSuperAdmin();
    const isOnboarded = useIsOnboarded();

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="animate-pulse bg-gray-200 rounded-full h-12 w-12"></div>
                        <div className="space-y-2">
                            <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                            <div className="animate-pulse bg-gray-200 h-3 w-24 rounded"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-red-600">Error: {error}</div>
                    <Button onClick={refetchUser} className="mt-2">
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!user) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-gray-500">No user data available</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <span>User Profile</span>
                    <div className="flex space-x-1">
                        {isAdmin && <Badge variant="secondary">Admin</Badge>}
                        {isSuperAdmin && <Badge variant="destructive">Super Admin</Badge>}
                        {isOnboarded && <Badge variant="default">Onboarded</Badge>}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{user.name || 'No name'}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm font-medium">User Type:</span>
                        <span className="text-sm">{user.userType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm font-medium">Onboarded:</span>
                        <span className="text-sm">{user.onboarded ? 'Yes' : 'No'}</span>
                    </div>
                    {user.collegeId && (
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">College ID:</span>
                            <span className="text-sm">{user.collegeId}</span>
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <Button onClick={refetchUser} variant="outline" size="sm">
                        Refresh Data
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}; 