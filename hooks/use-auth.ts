import { useUser } from "@/context/userContext";
import { useAuth } from "@clerk/nextjs";

export const useAuthStatus = () => {
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { user, loading: userLoading } = useUser();

  function isCollageCreator(slug: string) {
    if (user?.userType === "SUPERADMIN" || user?.userType === "OWNER")
      return true;
    if (
      user?.collegesCreated?.some(
        (collage) => collage.slug.toLowerCase() === slug.toLowerCase()
      )
    )
      return true;
    return false;
  }
  // if the user is a member of this collage so the collage will the ther userId in tue users and the user will have the collageId in the CollageId
  function isMemberOfCollage(collageId: string) {
    if (user?.collegeId === collageId) return true;
    return false;
  }

  function canViewCollage(collageId: string, slug: string) {
    if (user?.userType === "SUPERADMIN" || user?.userType === "OWNER") return true;
    if (isMemberOfCollage(collageId) || isCollageCreator(slug)) return true;
    return false;
  }

  return {
    // Authentication status
    isAuthenticated: isSignedIn && !!user,
    isSignedIn,
    isLoading: !clerkLoaded || userLoading,

    // User data
    user,

    // Permission checks
    isAdmin: user?.userType !== "GUEST" && user !== undefined,
    isSuperAdmin: user?.userType === "SUPERADMIN" || user?.userType === "OWNER",
    isGuest: user?.userType === "GUEST",
    isOwner: user?.userType === "OWNER",

    // Include the function itself, not its execution
    isCollageCreator,
    isMemberOfCollage,
    canViewCollage,
    // Additional checks
    isOnboarded: user?.onboarded ?? false,
  };
};
