import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const college = await db.college.findUnique({
      where: { id: id },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
        forms: {
          include: {
            fields: {
              orderBy: { order: "asc" },
            },
            _count: {
              select: {
                submissions: true,
              },
            },
          },
        },
        User: true,
        createdBy: true,
        _count: {
          select: {
            User: true,
            sections: true,
            forms: true,
            FormSubmission: true,
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("Error fetching complete college data:", error);
    return NextResponse.json(
      { error: "Failed to fetch complete college data" },
      { status: 500 }
    );
  }
}
