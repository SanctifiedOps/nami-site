import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Newspaper, Radio, Search, Users } from "lucide-react";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import {
  formatPostDate,
  getAllNetworkNews,
  getNetworkCategories,
  type NetworkNewsItem,
} from "@/lib/content/network-news";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News | NAMI Creative Network",
  description:
    "North East creative news, NAMI Creative Network spotlights, Newcastle creative features, interviews, opportunities, and marketing notes.",
  keywords: [
    "North East creative news",
    "Newcastle creatives",
    "North East creatives",
    "NAMI Creative Network",
    "creative spotlights Newcastle",
    "North East artist features",
    "Newcastle marketing insights",
  ],
  openGraph: {
    title: "News | NAMI Creative Network",
    description:
      "Spotlights, interviews, opportunities, and useful notes from the North East creative scene.",
    url: "https://namicreative.co.uk/network/news",
    images: [
      {
        url: "/nami-og%20%281%29.png",
        width: 2800,
        height: 1750,
        alt: "NAMI Creative Network news",
      },
    ],
  },
  alternates: {
    canonical: "/network/news",
  },
};

const featuredLabels = ["Spotlights", "Interviews", "Opportunities", "Marketing Notes"];

function ArticleMeta({ item, className }: { item: NetworkNewsItem; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-subtle", className)}>
      <span className="font-semibold uppercase tracking-[0.18em] text-accent">{item.category}</span>
      <span aria-hidden>/</span>
      <time dateTime={item.date}>{formatPostDate(item.date)}</time>
      <span aria-hidden>/</span>
      <span>{item.minutes} min</span>
    </div>
  );
}

function StoryCard({ item, variant = "default" }: { item: NetworkNewsItem; variant?: "lead" | "default" | "compact" }) {
  const isLead = variant === "lead";
  const isCompact = variant === "compact";

  return (
    <SpotlightCard
      tilt={isLead ? 0 : 3}
      glow={0.14}
      className={cn(
        "glass-refractive glass-refractive--hover overflow-hidden rounded-3xl",
        !isLead && "h-full",
      )}
    >
      <Link
        href={item.href}
        className={cn(
          "group relative z-10 flex flex-col overflow-hidden rounded-3xl",
          !isLead && "h-full",
          isLead ? "p-4 md:p-5" : "p-4",
        )}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-accent opacity-90" />
        {item.image && (
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl border border-line bg-surface-0/60",
              isLead ? "mb-6 aspect-[16/8] md:aspect-[16/7]" : isCompact ? "mb-4 aspect-[16/9]" : "mb-5 aspect-[16/8]",
            )}
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes={isLead ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 768px) 40vw, 100vw"}
              className="object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-surface-0/50 via-transparent to-transparent" />
          </div>
        )}
        <div className={cn(isLead ? "px-3 pb-3 md:px-5 md:pb-5" : "px-2 pb-2 md:px-3 md:pb-3")}>
          <ArticleMeta item={item} />
          <h2
            className={cn(
              "mt-5 font-semibold tracking-tight",
              isLead
                ? "max-w-3xl text-[clamp(1.8rem,4vw,3.8rem)] leading-[0.96]"
                : isCompact
                  ? "text-xl leading-[1.05] md:text-2xl"
                  : "text-2xl leading-[1] md:text-3xl",
            )}
          >
            {item.title}
          </h2>
          <p
            className={cn(
              "mt-4 leading-relaxed text-fg-muted",
              isLead ? "max-w-2xl text-lg" : "text-sm md:text-base",
            )}
          >
            {item.summary}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-8">
            <span className="rounded-full border border-line bg-surface-0/50 px-3 py-1 text-xs font-medium text-fg-muted">
              {item.kicker}
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors group-hover:text-accent">
              Read
              <ArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </Link>
    </SpotlightCard>
  );
}

function ListStory({ item }: { item: NetworkNewsItem }) {
  return (
    <Link
      href={item.href}
      className="group grid gap-4 border-b border-line py-6 transition-colors last:border-b-0 hover:border-accent/40 sm:grid-cols-[8rem_9rem_1fr]"
    >
      <div className="sm:order-1">
        <p className="mono-label text-accent">{item.category}</p>
        <p className="mt-2 text-xs text-fg-subtle">{formatPostDate(item.date)}</p>
      </div>
      {item.image && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-1 sm:order-2">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="9rem"
            className="object-cover grayscale transition duration-700 group-hover:scale-[1.05] group-hover:grayscale-0"
          />
        </div>
      )}
      <div className="sm:order-3">
        <h3 className="text-2xl font-semibold leading-[1.02] tracking-tight transition-colors group-hover:text-accent">
          {item.title}
        </h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-fg-muted">{item.summary}</p>
      </div>
    </Link>
  );
}

