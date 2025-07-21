import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // First find the college by slug
    const collage = await db.college.findUnique({
      where: { slug: slug },
    });

    if (!collage) {
      return NextResponse.json({ error: "Collage not found" }, { status: 404 });
    }

    // Get forms that have fields with validation.fqa = true
    const forms = await db.formSection.findMany({
      where: {
        collegeId: collage.id,
        fields: {
          some: {
            validation: {
              path: ["fqa"],
              equals: true,
            },
          },
        },
      },
      include: {
        fields: {
          where: {
            validation: {
              path: ["fqa"],
              equals: true,
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!forms || forms.length === 0) {
      return NextResponse.json(
        { error: "No FAQ forms found" },
        { status: 404 }
      );
    }

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching FAQ forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ forms" },
      { status: 500 }
    );
  }
}
