// create submition for a spisific form section
import { db } from "@/lib/db";
import { logAction } from "@/utils/auditLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { data, collegeId } = body;

    if (!data || !id || !collegeId) {
      return NextResponse.json(
        { error: "Data, formSectionId, and collegeId are required" },
        { status: 400 }
      );
    }

    const formSubmission = await db.formSubmission.create({
      data: {
        data,
        formSectionId: id,
        collegeId,
      },
      include: {
        formSection: {
          include: {
            fields: true,
          },
        },
        college: true,
      },
    });

    // logAction({
    //   action: "SUBMIT_FORM",
    //   userId: request.headers.get("user-id") || undefined,
    //   entity: "FormSubmission",
    //   entityId: formSubmission.id,
    //   metadata: {
    //     data: formSubmission.data,
    //     formSectionId: formSubmission.formSectionId,
    //     collegeId: formSubmission.collegeId,
    //   },
    // });

    return NextResponse.json(formSubmission, { status: 201 });
  } catch (error) {
    console.error("Error creating form submission:", error);
    return NextResponse.json(
      { error: "Failed to create form submission" },
      { status: 500 }
    );
  }
}

// This function handles the submission of a form section by creating a new form submission record in the database.
// ex : POST /api/forms/123/submit
// { "data": {
//   "fieldId": "1",
//   "value": "Sample answer"
// }, "collegeId": "456" }