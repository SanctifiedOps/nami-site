import type { Metadata } from "next";
import { NetworkAccountShell } from "@/components/network/account-shell";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { TicketForm } from "./ticket-form";

export const metadata: Metadata = { title: "Report a Network problem", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ReportAProblemPage() {
  const env = await getRuntimeEnvironment();
  return <NetworkAccountShell title="Something not working?" description="Send the details here. You can use this page even if you cannot sign in to the member dashboard."><TicketForm turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""} /></NetworkAccountShell>;
}
