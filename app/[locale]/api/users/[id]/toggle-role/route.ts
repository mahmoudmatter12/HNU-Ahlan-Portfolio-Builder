import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserType } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { role } = await request.json();
  try {
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    if (!Object.values(UserType).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        userType: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.userType === role) {
      return NextResponse.json(
        { error: "User already has this role" },
        { status: 400 }
      );
    } else {
      // Update the user's role
      await db.user.update({
        where: { id },
        data: { userType: role },
      });
    }

    return NextResponse.json(
      { message: "User role updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
