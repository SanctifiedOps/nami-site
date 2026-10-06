import Script from "next/script";
import { NetworkAccountShell } from "@/components/network/account-shell";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { InviteForm } from "./invite-form";

export const metadata = { title: "Create your Network account", robots: { index: false, follow: false } };

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const env = await getRuntimeEnvironment();
  const turnstileSiteKey = env.APP_ENV === "production" ? env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : undefined;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /><NetworkAccountShell title="Set up your member account" description="Create your password, then you can update your Network profile whenever you like."><InviteForm token={token} turnstileSiteKey={turnstileSiteKey} /></NetworkAccountShell></>;
}
