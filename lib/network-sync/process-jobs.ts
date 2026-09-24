import "server-only";

import { and, asc, eq, inArray, lte } from "drizzle-orm";
import { getNetworkDb, schema } from "@/lib/network-db";
import { retryNetworkEmailJob } from "@/lib/network-auth/email";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { syncMemberToGoogleSheet } from "./google-sheet";
import { syncApplicationToMailchimp } from "./mailchimp";
import { generateDirectoryBio } from "./directory-bio";
import { retryOwnerAlertJob } from "@/lib/network-ops/owner-alerts";

const nextAttempt = (attempts: number) => new Date(Date.now() + Math.min(24 * 60, 2 ** attempts * 5) * 60 * 1000);

export async function processNetworkJobs(limit = 10, jobType: "all" | "sheet" | "email" | "mailchimp" | "bio" | "owner" = "all") {
  const db = await getNetworkDb(); const now = new Date();
  const env = await getRuntimeEnvironment();
  const staleBefore = new Date(Date.now() - 15 * 60 * 1000);
  const staleError = "Recovered after the previous processing attempt stopped unexpectedly.";
  await Promise.all([
    db.update(schema.sheetSyncJobs).set({ status: "failed", lastError: staleError, nextAttemptAt: now, updatedAt: now }).where(and(eq(schema.sheetSyncJobs.status, "processing"), lte(schema.sheetSyncJobs.updatedAt, staleBefore))),
    db.update(schema.mailchimpSyncJobs).set({ status: "failed", lastError: staleError, nextAttemptAt: now, updatedAt: now }).where(and(eq(schema.mailchimpSyncJobs.status, "processing"), lte(schema.mailchimpSyncJobs.updatedAt, staleBefore))),
    db.update(schema.bioGenerationJobs).set({ status: "failed", lastError: staleError, nextAttemptAt: now, updatedAt: now }).where(and(eq(schema.bioGenerationJobs.status, "processing"), lte(schema.bioGenerationJobs.updatedAt, staleBefore))),
    db.update(schema.ownerAlertJobs).set({ status: "failed", lastError: staleError, nextAttemptAt: now, updatedAt: now }).where(and(eq(schema.ownerAlertJobs.status, "processing"), lte(schema.ownerAlertJobs.updatedAt, staleBefore))),
  ]);
  const emailRetriesEnabled = env.OUTBOUND_EMAIL_MODE === "live" && env.OUTBOUND_EMAIL_RETRY_MODE === "live";
  const mailchimpEnabled = env.MAILCHIMP_NETWORK_MODE === "live";
  const only = (type: string) => jobType !== "all" && jobType !== type;
  const sheetJobs = only("sheet") ? [] : await db.select().from(schema.sheetSyncJobs).where(and(inArray(schema.sheetSyncJobs.status, ["pending", "failed"]), lte(schema.sheetSyncJobs.nextAttemptAt, now))).orderBy(asc(schema.sheetSyncJobs.createdAt)).limit(limit);
  const emailJobs = only("email") || !emailRetriesEnabled ? [] : await db.select().from(schema.emailJobs).where(and(eq(schema.emailJobs.status, "failed"), lte(schema.emailJobs.nextAttemptAt, now))).orderBy(asc(schema.emailJobs.createdAt)).limit(limit);
  const mailchimpJobs = only("mailchimp") || !mailchimpEnabled ? [] : await db.select().from(schema.mailchimpSyncJobs).where(and(inArray(schema.mailchimpSyncJobs.status, ["pending", "failed"]), lte(schema.mailchimpSyncJobs.nextAttemptAt, now))).orderBy(asc(schema.mailchimpSyncJobs.createdAt)).limit(limit);
  const bioJobs = only("bio") ? [] : await db.select().from(schema.bioGenerationJobs).where(and(inArray(schema.bioGenerationJobs.status, ["pending", "failed"]), lte(schema.bioGenerationJobs.nextAttemptAt, now))).orderBy(asc(schema.bioGenerationJobs.createdAt)).limit(limit);
  const ownerJobs = only("owner") ? [] : await db.select().from(schema.ownerAlertJobs).where(and(inArray(schema.ownerAlertJobs.status, ["pending", "failed"]), lte(schema.ownerAlertJobs.nextAttemptAt, now))).orderBy(asc(schema.ownerAlertJobs.createdAt)).limit(limit);
  let completed = 0; let failed = 0;
  for (const job of sheetJobs) {
    try { await db.update(schema.sheetSyncJobs).set({ status: "processing", updatedAt: now }).where(eq(schema.sheetSyncJobs.id, job.id)); await syncMemberToGoogleSheet(job.memberId); await db.update(schema.sheetSyncJobs).set({ status: "complete", completedAt: new Date(), updatedAt: new Date(), lastError: null }).where(eq(schema.sheetSyncJobs.id, job.id)); completed++; }
    catch (error) { const attempts = job.attempts + 1; await db.update(schema.sheetSyncJobs).set({ status: "failed", attempts, nextAttemptAt: nextAttempt(attempts), lastError: String(error).slice(0, 800), updatedAt: new Date() }).where(eq(schema.sheetSyncJobs.id, job.id)); failed++; }
  }
  for (const job of emailJobs) {
    try { await db.update(schema.emailJobs).set({ status: "processing", updatedAt: now }).where(eq(schema.emailJobs.id, job.id)); await retryNetworkEmailJob(job); await db.update(schema.emailJobs).set({ status: "sent", sentAt: new Date(), updatedAt: new Date(), lastError: null }).where(eq(schema.emailJobs.id, job.id)); completed++; }
    catch (error) { const attempts = job.attempts + 1; await db.update(schema.emailJobs).set({ status: "failed", attempts, nextAttemptAt: nextAttempt(attempts), lastError: String(error).slice(0, 800), updatedAt: new Date() }).where(eq(schema.emailJobs.id, job.id)); failed++; }
  }
  for (const job of mailchimpJobs) {
    try {
      await db.update(schema.mailchimpSyncJobs).set({ status: "processing", updatedAt: now }).where(eq(schema.mailchimpSyncJobs.id, job.id));
      const result = await syncApplicationToMailchimp(job.applicationId, !job.welcomeTriggeredAt);
      const completedAt = new Date();
      await db.batch([
        db.update(schema.mailchimpSyncJobs).set({ status: "complete", audienceSyncedAt: result.audienceSyncedAt, welcomeTriggeredAt: job.welcomeTriggeredAt || result.welcomeTriggeredAt, contactStatus: result.contactStatus, completedAt, updatedAt: completedAt, lastError: null }).where(eq(schema.mailchimpSyncJobs.id, job.id)),
        db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: job.applicationId, status: "pending", attempts: 0, nextAttemptAt: completedAt, createdAt: completedAt, updatedAt: completedAt }),
      ]);
      completed++;
    } catch (error) {
      const attempts = job.attempts + 1;
      await db.update(schema.mailchimpSyncJobs).set({ status: "failed", attempts, nextAttemptAt: nextAttempt(attempts), lastError: String(error).slice(0, 800), updatedAt: new Date() }).where(eq(schema.mailchimpSyncJobs.id, job.id));
      failed++;
    }
  }
  for (const job of bioJobs) {
    try {
      await db.update(schema.bioGenerationJobs).set({ status: "processing", updatedAt: now }).where(eq(schema.bioGenerationJobs.id, job.id));
      const bio = await generateDirectoryBio(job.applicationId);
      const completedAt = new Date();
      await db.batch([
        db.update(schema.networkApplications).set({ suggestedBio: bio, bioGenerationStatus: "complete", bioGenerationError: null }).where(eq(schema.networkApplications.id, job.applicationId)),
        db.update(schema.bioGenerationJobs).set({ status: "complete", completedAt, updatedAt: completedAt, lastError: null }).where(eq(schema.bioGenerationJobs.id, job.id)),
        db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: job.applicationId, status: "pending", attempts: 0, nextAttemptAt: completedAt, createdAt: completedAt, updatedAt: completedAt }),
      ]);
      completed++;
    } catch (error) {
      const attempts = job.attempts + 1; const message = String(error).slice(0, 800);
      await db.batch([
        db.update(schema.bioGenerationJobs).set({ status: "failed", attempts, nextAttemptAt: nextAttempt(attempts), lastError: message, updatedAt: new Date() }).where(eq(schema.bioGenerationJobs.id, job.id)),
        db.update(schema.networkApplications).set({ bioGenerationStatus: "failed", bioGenerationError: message }).where(eq(schema.networkApplications.id, job.applicationId)),
      ]);
      failed++;
    }
  }
  for (const job of ownerJobs) {
    try {
      await db.update(schema.ownerAlertJobs).set({ status: "processing", updatedAt: now }).where(eq(schema.ownerAlertJobs.id, job.id));
      await retryOwnerAlertJob(job);
      await db.update(schema.ownerAlertJobs).set({ status: "sent", sentAt: new Date(), updatedAt: new Date(), lastError: null }).where(eq(schema.ownerAlertJobs.id, job.id));
      completed++;
    } catch (error) {
      const attempts = job.attempts + 1;
      await db.update(schema.ownerAlertJobs).set({ status: "failed", attempts, nextAttemptAt: nextAttempt(attempts), lastError: String(error).slice(0, 800), updatedAt: new Date() }).where(eq(schema.ownerAlertJobs.id, job.id));
      failed++;
    }
  }
  return { processed: sheetJobs.length + emailJobs.length + mailchimpJobs.length + bioJobs.length + ownerJobs.length, completed, failed };
}
