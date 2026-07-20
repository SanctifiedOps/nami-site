import { NextResponse } from "next/server";
import crypto from "node:crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NETWORK_SOURCE = "namicreative.co.uk/network";
const WHATSAPP_URL = "https://chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr";
const THANK_YOU_URL = "https://namicreative.co.uk/network/thank-you";
const MAIN_SITE_URL = "https://namicreative.co.uk";

type NetworkPayload = {
  name?: unknown;
  email?: unknown;
  instagram?: unknown;
  category?: unknown;
  location?: unknown;
  note?: unknown;
  link?: unknown;
  website?: unknown;
};

type Cleaned = {
  name: string;
  email: string;
  instagram: string;
  category: string;
  location: string;
  note: string;
  link: string;
};

function str(v: unknown, max = 1000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function clean(p: NetworkPayload): Cleaned {
  return {
    name: str(p.name, 120),
    email: str(p.email, 200).toLowerCase(),
    instagram: str(p.instagram, 120),
    category: str(p.category, 80),
    location: str(p.location, 140),
    note: str(p.note, 2000),
    link: str(p.link, 300),
  };
}

function firstAndLast(name: string): { firstName: string; lastName: string } {
  const parts = name.split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

function tagsFor(d: Cleaned): string[] {
  const tags = [
    "Community",
    "Feature submission",
    "source:instagram-network",
    "type:feature-submission",
  ];
  if (d.category) tags.push(`category:${d.category}`);
  return tags;
}

function enrichedMessage(d: Cleaned): string {
  return [
    d.note,
    `Instagram: ${d.instagram}`,
    `Category: ${d.category}`,
    `Location: ${d.location}`,
    d.link ? `Link: ${d.link}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function confirmationEmailFor(d: Cleaned) {
  const { firstName } = firstAndLast(d.name);
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";

  return {
    to: d.email,
    recipientEmail: d.email,
    subject: "Nice one - your NAMI Creative Network submission landed",
    heading: "Nice one. Your submission landed.",
    previewText:
      "Putting creative work into the world takes graft. Thanks for sharing it with NAMI.",
    body: [
      greeting,
      "",
      "Nice one for putting your work forward for NAMI Creative Network.",
      "",
      "Putting creative work out into the world takes graft. Whether it is finished, still finding its feet, or just ready for more people to see it, sharing it is something worth backing.",
      "",
      "I will take a look and keep an eye on what you are building. NAMI is here to support North East creatives, artists, businesses, and brands doing proper work.",
      "",
      `You can join the WhatsApp community here: ${WHATSAPP_URL}`,
      "",
      "Need help with your content, website, or buyer journey? I help businesses sort the brand, content, website, and automation behind the scenes, so the work feels clearer and easier to keep on top of.",
      "",
      `View the main website: ${MAIN_SITE_URL}`,
      "",
      "Cheers,",
      "Joe at NAMI Creative",
    ].join("\n"),
    whatsappUrl: WHATSAPP_URL,
    thankYouUrl: THANK_YOU_URL,
    mainSiteUrl: MAIN_SITE_URL,
  };
}

async function upsertMailchimp(d: Cleaned): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.warn("Mailchimp env vars missing - skipping network upsert.");
    return;
  }
  const dc = apiKey.split("-")[1];
  if (!dc) {
    console.warn("Mailchimp API key malformed - skipping network upsert.");
    return;
  }

  const { firstName, lastName } = firstAndLast(d.name);
  const subscriberHash = crypto
    .createHash("md5")
    .update(d.email)
    .digest("hex");

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
          FNAME: firstName,
          LNAME: lastName,
          COMPANY: d.instagram,
          PTYPE: "feature-submission",
          MESSAGE: enrichedMessage(d).slice(0, 500),
        },
        tags: tagsFor(d),
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Mailchimp network upsert non-2xx:", res.status, body.slice(0, 400));
  }
}

async function notifyMake(d: Cleaned): Promise<void> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) {
    console.warn("CONTACT_WEBHOOK_URL not set - skipping network notification.");
    return;
  }

  const { firstName, lastName } = firstAndLast(d.name);
  const message = enrichedMessage(d);
  const submittedAt = new Date().toISOString();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: d.name,
      firstName,
      lastName,
      email: d.email,
      instagram: d.instagram,
      company: d.instagram,
      category: d.category,
      location: d.location,
      link: d.link,
      note: d.note,
      projectType: "Creative Network enquiry",
      budget: "",
      brief: message,
      message,
      subject: "Creative Network enquiry",
      emailSubject: "Creative Network enquiry from NAMI Creative Network",
      heading: "Creative Network enquiry",
      enquiryType: "Creative Network enquiry",
      notificationType: "creative-network-internal",
      sendCreativeEmail: true,
      confirmationEmail: confirmationEmailFor(d),
      tags: tagsFor(d),
      submittedAt,
      source: NETWORK_SOURCE,
      sourceRef: NETWORK_SOURCE,
      type: "feature-submission",
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Make network webhook non-2xx:", res.status, body.slice(0, 400));
  }
}

async function notifyDashboard(d: Cleaned): Promise<void> {
  const url = process.env.DASHBOARD_LEAD_WEBHOOK_URL;
  const secret = process.env.DASHBOARD_LEAD_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.warn(
      "DASHBOARD_LEAD_WEBHOOK_URL or DASHBOARD_LEAD_WEBHOOK_SECRET not set - skipping network dashboard notify.",
    );
    return;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      name: d.name,
      email: d.email,
      company: d.instagram,
      message: enrichedMessage(d),
      subject: `Creative Network enquiry - ${d.category}`,
      source: "instagram-network",
      sourceRef: NETWORK_SOURCE,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Dashboard network webhook non-2xx:", res.status, body.slice(0, 400));
  }
}

export async function POST(req: Request) {
  let payload: NetworkPayload;
  try {
    payload = (await req.json()) as NetworkPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const d = clean(payload);

  if (!d.name) {
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
  if (!d.instagram) {
    return NextResponse.json(
      { error: "Please add an Instagram handle." },
      { status: 400 },
    );
  }
  if (!d.category) {
    return NextResponse.json(
      { error: "Please choose a category." },
      { status: 400 },
    );
  }
  if (!d.location) {
    return NextResponse.json(
      { error: "Please add a North East location." },
      { status: 400 },
    );
  }
  if (!d.note || d.note.length < 10) {
    return NextResponse.json(
      { error: "Tell me a little more about the work." },
      { status: 400 },
    );
  }

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
      "All network submission pathways failed:",
      makeRes.status === "rejected" ? makeRes.reason : null,
      mcRes.status === "rejected" ? mcRes.reason : null,
      dashRes.status === "rejected" ? dashRes.reason : null,
    );
    return NextResponse.json(
      { error: "We couldn't send this. Please email hello@namicreative.co.uk." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
