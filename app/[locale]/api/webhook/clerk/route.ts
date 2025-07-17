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
    console.log("User ID from Webhook", userId);
    try {
      const user = await clerk.users.getUser(userId);

      // Check if the user exists in your DB
      const existingUser = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!existingUser) {
        await db.user.create({
          data: {
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress ?? "",
            name: user.fullName,
            image: user.imageUrl,
            onboarded: false,
            userType: "ADMIN",
          },
        });
      }

      return NextResponse.json({ status: "user synced" });
    } catch (err) {
      console.error("Webhook error:", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "ignored" });
}
