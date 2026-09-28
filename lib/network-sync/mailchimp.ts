import "server-only";

import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { getNetworkDb, schema } from "@/lib/network-db";

const JOURNEY_ID = "97";
const JOURNEY_STEP_ID = "411";

function tagsFor(category: string) {
  const tags = [
    "Creative Network",
    "NAMI Creative Network",
    "Community",
    "Feature submission",
    "source:instagram-network",
    "type:feature-submission",
  ];
  if (category.trim()) tags.push(`category:${category.trim()}`, `network-category:${category.trim()}`);
  return tags;
}

export async function syncApplicationToMailchimp(applicationId: string, triggerWelcome: boolean) {
  const env = await getRuntimeEnvironment();
  const apiKey = env.MAILCHIMP_API_KEY;
  const audienceId = env.MAILCHIMP_AUDIENCE_ID;
  const dc = env.MAILCHIMP_SERVER_PREFIX || apiKey?.split("-")[1];
  if (!apiKey || !audienceId || !dc) throw new Error("Mailchimp credentials are incomplete.");

  const db = await getNetworkDb();
  const [application] = await db.select().from(schema.networkApplications)
    .where(eq(schema.networkApplications.id, applicationId)).limit(1);
  if (!application) throw new Error(`Network application ${applicationId} was not found.`);

  const email = application.email.trim().toLowerCase();
  const subscriberHash = crypto.createHash("md5").update(email).digest("hex");
  const headers = { "Content-Type": "application/json", Authorization: `apikey ${apiKey}` };
  const upsert = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      email_address: email,
      status_if_new: "subscribed",
      merge_fields: {
        FNAME: application.firstName,
        PTYPE: "Creative Network",
        MESSAGE: [
          application.bio,
          application.instagramUrl ? `Instagram: ${application.instagramUrl}` : null,
          `Category: ${application.requestedCategory}`,
          `Location: ${application.location}`,
          application.websiteUrl ? `Link: ${application.websiteUrl}` : null,
        ].filter(Boolean).join("\n\n").slice(0, 500),
      },
      tags: tagsFor(application.requestedCategory),
    }),
  });
  if (!upsert.ok) throw new Error(`Mailchimp audience sync failed (${upsert.status}): ${(await upsert.text()).slice(0, 500)}`);
  const member = await upsert.json() as { status?: string };
  if (member.status !== "subscribed") throw new Error(`Mailchimp contact status is ${member.status || "unknown"}, not subscribed.`);

  if (triggerWelcome) {
    const trigger = await fetch(`https://${dc}.api.mailchimp.com/3.0/customer-journeys/journeys/${JOURNEY_ID}/steps/${JOURNEY_STEP_ID}/actions/trigger`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email_address: email }),
    });
    if (!trigger.ok) throw new Error(`Mailchimp welcome trigger failed (${trigger.status}): ${(await trigger.text()).slice(0, 500)}`);
  }

  return { audienceSyncedAt: new Date(), welcomeTriggeredAt: triggerWelcome ? new Date() : null, contactStatus: member.status };
}

export async function changeMailchimpContactEmail(oldEmail: string, newEmail: string, firstName: string) {
  const env = await getRuntimeEnvironment();
  const apiKey = env.MAILCHIMP_API_KEY;
  const audienceId = env.MAILCHIMP_AUDIENCE_ID;
  const dc = env.MAILCHIMP_SERVER_PREFIX || apiKey?.split("-")[1];
  if (!apiKey || !audienceId || !dc) throw new Error("Mailchimp credentials are incomplete.");

  const previous = oldEmail.trim().toLowerCase();
  const next = newEmail.trim().toLowerCase();
  const previousHash = crypto.createHash("md5").update(previous).digest("hex");
  const nextHash = crypto.createHash("md5").update(next).digest("hex");
  const headers = { "Content-Type": "application/json", Authorization: `apikey ${apiKey}` };
  const previousUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${previousHash}`;

  const existing = await fetch(previousUrl, { headers });
  let response: Response;
  if (existing.ok) {
    const existingMember = await existing.json() as { status?: string };
    if (existingMember.status === "subscribed") {
      response = await fetch(previousUrl, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ email_address: next, merge_fields: { FNAME: firstName } }),
      });
    } else {
      response = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${nextHash}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          email_address: next,
          status_if_new: "subscribed",
          merge_fields: { FNAME: firstName, PTYPE: "Creative Network" },
          tags: tagsFor(""),
        }),
      });
    }
  } else if (existing.status === 404) {
    response = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${nextHash}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        email_address: next,
        status_if_new: "subscribed",
        merge_fields: { FNAME: firstName, PTYPE: "Creative Network" },
        tags: tagsFor(""),
      }),
    });
  } else {
    throw new Error(`Mailchimp lookup failed (${existing.status}): ${(await existing.text()).slice(0, 500)}`);
  }

  if (!response.ok) throw new Error(`Mailchimp email update failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
  const member = await response.json() as { email_address?: string; status?: string };
  if (member.email_address?.trim().toLowerCase() !== next) throw new Error("Mailchimp returned a different email address after the update.");
  return { email: member.email_address, status: member.status ?? "unknown" };
}
