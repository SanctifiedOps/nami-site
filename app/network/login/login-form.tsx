"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { networkAuthClient } from "@/lib/network-auth/client";
import { PasswordField } from "@/components/forms/password-field";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await networkAuthClient.signIn.email({
        email: String(data.get("email") ?? "").trim(),
        password: String(data.get("password") ?? ""),
        rememberMe: true,
      });
      if (result.error) {
        setError("That email and password combination was not recognised.");
        setBusy(false);
        return;
      }
      router.push(search.get("next") || "/network/dashboard");
      router.refresh();
    } catch {
      setError("Sign in could not connect. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-5">
      <label className="block text-sm font-semibold">Email address
        <input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-xl border border-line-strong bg-surface-0 px-4 py-3 text-fg" />
      </label>
      <PasswordField name="password" label="Password" autoComplete="current-password" required />
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-accent px-6 py-3 font-bold text-white disabled:opacity-60">{busy ? "Signing in..." : "Sign in"}</button>
      <a href="/network/forgot-password" className="block text-center text-sm text-fg-muted underline underline-offset-4">Forgot your password?</a>
    </form>
  );
}
