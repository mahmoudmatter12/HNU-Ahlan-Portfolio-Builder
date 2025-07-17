import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

const DeleteFormFieldController = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await db.formField.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Form field deleted successfully" });
  } catch (error) {
    console.error("Error deleting form field:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Form field not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete form field" },
      { status: 500 }
    );
  }
};

export const DELETE = withAuditLog(DeleteFormFieldController, {
  action: "DELETE_FORM_FIELD",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "formField",
    metadata: {
      searchParams: req.url,
    },
  }),
});
