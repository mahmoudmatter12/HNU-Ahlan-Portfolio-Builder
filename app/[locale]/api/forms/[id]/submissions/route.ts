import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // First check if form exists
    const form = await db.formSection.findUnique({
      where: { id: id },
      select: { id: true, title: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const [submissions, totalCount] = await Promise.all([
      db.formSubmission.findMany({
        where: { formSectionId: id },
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
        orderBy: { submittedAt: "desc" },
        skip,
        take: limit,
      }),
      db.formSubmission.count({
        where: { formSectionId: id },
      }),
    ]);

    return NextResponse.json({
      submissions,
      form: form,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch form submissions" },
      { status: 500 }
    );
  }
}
