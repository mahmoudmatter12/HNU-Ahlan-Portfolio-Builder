import { api } from "@/lib/axios";
import type {
  College,
  CollegeSection,
  Project,
  ProjectData,
} from "@/types/Collage";

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
    console.log("data", data);
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

  // PROJECT MANAGEMENT
  // Get projects for a college
  static async getProjects(collegeId: string) {
    const college = await this.getCollege(collegeId);
    return college.projects || { projects: [] };
  }

  // Add a project to a college
  static async addProject(collegeId: string, project: Project) {
    const college = await this.getCollege(collegeId);
    const currentProjects = college.projects || { projects: [] };
    
    const updatedProjects: ProjectData = {
      projects: [...currentProjects.projects, project]
    };

    const res = await api.put<College>(`/collage/${collegeId}/update`, {
      projects: updatedProjects
    });
    return res.data;
  }

  // Update a project in a college
  static async updateProject(collegeId: string, projectId: string, updatedProject: Project) {
    const college = await this.getCollege(collegeId);
    const currentProjects = college.projects || { projects: [] };
    
    const updatedProjects: ProjectData = {
      projects: currentProjects.projects.map(project => 
        project.id === projectId ? updatedProject : project
      )
    };

    const res = await api.put<College>(`/collage/${collegeId}/update`, {
      projects: updatedProjects
    });
    return res.data;
  }

  // Delete a project from a college
  static async deleteProject(collegeId: string, projectId: string) {
    const college = await this.getCollege(collegeId);
    const currentProjects = college.projects || { projects: [] };
    
    const updatedProjects: ProjectData = {
      projects: currentProjects.projects.filter(project => project.id !== projectId)
    };

    const res = await api.put<College>(`/collage/${collegeId}/update`, {
      projects: updatedProjects
    });
    return res.data;
  }

  // Update all projects for a college
  static async updateProjects(collegeId: string, projectData: ProjectData) {
    const res = await api.put<College>(`/collage/${collegeId}/update`, {
      projects: projectData
    });
    return res.data;
  }

  // Additional methods for forms, users, etc. can be added similarly
}
