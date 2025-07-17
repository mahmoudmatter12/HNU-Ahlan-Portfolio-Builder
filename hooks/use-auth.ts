import { useUser } from "@/context/userContext";
import { useAuth } from "@clerk/nextjs";

export const useAuthStatus = () => {
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { user, loading: userLoading } = useUser();

  return {
    // Authentication status
    isAuthenticated: isSignedIn && !!user,
    isSignedIn,
    isLoading: !clerkLoaded || userLoading,

    // User data
    user,

    // Permission checks
    isAdmin: user?.userType === "ADMIN" || user?.userType === "SUPERADMIN",
    isSuperAdmin: user?.userType === "SUPERADMIN",
    isGuest: user?.userType === "GUEST",

    // Additional checks
    isOnboarded: user?.onboarded ?? false,
  };
};
