import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { normalizeExternalUrl } from "@/lib/external-url";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { externalIntegrationsAllowed } from "@/lib/prelaunch-qa";
import { queueOwnerAlert } from "@/lib/network-ops/owner-alerts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NETWORK_SOURCE = "namicreative.co.uk/network";
const WHATSAPP_URL = "https://chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr";
const THANK_YOU_URL = "https://namicreative.co.uk/network/thank-you";
const MAIN_SITE_URL = "https://namicreative.co.uk";
const CREATOR_WAVE_URL = "https://namicreative.co.uk/offers/creator-wave-workshop";
const FACEBOOK_URL = "https://www.facebook.com/groups/1033572522893615";
const DIRECTORY_URL = "https://namicreative.co.uk/network/directory";
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type NetworkPayload = {
  memberId?: unknown;
  name?: unknown;
  firstName?: unknown;
  displayName?: unknown;
  email?: unknown;
  instagram?: unknown;
  category?: unknown;
  location?: unknown;
  note?: unknown;
  link?: unknown;
  directoryConsent?: unknown;
  website?: unknown;
};

type Cleaned = {
  memberId: string;
  name: string;
  firstName: string;
  displayName: string;
  email: string;
  instagram: string;
  category: string;
  location: string;
  note: string;
  link: string;
  directoryConsent: boolean;
};

