export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  image?: string;
  onboarded: boolean;
  userType: "ADMIN" | "SUPERADMIN";
  collegeId?: string;
  createdAt: Date;
  updatedAt: Date;
}
