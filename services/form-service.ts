import { api } from "@/lib/axios";
import type {
  FormSection,
  FormField,
  CreateFormSection,
  UpdateFormSection,
  CreateFormField,
  CreateFormFieldData,
  UpdateFormField,
  FormCreationData,
} from "@/types/form";

export class FormService {
  // FORM SECTIONS
  // Get all form sections
  static async getFormSections(params?: { collegeId?: string }) {
    const res = await api.get<FormSection[]>("/forms/form-sections", {
      params,
    });
    return res.data;
  }

  // Get a single form section by ID
  static async getFormSection(id: string) {
    const res = await api.get<FormSection>(`/forms/form-sections/${id}`);
    return res.data;
  }

  // Get form section with fields
  static async getFormSectionWithFields(id: string) {
    const res = await api.get<FormSection>(`/forms/${id}/with-sections`);
    return res.data;
  }

  // Create a new form section
  static async createFormSection(data: CreateFormSection) {
    const res = await api.post<FormSection>(
      "/forms/form-sections/create",
      data
    );
    return res.data;
  }

  // Update a form section
  static async updateFormSection(id: string, data: UpdateFormSection) {
    const res = await api.put<FormSection>(
      `/forms/form-sections/${id}/update`,
      data
    );
    return res.data;
  }

  // Delete a form section
  static async deleteFormSection(id: string) {
    const res = await api.delete<{ message: string }>(
      `/forms/form-sections/${id}/delete`
    );
    return res.data;
  }

  // Get all forms with fields
  static async getFormsWithFields(params?: {
    collegeId?: string;
    page?: number;
    limit?: number;
  }) {
    const res = await api.get<{
      forms: FormSection[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/forms/with-feilds", { params });
    return res.data;
  }

  // FORM FIELDS
  // Get all form fields
  static async getFormFields(params?: { formSectionId?: string }) {
    const res = await api.get<FormField[]>("/forms/form-feilds", { params });
    return res.data;
  }

  // Get a single form field by ID
  static async getFormField(id: string) {
    const res = await api.get<FormField>(`/forms/form-feilds/${id}`);
    return res.data;
  }

  // Create a new form field
  static async createFormField(data: CreateFormField) {
    const res = await api.post<FormField>("/forms/form-feilds/create", data);
    return res.data;
  }

  // Update a form field
  static async updateFormField(id: string, data: UpdateFormField) {
    const res = await api.put<FormField>(
      `/forms/form-feilds/${id}/update`,
      data
    );
    return res.data;
  }

  // Delete a form field
  static async deleteFormField(id: string) {
    const res = await api.delete<{ message: string }>(
      `/forms/form-feilds/${id}/delete`
    );
    return res.data;
  }

  // COMPREHENSIVE FORM CREATION
  // Create a complete form with fields in one transaction
  static async createCompleteForm(data: FormCreationData) {
    try {
      // Step 1: Create the form section
      const formSection = await this.createFormSection(data.formSection);

      // Step 2: Create all fields for this form section
      const fieldPromises = data.fields.map((field, index) => {
        const fieldData: CreateFormField = {
          ...field,
          formSectionId: formSection.id,
          order: field.order ?? index,
        };
        return this.createFormField(fieldData);
      });

      const fields = await Promise.all(fieldPromises);

      // Step 3: Return the complete form with fields
      return {
        ...formSection,
        fields,
      };
    } catch (error) {
      console.error("Error creating complete form:", error);
      throw error;
    }
  }

  // Get form statistics
  static async getFormStats(formSectionId: string) {
    const res = await api.get<{
      totalSubmissions: number;
      totalFields: number;
      recentSubmissions: any[];
    }>(`/forms/${formSectionId}/info`);
    return res.data;
  }

  // Submit form data
  static async submitForm(
    formSectionId: string,
    data: {
      data: Record<string, any>;
      collegeId?: string;
    }
  ) {
    const res = await api.post(`/forms/${formSectionId}/submit`, data);
    return res.data;
  }

  // Toggle form active status
  static async toggleFormActive(id: string) {
    const res = await api.get(`/forms/${id}/active`);
    return res.data;
  }

  // Get form submissions
  static async getFormSubmissions(
    formSectionId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ) {
    const res = await api.get(`/forms/${formSectionId}/submissions`, {
      params,
    });
    return res.data.submissions || [];
  }
}
