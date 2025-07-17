import { College } from "./Collage";

export interface Section {
  id: string;
  title: string;
  order: number;
  content: string;
  collegeId: College;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSection {
  title: string;
  order: number;
  content: string;
  collegeId: string;
}

export interface UpdateSection {
  title?: string;
  order?: number;
  content?: string;
}

export interface ReorderSectionRequest {
  id: string;
  order: number;
}
