"use client";

import { FormEvent, useState } from "react";

export function EventForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const localDate = (name: string) => {
      const value = String(data.get(name) || "");
      return value ? new Date(value).toISOString() : "";
    };
    const response = await fetch("/api/network/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.get("title"),
        summary: data.get("summary"),
        venue: data.get("venue"),
        location: data.get("location"),
        startsAt: localDate("startsAt"),
        endsAt: localDate("endsAt"),
        bookingUrl: data.get("bookingUrl"),
      }),
    });
    const result = await response.json() as { error?: string };
    if (response.ok) {
      setSubmitted(true);
      form.reset();
    } else setMessage(result.error || "The event could not be submitted.");
    setBusy(false);
  }

  if (submitted) return <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6"><h2 className="text-2xl">Event received</h2><p className="mt-3 text-fg-muted">It will appear on the noticeboard after Joe has checked and approved it.</p></div>;
  const fieldClass = "mt-2 w-full rounded-xl border border-line-strong bg-surface-0 px-4 py-3 text-fg";
  return <form onSubmit={submit} className="space-y-5 rounded-[2rem] border border-line bg-surface-1 p-6 sm:p-8">
    <h2 className="text-3xl">Add an event</h2>
    <p className="text-fg-muted">Member listings are checked before they appear publicly.</p>
    <label className="block text-sm font-semibold">Event name<input name="title" required maxLength={140} className={fieldClass} /></label>
    <label className="block text-sm font-semibold">What is happening?<textarea name="summary" required minLength={20} maxLength={1200} rows={6} className={fieldClass} /></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold">Venue<input name="venue" required maxLength={140} className={fieldClass} /></label><label className="block text-sm font-semibold">Town or area<input name="location" required maxLength={140} className={fieldClass} /></label></div>
    <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold">Starts<input name="startsAt" type="datetime-local" required className={fieldClass} /></label><label className="block text-sm font-semibold">Ends, if known<input name="endsAt" type="datetime-local" className={fieldClass} /></label></div>
    <label className="block text-sm font-semibold">Booking or information link<input name="bookingUrl" type="url" maxLength={500} className={fieldClass} /></label>
    {message && <p role="alert" className="text-sm text-red-300">{message}</p>}
    <button disabled={busy} className="w-full rounded-full bg-accent px-6 py-3 font-bold text-white disabled:opacity-60">{busy ? "Sending..." : "Submit for approval"}</button>
  </form>;
}
