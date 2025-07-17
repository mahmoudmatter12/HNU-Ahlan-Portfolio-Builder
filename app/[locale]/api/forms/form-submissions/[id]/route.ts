import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";
import { NextRequest, NextResponse } from "next/server";

const GetFormSubmissionController = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const formSubmission = await db.formSubmission.findUnique({
      where: { id: id },
      include: {
        formSection: {
          include: {
            fields: {
              orderBy: { order: "asc" },
            },
          },
        },
        college: true,
      },
    });

    if (!formSubmission) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(formSubmission);
  } catch (error) {
    console.error("Error fetching form submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch form submission" },
      { status: 500 }
    );
  }
};

export const GET = withAuditLog(GetFormSubmissionController, {
  action: "GET_FORM_SUBMISSION",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "formSubmission",
    metadata: {
      searchParams: req.url,
    },
  }),
});
