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

    if (!user || user.userType !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Only super admins can delete university" },
        { status: 403 }
      );
    }

    const {
      slug,
      verificationStep,
      verificationCode,
      confirmationText,
      finalConfirmation,
    } = await request.json();

    // Three-step verification for delete operations
    if (verificationStep === "initiate") {
      // Step 1: Initiate deletion process
      const university = await db.university.findFirst({
        where: { slug: "hnu" },
        include: {
          colleges: {
            include: {
              User: true,
              sections: true,
              forms: true,
            },
          },
        },
      });

      if (!university) {
        return NextResponse.json(
          { error: "University not found" },
          { status: 404 }
        );
      }

      // Generate verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      return NextResponse.json({
        message: "Delete verification initiated",
        verificationCode, // In production, send via email/SMS
        step: "verify",
        university: {
          name: university.name,
          collegesCount: university.colleges.length,
          totalUsers: university.colleges.reduce(
            (acc, college) => acc + college.User.length,
            0
          ),
          totalSections: university.colleges.reduce(
            (acc, college) => acc + college.sections.length,
            0
          ),
          totalForms: university.colleges.reduce(
            (acc, college) => acc + college.forms.length,
            0
          ),
        },
      });
    }

    if (verificationStep === "verify") {
      // Step 2: Verify the code
      if (!verificationCode) {
        return NextResponse.json(
          { error: "Verification code required" },
          { status: 400 }
        );
      }

      // In production, validate the verification code here

      return NextResponse.json({
        message: "Verification successful. Final confirmation required.",
        step: "confirm",
        confirmationText: "DELETE_UNIVERSITY_HNU",
      });
    }

    if (verificationStep === "confirm") {
      // Step 3: Final confirmation
      if (!finalConfirmation || finalConfirmation !== "DELETE_UNIVERSITY_HNU") {
        return NextResponse.json(
          { error: "Final confirmation text does not match" },
          { status: 400 }
        );
      }

      // Perform the deletion
      try {
        // Delete in transaction to ensure data consistency
        await db.$transaction(async (tx) => {
          // Delete all related data first
          const university = await tx.university.findFirst({
            where: { slug: "HNU" },
            include: { colleges: true },
          });

          if (!university) {
            throw new Error("University not found");
          }

          // Delete all colleges and their related data
          for (const college of university.colleges) {
            // Delete form submissions
            await tx.formSubmission.deleteMany({
              where: { formSection: { collegeId: college.id } },
            });

            // Delete form fields
            await tx.formField.deleteMany({
              where: { formSection: { collegeId: college.id } },
            });

            // Delete form sections
            await tx.formSection.deleteMany({
              where: { collegeId: college.id },
            });

            // Delete sections
            await tx.section.deleteMany({
              where: { collegeId: college.id },
            });

            // Delete college users
            await tx.user.deleteMany({
              where: { collegeId: college.id },
            });

            // Delete college
            await tx.college.delete({
              where: { id: college.id },
            });
          }

          // Delete university
          await tx.university.delete({
            where: { id: university.id },
          });
        });

        // Log the action
        await db.auditLog.create({
          data: {
            action: "DELETE_UNIVERSITY",
            entity: "University",
            entityId: "hnu",
            metadata: { deletedBy: user.id, timestamp: new Date() },
            userId: user.id,
          },
        });

        return NextResponse.json({
          message: "University and all related data deleted successfully",
        });
      } catch (error) {
        console.error("Error during deletion:", error);
        return NextResponse.json(
          { error: "Failed to delete university. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Invalid verification step" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting university:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
