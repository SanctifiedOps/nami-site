"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin, Search, X } from "lucide-react";
import { InstagramIcon } from "@/components/icons/socials";
import { MemberAvatar } from "@/components/network/member-avatar";
import type { NetworkDirectoryMember } from "@/lib/content/network-directory";

type Props = {
  members: NetworkDirectoryMember[];
};

const locationGroups = [
  "Newcastle",
  "Gateshead",
  "Sunderland",
  "County Durham",
  "Northumberland",
  "North Tyneside",
  "South Tyneside",
  "Teesside",
  "Darlington",
  "Hartlepool",
  "Elsewhere",
] as const;

const categoryGroups = [
  "Artists and illustrators",
  "Photography and film",
  "Design and digital",
  "Music and audio",
  "Performance",
  "Creative services",
  "Independent businesses",
  "Community and events",
  "Other",
] as const;

function categoryGroup(category: string): (typeof categoryGroups)[number] {
  const value = category.toLowerCase();
  if (value.includes("artist") || value.includes("illustrat") || value.includes("calligraph") || value.includes("miniature")) return "Artists and illustrators";
  if (value.includes("photograph") || value.includes("film") || value.includes("video")) return "Photography and film";
  if (value.includes("design") || value.includes("architect") || value.includes("animation") || value.includes("digital")) return "Design and digital";
  if (value.includes("music") || value.includes("recording") || value.includes("audio")) return "Music and audio";
  if (value.includes("dance") || value.includes("perform")) return "Performance";
  if (value.includes("content") || value.includes("journalist") || value.includes("storyteller") || value === "creative") return "Creative services";
  if (value.includes("business") || value === "brand") return "Independent businesses";
  if (value.includes("community") || value.includes("event")) return "Community and events";
  return "Other";
}

function locationGroup(location: string): (typeof locationGroups)[number] {
  const value = location.toLowerCase();
  if (value.includes("newcastle") || value.includes("ouseburn")) return "Newcastle";
  if (value.includes("gateshead") || value.includes("chopwell")) return "Gateshead";
  if (value.includes("sunderland")) return "Sunderland";
  if (value.includes("durham") || value.includes("bishop auckland") || value.includes("chester-le-street")) return "County Durham";
  if (value.includes("northumberland") || value.includes("hexham") || value.includes("blyth") || value.includes("corbridge")) return "Northumberland";
  if (value.includes("north shields") || value.includes("tynemouth") || value.includes("wallsend") || value.includes("whitley bay") || value.includes("north tyneside")) return "North Tyneside";
  if (value.includes("south shields") || value.includes("south tyneside") || value.includes("jarrow")) return "South Tyneside";
  if (value.includes("teesside") || value.includes("stockton") || value.includes("middlesbrough")) return "Teesside";
  if (value.includes("darlington")) return "Darlington";
  if (value.includes("hartlepool")) return "Hartlepool";
  return "Elsewhere";
}

function normalise(value: string) {
  return value.toLowerCase().replace(/^@/, "").trim();
}

export function DirectoryBrowser({ members }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [location, setLocation] = useState("All areas");

  const categories = useMemo(
    () => categoryGroups.filter((group) => members.some((member) => categoryGroup(member.category) === group)),
    [members],
  );

  const availableLocations = useMemo(
    () => locationGroups.filter((group) => members.some((member) => locationGroup(member.location) === group)),
    [members],
  );

  const filtered = useMemo(() => {
    const search = normalise(query);
    return members.filter((member) => {
      const matchesQuery =
        !search ||
        [member.name, member.category, member.location, member.instagram, member.description]
          .map(normalise)
          .some((value) => value.includes(search));
      const matchesCategory = category === "All categories" || categoryGroup(member.category) === category;
      const matchesLocation = location === "All areas" || locationGroup(member.location) === location;
      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [category, location, members, query]);

  const hasFilters = Boolean(query || category !== "All categories" || location !== "All areas");

  const resetFilters = () => {
    setQuery("");
    setCategory("All categories");
    setLocation("All areas");
  };

  return (
    <div>
      <div className="glass-refractive rounded-3xl p-5 md:p-7">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem_15rem]">
          <label className="relative block">
            <span className="sr-only">Search the directory</span>
            <Search
              size={18}
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, work or city"
              className="w-full rounded-xl border border-line bg-surface-0/65 py-4 pl-12 pr-4 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent focus:ring-4 focus:ring-accent/10"
            />
          </label>

          <FilterSelect label="Filter by category" value={category} onChange={setCategory}>
            <option>All categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>

          <FilterSelect label="Filter by area" value={location} onChange={setLocation}>
            <option>All areas</option>
            {availableLocations.map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-fg-muted">
          Showing <span className="font-semibold text-fg">{filtered.length}</span> {filtered.length === 1 ? "member" : "members"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition-colors hover:text-accent"
          >
            <X size={15} aria-hidden />
            Clear filters
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => <MemberCard key={member.id} member={member} />)}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-line bg-surface-1/40 px-6 py-16 text-center">
          <p className="text-2xl font-semibold tracking-tight">No members match those filters</p>
          <p className="mx-auto mt-3 max-w-lg text-fg-muted">Try another category, area or search term.</p>
          <button type="button" onClick={resetFilters} className="mt-6 text-sm font-semibold text-accent hover:text-accent-soft">
            Show everyone
          </button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-line bg-surface-0/65 px-4 py-4 text-sm text-fg outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/10"
      >
        {children}
      </select>
    </label>
  );
}

function MemberCard({ member }: { member: NetworkDirectoryMember }) {
  return (
    <article className="group relative flex min-h-72 flex-col overflow-hidden rounded-3xl border border-line bg-surface-1/55 p-6 transition-colors hover:border-accent/45 md:p-7">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <MemberAvatar
          name={member.name}
          src={member.profileImage}
          alt={member.imageAlt}
        />
        <span className="rounded-full border border-line bg-surface-0/55 px-3 py-1.5 text-xs font-medium text-fg-muted">
          {member.category}
        </span>
      </div>

      <h2 className="mt-6 text-2xl font-semibold leading-[1.02] tracking-tight">{member.name}</h2>
      <p className="mt-3 inline-flex items-center gap-2 text-sm text-fg-subtle">
        <MapPin size={14} aria-hidden className="text-accent" />
        {member.location}
      </p>
      <p className="mt-5 leading-relaxed text-fg-muted">{member.description}</p>

      <div className="mt-auto flex flex-wrap gap-x-5 gap-y-3 pt-7">
        {member.instagramUrl && (
          <a
            href={member.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors hover:text-accent"
          >
            <InstagramIcon size={15} aria-hidden />
            Instagram
          </a>
        )}
        {member.websiteUrl && (
          <a
            href={member.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors hover:text-accent"
          >
            Visit their work
            <ArrowUpRight size={14} aria-hidden />
          </a>
        )}
      </div>
    </article>
  );
}
