import Script from "next/script";
import { InviteForm } from "./invite-form";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";

export const metadata = { title: "Create your Network account", robots: { index: false, follow: false } };

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const env = await getRuntimeEnvironment();
  const turnstileSiteKey = env.APP_ENV === "production" ? env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : undefined;

  return <section className="min-h-[75vh] px-4 py-24 sm:px-8 sm:py-28"><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /><div className="mx-auto w-full max-w-md min-w-0 overflow-hidden rounded-[2rem] border border-accent/30 bg-surface-1 p-5 sm:p-8 md:p-10"><p className="font-bold uppercase tracking-[0.16em] text-accent">You’re invited</p><h1 className="mt-4 text-4xl sm:text-5xl">Set up your member account</h1><p className="mt-4 text-fg-muted">Create your password, then you’ll be able to keep your NAMI Network profile up to date whenever you like.</p><InviteForm token={token} turnstileSiteKey={turnstileSiteKey} /></div></section>;
}
