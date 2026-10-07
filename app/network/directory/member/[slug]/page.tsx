import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, gte, isNotNull } from "drizzle-orm";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { JsonLd, buildBreadcrumbSchema, type JsonLdSchema } from "@/components/seo/json-ld";
import { MemberAvatar } from "@/components/network/member-avatar";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { DirectoryMemberCard } from "../../directory-browser";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import {
  directoryGroups,
  membersInGroup,
  primaryMemberGroup,
} from "@/lib/content/network-directory-groups";
import type { NetworkDirectoryMember } from "@/lib/content/network-directory";
import { getNetworkDb, schema } from "@/lib/network-db";
import { PortfolioGallery } from "./portfolio-gallery";

const SITE_URL = "https://namicreative.co.uk";

export const revalidate = 60;

function memberNames(name: string) {
  const parts = name.split(/\s*\/\s*/).map((part) => part.trim()).filter(Boolean);
  return {
    personName: parts[0] || name,
    brandName: parts.length > 1 ? parts.slice(1).join(" / ") : "",
  };
}

function memberProfileCopy(member: NetworkDirectoryMember) {
  const isEllie = member.id === "ellie-grassick";
  const names = isEllie
    ? { personName: "Ellie Grassick", brandName: "Rindill Makes" }
    : memberNames(member.name);
  return {
    ...names,
    role: isEllie ? "Jewellery maker" : member.category,
    aboutEyebrow: "About",
    aboutTitle: `About ${names.brandName || names.personName}`,
    aboutBody: member.about || (isEllie
      ? "Rindill Makes creates handmade stainless-steel jewellery inspired by history, nature, fantasy and folklore. Ellie is based in Newcastle and makes chainmail jewellery, clothing and accessories."
      : member.description),
    galleryTitle: isEllie
      ? "Made by Rindill"
      : `Work by ${names.brandName || names.personName}`,
  };
}

function schemaEntityType(member: NetworkDirectoryMember, groupSlug: string) {
  const category = member.category.toLowerCase();
  const hasBrandName = memberNames(member.name).brandName.length > 0;
  return groupSlug === "independent-businesses"
    || hasBrandName
    || category.includes("business")
    || category.includes("studio")
    || category.includes("venue")
    ? "Organization"
    : "Person";
}

