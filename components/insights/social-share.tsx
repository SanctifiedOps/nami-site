"use client";

import { useState } from "react";
import { Mail, Link as LinkIcon, Check } from "lucide-react";
import { LinkedinIcon, XIcon } from "@/components/icons/socials";

// Always share the canonical production URL, even when this component
// renders on localhost. Readers should land on namicreative.co.uk, not
// the dev server.
const SITE_URL = "https://namicreative.co.uk";

type Props = {
  slug: string;
  title: string;
};

export function SocialShare({ slug, title }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/insights/${slug}`;

  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail on insecure contexts or unsupported
      // browsers. Fallback: prompt the user to copy manually.
      window.prompt("Copy this link:", url);
    }
  };

  const pillClass =
    "inline-flex items-center gap-2 rounded-full border border-line bg-surface-1/40 px-4 py-2 text-sm text-fg-muted transition-colors hover:border-accent/40 hover:bg-surface-1 hover:text-accent";

  return (
    <div className="not-prose mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-8 md:mt-16">
      <span className="eyebrow mr-1 text-accent/80">Share this piece</span>

      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={pillClass}
      >
        <LinkedinIcon size={14} />
        LinkedIn
      </a>

      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={pillClass}
      >
        <XIcon size={14} />X
      </a>

      <a href={emailHref} aria-label="Share via email" className={pillClass}>
        <Mail size={14} />
        Email
      </a>

      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link to clipboard"}
        className={pillClass}
      >
        {copied ? <Check size={14} /> : <LinkIcon size={14} />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
