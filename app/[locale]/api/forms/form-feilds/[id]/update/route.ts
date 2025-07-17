import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

const UpdateFormFieldController = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { label, type, isRequired, options, order } = body;

    const formField = await db.formField.update({
      where: { id: id },
      data: {
        label,
        type,
        isRequired,
        options,
        order,
      },
      include: {
        formSection: true,
      },
    });

    return NextResponse.json(formField);
  } catch (error) {
    console.error("Error updating form field:", error);
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
      { error: "Failed to update form field" },
      { status: 500 }
    );
  }
};

export const PUT = withAuditLog(UpdateFormFieldController, {
  action: "UPDATE_FORM_FIELD",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "formField",
    metadata: {
      searchParams: req.url,
    },
  }),
});
