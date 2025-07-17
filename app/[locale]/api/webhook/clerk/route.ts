// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  console.log("Webhook received");
  const payload = (await req.json()) as WebhookEvent;
  const clerk = await clerkClient();
  const { type, data } = payload;

  // Handle signup or login session
  if (type === "user.created" || type === "session.created") {
    let userId: string | undefined;
    if (type === "user.created") {
      userId = data.id;
    } else if (type === "session.created") {
      userId = data.user_id; // session.created event: user_id is the Clerk user ID
    }
    if (!userId) {
      return NextResponse.json({ error: "No user ID found" }, { status: 400 });
    }
    try {
      // Use the same find-or-create logic as the API endpoint
      let user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        const clerkUser = await clerk.users.getUser(userId);
        user = await db.user.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            name: clerkUser.fullName,
            image: clerkUser.imageUrl,
            userType: "GUEST", // Default to GUEST
            onboarded: false,
          },
        });
        console.log(
          `Webhook: Created new user: ${user.id} for Clerk ID: ${userId}`
        );
      }

      return NextResponse.json({ status: "user synced" });
    } catch (err) {
      console.error("Webhook error:", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "ignored" });
}
