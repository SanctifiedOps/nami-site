import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <section className="container-shell pb-12 pt-32 md:pb-16 md:pt-40">
      <Link href="/network/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted hover:text-accent"><ArrowLeft size={16} aria-hidden /> Back to the directory</Link>
      <p className="mono-label mt-12 text-accent">NAMI Creative Network directory</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">Everyone in the Network</h1>
      <p className="mt-5 max-w-2xl text-lg text-fg-muted">Search the full directory by name, work or place.</p>
    </section>
    <section className="container-shell pb-20 md:pb-28"><DirectoryBrowser key={area ?? "all"} members={members} initialLocation={area} /></section>
  </>;
}
