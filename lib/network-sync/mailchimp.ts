import "server-only";

import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { getNetworkDb, schema } from "@/lib/network-db";

const JOURNEY_ID = "97";
const JOURNEY_STEP_ID = "411";

function tagsFor(category: string, location: string) {
  return ["Creative Network", category.trim(), location.trim()].filter(Boolean);
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
        MESSAGE: application.bio.slice(0, 500),
      },
      tags: tagsFor(application.requestedCategory, application.location),
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

  return { audienceSyncedAt: new Date(), welcomeTriggeredAt: triggerWelcome ? new Date() : null };
}
