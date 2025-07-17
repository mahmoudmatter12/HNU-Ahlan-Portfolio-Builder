import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

const UpdateFormSectionController = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title } = body;

    const formSection = await db.formSection.update({
      where: { id: id },
      data: {
        title,
      },
      include: {
        college: true,
        fields: true,
      },
    });

    return NextResponse.json(formSection);
  } catch (error) {
    console.error("Error updating form section:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Form section not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update form section" },
      { status: 500 }
    );
  }
};

export const PUT = withAuditLog(UpdateFormSectionController, {
  action: "UPDATE_FORM_SECTION",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "formSection",
    metadata: {
      searchParams: req.url,
    },
  }),
});
