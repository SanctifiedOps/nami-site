"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";
import type { NetworkDirectoryMember } from "@/lib/content/network-directory";
import { DirectoryMemberCard } from "./directory-browser";

export function MemberDiscovery({ members, initialIndex }: { members: NetworkDirectoryMember[]; initialIndex: number }) {
  const [index, setIndex] = useState(initialIndex);
  if (members.length === 0) return null;

  function pickAnother() {
    if (members.length < 2) return;
    const next = Math.floor(Math.random() * (members.length - 1));
    setIndex(next >= index ? next + 1 : next);
  }

  return <div className="grid gap-8 rounded-3xl border border-accent/25 bg-surface-1 p-6 md:grid-cols-[0.8fr_1.2fr] md:items-center md:p-10">
    <div>
      <p className="mono-label text-accent">A little introduction</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Meet someone new</h2>
      <p className="mt-4 max-w-md leading-relaxed text-fg-muted">There’s a lot of good work happening around here. Find someone you might not have come across yet.</p>
      <button type="button" onClick={pickAnother} className="mt-7 inline-flex items-center gap-2 rounded-full border border-accent px-5 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white">
        <Shuffle size={16} aria-hidden /> Show me someone else
      </button>
    </div>
    <DirectoryMemberCard member={members[index]} />
  </div>;
}
