import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const {
      name,
      slug,
      type,
      theme,
      galleryImages,
      collageLeaders,
      socialMedia,
    } = body;

    const college = await db.college.update({
      where: { id },
      data: {
        name,
        slug,
        type,
        theme,
        galleryImages,
        collageLeaders,
        socialMedia,
      },
      include: {
        createdBy: true,
      },
    });

    return NextResponse.json(college);
  } catch (error) {
    console.error("Error updating college:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update college" },
      { status: 500 }
    );
  }
}
