import { CollegeType } from "@prisma/client";
import { University } from "./uni";
import { SectionType, SectionSettings } from "./section";
import { ProgramData } from "./program";

export interface College {
  id: string;
  name: string;
  slug: string;
  type: CollegeType;
  theme: Record<string, any> | null;
  createdById?: string;
  createdAt: Date;
  updatedAt: Date;
  galleryImages: Record<string, any> | null;
  users: CollegeUser[];
  sections: CollegeSection[];
  forms: CollegeFormSection[];
  formSubmissions: CollegeFormSubmission[];
  createdBy?: CollegeUser;
  university: University;
  programs: ProgramData;
  faq?: Record<string, any> | null;
  socialMedia: SocialMediaLinks | null;
  _count?: {
    users: number;
    sections: number;
    forms: number;
    formSubmissions: number;
  };
}

export interface CreateCollageRequest {
  name: string;
  slug: string;
  type: CollegeType;
  theme: Record<string, any> | null;
  galleryImages: Record<string, any> | null;
  createdById?: string;
}

export interface CollegeSection {
  id: string;
  title: string;
  sectionType: SectionType;
  content?: string;
  order: number;
  settings?: SectionSettings;
  collegeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollegeFormSection {
  id: string;
  title: string;
  collegeId: string;
  createdAt: Date;
  updatedAt: Date;
  fields?: CollegeFormField[];
  submissions?: CollegeFormSubmission[];
}

export interface CollegeFormField {
  id: string;
  label: string;
  type:
    | "TEXT"
    | "TEXTAREA"
    | "EMAIL"
    | "NUMBER"
    | "SELECT"
    | "CHECKBOX"
    | "RADIO"
    | "DATE"
    | "FILE";
  isRequired: boolean;
  options: string[];
  formSectionId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollegeFormSubmission {
  id: string;
  formSectionId: string;
  collegeId: string;
  data: Record<string, any>;
  submittedAt: Date;
}

export interface CollegeUser {
  id: string;
  email: string;
  name?: string;
  clerkId?: string;
  userType: "ADMIN" | "SUPERADMIN";
  collegeId?: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  description: string;
}

export interface GalleryEvent {
  id: string;
  eventName: string;
  eventDate: string;
  description: string;
  images: GalleryImage[];
}

export interface GalleryData {
  events: GalleryEvent[];
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
