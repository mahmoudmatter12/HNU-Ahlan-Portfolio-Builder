export interface FormSection {
  id: string;
  title: string;
  description?: string;
  active: boolean;
  collegeId: string;
  createdAt: Date;
  updatedAt: Date;
  fields?: FormField[];
  submissions?: FormSubmission[];
  college?: { id: string; name: string; slug: string };
  _count?: { fields: number; submissions: number };
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  isRequired: boolean;
  options: string[];
  validation?: FormFieldValidation;
  formSectionId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  formSection?: FormSection;
}

export interface FormSubmission {
  id: string;
  data: Record<string, any>;
  formSectionId: string;
  collegeId: string;
  submittedAt: Date;
  formSection?: FormSection;
  college?: {
    id: string;
    name: string;
    slug: string;
  };
}

export type FormFieldType =
  | "TEXT"
  | "TEXTAREA"
  | "EMAIL"
  | "NUMBER"
  | "SELECT"
  | "CHECKBOX"
  | "RADIO"
  | "DATE"
  | "FILE";

// Create interfaces
export interface CreateFormSection {
  title: string;
  active?: boolean;
  collegeId: string;
}

export interface UpdateFormSection {
  title?: string;
  active?: boolean;
  collegeId?: string;
}

export interface CreateFormField {
  label: string;
  type: FormFieldType;
  isRequired?: boolean;
  options?: string[];
  validation?: FormFieldValidation;
  formSectionId: string;
  order?: number;
}

export interface CreateFormFieldData {
  label: string;
  type: FormFieldType;
  isRequired?: boolean;
  options?: string[];
  validation?: FormFieldValidation;
  order?: number;
}

export interface UpdateFormField {
  label?: string;
  type?: FormFieldType;
  isRequired?: boolean;
  options?: string[];
  validation?: FormFieldValidation;
  order?: number;
}

// Form creation flow interfaces
export interface FormCreationData {
  formSection: CreateFormSection;
  fields: CreateFormFieldData[];
}

export interface FormFieldConfig {
  type: FormFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  isRequired?: boolean;
  options?: string[];
  validation?: FormFieldValidation;
  hasValidation?: boolean; // Whether this field type supports validation
}

// Enhanced validation interface
export interface FormFieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  customValidation?: string; // regex or custom validation rule
  customMessage?: string;
}

