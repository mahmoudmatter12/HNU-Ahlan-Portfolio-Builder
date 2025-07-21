import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";
import type { FAQGenerationRequest } from "@/types/faq";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuditLog(
    async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;

      // Clone the request to avoid consuming the body multiple times
      const clonedRequest = request.clone();

      // Check if request has a body
      const contentType = clonedRequest.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return NextResponse.json(
          { error: "Content-Type must be application/json" },
          { status: 400 }
        );
      }

      let body;
      try {
        body = await clonedRequest.json();
      } catch (error) {
        console.error("Error parsing request body:", error);
        return NextResponse.json(
          { error: "Invalid JSON in request body" },
          { status: 400 }
        );
      }

      if (!body) {
        return NextResponse.json(
          { error: "Request body is required" },
          { status: 400 }
        );
      }

      // console.log("Received request body:", JSON.stringify(body, null, 2));
      // console.log(
      //   "Request headers:",
      //   Object.fromEntries(clonedRequest.headers.entries())
      // );

      // Validate the request structure
      if (typeof body !== "object" || body === null) {
        return NextResponse.json(
          { error: "Request body must be an object" },
          { status: 400 }
        );
      }

      const { collegeName, questions }: FAQGenerationRequest = body;

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return NextResponse.json(
          { error: "Questions array is required and must not be empty" },
          { status: 400 }
        );
      }

      if (!collegeName) {
        return NextResponse.json(
          { error: "College name is required" },
          { status: 400 }
        );
      }

      try {
        // Create a new form section for FAQ with a single question
        const formSection = await db.formSection.create({
          data: {
            title: `FAQ Questions Collection for ${collegeName}`,
            description: `Help us create a comprehensive FAQ by telling us what questions you need answered during orientation day.`,
            collegeId: id,
            active: true,
          },
        });

        // Create a single form field for collecting questions
        const formField = await db.formField.create({
          data: {
            label:
              "What questions do you need to know when you're here on orientation day?",
            type: "TEXTAREA",
            isRequired: true,
            options: [],
            formSectionId: formSection.id,
            order: 0,
            validation: {
              minLength: 10,
              maxLength: 1000,
              FAQ: true,
            },
          },
        });

        const result = await db.formSection.findUnique({
          where: { id: formSection.id },
          include: {
            fields: {
              orderBy: { order: "asc" },
            },
          },
        });

        return NextResponse.json({
          form: result,
          message: `FAQ questions collection form generated successfully`,
        });
      } catch (error) {
        console.error("Error generating FAQ form:", error);
        return NextResponse.json(
          { error: "Failed to generate FAQ form" },
          { status: 500 }
        );
      }
    },
    {
      action: "GENERATE_FAQ_FORM",
      extract: (req: NextRequest) => ({
        entity: "FAQForm",
      }),
    }
  )(request, { params });
}
