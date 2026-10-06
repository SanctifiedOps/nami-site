"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const words = (name.split("/")[0] ?? name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "NC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export function MemberProfileCard({
  id,
  name,
  description,
  speciality,
  image,
  imageAlt,
  className,
  onSelect,
}: {
  id: string;
  name: string;
  description: string;
  speciality: string;
  image?: string;
  imageAlt?: string;
  className?: string;
  onSelect?: () => void;
}) {
  return (
    <article className={cn("group min-w-0", className)}>
      <Link
        href={`/network/directory/member/${id}`}
        onClick={onSelect}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`View ${name}'s profile`}
      >
        <div className="relative aspect-[4/5] overflow-hidden border border-line bg-surface-2">
          {image ? (
            <img
              src={image}
              alt={imageAlt || `${name} profile picture`}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-surface-1">
              <span className="text-5xl font-semibold tracking-[-0.06em] text-accent/70">{initials(name)}</span>
            </div>
          )}
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/72 via-transparent to-transparent" />
          <p className="absolute inset-x-4 bottom-4 text-xs font-semibold text-white/85 sm:inset-x-5 sm:bottom-5 sm:text-sm">
            {speciality}
          </p>
        </div>

        <div className="border-b border-line py-4 sm:py-5">
          <h2 className="line-clamp-2 text-lg font-semibold leading-tight tracking-[-0.02em] text-fg sm:text-2xl">{name}</h2>
          <p className="mt-2 line-clamp-2 text-xs leading-[1.45] text-fg-muted sm:text-sm">{description}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-fg transition-colors group-hover:text-accent sm:text-sm">
            View profile <ArrowUpRight size={13} aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
