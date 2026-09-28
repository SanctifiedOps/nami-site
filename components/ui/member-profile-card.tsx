"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
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
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial="rest"
      whileHover={reduceMotion ? "rest" : "hover"}
      variants={{
        rest: { y: 0, scale: 1 },
        hover: { y: -5, scale: 1.012 },
      }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={cn("group relative aspect-[3/4] min-h-0 overflow-hidden rounded-2xl border border-accent/20 bg-[#111216] shadow-[0_18px_50px_rgba(0,0,0,.28)] sm:aspect-[4/5] sm:min-h-[22rem] sm:rounded-3xl", className)}
    >
      <Link
        href={`/network/directory/member/${id}`}
        onClick={onSelect}
        className="absolute inset-0 z-20 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset sm:rounded-3xl"
        aria-label={`View ${name}'s profile`}
      >
        <span className="sr-only">View {name}&apos;s profile</span>
      </Link>

      {image ? (
        <motion.img
          src={image}
          alt={imageAlt || `${name} profile picture`}
          className="absolute inset-0 h-full w-full object-cover object-center"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.055 } }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_70%_18%,rgba(255,0,188,.22),transparent_38%),linear-gradient(145deg,#18131a,#0b0c0f_68%)]">
          <span className="text-7xl font-semibold tracking-[-0.08em] text-accent/65">{initials(name)}</span>
        </div>
      )}

      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,7,.99)_0%,rgba(7,7,10,.9)_34%,rgba(7,7,10,.28)_67%,transparent_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_18%_100%,rgba(255,0,188,.22),transparent_58%)] opacity-75 transition-opacity duration-500 group-hover:opacity-100" />
      <div aria-hidden className="absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-accent/55" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 sm:p-6">
        <p className="hidden max-w-full truncate rounded-full border border-accent/35 bg-black/50 px-3 py-1.5 text-[11px] font-medium text-white/85 backdrop-blur-md sm:inline-flex">
          {speciality}
        </p>
        <h2 className="mt-2 line-clamp-2 text-lg font-semibold leading-[0.98] tracking-tight text-white sm:mt-3 sm:text-[1.7rem]">{name}</h2>
        <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-white/72 sm:mt-3 sm:line-clamp-3 sm:text-sm sm:leading-5">{description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-[11px] font-semibold text-white shadow-[0_6px_24px_rgba(255,0,188,.22)] transition-colors group-hover:bg-accent-soft sm:mt-5 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm">
          View profile
          <ArrowUpRight size={12} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-3.5" />
        </span>
      </div>
    </motion.article>
  );
}
