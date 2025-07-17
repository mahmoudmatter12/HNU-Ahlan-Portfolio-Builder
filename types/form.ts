export interface FormSection {
  id: string;
  title: string;
  collegeId: string;
  createdAt: Date;
  updatedAt: Date;
  fields?: FormField[];
  submissions?: FormSubmission[];
  college?: {
    id: string;
    name: string;
    slug: string;
  };
  _count?: {
    fields: number;
    submissions: number;
  };
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  isRequired: boolean;
  options: string[];
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
  collegeId: string;
}

export interface UpdateFormSection {
  title?: string;
  collegeId?: string;
}

export interface CreateFormField {
  label: string;
  type: FormFieldType;
  isRequired?: boolean;
  options?: string[];
  formSectionId: string;
  order?: number;
}

export interface CreateFormFieldData {
  label: string;
  type: FormFieldType;
  isRequired?: boolean;
  options?: string[];
  order?: number;
}

export interface UpdateFormField {
  label?: string;
  type?: FormFieldType;
  isRequired?: boolean;
  options?: string[];
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
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Field type configurations
export const FIELD_TYPE_CONFIGS: Record<FormFieldType, FormFieldConfig> = {
  TEXT: {
    type: "TEXT",
    label: "Text Input",
    placeholder: "Enter text...",
    description: "Single line text input",
  },
  TEXTAREA: {
    type: "TEXTAREA",
    label: "Text Area",
    placeholder: "Enter text...",
    description: "Multi-line text input",
  },
  EMAIL: {
    type: "EMAIL",
    label: "Email Input",
    placeholder: "Enter email address...",
    description: "Email address input with validation",
  },
  NUMBER: {
    type: "NUMBER",
    label: "Number Input",
    placeholder: "Enter number...",
    description: "Numeric input",
  },
  SELECT: {
    type: "SELECT",
    label: "Dropdown Select",
    placeholder: "Select an option...",
    description: "Dropdown with predefined options",
    options: ["Option 1", "Option 2", "Option 3"],
  },
  CHECKBOX: {
    type: "CHECKBOX",
    label: "Checkbox Group",
    description: "Multiple choice checkboxes",
    options: ["Option 1", "Option 2", "Option 3"],
  },
  RADIO: {
    type: "RADIO",
    label: "Radio Buttons",
    description: "Single choice radio buttons",
    options: ["Option 1", "Option 2", "Option 3"],
  },
  DATE: {
    type: "DATE",
    label: "Date Picker",
    description: "Date selection input",
  },
  FILE: {
    type: "FILE",
    label: "File Upload",
    description: "File upload input",
  },
};
