"use client";

import { FormEvent, useState } from "react";

export default function MemberEmailCorrectionPage() {
  const [memberId, setMemberId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/network/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "correct-member-email", memberId, email }),
    });
    const result = await response.json() as { error?: string; inviteSent?: boolean };
    setMessage(response.ok && result.inviteSent ? "Email corrected across systems and a fresh claim email was sent." : result.error || "The correction could not be completed.");
    setSaving(false);
  }

  return <main className="mx-auto min-h-screen max-w-2xl px-5 py-28 text-white">
    <a href="/network/admin" className="text-sm text-brand-pink">← Network admin</a>
    <h1 className="mt-8 text-4xl font-semibold">Correct a member email</h1>
    <p className="mt-3 text-sm text-fg-muted">For unclaimed profiles. This updates D1 and Mailchimp, queues the Google Sheet refresh and sends a fresh claim link.</p>
    <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl border border-border bg-panel p-6">
      <label className="block text-sm">Member ID<input required value={memberId} onChange={(event) => setMemberId(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-black px-4 py-3" /></label>
      <label className="block text-sm">Correct email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-black px-4 py-3" /></label>
      <button disabled={saving} className="rounded-full bg-brand-pink px-6 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Updating…" : "Update and send claim email"}</button>
      {message && <p role="status" className="text-sm text-brand-pink">{message}</p>}
    </form>
  </main>;
}
