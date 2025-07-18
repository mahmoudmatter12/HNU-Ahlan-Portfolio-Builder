"use client"

import { useAuthStatus } from "@/hooks/use-auth";
import { useUser } from "@/context/userContext";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAuthPage() {
    const { isAuthenticated, isAdmin, isSuperAdmin, isGuest, isLoading } = useAuthStatus();
    const { user } = useUser();
    const { isSignedIn } = useAuth();

    const handleRefresh = () => {
        window.location.reload();
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading authentication status...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Authentication Test Page</CardTitle>
                        <CardDescription>
                            This page shows the current authentication status and user information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold">Clerk Authentication</h3>
                                <p>Signed In: <span className={isSignedIn ? "text-green-600" : "text-red-600"}>{isSignedIn ? "Yes" : "No"}</span></p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold">Database User</h3>
                                <p>Authenticated: <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>{isAuthenticated ? "Yes" : "No"}</span></p>
                            </div>
                        </div>

                        {user && (
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">User Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        {user.userType === "ADMIN" || user.userType === "SUPERADMIN" ? (
                                            <>
                                                <p><strong>ID:</strong> {user.id}</p>
                                                <p><strong>Clerk ID:</strong> {user.clerkId}</p>
                                            </>
                                        ) :
                                            <>
                                                <p><strong>ID:</strong> {user.id.slice(0, 5)}********</p>
                                                <p><strong>Clerk ID:</strong> {user.clerkId?.slice(0, 5)}********</p>
                                            </>
                                        }
                                        <p><strong>Email:</strong> {user.email}</p>
                                        <p><strong>Name:</strong> {user.name || "Not set"}</p>
                                    </div>
                                    <div>
                                        <p><strong>User Type:</strong> {user.userType}</p>
                                        <p><strong>Onboarded:</strong> {user.onboarded ? "Yes" : "No"}</p>
                                        <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-2">Permission Status</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm ${isAdmin ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                    Admin: {isAdmin ? "Yes" : "No"}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm ${isSuperAdmin ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                                    Super Admin: {isSuperAdmin ? "Yes" : "No"}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm ${isGuest ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                                    Guest: {isGuest ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-2">Quick Actions</h3>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => window.location.href = "/admin"}>
                                    Go to Admin Panel
                                </Button>
                                <Button variant="outline" onClick={() => window.location.href = "/"}>
                                    Go to Home
                                </Button>
                                {!isSignedIn && (
                                    <Button variant="outline" onClick={() => window.location.href = "login"}>
                                        Sign In
                                    </Button>
                                )}
                                <SignOutButton redirectUrl="/">
                                    <Button variant="outline">
                                        Sign Out
                                    </Button>
                                </SignOutButton>

                                <Button variant="outline" onClick={() => handleRefresh()}>
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 