function str(v: unknown, max = 1000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function clean(p: NetworkPayload): Cleaned {
  const legacyName = str(p.name, 120);
  const firstName = str(p.firstName, 80) || firstAndLast(legacyName).firstName;
  const displayName = str(p.displayName, 120) || legacyName;
  return {
    memberId: str(p.memberId, 160)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    name: displayName,
    firstName,
    displayName,
    email: str(p.email, 200).toLowerCase(),
    instagram: str(p.instagram, 120),
    category: str(p.category, 80),
    location: str(p.location, 140),
    note: str(p.note, 2000),
    link: normalizeExternalUrl(str(p.link, 300)),
    directoryConsent: p.directoryConsent === true,
  };
}

function firstAndLast(name: string): { firstName: string; lastName: string } {
  const parts = name.split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

function tagsFor(d: Cleaned): string[] {
  const tags = [
    "Creative Network",
    "NAMI Creative Network",
    "Community",
    "Feature submission",
    "source:instagram-network",
    "type:feature-submission",
  ];
  if (d.category) tags.push(`category:${d.category}`, `network-category:${d.category}`);
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
  const greeting = d.firstName ? `Hiya ${d.firstName},` : "Hiya,";
  const htmlGreeting = escapeHtml(greeting);
  const subject = "You're in. Welcome to NAMI Creative Network";
  const body = [
    greeting,
    "",
    "Your details have landed and you're officially part of the NAMI Creative Network.",
    "",
    "I just wanted to personally say thank you for joining.",
    "",
    "You're now part of a growing network of creators, artists, musicians, freelancers, small businesses, brands and generally lush people from across the North East.",
    "",
    "The aim is to put this network in the spotlight and make it easier for people to find the creative talent already here.",
    "",
    "I want businesses, councils and brands to come to me when they need someone for a project. By joining, your name and work are now part of that roster for future features, introductions and opportunities.",
    "",
    `Your name, location, creative category and submitted links will also be added to the live directory: ${DIRECTORY_URL}`,
    "",
    "I've got plenty planned for the network, including:",
    "",
    "• Meetups, coworking and events",
    "• Art shows, live music and markets",
    "• Features, creative roundups and video spotlights",
    "• Funding opportunities, giveaways and competitions",
    "• A proper online directory for North East creatives",
    "",
    "I'm currently working through the network for NAMI feature carousels, so keep an eye out. I'll also share and repost as much of your work as I can.",
    "",
    "Please tag or DM NAMI when you post something you want me to see. Social media does a cracking job of hiding the good stuff.",
    "",
    `Join the WhatsApp community: ${WHATSAPP_URL}`,
    "",
    `Join the Facebook group: ${FACEBOOK_URL}`,
    "",
    "There's a lot I want to build, but I'm still one person juggling clients, family, friends and everything else that comes with it. Some things will take time, but they are in motion.",
    "",
    "For now, keep creating, keep sharing your work and give me a nudge whenever there's something you want NAMI to see.",
    "",
    "Thanks again for being part of it.",
    "",
    "Joe",
    "NAMI Creative",
    "",
    `P.S. If you want help making the journey from someone finding your work to buying, booking or getting in touch a bit clearer, have a look at Creator Wave Workshop: ${CREATOR_WAVE_URL}`,
  ].join("\n");

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.65;color:#171717;max-width:640px">
  <p style="margin:0 0 22px">${htmlGreeting}</p>
  <p style="margin:0 0 22px">Your details have landed and you're officially part of the <strong>NAMI Creative Network</strong>.</p>
  <p style="margin:0 0 22px">I just wanted to personally say thank you for joining.</p>
  <p style="margin:0 0 22px">You're now part of a growing network of creators, artists, musicians, freelancers, small businesses, brands and generally lush people from across the North East.</p>
  <p style="margin:0 0 22px">The aim is to put this network in the spotlight and make it easier for people to find the creative talent already here.</p>
  <p style="margin:0 0 22px">I want businesses, councils and brands to come to me when they need someone for a project. By joining, your name and work are now part of that roster for future features, introductions and opportunities.</p>
  <p style="margin:0 0 22px">Your name, location, creative category and submitted links will also be added to the <a href="${DIRECTORY_URL}" style="color:#d6009d;font-weight:600">live directory</a> on the NAMI Creative website, making it easier for people to discover your work and get in touch.</p>
  <p style="margin:0 0 12px">I've got plenty planned for the network, including:</p>
  <ul style="margin:0 0 22px;padding-left:22px">
    <li style="margin-bottom:5px">Meetups, coworking and events</li>
    <li style="margin-bottom:5px">Art shows, live music and markets</li>
    <li style="margin-bottom:5px">Features, creative roundups and video spotlights</li>
    <li style="margin-bottom:5px">Funding opportunities, giveaways and competitions</li>
    <li>A proper online directory for North East creatives</li>
  </ul>
  <p style="margin:0 0 22px">I'm currently working through the network for NAMI feature carousels, so keep an eye out. I'll also share and repost as much of your work as I can.</p>
  <p style="margin:0 0 22px">Please tag or DM NAMI when you post something you want me to see. Social media does a cracking job of hiding the good stuff.</p>
  <p style="margin:0 0 12px"><a href="${WHATSAPP_URL}" style="color:#d6009d;font-weight:600">Join the WhatsApp community</a> to meet other members, share your work and events, or simply join the conversation.</p>
  <p style="margin:0 0 22px"><a href="${FACEBOOK_URL}" style="color:#d6009d;font-weight:600">Join the Facebook group</a> to share your work, projects and upcoming events.</p>
  <p style="margin:0 0 22px">There's a lot I want to build, but I'm still one person juggling clients, family, friends and everything else that comes with it. Some things will take time, but they are in motion.</p>
  <p style="margin:0 0 22px">For now, keep creating, keep sharing your work and give me a nudge whenever there's something you want NAMI to see.</p>
  <p style="margin:0 0 22px">Thanks again for being part of it.</p>
  <p style="margin:0 0 26px">Joe<br>NAMI Creative</p>
  <p style="margin:0;padding-top:18px;border-top:1px solid #e5e5e5;font-size:14px;color:#555">P.S. If you want help making the journey from someone finding your work to buying, booking or getting in touch a bit clearer, <a href="${CREATOR_WAVE_URL}" style="color:#d6009d">have a look at Creator Wave Workshop</a>.</p>
</div>`.trim();

  return {
    channel: "outlook",
    sendFrom: "outlook-default-account",
    useOutlookSignature: true,
    signatureInstruction:
      "Send from Joe's Outlook account and append the default Outlook signature stored on the account. If the automation module cannot append stored signatures automatically, append the saved NAMI signature in Make after this body.",
    to: d.email,
    recipientEmail: d.email,
    recipientName: d.name,
    subject,
    heading: "Nice one. Your submission landed.",
    previewText:
      "Thanks for joining. Here's what I'm building for North East creatives.",
    body,
    html,
    text: body,
    outlookText: body,
    whatsappUrl: WHATSAPP_URL,
    facebookUrl: FACEBOOK_URL,
    thankYouUrl: THANK_YOU_URL,
    mainSiteUrl: MAIN_SITE_URL,
    creatorWaveUrl: CREATOR_WAVE_URL,
    directoryUrl: DIRECTORY_URL,
  };
}

async function upsertMailchimp(d: Cleaned): Promise<void> {
  const env = await getRuntimeEnvironment();
  const apiKey = env.MAILCHIMP_API_KEY;
  const audienceId = env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.warn("Mailchimp env vars missing - skipping network upsert.");
    return;
  }
  const dc = apiKey.split("-")[1];
  if (!dc) {
    console.warn("Mailchimp API key malformed - skipping network upsert.");
    return;
  }

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
          FNAME: d.firstName,
          PTYPE: "Creative Network",
          MESSAGE: enrichedMessage(d).slice(0, 500),
        },
        tags: tagsFor(d),
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Mailchimp network upsert non-2xx:", res.status, body.slice(0, 400));
    return;
  }

  const member = (await res.json()) as { status?: string };
  if (member.status !== "subscribed") {
    console.warn("Mailchimp network contact is not subscribed - skipping welcome flow.");
    return;
  }

  const triggerRes = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/customer-journeys/journeys/97/steps/411/actions/trigger`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `apikey ${apiKey}`,
      },
      body: JSON.stringify({ email_address: d.email }),
    },
  );

  if (!triggerRes.ok) {
    const body = await triggerRes.text().catch(() => "");
    console.warn("Mailchimp network welcome trigger non-2xx:", triggerRes.status, body.slice(0, 400));
  }
}

