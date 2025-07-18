import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database to check permissions
    const user = await db.user.findFirst({
      where: { clerkId: userId },
    });

    if (
      !user ||
      (user.userType !== "ADMIN" && user.userType !== "SUPERADMIN")
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const {
      name,
      slug,
      logoUrl,
      socialMedia,
      description,
      newsItems,
      content,
    } = await request.json();

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // // Two-step verification for edit operations
    // if (verificationStep === "request") {
    //   // Generate verification code (in production, send via email/SMS)
    //   const verificationCode = Math.floor(
    //     100000 + Math.random() * 900000
    //   ).toString();

    //   console.log("Verification code:", verificationCode);

    //   // Store verification code temporarily (in production, use Redis or similar)
    //   // For now, we'll use a simple approach - in production, implement proper verification storage

    //   return NextResponse.json({
    //     message: "Verification code sent",
    //     verificationCode, // In production, don't return this - send via email/SMS
    //     step: "verify",
    //   });
    // }

    // if (verificationStep === "verify") {
    // Verify the code (in production, check against stored code)
    // if (!verificationCode) {
    //   return NextResponse.json(
    //     { error: "Verification code required" },
    //     { status: 400 }
    //   );
    // }

    // In production, validate the verification code here
    // For now, we'll proceed with the update

    const uni = await db.university.update({
      where: { slug: "HNU" }, // Always update the main university
      data: {
        name,
        slug,
        logoUrl,
        socialMedia,
        description,
        newsItems,
        content: content || {},
      },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        action: "UPDATE_UNIVERSITY",
        entity: "University",
        entityId: uni.id,
        metadata: {
          updatedFields: {
            name,
            slug,
            logoUrl,
            socialMedia,
            description,
            newsItems,
            content,
          },
        },
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "University updated successfully",
      university: uni,
    });
    // }

    // return NextResponse.json(
    //   { error: "Invalid verification step" },
    //   { status: 400 }
    // );
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
