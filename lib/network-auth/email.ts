import "server-only";

import { eq } from "drizzle-orm";
import { getNetworkDb, schema } from "@/lib/network-db";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";

type NetworkEmailTemplate =
  | "profile-ready"
  | "verify-account"
  | "reset-password"
  | "password-changed"
  | "account-attempt";

type SendNetworkEmailInput = {
  memberId?: string;
  recipient: string;
  template: NetworkEmailTemplate;
  subject: string;
  heading: string;
  body: string;
  actionLabel?: string;
  actionUrl?: string;
};

function isAllowedAccountRecovery(input: SendNetworkEmailInput, env: Record<string, string | undefined>) {
  if (input.template !== "reset-password" && input.template !== "password-changed") return false;
  const allowedRecipients = (env.ACCOUNT_RECOVERY_ALLOWED_RECIPIENTS || "")
    .split(",")
    .map((address) => address.trim().toLowerCase())
    .filter(Boolean);
  return allowedRecipients.includes(input.recipient.trim().toLowerCase());
}

const encode = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);

function renderEmail(input: SendNetworkEmailInput) {
  const action = input.actionUrl && input.actionLabel
    ? `<p style="margin:28px 0"><a href="${encode(input.actionUrl)}" style="display:inline-block;background:#ff00a8;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">${encode(input.actionLabel)}</a></p>`
    : "";

  return `<!doctype html><html><body style="margin:0;background:#0b0b0d;color:#f7f7f7;font-family:Arial,sans-serif"><div style="max-width:620px;margin:auto;padding:42px 24px"><p style="color:#ff00a8;font-weight:800">NAMI <span style="color:#fff;font-weight:400">CREATIVE</span></p><h1 style="font-size:34px;line-height:1.05">${encode(input.heading)}</h1><p style="font-size:17px;line-height:1.6;color:#d4d4d8">${encode(input.body)}</p>${action}<p style="margin-top:36px;color:#9ca3af;font-size:13px">If you did not request this, you can ignore this email or reply to hello@namicreative.co.uk.</p></div></body></html>`;
}

async function graphToken() {
  const env = await getRuntimeEnvironment();
  const tenant = env.MS_GRAPH_TENANT_ID;
  const clientId = env.MS_GRAPH_CLIENT_ID;
  const clientSecret = env.MS_GRAPH_CLIENT_SECRET;
  if (!tenant || !clientId || !clientSecret) throw new Error("Microsoft Graph email credentials are incomplete.");

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
  if (!response.ok) throw new Error(`Microsoft Graph token request failed (${response.status}).`);
  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) throw new Error("Microsoft Graph did not return an access token.");
  return payload.access_token;
}

export async function sendViaGraph(input: SendNetworkEmailInput) {
  const env = await getRuntimeEnvironment();
  const allowedAccountRecovery = isAllowedAccountRecovery(input, env);
  if (env.OUTBOUND_EMAIL_MODE !== "live" && !allowedAccountRecovery) {
    throw new Error("Outbound member email is on hold for this environment.");
  }
  if (env.MS_GRAPH_MAILBOX_SCOPE_VERIFIED !== "true") {
    throw new Error("Microsoft Graph mailbox scope has not been verified.");
  }
  if (env.APP_ENV !== "production" && !allowedAccountRecovery) {
    const allowedRecipients = (env.OUTBOUND_EMAIL_ALLOWED_RECIPIENTS || "")
      .split(",")
      .map((address) => address.trim().toLowerCase())
      .filter(Boolean);
    if (!allowedRecipients.includes(input.recipient.trim().toLowerCase())) {
      throw new Error("This recipient is not allowed in the staging email test.");
    }
  }
  const sender = env.OWNER_EMAIL || "hello@namicreative.co.uk";
  const token = await graphToken();
  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        subject: input.subject,
        body: { contentType: "HTML", content: renderEmail(input) },
        toRecipients: [{ emailAddress: { address: input.recipient } }],
        replyTo: [{ emailAddress: { address: sender } }],
      },
      saveToSentItems: true,
    }),
  });
  if (response.status !== 202) throw new Error(`Microsoft Graph send was not accepted (${response.status}).`);
}

export async function retryNetworkEmailJob(job: typeof schema.emailJobs.$inferSelect) {
  const payload = job.payload;
  await sendViaGraph({
    memberId: job.memberId ?? undefined,
    recipient: job.recipient,
    template: job.template as NetworkEmailTemplate,
    subject: payload.subject,
    heading: payload.heading,
    body: payload.body,
    actionLabel: payload.actionLabel || undefined,
    actionUrl: payload.actionUrl || undefined,
  });
}

export async function sendNetworkEmail(input: SendNetworkEmailInput) {
  const db = await getNetworkDb();
  const env = await getRuntimeEnvironment();
  const id = crypto.randomUUID();
  const now = new Date();
  const onHold = env.OUTBOUND_EMAIL_MODE !== "live" && !isAllowedAccountRecovery(input, env);
  await db.insert(schema.emailJobs).values({
    id,
    memberId: input.memberId,
    recipient: input.recipient,
    template: input.template,
    payload: {
      subject: input.subject,
      heading: input.heading,
      body: input.body,
      actionLabel: input.actionLabel ?? "",
      actionUrl: input.actionUrl ?? "",
    },
    status: onHold ? "pending" : "processing",
    attempts: onHold ? 0 : 1,
    nextAttemptAt: now,
  });

  if (onHold) return;

  try {
    await sendViaGraph(input);
    await db.update(schema.emailJobs).set({ status: "sent", sentAt: new Date(), updatedAt: new Date() }).where(eq(schema.emailJobs.id, id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email delivery error";
    await db.update(schema.emailJobs).set({
      status: "failed",
      lastError: message.slice(0, 800),
      nextAttemptAt: new Date(Date.now() + 10 * 60 * 1000),
      updatedAt: new Date(),
    }).where(eq(schema.emailJobs.id, id));
    throw error;
  }
}
