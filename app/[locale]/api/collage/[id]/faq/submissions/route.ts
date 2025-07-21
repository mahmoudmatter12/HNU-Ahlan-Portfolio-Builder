import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Get all form submissions for FAQ forms
    const submissions = await db.formSubmission.findMany({
      where: {
        collegeId: id,
        formSection: {
          title: {
            contains: "FAQ",
          },
        },
      },
      include: {
        formSection: {
          include: {
            fields: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching FAQ submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ submissions" },
      { status: 500 }
    );
  }
}
