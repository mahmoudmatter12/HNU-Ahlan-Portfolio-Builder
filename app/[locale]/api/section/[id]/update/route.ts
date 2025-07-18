import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, order, content, sectionType, settings } = body;

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (order !== undefined) updateData.order = order;
    if (content !== undefined) updateData.content = content;
    if (sectionType !== undefined) updateData.sectionType = sectionType;
    if (settings !== undefined) updateData.settings = settings;

    const section = await db.section.update({
      where: { id: id },
      data: updateData,
      include: {
        college: true,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Error updating section:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}
