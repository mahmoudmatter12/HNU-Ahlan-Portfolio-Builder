import { College } from "./Collage";

// Section type definitions
export type SectionType =
  | "HERO"
  | "ABOUT"
  | "STUDENT_ACTIVITIES"
  | "WHY_US"
  | "CUSTOM";

// Settings for different section types
export interface HeroSectionSettings {
  backgroundImage?: string;
  catchphrase?: string;
}

export interface AboutSectionSettings {
  images?: string[];
  title?: string;
  description?: string;
  showImages?: boolean;
}

export interface StudentActivitiesSectionSettings {
  images?: string[];
  title?: string;
  description?: string;
}

export interface WhyUsSectionSettings {
  images?: string[];
  title?: string;
  description?: string;
  features?: Array<{
    title: string;
    description: string;
  }>;
}

export interface CustomSectionSettings {
  customStyles?: Record<string, any>;
}

export type SectionSettings =
  | HeroSectionSettings
  | AboutSectionSettings
  | StudentActivitiesSectionSettings
  | WhyUsSectionSettings
  | CustomSectionSettings;

export interface Section {
  id: string;
  title: string;
  sectionType: SectionType;
  content?: string;
  order: number;
  settings?: SectionSettings;
  collegeId: string;
  college?: College;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSection {
  title: string;
  sectionType: SectionType;
  order: number;
  content?: string;
  settings?: SectionSettings;
  collegeId: string;
}

export interface UpdateSection {
  title?: string;
  sectionType?: SectionType;
  order?: number;
  content?: string;
  settings?: SectionSettings;
}

export interface ReorderSectionRequest {
  id: string;
  order: number;
}

// Section type configurations
export const SECTION_TYPE_CONFIGS = {
  HERO: {
    label: "Hero Section",
    description: "Main banner section with background image and catchphrase",
    icon: "🎯",
    defaultSettings: {
      backgroundImage: "",
      catchphrase: "",
    } as HeroSectionSettings,
  },
  ABOUT: {
    label: "About Section",
    description: "Information about the college with images and description",
    icon: "ℹ️",
    defaultSettings: {
      images: [],
      title: "",
      description: "",
    } as AboutSectionSettings,
  },
  STUDENT_ACTIVITIES: {
    label: "Student Activities",
    description: "Showcase student activities and events",
    icon: "🎓",
    defaultSettings: {
      images: [],
      title: "",
      description: "",
    } as StudentActivitiesSectionSettings,
  },
  WHY_US: {
    label: "Why Choose Us",
    description: "Highlight key features and benefits",
    icon: "⭐",
    defaultSettings: {
      images: [],
      title: "",
      description: "",
      features: [],
    } as WhyUsSectionSettings,
  },
  CUSTOM: {
    label: "Custom Section",
    description: "Custom content with markdown support",
    icon: "📝",
    defaultSettings: {
      customStyles: {},
    } as CustomSectionSettings,
  },
} as const;
