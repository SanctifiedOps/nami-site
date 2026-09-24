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

  async function localSignIn() {
    setBusy(true);
    setError("");
    const credentials = { email: "hello@namicreative.local", password: "NAMI-local-preview-2026!", rememberMe: true };
    let result = await networkAuthClient.signIn.email(credentials);
    if (result.error) {
      const signUp = await networkAuthClient.signUp.email({ name: "Joe Wilson", email: credentials.email, password: credentials.password });
      if (signUp.error) result = await networkAuthClient.signIn.email(credentials);
    }
    if (result.error) {
      setError("The local account could not be opened.");
      setBusy(false);
      return;
    }
    const bootstrap = await fetch("/api/network/dev-bootstrap", { method: "POST" });
    if (!bootstrap.ok) {
      setError("The local member profile could not be prepared.");
      setBusy(false);
      return;
    }
    router.push("/network/dashboard");
    router.refresh();
  }

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
      {process.env.NODE_ENV === "development" && <button type="button" disabled={busy} onClick={() => void localSignIn()} className="w-full rounded-full border border-accent px-6 py-3 font-bold text-accent disabled:opacity-60">Continue as Joe on localhost</button>}
      <a href="/network/forgot-password" className="block text-center text-sm text-fg-muted underline underline-offset-4">Forgot your password?</a>
    </form>
  );
}
