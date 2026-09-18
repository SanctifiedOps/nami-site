import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import { directoryGroups, membersInGroup } from "@/lib/content/network-directory-groups";
import { DirectoryBrowser } from "../directory-browser";

export const revalidate = 3600;

const northEastHeroImages = [
  "/images/north-east/1.jpg",
  "/images/north-east/2.jpg",
  "/images/north-east/3.jpg",
  "/images/north-east/4.jpg",
  "/images/north-east/5.jpg",
  "/images/north-east/6.jpg",
  "/images/north-east/7.jpg",
] as const;

export function generateStaticParams() {
  return directoryGroups.map((group) => ({ category: group.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const group = directoryGroups.find((item) => item.slug === category);
  if (!group) return {};
  const title = `${group.title} in the North East | NAMI`;
  const description = group.description;
  const url = `https://namicreative.co.uk/network/directory/${group.slug}`;
  return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

export default async function DirectoryCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const group = directoryGroups.find((item) => item.slug === category);
  if (!group) notFound();

  const members = membersInGroup(await getNetworkDirectoryMembers(), group.slug).sort((a, b) => a.name.localeCompare(b.name));
  if (members.length === 0) notFound();
  const groupIndex = directoryGroups.findIndex((item) => item.slug === group.slug);
  const heroImage = northEastHeroImages[groupIndex % northEastHeroImages.length];

  return <>
    <section className="relative isolate overflow-hidden">
      <ParallaxBackdrop src={heroImage} overlay={0.78} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent via-surface-0/70 to-surface-0" />
      <div className="container-shell relative pb-24 pt-32 md:pb-32 md:pt-40">
        <Link href="/network/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted hover:text-accent"><ArrowLeft size={16} aria-hidden /> Back to the directory</Link>
        <p className="mono-label mt-12 text-accent">NAMI Creative Network directory</p>
        <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">{group.title} <span className="text-accent">in the North East</span></h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">{group.description}</p>
        <p className="mt-5 text-sm text-fg-subtle">{members.length} {members.length === 1 ? "member" : "members"} in this group</p>
      </div>
    </section>
    <section className="container-shell pb-20 md:pb-28">
      <DirectoryBrowser members={members} hideCategoryFilter />
    </section>
    <section className="border-t border-line bg-surface-1/35 py-14">
      <div className="container-shell">
        <h2 className="text-2xl font-semibold">Explore more of the Network</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {directoryGroups.filter((item) => item.slug !== group.slug).map((item) => <Link key={item.slug} href={`/network/directory/${item.slug}`} className="rounded-full border border-line px-4 py-2 text-sm text-fg-muted hover:border-accent hover:text-accent">{item.label}</Link>)}
        </div>
      </div>
    </section>
  </>;
}
