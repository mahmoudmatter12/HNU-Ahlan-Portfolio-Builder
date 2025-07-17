import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

const GetCollagesWithSectionsController = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const college = await db.college.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("Error fetching college with sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch college with sections" },
      { status: 500 }
    );
  }
};

export const GET = withAuditLog(GetCollagesWithSectionsController, {
  action: "GET_COLLEGE_WITH_SECTIONS",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "college",
    metadata: {
      searchParams: req.url,
    },
  }),
});
