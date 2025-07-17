import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";
import { NextRequest, NextResponse } from "next/server";

const DeleteFormSubmissionController = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await db.formSubmission.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: "Form submission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting form submission:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete form submission" },
      { status: 500 }
    );
  }
};

export const DELETE = withAuditLog(DeleteFormSubmissionController, {
  action: "DELETE_FORM_SUBMISSION",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "formSubmission",
    metadata: {
      searchParams: req.url,
    },
  }),
});
