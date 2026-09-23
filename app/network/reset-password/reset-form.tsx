"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { networkAuthClient } from "@/lib/network-auth/client";
import { PasswordField } from "@/components/forms/password-field";

export function ResetForm() {
  const token = useSearchParams().get("token") || "";
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    if (password !== String(data.get("confirmPassword") ?? "")) {
      setMessage("The passwords do not match.");
      setBusy(false);
      return;
    }
    const result = await networkAuthClient.resetPassword({ newPassword: password, token });
    if (result.error) {
      setMessage("This reset link is invalid or has expired.");
      setBusy(false);
      return;
    }
    setSuccess(true);
    setBusy(false);
  }

  if (success) {
    return (
      <div role="status" className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-5">
        <p className="text-sm text-fg-muted">Your password has been changed. You can sign in with it now.</p>
        <Link href="/network/login" className="mt-5 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-white transition-colors hover:bg-accent-soft">
          Go to member login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <PasswordField name="password" label="New password" autoComplete="new-password" minLength={10} required hint="Use at least 10 characters." />
      <PasswordField name="confirmPassword" label="Confirm password" autoComplete="new-password" minLength={10} required />
      {message && <p role="status" className="text-sm text-red-300">{message}</p>}
      <button disabled={busy} className="w-full rounded-full bg-accent px-6 py-3 font-bold text-white disabled:opacity-60">
        {busy ? "Saving..." : "Save new password"}
      </button>
    </form>
  );
}
