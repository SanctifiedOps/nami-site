import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { externalIntegrationsAllowed } from "@/lib/prelaunch-qa";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  company?: unknown;
  projectType?: unknown;
  budget?: unknown;
  message?: unknown;
  // honeypot — bots fill it, humans don't see it
  website?: unknown;
};

type Cleaned = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
};

function str(v: unknown, max = 1000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function clean(p: ContactPayload): Cleaned {
  return {
    firstName: str(p.firstName, 80),
    lastName: str(p.lastName, 80),
    email: str(p.email, 200).toLowerCase(),
    company: str(p.company, 120),
    projectType: str(p.projectType, 40),
    budget: str(p.budget, 40),
    message: str(p.message, 4000),
  };
}

function tagsFor(d: Cleaned): string[] {
  // "Enquiry" matches the existing Mailchimp segment scheme;
  // sub-tags add the granular slice for filtering and journeys.
  const tags: string[] = ["Enquiry", "source:contact-form"];
  if (d.projectType) tags.push(`type:${d.projectType}`);
  if (d.budget) tags.push(`budget:${d.budget}`);
  return tags;
}

async function upsertMailchimp(d: Cleaned): Promise<void> {
  const env = await getRuntimeEnvironment();
  const apiKey = env.MAILCHIMP_API_KEY;
  const audienceId = env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    throw new Error("Mailchimp credentials are not configured.");
  }
  const dc = apiKey.split("-")[1];
  if (!dc) {
    throw new Error("Mailchimp API key is malformed.");
  }

  const subscriberHash = crypto
    .createHash("md5")
    .update(d.email)
    .digest("hex");

  // PUT = upsert; status_if_new=subscribed because the contact form is
  // explicit consent (they wrote a brief and hit submit).
  const res = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `apikey ${apiKey}`,
      },
      body: JSON.stringify({
        email_address: d.email,
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: d.firstName,
          LNAME: d.lastName,
          COMPANY: d.company,
          PTYPE: d.projectType,
          BUDGET: d.budget,
          MESSAGE: d.message ? d.message.slice(0, 500) : "No message provided.",
        },
        tags: tagsFor(d),
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Mailchimp upsert failed: ${res.status} ${body.slice(0, 400)}`);
  }
}

async function notifyMake(d: Cleaned): Promise<void> {
  const url = (await getRuntimeEnvironment()).CONTACT_WEBHOOK_URL;
  if (!url) {
    throw new Error("Contact Make webhook is not configured.");
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...d,
      subject: d.projectType
        ? `New brief: ${d.firstName} ${d.lastName} - ${d.company || d.projectType}`
        : `New brief: ${d.firstName} ${d.lastName}`,
      emailSubject: d.projectType
        ? `New brief: ${d.firstName} ${d.lastName} - ${d.company || d.projectType}`
        : `New brief: ${d.firstName} ${d.lastName}`,
      heading: "New brief from the website",
      enquiryType: "Project brief",
      notificationType: "contact-form-brief",
      tags: tagsFor(d),
      submittedAt: new Date().toISOString(),
      source: "namicreative.co.uk/contact",
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Make contact webhook failed: ${res.status} ${body.slice(0, 400)}`);
  }
}

async function notifyDashboard(d: Cleaned): Promise<void> {
  const env = await getRuntimeEnvironment();
  const url = env.DASHBOARD_LEAD_WEBHOOK_URL;
  const secret = env.DASHBOARD_LEAD_WEBHOOK_SECRET;
  if (!url || !secret) {
    throw new Error("Owner dashboard lead webhook is not configured.");
  }

  // The dashboard wants a single `name` plus an enriched `message` so the
  // CRM activity log shows the brief context (project type + budget) without
  // needing extra schema fields.
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
  const enrichedMessage = [
    d.message,
    d.projectType ? `Project type: ${d.projectType}` : null,
    d.budget ? `Budget: ${d.budget}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      name: fullName,
      email: d.email,
      company: d.company || undefined,
      message: enrichedMessage || "No message provided.",
      subject: d.projectType
        ? `Contact form — ${d.projectType}`
        : "Contact form submission",
      source: "website",
      sourceRef: "namicreative.co.uk/contact",
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Owner dashboard lead webhook failed: ${res.status} ${body.slice(0, 400)}`);
  }
}

export async function POST(req: Request) {
  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — silently accept and discard
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const d = clean(payload);

  if (!d.firstName || !d.lastName) {
    return NextResponse.json(
      { error: "Please share your name." },
      { status: 400 },
    );
  }
  if (!d.email || !EMAIL_RE.test(d.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const env = await getRuntimeEnvironment();
  if (!externalIntegrationsAllowed(env, req, d.email)) {
    return NextResponse.json({ error: "This form is unavailable in staging." }, { status: 503 });
  }

  // Mailchimp is a secondary copy. A brief succeeds only if Make or the
  // owner dashboard receives it, so Joe has an actionable lead.
  const [makeRes, mcRes, dashRes] = await Promise.allSettled([
    notifyMake(d),
    upsertMailchimp(d),
    notifyDashboard(d),
  ]);

  const makeOk = makeRes.status === "fulfilled";
  const mcOk = mcRes.status === "fulfilled";
  const dashOk = dashRes.status === "fulfilled";

  if (!mcOk) console.warn("Contact Mailchimp copy failed:", mcRes.reason);

  if (!makeOk && !dashOk) {
    console.error(
      "All contact pathways failed:",
      makeRes.status === "rejected" ? makeRes.reason : null,
      mcRes.status === "rejected" ? mcRes.reason : null,
      dashRes.status === "rejected" ? dashRes.reason : null,
    );
    return NextResponse.json(
      { error: "I couldn't send your message. Please email hello@namicreative.co.uk." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
