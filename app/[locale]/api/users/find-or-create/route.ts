import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const clerk = await clerkClient();
    const { clerkId } = await request.json();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    // First, try to find existing user
    let user = await db.user.findUnique({
      where: { clerkId: clerkId },
      include: {
        college: true,
        collegesCreated: true,
      },
    });

    // If user doesn't exist, create them
    if (!user) {
      try {
        // Get user data from Clerk
        const clerkUser = await clerk.users.getUser(clerkId);

        // Create user in database
        user = await db.user.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            name: clerkUser.fullName,
            image: clerkUser.imageUrl,
          },
          include: {
            college: true,
            collegesCreated: true,
          },
        });

        console.log(`Created new user: ${user.id} for Clerk ID: ${clerkId}`);
      } catch (clerkError) {
        console.error("Error fetching user from Clerk:", clerkError);
        return NextResponse.json(
          { error: "Failed to fetch user data from Clerk" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in find-or-create user:", error);
    return NextResponse.json(
      { error: "Failed to find or create user" },
      { status: 500 }
    );
  }
}
