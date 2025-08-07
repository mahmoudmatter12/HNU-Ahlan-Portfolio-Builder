import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const collageId = searchParams.get("collageId");
  const oneOnly = searchParams.get("oneOnly") === "true";
  const depSlug = searchParams.get("depSlug");
  const includeCollage = searchParams.get("includeCollage") === "true";

  if (!slug && !collageId) {
    return NextResponse.json(
      { error: "Either slug or collageId is required" },
      { status: 400 }
    );
  }

  if (slug && collageId) {
    return NextResponse.json(
      { error: "Only one of slug or collageId should be provided" },
      { status: 400 }
    );
  }

  if (oneOnly && !depSlug) {
    return NextResponse.json(
      { error: "depSlug is required when oneOnly is true" },
      { status: 400 }
    );
  }

  try {
    let resolvedCollegeId = collageId;

    if (slug) {
      const collage = await db.college.findUnique({
        where: { slug },
      });

      if (!collage) {
        return NextResponse.json(
          { error: "College not found" },
          { status: 404 }
        );
      }

      resolvedCollegeId = collage.id;
    }

    // Query program(s)
    if (oneOnly && depSlug) {
      const program = await db.program.findFirst({
        where: {
          collegeId: resolvedCollegeId!,
          slug: depSlug,
        },
        include: {
          college: includeCollage,
        },
      });

      if (!program) {
        return NextResponse.json(
          { error: "Program not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(program);
    }

    const programs = await db.program.findMany({
      where: {
        collegeId: resolvedCollegeId!,
      },
      include: {
        college: includeCollage,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!programs || programs.length === 0) {
      return NextResponse.json(
        { error: "Programs not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
