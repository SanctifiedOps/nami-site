import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, eq, gte } from "drizzle-orm";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin, Search, Users } from "lucide-react";
import { MemberAvatar } from "@/components/network/member-avatar";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { PageHero } from "@/components/sections/page-hero";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import { dailyMemberPreview, directoryGroups, londonDayNumber, membersInGroup } from "@/lib/content/network-directory-groups";
import { getNetworkDb, schema } from "@/lib/network-db";
import { DirectoryBrowser, DirectoryMemberCard } from "./directory-browser";
import { MemberDiscovery } from "./member-discovery";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "North East Creative Directory | NAMI Creative Network",
  description:
    "Find artists, photographers, designers, musicians, freelancers, makers and independent businesses across the North East.",
  keywords: [
    "North East creative directory",
    "Newcastle creatives",
    "North East artists",
    "North East photographers",
    "North East freelancers",
    "creative businesses Newcastle",
  ],
  alternates: { canonical: "/network/directory" },
  openGraph: {
    title: "North East Creative Directory | NAMI Creative Network",
    description: "Find and support people making proper work across the North East.",
    url: "https://namicreative.co.uk/network/directory",
    images: [
      {
        url: "/nami-og%20%281%29.png",
        width: 2800,
        height: 1750,
        alt: "NAMI Creative Network directory",
      },
    ],
  },
};

