import type { Metadata } from "next";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { TicketForm } from "./ticket-form";

export const metadata: Metadata = {
  title: "Report a Network problem",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ReportAProblemPage() {
  const env = await getRuntimeEnvironment();
  return (
    <section className="min-h-[75vh] px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-accent/30 bg-surface-1 p-6 sm:p-10">
        <p className="font-bold uppercase tracking-[0.16em] text-accent">NAMI Creative Network</p>
        <h1 className="mt-4 text-4xl sm:text-6xl">Something not working?</h1>
        <p className="mt-5 max-w-xl text-fg-muted">
          Send the details here. This page works separately from the member dashboard, so you can still report a problem if you cannot sign in.
        </p>
        <TicketForm turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""} />
      </div>
    </section>
  );
}
