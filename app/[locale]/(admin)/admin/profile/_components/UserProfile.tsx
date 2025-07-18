"use client"

import React from 'react';
import { useUser, useIsAdmin, useIsSuperAdmin, useIsOnboarded } from '@/context/userContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Building, Users, FileText, Image } from 'lucide-react';

export const UserProfile: React.FC = () => {
    const { user, loading, error, refetchUser } = useUser();
    const isAdmin = useIsAdmin();
    const isSuperAdmin = useIsSuperAdmin();
    const isOnboarded = useIsOnboarded();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="animate-pulse bg-slate-600 rounded-full h-16 w-16"></div>
                                <div className="space-y-2">
                                    <div className="animate-pulse bg-slate-600 h-6 w-48 rounded"></div>
                                    <div className="animate-pulse bg-slate-600 h-4 w-32 rounded"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                            <div className="text-red-400">Error: {error}</div>
                            <Button onClick={refetchUser} className="mt-4 bg-red-600 hover:bg-red-700">
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                            <div className="text-slate-400">No user data available</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }


    // Handle image URL - ensure it's a valid URL
    const getImageUrl = (imageUrl: string | undefined) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) return imageUrl;
        if (imageUrl.startsWith('/')) return imageUrl;
        return imageUrl;
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* User Profile Card */}
                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="border-b border-slate-700">
                        <CardTitle className="flex items-center justify-between text-slate-100">
                            <span className="text-2xl font-bold">My Profile</span>
                            <div className="flex space-x-2">
                                {isAdmin && <Badge variant="secondary" className="bg-blue-600 text-white">Admin</Badge>}
                                {isSuperAdmin && <Badge variant="destructive" className="bg-red-600">Super Admin</Badge>}
                                {isOnboarded && <Badge variant="default" className="bg-green-600">Onboarded</Badge>}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-start space-x-6">
                            <Avatar className="h-20 w-20 border-4 border-slate-600">
                                <AvatarImage
                                    src={getImageUrl(user.image)}
                                    alt={user.name || 'User avatar'}
                                    className="object-cover"
                                    onError={(e) => {
                                        console.log('Avatar image failed to load:', user.image);
                                        e.currentTarget.style.display = 'none';
                                    }}
                                    onLoad={() => console.log('Avatar image loaded successfully:', user.image)}
                                />
                                <AvatarFallback className="bg-slate-600 text-slate-200 text-xl font-semibold">
                                    {user.name?.charAt(0) || user.email.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-100">{user.name || 'No name'}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <p className="text-slate-300">{user.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm text-slate-300">
                                            Member since {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm text-slate-300">
                                            {user.userType}
                                        </span>
                                    </div>
                                    {user.collegeId && (
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm text-slate-300">
                                                College ID: {user.collegeId}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* User's Created Collages */}
                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="border-b border-slate-700">
                        <CardTitle className="flex items-center space-x-2 text-slate-100">
                            <Building className="h-5 w-5" />
                            <span>My Created Collages</span>
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                                {user.collegesCreated?.length || 0}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {user.collegesCreated && user.collegesCreated.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {user.collegesCreated.map((college) => (
                                    <Card key={college.id} className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors">
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <h4 className="font-semibold text-slate-100 truncate">{college.name}</h4>
                                                    <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                                                        {college.type}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <Users className="h-3 w-3 text-slate-400" />
                                                        <span className="text-slate-300">
                                                            {college._count?.users || 0} users
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="h-3 w-3 text-slate-400" />
                                                        <span className="text-slate-300">
                                                            {college._count?.sections || 0} sections
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Image className="h-3 w-3 text-slate-400" />
                                                        <span className="text-slate-300">
                                                            {college._count?.forms || 0} forms
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-slate-400">
                                                    Created: {new Date(college.createdAt).toLocaleDateString()}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full border-slate-500 text-slate-300 hover:bg-slate-600"
                                                    onClick={() => window.open(`/${college.slug}`, '_blank')}
                                                >
                                                    View Collage
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Building className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                                <p className="text-slate-400 mb-2">No collages created yet</p>
                                <p className="text-sm text-slate-500">Start creating your first collage to see it here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}; 