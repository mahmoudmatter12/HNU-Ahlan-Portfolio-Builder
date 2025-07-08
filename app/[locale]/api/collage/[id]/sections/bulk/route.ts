import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { sections } = body;

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        {
          error: "sections array is required",
        },
        { status: 400 }
      );
    }

    // Verify college exists
    const college = await db.college.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Create multiple sections
    const createdSections = await db.$transaction(
      sections.map((section, index) =>
        db.section.create({
          data: {
            title: section.title,
            content: section.content || "",
            order: section.order || index,
            collegeId: params.id,
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: `${createdSections.length} sections created successfully`,
        sections: createdSections,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulk sections:", error);
    return NextResponse.json(
      { error: "Failed to create sections" },
      { status: 500 }
    );
  }
}

// DELETE - Bulk delete sections
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { sectionIds } = body;

    if (!sectionIds || !Array.isArray(sectionIds)) {
      return NextResponse.json(
        {
          error: "sectionIds array is required",
        },
        { status: 400 }
      );
    }

    // Verify all sections belong to this college
    const sections = await db.section.findMany({
      where: {
        collegeId: params.id,
        id: { in: sectionIds },
      },
      select: { id: true },
    });

    if (sections.length !== sectionIds.length) {
      return NextResponse.json(
        {
          error: "Some sections do not belong to this college",
        },
        { status: 400 }
      );
    }

    // Delete sections
    const deleteResult = await db.section.deleteMany({
      where: {
        id: { in: sectionIds },
        collegeId: params.id,
      },
    });

    return NextResponse.json({
      message: `${deleteResult.count} sections deleted successfully`,
      deletedCount: deleteResult.count,
    });
  } catch (error) {
    console.error("Error deleting bulk sections:", error);
    return NextResponse.json(
      { error: "Failed to delete sections" },
      { status: 500 }
    );
  }
}
