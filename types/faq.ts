export interface FAQItem {
  id: string;
  question: string;
  answer: string; // Markdown content
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQData {
  items: FAQItem[];
  title?: string;
  description?: string;
  lastUpdated: Date;
}

export interface CreateFAQItemRequest {
  question: string;
  answer: string;
  order?: number;
}

export interface UpdateFAQItemRequest {
  question?: string;
  answer?: string;
  order?: number;
}

export interface FAQImportData {
  question: string;
  answer: string;
}

export interface FAQFormSubmission {
  id: string;
  question: string;
  answer: string;
  submittedAt: Date;
  status: "pending" | "approved" | "rejected";
}

export interface FAQGenerationRequest {
  collegeId: string;
  collegeName: string;
  questions: string[];
}
