import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { FAQData } from "@/types/faq";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const college = await db.college.findUnique({
      where: { id },
      select: { faq: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const faqData: FAQData = (college.faq as any) || {
      items: [],
      title: "Frequently Asked Questions",
      description: "",
      lastUpdated: new Date(),
    };

    return NextResponse.json(faqData);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { items, title, description } = body;
  try {
    const faqData: FAQData = {
      items: items || [],
      title: title || "Frequently Asked Questions",
      description: description || "",
      lastUpdated: new Date(),
    };

    const college = await db.college.update({
      where: { id },
      data: { faq: faqData as any },
      select: { faq: true },
    });

    return NextResponse.json(college.faq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}
