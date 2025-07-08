import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.formField.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Form field deleted successfully" });
  } catch (error) {
    console.error("Error deleting form field:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Form field not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete form field" },
      { status: 500 }
    );
  }
}
