import "server-only";

import { eq } from "drizzle-orm";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { getNetworkDb, schema } from "@/lib/network-db";

type OwnerAlertKind = "application" | "ticket" | "event";

type OwnerAlertInput = {
  kind: OwnerAlertKind;
  recordId: string;
  subject: string;
  heading: string;
  body: string;
  actionUrl: string;
};

const encode = (value: string) => value.replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;",
})[character] ?? character);

function allowedOwnerRecipient(env: Record<string, string | undefined>) {
  const recipient = (env.OWNER_EMAIL || "hello@namicreative.co.uk").trim().toLowerCase();
  const allowed = (env.OWNER_NOTIFICATION_ALLOWED_RECIPIENTS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return env.OWNER_NOTIFICATIONS_MODE === "live" && allowed.includes(recipient) ? recipient : null;
}

async function graphToken(env: Record<string, string | undefined>) {
  const tenant = env.MS_GRAPH_TENANT_ID;
  const clientId = env.MS_GRAPH_CLIENT_ID;
  const clientSecret = env.MS_GRAPH_CLIENT_SECRET;
  if (!tenant || !clientId || !clientSecret) throw new Error("Microsoft Graph owner-alert credentials are incomplete.");
  if (env.MS_GRAPH_MAILBOX_SCOPE_VERIFIED !== "true") throw new Error("Microsoft Graph mailbox scope has not been verified.");

  const response = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  if (!response.ok) throw new Error(`Microsoft Graph owner-alert token request failed (${response.status}).`);
  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) throw new Error("Microsoft Graph did not return an owner-alert access token.");
  return payload.access_token;
}

async function sendOwnerAlert(job: typeof schema.ownerAlertJobs.$inferSelect) {
  const env = await getRuntimeEnvironment();
  const recipient = allowedOwnerRecipient(env);
  if (!recipient || job.recipient.toLowerCase() !== recipient) throw new Error("Owner notifications are on hold or the recipient is not allowlisted.");

  const sender = env.OWNER_EMAIL || "hello@namicreative.co.uk";
  const token = await graphToken(env);
  const db = await getNetworkDb();
  const [application] = job.kind === "application"
    ? await db.select().from(schema.networkApplications).where(eq(schema.networkApplications.id, job.recordId)).limit(1)
    : [];
  const row = (label: string, value: string, href?: string) => `<tr><th style="width:145px;background:#55565a;border:1px solid #d6d6d6;padding:12px;text-align:left;vertical-align:top;color:#fff">${encode(label)}</th><td style="border:1px solid #d6d6d6;padding:12px;line-height:1.45;color:#f7f7f7">${href && value ? `<a href="${encode(href)}" style="color:#ff33b8">${encode(value)}</a>` : encode(value).replace(/\n/g, "<br>")}</td></tr>`;
  const applicationDetails = application ? `<table role="presentation" style="width:100%;border-collapse:collapse;margin:20px 0 26px"><tbody>${row("Name", application.displayName)}${row("Email", application.email, `mailto:${application.email}`)}${row("Instagram", application.instagramUrl ?? "")}${row("Category", application.requestedCategory)}${row("Location", application.location)}${row("Project link", application.websiteUrl ?? "", application.websiteUrl ?? undefined)}${row("What NAMI should know", application.bio)}${row("Source", "namicreative.co.uk/network")}${row("Submitted", application.submittedAt.toISOString())}</tbody></table>` : `<p style="font-size:17px;line-height:1.6;color:#d4d4d8">${encode(job.body)}</p>`;
  const heading = application ? "Creative Network submission" : encode(job.heading);
  const actionLabel = application ? "Review and approve application" : "Open in the owner dashboard";
  const html = `<!doctype html><html><body style="margin:0;background:#242426;color:#f7f7f7;font-family:Arial,sans-serif"><div style="max-width:700px;margin:auto;padding:42px 24px"><p style="color:#ff00a8;font-weight:800">NAMI <span style="color:#fff;font-weight:400">CREATIVE</span></p><h1 style="font-size:28px;line-height:1.1">${heading}</h1>${applicationDetails}<p style="margin:28px 0"><a href="${encode(job.actionUrl)}" style="display:inline-block;background:#ff00a8;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">${actionLabel}</a></p>${application ? `<p style="color:#b7b7bd;font-size:13px">Reply to this email to contact the submitter.</p>` : `<p style="color:#9ca3af;font-size:13px">Reference: ${encode(job.recordId)}</p>`}</div></body></html>`;
  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        subject: job.subject,
        body: { contentType: "HTML", content: html },
        toRecipients: [{ emailAddress: { address: recipient } }],
        replyTo: [{ emailAddress: { address: application?.email ?? sender } }],
      },
      saveToSentItems: true,
    }),
  });
  if (response.status !== 202) throw new Error(`Microsoft Graph owner alert was not accepted (${response.status}).`);
}

export async function queueOwnerAlert(input: OwnerAlertInput) {
  const env = await getRuntimeEnvironment();
  const recipient = allowedOwnerRecipient(env);
  if (!recipient) return { queued: false as const };

  const db = await getNetworkDb();
  const id = crypto.randomUUID();
  const now = new Date();
  await db.insert(schema.ownerAlertJobs).values({
    id,
    kind: input.kind,
    recordId: input.recordId,
    recipient,
    subject: input.subject,
    heading: input.heading,
    body: input.body,
    actionUrl: input.actionUrl,
    status: "processing",
    attempts: 1,
    nextAttemptAt: now,
    createdAt: now,
    updatedAt: now,
  });
  const [job] = await db.select().from(schema.ownerAlertJobs).where(eq(schema.ownerAlertJobs.id, id)).limit(1);
  if (!job) throw new Error("Owner alert job could not be read after creation.");
  try {
    await sendOwnerAlert(job);
    await db.update(schema.ownerAlertJobs).set({ status: "sent", sentAt: new Date(), updatedAt: new Date() }).where(eq(schema.ownerAlertJobs.id, id));
    return { queued: true as const, sent: true as const, id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown owner-alert delivery error";
    await db.update(schema.ownerAlertJobs).set({ status: "failed", lastError: message.slice(0, 800), updatedAt: new Date() }).where(eq(schema.ownerAlertJobs.id, id));
    throw error;
  }
}
