import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "College ID is required" },
        { status: 400 }
      );
    }

    const programs = await db.program.findMany({
      where: { collegeId: id },
    });

    return NextResponse.json(programs || []);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, description, slug } = await request.json();

  try {
    const program = await db.program.create({
      data: { name, description, slug, collegeId: id },
    });
    return NextResponse.json(program);
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

