import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MapPin, Sparkles } from "lucide-react";
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
  const shareImage = profileImage ?? `${SITE_URL}/nami-og%20%281%29.png`;

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
    mainEntityOfPage: memberUrl,
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

      <main className="overflow-hidden pb-24">
        <section className="relative isolate overflow-hidden pb-4 pt-24 sm:pt-28 md:pb-24 md:pt-36">
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

          <section className="relative mt-5 overflow-hidden rounded-[1.5rem] border border-accent/30 bg-surface-1 px-5 py-6 sm:mt-8 sm:rounded-[2rem] sm:px-6 sm:py-7 md:px-10 md:py-10 lg:px-14 lg:py-14">
            <div aria-hidden className="hairline-grid absolute inset-0 opacity-30" />
            <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-accent/20 blur-3xl" />

            <div className="relative grid gap-6 sm:gap-10 lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-16">
              <div className="mx-auto w-full max-w-[12rem] sm:max-w-xs lg:max-w-md">
                <MemberAvatar
                  name={member.name}
                  src={member.profileImage}
                  alt={member.imageAlt}
                  featured
                />
              </div>

              <div>
                <p className="mono-label text-[10px] text-accent sm:text-xs">NAMI Creative Network member</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-fg-subtle sm:mt-5 sm:gap-3 sm:text-sm">
                  <span className="rounded-full border border-line bg-surface-0/50 px-2.5 py-1 sm:px-3 sm:py-1.5">{profile.role}</span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={15} className="text-accent" aria-hidden />
                    {member.location}
                  </span>
                </div>

                <h1 className="mt-4 max-w-4xl break-words text-[clamp(2.15rem,10.5vw,3rem)] font-semibold leading-[0.94] tracking-tight sm:mt-6 sm:text-6xl lg:text-7xl">
                  {profile.personName}
                  {profile.brandName && <span className="mt-2 block text-accent">{profile.brandName}</span>}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-6 text-fg-muted sm:mt-7 sm:text-lg sm:leading-relaxed md:text-xl">
                  {member.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
                  {member.websiteUrl && (
                    <a
                      href={member.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-accent-soft sm:gap-2 sm:px-6 sm:py-3.5 sm:text-sm"
                    >
                      Visit their work <ArrowUpRight size={15} aria-hidden />
                    </a>
                  )}
                  {socialLinks.length > 0 && (
                    <a
                      href="#member-socials"
                      className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-black/75 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_0_rgba(255,0,166,0)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-accent hover:shadow-[0_10px_30px_rgba(255,0,166,0.2)] sm:gap-2 sm:px-6 sm:py-3.5 sm:text-sm"
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
              className="group scroll-mt-28 rounded-3xl border border-accent/35 bg-[linear-gradient(145deg,rgba(255,0,166,0.20),rgba(18,18,22,0.96)_45%,rgba(255,0,166,0.08))] p-6 shadow-[0_18px_55px_rgba(255,0,166,0.10)] transition-all duration-500 hover:-translate-y-1 hover:border-accent/65 hover:shadow-[0_24px_70px_rgba(255,0,166,0.20)] md:p-8"
            >
              <p className="mono-label text-accent">At a glance</p>
              <dl className="mt-6 divide-y divide-line">
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
                        className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-black/65 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:shadow-[0_10px_26px_rgba(255,0,166,0.28)]"
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

        <section className="container-shell pt-4">
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-surface-1 p-8 md:p-12">
            <div aria-hidden className="hairline-grid absolute inset-0 opacity-20" />
            <div aria-hidden className="absolute right-0 top-0 size-72 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <Sparkles size={24} className="text-accent" aria-hidden />
                <p className="mono-label mt-5 text-accent">NAMI Creative Network</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Making something up here?</h2>
                <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                  Join the Network, get your work seen and make it easier for people to find you, hire you, buy from you and connect with you.
                </p>
              </div>
              <Link
                href="/network#join-network"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
              >
                Join the Network <ArrowUpRight size={15} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
