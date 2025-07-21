import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { CreateFAQItemRequest, FAQData } from "@/types/faq";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { question, answer, order }: CreateFAQItemRequest = body;

  if (!question || !answer) {
    return NextResponse.json(
      { error: "Question and answer are required" },
      { status: 400 }
    );
  }

  try {
    const college = await db.college.findUnique({
      where: { id },
      select: { faq: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const currentFAQ: FAQData = (college.faq as unknown as FAQData) || {
      items: [],
      title: "Frequently Asked Questions",
      description: "",
      lastUpdated: new Date(),
    };

    const newItem = {
      id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question,
      answer,
      order: order || currentFAQ.items.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedFAQ: FAQData = {
      ...currentFAQ,
      items: [...currentFAQ.items, newItem],
      lastUpdated: new Date(),
    };

    const updatedCollege = await db.college.update({
      where: { id },
      data: { faq: updatedFAQ as any },
      select: { faq: true },
    });

    return NextResponse.json(updatedCollege.faq);
  } catch (error) {
    console.error("Error adding FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to add FAQ item" },
      { status: 500 }
    );
  }
}
