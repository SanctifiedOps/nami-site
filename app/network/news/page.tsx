import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  formatPostDate,
  getAllNetworkNews,
  getNetworkCategories,
  networkNewsPublished,
  type NetworkNewsItem,
} from "@/lib/content/network-news";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import type { NetworkDirectoryMember } from "@/lib/content/network-directory";
import { cn } from "@/lib/utils";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { HeroLights } from "@/components/hero/hero-lights";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type MemberMap = Map<string, NetworkDirectoryMember>;

export const metadata: Metadata = {
  title: "News | NAMI Creative Network",
  description: "North East creative news, NAMI Creative Network spotlights, interviews, opportunities, and useful notes.",
  openGraph: {
    title: "News | NAMI Creative Network",
    description: "People, projects and useful ideas from the North East creative community.",
    url: "https://namicreative.co.uk/network/news",
    images: [{ url: "/nami-og%20%281%29.png", width: 2800, height: 1750, alt: "NAMI Creative Network news" }],
  },
  alternates: { canonical: "/network/news" },
};

function ArticleMeta({ item, className }: { item: NetworkNewsItem; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 text-[0.68rem] text-fg-subtle", className)}>
      <span className="font-bold uppercase tracking-[0.16em] text-accent">{item.category}</span>
      <span aria-hidden className="text-line-strong">/</span>
      <time dateTime={item.date}>{formatPostDate(item.date)}</time>
      <span aria-hidden className="text-line-strong">/</span>
      <span>{item.minutes} min</span>
    </div>
  );
}

function StoryImage({ item, members, className, priority = false }: { item: NetworkNewsItem; members: MemberMap; className?: string; priority?: boolean }) {
  const submittedImages = (item.memberIds ?? []).map((id) => members.get(id)).filter((member) => member?.profileImage).slice(0, priority ? 3 : 1);
  const images = submittedImages.length > 0 ? submittedImages.map((member) => ({ src: member!.profileImage!, alt: `${member!.name}, featured in ${item.title}` })) : item.image ? [{ src: item.image, alt: "" }] : [];
  if (images.length === 0) return <div className={cn("bg-surface-2", className)} />;
  return (
    <div className={cn("relative grid overflow-hidden bg-surface-2", images.length > 1 && "grid-cols-3 gap-px bg-line", className)}>
      {images.map((image, index) => <div key={image.src} className="relative min-h-full overflow-hidden bg-surface-2"><Image src={image.src} alt={image.alt} fill priority={priority && index === 0} sizes={priority ? "(min-width: 1024px) 22vw, 34vw" : "(min-width: 1024px) 32vw, 100vw"} className="object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.025] group-hover:grayscale-0" /></div>)}
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
    </div>
  );
}

