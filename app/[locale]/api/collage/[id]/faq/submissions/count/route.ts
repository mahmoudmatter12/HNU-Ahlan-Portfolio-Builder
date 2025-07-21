import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Count submissions for FAQ forms of this college
    const count = await db.formSubmission.count({
      where: {
        formSection: {
          collegeId: id,
          title: {
            contains: "FAQ",
          },
        },
      },
    });

    return NextResponse.json({
      count,
      message: `Found ${count} FAQ form submissions`,
    });
  } catch (error) {
    console.error("Error getting FAQ submission count:", error);
    return NextResponse.json(
      { error: "Failed to get FAQ submission count" },
      { status: 500 }
    );
  }
}
