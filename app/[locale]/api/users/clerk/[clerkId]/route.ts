import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { clerkId: string } }
) {
  const { clerkId } = await params;
  console.log("clerkId", clerkId);
  try {
    const user = await db.user.findUnique({
      where: { clerkId: clerkId },
      include: {
        college: true,
        collegesCreated: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user by clerk ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
