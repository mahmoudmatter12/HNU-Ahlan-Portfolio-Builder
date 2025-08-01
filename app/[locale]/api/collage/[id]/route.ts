import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!id) {
      return NextResponse.json(
        { error: "College ID is required" },
        { status: 400 }
      );
    }
    const college = await db.college.findUnique({
      where: { id },
      include: {
        User: true,
        sections: {
          orderBy: { order: "asc" },
        },
        forms: {
          include: {
            fields: {
              orderBy: { order: "asc" },
            },
            submissions: true,
          },
        },
        createdBy: true,
        FormSubmission: true,
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("Error fetching college:", error);
    return NextResponse.json(
      { error: "Failed to fetch college" },
      { status: 500 }
    );
  }
}
