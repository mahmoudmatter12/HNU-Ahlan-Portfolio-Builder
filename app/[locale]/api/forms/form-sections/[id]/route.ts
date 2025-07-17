import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

const GetFormSectionController = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const formSection = await db.formSection.findUnique({
      where: { id: id },
      include: {
        college: true,
        fields: {
          orderBy: { order: "asc" },
        },
        submissions: {
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!formSection) {
      return NextResponse.json(
        { error: "Form section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(formSection);
  } catch (error) {
    console.error("Error fetching form section:", error);
    return NextResponse.json(
      { error: "Failed to fetch form section" },
      { status: 500 }
    );
  }
};

export const GET = withAuditLog(GetFormSectionController, {
  action: "GET_FORM_SECTION",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "formSection",
    metadata: {
      searchParams: req.url,
    },
  }),
});
