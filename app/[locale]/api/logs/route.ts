import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const logs = await db.auditLog.findMany();
  return NextResponse.json(logs);
}
