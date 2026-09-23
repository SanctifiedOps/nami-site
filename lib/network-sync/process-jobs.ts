import "server-only";

import { and, asc, eq, inArray, lte } from "drizzle-orm";
import { getNetworkDb, schema } from "@/lib/network-db";
import { retryNetworkEmailJob } from "@/lib/network-auth/email";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { syncMemberToGoogleSheet } from "./google-sheet";

const nextAttempt = (attempts: number) => new Date(Date.now() + Math.min(24 * 60, 2 ** attempts * 5) * 60 * 1000);

export async function processNetworkJobs(limit = 10, jobType: "all" | "sheet" | "email" = "all") {
  const db = await getNetworkDb(); const now = new Date();
  const env = await getRuntimeEnvironment();
  const emailRetriesEnabled = env.OUTBOUND_EMAIL_MODE === "live" && env.OUTBOUND_EMAIL_RETRY_MODE === "live";
  const sheetJobs = jobType === "email" ? [] : await db.select().from(schema.sheetSyncJobs).where(and(inArray(schema.sheetSyncJobs.status, ["pending", "failed"]), lte(schema.sheetSyncJobs.nextAttemptAt, now))).orderBy(asc(schema.sheetSyncJobs.createdAt)).limit(limit);
  const emailJobs = jobType === "sheet" || !emailRetriesEnabled ? [] : await db.select().from(schema.emailJobs).where(and(eq(schema.emailJobs.status, "failed"), lte(schema.emailJobs.nextAttemptAt, now))).orderBy(asc(schema.emailJobs.createdAt)).limit(limit);
  let completed = 0; let failed = 0;
  for (const job of sheetJobs) {
    try { await db.update(schema.sheetSyncJobs).set({ status: "processing", updatedAt: now }).where(eq(schema.sheetSyncJobs.id, job.id)); await syncMemberToGoogleSheet(job.memberId); await db.update(schema.sheetSyncJobs).set({ status: "complete", completedAt: new Date(), updatedAt: new Date(), lastError: null }).where(eq(schema.sheetSyncJobs.id, job.id)); completed++; }
    catch (error) { const attempts = job.attempts + 1; await db.update(schema.sheetSyncJobs).set({ status: "failed", attempts, nextAttemptAt: nextAttempt(attempts), lastError: String(error).slice(0, 800), updatedAt: new Date() }).where(eq(schema.sheetSyncJobs.id, job.id)); failed++; }
  }
  for (const job of emailJobs) {
    try { await db.update(schema.emailJobs).set({ status: "processing", updatedAt: now }).where(eq(schema.emailJobs.id, job.id)); await retryNetworkEmailJob(job); await db.update(schema.emailJobs).set({ status: "sent", sentAt: new Date(), updatedAt: new Date(), lastError: null }).where(eq(schema.emailJobs.id, job.id)); completed++; }
    catch (error) { const attempts = job.attempts + 1; await db.update(schema.emailJobs).set({ status: "failed", attempts, nextAttemptAt: nextAttempt(attempts), lastError: String(error).slice(0, 800), updatedAt: new Date() }).where(eq(schema.emailJobs.id, job.id)); failed++; }
  }
  return { processed: sheetJobs.length + emailJobs.length, completed, failed };
}
