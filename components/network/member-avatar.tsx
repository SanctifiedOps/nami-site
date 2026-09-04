"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function initials(name: string) {
  const personName = name.split("/")[0]?.trim() ?? name;
  const words = personName.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "NC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words.at(-1)?.[0] ?? ""}`.toUpperCase();
}

function displaySrc(src?: string) {
  if (!src) return undefined;
  try {
    const url = new URL(src);
    if (url.hostname === "drive.google.com") {
      const id = url.searchParams.get("id");
      if (id) return `/api/network/profile-image/${encodeURIComponent(id)}`;
    }
  } catch {
    return src;
  }
  return src;
}

export function MemberAvatar({
  name,
  src,
  alt,
  featured = false,
}: {
  name: string;
  src?: string;
  alt?: string;
  featured?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const size = featured ? "size-20 text-2xl" : "size-12 text-sm";
  const resolvedSrc = displaySrc(src);
  const showImage = Boolean(resolvedSrc && !failed);
  const isProxiedImage = resolvedSrc?.startsWith("/api/network/profile-image/") ?? false;

  useEffect(() => setFailed(false), [src]);

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-accent/30 bg-accent/10 font-semibold tracking-wide text-accent",
        size,
      )}
    >
      {showImage ? (
        <Image
          src={resolvedSrc!}
          alt={alt || `${name} profile picture`}
          fill
          unoptimized={isProxiedImage}
          sizes={featured ? "80px" : "48px"}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
      {!showImage && <span className="sr-only">{name}</span>}
    </span>
  );
}
