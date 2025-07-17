import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuditLog } from "@/lib/middleware/withAuditLog";

const ToggleFormActive = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const form = await db.formSection.findUnique({
      where: { id },
    });

    if (!form) {
      return NextResponse.json({ message: "Form not found" }, { status: 404 });
    }

    await db.formSection.update({
      where: { id },
      data: { active: !form.active },
    });

    return NextResponse.json({ message: "Form active status updated" });
  } catch (error) {
    console.error("Error toggling form active status:", error);
    return NextResponse.json(
      { message: "Failed to toggle form active status" },
      { status: 500 }
    );
  }
};

export const GET = withAuditLog(ToggleFormActive, {
  action: "TOGGLE_FORM_ACTIVE",
  extract: (req) => ({
    userId: req.headers.get("x-user-id") || undefined,
    entity: "form",
    metadata: {
      searchParams: req.url,
    },
  }),
});
