import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCollege = searchParams.get("includeCollege") === "true";

    const superAdmins = await db.user.findMany({
      where: {
        userType: "SUPERADMIN",
      },
      include: {
        ...(includeCollege && {
          college: true,
          collegesCreated: true,
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      superAdmins,
      count: superAdmins.length,
    });
  } catch (error) {
    console.error("Error fetching super admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch super admins" },
      { status: 500 }
    );
  }
}
