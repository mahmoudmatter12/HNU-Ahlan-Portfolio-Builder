import { College } from "./Collage";

export interface UniversityContent {
  // Media content
  images: {
    id: string;
    url: string;
    alt: string;
    caption?: string;
  }[];
  videos: {
    id: string;
    title: string;
    url: string;
    description?: string;
  }[];

  // Text content
  admissionTerms: string;
  objectives: string;

  // Additional metadata
  lastUpdated: Date;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  socialMedia: Record<string, any> | null;
  newsItems: Record<string, any> | null;
  description: string | null;
  content: UniversityContent | null;
  colleges: College[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
  telegram?: string;
  whatsapp?: string;
  [key: string]: string | undefined;
}

export interface UpdateUniversityData {
  name?: string;
  slug?: string;
  logoUrl?: string;
  socialMedia?: SocialMediaLinks;
  description?: string;
  newsItems?: Record<string, any>;
  content?: UniversityContent;
  verificationStep?: "request" | "verify";
  verificationCode?: string;
}

export interface DeleteUniversityData {
  verificationStep?: "initiate" | "verify" | "confirm";
  verificationCode?: string;
  finalConfirmation?: string;
}
