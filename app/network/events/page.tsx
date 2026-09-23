import type { Metadata } from "next";
import { and, asc, eq, gte } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { getMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import { EventForm } from "./event-form";

export const metadata: Metadata = { title: "Network events", description: "Events shared by members of the NAMI Creative Network." };
export const dynamic = "force-dynamic";

export default async function NetworkEventsPage() {
  const env = await getRuntimeEnvironment();
  if (env.NETWORK_EVENTS_MODE !== "live") notFound();
  const db = await getNetworkDb();
  const [events, auth] = await Promise.all([
    db.select().from(schema.networkEvents).where(and(eq(schema.networkEvents.status, "approved"), gte(schema.networkEvents.startsAt, new Date()))).orderBy(asc(schema.networkEvents.startsAt)),
    getMemberSession(),
  ]);
  return <main className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
    <p className="font-bold uppercase tracking-[0.16em] text-accent">NAMI Creative Network</p>
    <h1 className="mt-4 max-w-4xl text-5xl sm:text-7xl">Events worth knowing about</h1>
    <p className="mt-5 max-w-2xl text-lg text-fg-muted">Workshops, meetups, markets, exhibitions and other things Network members are putting on across the North East.</p>
    <section className="mt-12 grid gap-5 md:grid-cols-2">
      {events.map((event) => <article key={event.id} className="rounded-[1.5rem] border border-line bg-surface-1 p-6"><p className="text-sm font-bold text-accent">{event.startsAt.toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/London" })}</p><h2 className="mt-3 text-3xl">{event.title}</h2><p className="mt-3 text-sm text-fg-muted">{event.venue}, {event.location}</p><p className="mt-5 text-fg-muted">{event.summary}</p>{event.bookingUrl && <a href={event.bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full bg-accent px-5 py-3 text-sm font-bold text-white">More information</a>}</article>)}
      {!events.length && <p className="rounded-[1.5rem] border border-line bg-surface-1 p-6 text-fg-muted">Nothing listed yet. Check back soon.</p>}
    </section>
    <section className="mt-16 max-w-2xl">{auth ? <EventForm /> : <div className="rounded-[2rem] border border-line bg-surface-1 p-8"><h2 className="text-3xl">Got something coming up?</h2><p className="mt-3 text-fg-muted">Sign in to your member account to submit it for approval.</p><a href="/network/login?next=/network/events" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-bold text-white">Member sign in</a></div>}</section>
  </main>;
}
