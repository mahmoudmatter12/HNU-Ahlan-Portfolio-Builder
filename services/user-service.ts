import { api } from "@/lib/axios";

export class UserService {
  static async getUsers() {
    const res = await api.get("/user");
    return res.data;
  }

  static async getCurrentUser(userId: string) {
    const res = await api.get(`/users/clerk/${userId}`);
    return res.data;
  }

  static async findOrCreateUser(clerkId: string) {
    const res = await api.post("/users/find-or-create", { clerkId });
    return res.data;
  }

  static async updateUser(userId: string, updates: any) {
    const res = await api.put(`/users/${userId}`, updates);
    return res.data;
  }
}
