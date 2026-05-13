import { NextResponse } from "next/server";
import crypto from "node:crypto";

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
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.warn("Mailchimp env vars missing — skipping upsert.");
    return;
  }
  const dc = apiKey.split("-")[1];
  if (!dc) {
    console.warn("Mailchimp API key malformed — skipping upsert.");
    return;
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
          MESSAGE: d.message.slice(0, 500),
        },
        tags: tagsFor(d),
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Mailchimp upsert non-2xx:", res.status, body.slice(0, 400));
  }
}

async function notifyMake(d: Cleaned): Promise<void> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) {
    console.warn("CONTACT_WEBHOOK_URL not set — skipping Make notification.");
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...d,
      tags: tagsFor(d),
      submittedAt: new Date().toISOString(),
      source: "namicreative.co.uk/contact",
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Make webhook non-2xx:", res.status, body.slice(0, 400));
  }
}

async function notifyDashboard(d: Cleaned): Promise<void> {
  const url = process.env.DASHBOARD_LEAD_WEBHOOK_URL;
  const secret = process.env.DASHBOARD_LEAD_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.warn(
      "DASHBOARD_LEAD_WEBHOOK_URL or DASHBOARD_LEAD_WEBHOOK_SECRET not set — skipping dashboard notify.",
    );
    return;
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
      message: enrichedMessage,
      subject: d.projectType
        ? `Contact form — ${d.projectType}`
        : "Contact form submission",
      source: "website",
      sourceRef: "namicreative.co.uk/contact",
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Dashboard webhook non-2xx:", res.status, body.slice(0, 400));
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
  if (!d.message || d.message.length < 10) {
    return NextResponse.json(
      { error: "Tell us a little more about what you're working on." },
      { status: 400 },
    );
  }

  // Run all three pathways in parallel. Each is best-effort: as long as
  // one captures the lead we return success. Failures are logged
  // server-side for follow-up.
  const [makeRes, mcRes, dashRes] = await Promise.allSettled([
    notifyMake(d),
    upsertMailchimp(d),
    notifyDashboard(d),
  ]);

  const makeOk = makeRes.status === "fulfilled";
  const mcOk = mcRes.status === "fulfilled";
  const dashOk = dashRes.status === "fulfilled";

  if (!makeOk && !mcOk && !dashOk) {
    console.error(
      "All contact pathways failed:",
      makeRes.status === "rejected" ? makeRes.reason : null,
      mcRes.status === "rejected" ? mcRes.reason : null,
      dashRes.status === "rejected" ? dashRes.reason : null,
    );
    return NextResponse.json(
      { error: "We couldn't send your message. Please email hello@namicreative.co.uk." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
