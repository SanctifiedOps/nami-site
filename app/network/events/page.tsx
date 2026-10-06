import type { Metadata } from "next";
import { and, asc, eq, gte } from "drizzle-orm";
import { ArrowUpRight, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { getMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";

export const metadata: Metadata = { title: "Network events", description: "Events shared by members of the NAMI Creative Network." };
export const dynamic = "force-dynamic";

const media = (key: string) => `/api/network/media/${key.split("/").map(encodeURIComponent).join("/")}`;

export default async function NetworkEventsPage() {
  const env = await getRuntimeEnvironment();
  if (env.NETWORK_EVENTS_MODE !== "live" && process.env.NODE_ENV !== "development") notFound();
  const db = await getNetworkDb();
  const [liveEvents, auth] = await Promise.all([
    db.select().from(schema.networkEvents).where(and(eq(schema.networkEvents.status, "approved"), gte(schema.networkEvents.startsAt, new Date()))).orderBy(asc(schema.networkEvents.startsAt)),
    getMemberSession(),
  ]);
  const preview = process.env.NODE_ENV === "development" && liveEvents.length === 0 ? [{ id: "preview-event", slug: null, title: "North East Creatives Social", eventType: "Meetup", summary: "An informal evening for artists, designers, photographers and independent creatives to meet, share ideas and make useful connections.", venue: "The Common Room", location: "Newcastle upon Tyne", startsAt: new Date(Date.now() + 12 * 86400000), priceType: "free", coverImageKey: null, coverImageAlt: "Creative people meeting at a North East event", isPreview: true }] : [];
  const events = [...liveEvents.map((event) => ({ ...event, isPreview: false })), ...preview];

  return (
    <div className="pb-24">
      <PageHero eyebrow="NAMI Creative Network" title={<>Events worth <span className="text-accent">showing up for</span></>} lead="Workshops, meetups, markets and exhibitions being put on by Network members across the North East." backgroundImage="/images/north-east/3.jpg">
        <div className="flex flex-wrap gap-3">
          <a href={auth ? "/network/dashboard/events" : "/network/login?next=/network/dashboard/events"} className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white">{auth ? "Add or manage an event" : "Sign in to add an event"}</a>
          <a href="#upcoming" className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:border-accent hover:text-accent">See what&apos;s coming up</a>
        </div>
      </PageHero>

      <section id="upcoming" className="container-shell scroll-mt-24 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-[minmax(14rem,0.45fr)_minmax(0,1.55fr)] md:gap-14">
          <div>
            <h2 className="text-4xl font-semibold leading-[0.96] tracking-[-0.04em] md:text-6xl">Coming up</h2>
            <p className="mt-5 max-w-xs text-base leading-relaxed text-fg-muted">Find something worth leaving the house for, then add it to your calendar.</p>
          </div>
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2">
            {events.map((event) => {
              const card = <><div className="relative aspect-[4/3] overflow-hidden bg-[url('/network-news/creative-night.jpg')] bg-cover bg-center">{event.coverImageKey && <img src={media(event.coverImageKey)} alt={event.coverImageAlt} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />}<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" /><p className="absolute inset-x-0 bottom-0 p-5 text-sm font-semibold text-white">{event.startsAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" })}</p></div><div className="border-t border-line py-5"><p className="text-sm font-semibold text-accent">{event.isPreview ? "Preview" : event.eventType}</p><h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{event.title}</h3><p className="mt-3 flex items-center gap-2 text-sm text-fg-subtle"><MapPin size={14} className="text-accent" />{event.venue}, {event.location}</p><p className="mt-4 line-clamp-3 text-sm leading-relaxed text-fg-muted">{event.summary}</p><div className="mt-5 flex items-center justify-between border-t border-line pt-4"><span className="text-sm text-fg-subtle">{event.priceType}</span><span className="inline-flex items-center gap-1 text-sm font-semibold">View event <ArrowUpRight size={14} /></span></div></div></>;
              return event.slug ? <a href={`/network/events/${event.slug}`} key={event.id} className="group block border-b border-line transition-colors hover:border-accent">{card}</a> : <article key={event.id} className="group block border-b border-line">{card}</article>;
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
