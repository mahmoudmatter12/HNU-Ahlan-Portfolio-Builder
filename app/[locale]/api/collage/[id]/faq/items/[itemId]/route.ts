import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { UpdateFAQItemRequest, FAQData } from "@/types/faq";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;
  const body = await request.json();
  const { question, answer, order }: UpdateFAQItemRequest = body;

  try {
    const college = await db.college.findUnique({
      where: { id },
      select: { faq: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const currentFAQ: FAQData = (college.faq as any) || {
      items: [],
      title: "Frequently Asked Questions",
      description: "",
      lastUpdated: new Date(),
    };

    const itemIndex = currentFAQ.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "FAQ item not found" },
        { status: 404 }
      );
    }

    const updatedItems = [...currentFAQ.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      ...(question && { question }),
      ...(answer && { answer }),
      ...(order !== undefined && { order }),
      updatedAt: new Date(),
    };

    const updatedFAQ: FAQData = {
      ...currentFAQ,
      items: updatedItems,
      lastUpdated: new Date(),
    };

    const updatedCollege = await db.college.update({
      where: { id },
      data: { faq: updatedFAQ as any },
      select: { faq: true },
    });

    return NextResponse.json(updatedCollege.faq);
  } catch (error) {
    console.error("Error updating FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;

  try {
    const college = await db.college.findUnique({
      where: { id },
      select: { faq: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const currentFAQ: FAQData = (college.faq as any) || {
      items: [],
      title: "Frequently Asked Questions",
      description: "",
      lastUpdated: new Date(),
    };

    const updatedItems = currentFAQ.items.filter((item) => item.id !== itemId);

    const updatedFAQ: FAQData = {
      ...currentFAQ,
      items: updatedItems,
      lastUpdated: new Date(),
    };

    const updatedCollege = await db.college.update({
      where: { id },
      data: { faq: updatedFAQ as any },
      select: { faq: true },
    });

    return NextResponse.json(updatedCollege.faq);
  } catch (error) {
    console.error("Error deleting FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ item" },
      { status: 500 }
    );
  }
}
