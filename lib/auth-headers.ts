// lib/auth-headers.ts
import { auth } from "@clerk/nextjs/server";

export async function getUserIdHeader(): Promise<string | null> {
  const { userId } = await auth(); // get user ID from auth context
  return userId ?? null;
}
