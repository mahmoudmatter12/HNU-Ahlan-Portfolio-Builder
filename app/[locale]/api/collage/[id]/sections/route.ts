import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // First check if college exists
    const college = await db.college.findUnique({
      where: { id: id },
      select: { id: true, name: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const sections = await db.section.findMany({
      where: { collegeId: id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      college,
      sections,
      count: sections.length,
    });
  } catch (error) {
    console.error("Error fetching college sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch college sections" },
      { status: 500 }
    );
  }
}
