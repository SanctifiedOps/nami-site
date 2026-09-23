"use client";

import { FormEvent, useState } from "react";
import { networkAuthClient } from "@/lib/network-auth/client";

export function ForgotForm() {
  const [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await networkAuthClient.requestPasswordReset({ email: String(data.get("email") ?? "").trim(), redirectTo: "/network/reset-password" });
    setSent(true);
  }
  if (sent) return <p className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-5 text-fg-muted">If that email has a Network account, a reset link is on its way. Check your spam folder too.</p>;
  return <form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm font-semibold">Email address<input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-xl border border-line-strong bg-surface-0 px-4 py-3" /></label><button className="w-full rounded-full bg-accent px-6 py-3 font-bold text-white">Send reset link</button></form>;
}
