import { api } from "@/lib/axios";

export interface UploadResponse {
  url: string;
  publicId: string;
  fileName: string;
}

export interface UploadOptions {
  context?: string; // e.g., "section", "form", "gallery"
  subContext?: string; // e.g., "hero", "about", "student-activities"
  fieldName?: string;
  fileName?: string;
}

export class UploadService {
  async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("context", options.context || "general");
    formData.append("subContext", options.subContext || "default");
    formData.append("fieldName", options.fieldName || "file");
    formData.append("fileName", options.fileName || file.name);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, {
        ...options,
        fieldName: options.fieldName
          ? `${options.fieldName}_${index}`
          : `file_${index}`,
      })
    );

    return Promise.all(uploadPromises);
  }

  async deleteFile(publicId: string): Promise<void> {
    await api.delete(`/upload/${encodeURIComponent(publicId)}`);
  }
}
