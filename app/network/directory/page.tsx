import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MapPin, Search, Users } from "lucide-react";
import { InstagramIcon } from "@/components/icons/socials";
import { MemberAvatar } from "@/components/network/member-avatar";
import { PageHero } from "@/components/sections/page-hero";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import { DirectoryBrowser } from "./directory-browser";

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
  const featured = members.find((member) => member.featured) ?? members[0];

  return (
    <>
      <PageHero
        eyebrow="NAMI Creative Network"
        title={
          <>
            Find the people making proper work <span className="text-gradient sm:block">across the North East</span>
          </>
        }
        lead="Artists, photographers, designers, musicians, makers, freelancers and independent businesses. Search the Network and find someone worth knowing about."
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
        <section className="border-b border-line bg-surface-1/35 py-10 md:py-14">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-surface-1 p-7 md:p-10">
              <div aria-hidden className="hairline-grid absolute inset-0 opacity-30" />
              <div aria-hidden className="absolute -right-20 -top-24 size-80 rounded-full bg-accent/15 blur-3xl" />
              <div className="relative z-10 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
                <div>
                  <p className="mono-label text-accent">Featured member</p>
                  <div className="mt-6">
                    <MemberAvatar
                      name={featured.name}
                      src={featured.profileImage}
                      alt={featured.imageAlt}
                      featured
                    />
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-fg-subtle">
                    <span className="rounded-full border border-line px-3 py-1.5">{featured.category}</span>
                    <span className="inline-flex items-center gap-2"><MapPin size={14} aria-hidden />{featured.location}</span>
                  </div>
                  <h2 className="mt-5 text-4xl font-semibold leading-[0.96] tracking-tight md:text-6xl">{featured.name}</h2>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{featured.description}</p>
                  <div className="mt-7 flex flex-wrap gap-4">
                    {featured.instagramUrl && (
                      <a href={featured.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent">
                        <InstagramIcon size={16} aria-hidden /> Instagram
                      </a>
                    )}
                    {featured.websiteUrl && (
                      <a href={featured.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent">
                        Visit their work <ArrowUpRight size={14} aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="directory" className="container-shell scroll-mt-24 py-20 md:py-28">
        <div className="mb-10 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mono-label text-accent">The directory</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[0.96] tracking-tight md:text-6xl">Find someone to know, follow or work with</h2>
          </div>
          <div className="flex gap-5 md:justify-end">
            <div className="flex items-center gap-3 text-sm text-fg-muted"><Users size={18} className="text-accent" aria-hidden />{members.length} members</div>
            <div className="flex items-center gap-3 text-sm text-fg-muted"><Search size={18} className="text-accent" aria-hidden />Searchable by work and place</div>
          </div>
        </div>
        <DirectoryBrowser members={members} />
      </section>

      <section className="border-t border-line bg-surface-1/35 py-20 md:py-24">
        <div className="container-shell text-center">
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
