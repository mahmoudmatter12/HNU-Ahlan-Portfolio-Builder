import { api } from "@/lib/axios";
import type {
  College,
  CollegeSection,
} from "@/types/Collage";
import { Program, ProgramData } from "@/types/program";

export class CollegeService {
  // Get all colleges
  static async getColleges(params?: { type?: string; createdById?: string }) {
    const res = await api.get<College[]>("/collage", { params });
    return res.data;
  }

  // Get a single college by ID
  static async getCollege(id: string) {
    const res = await api.get<College>(`/collage/${id}`);
    return res.data;
  }

  // Get a college by slug
  static async getCollegeBySlug(slug: string) {
    const res = await api.get<College>(`/collage/slug/${slug}`);
    return res.data;
  }

  // Create a new college
  static async createCollege(data: Partial<College>) {
    const res = await api.post<College>(`/collage/create`, data);
    return res.data;
  }

  // Update a college
  static async updateCollege(id: string, data: Partial<College>) {
    const res = await api.put<College>(`/collage/${id}/update`, data);
    return res.data;
  }

  // Delete a college
  static async deleteCollege(id: string) {
    const res = await api.delete<{ success: boolean }>(`/collage/${id}/delete`);
    return res.data;
  }

  // Get a college with all sections, forms, users, etc.
  static async getCollegeComplete(id: string) {
    const res = await api.get<College>(`/collage/${id}/complete`);
    return res.data;
  }

  // Get all colleges with their sections
  static async getCollegesWithSections() {
    const res = await api.get<College[]>(`/collage/with-sections`);
    return res.data;
  }

  // SECTION MANAGEMENT
  // Get all sections for a college
  static async getSections(collegeId: string) {
    const res = await api.get<CollegeSection[]>(
      `/collage/${collegeId}/sections`
    );
    return res.data;
  }

  // Add a section to a college
  static async addSection(collegeId: string, data: Partial<CollegeSection>) {
    const res = await api.post<CollegeSection>(
      `/collage/${collegeId}/sections`,
      data
    );
    return res.data;
  }

  // Update a section
  static async updateSection(
    collegeId: string,
    sectionId: string,
    data: Partial<CollegeSection>
  ) {
    const res = await api.put<CollegeSection>(
      `/collage/${collegeId}/sections/${sectionId}`,
      data
    );
    return res.data;
  }

  // Delete a section
  static async deleteSection(collegeId: string, sectionId: string) {
    const res = await api.delete<{ success: boolean }>(
      `/collage/${collegeId}/sections/${sectionId}`
    );
    return res.data;
  }

  // Bulk update sections
  static async bulkUpdateSections(
    collegeId: string,
    data: { sections: Partial<CollegeSection>[] }
  ) {
    const res = await api.post<CollegeSection[]>(
      `/collage/${collegeId}/sections/bulk`,
      data
    );
    return res.data;
  }

  // Reorder sections
  static async reorderSections(collegeId: string, data: { order: string[] }) {
    const res = await api.post<CollegeSection[]>(
      `/collage/${collegeId}/sections/reorder`,
      data
    );
    return res.data;
  }

  static async getPrograms(collegeId: string) {
    const res = await api.get<Program[]>(`/collage/${collegeId}/programs`);
    return res.data;
  }

  static async createProgram(collegeId: string, data: ProgramData) {
    const res = await api.post<Program>(`/collage/${collegeId}/programs`, data);
    return res.data;
  }

  static async updateProgram(
    collegeId: string,
    programId: string,
    data: ProgramData
  ) {
    const res = await api.put<Program>(
      `/collage/${collegeId}/programs/${programId}`,
      data
    );
    return res.data;
  }

  static async deleteProgram(collegeId: string, programId: string) {
    const res = await api.delete<{ message: string }>(
      `/collage/${collegeId}/programs/${programId}`
    );
    return res.data;
  }
}
