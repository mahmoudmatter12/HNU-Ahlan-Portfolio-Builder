import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; programId: string }> }
) {
  const { id: collegeId, programId } = await params;
  const { name, description, slug } = await request.json();

  try {
    // First verify the program belongs to this college
    const existingProgram = await db.program.findFirst({
      where: {
        id: programId,
        collegeId: collegeId,
      },
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: "Program not found or does not belong to this college" },
        { status: 404 }
      );
    }

    const program = await db.program.update({
      where: { id: programId },
      data: { name, description, slug },
    });
    return NextResponse.json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; programId: string }> }
) {
  const { id: collegeId, programId } = await params;

  try {
    // First verify the program belongs to this college
    const existingProgram = await db.program.findFirst({
      where: {
        id: programId,
        collegeId: collegeId,
      },
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: "Program not found or does not belong to this college" },
        { status: 404 }
      );
    }

    await db.program.delete({ where: { id: programId } });
    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
