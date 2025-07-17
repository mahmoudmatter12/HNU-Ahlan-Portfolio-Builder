export type ProjectImage = {
  id: string;
  url: string;
  description: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  images: ProjectImage[];
};

export type ProjectData = {
  projects: Project[];
};
