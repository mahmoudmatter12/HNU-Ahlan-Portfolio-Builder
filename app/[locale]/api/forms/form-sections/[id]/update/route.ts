import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title } = body;

    const formSection = await db.formSection.update({
      where: { id: params.id },
      data: {
        title,
      },
      include: {
        college: true,
        fields: true,
      },
    });

    return NextResponse.json(formSection);
  } catch (error) {
    console.error("Error updating form section:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Form section not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update form section" },
      { status: 500 }
    );
  }
}
