import type { College } from "@/types/Collage";

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  image?: string;
  onboarded: boolean;
  userType: "ADMIN" | "SUPERADMIN" | "GUEST";
  collegeId?: string;
  collegesCreated?: College[];
  createdAt: Date;
  updatedAt: Date;
}
