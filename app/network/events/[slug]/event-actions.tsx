"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

export function EventActions({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/network/events/${slug}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <>
    <button data-event-action="share" type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold text-white hover:border-accent hover:text-accent">{copied?<Check size={15}/>:<Link2 size={15}/>} {copied?"Link copied":"Copy link"}</button>
  </>;
}
