import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { NetworkAccountShell } from "@/components/network/account-shell";
import { getMemberSession } from "@/lib/network-auth/session";
import { ClaimProfileForm } from "./claim-profile-form";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Member login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NetworkLoginPage() {
  if (await getMemberSession()) redirect("/network/dashboard");
  return (
    <NetworkAccountShell
      title="Welcome back"
      description="Sign in to update your profile, add work and share events with the Network."
      footer={<><p>Not a member yet? <a href="/network" className="font-semibold text-accent underline underline-offset-4">Join the Network. It&apos;s free.</a></p><p className="mt-3">Having trouble with your account? <a href="/network/report-a-problem" className="font-semibold text-accent">Report a problem</a>.</p></>}
    >
      <Suspense><LoginForm /></Suspense>
      <ClaimProfileForm />
    </NetworkAccountShell>
  );
}
