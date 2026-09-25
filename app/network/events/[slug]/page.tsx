import { and, asc, eq, gte, ne } from "drizzle-orm";
import { Accessibility, ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin, Ticket, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNetworkDb, schema } from "@/lib/network-db";
import { EventAnalytics } from "./event-analytics";
import { EventActions } from "./event-actions";

const media=(key:string)=>`/api/network/media/${key.split("/").map(encodeURIComponent).join("/")}`;
export const dynamic="force-dynamic";

export default async function EventPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params, db=await getNetworkDb();
  const [record]=await db.select({event:schema.networkEvents,member:schema.members,profile:schema.memberProfiles}).from(schema.networkEvents).innerJoin(schema.members,eq(schema.members.id,schema.networkEvents.memberId)).leftJoin(schema.memberProfiles,eq(schema.memberProfiles.memberId,schema.members.id)).where(and(eq(schema.networkEvents.slug,slug),eq(schema.networkEvents.status,"approved"))).limit(1);
  if(!record) notFound();
  const event=record.event, end=event.endsAt||event.startsAt, past=end<new Date();
  const upcoming=await db.select().from(schema.networkEvents).where(and(eq(schema.networkEvents.status,"approved"),gte(schema.networkEvents.startsAt,new Date()),ne(schema.networkEvents.id,event.id))).orderBy(asc(schema.networkEvents.startsAt)).limit(3);
  const calendarDates=`${event.startsAt.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}/${end.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}`;
  const calendarUrl=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${calendarDates}&details=${encodeURIComponent(event.summary)}&location=${encodeURIComponent([event.venue,event.address,event.location].filter(Boolean).join(", "))}`;
  const dateParts={date:event.startsAt.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"Europe/London"}),time:event.startsAt.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/London"})};

  return <main className="relative min-h-screen overflow-hidden pb-24 pt-24">
    <EventAnalytics eventId={event.id}/>
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[1050px]"><div className="absolute inset-0 bg-[url('/images/north-east/3.jpg')] bg-cover bg-center opacity-25 [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]"/><div className="absolute inset-0 bg-gradient-to-b from-surface-0/20 via-surface-0/75 to-surface-0"/><div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,0,188,.24),transparent_42%)]"/></div>
    <div className="container-shell relative z-10">
      <Link href="/network/events" className="inline-flex items-center gap-2 text-sm font-semibold text-accent"><ArrowLeft size={15}/>All events</Link>
      <section className="mt-7 overflow-hidden rounded-[2rem] border border-accent/35 bg-surface-1/90 shadow-[0_30px_100px_rgba(0,0,0,.55)] backdrop-blur md:p-3">
        <div className="grid lg:grid-cols-[.82fr_1.18fr] lg:items-stretch">
          {event.coverImageKey&&<div className="relative min-h-[440px] overflow-hidden rounded-[1.4rem]"><img src={media(event.coverImageKey)} alt={event.coverImageAlt} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/><div className="absolute bottom-5 left-5 rounded-2xl border border-white/20 bg-black/70 px-5 py-3 text-center backdrop-blur"><span className="block text-3xl font-bold text-accent">{event.startsAt.toLocaleDateString("en-GB",{day:"2-digit",timeZone:"Europe/London"})}</span><span className="text-xs font-bold uppercase tracking-[.16em]">{event.startsAt.toLocaleDateString("en-GB",{month:"short",timeZone:"Europe/London"})}</span></div></div>}
          <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
            <div className="flex flex-wrap gap-2"><span className="rounded-full border border-accent/40 px-3 py-1 text-xs font-bold text-accent">{past?"Past event":event.eventType}</span><span className="rounded-full border border-line px-3 py-1 text-xs capitalize text-fg-muted">{event.format.replace("_"," ")}</span></div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[.95] tracking-tight md:text-6xl">{event.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-fg-muted">{event.summary}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-black/25 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent"><CalendarDays size={15}/>Date</p><p className="mt-2 text-sm">{dateParts.date}</p></div>
              <div className="rounded-2xl border border-line bg-black/25 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent"><Clock3 size={15}/>Time</p><p className="mt-2 text-sm">{dateParts.time}</p></div>
              <div className="rounded-2xl border border-line bg-black/25 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent"><MapPin size={15}/>Place</p><p className="mt-2 text-sm">{event.venue}{event.location?`, ${event.location}`:""}</p></div>
              <div className="rounded-2xl border border-line bg-black/25 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent"><Ticket size={15}/>Price</p><p className="mt-2 text-sm capitalize">{event.priceType}{event.priceDetails?` · ${event.priceDetails}`:""}</p></div>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">{!past&&event.bookingUrl&&<a data-event-action="booking_click" href={event.bookingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white">More information <ArrowUpRight size={15}/></a>}<a data-event-action="calendar_click" href={calendarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-3 text-sm font-bold text-accent"><CalendarDays size={15}/>Google Calendar</a><EventActions eventId={event.id} slug={event.slug || slug}/></div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-16 lg:grid-cols-[1.25fr_.75fr] lg:py-24">
        <article className="rounded-3xl border border-line bg-surface-1/70 p-7 md:p-10"><p className="mono-label text-accent">About the event</p><h2 className="mt-3 text-3xl font-semibold md:text-5xl">What to expect</h2><div className="mt-7 whitespace-pre-wrap text-base leading-8 text-fg-muted">{event.fullDescription||event.summary}</div></article>
        <aside className="space-y-5">
          {(event.accessibility||event.ageGuidance)&&<div className="rounded-3xl border border-line bg-surface-1/70 p-7"><p className="flex items-center gap-2 font-bold"><Accessibility className="text-accent" size={20}/>Good to know</p>{event.accessibility&&<p className="mt-4 text-sm leading-6 text-fg-muted">{event.accessibility}</p>}{event.ageGuidance&&<p className="mt-3 text-sm text-fg-muted">Age guidance: {event.ageGuidance}</p>}</div>}
          {record.profile&&<div className="rounded-3xl border border-accent/30 bg-[linear-gradient(145deg,rgba(255,0,188,.13),rgba(12,12,15,.94))] p-7"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent"><UserRound size={16}/>Organised by</p><h3 className="mt-4 text-2xl font-semibold">{record.profile.displayName}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-fg-muted">{record.profile.bio}</p><Link data-event-action="organiser_click" href={`/network/directory/member/${record.member.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent">View their profile <ArrowUpRight size={14}/></Link></div>}
        </aside>
      </section>

      {upcoming.length>0&&<section className="border-t border-line pt-16"><div className="flex items-end justify-between gap-4"><div><p className="mono-label text-accent">Keep exploring</p><h2 className="mt-3 text-3xl font-semibold md:text-5xl">Upcoming events</h2></div><Link href="/network/events" className="text-sm font-bold hover:text-accent">View all <ArrowUpRight size={14} className="inline"/></Link></div><div className="mt-8 grid gap-5 md:grid-cols-3">{upcoming.map(item=><Link key={item.id} href={`/network/events/${item.slug}`} className="group overflow-hidden rounded-3xl border border-line bg-surface-1 transition hover:-translate-y-1 hover:border-accent/60"><div className="relative aspect-[4/5] overflow-hidden">{item.coverImageKey&&<img src={media(item.coverImageKey)} alt={item.coverImageAlt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>}<div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"/><div className="absolute inset-x-0 bottom-0 p-5"><p className="text-xs font-bold text-accent">{item.startsAt.toLocaleDateString("en-GB",{dateStyle:"medium",timeZone:"Europe/London"})}</p><h3 className="mt-2 text-2xl font-semibold text-white">{item.title}</h3><p className="mt-2 flex items-center gap-2 text-xs text-white/70"><MapPin size={13}/>{item.location}</p></div></div></Link>)}</div></section>}
    </div>
  </main>;
}
