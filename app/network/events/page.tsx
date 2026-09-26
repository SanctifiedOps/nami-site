import type { Metadata } from "next";
import { and, asc, eq, gte } from "drizzle-orm";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { getMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export const metadata:Metadata={title:"Network events",description:"Events shared by members of the NAMI Creative Network."};
export const dynamic="force-dynamic";
const media=(key:string)=>`/api/network/media/${key.split("/").map(encodeURIComponent).join("/")}`;

export default async function NetworkEventsPage(){
 const env=await getRuntimeEnvironment();
 if(env.NETWORK_EVENTS_MODE!=="live"&&process.env.NODE_ENV!=="development")notFound();
 const db=await getNetworkDb();
 const [liveEvents,auth]=await Promise.all([db.select().from(schema.networkEvents).where(and(eq(schema.networkEvents.status,"approved"),gte(schema.networkEvents.startsAt,new Date()))).orderBy(asc(schema.networkEvents.startsAt)),getMemberSession()]);
 const preview=process.env.NODE_ENV==="development"&&liveEvents.length===0?[{id:"preview-event",slug:null,title:"North East Creatives Social",eventType:"Meetup",summary:"An informal evening for artists, designers, photographers and independent creatives to meet, share ideas and make useful connections.",venue:"The Common Room",location:"Newcastle upon Tyne",startsAt:new Date(Date.now()+12*86400000),priceType:"free",coverImageKey:null,coverImageAlt:"Creative people meeting at a North East event",isPreview:true}]:[];
 const events=[...liveEvents.map(event=>({...event,isPreview:false})),...preview];
 return <main className="relative min-h-screen overflow-hidden pb-24 pt-24">
  <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] [mask-image:linear-gradient(to_bottom,black_0%,black_42%,transparent_82%)]">
   <div className="absolute inset-0 bg-[url('/images/north-east/3.jpg')] bg-cover bg-center opacity-35" />
   <div className="absolute inset-0 bg-gradient-to-b from-surface-0/35 via-surface-0/80 to-surface-0" />
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,0,188,.24),transparent_42%)]" />
  </div>
  <div className="container-shell relative z-10">
   <section className="max-w-4xl pt-8 md:pt-16"><p className="font-bold uppercase tracking-[.16em] text-accent">NAMI Creative Network</p><h1 className="mt-4 text-5xl leading-[.95] md:text-8xl">Events worth<br/><span className="text-accent">showing up for</span></h1><p className="mt-6 max-w-2xl text-base leading-7 text-fg-muted md:text-lg">Workshops, meetups, markets, exhibitions and other things Network members are putting on across the North East.</p><div className="mt-8 flex flex-wrap gap-3">{auth?<a href="/network/dashboard/events" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white">Add or manage an event</a>:<a href="/network/login?next=/network/dashboard/events" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white">Sign in to add an event</a>}<a href="#upcoming" className="rounded-full border border-accent px-6 py-3 text-sm font-bold text-accent">See what’s coming up</a></div></section>
   <ScrollReveal className="scroll-mt-24 pt-24"><section id="upcoming"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-accent">The calendar</p><h2 className="mt-2 text-3xl md:text-5xl">Coming up</h2></div><CalendarDays className="text-accent" size={28}/></div>
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{events.map(event=>{const card=<><div className="relative aspect-[4/5] overflow-hidden bg-[url('/network-news/creative-night.jpg')] bg-cover bg-center">{event.coverImageKey&&<img src={media(event.coverImageKey)} alt={event.coverImageAlt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>}<div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent"/><span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{event.isPreview?"Preview":event.eventType}</span><div className="absolute inset-x-0 bottom-0 p-5"><p className="text-sm font-bold text-accent">{event.startsAt.toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/London"})}</p><h3 className="mt-2 text-2xl text-white">{event.title}</h3></div></div><div className="p-5"><p className="flex items-center gap-2 text-xs text-fg-subtle"><MapPin size={13} className="text-accent"/>{event.venue}, {event.location}</p><p className="mt-4 line-clamp-3 text-sm leading-6 text-fg-muted">{event.summary}</p><div className="mt-5 flex items-center justify-between"><span className="text-xs font-bold uppercase text-accent">{event.priceType}</span><span className="inline-flex items-center gap-1 text-sm font-bold">View event <ArrowUpRight size={14}/></span></div></div></>;return event.slug?<a href={`/network/events/${event.slug}`} key={event.id} className="group overflow-hidden rounded-3xl border border-line bg-surface-1/95 shadow-[0_18px_60px_rgba(0,0,0,.3)] transition hover:-translate-y-1 hover:border-accent/60">{card}</a>:<article key={event.id} className="group overflow-hidden rounded-3xl border border-accent/40 bg-surface-1/95 shadow-[0_18px_60px_rgba(0,0,0,.3)]">{card}</article>})}</div>
   </section></ScrollReveal>
  </div>
 </main>;
}
