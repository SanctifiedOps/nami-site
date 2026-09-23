import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getNetworkAuth } from "./auth";
import { getNetworkDb, schema } from "@/lib/network-db";

export async function getMemberSession() {
  const auth = await getNetworkAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const db = await getNetworkDb();
  const [member] = await db.select().from(schema.members).where(eq(schema.members.authUserId, session.user.id)).limit(1);
  if (!member || member.accountStatus !== "active") return null;
  if (!member.lastLoginAt || Date.now() - member.lastLoginAt.getTime() > 60 * 60 * 1000) {
    const now = new Date();
    await db.update(schema.members).set({ lastLoginAt: now, updatedAt: now }).where(eq(schema.members.id, member.id));
    member.lastLoginAt = now;
  }
  return { session, member };
}

export async function requireMemberSession() {
  const result = await getMemberSession();
  if (!result) redirect("/network/login");
  return result;
}

export async function getNetworkAdminSession() {
  const result = await getMemberSession();
  return result?.member.role === "admin" ? result : null;
}

export async function requireNetworkAdminSession() {
  const result = await requireMemberSession();
  if (result.member.role !== "admin") redirect("/network/dashboard");
  return result;
}
