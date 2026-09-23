import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/icons/socials";
import {
  formatPostDate,
  getAllNetworkNews,
  getNetworkArticleBySlug,
  getNetworkArticleSlugs,
  networkNewsPublished,
  type NetworkNewsItem,
} from "@/lib/content/network-news";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import type { NetworkDirectoryMember } from "@/lib/content/network-directory";

export function generateStaticParams() {
  return networkNewsPublished ? getNetworkArticleSlugs().map((slug) => ({ slug })) : [];
}

type Props = { params: Promise<{ slug: string }> };

function externalHref(value: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNetworkArticleBySlug(slug);
  if (!article) return { title: "Network News" };
  return {
    title: `${article.title} | NAMI Creative Network News`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `https://namicreative.co.uk/network/news/${article.slug}`,
      images: [{ url: article.image ?? "/nami-og%20%281%29.png", alt: article.title }],
    },
    alternates: { canonical: `/network/news/${article.slug}` },
  };
}

function MemberPortrait({ member }: { member: NetworkDirectoryMember }) {
  if (member.profileImage) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2">
        <Image src={member.profileImage} alt={member.imageAlt ?? `${member.name} profile picture`} fill sizes="(min-width: 768px) 12rem, 35vw" className="object-cover grayscale transition duration-500 group-hover:grayscale-0" />
      </div>
    );
  }
  const initials = member.name.split(/\s|\//).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <div className="grid aspect-[4/5] w-full place-items-center bg-surface-2 text-3xl font-semibold text-accent">{initials}</div>;
}