export default async function NetworkNewsPage() {
  const items = await getAllNetworkNews();
  const categories = getNetworkCategories(items);
  const lead = items.find((item) => item.featured && item.source === "network") ?? items[0];
  const secondary = items.filter((item) => item.slug !== lead?.slug).slice(0, 4);
  const latest = items.filter((item) => item.slug !== lead?.slug).slice(4, 10);
  const marketingNotes = items.filter((item) => item.category === "Marketing Notes").slice(0, 3);
  const opportunities = items.filter((item) => item.category === "Opportunities").slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-28 md:pt-32">
        <Image
          src="/network-news/hero-background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.70] grayscale contrast-125"
        />
        <div aria-hidden className="absolute inset-0 bg-surface-0/18" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-r from-surface-0/95 via-surface-0/58 to-surface-0/10" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-b from-surface-0/24 via-transparent to-surface-0/86" />
        <div aria-hidden className="hairline-grid absolute inset-0 opacity-25" />
        <div aria-hidden className="absolute left-0 top-0 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="container-shell relative z-10 pb-10 md:pb-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
            <div>
              <p className="mono-label mb-4 text-accent">NAMI Creative Network News</p>
              <h1 className="max-w-4xl text-[clamp(2.25rem,4.8vw,4.85rem)] font-semibold leading-[0.96] tracking-tight">
                The people, projects and opportunities shaping North East creativity
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-[1.45] text-fg-muted md:text-lg">
                Spotlights, interviews, opportunities, and practical marketing notes for people making, backing, and hiring creative work across the region.
              </p>
            </div>

            <div className="glass-refractive rounded-3xl p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                  <Radio size={18} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">Join the network</p>
                  <p className="text-xs leading-relaxed text-fg-subtle">For features, roundups, and local opportunities.</p>
                </div>
              </div>
              <Link
                href="/network"
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
              >
                Join NAMI Creative Network
                <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-y border-line py-3.5 text-sm text-fg-muted md:flex-row md:items-center">
            <span className="shrink-0 font-semibold uppercase tracking-[0.18em] text-accent">Now covering</span>
            <div className="flex flex-wrap gap-2">
              {featuredLabels.map((label) => (
                <span key={label} className="rounded-full border border-line bg-surface-1/50 px-3 py-1">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-14 md:py-20">
        {lead && <StoryCard item={lead} variant="lead" />}

        {secondary.length > 0 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {secondary.map((item) => (
              <StoryCard key={item.href} item={item} variant="compact" />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-line bg-surface-1/30 py-14 md:py-20">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_21rem] lg:gap-14">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="mono-label text-accent">Latest</p>
                <h2 className="mt-3 text-4xl font-semibold leading-[0.96] tracking-tight md:text-5xl">
                  Fresh from the network
                </h2>
              </div>
              <Newspaper className="hidden text-accent md:block" size={30} aria-hidden />
            </div>
            <div className="mt-4">
              {latest.map((item) => (
                <ListStory key={item.href} item={item} />
              ))}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="glass-refractive rounded-3xl p-6">
              <Search size={20} className="text-accent" aria-hidden />
              <h3 className="mt-5 text-2xl font-semibold leading-[1] tracking-tight">
                Find the right corner
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span key={category} className="rounded-full border border-line bg-surface-0/50 px-3 py-1.5 text-xs text-fg-muted">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-refractive rounded-3xl p-6">
              <Users size={20} className="text-accent" aria-hidden />
              <h3 className="mt-5 text-2xl font-semibold leading-[1] tracking-tight">
                Want to be part of it?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                Join the Creative Network so NAMI knows what you do, where you are based, and when to put your work forward.
              </p>
              <Link href="/network" className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent">
                Join the network
                <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-shell py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mono-label text-accent">Marketing notes</p>
            <h2 className="mt-3 text-4xl font-semibold leading-[0.96] tracking-tight md:text-5xl">
              Useful thinking for clearer work
            </h2>
            <div className="mt-8 grid gap-5">
              {marketingNotes.map((item) => (
                <StoryCard key={item.href} item={item} variant="compact" />
              ))}
            </div>
          </div>

          <div>
            <p className="mono-label text-accent">Opportunities</p>
            <h2 className="mt-3 text-4xl font-semibold leading-[0.96] tracking-tight md:text-5xl">
              Callouts, roundups and reasons to get involved
            </h2>
            <div className="mt-8 grid gap-5">
              {opportunities.map((item) => (
                <StoryCard key={item.href} item={item} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pb-20 md:pb-28">
        <div className="glass-refractive overflow-hidden rounded-3xl p-7 text-center md:p-12">
          <p className="mono-label text-accent">Build with NAMI</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-[0.94] tracking-tight md:text-6xl">
            A media hub for the network, with a clear path back to the work
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-fg-muted md:text-lg">
            The network brings attention to North East creativity. The main site shows how NAMI helps businesses make the brand, content, website, and buyer journey easier to act on.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/network" className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]">
              Join the network
              <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/contact" className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5">
              Talk about marketing work
              <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}