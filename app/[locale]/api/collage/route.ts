import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

async function getCollegesController(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const createdById = searchParams.get("createdById");

    const colleges = await db.college.findMany({
      where: {
        ...(type && { type: type as any }),
        ...(createdById && { createdById }),
      },
      include: {
        User: true,
        sections: {
          orderBy: { order: "asc" },
        },
        programs: true,
        forms: true,
        createdBy: true,
        _count: {
          select: {
            User: true,
            sections: true,
            forms: true,
            FormSubmission: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    console.log("error from collage route", error);
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}

export const GET = withAuditLog(getCollegesController, {
  action: "GET_COLLEGES",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "college",
    metadata: {
      searchParams: req.url,
    },
  }),
});
