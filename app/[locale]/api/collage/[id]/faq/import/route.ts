import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { FAQImportData, FAQData } from "@/types/faq";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { items }: { items: FAQImportData[] } = body;

  if (!items || !Array.isArray(items)) {
    return NextResponse.json(
      { error: "Items array is required" },
      { status: 400 }
    );
  }

  // Validate required fields
  for (const item of items) {
    if (!item.question || !item.answer) {
      return NextResponse.json(
        { error: "Each item must have both question and answer" },
        { status: 400 }
      );
    }
  }

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

    const newItems = items.map((item, index) => ({
      id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: item.question.trim(),
      answer: item.answer.trim(),
      order: currentFAQ.items.length + index,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const updatedFAQ: FAQData = {
      ...currentFAQ,
      items: [...currentFAQ.items, ...newItems],
      lastUpdated: new Date(),
    };

    const updatedCollege = await db.college.update({
      where: { id },
      data: { faq: updatedFAQ as any },
      select: { faq: true },
    });

    return NextResponse.json(updatedCollege.faq);
  } catch (error) {
    console.error("Error importing FAQ:", error);
    return NextResponse.json(
      { error: "Failed to import FAQ" },
      { status: 500 }
    );
  }
}
