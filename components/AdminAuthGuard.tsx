"use client"

import { useUser } from "@/context/userContext";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AdminAuthGuardProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireSuperAdmin?: boolean;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
    children,
    requireAdmin = true,
    requireSuperAdmin = false,
}) => {
    const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
    const { user, loading: userLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (clerkLoaded && !isSignedIn) {
            // Redirect to sign-in if not authenticated with Clerk
            router.push("login");
            return;
        }

        if (clerkLoaded && isSignedIn && !userLoading && !user) {
            // User is signed in with Clerk but not found in our DB
            // This shouldn't happen with find-or-create, but just in case
            console.error("User signed in with Clerk but not found in database");
            router.push("login");
            return;
        }

        if (clerkLoaded && isSignedIn && !userLoading && user) {
            // Check admin permissions
            if (requireSuperAdmin && user.userType !== "SUPERADMIN") {
                router.push("/"); // Redirect to home if not super admin
                return;
            }

            if (requireAdmin && user.userType === "GUEST") {
                router.push("/"); // Redirect to home if not admin
                return;
            }
        }
    }, [clerkLoaded, isSignedIn, userLoading, user, requireAdmin, requireSuperAdmin, router]);

    // Show loading while checking authentication
    if (!clerkLoaded || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    // Show loading while redirecting
    if (!isSignedIn || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Redirecting...</span>
                </div>
            </div>
        );
    }

    // Check final permissions
    if (requireSuperAdmin && user.userType !== "SUPERADMIN") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="text-gray-600">You need super admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    if (requireAdmin && user.userType === "GUEST") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="text-gray-600">You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    // User is authenticated and has proper permissions
    return <>{children}</>;
}; 