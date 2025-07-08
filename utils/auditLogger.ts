// utils/auditLogger.ts

import { db } from "@/lib/db";

export type AuditAction =
  | "CREATE_COLLEGE"
  | "UPDATE_COLLEGE"
  | "DELETE_USER"
  | "SUBMIT_FORM"
  | "CREATE_SECTION"
  | "CREATE_FORM_SECTION"
  | "CREATE_FORM_FIELD"
  | "CUSTOM";

export async function logAction({
  action,
  userId,
  entity,
  entityId,
  metadata,
}: {
  action: AuditAction;
  userId?: string;
  entity?: string;
  entityId?: string;
  metadata?: any;
}) {
  await db.auditLog.create({
    data: {
      action,
      entity: entity || "Unknown",
      entityId: entityId || undefined,
      userId,
      metadata,
    },
  });
  console.log("Audit log created");
}

// Example usage
// logAction({
//   action: "CREATE_COLLEGE",
//   userId: "12345",
//   entity: "College",
//   entityId: "67890",
//   metadata: { additionalInfo: "Some extra data" },
// });
