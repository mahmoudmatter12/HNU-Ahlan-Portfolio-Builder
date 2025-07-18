import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, slug, logoUrl, socialMedia, description, newsItems } =
    await request.json();

  const uni = await db.university.create({
    data: { name, slug, logoUrl, socialMedia, description, newsItems },
  });

  return NextResponse.json(uni);
}
