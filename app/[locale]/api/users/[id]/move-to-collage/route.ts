import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { collageId } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  if (!collageId) {
    return NextResponse.json(
      { error: "Collage ID is required" },
      { status: 400 }
    );
  }

  const collage = await db.college.findUnique({
    where: { id: collageId },
  });

  if (!collage) {
    return NextResponse.json({ error: "Collage not found" }, { status: 404 });
  }

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await db.user.update({
    where: { id },
    data: { collegeId: collageId },
  });

  return NextResponse.json(
    { message: "User moved to collage successfully" },
    { status: 200 }
  );
}
