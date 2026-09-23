import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getMemberSession } from "@/lib/network-auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Member login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NetworkLoginPage() {
  if (await getMemberSession()) redirect("/network/dashboard");
  return <section className="min-h-[75vh] px-6 py-28 sm:px-8"><div className="mx-auto max-w-md rounded-[2rem] border border-accent/30 bg-surface-1 p-6 sm:p-8 md:p-10"><p className="font-bold uppercase tracking-[0.16em] text-accent">NAMI Creative Network</p><h1 className="mt-4 text-5xl">Welcome back</h1><p className="mt-4 text-fg-muted">Sign in to update your profile, links and portfolio images.</p><Suspense><LoginForm /></Suspense><p className="mt-7 border-t border-line pt-5 text-center text-sm text-fg-muted">Having trouble with your account? <a href="/network/report-a-problem" className="font-bold text-accent">Report a problem</a>.</p></div></section>;
}
