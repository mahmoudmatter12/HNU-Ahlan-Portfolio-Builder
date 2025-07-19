import { College } from "./Collage";

export interface Program {
  id: string;
  name: string;
  description: ProgramDescription[] | null;
  slug: string;
  college: College;
  collegeId: string;
}

export interface ProgramData {
  name: string;
  description: ProgramDescription[] | null;
  slug: string;
}

export interface ProgramDescription {
  title: string;
  description: string; // markdown
  image: ProgramDescriptionRecords[] | null;
  link: ProgramDescriptionRecords[] | null;
  video: ProgramDescriptionRecords[] | null;
}

export interface ProgramDescriptionRecords {
  title: string;
  content: string;
}
