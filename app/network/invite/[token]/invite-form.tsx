"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordField } from "@/components/forms/password-field";

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
  interface Window { turnstile?: TurnstileApi; }
}

export function InviteForm({ token, turnstileSiteKey }: { token: string; turnstileSiteKey?: string }) {
  const router = useRouter();
  const [details, setDetails] = useState<{ displayName: string; email: string } | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(!turnstileSiteKey);
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/network/invite/${encodeURIComponent(token)}`).then(async (response) => {
      if (!response.ok) return setInvalid(true);
      const data = await response.json() as { displayName: string; email: string };
      setDetails(data);
    }).catch(() => setInvalid(true));
  }, [token]);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileContainer.current) return;
    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !window.turnstile || !turnstileContainer.current || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileContainer.current, {
        sitekey: turnstileSiteKey,
        theme: "dark",
        size: "flexible",
        callback: (responseToken) => {
          setTurnstileToken(responseToken);
          setTurnstileReady(true);
          setError("");
        },
        "expired-callback": () => {
          setTurnstileToken("");
          setTurnstileReady(false);
        },
        "error-callback": () => {
          setTurnstileToken("");
          setTurnstileReady(false);
          setError("The security check could not load. Please refresh the page and try again.");
        },
      });
    };
    if (window.turnstile) {
      renderWidget();
      return () => { cancelled = true; };
    }
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-nami-turnstile]');
    const script = existingScript ?? document.createElement("script");
    script.addEventListener("load", renderWidget);
    if (!existingScript) {
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.namiTurnstile = "true";
      document.head.appendChild(script);
    }
    return () => {
      cancelled = true;
      script.removeEventListener("load", renderWidget);
    };
  }, [turnstileSiteKey, details]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    if (password !== String(data.get("confirmPassword") ?? "")) {
      setError("The passwords do not match."); setBusy(false); return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setError("Please complete the security check and try again."); setBusy(false); return;
    }
    const response = await fetch(`/api/network/invite/${encodeURIComponent(token)}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, turnstileToken }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setError(result.error || "The account could not be created.");
      setBusy(false);
      setTurnstileToken("");
      setTurnstileReady(false);
      window.turnstile?.reset(turnstileWidgetId.current);
      return;
    }
    router.push("/network/login?account=created");
  }

  if (invalid) return <p className="mt-8 text-fg-muted">This invitation has expired or has already been used. Reply to hello@namicreative.co.uk and I’ll send you a fresh one.</p>;
  if (!details) return <p className="mt-8 text-fg-muted">Checking your invitation...</p>;

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <p className="rounded-xl border border-line bg-surface-0 p-4 text-sm text-fg-muted">
        Creating an account for <strong className="text-fg">{details.displayName}</strong><br /><span className="break-all">{details.email}</span>
      </p>
      <PasswordField name="password" label="Create a password" autoComplete="new-password" minLength={10} required hint="Use at least 10 characters." />
      <PasswordField name="confirmPassword" label="Confirm password" autoComplete="new-password" minLength={10} required />
      {turnstileSiteKey && <div ref={turnstileContainer} className="min-h-[65px] w-full min-w-0 overflow-hidden" />}
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={busy || !turnstileReady} className="w-full rounded-full bg-accent px-6 py-3 font-bold text-white disabled:opacity-60">
        {busy ? "Creating your account..." : "Create my account"}
      </button>
    </form>
  );
}
