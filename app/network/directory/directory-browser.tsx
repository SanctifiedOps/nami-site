"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { MemberProfileCard } from "@/components/ui/member-profile-card";
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
      <div className="glass-refractive rounded-3xl p-4 md:p-5">
        <div className={`grid gap-3 ${hideCategoryFilter ? "lg:grid-cols-[minmax(0,1fr)_15rem]" : "lg:grid-cols-[minmax(0,1fr)_15rem_15rem]"}`}>
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
              className="w-full rounded-xl border border-line bg-surface-0/65 py-3.5 pl-12 pr-4 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent focus:ring-4 focus:ring-accent/10"
            />
          </label>

          {!hideCategoryFilter && <FilterSelect label="Filter by category" value={category} onChange={setCategory} options={["All categories", ...categories.map((item) => item.label)]} />}

          <FilterSelect label="Filter by area" value={location} onChange={setLocation} options={["All areas", ...availableLocations]} />
        </div>
      </div>

      {previewOnly && !hasFilters ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-center text-sm text-fg-muted md:justify-between md:text-left">
          <p className="w-full md:w-auto">Search all {members.length} members by name, work or place.</p>
          <Link href="/network/directory/all" className="w-full font-semibold text-fg hover:text-accent md:w-auto">View all members <span aria-hidden>↗</span></Link>
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
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
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
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <span id={`${listboxId}-label`} className="sr-only">{label}</span>
      <button
        type="button"
        aria-labelledby={`${listboxId}-label`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-line bg-surface-0/65 px-4 py-3.5 text-left text-sm text-fg outline-none transition-all hover:border-accent/60 focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/10"
      >
        <span>{value}</span>
        <ChevronDown size={16} aria-hidden className={`shrink-0 text-accent transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={`${listboxId}-label`}
          className="absolute inset-x-0 top-[calc(100%+.4rem)] z-50 max-h-72 overflow-y-auto rounded-xl border border-accent/60 bg-[#0c0d0f] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,.65),0_0_30px_rgba(255,0,188,.14)]"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors ${selected ? "bg-accent text-white" : "text-fg hover:bg-accent/15 hover:text-accent"}`}
              >
                <span>{option}</span>
                {selected && <Check size={15} aria-hidden className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DirectoryMemberCard({ member, analyticsContext, className }: { member: NetworkDirectoryMember; analyticsContext?: { searchQuery: string; categoryFilter: string; locationFilter: string; resultCount: number }; className?: string }) {
  const recordSelection = () => {
    trackEvent("network_member_profile_clicked", { member_id: member.id, member_name: member.name, destination: "profile", category: member.category });
    if (analyticsContext) recordDirectoryEvent({ eventType: "result_clicked", ...analyticsContext, selectedMemberId: member.id });
  };
  return (
    <MemberProfileCard
      id={member.id}
      name={member.name}
      description={member.description}
      speciality={member.category}
      image={member.profileImage}
      imageAlt={member.imageAlt}
      onSelect={recordSelection}
      className={className}
    />
  );
}