async function notifyMake(d: Cleaned, image: File): Promise<void> {
  const env = await getRuntimeEnvironment();
  const url = env.CREATIVE_NETWORK_WEBHOOK_URL ?? env.CONTACT_WEBHOOK_URL;
  if (!url) {
    console.warn(
      "CREATIVE_NETWORK_WEBHOOK_URL or CONTACT_WEBHOOK_URL not set - skipping network notification.",
    );
    return;
  }

  const message = enrichedMessage(d);
  const submittedAt = new Date().toISOString();
  const confirmationEmail = confirmationEmailFor(d);
  const outgoing = new FormData();
  outgoing.set("memberId", d.memberId);
  outgoing.set("name", d.name);
  outgoing.set("displayName", d.displayName);
  outgoing.set("firstName", d.firstName);
  outgoing.set("lastName", "");
  outgoing.set("email", d.email);
  outgoing.set("instagram", d.instagram);
  outgoing.set("company", d.displayName);
  outgoing.set("category", d.category);
  outgoing.set("location", d.location);
  outgoing.set("link", d.link);
  outgoing.set("note", d.note);
  outgoing.set("brief", message);
  outgoing.set("message", message);
  outgoing.set("submittedAt", submittedAt);
  outgoing.set("source", NETWORK_SOURCE);
  outgoing.set("sourceRef", NETWORK_SOURCE);
  outgoing.set("type", "feature-submission");
  outgoing.set("tagsText", tagsFor(d).join(", "));
  outgoing.set("mailchimpSegment", "Creative Network");
  outgoing.set("confirmationEmailSubject", confirmationEmail.subject);
  outgoing.set("confirmationEmailHtml", confirmationEmail.html);
  outgoing.set("imageAltText", `${d.name} profile picture`);
  outgoing.set("imageStatus", "Ready");
  outgoing.set("profileUrl", `${DIRECTORY_URL}/member/${d.memberId}`);
  outgoing.set("image", image, d.memberId);

  const res = await fetch(url, {
    method: "POST",
    body: outgoing,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Make network webhook failed: ${res.status} ${body.slice(0, 400)}`);
  }
}

async function notifyDashboard(d: Cleaned): Promise<void> {
  const env = await getRuntimeEnvironment();
  const url = env.DASHBOARD_LEAD_WEBHOOK_URL;
  const secret = env.DASHBOARD_LEAD_WEBHOOK_SECRET;
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
      company: d.displayName,
      message: enrichedMessage(d),
      subject: `Creative Network submission - ${d.category}`,
      source: "instagram-network",
      sourceRef: NETWORK_SOURCE,
      profileUrl: `${DIRECTORY_URL}/member/${d.memberId}`,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Dashboard network webhook non-2xx:", res.status, body.slice(0, 400));
  }
}

async function savePendingApplication(d: Cleaned, image: File): Promise<void> {
  if (image.type !== "image/webp") throw new Error("The prepared profile image must be WebP.");
  let uploadedKey: string | null = null;
  let previousKey: string | null = null;
  try {
    const { getMemberMediaBucket, getNetworkDb, schema } = await import("@/lib/network-db");
    const db = await getNetworkDb();
    const [previous] = await db.select({ profileImageKey: schema.networkApplications.profileImageKey })
      .from(schema.networkApplications).where(eq(schema.networkApplications.id, d.memberId)).limit(1);
    previousKey = previous?.profileImageKey ?? null;
    const bucket = await getMemberMediaBucket();
    uploadedKey = `network-applications/${d.memberId}/profile/${crypto.randomUUID()}.webp`;
    await bucket.put(uploadedKey, await image.arrayBuffer(), {
      httpMetadata: { contentType: "image/webp", cacheControl: "private, no-store" },
    });
    await db.batch([db.insert(schema.networkApplications).values({
      id: d.memberId,
      email: d.email.toLowerCase(),
      firstName: d.firstName,
      displayName: d.displayName,
      location: d.location,
      requestedCategory: d.category,
      bio: d.note,
      websiteUrl: d.link || null,
      instagramUrl: d.instagram,
      profileImageKey: uploadedKey,
      status: "pending",
      submittedAt: new Date(),
    }).onConflictDoUpdate({
      target: schema.networkApplications.id,
      set: {
        email: d.email.toLowerCase(),
        firstName: d.firstName,
        displayName: d.displayName,
        location: d.location,
        requestedCategory: d.category,
        bio: d.note,
        websiteUrl: d.link || null,
        instagramUrl: d.instagram,
        profileImageKey: uploadedKey,
        status: "pending",
      },
    }), db.insert(schema.sheetSyncJobs).values({
      id: crypto.randomUUID(),
      memberId: d.memberId,
      status: "pending",
      attempts: 0,
      nextAttemptAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })]);
    if (previousKey && previousKey !== uploadedKey) await bucket.delete(previousKey);
  } catch (error) {
    if (uploadedKey) {
      try {
        const { getMemberMediaBucket } = await import("@/lib/network-db");
        await (await getMemberMediaBucket()).delete(uploadedKey);
      } catch {}
    }
    // Netlify remains the live fallback during migration and has no D1 binding.
    const env = await getRuntimeEnvironment();
    if (env.APP_ENV === "staging" || env.APP_ENV === "production") throw error;
    console.warn("D1 application mirror unavailable during migration:", error);
  }
}

export async function POST(req: Request) {
  let payload: NetworkPayload;
  let image: File | null = null;
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      payload = {
        memberId: formData.get("memberId"),
        name: formData.get("name"),
        firstName: formData.get("firstName"),
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        instagram: formData.get("instagram"),
        category: formData.get("category"),
        location: formData.get("location"),
        note: formData.get("note"),
        link: formData.get("link"),
        directoryConsent: formData.get("directoryConsent") === "true",
        website: formData.get("website"),
      };
      const uploadedImage = formData.get("image");
      image = uploadedImage instanceof File ? uploadedImage : null;
    } else {
      payload = (await req.json()) as NetworkPayload;
    }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const d = clean(payload);

  if (!d.memberId) {
    return NextResponse.json(
      { error: "I could not create a directory ID. Please refresh and try again." },
      { status: 400 },
    );
  }
  if (!d.firstName) {
    return NextResponse.json(
      { error: "Please add your first name." },
      { status: 400 },
    );
  }
  if (!d.displayName) {
    return NextResponse.json(
      { error: "Please add the name you want on your NAMI network profile." },
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
  if (d.category.toLowerCase() === "other") {
    return NextResponse.json(
      { error: "Please type your category." },
      { status: 400 },
    );
  }
  if (!d.location) {
    return NextResponse.json(
      { error: "Please add a North East location." },
      { status: 400 },
    );
  }
  if (!d.note) {
    return NextResponse.json(
      { error: "Please tell me a little about your work for your profile bio." },
      { status: 400 },
    );
  }
  if (!image || image.size === 0) {
    return NextResponse.json(
      { error: "Please add a profile picture for your NAMI network profile." },
      { status: 400 },
    );
  }
  if (!ALLOWED_IMAGE_TYPES.has(image.type) || image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Send a JPG, PNG or WebP image smaller than 3 MB." },
      { status: 400 },
    );
  }
  if (!d.directoryConsent) {
    return NextResponse.json(
      { error: "Please confirm that I can include you in the public directory." },
      { status: 400 },
    );
  }

  const env = await getRuntimeEnvironment();
  // Netlify has no APP_ENV binding and keeps its existing Make/Mailchimp flow.
  // Cloudflare environments must opt in explicitly before external sends begin.
  const integrationsLive = externalIntegrationsAllowed(env, req, d.email);
  try {
    await savePendingApplication(d, image);
  } catch (error) {
    console.error("Network application could not be saved:", error);
    return NextResponse.json(
      { error: "I couldn't save your application. Please try again or email hello@namicreative.co.uk." },
      { status: 500 },
    );
  }

  const appUrl = env.APP_URL || MAIN_SITE_URL;
  try {
    await queueOwnerAlert({
      kind: "application",
      recordId: d.memberId,
      subject: `New NAMI Network application: ${d.displayName}`,
      heading: "A new Network member is waiting for approval",
      body: `${d.displayName} from ${d.location} has submitted a Network application.`,
      actionUrl: `${appUrl.replace(/\/$/, "")}/network/admin?view=members#applications`,
    });
  } catch (error) {
    console.error("Application saved but owner alert failed:", error);
  }

  const [makeRes, mcRes, dashRes] = await Promise.allSettled([
    integrationsLive ? notifyMake(d, image) : Promise.resolve(),
    integrationsLive ? upsertMailchimp(d) : Promise.resolve(),
    integrationsLive ? notifyDashboard(d) : Promise.resolve(),
  ]);

  const makeOk = makeRes.status === "fulfilled";
  const mcOk = mcRes.status === "fulfilled";
  const dashOk = dashRes.status === "fulfilled";

  if (!makeOk) {
    console.error(
      "Network submission notification failed:",
      makeRes.status === "rejected" ? makeRes.reason : null,
    );
    return NextResponse.json(
      { error: "I couldn't send this. Please email hello@namicreative.co.uk." },
      { status: 500 },
    );
  }

  if (!mcOk || !dashOk) {
    console.warn(
      "Network submission saved but secondary pathways had issues:",
      mcRes.status === "rejected" ? mcRes.reason : null,
      dashRes.status === "rejected" ? dashRes.reason : null,
    );
  }

  return NextResponse.json({ ok: true });
}
