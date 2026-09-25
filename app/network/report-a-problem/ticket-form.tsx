"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (element: HTMLElement, options: {
    sitekey: string;
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
    theme: "dark";
    size?: "flexible";
  }) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window { turnstile?: TurnstileApi }
}

export function TicketForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !container.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(container.current, {
        sitekey: turnstileSiteKey,
        theme: "dark",
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };
    if (window.turnstile) render();
    else {
      const existing = document.querySelector<HTMLScriptElement>('script[data-nami-turnstile="true"]');
      const script = existing || document.createElement("script");
      script.addEventListener("load", render);
      if (!existing) {
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.namiTurnstile = "true";
        document.head.appendChild(script);
      }
      return () => { cancelled = true; script.removeEventListener("load", render); };
    }
    return () => { cancelled = true; };
  }, [turnstileSiteKey]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (turnstileSiteKey && !turnstileToken) {
      setMessage("Please complete the security check.");
      return;
    }
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/network/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        subject: data.get("subject"),
        description: data.get("description"),
        pageUrl: data.get("pageUrl"),
        priority: data.get("priority"),
        website: data.get("website"),
        turnstileToken,
      }),
    });
    const result = await response.json() as { error?: string; ticketId?: string };
    if (response.ok && result.ticketId) {
      setTicketId(result.ticketId);
      form.reset();
      setTurnstileToken("");
      window.turnstile?.reset(widgetId.current);
    } else setMessage(result.error || "The ticket could not be saved. Email hello@namicreative.co.uk if the problem continues.");
    setBusy(false);
  }

  if (ticketId) return (
    <div className="mt-10 rounded-2xl border border-accent/30 bg-accent/5 p-6">
      <h2 className="text-2xl">Got it</h2>
      <p className="mt-3 text-fg-muted">Your ticket reference is <strong className="text-fg">{ticketId}</strong>. Keep that handy if you need to follow it up.</p>
    </div>
  );

  const fieldClass = "mt-2 w-full rounded-xl border border-line-strong bg-surface-0 px-4 py-3 text-fg";
  return (
    <form onSubmit={submit} className="mt-10 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">Your name<input name="name" required maxLength={100} className={fieldClass} /></label>
        <label className="block text-sm font-semibold">Email address<input name="email" type="email" autoComplete="email" required maxLength={200} className={fieldClass} /></label>
      </div>
      <label className="block text-sm font-semibold">What is the problem?<input name="subject" required maxLength={140} className={fieldClass} /></label>
      <label className="block text-sm font-semibold">Tell me what happened<textarea name="description" required minLength={20} maxLength={3000} rows={7} className={fieldClass} /></label>
      <label className="block text-sm font-semibold">Page address, if you have it<input name="pageUrl" type="url" maxLength={500} placeholder="https://namicreative.co.uk/..." className={fieldClass} /></label>
      <label className="block text-sm font-semibold">How much is it affecting you?<select name="priority" className={fieldClass}><option value="normal">I can still use the site</option><option value="urgent">I cannot use my account or profile</option></select></label>
      <label className="sr-only">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {turnstileSiteKey && <div ref={container} />}
      {message && <p role="alert" className="text-sm text-red-300">{message}</p>}
      <button disabled={busy} className="w-full rounded-full bg-accent px-6 py-3 font-bold text-white disabled:opacity-60">{busy ? "Sending..." : "Send the ticket"}</button>
    </form>
  );
}
