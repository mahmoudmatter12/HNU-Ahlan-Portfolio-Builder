import { api } from "@/lib/axios";
import { DeleteUniversityData, University, UpdateUniversityData } from "@/types/uni";



export class UniService {
  static async getUniversity(): Promise<University> {
    const response = await api.get("/uni");
    return response.data;
  }

  static async updateUniversity(data: UpdateUniversityData): Promise<any> {
    const response = await api.post("/uni/edit", data);
    return response.data;
  }

  static async deleteUniversity(data: DeleteUniversityData): Promise<any> {
    const response = await api.post("/uni/delete", data);
    return response.data;
  }
}
