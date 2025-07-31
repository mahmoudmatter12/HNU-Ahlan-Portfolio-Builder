import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // get the user id from the body
    const body = await request.json();
    const { userId } = body;

    // check for the user id
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // get the user
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // case 1 if the user is OWNER or SUPERADMIN then get all the collages
    if (user.userType === "OWNER" || user.userType === "SUPERADMIN") {
      const collages = await db.college.findMany({
        include: {
          User: true,
          sections: true,
          forms: true,
          programs: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          createdCollages: {
            count: collages.length,
            collages: collages,
          },
          totalCount: collages.length,
        },
      });
    }

    // case 2 if the user is ADMIN then get all the collages that the user is created by
    if (user.userType === "ADMIN") {
      // Get collages created by the user
      const createdCollages = await db.college.findMany({
        where: {
          createdById: userId,
        },
        include: {
          User: true,
          sections: {
            orderBy: {
              order: "asc",
            },
          },
          forms: true,
          programs: true,
        },
      });

      // Get collages where the user is a member (but not the creator)
      const memberCollages = await db.college.findMany({
        where: {
          User: {
            some: {
              id: userId,
            },
          },
          createdById: {
            not: userId,
          },
        },
        include: {
          User: true,
          sections: {
            orderBy: {
              order: "asc",
            },
          },
          forms: true,
          programs: true,
        },
      });

      // Return structured response
      return NextResponse.json({
        success: true,
        data: {
          createdCollages: {
            count: createdCollages.length,
            collages: createdCollages,
          },
          memberCollages: {
            count: memberCollages.length,
            collages: memberCollages,
          },
          totalCount: createdCollages.length + memberCollages.length,
        },
      });
    }
    
  } catch (error) {
    console.error("Error fetching collages:", error);
    return NextResponse.json(
      { error: "Failed to fetch collages" },
      { status: 500 }
    );
  }
}
