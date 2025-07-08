import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = id ? { id } : {};

    const [forms, totalCount] = await Promise.all([
      db.formSection.findMany({
        where,
        include: {
          college: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          fields: {
            orderBy: { order: "asc" },
          },
          submissions: {
            select: {
              id: true,
              submittedAt: true,
              data: true,
            },
          },
          _count: {
            select: {
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
