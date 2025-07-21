import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const collage = await db.college.findUnique({
      where: { slug: slug },
      include: {
        forms: true,
      },
    });

    if (!collage) {
      return NextResponse.json({ error: "Collage not found" }, { status: 404 });
    }

    const form = await db.formSection.findMany({
      where: { collegeId: collage.id },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching form with fields:", error);
    return NextResponse.json(
      { error: "Failed to fetch form with fields" },
      { status: 500 }
    );
  }
}
