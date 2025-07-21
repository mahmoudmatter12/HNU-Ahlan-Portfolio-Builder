import { api } from "@/lib/axios";
import type {
  FAQData,
  CreateFAQItemRequest,
  UpdateFAQItemRequest,
  FAQImportData,
  FAQGenerationRequest,
} from "@/types/faq";

export class FAQService {
  // Get FAQ data for a college
  static async getFAQ(collegeId: string): Promise<FAQData> {
    const response = await api.get(`/collage/${collegeId}/faq`);
    return response.data;
  }

  // Update FAQ data for a college
  static async updateFAQ(
    collegeId: string,
    faqData: FAQData
  ): Promise<FAQData> {
    const response = await api.put(`/collage/${collegeId}/faq`, faqData);
    return response.data;
  }

  // Add a single FAQ item
  static async addFAQItem(
    collegeId: string,
    item: CreateFAQItemRequest
  ): Promise<FAQData> {
    const response = await api.post(`/collage/${collegeId}/faq/items`, item);
    return response.data;
  }

  // Update a single FAQ item
  static async updateFAQItem(
    collegeId: string,
    itemId: string,
    item: UpdateFAQItemRequest
  ): Promise<FAQData> {
    const response = await api.put(
      `/collage/${collegeId}/faq/items/${itemId}`,
      item
    );
    return response.data;
  }

  // Delete a single FAQ item
  static async deleteFAQItem(
    collegeId: string,
    itemId: string
  ): Promise<FAQData> {
    const response = await api.delete(
      `/collage/${collegeId}/faq/items/${itemId}`
    );
    return response.data;
  }

  // Reorder FAQ items
  static async reorderFAQItems(
    collegeId: string,
    itemIds: string[]
  ): Promise<FAQData> {
    const response = await api.put(`/collage/${collegeId}/faq/reorder`, {
      itemIds,
    });
    return response.data;
  }

  // Import FAQ from CSV/Excel
  static async importFAQ(
    collegeId: string,
    data: FAQImportData[]
  ): Promise<FAQData> {
    const response = await api.post(`/collage/${collegeId}/faq/import`, {
      items: data,
    });
    return response.data;
  }

  // Generate FAQ form
  static async generateFAQForm(request: FAQGenerationRequest): Promise<any> {
    const response = await api.post(
      `/collage/${request.collegeId}/faq/generate-form`,
      request
    );
    return response.data;
  }

  // Get FAQ form submissions
  static async getFAQSubmissions(collegeId: string): Promise<any[]> {
    const response = await api.get(`/collage/${collegeId}/faq/submissions`);
    return response.data;
  }

  // Get FAQ form submission count
  static async getFAQSubmissionCount(collegeId: string): Promise<number> {
    const response = await api.get(
      `/collage/${collegeId}/faq/submissions/count`
    );
    return response.data.count;
  }

  // Process FAQ form submission
  static async processFAQSubmission(
    collegeId: string,
    submissionId: string,
    action: "approve" | "reject",
    answers?: Record<string, string>
  ): Promise<FAQData> {
    const response = await api.put(
      `/collage/${collegeId}/faq/submissions/${submissionId}`,
      { action, answers }
    );
    return response.data;
  }

  static async getFormsForCOllageByIdForFAQ(id: string): Promise<any> {
    const response = await api.get(`/collage/${id}/faq/forms`);
    return response.data;
  }
}
