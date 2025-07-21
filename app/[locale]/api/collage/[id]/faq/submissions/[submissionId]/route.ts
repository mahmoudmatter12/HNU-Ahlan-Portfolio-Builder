import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";
import type { FAQData } from "@/types/faq";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; submissionId: string }> }
) {
  const { id, submissionId } = await params;
  const body = await request.json();
  const {
    action,
    answers,
  }: { action: "approve" | "reject"; answers?: Record<string, string> } = body;

  if (!action || !["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { error: "Action must be 'approve' or 'reject'" },
      { status: 400 }
    );
  }

  return withAuditLog(
    async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string; submissionId: string }> }
    ) => {
      try {
        const submission = await db.formSubmission.findUnique({
          where: { id: submissionId },
          include: {
            formSection: {
              include: {
                fields: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        });

        if (!submission) {
          return NextResponse.json(
            { error: "Submission not found" },
            { status: 404 }
          );
        }

        if (action === "approve") {
          // Get the college's current FAQ data
          const college = await db.college.findUnique({
            where: { id },
            select: { faq: true },
          });

          if (!college) {
            return NextResponse.json(
              { error: "College not found" },
              { status: 404 }
            );
          }

          const currentFAQ: FAQData = (college.faq as unknown as FAQData) || {
            items: [],
            title: "Frequently Asked Questions",
            description: "",
            lastUpdated: new Date(),
          };

          // Ensure items array exists
          if (!currentFAQ.items) {
            currentFAQ.items = [];
          }

          // Extract questions from submission and use provided answers
          const submissionData = submission.data as Record<string, string>;
          const fields = submission.formSection.fields;

          const newFAQItems = fields.map((field, index) => {
            const userQuestion = submissionData[field.id] || "";
            const adminAnswer = answers?.[field.id] || "";

            return {
              id: `faq_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              question: userQuestion,
              answer: adminAnswer,
              order: currentFAQ.items.length + index,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          });

          const updatedFAQ: FAQData = {
            ...currentFAQ,
            items: [...currentFAQ.items, ...newFAQItems],
            lastUpdated: new Date(),
          };

          // Update the college's FAQ data
          await db.college.update({
            where: { id },
            data: { faq: updatedFAQ as any },
          });

          // Delete the submission after processing
          await db.formSubmission.delete({
            where: { id: submissionId },
          });

          return NextResponse.json({
            message: "FAQ items added successfully",
            faq: updatedFAQ,
          });
        } else {
          // Reject - just delete the submission
          await db.formSubmission.delete({
            where: { id: submissionId },
          });

          return NextResponse.json({
            message: "Submission rejected and deleted",
          });
        }
      } catch (error) {
        console.error("Error processing FAQ submission:", error);
        return NextResponse.json(
          { error: "Failed to process FAQ submission" },
          { status: 500 }
        );
      }
    },
    {
      action: "UPDATE_FAQ_SUBMISSION",
      extract: (req: NextRequest) => ({
        entity: "FAQSubmission",
        entityId: submissionId,
        metadata: { action },
      }),
    }
  )(request, { params });
}
