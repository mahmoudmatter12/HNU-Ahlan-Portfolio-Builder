export interface College {
  id: string;
  name: string;
  slug: string;
  type: "TECHNICAL" | "MEDICAL" | "ARTS" | "OTHER";
  theme: Record<string, any>;
  createdById?: string;
  createdAt: Date;
  updatedAt: Date;
  galleryImages: Record<string, any>;
  projects: ProjectData;
  users: CollegeUser[];
  sections: CollegeSection[];
  forms: CollegeFormSection[];
  formSubmissions: CollegeFormSubmission[];
  createdBy?: CollegeUser;
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
  type: "TECHNICAL" | "MEDICAL" | "ARTS" | "OTHER";
  theme: Record<string, any>;
  galleryImages: Record<string, any>;
  projects: ProjectData;
  createdById?: string;
}

export interface CollegeSection {
  id: string;
  title: string;
  order: number;
  content: string;
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

export interface ProjectImage {
  id: string;
  url: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: ProjectImage[];
}

export interface ProjectData {
  projects: Project[];
}
