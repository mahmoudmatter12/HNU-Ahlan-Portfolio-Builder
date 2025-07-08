import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const startTime = Date.now();

  try {
    // Database health checks
    const dbStartTime = Date.now();
    await db.$queryRaw`SELECT 1 as health`;
    const dbResponseTime = Date.now() - dbStartTime;

    // Get detailed statistics
    const [
      userStats,
      collegeStats,
      formStats,
      submissionStats,
      recentActivity,
    ] = await Promise.all([
      // User statistics
      db.user.groupBy({
        by: ["userType"],
        _count: true,
      }),

      // College statistics
      db.college.groupBy({
        by: ["type"],
        _count: true,
      }),

      // Form statistics (forms created in last 30 days)
      db.formSection.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Submission statistics (submissions in last 30 days)
      db.formSubmission.count({
        where: {
          submittedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Recent activity (last 10 submissions)
      db.formSubmission.findMany({
        take: 10,
        orderBy: { submittedAt: "desc" },
        include: {
          college: { select: { name: true } },
          formSection: { select: { title: true } },
        },
      }),
    ]);

    const totalResponseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      responseTime: `${totalResponseTime}ms`,
      database: {
        status: "connected",
        responseTime: `${dbResponseTime}ms`,
      },
      statistics: {
        users: {
          byType: userStats.reduce((acc: any, stat: any) => {
            acc[stat.userType] = stat._count;
            return acc;
          }, {}),
          total: userStats.reduce(
            (sum: any, stat: any) => sum + stat._count,
            0
          ),
        },
        colleges: {
          byType: collegeStats.reduce((acc: any, stat: any) => {
            acc[stat.type] = stat._count;
            return acc;
          }, {}),
          total: collegeStats.reduce(
            (sum: any, stat: any) => sum + stat._count,
            0
          ),
        },
        forms: {
          createdLast30Days: formStats,
        },
        submissions: {
          submittedLast30Days: submissionStats,
        },
      },
      recentActivity: recentActivity.map((submission: any) => ({
        id: submission.id,
        college: submission.college.name,
        form: submission.formSection.title,
        submittedAt: submission.submittedAt,
      })),
      system: {
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    });
  } catch (error) {
    console.error("Detailed health check failed:", error);

    const totalResponseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        responseTime: `${totalResponseTime}ms`,
        database: {
          status: "disconnected",
          error: error instanceof Error ? error.message : String(error),
        },
        system: {
          version: process.env.npm_package_version || "1.0.0",
          environment: process.env.NODE_ENV || "development",
          nodeVersion: process.version,
        },
      },
      { status: 503 }
    );
  }
}
