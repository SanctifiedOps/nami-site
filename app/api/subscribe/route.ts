import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let payload: { email?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error(
      "Mailchimp env vars missing: MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID required.",
    );
    return NextResponse.json(
      { error: "Newsletter is temporarily unavailable." },
      { status: 503 },
    );
  }

  const dc = apiKey.split("-")[1];
  if (!dc) {
    console.error("Mailchimp API key malformed; missing data-center suffix.");
    return NextResponse.json(
      { error: "Newsletter is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `apikey ${apiKey}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: "pending", // double opt-in
          tags: ["Subscriber", "source:newsletter"],
        }),
      },
    );

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json({
        ok: true,
        message: "Check your inbox to confirm.",
      });
    }

    // Already subscribed: treat as success so users don't see an error
    if (data?.title === "Member Exists") {
      return NextResponse.json({
        ok: true,
        message: "You're already on the list.",
      });
    }

    // Forbidden / cleaned / unsubscribed cases
    if (data?.title === "Forgotten Email Not Subscribed") {
      return NextResponse.json(
        { error: "We can't add this address right now. Try a different one." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: data?.detail ?? "Could not subscribe right now." },
      { status: res.status },
    );
  } catch (err) {
    console.error("Mailchimp subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
