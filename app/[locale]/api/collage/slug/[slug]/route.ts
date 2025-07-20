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
            _count: {
              select: {
                submissions: true,
                fields: true,
              },
            },
          },
        },
        createdBy: true,
        FormSubmission: true,
        _count: {
          select: {
            User: true,
            sections: true,
            forms: true,
            FormSubmission: true,
            programs: true,
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Calculate additional statistics
    const totalFormFields = college.forms.reduce(
      (total: number, form: any) => total + (form._count?.fields || 0),
      0
    );
    const totalFormSubmissions = college.forms.reduce(
      (total: number, form: any) => total + (form._count?.submissions || 0),
      0
    );
    const activeForms = college.forms.filter(
      (form: any) => (form._count?.submissions || 0) > 0
    ).length;

    // Add calculated statistics to the response
    const enhancedCollege = {
      ...college,
      statistics: {
        totalUsers: college._count?.User || 0,
        totalSections: college._count?.sections || 0,
        totalForms: college._count?.forms || 0,
        totalFormFields,
        totalFormSubmissions,
        activeForms,
        totalPrograms: college._count?.programs || 0,
        averageSubmissionsPerForm:
          (college._count?.forms || 0) > 0
            ? Math.round(totalFormSubmissions / (college._count?.forms || 1))
            : 0,
      },
    };

    return NextResponse.json(enhancedCollege);
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