function LeadStory({ item, members }: { item: NetworkNewsItem; members: MemberMap }) {
  return (
    <article className="group border-b border-line pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
      <Link href={item.href} className="block">
        <StoryImage item={item} members={members} priority className="aspect-[16/9]" />
        <ArticleMeta item={item} className="mt-5" />
        <h2 className="mt-3 max-w-4xl text-[clamp(2rem,4.2vw,4.25rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-balance transition-colors group-hover:text-accent">{item.title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">{item.summary}</p>
      </Link>
    </article>
  );
}

function SideStory({ item, members }: { item: NetworkNewsItem; members: MemberMap }) {
  return (
    <article className="group border-b border-line pb-6 last:border-b-0 last:pb-0">
      <Link href={item.href} className="grid gap-4 sm:grid-cols-[8.5rem_1fr] lg:block">
        <StoryImage item={item} members={members} className="aspect-[4/3] lg:aspect-[16/8]" />
        <div className="lg:pt-4">
          <ArticleMeta item={item} />
          <h2 className="mt-2 text-xl font-semibold leading-[1.02] tracking-[-0.025em] text-balance transition-colors group-hover:text-accent md:text-2xl">{item.title}</h2>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg-muted">{item.summary}</p>
        </div>
      </Link>
    </article>
  );
}

function FeatureStory({ item, index, members }: { item: NetworkNewsItem; index: number; members: MemberMap }) {
  const wide = index === 0;
  return (
    <article className={cn("group border-t border-line pt-5", wide && "md:col-span-2")}>
      <Link href={item.href} className={cn("grid gap-5", wide && "md:grid-cols-[1.15fr_0.85fr]")}>
        <StoryImage item={item} members={members} className={wide ? "aspect-[16/9]" : "aspect-[4/3]"} />
        <div className={cn(wide && "md:self-end md:pb-2")}>
          <ArticleMeta item={item} />
          <h2 className={cn("mt-3 font-semibold leading-[0.98] tracking-[-0.035em] text-balance transition-colors group-hover:text-accent", wide ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl")}>{item.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted md:text-base">{item.summary}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-fg group-hover:text-accent">Read story <ArrowUpRight size={13} aria-hidden /></span>
        </div>
      </Link>
    </article>
  );
}

function LatestStory({ item, number, members }: { item: NetworkNewsItem; number: number; members: MemberMap }) {
  return (
    <article className="group border-t border-line py-6 first:border-t-0 first:pt-0">
      <Link href={item.href} className="grid grid-cols-[2rem_1fr] gap-4 sm:grid-cols-[2.5rem_9rem_1fr] sm:items-start">
        <span className="pt-0.5 font-mono text-xs text-fg-subtle">{String(number).padStart(2, "0")}</span>
        <StoryImage item={item} members={members} className="hidden aspect-[4/3] sm:block" />
        <div>
          <ArticleMeta item={item} />
          <h3 className="mt-2 text-xl font-semibold leading-[1.02] tracking-[-0.025em] text-balance transition-colors group-hover:text-accent md:text-2xl">{item.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">{item.summary}</p>
        </div>
      </Link>
    </article>
  );
}

export default async function NetworkNewsPage() {
  if (!networkNewsPublished) notFound();
  const [items, directory] = await Promise.all([getAllNetworkNews(), getNetworkDirectoryMembers()]);
  const members = new Map(directory.map((member) => [member.id, member]));
  const categories = getNetworkCategories(items);
  const lead = items.find((item) => item.featured && item.source === "network") ?? items[0];
  const rest = items.filter((item) => item.slug !== lead?.slug);
  const sideStories = rest.slice(0, 2);
  const features = rest.slice(2, 5);
  const latest = rest.slice(5, 12);
  const marketingNotes = items.filter((item) => item.category === "Marketing Notes").slice(0, 3);

  return (
    <main className="bg-surface-0">
      <header className="relative isolate overflow-hidden border-b border-line pt-28 md:pt-32">
        <ParallaxBackdrop src="/images/north-east/7.jpg" overlay={0.76} />
        <HeroLights />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-b from-transparent to-surface-0" />
        <div className="container-shell relative z-10 py-12 md:py-20">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">NAMI Creative Network</p>
              <h1 className="type-page-title mt-2">News</h1>
            </div>
            <p className="hidden max-w-md pb-1 text-right text-sm leading-relaxed text-fg-muted md:block">People, projects and useful ideas from across the North East creative community.</p>
          </div>
        </div>
        <div className="relative z-10 border-t border-line bg-surface-0/55 backdrop-blur">
          <div className="container-shell flex gap-6 overflow-x-auto py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-fg-muted">
            <span className="shrink-0 text-accent">Latest</span>
            {categories.map((category) => <span key={category} className="shrink-0">{category}</span>)}
          </div>
        </div>
      </header>

      <ScrollReveal><section className="container-shell py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,0.78fr)]">
          {lead && <LeadStory item={lead} members={members} />}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">{sideStories.map((item) => <SideStory key={item.href} item={item} members={members} />)}</div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal><section className="border-y border-line bg-surface-1/45">
        <div className="container-shell py-10 md:py-14">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-4">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">From the Network</h2>
            <Link href="/network/directory" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-fg-muted hover:text-accent">Browse directory <ArrowRight size={13} aria-hidden className="transition-transform group-hover:translate-x-1" /></Link>
          </div>
          <div className="grid gap-x-7 gap-y-10 md:grid-cols-2 xl:grid-cols-4">{features.map((item, index) => <FeatureStory key={item.href} item={item} index={index} members={members} />)}</div>
        </div>
      </section></ScrollReveal>

      <ScrollReveal><section className="container-shell grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
        <div>
          <div className="mb-6 border-b-2 border-fg pb-3"><h2 className="text-3xl font-semibold tracking-[-0.035em]">Latest stories</h2></div>
          {latest.map((item, index) => <LatestStory key={item.href} item={item} number={index + 1} members={members} />)}
        </div>
        <aside className="space-y-10 lg:border-l lg:border-line lg:pl-8">
          <section>
            <p className="border-b border-line pb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Browse by section</p>
            <div className="divide-y divide-line">{categories.map((category) => <p key={category} className="py-3 text-sm text-fg-muted">{category}</p>)}</div>
          </section>
          <section className="border-y border-accent py-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Join the Network</p>
            <h2 className="mt-3 text-2xl font-semibold leading-[1] tracking-[-0.03em]">Put your work where people can find it.</h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">Join for future features, roundups and opportunities across the region.</p>
            <Link href="/network" className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent">Join the Network <ArrowUpRight size={14} aria-hidden /></Link>
          </section>
        </aside>
      </section></ScrollReveal>

      {marketingNotes.length > 0 && (
        <section className="border-t border-line bg-accent text-white">
          <div className="container-shell py-12 md:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Useful thinking</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <h2 className="text-4xl font-semibold leading-[0.92] tracking-[-0.045em] md:text-6xl">Notes for making the work work.</h2>
              <div className="divide-y divide-white/25 border-y border-white/25">
                {marketingNotes.map((item) => (
                  <Link key={item.href} href={item.href} className="group grid gap-2 py-5 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
                    <time dateTime={item.date} className="text-xs text-white/70">{formatPostDate(item.date)}</time>
                    <h3 className="text-lg font-semibold leading-tight md:text-xl">{item.title}</h3>
                    <ArrowUpRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
