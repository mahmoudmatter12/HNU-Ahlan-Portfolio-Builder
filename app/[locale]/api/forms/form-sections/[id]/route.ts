import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formSection = await db.formSection.findUnique({
      where: { id: params.id },
      include: {
        college: true,
        fields: {
          orderBy: { order: "asc" },
        },
        submissions: {
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!formSection) {
      return NextResponse.json(
        { error: "Form section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(formSection);
  } catch (error) {
    console.error("Error fetching form section:", error);
    return NextResponse.json(
      { error: "Failed to fetch form section" },
      { status: 500 }
    );
  }
}