// Validation suggestions for different field types
export const VALIDATION_SUGGESTIONS = {
  TEXT: [
    {
      name: "Name (Letters Only)",
      validation: {
        pattern: "^[A-Za-z\\s]+$",
        patternMessage: "Name can only contain letters and spaces",
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      name: "Phone Number",
      validation: {
        pattern: "^[+]?[0-9]{10,15}$",
        patternMessage: "Please enter a valid phone number",
      },
    },
    {
      name: "National ID (10 digits)",
      validation: {
        pattern: "^[0-9]{10}$",
        patternMessage: "National ID must be exactly 10 digits",
      },
    },
    {
      name: "Username (Alphanumeric)",
      validation: {
        pattern: "^[a-zA-Z0-9_]{3,20}$",
        patternMessage:
          "Username must be 3-20 characters, letters, numbers, and underscores only",
      },
    },
    {
      name: "Short Text (2-100 chars)",
      validation: {
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      name: "Long Text (10-500 chars)",
      validation: {
        minLength: 10,
        maxLength: 500,
      },
    },
  ],
  TEXTAREA: [
    {
      name: "Short Description (10-200 chars)",
      validation: {
        minLength: 10,
        maxLength: 200,
      },
    },
    {
      name: "Long Description (50-1000 chars)",
      validation: {
        minLength: 50,
        maxLength: 1000,
      },
    },
    {
      name: "Essay (100-2000 chars)",
      validation: {
        minLength: 100,
        maxLength: 2000,
      },
    },
  ],
  NUMBER: [
    {
      name: "Age (18-65)",
      validation: {
        min: 18,
        max: 65,
      },
    },
    {
      name: "Student ID (1000-999999)",
      validation: {
        min: 1000,
        max: 999999,
      },
    },
    {
      name: "Percentage (0-100)",
      validation: {
        min: 0,
        max: 100,
      },
    },
    {
      name: "Price (0-10000)",
      validation: {
        min: 0,
        max: 10000,
      },
    },
    {
      name: "Quantity (1-1000)",
      validation: {
        min: 1,
        max: 1000,
      },
    },
  ],
  FILE: [
    {
      name: "Profile Images",
      validation: {
        allowedFileTypes: [".jpg", ".jpeg", ".png"],
        maxFileSize: 2 * 1024 * 1024, // 2MB
      },
    },
    {
      name: "Documents (PDF, DOC)",
      validation: {
        allowedFileTypes: [".pdf", ".doc", ".docx"],
        maxFileSize: 5 * 1024 * 1024, // 5MB
      },
    },
    {
      name: "Images Only",
      validation: {
        allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        maxFileSize: 3 * 1024 * 1024, // 3MB
      },
    },
    {
      name: "Small Files (1MB max)",
      validation: {
        allowedFileTypes: [".jpg", ".png", ".pdf", ".txt"],
        maxFileSize: 1 * 1024 * 1024, // 1MB
      },
    },
    {
      name: "Large Files (10MB max)",
      validation: {
        allowedFileTypes: [".pdf", ".doc", ".docx", ".zip", ".rar"],
        maxFileSize: 10 * 1024 * 1024, // 10MB
      },
    },
  ],
} as const;

// File type categories for easier selection
export const FILE_TYPE_CATEGORIES = {
  Images: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"],
  Documents: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
  Spreadsheets: [".xls", ".xlsx", ".csv"],
  Presentations: [".ppt", ".pptx"],
  Archives: [".zip", ".rar", ".7z", ".tar", ".gz"],
  Videos: [".mp4", ".avi", ".mov", ".wmv", ".flv"],
  Audio: [".mp3", ".wav", ".flac", ".aac", ".ogg"],
} as const;

// Field type configurations
export const FIELD_TYPE_CONFIGS: Record<FormFieldType, FormFieldConfig> = {
  TEXT: {
    type: "TEXT",
    label: "Text Input",
    placeholder: "Enter text...",
    description: "Single line text input for short responses",
    hasValidation: true,
  },
  TEXTAREA: {
    type: "TEXTAREA",
    label: "Text Area",
    placeholder: "Enter text...",
    description: "Multi-line text input for longer responses",
    hasValidation: true,
  },
  EMAIL: {
    type: "EMAIL",
    label: "Email Input",
    placeholder: "Enter email address...",
    description: "Email address input with automatic validation",
    hasValidation: true,
  },
  NUMBER: {
    type: "NUMBER",
    label: "Number Input",
    placeholder: "Enter number...",
    description: "Numeric input with min/max validation",
    hasValidation: true,
  },
  SELECT: {
    type: "SELECT",
    label: "Dropdown Select",
    placeholder: "Select an option...",
    description: "Dropdown with predefined options",
    options: ["Option 1", "Option 2", "Option 3"],
    hasValidation: false,
  },
  CHECKBOX: {
    type: "CHECKBOX",
    label: "Checkbox Group",
    description: "Multiple choice checkboxes",
    options: ["Option 1", "Option 2", "Option 3"],
    hasValidation: false,
  },
  RADIO: {
    type: "RADIO",
    label: "Radio Buttons",
    description: "Single choice radio buttons",
    options: ["Option 1", "Option 2", "Option 3"],
    hasValidation: false,
  },
  DATE: {
    type: "DATE",
    label: "Date Picker",
    description: "Date selection input with range validation",
    hasValidation: true,
  },
  FILE: {
    type: "FILE",
    label: "File Upload",
    description: "File upload with type and size validation",
    hasValidation: true,
  },
};
