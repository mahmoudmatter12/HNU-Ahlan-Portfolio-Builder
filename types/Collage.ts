import { CollegeType } from "@prisma/client";
import { University } from "./uni";
import { SectionType, SectionSettings } from "./section";
import { ProgramData } from "./program";
import { FAQData } from "./faq";

export interface CollegeStatistics {
  totalUsers: number;
  totalSections: number;
  totalForms: number;
  totalFormFields: number;
  totalFormSubmissions: number;
  activeForms: number;
  totalPrograms: number;
  averageSubmissionsPerForm: number;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  type: CollegeType;
  theme: Record<string, any> | null;
  createdById?: string;
  createdAt: Date;
  updatedAt: Date;
  galleryImages: Record<string, any> | null;
  User: CollegeUser[];
  sections: CollegeSection[];
  forms: CollegeFormSection[];
  formSubmissions: CollegeFormSubmission[];
  createdBy?: CollegeUser;
  university: University;
  programs: ProgramData[];
  faq?: Record<string, any> | null;
  socialMedia: SocialMediaLinks | null;
  collageLeaders?: CollageLeadersData | null;
  statistics?: CollegeStatistics;
  _count?: {
    users: number;
    sections: number;
    forms: number;
    formSubmissions: number;
    programs: number;
  };
}

export interface CreateCollageRequest {
  name: string;
  slug: string;
  type: CollegeType;
  theme: Record<string, any> | null;
  galleryImages: Record<string, any> | null;
  createdById?: string;
  logoUrl?: string;
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
  active: boolean;
  description?: string;
  _count?: {
    submissions: number;
    fields: number;
  };
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

export interface CustomLink {
  id: string;
  name: string;
  url: string;
  icon: string;
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
  email?: string;
  phone?: string;
  website?: string;
  customLinks?: CustomLink[];
  [key: string]: string | CustomLink[] | undefined;
}

export interface CollageLeader {
  id: string;
  name: string;
  image?: string;
  collage: string;
  year: string;
  program: string;
  whatsapp?: string;
  facebook?: string;
}

export interface CollageLeadersData {
  leaders: CollageLeader[];
}

export interface CollageWithMemberResponse {
  success: boolean;
  data: {
    createdCollages?: {
      count: number;
      collages: College[];
    };
    memberCollages?: {
      count: number;
      collages: College[];
    };
    totalCount: number;
  };
}
