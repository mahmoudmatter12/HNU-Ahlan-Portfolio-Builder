import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const formName = formData.get("formName") as string;
    const fieldName = formData.get("fieldName") as string;
    const fileName = formData.get("fileName") as string;

    if (!file || !formName || !fieldName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const folderPath = `forms/${formName}_${timestamp}`;
    const publicId = `${folderPath}/${fieldName}_${fileName || Date.now()}`;

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileData = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileData, {
      public_id: publicId,
      folder: folderPath,
      resource_type: "auto",
      overwrite: false,
      unique_filename: true,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
