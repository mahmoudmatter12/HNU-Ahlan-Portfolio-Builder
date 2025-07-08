import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAction } from "@/utils/auditLogger";

export async function GET() {
  const startTime = Date.now();

  try {
    // Test database connection
    const dbHealthCheck = await db.$queryRaw`SELECT 1 as health`;

    // Get basic stats
    const [userCount, collegeCount, formCount, submissionCount] =
      await Promise.all([
        db.user.count(),
        db.college.count(),
        db.formSection.count(),
        db.formSubmission.count(),
      ]);

    const responseTime = Date.now() - startTime;
    
    logAction({
      action: "CUSTOM",
      entity: "HealthCheck",
      metadata: {
        responseTime,
        userCount,
        collegeCount,
        formCount,
        submissionCount,
      },
    });

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        status: "connected",
        connection: dbHealthCheck ? "ok" : "error",
      },
      stats: {
        users: userCount,
        colleges: collegeCount,
        forms: formCount,
        submissions: submissionCount,
      },
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        database: {
          status: "disconnected",
          error: error instanceof Error ? error.message : String(error),
        },
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV || "development",
      },
      { status: 503 }
    );
  }
}
