import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collage = await db.college.findUnique({
      where: { id: id },
      include: {
        forms: {
          select: {
            fields: true,
            title: true,
            description: true,
            id: true,
            createdAt: true,
            updatedAt: true,
          },
          where: {
            fields: {
              some: {
                validation: {
                  path: ["FAQ"],
                  equals: true,
                },
              },
            },
          },
        },
      },
    });

    if (!collage) {
      return NextResponse.json({ error: "Collage not found" }, { status: 404 });
    }

    return NextResponse.json(collage.forms);
  } catch (error) {
    console.error("Error fetching form with fields:", error);
    return NextResponse.json(
      { error: "Failed to fetch form with fields" },
      { status: 500 }
    );
  }
}
