import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

const GetFormFieldController = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const formField = await db.formField.findUnique({
      where: { id: id },
      include: {
        formSection: {
          include: {
            college: true,
          },
        },
      },
    });

    if (!formField) {
      return NextResponse.json(
        { error: "Form field not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(formField);
  } catch (error) {
    console.error("Error fetching form field:", error);
    return NextResponse.json(
      { error: "Failed to fetch form field" },
      { status: 500 }
    );
  }
};

export const GET = withAuditLog(GetFormFieldController, {
  action: "GET_FORM_FIELD",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "formField",
    metadata: {
      searchParams: req.url,
    },
  }),
});
