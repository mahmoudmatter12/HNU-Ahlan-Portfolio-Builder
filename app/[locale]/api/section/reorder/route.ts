import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updatePromises = body.map((section: { id: string; order: number }) =>
      db.section.update({
        where: { id: section.id },
        data: { order: section.order },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Sections reordered successfully" });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
