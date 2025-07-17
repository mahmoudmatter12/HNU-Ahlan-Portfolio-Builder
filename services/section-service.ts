import { api } from "@/lib/axios";
import {
  CreateSection,
  ReorderSectionRequest,
  UpdateSection,
} from "@/types/section";

export class SectionService {
  async createSection(section: CreateSection) {
    const res = await api.post("/section/create", section);
    return res.data;
  }

  async updateSection(id: string, section: UpdateSection) {
    const res = await api.put(`/section/${id}/update`, section);
    return res.data;
  }

  async deleteSection(id: string) {
    const res = await api.delete(`/section/${id}/delete`);
    return res.data;
  }

  async reorderSections(sections: ReorderSectionRequest[]) {
    const res = await api.post("/section/reorder", sections);
    return res.data;
  }
}
