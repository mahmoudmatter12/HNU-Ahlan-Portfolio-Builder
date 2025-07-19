import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

const GetCollegeBySlugController = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params;
    const college = await db.college.findUnique({
      where: { slug },
      include: {
        User: true,
        sections: {
          orderBy: { order: "asc" },
        },
        programs: true,
        forms: {
          include: {
            fields: {
              orderBy: { order: "asc" },
            },
          },
        },
        createdBy: true,
        FormSubmission: true,
        _count: true,
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("Error fetching college by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch college" },
      { status: 500 }
    );
  }
};

export const GET = withAuditLog(GetCollegeBySlugController, {
  action: "GET_COLLEGE_BY_SLUG",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "college",
    metadata: {
      searchParams: req.url,
    },
  }),
});