function MemberFeature({ member, index, total }: { member: NetworkDirectoryMember; index: number; total: number }) {
  return (
    <section className="group grid gap-5 border-t border-line py-7 first:mt-10 md:grid-cols-[10rem_1fr] md:gap-7 md:py-9">
      <MemberPortrait member={member} />
      <div className="self-center">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.17em] text-accent">
          {total > 1 ? `${String(index + 1).padStart(2, "0")} / ${member.category}` : member.category}
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-[0.98] tracking-[-0.035em] md:text-3xl">{member.name}</h2>
        <p className="mt-2 inline-flex items-center gap-2 text-xs text-fg-subtle"><MapPin size={13} aria-hidden className="text-accent" />{member.location}</p>
        <p className="mt-4 max-w-xl leading-relaxed text-fg-muted">{member.description}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
          {member.instagramUrl && <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent"><InstagramIcon size={15} aria-hidden />Instagram</a>}
          {member.websiteUrl && <a href={externalHref(member.websiteUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent">Visit their work <ArrowUpRight size={14} aria-hidden /></a>}
        </div>
      </div>
    </section>
  );
}

function RelatedStory({ item }: { item: NetworkNewsItem }) {
  return (
    <article className="group border-t border-line pt-4">
      <Link href={item.href}>
        {item.image && <div className="relative aspect-[16/10] overflow-hidden bg-surface-2"><Image src={item.image} alt="" fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0" /></div>}
        <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">{item.category}</p>
        <h3 className="mt-2 text-xl font-semibold leading-[1.02] tracking-[-0.025em] transition-colors group-hover:text-accent md:text-2xl">{item.title}</h3>
      </Link>
    </article>
  );
}

function ArticleHero({ article, members }: { article: NetworkNewsItem; members: NetworkDirectoryMember[] }) {
  const submittedImages = members.filter((member) => member.profileImage).slice(0, 5);
  if (submittedImages.length > 0) {
    const desktopColumns = submittedImages.length >= 5 ? "md:grid-cols-5" : submittedImages.length === 4 ? "md:grid-cols-4" : submittedImages.length === 3 ? "md:grid-cols-3" : submittedImages.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1";
    return (
      <div className={`grid aspect-[16/7] min-h-72 grid-cols-2 gap-px overflow-hidden bg-line ${desktopColumns}`}>
        {submittedImages.map((member) => (
          <div key={member.id} className="relative min-h-full overflow-hidden bg-surface-2">
            <Image src={member.profileImage!} alt={`${member.name}, featured in ${article.title}`} fill priority sizes="(min-width: 768px) 20vw, 50vw" className="object-cover grayscale" />
          </div>
        ))}
      </div>
    );
  }
  if (!article.image) return null;
  return <div className="relative aspect-[16/7] min-h-72 overflow-hidden bg-surface-2"><Image src={article.image} alt="" fill priority sizes="100vw" className="object-cover grayscale" /></div>;
}

export default async function NetworkNewsArticlePage({ params }: Props) {
  if (!networkNewsPublished) notFound();
  const { slug } = await params;
  const article = getNetworkArticleBySlug(slug);
  if (!article) notFound();

  const [directory, allStories] = await Promise.all([getNetworkDirectoryMembers(), getAllNetworkNews()]);
  const memberMap = new Map(directory.map((member) => [member.id, member]));
  const featuredMembers = (article.memberIds ?? []).map((id) => memberMap.get(id)).filter((member): member is NetworkDirectoryMember => Boolean(member));
  const related = allStories.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <main className="bg-surface-0 pt-28 md:pt-32">
      <article>
        <header className="container-shell py-9 md:py-14">
          <Link href="/network/news" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-fg-muted hover:text-accent"><ArrowLeft size={14} aria-hidden className="transition-transform group-hover:-translate-x-1" />Back to news</Link>
          <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-14">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent">{article.category}</p>
              <h1 className="mt-4 max-w-5xl text-[clamp(2.35rem,5.1vw,4.65rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-balance">{article.title}</h1>
            </div>
            <div className="border-t border-line pt-5 lg:border-t-0 lg:border-l lg:pl-7">
              <p className="text-base leading-relaxed text-fg-muted">{article.summary}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-fg-subtle">
                <span className="inline-flex items-center gap-2"><Calendar size={13} aria-hidden /><time dateTime={article.date}>{formatPostDate(article.date)}</time></span>
                <span className="inline-flex items-center gap-2"><Clock size={13} aria-hidden />{article.minutes} min read</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container-shell"><ArticleHero article={article} members={featuredMembers} /></div>

        <div className="container-shell grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,46rem)_17rem] lg:justify-between lg:gap-16">
          <div>
            <div className="space-y-6 text-[1.05rem] leading-[1.8] text-fg-muted md:text-lg">
              {article.body?.map((paragraph, index) => <p key={paragraph} className={index === 0 ? "text-xl leading-[1.65] text-fg md:text-2xl" : undefined}>{paragraph}</p>)}
            </div>
            {featuredMembers.map((member, index) => <MemberFeature key={member.id} member={member} index={index} total={featuredMembers.length} />)}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            {featuredMembers.length > 0 && (
              <section>
                <p className="border-b border-line pb-3 text-[0.68rem] font-bold uppercase tracking-[0.17em] text-accent">In this story</p>
                <ol className="divide-y divide-line">
                  {featuredMembers.map((member, index) => <li key={member.id} className="grid grid-cols-[1.6rem_1fr] gap-2 py-3 text-sm"><span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span><span>{member.name}</span></li>)}
                </ol>
              </section>
            )}
            <section className="mt-10 border-y border-accent py-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.17em] text-accent">Know someone?</p>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">Send them the directory, or join the Network so NAMI knows what you are building.</p>
              <Link href="/network" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:text-accent">Join the Network <ArrowUpRight size={14} aria-hidden /></Link>
            </section>
          </aside>
        </div>
      </article>

      <section className="border-t border-line bg-surface-1/45">
        <div className="container-shell py-12 md:py-16">
          <div className="flex items-end justify-between gap-5 border-b-2 border-fg pb-3"><h2 className="text-3xl font-semibold tracking-[-0.035em]">Read next</h2><Link href="/network/news" className="text-xs font-bold uppercase tracking-[0.12em] text-fg-muted hover:text-accent">All stories</Link></div>
          <div className="mt-7 grid gap-8 md:grid-cols-3">{related.map((item) => <RelatedStory key={item.href} item={item} />)}</div>
        </div>
      </section>
    </main>
  );
}
