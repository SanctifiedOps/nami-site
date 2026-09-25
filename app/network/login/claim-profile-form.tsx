"use client";

import { FormEvent, useState } from "react";

export function ClaimProfileForm() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/network/claim-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(data.get("email") || "").trim() }),
      });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) setError(result.error || "Check your email address and try again.");
      else setMessage(result.message || "Check your inbox for the next step.");
    } catch {
      setError("The request could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return <div className="mt-6 text-center"><p className="text-sm text-fg-muted">Haven’t claimed your profile yet?</p><button type="button" onClick={() => setOpen(true)} className="mt-2 min-h-11 font-bold text-accent underline underline-offset-4">Claim your profile</button></div>;

  return <div className="mt-6 rounded-2xl border border-accent/30 bg-black/20 p-5">
    <h2 className="text-xl font-semibold">Claim your profile</h2>
    <p className="mt-2 text-sm leading-6 text-fg-muted">Enter the email used for your Network profile and we’ll send you a secure link to create your password.</p>
    {message ? <p role="status" className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm leading-6 text-fg">{message}</p> : <form onSubmit={submit} className="mt-4 space-y-4">
      <label className="block text-sm font-semibold">Email address<input name="email" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full rounded-xl border border-line-strong bg-surface-0 px-4 py-3 text-fg" /></label>
      {error&&<p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="min-h-12 w-full rounded-full bg-accent px-6 py-3 font-bold text-white disabled:opacity-60">{busy?"Sending link...":"Email my claim link"}</button>
    </form>}
    <button type="button" onClick={() => { setOpen(false); setMessage(""); setError(""); }} className="mt-4 min-h-11 text-sm font-semibold text-fg-muted hover:text-accent">Back to login</button>
  </div>;
}