function absoluteUrl(value?: string) {
  if (!value) return undefined;
  return value.startsWith("http") ? value : `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const members = await getNetworkDirectoryMembers();
  const member = members.find((item) => item.id === slug);

  if (!member) {
    return {
      title: "Member not found | NAMI Creative Network",
      robots: { index: false, follow: false },
    };
  }

  const profile = memberProfileCopy(member);
  const displayName = profile.brandName
    ? `${profile.personName} / ${profile.brandName}`
    : profile.personName;
  const title = `${displayName} | North East Creative Network member`;
  const description = `${member.description} Find ${displayName} in the NAMI Creative Network directory.`;
  const url = `/network/directory/member/${member.id}`;
  const profileImage = absoluteUrl(member.profileImage);
  const shareImage = profileImage ?? `${SITE_URL}/assets/images/nami-og.png`;

  return {
    title,
    description,
    keywords: [
      displayName,
      member.category,
      `${member.category} ${member.location}`,
      `North East ${member.category}`,
      "NAMI Creative Network member",
    ],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${url}`,
      type: "profile",
      siteName: "NAMI Creative",
      locale: "en_GB",
      images: [{
        url: shareImage,
        alt: profileImage ? member.imageAlt || `${member.name} profile picture` : "NAMI Creative Network",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export default async function NetworkMemberProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const members = await getNetworkDirectoryMembers();
  const member = members.find((item) => item.id === slug);

  if (!member) notFound();

  const memberUrl = `${SITE_URL}/network/directory/member/${member.id}`;
  const profileImage = absoluteUrl(member.profileImage);
  const socialLinks = [
    { label: "Instagram", url: member.instagramUrl },
    { label: "Facebook", url: member.facebookUrl },
    { label: "LinkedIn", url: member.linkedinUrl },
    { label: "TikTok", url: member.tiktokUrl },
    { label: "YouTube", url: member.youtubeUrl },
  ].filter((item): item is { label: string; url: string } => Boolean(item.url));
  const externalProfiles = [member.websiteUrl, ...socialLinks.map((item) => item.url)].filter(Boolean);
  const groupSlug = primaryMemberGroup(member);
  const group = directoryGroups.find((item) => item.slug === groupSlug)!;
  const profile = memberProfileCopy(member);
  const entityType = schemaEntityType(member, groupSlug);
  const relatedMembers = membersInGroup(members, groupSlug)
    .filter((item) => item.id !== member.id)
    .slice(0, 3);
  const db = await getNetworkDb();
  const upcomingEvents = await db.select()
    .from(schema.networkEvents)
    .where(and(
      eq(schema.networkEvents.memberId, member.id),
      eq(schema.networkEvents.status, "approved"),
      gte(schema.networkEvents.startsAt, new Date()),
      isNotNull(schema.networkEvents.slug),
    ))
    .orderBy(asc(schema.networkEvents.startsAt))
    .limit(3);

  const mainEntity: JsonLdSchema = {
    "@type": entityType,
    "@id": `${memberUrl}#member`,
    name: entityType === "Organization" && profile.brandName ? profile.brandName : member.name,
    url: memberUrl,
    description: member.description,
    image: profileImage,
    knowsAbout: [member.category, group.label, "North East creative work"],
    location: {
      "@type": "Place",
      name: member.location,
    },
    sameAs: externalProfiles,
    memberOf: { "@id": `${SITE_URL}/#organization` },
    ...(entityType === "Organization" && profile.brandName
      ? { founder: { "@type": "Person", name: profile.personName } }
      : {}),
  };

  const profileSchema: JsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${memberUrl}#profile`,
    url: memberUrl,
    name: `${member.name} on the NAMI Creative Network`,
    description: member.description,
    mainEntity,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      <JsonLd
        schema={[
          profileSchema,
          buildBreadcrumbSchema([
            { name: "Creative Network", url: "/network" },
            { name: "Directory", url: "/network/directory" },
            { name: member.name, url: `/network/directory/member/${member.id}` },
          ]),
        ]}
      />

    <div className="overflow-hidden pb-24">
        <section className="relative isolate overflow-hidden border-b border-line pb-10 pt-24 sm:pt-28 md:pb-20 md:pt-36">
          <ParallaxBackdrop
            src="/images/north-east/4.jpg"
            overlay={0.88}
            imageClassName="brightness-[0.38]"
            position="center 42%"
          />
          <div className="container-shell relative">
          <Link
            href="/network/directory"
            className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden />
            Back to the directory
          </Link>

          <section className="relative mt-7 sm:mt-10">
            <div className="relative grid gap-8 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:items-end lg:gap-16">
              <div className="w-full max-w-sm lg:max-w-md">
                <MemberAvatar
                  name={member.name}
                  src={member.profileImage}
                  alt={member.imageAlt}
                  featured
                />
              </div>

              <div className="pb-1 text-left lg:pb-4">
                <p className="text-sm font-semibold text-accent">NAMI Creative Network member</p>
                <h1 className="mt-4 max-w-4xl break-words text-[clamp(3rem,10vw,5rem)] font-semibold leading-[0.96] tracking-[-0.045em] lg:text-7xl">
                  {profile.personName}
                  {profile.brandName && <span className="mt-2 block text-accent">{profile.brandName}</span>}
                </h1>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-l-2 border-accent pl-4 text-sm text-fg-muted">
                  <span>{profile.role}</span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={15} className="text-accent" aria-hidden />
                    {member.location}
                  </span>
                </div>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg md:text-xl">
                  {member.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {member.websiteUrl && (
                    <a
                      href={member.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
                    >
                      Visit their work <ArrowUpRight size={15} aria-hidden />
                    </a>
                  )}
                  {socialLinks.length > 0 && (
                    <a
                      href="#member-socials"
                      className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-black/70 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent"
                    >
                      View socials <ArrowUpRight size={15} aria-hidden />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
          </div>
        </section>

        <div className="container-shell">
          <section className="grid gap-8 pb-16 pt-10 md:py-24 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:gap-14">
            <div>
              <p className="mono-label text-accent">{profile.aboutEyebrow}</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-[0.98] tracking-tight sm:text-4xl md:mt-4 md:text-6xl">
                {profile.aboutTitle}
              </h2>
              <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-6 text-fg-muted sm:mt-7 sm:text-lg sm:leading-relaxed">
                {profile.aboutBody}
              </p>
            </div>

            <aside
              id="member-socials"
              className="self-start scroll-mt-28 border border-line bg-surface-1 p-6 md:p-8"
            >
              <p className="mono-label text-accent">At a glance</p>
              <dl className="mt-6 [&>*+*]:border-t [&>*+*]:border-line-strong">
                <div className="flex items-start justify-between gap-6 py-4 first:pt-0">
                  <dt className="text-sm text-fg-subtle">Based in</dt>
                  <dd className="text-right font-semibold text-fg">{member.location}</dd>
                </div>
                <div className="flex items-start justify-between gap-6 py-4">
                  <dt className="text-sm text-fg-subtle">Category</dt>
                  <dd className="text-right font-semibold text-fg">{member.category}</dd>
                </div>
                <div className="flex items-start justify-between gap-6 py-4">
                  <dt className="text-sm text-fg-subtle">Part of</dt>
                  <dd className="max-w-48 text-right font-semibold text-fg">{group.label}</dd>
                </div>
              </dl>
              {socialLinks.length > 0 && (
                <div className="mt-7 border-t border-accent/25 pt-6">
                  <p className="text-sm font-semibold text-fg">Follow and connect</p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border-b border-line-strong py-2 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent"
                      >
                        {link.label} <ArrowUpRight size={14} aria-hidden />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </section>
        </div>

        <section className="border-y border-line bg-surface-1/35 py-16 md:py-24">
          <div className="container-shell">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mono-label text-accent">A look at the work</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{profile.galleryTitle}</h2>
              </div>
            </div>

            <PortfolioGallery images={member.portfolioImages ?? []} memberName={member.name} />
          </div>
        </section>

        {upcomingEvents.length > 0 && (
          <section className="relative isolate overflow-hidden border-b border-line py-16 md:py-24">
            <ParallaxBackdrop src="/images/north-east/3.jpg" overlay={0.84} position="center 44%" />
            <div className="container-shell relative">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="mono-label text-accent">Coming up</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                    Upcoming {upcomingEvents.length === 1 ? "event" : "events"} by {profile.brandName || profile.personName}
                  </h2>
                </div>
                <Link href="/network/events" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent">
                  View all events <ArrowUpRight size={15} aria-hidden />
                </Link>
              </div>

              <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/network/events/${event.slug}`}
                    className="group overflow-hidden border border-line bg-surface-1 transition-colors hover:border-accent/60"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
                      {event.coverImageKey && (
                        <img
                          src={`/api/network/media/${event.coverImageKey.split("/").map(encodeURIComponent).join("/")}`}
                          alt={event.coverImageAlt || event.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                      <div className="absolute left-5 top-5 rounded-2xl border border-white/20 bg-black/75 px-4 py-3 text-center backdrop-blur">
                        <span className="block text-2xl font-bold text-accent">
                          {event.startsAt.toLocaleDateString("en-GB", { day: "2-digit", timeZone: "Europe/London" })}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                          {event.startsAt.toLocaleDateString("en-GB", { month: "short", timeZone: "Europe/London" })}
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-accent">{event.eventType}</p>
                        <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{event.title}</h3>
                        <p className="mt-3 flex items-center gap-2 text-sm text-white/75">
                          <MapPin size={14} aria-hidden /> {event.venue}{event.location ? `, ${event.location}` : ""}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
                          <CalendarDays size={14} aria-hidden />
                          {event.startsAt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", timeZone: "Europe/London" })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {relatedMembers.length > 0 && (
          <section className="relative isolate overflow-hidden py-16 md:py-24">
            <ParallaxBackdrop src="/images/north-east/6.jpg" overlay={0.78} />
            <div className="container-shell relative">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="mono-label text-accent">Keep looking</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">More people to meet</h2>
                </div>
                <Link href={`/network/directory/${groupSlug}`} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent">
                  See all in {group.label.toLowerCase()} <ArrowUpRight size={15} aria-hidden />
                </Link>
              </div>
              <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {relatedMembers.map((related) => (
                  <DirectoryMemberCard key={related.id} member={related} />
                ))}
              </div>
            </div>
          </section>
        )}

    </div>
    </>
  );
}
