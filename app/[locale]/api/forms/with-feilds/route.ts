import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = collegeId ? { collegeId } : {};

    const [forms, totalCount] = await Promise.all([
      db.formSection.findMany({
        where,
        include: {
          college: true,
          fields: {
            orderBy: { order: "asc" },
          },
          _count: {
            select: {
              fields: true,
              submissions: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.formSection.count({ where }),
    ]);

    return NextResponse.json({
      forms,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching all forms with fields:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms with fields" },
      { status: 500 }
    );
  }
}
