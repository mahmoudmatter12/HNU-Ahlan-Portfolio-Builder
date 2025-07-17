import { db } from "@/lib/db";
import { logAction } from "@/utils/auditLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      label,
      type,
      isRequired,
      options,
      validation,
      formSectionId,
      order,
    } = body;

    if (!label || !type || !formSectionId) {
      return NextResponse.json(
        { error: "Label, type, and formSectionId are required" },
        { status: 400 }
      );
    }

    const formField = await db.formField.create({
      data: {
        label,
        type,
        isRequired: isRequired || false,
        options: options || [],
        validation: validation || null,
        formSectionId,
        order: order || 0,
      },
      include: {
        formSection: true,
      },
    });

    // logAction({
    //   action: "CREATE_FORM_FIELD",
    //   userId: request.headers.get("user-id") || undefined,
    //   entity: "FormField",
    //   entityId: formField.id,
    //   metadata: {
    //     label: formField.label,
    //     type: formField.type,
    //     isRequired: formField.isRequired,
    //     options: formField.options,
    //     formSectionId: formField.formSectionId,
    //     order: formField.order,
    //   },
    // });

    return NextResponse.json(formField, { status: 201 });
  } catch (error) {
    console.error("Error creating form field:", error);
    return NextResponse.json(
      { error: "Failed to create form field" },
      { status: 500 }
    );
  }
}
