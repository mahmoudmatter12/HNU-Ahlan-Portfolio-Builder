import { db } from "@/lib/db";
import { logAction } from "@/utils/auditLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, order, content, collegeId } = body;

    if (!title || !collegeId) {
      return NextResponse.json(
        { error: "Title and collegeId are required" },
        { status: 400 }
      );
    }

    const section = await db.section.create({
      data: {
        title,
        order: order || 0,
        content: content || "",
        collegeId,
      },
      include: {
        college: true,
      },
    });

    logAction({
      action: "CREATE_SECTION",
      userId: request.headers.get("user-id") || undefined,
      entity: "Section",
      entityId: section.id,
      metadata: {
        title: section.title,
        order: section.order,
        content: section.content,
        collegeId: section.collegeId,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}
