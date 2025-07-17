import { cloudinary } from "@/lib/cloudinary";

export class UploadService {
  // Upload form file to Cloudinary with proper folder structure
  static async uploadFormFile(
    file: File | Buffer,
    formName: string,
    fieldName: string,
    fileName?: string
  ): Promise<{ url: string; publicId: string }> {
    try {
      const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const folderPath = `forms/${formName}_${timestamp}`;
      const publicId = `${folderPath}/${fieldName}_${fileName || Date.now()}`;

      // Convert file to base64 if it's a File object
      let fileData: string;
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fileData = `data:${file.type};base64,${buffer.toString("base64")}`;
      } else {
        // If it's already a Buffer, convert to base64
        fileData = `data:application/octet-stream;base64,${file.toString(
          "base64"
        )}`;
      }

      const result = await cloudinary.uploader.upload(fileData, {
        public_id: publicId,
        folder: folderPath,
        resource_type: "auto",
        overwrite: false,
        unique_filename: true,
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error("Error uploading form file:", error);
      throw new Error("Failed to upload file");
    }
  }

  // Upload multiple form files
  static async uploadFormFiles(
    files: (File | Buffer)[],
    formName: string,
    fieldName: string
  ): Promise<{ url: string; publicId: string }[]> {
    const uploadPromises = files.map((file, index) => {
      const fileName = file instanceof File ? file.name : `file_${index}`;
      return this.uploadFormFile(file, formName, fieldName, fileName);
    });

    return Promise.all(uploadPromises);
  }

  // Delete file from Cloudinary
  static async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file");
    }
  }

  // Get file info from Cloudinary
  static async getFileInfo(publicId: string) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error("Error getting file info:", error);
      throw new Error("Failed to get file info");
    }
  }

  // Validate file type and size
  static validateFile(
    file: File,
    allowedTypes?: string[],
    maxSize?: number
  ): { isValid: boolean; error?: string } {
    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!allowedTypes.includes(fileExtension)) {
        return {
          isValid: false,
          error: `File type not allowed. Allowed types: ${allowedTypes.join(
            ", "
          )}`,
        };
      }
    }

    // Check file size
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        isValid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    return { isValid: true };
  }
}
