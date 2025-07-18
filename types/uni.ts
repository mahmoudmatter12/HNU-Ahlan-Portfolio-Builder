import { College } from "./Collage";

export interface University {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  socialMedia: Record<string, any> | null;
  description: string | null;
  newsItems: Record<string, any> | null;
  colleges: College[];
  createdAt: Date;
  updatedAt: Date;
}
