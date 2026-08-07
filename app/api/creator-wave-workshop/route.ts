import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  instagram?: unknown;
  packageInterest?: unknown;
  link?: unknown;
  painPoint?: unknown;
  message?: unknown;
  website?: unknown;
};

type Cleaned = {
  name: string;
  email: string;
  instagram: string;
  packageInterest: string;
  link: string;
  painPoint: string;
  message: string;
};

function str(v: unknown, max = 1000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function clean(p: Payload): Cleaned {
  return {
    name: str(p.name, 120),
    email: str(p.email, 200).toLowerCase(),
    instagram: str(p.instagram, 120),
    packageInterest: str(p.packageInterest, 80),
    link: str(p.link, 300),
    painPoint: str(p.painPoint, 120),
    message: str(p.message, 2000),
  };
}

function tagsFor(d: Cleaned): string[] {
  return [
    "Enquiry",
    "Creator Wave Workshop",
    "source:creator-wave-workshop",
    d.packageInterest ? `package:${d.packageInterest}` : "package:unknown",
    d.painPoint ? `pain:${d.painPoint}` : "pain:unknown",
  ];
}

async function notifyMake(d: Cleaned): Promise<void> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) {
    console.warn("CONTACT_WEBHOOK_URL not set - skipping Make notification.");
    return;
  }

  const submittedAt = new Date().toISOString();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: d.name,
      lastName: "",
      name: d.name,
      email: d.email,
      company: d.instagram,
      projectType: "Creator Wave Workshop",
      budget: d.packageInterest,
      message: [
        d.message,
        d.instagram ? `Instagram: ${d.instagram}` : null,
        d.link ? `Link: ${d.link}` : null,
        d.painPoint ? `Main pain: ${d.painPoint}` : null,
        d.packageInterest ? `Package interest: ${d.packageInterest}` : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
      subject: `Creator Wave Workshop enquiry - ${d.packageInterest || d.name}`,
      emailSubject: `Creator Wave Workshop enquiry - ${d.name}`,
      heading: "Creator Wave Workshop enquiry",
      enquiryType: "Creator Wave Workshop",
      notificationType: "creator-wave-workshop",
      tags: tagsFor(d),
      submittedAt,
      source: "namicreative.co.uk/offers/creator-wave-workshop",
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
      "DASHBOARD_LEAD_WEBHOOK_URL or DASHBOARD_LEAD_WEBHOOK_SECRET not set - skipping dashboard notify.",
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
      company: d.instagram || undefined,
      message:
        [
          d.message,
          d.link ? `Link: ${d.link}` : null,
          d.painPoint ? `Main pain: ${d.painPoint}` : null,
          d.packageInterest ? `Package interest: ${d.packageInterest}` : null,
        ]
          .filter(Boolean)
          .join("\n\n") || "Creator Wave Workshop enquiry.",
      subject: `Creator Wave Workshop - ${d.packageInterest || "enquiry"}`,
      source: "website",
      sourceRef: "namicreative.co.uk/offers/creator-wave-workshop",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Dashboard webhook non-2xx:", res.status, body.slice(0, 400));
  }
}

export async function POST(req: Request) {
  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const d = clean(payload);

  if (!d.name) {
    return NextResponse.json({ error: "Please share your name." }, { status: 400 });
  }

  if (!d.email || !EMAIL_RE.test(d.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!d.packageInterest) {
    return NextResponse.json(
      { error: "Please choose what you want help with." },
      { status: 400 },
    );
  }

  const [makeRes, dashRes] = await Promise.allSettled([
    notifyMake(d),
    notifyDashboard(d),
  ]);

  if (makeRes.status === "rejected" && dashRes.status === "rejected") {
    console.error("Creator Wave Workshop pathways failed:", makeRes.reason, dashRes.reason);
    return NextResponse.json(
      { error: "I couldn't send that. Please email hello@namicreative.co.uk." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
