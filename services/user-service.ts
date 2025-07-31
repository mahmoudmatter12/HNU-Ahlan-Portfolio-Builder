import { api } from "@/lib/axios";
import { UserType } from "@prisma/client";

export class UserService {
  static async getUsers(params?: {
    includeCollege?: boolean;
    page?: number;
    limit?: number;
  }) {
    const res = await api.get("/users/all", { params });
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
    const res = await api.patch(`/users/${userId}/update`, updates);
    return res.data;
  }

  static async getUserById(userId: string) {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  }

  static async deleteUser(userId: string) {
    const res = await api.delete(`/users/${userId}/delete`);
    return res.data;
  }

  static async getSuperAdmins() {
    const res = await api.get("/users/superadmins");
    return res.data;
  }

  static async toggleUserRole(userId: string, role: UserType) {
    const res = await api.patch(`/users/${userId}/toggle-role`, { role });
    return res.data;
  }

  static async moveUserToCollage(userId: string, collageId: string) {
    const res = await api.patch(`/users/${userId}/move-to-collage`, { collageId });
    return res.data;
  }
}
