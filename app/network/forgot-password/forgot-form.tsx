"use client";

import { FormEvent, useState } from "react";
import { networkAuthClient } from "@/lib/network-auth/client";

export function ForgotForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim().toLowerCase();

    try {
      const result = await networkAuthClient.requestPasswordReset({
        email,
        redirectTo: "/network/reset-password",
      });
      if (result.error) {
        setError("The reset request couldn't be sent. Please try again.");
        setBusy(false);
        return;
      }
      setSent(true);
    } catch {
      setError("The reset request couldn't connect. Please try again.");
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-5 text-fg-muted">
        <p>If that email has an active Network account, a reset link is on its way.</p>
        <p className="mt-3 text-sm">
          Allow a few minutes and check your spam folder. If you haven't claimed your profile yet, use the link in your invitation email instead.
        </p>
        <p className="mt-3 text-sm">
          Still nothing? Email <a className="font-semibold text-accent underline underline-offset-4" href="mailto:hello@namicreative.co.uk">hello@namicreative.co.uk</a> and I'll check your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <label className="block text-sm font-semibold">
        Email address
        <input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-xl border border-line-strong bg-surface-0 px-4 py-3" />
      </label>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-accent px-6 py-3 font-bold text-white disabled:opacity-60">
        {busy ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
