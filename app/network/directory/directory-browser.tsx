"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Search, X } from "lucide-react";
import { MemberAvatar } from "@/components/network/member-avatar";
import type { NetworkDirectoryMember } from "@/lib/content/network-directory";
import { directoryGroups, memberGroupSlugs } from "@/lib/content/network-directory-groups";
import { trackEvent } from "@/lib/analytics";

type Props = {
  members: NetworkDirectoryMember[];
  previewOnly?: boolean;
  hideCategoryFilter?: boolean;
  initialLocation?: string;
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

const DIRECTORY_SESSION_KEY = "nami_directory_session_id";

function directorySessionId() {
  const existing = sessionStorage.getItem(DIRECTORY_SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  sessionStorage.setItem(DIRECTORY_SESSION_KEY, id);
  return id;
}

function recordDirectoryEvent(payload: { eventType: "search" | "result_clicked"; searchQuery: string; categoryFilter: string; locationFilter: string; resultCount: number; selectedMemberId?: string }) {
  void fetch("/api/network/directory-analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ ...payload, anonymousSessionId: directorySessionId(), sourcePath: window.location.pathname }),
  }).catch(() => undefined);
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
  return value
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const searchTermGroups = [
  ["photo", "photos", "photograph", "photographer", "photographers", "photography", "photographic", "camera", "portrait", "portraits", "headshot", "headshots"],
  ["film", "films", "filming", "filmmaker", "filmmakers", "videographer", "videographers", "videography", "video", "videos", "reel", "reels", "stopmotion"],
  ["art", "arts", "artist", "artists", "artwork", "illustration", "illustrator", "illustrators", "drawing", "painter", "painters", "painting", "paintings", "mural", "murals"],
  ["print", "prints", "printmaker", "printmakers", "printmaking", "screenprint", "linocut", "lino"],
  ["maker", "makers", "making", "craft", "crafts", "crafted", "handmade", "ceramic", "ceramics", "pottery", "textile", "textiles", "jewellery", "jewelry", "sculpture", "sculptor"],
  ["design", "designer", "designers", "graphic", "graphics", "branding", "brand", "identity", "digital", "web", "website", "websites", "ux", "ui"],
  ["architect", "architects", "architecture", "interior", "interiors"],
  ["animation", "animator", "animators", "3d", "cgi", "motion"],
  ["music", "musician", "musicians", "singer", "singers", "songwriter", "songwriters", "band", "bands", "rapper", "composer", "composers", "audio", "recording", "producer", "producers", "dj"],
  ["performance", "performer", "performers", "performing", "dance", "dancer", "dancers", "theatre", "theater", "actor", "actors", "aerial", "model", "models"],
  ["writing", "writer", "writers", "copywriter", "copywriting", "content", "journalist", "journalism", "storyteller", "storytelling", "editor", "editing", "pr", "marketing", "socialmedia"],
  ["business", "businesses", "independent", "shop", "shops", "retail", "retailer", "venue", "venues", "florist", "barber", "fitness"],
  ["community", "communities", "event", "events", "workshop", "workshops", "facilitator", "education", "educator", "teacher", "gallery", "galleries"],
  ["creative", "creatives", "freelance", "freelancer", "freelancers", "studio", "studios"],
] as const;

function memberMatchesQuery(member: NetworkDirectoryMember, query: string) {
  const search = normalise(query);
  if (!search) return true;

  const compactSearch = search.replace(/\s+/g, "");
  const searchableText = normalise([
    member.name,
    member.category,
    memberGroupSlugs(member).map((slug) => directoryGroups.find((group) => group.slug === slug)?.label).join(" "),
    member.location,
    locationGroup(member.location),
    member.instagram,
    member.websiteUrl,
    member.description,
  ].join(" "));
  const searchableTokens = new Set(searchableText.split(/\s+/).filter(Boolean));

  return search.split(/\s+/).every((token) => {
    const compactToken = token.replace(/\s+/g, "");
    const relatedTerms = searchTermGroups.find((group) =>
      group.some((term) => term === compactToken || term === compactSearch),
    );

    if (!relatedTerms) return searchableText.includes(token);
    return relatedTerms.some((term) => searchableTokens.has(term));
  });
}

export function DirectoryBrowser({ members, previewOnly = false, hideCategoryFilter = false, initialLocation = "All areas" }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [location, setLocation] = useState(locationGroups.includes(initialLocation as typeof locationGroups[number]) ? initialLocation : "All areas");

  const categories = useMemo(
    () => directoryGroups.filter((group) => members.some((member) => memberGroupSlugs(member).includes(group.slug))),
    [members],
  );

  const availableLocations = useMemo(
    () => locationGroups.filter((group) => members.some((member) => locationGroup(member.location) === group)),
    [members],
  );

  const filtered = useMemo(() => {
    return members.filter((member) => {
      const matchesQuery = memberMatchesQuery(member, query);
      const matchesCategory = category === "All categories" || memberGroupSlugs(member).some((slug) => directoryGroups.find((group) => group.slug === slug)?.label === category);
      const matchesLocation = location === "All areas" || locationGroup(member.location) === location;
      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [category, location, members, query]);

  const hasFilters = Boolean(query || category !== "All categories" || location !== "All areas");

  useEffect(() => {
    if (!hasFilters) return;
    const timer = window.setTimeout(() => {
      trackEvent("network_directory_searched", {
        search_query: query.trim().slice(0, 80),
        category_filter: category,
        location_filter: location,
        result_count: filtered.length,
      });
      recordDirectoryEvent({
        eventType: "search",
        searchQuery: query,
        categoryFilter: category,
        locationFilter: location,
        resultCount: filtered.length,
      });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [category, filtered.length, hasFilters, location, query]);

  const resetFilters = () => {
    setQuery("");
    setCategory("All categories");
    setLocation("All areas");
  };

  return (
    <div>
      <div className="glass-refractive rounded-3xl p-5 md:p-7">
        <div className={`grid gap-4 ${hideCategoryFilter ? "lg:grid-cols-[minmax(0,1fr)_15rem]" : "lg:grid-cols-[minmax(0,1fr)_15rem_15rem]"}`}>
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

          {!hideCategoryFilter && <FilterSelect label="Filter by category" value={category} onChange={setCategory}>
            <option>All categories</option>
            {categories.map((item) => <option key={item.slug}>{item.label}</option>)}
          </FilterSelect>}

          <FilterSelect label="Filter by area" value={location} onChange={setLocation}>
            <option>All areas</option>
            {availableLocations.map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>
        </div>
      </div>

      {previewOnly && !hasFilters ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-fg-muted">
          <p>Search all {members.length} members by name, work or place.</p>
          <Link href="/network/directory/all" className="font-semibold text-fg hover:text-accent">View all members <span aria-hidden>↗</span></Link>
        </div>
      ) : <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
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
      </div>}

      {previewOnly && !hasFilters ? null : filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => <DirectoryMemberCard key={member.id} member={member} analyticsContext={{ searchQuery: query, categoryFilter: category, locationFilter: location, resultCount: filtered.length }} />)}
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

export function DirectoryMemberCard({ member, analyticsContext }: { member: NetworkDirectoryMember; analyticsContext?: { searchQuery: string; categoryFilter: string; locationFilter: string; resultCount: number } }) {
  const recordSelection = () => {
    trackEvent("network_member_profile_clicked", { member_id: member.id, member_name: member.name, destination: "profile", category: member.category });
    if (analyticsContext) recordDirectoryEvent({ eventType: "result_clicked", ...analyticsContext, selectedMemberId: member.id });
  };
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

      <h2 className="mt-6 text-2xl font-semibold leading-[1.02] tracking-tight">
        <Link
          href={`/network/directory/member/${member.id}`}
          onClick={recordSelection}
          className="transition-colors hover:text-accent"
        >
          <span aria-hidden className="absolute inset-0" />
          {member.name}
        </Link>
      </h2>
      <p className="mt-3 inline-flex items-center gap-2 text-sm text-fg-subtle">
        <MapPin size={14} aria-hidden className="text-accent" />
        {member.location}
      </p>
      <p className="mt-5 leading-relaxed text-fg-muted">{member.description}</p>

      <div className="mt-auto flex flex-wrap gap-x-5 gap-y-3 pt-7">
        <Link
          href={`/network/directory/member/${member.id}`}
          onClick={recordSelection}
          className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors hover:text-accent"
        >
          View profile
          <ArrowUpRight size={14} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
