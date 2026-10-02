import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  Images,
  MapPin,
  UserRound,
  Users,
} from "lucide-react";
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

function FeatureStory({ item, members }: { item: NetworkNewsItem; members: MemberMap }) {
  return (
    <article className="group h-full border-t border-line pt-5">
      <Link href={item.href} className="flex h-full flex-col">
        <StoryImage item={item} members={members} className="aspect-[4/3] w-full" />
        <div className="flex flex-1 flex-col pt-5">
          <ArticleMeta item={item} />
          <h2 className="mt-3 text-2xl font-semibold leading-[1.02] tracking-[-0.035em] text-balance transition-colors group-hover:text-accent md:text-3xl">{item.title}</h2>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-fg-muted md:text-base">{item.summary}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-bold uppercase tracking-[0.14em] text-fg group-hover:text-accent">Read story <ArrowUpRight size={13} aria-hidden /></span>
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

async function NetworkNewsContent({ previewMode = false }: { previewMode?: boolean }) {
  if (!previewMode && !networkNewsPublished) notFound();
  const [publishedItems, directory] = await Promise.all([getAllNetworkNews(), getNetworkDirectoryMembers()]);
  const previewContribution: NetworkNewsItem = {
    slug: "member-article-preview",
    title: "What painting a studio wall taught me about working in public",
    summary:
      "Mara Bell shares what changed when she made a twelve-metre mural while the building stayed open.",
    kicker: "Member voice",
    category: "Member Stories",
    date: "2026-10-01",
    minutes: 4,
    href: "/network/news/preview/member-article",
    image: "/network-news/studio-detail.webp",
    source: "network",
    featured: true,
  };
  const items = previewMode ? [previewContribution, ...publishedItems] : publishedItems;
  const members = new Map(directory.map((member) => [member.id, member]));
  const featuredMember = directory.find((member) => member.featured) ?? directory[0];
  const categories = getNetworkCategories(items);
  const lead = items.find((item) => item.featured && item.source === "network") ?? items[0];
  const rest = items.filter((item) => item.slug !== lead?.slug);
  const sideStories = rest.slice(0, 2);
  const features = rest.slice(2, 5);
  const latest = rest.slice(5, 12);
  const marketingNotes = items.filter((item) => item.category === "Marketing Notes").slice(0, 3);

  return (
    <main className="bg-surface-0">
      {previewMode && (
        <div className="fixed inset-x-0 top-20 z-40 mx-auto w-fit rounded-full border border-accent/40 bg-surface-0/95 px-4 py-2 text-xs font-semibold text-fg shadow-xl backdrop-blur">
          Local Network hub preview
        </div>
      )}
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
        <nav aria-label="News sections" className="relative z-10 border-y border-accent/25 bg-surface-1/90 shadow-[0_14px_40px_rgb(0_0_0/0.2)] backdrop-blur-md">
          <div className="container-shell flex flex-col items-center gap-4 py-5 md:flex-row md:justify-between">
            <p className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-fg">Browse stories</p>
            <div className="flex flex-wrap justify-center gap-2 md:justify-end">
              <span className="rounded-full bg-accent px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-white">Latest</span>
              {categories.map((category) => <span key={category} className="rounded-full border border-line-strong bg-surface-0/60 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-fg-muted">{category}</span>)}
            </div>
          </div>
        </nav>
      </header>

      <ScrollReveal><section className="container-shell py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,0.78fr)]">
          {lead && <LeadStory item={lead} members={members} />}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">{sideStories.map((item) => <SideStory key={item.href} item={item} members={members} />)}</div>
        </div>
      </section></ScrollReveal>

      {featuredMember && (
        <ScrollReveal>
          <section className="border-y border-line bg-surface-1/45">
            <div className="container-shell grid gap-8 py-10 md:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] md:items-center md:gap-12 md:py-14 lg:grid-cols-[23rem_minmax(0,1fr)] lg:gap-16">
              <Link href={`/network/directory/member/${featuredMember.id}`} className="group relative aspect-[4/3] overflow-hidden bg-surface-2">
                {featuredMember.profileImage ? (
                  <Image
                    src={featuredMember.profileImage}
                    alt={featuredMember.imageAlt ?? `${featuredMember.name} profile picture`}
                    fill
                    sizes="(min-width: 1024px) 23rem, (min-width: 768px) 38vw, 100vw"
                    className="object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.025] group-hover:grayscale-0"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-5xl font-semibold text-accent">
                    {featuredMember.name.split(/\s|\//).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                  </div>
                )}
              </Link>
              <div className="text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Featured member</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-fg-subtle md:justify-start">
                  <span className="font-bold uppercase tracking-[0.12em] text-fg-muted">{featuredMember.category}</span>
                  <span className="inline-flex items-center gap-2"><MapPin size={13} className="text-accent" aria-hidden />{featuredMember.location}</span>
                </div>
                <h2 className="mt-4 text-4xl font-semibold leading-[0.94] tracking-[-0.045em] md:text-6xl">{featuredMember.name}</h2>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-fg-muted md:mx-0 md:text-lg">{featuredMember.description}</p>
                <Link href={`/network/directory/member/${featuredMember.id}`} className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors hover:text-accent">
                  View member profile
                  <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal><section className="border-y border-line bg-surface-1/45">
        <div className="container-shell py-10 md:py-14">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-4">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">From the Network</h2>
            <Link href="/network/directory" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-fg-muted hover:text-accent">Browse directory <ArrowRight size={13} aria-hidden className="transition-transform group-hover:translate-x-1" /></Link>
          </div>
          <div className="grid items-stretch gap-x-7 gap-y-10 md:grid-cols-2 xl:grid-cols-3">{features.map((item) => <FeatureStory key={item.href} item={item} members={members} />)}</div>
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
        </aside>
      </section></ScrollReveal>

      <ScrollReveal>
        <section id="join-network-cta" className="scroll-mt-24 bg-surface-0 py-12 md:py-16">
          <div className="container-shell">
            <div className="grid overflow-hidden border border-line bg-surface-1/45 lg:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col justify-center bg-accent/[0.045] px-7 py-10 text-center sm:px-10 md:py-14 lg:border-r lg:border-accent/20 lg:px-12 lg:text-left">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent"><Users size={15} aria-hidden />Join the Network</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[0.94] tracking-[-0.045em] md:text-5xl xl:text-6xl">Make your work easier to find</h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-fg-muted lg:mx-0">Create a free profile, add your work and contribute to the stories and events shared across the Network.</p>
              <Link href="/network#join-network" className="group mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-soft hover:shadow-[0_12px_36px_rgb(255_0_188/0.24)]">
                Join the Network
                <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="grid border-l border-t border-line sm:grid-cols-2 lg:border-l-0 lg:border-t-0">
              {[
                { icon: UserRound, label: "Your profile", text: "A public page for who you are, what you do and where to find you." },
                { icon: Images, label: "Your work", text: "Add portfolio pieces and send people straight to the projects behind them." },
                { icon: BookOpenText, label: "Your stories", text: "Contribute articles in your own words, with NAMI approval before publication." },
                { icon: CalendarDays, label: "Your events", text: "Share exhibitions, workshops, meetups and other things worth showing up for." },
              ].map(({ icon: Icon, label, text }) => (
                <div key={label} className="border-b border-r border-line bg-surface-0/55 p-6 text-center transition-colors hover:bg-accent/[0.035] sm:min-h-48 sm:p-7 sm:text-left">
                  <Icon size={20} className="mx-auto text-accent sm:mx-0" aria-hidden />
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.025em]">{label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{text}</p>
                </div>
              ))}
            </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {marketingNotes.length > 0 && (
        <section id="useful-thinking" className="scroll-mt-24 border-b border-line bg-surface-0 py-12 md:py-16">
          <div className="container-shell">
            <div className="grid overflow-hidden border border-line lg:grid-cols-[0.72fr_1.28fr]">
              <div className="flex min-h-80 flex-col justify-between bg-accent p-8 text-white md:p-10 lg:min-h-[30rem] lg:p-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Useful thinking</p>
                  <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[0.92] tracking-[-0.045em] md:text-6xl">Notes for making the work work</h2>
                </div>
                <p className="mt-10 max-w-md text-sm leading-relaxed text-white/80 md:text-base">Plain-speaking ideas about sharing creative work, finding the right people and building something that lasts beyond the feed.</p>
              </div>

              <div className="divide-y divide-line bg-surface-1/55">
                {marketingNotes.map((item, index) => (
                  <Link key={item.href} href={item.href} className="group grid h-full gap-6 p-6 sm:grid-cols-[minmax(12rem,0.86fr)_minmax(0,1.14fr)] sm:items-center md:p-8 lg:p-10">
                    <StoryImage item={item} members={members} className="aspect-[4/3] w-full" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[0.68rem] text-fg-subtle">
                        <span className="font-bold uppercase tracking-[0.16em] text-accent">{String(index + 1).padStart(2, "0")} / {item.category}</span>
                        <span aria-hidden>/</span>
                        <time dateTime={item.date}>{formatPostDate(item.date)}</time>
                      </div>
                      <h3 className="mt-4 text-3xl font-semibold leading-[0.96] tracking-[-0.04em] transition-colors group-hover:text-accent md:text-5xl">{item.title}</h3>
                      <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg-muted md:text-base">{item.summary}</p>
                      <span className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-fg transition-colors group-hover:text-accent">Read the note <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                    </div>
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

export default async function NetworkNewsPage() {
  return <NetworkNewsContent previewMode={process.env.NODE_ENV === "development"} />;
}
