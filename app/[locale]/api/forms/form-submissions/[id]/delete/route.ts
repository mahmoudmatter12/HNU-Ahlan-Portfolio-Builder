import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.formSubmission.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Form submission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting form submission:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete form submission" },
      { status: 500 }
    );
  }
}
