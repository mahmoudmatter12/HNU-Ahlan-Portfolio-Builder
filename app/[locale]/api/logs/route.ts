import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const logs = await db.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          userType: true,
        },
      },
    },
  });
  const returnedLogsObject = {
    logs: logs,
    _count: {
      totalLogs: logs.length,
    },
  };
  return NextResponse.json(returnedLogsObject);
}
