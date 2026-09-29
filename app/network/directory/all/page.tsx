import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import { DirectoryBrowser } from "../directory-browser";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All North East Creative Network Members | NAMI Creative",
  description: "Search every member of the NAMI Creative Network by name, work or place.",
  alternates: { canonical: "/network/directory/all" },
};

export default async function AllDirectoryMembersPage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  const { area } = await searchParams;
  const members = (await getNetworkDirectoryMembers()).sort((a, b) => a.name.localeCompare(b.name));
  return <>
    <section className="relative isolate overflow-hidden">
      <ParallaxBackdrop src="/images/north-east/6.jpg" overlay={0.78} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent via-surface-0/70 to-surface-0" />
      <div className="container-shell relative pb-24 pt-32 text-center md:pb-32 md:pt-40 md:text-left">
        <Link href="/network/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted hover:text-accent"><ArrowLeft size={16} aria-hidden /> Back to the directory</Link>
        <p className="mono-label mt-12 text-accent">NAMI Creative Network directory</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">Everyone in the Network</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-fg-muted md:mx-0">Search the full directory by name, work or place.</p>
      </div>
    </section>
    <section className="container-shell pb-20 md:pb-28"><DirectoryBrowser key={area ?? "all"} members={members} initialLocation={area} /></section>
  </>;
}
