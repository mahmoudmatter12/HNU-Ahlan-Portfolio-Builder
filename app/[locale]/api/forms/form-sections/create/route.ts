import { db } from "@/lib/db";
import { logAction } from "@/utils/auditLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, collegeId } = body;

    if (!title || !collegeId) {
      return NextResponse.json(
        { error: "Title and collegeId are required" },
        { status: 400 }
      );
    }

    const formSection = await db.formSection.create({
      data: {
        title,
        collegeId,
      },
      include: {
        college: true,
        fields: true,
      },
    });

    // logAction({
    //   action: "CREATE_FORM_SECTION",
    //   userId: request.headers.get("user-id") || undefined,
    //   entity: "FormSection",
    //   entityId: formSection.id,
    //   metadata: {
    //     title: formSection.title,
    //     collegeId: formSection.collegeId,
    //   },
    // });

    return NextResponse.json(formSection, { status: 201 });
  } catch (error) {
    console.error("Error creating form section:", error);
    return NextResponse.json(
      { error: "Failed to create form section" },
      { status: 500 }
    );
  }
}
