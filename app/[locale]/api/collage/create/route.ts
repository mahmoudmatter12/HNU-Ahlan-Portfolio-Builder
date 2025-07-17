import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, type, theme, createdById, galleryImages } = body;

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: "Name, slug, and type are required" },
        { status: 400 }
      );
    }

    const college = await db.college.create({
      data: {
        name,
        slug,
        type,
        theme: theme || {},
        createdById,
        galleryImages: galleryImages || [],
        faq: [],
      },
      include: {
        createdBy: true,
      },
    });

    return NextResponse.json(college, { status: 201 });
  } catch (error) {
    console.error("Error creating college:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "College slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create college" },
      { status: 500 }
    );
  }
}
