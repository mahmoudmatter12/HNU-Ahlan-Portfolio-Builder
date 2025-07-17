import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

const DeleteFormSectionController = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await db.formSection.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Form section deleted successfully" });
  } catch (error) {
    console.error("Error deleting form section:", error);
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
      { error: "Failed to delete form section" },
      { status: 500 }
    );
  }
};

export const DELETE = withAuditLog(DeleteFormSectionController, {
  action: "DELETE_FORM_SECTION",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "formSection",
    metadata: {
      searchParams: req.url,
    },
  }),
});
