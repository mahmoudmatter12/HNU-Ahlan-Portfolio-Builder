import { db } from "@/lib/db";
import { logAction } from "@/utils/auditLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, active = true, collegeId } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const formSection = await db.formSection.create({
      data: {
        title,
        description,
        active,
        collegeId: collegeId || null,
      },
      include: {
        college: true,
        fields: true,
      },
    });

    return NextResponse.json(formSection, { status: 201 });
  } catch (error) {
    console.error("Error creating form section:", error);
    return NextResponse.json(
      { error: "Failed to create form section" },
      { status: 500 }
    );
  }
}
