import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const logs = await db.auditLog.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          name: true,
          userType: true,
        },
      },
    },
  });
  if (!logs) {
    return NextResponse.json({ error: "No logs found" }, { status: 404 });
  }
  const returnedLogsObject = {
    logs: logs,
    _count: {
      totalLogs: logs.length,
    },
  };
  return NextResponse.json(returnedLogsObject);
}
