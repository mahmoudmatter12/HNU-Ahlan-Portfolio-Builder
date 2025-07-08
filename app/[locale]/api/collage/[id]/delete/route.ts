import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    await db.college.delete({
      where: { id },
    });

    return NextResponse.json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete college" },
      { status: 500 }
    );
  }
}
