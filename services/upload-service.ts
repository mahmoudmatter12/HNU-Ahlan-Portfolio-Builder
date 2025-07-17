import { api } from "@/lib/axios";

export class UploadService {
  async uploadImage(image: File, foldername: string) {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("foldername", foldername);

    const res = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
}
