import { api } from "@/lib/axios";

interface GetProgramsOptions {
  slug?: string;
  collageId?: string;
  oneOnly?: boolean;
  depSlug?: string;
  includeCollage?: boolean;
}

export class ProgramService {
  static async getPrograms(options: GetProgramsOptions) {
    const { slug, collageId, oneOnly, depSlug, includeCollage } = options;

    // Validate input
    if (slug && collageId) {
      throw new Error("Only one of slug or collageId can be provided");
    }

    if (!slug && !collageId) {
      throw new Error("Either slug or collageId must be provided");
    }

    const response = await api.get("/collage/programs", {
      params: {
        slug,
        collageId,
        oneOnly,
        depSlug,
        includeCollage,
      },
    });

    return response.data;
  }
}