export default async function NetworkDirectoryPage() {
  const members = await getNetworkDirectoryMembers();
  const upcomingEvents = await getNetworkDb()
    .then((db) => db.select().from(schema.networkEvents).where(and(eq(schema.networkEvents.status, "approved"), gte(schema.networkEvents.startsAt, new Date()))).orderBy(asc(schema.networkEvents.startsAt)).limit(3))
    .catch(() => []);
  const featured = members.find((member) => member.featured) ?? members[0];
  const day = londonDayNumber();
  const newest = members.filter((member) => member.joinedAt && !Number.isNaN(Date.parse(member.joinedAt))).sort((a, b) => Date.parse(b.joinedAt!) - Date.parse(a.joinedAt!)).slice(0, 4);
  const firstSectionMembers = newest.length === 4 ? newest : dailyMemberPreview(members, day, 4);
  const previewSlugs = ["artists", "photographers", "designers", "makers", "music", "independent-businesses"] as const;
  const previews = previewSlugs.map((slug) => ({ group: directoryGroups.find((group) => group.slug === slug)!, members: membersInGroup(members, slug) })).filter(({ members: groupMembers }) => groupMembers.length >= 4);
  const otherGroups = directoryGroups.filter((group) => !previewSlugs.includes(group.slug as typeof previewSlugs[number]) && membersInGroup(members, group.slug).length > 0);

  return (
    <>
      <PageHero
        networkBackground
        eyebrow="NAMI Creative Network"
        title="NAMI Creative Network Directory"
        lead="Meet the artists, photographers, makers and independent businesses in the Network. Find someone to follow, work with or support across the North East."
      >
        <Link
          href="#directory"
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
        >
          Explore the directory
          <ArrowDown size={16} aria-hidden className="transition-transform group-hover:translate-y-0.5" />
        </Link>
      </PageHero>

      {featured && (
        <section className="border-b border-line bg-surface-0 py-10 md:py-14">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-surface-1 p-7 md:p-10">
              <div aria-hidden className="hairline-grid absolute inset-0 opacity-30" />
              <div aria-hidden className="absolute -right-20 -top-24 size-80 rounded-full bg-accent/15 blur-3xl" />
              <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:items-center lg:gap-12">
                <div className="mx-auto w-full max-w-sm lg:max-w-none">
                  <MemberAvatar
                    name={featured.name}
                    src={featured.profileImage}
                    alt={featured.imageAlt}
                    featured
                  />
                </div>
                <div>
                  <p className="mb-5 text-2xl font-semibold leading-tight tracking-tight text-accent md:text-3xl">Featured Member</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-fg-subtle">
                    <span className="rounded-full border border-line px-3 py-1.5">{featured.category}</span>
                    <span className="inline-flex items-center gap-2"><MapPin size={14} aria-hidden />{featured.location}</span>
                  </div>
                  <h2 className="mt-5 text-4xl font-semibold leading-[0.96] tracking-tight md:text-6xl">{featured.name}</h2>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{featured.description}</p>
                  <div className="mt-7 flex flex-wrap gap-4">
                    <Link href={`/network/directory/member/${featured.id}`} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-soft">
                      View member profile <ArrowUpRight size={14} aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="directory" className="container-shell scroll-mt-24 py-10 md:py-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono-label text-accent">Explore the Network</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[0.96] tracking-tight md:text-6xl">Find your people</h2>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-fg-muted">
            <span className="inline-flex items-center gap-2"><Users size={18} className="text-accent" aria-hidden />{members.length} members</span>
            <span className="inline-flex items-center gap-2"><Search size={18} className="text-accent" aria-hidden />Search by work and place</span>
          </div>
        </div>
        <DirectoryBrowser members={members} previewOnly />
      </section>

      <section className="border-y border-line bg-surface-1/35 py-16 md:py-20">
        <div className="container-shell">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mono-label text-accent">People to meet</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{newest.length === 4 ? "Newest members" : "Meet more members"}</h2>
            </div>
            <Link href="/network/directory/all" className="text-sm font-semibold text-fg hover:text-accent">View everyone <ArrowUpRight size={15} className="inline" aria-hidden /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {firstSectionMembers.map((member) => <DirectoryMemberCard key={member.id} member={member} />)}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-16 md:py-20">
        <ParallaxBackdrop src="/images/north-east/1.jpg" overlay={0.72} />
        <div className="container-shell relative">
          <p className="mono-label text-accent">Browse by work</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">What are you looking for?</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {directoryGroups.filter((group) => membersInGroup(members, group.slug).length > 0).map((group) => (
              <Link key={group.slug} href={`/network/directory/${group.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface-1/90 px-5 py-6 transition-colors hover:border-accent/50 hover:bg-surface-1">
                <span className="text-lg font-semibold">{group.label}<span className="ml-2 text-sm font-normal text-fg-subtle">{membersInGroup(members, group.slug).length}</span></span>
                <ArrowUpRight size={19} aria-hidden className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {previews.map(({ group, members: groupMembers }, index) => (
        <div key={group.slug}>
        {index === 2 && <section className="relative isolate overflow-hidden py-16 md:py-20"><ParallaxBackdrop src="/images/north-east/5.jpg" overlay={0.72} /><div className="container-shell relative"><MemberDiscovery members={members} initialIndex={day % members.length} /></div></section>}
        <section className={`border-t border-line py-16 md:py-20 ${index % 2 === 0 ? "bg-surface-1/35" : ""}`}>
          <div className="container-shell">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mono-label text-accent">The Network</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{group.label}</h2>
                <p className="mt-3 max-w-xl text-fg-muted">{group.description}</p>
              </div>
              <Link href={`/network/directory/${group.slug}`} className="text-sm font-semibold text-fg hover:text-accent">View all {groupMembers.length} <ArrowUpRight size={15} className="inline" aria-hidden /></Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {dailyMemberPreview(groupMembers, day, 4).map((member) => <DirectoryMemberCard key={member.id} member={member} />)}
            </div>
          </div>
        </section>
        {group.slug === "makers" && upcomingEvents.length > 0 && (
          <section className="relative isolate overflow-hidden py-16 md:py-24">
            <ParallaxBackdrop src="/images/north-east/3.jpg" overlay={0.7} />
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(255,0,188,.25),transparent_42%)]" />
            <div className="container-shell relative">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div><p className="mono-label text-accent">Network events</p><h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Upcoming network events</h2></div>
                <Link href="/network/events" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent">View all events <ArrowUpRight size={15} aria-hidden /></Link>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {upcomingEvents.filter((event) => event.slug).map((event) => (
                  <Link key={event.id} href={`/network/events/${event.slug}`} className="group overflow-hidden rounded-3xl border border-white/15 bg-surface-1/90 shadow-2xl backdrop-blur transition hover:-translate-y-1 hover:border-accent/60">
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">{event.coverImageKey && <img src={`/api/network/media/${event.coverImageKey.split("/").map(encodeURIComponent).join("/")}`} alt={event.coverImageAlt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}<div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-5 text-white"><p className="flex items-center gap-2 text-xs font-bold text-accent"><CalendarDays size={14} aria-hidden />{event.startsAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Europe/London" })}</p><h3 className="mt-2 text-2xl font-semibold">{event.title}</h3><p className="mt-2 flex items-center gap-2 text-xs text-white/75"><MapPin size={13} aria-hidden />{event.location}</p></div></div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        </div>
      ))}

      <section className="border-t border-line bg-surface-1/35 py-16 md:py-20">
        <div className="container-shell">
          <p className="mono-label text-accent">Around the North East</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Find people near you</h2>
          <div className="mt-7 flex flex-wrap gap-3">
            {["Newcastle", "Gateshead", "Sunderland", "County Durham", "North Tyneside", "Northumberland"].map((area) => <Link key={area} href={`/network/directory/all?area=${encodeURIComponent(area)}`} className="rounded-full border border-line bg-surface-0 px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent">{area} <ArrowUpRight size={14} className="inline" aria-hidden /></Link>)}
          </div>
        </div>
      </section>

      {otherGroups.length > 0 && <section className="border-t border-line py-16 md:py-20">
        <div className="container-shell">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">There’s more to explore</h2>
          <div className="mt-7 flex flex-wrap gap-3">
            {otherGroups.map((group) => <Link key={group.slug} href={`/network/directory/${group.slug}`} className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent">{group.label} <ArrowUpRight size={14} className="inline" aria-hidden /></Link>)}
          </div>
        </div>
      </section>}

      <section className="relative isolate overflow-hidden py-20 md:py-24">
        <ParallaxBackdrop src="/images/north-east/7.jpg" overlay={0.72} />
        <div className="container-shell relative text-center">
          <p className="mono-label text-accent">NAMI Creative Network</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-tight md:text-6xl">Making something up here?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">Put your name in the Network so more people can find the work you are building.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/network#join-network" className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-soft">
              Join the Network
              <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/network/profile-picture" className="inline-flex items-center rounded-full border border-line px-7 py-4 text-sm font-semibold text-fg transition-colors hover:border-accent/50 hover:text-accent">
              Add your profile picture
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
