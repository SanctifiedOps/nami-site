"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowLeft, BarChart3, CalendarDays, Camera, CheckCircle2, CircleGauge, Database, Home, ImageOff, Info, Link2, Mail, MapPin, MoreHorizontal, MousePointerClick, Search, ShieldCheck, TicketCheck, TrendingUp, Users } from "lucide-react";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import type { GaSnapshot, InstagramSnapshot, MailchimpSnapshot } from "@/lib/network-admin/external-data";

type Application = {
  id: string; email: string; firstName: string; displayName: string; location: string; requestedCategory: string;
  bio: string; websiteUrl: string | null; instagramUrl: string | null; status: string; submittedAt: string; reviewedAt: string | null;
};
type Member = {
  id: string; firstName: string; email: string; accountStatus: string; role: string; joinedAt: string; lastLoginAt: string | null;
  displayName: string; location: string; primaryGroup: string; speciality: string; profileImageKey: string | null; published: boolean; links: string[];
};
type Ticket = {
  id: string; memberId: string | null; name: string; email: string; subject: string; description: string; pageUrl: string | null;
  status: "open" | "in_progress" | "resolved"; priority: "normal" | "urgent"; createdAt: string; updatedAt: string; resolvedAt: string | null;
};
type NetworkEvent = {
  id: string; memberId: string; title: string; summary: string; venue: string; location: string; startsAt: string; endsAt: string | null;
  bookingUrl: string | null; status: "pending" | "approved" | "rejected"; submittedAt: string; reviewedAt: string | null; publishedAt: string | null; updatedAt: string;
};
type Operations = { failedAlerts: number; pendingAlerts: number; failedEmails: number; pendingEmails: number; failedSyncs: number; pendingSyncs: number };

const panel = "rounded-2xl border border-line bg-surface-1/90 shadow-[0_12px_35px_rgb(0_0_0/0.16)] md:rounded-[1.5rem] md:shadow-[0_18px_60px_rgb(0_0_0/0.18)]";
const button = "rounded-full border border-line-strong px-4 py-2 text-xs font-bold transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40";
const membersPerPage = 10;
type DashboardView = "home" | "growth" | "members" | "tasks" | "more";
const disconnectedGa: GaSnapshot = { connected: false, users: null, sessions: null, views: null, usersChange: null, directorySearches: null, profileClicks: null, error: "GA4 connection needed" };
const disconnectedInstagram: InstagramSnapshot = { connected: false, username: null, followers: null, mediaCount: null, error: "Instagram connection needed" };
const disconnectedMailchimp: MailchimpSnapshot = { connected: false, audienceName: null, subscribers: null, openRate: null, clickRate: null, campaignCount: null, latestCampaign: null, error: "Mailchimp connection needed" };

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function validUrl(value: string) {
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}

export function AdminDashboard({ adminName, applications, members, tickets, events, operations, ga = disconnectedGa, instagram = disconnectedInstagram, mailchimp = disconnectedMailchimp }: {
  adminName: string; applications: Application[]; members: Member[]; tickets: Ticket[]; events: NetworkEvent[]; operations: Operations; ga?: GaSnapshot; instagram?: InstagramSnapshot; mailchimp?: MailchimpSnapshot;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [applicationOptions, setApplicationOptions] = useState<Record<string, { primaryGroup: string; speciality: string }>>({});
  const [memberCategory, setMemberCategory] = useState("all");
  const [memberPage, setMemberPage] = useState(1);
  const [activeView, setActiveView] = useState<DashboardView>("home");
  const [moreDetail, setMoreDetail] = useState<"integrations" | "health" | null>(null);

  const pendingApplications = applications.filter((item) => item.status === "pending");
  const pendingEvents = events.filter((item) => item.status === "pending");
  const openTickets = tickets.filter((item) => item.status !== "resolved");
  const activeMembers = members.filter((item) => item.published && item.accountStatus !== "disabled");
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const newThisMonth = members.filter((item) => new Date(item.joinedAt) >= monthStart).length;
  const missingImages = members.filter((item) => item.published && !item.profileImageKey).length;
  const linkIssues = members.filter((item) => item.links.some((link) => !validUrl(link))).length;
  const groupLabels = new Map<string, string>(directoryGroups.map((group) => [group.slug, group.label]));
  const filteredMembers = memberCategory === "all" ? members : members.filter((member) => member.primaryGroup === memberCategory);
  const memberPageCount = Math.max(1, Math.ceil(filteredMembers.length / membersPerPage));
  const safeMemberPage = Math.min(memberPage, memberPageCount);
  const visibleMembers = filteredMembers.slice((safeMemberPage - 1) * membersPerPage, safeMemberPage * membersPerPage);

  const categoryCounts = useMemo(() => Object.entries(members.reduce<Record<string, number>>((counts, member) => {
    if (member.primaryGroup) counts[member.primaryGroup] = (counts[member.primaryGroup] ?? 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1]), [members]);
  const locationCounts = useMemo(() => Object.entries(members.reduce<Record<string, number>>((counts, member) => {
    if (member.location) counts[member.location] = (counts[member.location] ?? 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1]), [members]);

  async function runAction(key: string, payload: Record<string, unknown>) {
    setBusy(key); setMessage("");
    try {
      const response = await fetch("/api/network/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "The admin action could not be completed.");
      setMessage("Saved. The Network records are up to date.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The admin action could not be completed.");
    } finally { setBusy(null); }
  }

  const navigation: { id: DashboardView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "growth", label: "Growth", icon: <TrendingUp size={20} /> },
    { id: "members", label: "Members", icon: <Users size={20} /> },
    { id: "tasks", label: "Tasks", icon: <TicketCheck size={20} />, badge: pendingApplications.length + openTickets.length + pendingEvents.length + operations.failedAlerts + operations.failedEmails + operations.failedSyncs },
    { id: "more", label: "More", icon: <MoreHorizontal size={20} /> },
  ];

  return <main className="min-h-screen bg-surface-0 pb-24 pt-16 text-fg md:pb-16 md:pt-28">
    <div className="container-shell !px-3 sm:!px-4 md:!px-10">
      <div className="hidden flex-col gap-5 border-b border-line pb-6 md:flex lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/network/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted hover:text-accent"><ArrowLeft size={16} /> Member dashboard</Link>
          <p className="mt-5 font-bold uppercase tracking-[0.16em] text-accent md:mt-8">NAMI Creative Network</p>
          <h1 className="mt-2 text-4xl md:mt-3 md:text-7xl">Network control centre</h1>
          <p className="mt-3 max-w-2xl text-sm text-fg-muted md:mt-4 md:text-base">Welcome back, {adminName}. Growth, members and daily operations in one place.</p>
        </div>
        <div className="hidden rounded-2xl border border-emerald-400/25 bg-emerald-400/8 px-5 py-4 text-sm md:block">
          <span className="flex items-center gap-2 font-bold text-emerald-300"><ShieldCheck size={18} /> Admin access verified</span>
          <span className="mt-1 block text-fg-muted">Member invitations and profile emails remain locked.</span>
        </div>
      </div>

      {message && <p role="status" className="mt-6 rounded-xl border border-accent/30 bg-accent/8 p-4 text-sm">{message}</p>}

      <div className="flex items-center justify-between py-3 md:hidden"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">Network admin</p><p className="mt-0.5 text-sm font-semibold">Welcome back, {adminName}</p></div><span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2 py-1 text-[9px] font-bold text-emerald-300"><ShieldCheck size={12} /> Live data</span></div>

      <nav className="mt-7 hidden gap-2 rounded-2xl border border-line bg-surface-1/70 p-2 text-sm font-bold md:flex">
        {navigation.map((item) => <button key={item.id} onClick={() => setActiveView(item.id)} className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-3 transition ${activeView === item.id ? "bg-accent text-white shadow-[0_10px_30px_rgb(255_0_166/0.2)]" : "text-fg-muted hover:bg-white/5 hover:text-fg"}`}>{item.icon}{item.label}{item.badge ? <span className={`${activeView === item.id ? "bg-white text-accent" : "bg-accent text-white"} rounded-full px-2 py-0.5 text-[10px]`}>{item.badge}</span> : null}</button>)}
      </nav>

      {activeView === "home" && <section id="overview" className="pt-2 md:pt-10">
        <div className="flex items-center justify-between"><h2 className="text-2xl md:text-3xl">At a glance</h2><span className="rounded-full border border-line px-2 py-1 text-[9px] text-fg-subtle md:px-3 md:text-xs">Live database</span></div>
        <div className="mt-3 grid grid-cols-2 gap-2.5 [&>a]:!p-3 [&>a_p]:!mt-2 [&>a_p]:line-clamp-1 [&>a_strong]:!mt-2 [&>a_strong]:!text-3xl md:mt-5 md:gap-4 md:[&>a]:!p-5 md:[&>a_p]:!mt-5 md:[&>a_p]:line-clamp-none md:[&>a_strong]:!mt-5 md:[&>a_strong]:!text-4xl xl:grid-cols-4">
          <Metric href="#members" icon={<Users size={20} />} label="Active members" value={activeMembers.length} note="Published directory profiles" tone="pink" />
          <Metric href="#members" icon={<CheckCircle2 size={20} />} label="New this month" value={newThisMonth} note="Based on member join dates" tone="blue" />
          <Metric href="#members" icon={<ImageOff size={20} />} label="Missing images" value={missingImages} note="Published profiles needing attention" tone="amber" />
          <Metric href="#members" icon={<Link2 size={20} />} label="Link issues" value={linkIssues} note="Malformed submitted links" tone="red" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5 [&>article]:!p-3 md:mt-5 md:gap-4 md:[&>article]:!p-6 lg:grid-cols-2 xl:grid-cols-3">
          <Breakdown title="Largest categories" items={categoryCounts.map(([name, count]) => [groupLabels.get(name) ?? name, count])} />
          <Breakdown title="Largest locations" items={locationCounts} />
          <article className={`${panel} col-span-2 p-5 md:p-6 xl:col-span-1`}><div className="flex items-center justify-between"><div><h3 className="text-xl">Instagram</h3><p className="mt-1 text-xs text-fg-subtle">{instagram.connected ? `@${instagram.username}` : "Professional account connection"}</p></div><Camera size={20} className="text-accent" /></div><div className="mt-5 grid grid-cols-2 gap-3"><SmallMetric label="Followers" value={instagram.followers} /><SmallMetric label="Posts" value={instagram.mediaCount} /></div>{!instagram.connected && <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/6 p-3 text-xs text-amber-200">{instagram.error}</p>}</article>
        </div>
        <div className="mt-5 flex items-center justify-between md:mt-10"><h2 className="text-xl md:text-3xl">Site activity</h2><span className={`rounded-full border px-2 py-1 text-[9px] md:px-3 md:text-xs ${ga.connected ? "border-emerald-400/25 text-emerald-300" : "border-amber-400/25 text-amber-300"}`}>{ga.connected ? "GA4 live" : "Connect GA4"}</span></div>
        <div className="mt-3 grid grid-cols-2 gap-2.5 [&>article]:!p-3 [&>article:last-child]:col-span-2 [&>article_p]:!mt-2 [&>article_p]:line-clamp-1 [&>article_strong]:!mt-2 [&>article_strong]:!text-3xl md:mt-5 md:gap-4 md:[&>article]:!p-5 md:[&>article_p]:!mt-5 md:[&>article_p]:line-clamp-none md:[&>article_strong]:!mt-5 md:[&>article_strong]:!text-4xl xl:grid-cols-5 xl:[&>article:last-child]:col-span-1">
          <ExternalMetric icon={<Users size={20} />} label="Users" value={ga.users} note={ga.usersChange === null ? ga.error ?? "Awaiting GA4" : `${ga.usersChange >= 0 ? "+" : ""}${ga.usersChange}% vs previous 30 days`} tone="pink" />
          <ExternalMetric icon={<Activity size={20} />} label="Sessions" value={ga.sessions} note="All site sessions" tone="blue" />
          <ExternalMetric icon={<BarChart3 size={20} />} label="Page views" value={ga.views} note="Across namicreative.co.uk" tone="green" />
          <ExternalMetric icon={<Search size={20} />} label="Directory searches" value={ga.directorySearches} note="Tracked search activity" tone="amber" />
          <ExternalMetric icon={<MousePointerClick size={20} />} label="Profile clicks" value={ga.profileClicks} note="Directory profile visits" tone="pink" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5 [&>a]:!p-3 [&>a_p]:!mt-2 [&>a_p]:line-clamp-1 [&>a_strong]:!mt-2 [&>a_strong]:!text-3xl md:mt-5 md:gap-4 md:[&>a]:!p-5 md:[&>a_p]:!mt-5 md:[&>a_p]:line-clamp-none md:[&>a_strong]:!mt-5 md:[&>a_strong]:!text-4xl xl:grid-cols-4">
          <Metric href="#applications" icon={<Users size={20} />} label="Applications waiting" value={pendingApplications.length} note="Ready for your review" tone="pink" />
          <Metric href="#tickets" icon={<TicketCheck size={20} />} label="Open tickets" value={openTickets.length} note="Member support requests" tone="amber" />
          <Metric href="#events" icon={<CalendarDays size={20} />} label="Events waiting" value={pendingEvents.length} note="Approval queue" tone="blue" />
          <Metric href="#operations" icon={<AlertTriangle size={20} />} label="Failed jobs" value={operations.failedAlerts + operations.failedEmails + operations.failedSyncs} note="Notifications, email and Sheet sync" tone="red" />
        </div>
      </section>}

      {activeView === "growth" && <section className="pt-4 md:pt-10">
        <SectionHeading title="Growth analytics" note="" />
        <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-surface-1/70 p-1.5 md:mt-5 md:rounded-2xl md:p-2">
          <div className="grid flex-1 grid-cols-4 gap-1">{["7 days", "30 days", "60 days", "90 days"].map((period, index) => <button key={period} className={`whitespace-nowrap rounded-lg px-1.5 py-2 text-[11px] font-bold md:rounded-xl md:px-3 md:text-xs ${index === 1 ? "bg-accent text-white" : "text-fg-muted hover:bg-white/5"}`}>{period}</button>)}</div>
          <button title="Metric definitions" className="ml-1 shrink-0 rounded-lg p-1.5 text-fg-muted hover:bg-white/5 hover:text-fg md:rounded-xl md:p-2"><Info size={16} /></button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5 [&>article]:!p-3 [&>article:last-child]:col-span-2 [&>article_p]:!mt-2 [&>article_p]:line-clamp-1 [&>article_strong]:!mt-2 [&>article_strong]:!text-3xl md:mt-4 md:gap-4 md:[&>article]:!p-5 md:[&>article_p]:!mt-5 md:[&>article_p]:line-clamp-none md:[&>article_strong]:!mt-5 md:[&>article_strong]:!text-4xl xl:grid-cols-5 xl:[&>article:last-child]:col-span-1">
          <ExternalMetric icon={<Users size={20} />} label="Website users" value={ga.users} note={ga.usersChange === null ? ga.error ?? "Awaiting GA4" : `${ga.usersChange >= 0 ? "+" : ""}${ga.usersChange}% vs previous period`} tone="pink" />
          <ExternalMetric icon={<Activity size={20} />} label="Sessions" value={ga.sessions} note="Visits during the period" tone="blue" />
          <ExternalMetric icon={<BarChart3 size={20} />} label="Page views" value={ga.views} note="Across the NAMI site" tone="green" />
          <ExternalMetric icon={<Camera size={20} />} label="Instagram followers" value={instagram.followers} note={instagram.connected ? `@${instagram.username}` : instagram.error ?? "Instagram unavailable"} tone="pink" />
          <ExternalMetric icon={<Mail size={20} />} label="Email audience" value={mailchimp.subscribers} note={mailchimp.connected ? mailchimp.audienceName ?? "Mailchimp" : mailchimp.error ?? "Mailchimp unavailable"} tone="amber" />
        </div>
        <div className="mt-3 grid gap-3 md:mt-4 md:gap-4 lg:grid-cols-2">
          <article className={`${panel} min-h-48 p-3 md:min-h-64 md:p-6`}><div className="flex items-center justify-between"><div><h3 className="text-sm md:text-xl">Network growth</h3><p className="mt-1 text-[10px] text-fg-subtle md:text-xs">Member, website and channel growth over time</p></div><TrendingUp size={18} className="text-accent md:h-6 md:w-6" /></div><div className="mt-3 flex min-h-24 items-center justify-center rounded-xl border border-dashed border-line px-3 text-center text-[10px] text-fg-subtle md:mt-8 md:min-h-36 md:rounded-2xl md:text-sm">Historical trend collection will populate this chart.</div></article>
          <article className={`${panel} min-h-48 p-3 md:min-h-64 md:p-6`}><div className="flex items-center justify-between"><div><h3 className="text-sm md:text-xl">Audience engagement</h3><p className="mt-1 text-[10px] text-fg-subtle md:text-xs">Searches, visits, email and social activity</p></div><MousePointerClick size={18} className="text-sky-300 md:h-6 md:w-6" /></div><div className="mt-3 grid grid-cols-2 gap-2 [&>div]:!p-2 [&>div_span]:text-[9px] [&>div_strong]:!mt-1 [&>div_strong]:!text-xl md:mt-5 md:gap-3 md:[&>div]:!p-4 md:[&>div_span]:text-xs md:[&>div_strong]:!mt-2 md:[&>div_strong]:!text-2xl"><SmallMetric label="Directory searches" value={ga.directorySearches} /><SmallMetric label="Profile visits" value={ga.profileClicks} /><SmallMetric label="Email open rate (%)" value={mailchimp.openRate} /><SmallMetric label="Email click rate (%)" value={mailchimp.clickRate} /></div></article>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5 md:mt-4 md:gap-4 lg:grid-cols-2"><Breakdown title="Member categories" items={categoryCounts.map(([name, count]) => [groupLabels.get(name) ?? name, count])} /><Breakdown title="Member locations" items={locationCounts} /></div>
      </section>}

      {activeView === "members" && <><section id="applications" className="pt-2 md:pt-10">
        <SectionHeading title="Applications" count={pendingApplications.length} note="" />
        <div className="mt-3 grid gap-2.5 md:mt-5 md:gap-4 [&>article]:!p-4 md:[&>article]:!p-6">
          {pendingApplications.map((item) => {
            const option = applicationOptions[item.id] ?? { primaryGroup: directoryGroups.find((group) => group.slug === item.requestedCategory)?.slug ?? directoryGroups[0].slug, speciality: item.requestedCategory };
            return <article key={item.id} className={`${panel} p-5 md:p-6`}>
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <div><div className="flex flex-wrap items-center gap-3"><h3 className="text-2xl">{item.displayName}</h3><Status value="pending" /></div><p className="mt-2 text-sm text-fg-muted">{item.firstName} · {item.email} · {item.location}</p><p className="mt-4 max-w-3xl text-sm leading-6 text-fg-muted">{item.bio}</p><p className="mt-4 text-xs text-fg-subtle">Submitted {formatDate(item.submittedAt)}</p></div>
                <div className="grid gap-3 rounded-2xl border border-line bg-surface-0 p-4">
                  <label className="text-xs font-bold">Directory group<select value={option.primaryGroup} onChange={(event) => setApplicationOptions((current) => ({ ...current, [item.id]: { ...option, primaryGroup: event.target.value } }))} className="mt-2 w-full rounded-xl border border-line-strong bg-surface-1 px-3 py-2.5">{directoryGroups.map((group) => <option key={group.slug} value={group.slug}>{group.label}</option>)}</select></label>
                  <label className="text-xs font-bold">Speciality<input value={option.speciality} onChange={(event) => setApplicationOptions((current) => ({ ...current, [item.id]: { ...option, speciality: event.target.value } }))} className="mt-2 w-full rounded-xl border border-line-strong bg-surface-1 px-3 py-2.5" /></label>
                  <div className="mt-1 flex gap-2"><button disabled={busy !== null || option.speciality.trim().length < 2} onClick={() => runAction(`application-${item.id}`, { action: "approve-application", applicationId: item.id, ...option })} className="flex-1 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{busy === `application-${item.id}` ? "Approving..." : "Approve profile"}</button><button disabled={busy !== null} onClick={() => runAction(`application-reject-${item.id}`, { action: "reject-application", applicationId: item.id })} className={button}>Reject</button></div>
                </div>
              </div>
            </article>;
          })}
          {!pendingApplications.length && <Empty text="No applications are waiting for approval." />}
        </div>
      </section>

      <section id="members" className="pt-7 md:pt-12">
        <SectionHeading title="Members" count={members.length} note="Profile, account and sign-in status in one place." />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between md:mt-5 md:gap-3">
          <label className="text-xs font-bold text-fg-muted">Filter by category
            <select value={memberCategory} onChange={(event) => { setMemberCategory(event.target.value); setMemberPage(1); }} className="mt-2 block min-w-64 rounded-xl border border-line-strong bg-surface-1 px-3 py-2.5 text-sm text-fg">
              <option value="all">All categories</option>
              {directoryGroups.map((group) => <option key={group.slug} value={group.slug}>{group.label}</option>)}
            </select>
          </label>
          <p className="text-sm text-fg-subtle">Showing {filteredMembers.length ? (safeMemberPage - 1) * membersPerPage + 1 : 0}–{Math.min(safeMemberPage * membersPerPage, filteredMembers.length)} of {filteredMembers.length}</p>
        </div>
        <div className={`${panel} mt-3 overflow-hidden [&>.overflow-x-auto]:hidden md:mt-5 md:[&>.overflow-x-auto]:block`}>
          <div className="grid divide-y divide-line md:hidden">{visibleMembers.map((member) => <div key={member.id} className="grid grid-cols-[1fr_auto] items-center gap-2 p-3"><div className="min-w-0"><Link href={`/network/directory/member/${member.id}`} className="block truncate text-sm font-bold hover:text-accent">{member.displayName}</Link><p className="mt-0.5 truncate text-[10px] text-fg-subtle">{(groupLabels.get(member.primaryGroup) ?? member.primaryGroup) || "No profile"} · {member.location || "No location"}</p></div><div className="flex items-center gap-1.5"><Status value={member.accountStatus} />{member.role !== "admin" && <button disabled={busy !== null} onClick={() => runAction(`member-${member.id}`, { action: "member-status", memberId: member.id, status: member.accountStatus === "disabled" ? "active" : "disabled" })} className="rounded-full border border-line-strong px-2 py-1 text-[9px] font-bold">{member.accountStatus === "disabled" ? "Enable" : "Disable"}</button>}</div></div>)}</div>
          <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b border-line bg-surface-0/70 text-xs uppercase tracking-[0.1em] text-fg-subtle"><tr><th className="p-4">Member</th><th className="p-4">Directory</th><th className="p-4">Account</th><th className="p-4">Last login</th><th className="p-4 text-right">Action</th></tr></thead><tbody>{visibleMembers.map((member) => <tr key={member.id} className="border-b border-line/70 last:border-0"><td className="p-4"><Link href={`/network/directory/member/${member.id}`} className="font-bold hover:text-accent">{member.displayName}</Link><span className="mt-1 block text-xs text-fg-subtle">{member.email}{member.role === "admin" ? " · Admin" : ""}</span></td><td className="p-4"><span>{(groupLabels.get(member.primaryGroup) ?? member.primaryGroup) || "No profile"}</span><span className="mt-1 block text-xs text-fg-subtle">{member.location}</span></td><td className="p-4"><Status value={member.accountStatus} /></td><td className="p-4 text-fg-muted">{formatDate(member.lastLoginAt)}</td><td className="p-4 text-right">{member.role !== "admin" && <button disabled={busy !== null} onClick={() => runAction(`member-${member.id}`, { action: "member-status", memberId: member.id, status: member.accountStatus === "disabled" ? "active" : "disabled" })} className={button}>{busy === `member-${member.id}` ? "Saving..." : member.accountStatus === "disabled" ? "Enable" : "Disable"}</button>}</td></tr>)}</tbody></table></div>
          {!visibleMembers.length && <div className="p-8 text-center text-sm text-fg-subtle">No members match this category.</div>}
          {memberPageCount > 1 && <div className="flex items-center justify-between border-t border-line px-4 py-4"><button className={button} disabled={safeMemberPage === 1} onClick={() => setMemberPage((page) => Math.max(1, page - 1))}>Previous</button><span className="text-sm text-fg-muted">Page {safeMemberPage} of {memberPageCount}</span><button className={button} disabled={safeMemberPage === memberPageCount} onClick={() => setMemberPage((page) => Math.min(memberPageCount, page + 1))}>Next</button></div>}
        </div>
      </section></>}

      {activeView === "tasks" && <><section id="tickets" className="pt-2 md:pt-10">
        <SectionHeading title="Support tickets" count={openTickets.length} note="" />
        <div className="mt-3 grid gap-2.5 md:mt-5 md:gap-4 [&>article]:!p-4 md:[&>article]:!p-6">
          {tickets.map((ticket) => <article key={ticket.id} className={`${panel} min-w-0 overflow-hidden p-5 md:p-6`}><div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h3 className="text-xl">{ticket.subject}</h3><Status value={ticket.status} />{ticket.priority === "urgent" && <span className="rounded-full bg-red-400/12 px-3 py-1 text-xs font-bold text-red-300">Urgent</span>}</div><p className="mt-2 break-words text-xs text-fg-subtle [overflow-wrap:anywhere]">{ticket.id} · {ticket.name} · {ticket.email} · {formatDate(ticket.createdAt)}</p><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-fg-muted [overflow-wrap:anywhere]">{ticket.description}</p>{ticket.pageUrl && <a href={ticket.pageUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block max-w-full break-all text-xs font-bold text-accent">Open reported page ↗</a>}</div><div className="flex shrink-0 flex-wrap gap-2">{(['open','in_progress','resolved'] as const).map((status) => <button key={status} disabled={busy !== null || ticket.status === status} onClick={() => runAction(`ticket-${ticket.id}-${status}`, { action: "ticket-status", ticketId: ticket.id, status })} className={button}>{status === "in_progress" ? "In progress" : status[0].toUpperCase() + status.slice(1)}</button>)}</div></div></article>)}
          {!tickets.length && <Empty text="No support tickets have been logged." />}
        </div>
      </section>

      <section id="events" className="pt-7 md:pt-12">
        <SectionHeading title="Event submissions" count={pendingEvents.length} note="Review member events before they appear on the noticeboard." />
        <div className="mt-3 grid grid-cols-2 gap-2.5 md:mt-5 md:gap-4 [&>article]:!p-4 md:[&>article]:!p-6">
          {events.map((event) => <article key={event.id} className={`${panel} p-5 md:p-6`}><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl">{event.title}</h3><p className="mt-2 flex items-center gap-2 text-sm text-fg-muted"><MapPin size={15} /> {event.venue}, {event.location}</p></div><Status value={event.status} /></div><p className="mt-4 text-sm leading-6 text-fg-muted">{event.summary}</p><p className="mt-4 text-xs text-fg-subtle">Starts {formatDate(event.startsAt)}</p>{event.status === "pending" && <div className="mt-5 flex gap-2"><button disabled={busy !== null} onClick={() => runAction(`event-${event.id}-approved`, { action: "event-status", eventId: event.id, status: "approved" })} className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white disabled:opacity-40">Approve</button><button disabled={busy !== null} onClick={() => runAction(`event-${event.id}-rejected`, { action: "event-status", eventId: event.id, status: "rejected" })} className={button}>Reject</button></div>}</article>)}
          {!events.length && <Empty text="No events have been submitted." />}
        </div>
      </section>

      <section id="operations" className="pt-7 md:pt-12">
        <SectionHeading title="Operations" note="The parts that keep member records and owner notifications moving." />
        <div className="mt-3 grid grid-cols-2 gap-2.5 [&>article:last-child]:col-span-2 md:mt-5 md:grid-cols-3 md:gap-4 md:[&>article:last-child]:col-span-1">
          <OperationCard icon={<Mail />} title="Owner notifications" pending={operations.pendingAlerts} failed={operations.failedAlerts} />
          <OperationCard icon={<Mail />} title="Member email queue" pending={operations.pendingEmails} failed={operations.failedEmails} locked />
          <OperationCard icon={<CheckCircle2 />} title="Google Sheet sync" pending={operations.pendingSyncs} failed={operations.failedSyncs} />
        </div>
        <div className={`${panel} mt-5 p-6`}><h3 className="text-xl">Data connections</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-fg-muted">Membership, applications, tickets, events and job health come directly from the NAMI database. GA4 and Instagram refresh from their APIs whenever this page loads. No Make scenario is used for this dashboard.</p></div>
      </section></>}

      {activeView === "more" && <section className="pt-2 md:pt-10">
        <SectionHeading title="More" note="" />
        <div className="mt-3 grid grid-cols-2 gap-2.5 [&>button:last-child]:col-span-2 md:mt-5 md:gap-4 lg:grid-cols-3 lg:[&>button:last-child]:col-span-1">
          <FeatureLink icon={<BarChart3 />} title="Sponsor report" note="Shareable Network performance." onClick={() => setActiveView("growth")} />
          <FeatureLink icon={<Database />} title="Integrations" note="GA4, Instagram, Mailchimp and more." active={moreDetail === "integrations"} onClick={() => setMoreDetail((current) => current === "integrations" ? null : "integrations")} />
          <FeatureLink icon={<CircleGauge />} title="Data health" note="Freshness, failures and connections." active={moreDetail === "health"} onClick={() => setMoreDetail((current) => current === "health" ? null : "health")} />
        </div>
        {moreDetail === "integrations" && <div className={`${panel} mt-3 grid grid-cols-2 gap-2.5 p-3 md:mt-5 md:grid-cols-3 md:gap-4 md:p-6`}><ConnectionStatus label="Site database" connected /><ConnectionStatus label="GA4" connected={ga.connected} /><ConnectionStatus label="Instagram" connected={instagram.connected} /><ConnectionStatus label="Mailchimp" connected={mailchimp.connected} /><ConnectionStatus label="Google Sheets" connected={operations.failedSyncs === 0} /><ConnectionStatus label="Owner email" connected={operations.failedAlerts === 0} /></div>}
        {moreDetail === "health" && <div className={`${panel} mt-3 grid grid-cols-3 gap-2 p-3 md:mt-5 md:gap-4 md:p-6`}><SmallMetric label="Pending jobs" value={operations.pendingAlerts + operations.pendingEmails + operations.pendingSyncs} /><SmallMetric label="Failed jobs" value={operations.failedAlerts + operations.failedEmails + operations.failedSyncs} /><SmallMetric label="Open tickets" value={openTickets.length} /></div>}
        <div className={`${panel} mt-5 p-5 md:p-6`}><div className="flex items-center gap-3"><ShieldCheck className="text-emerald-300" /><h3 className="text-xl">Communication controls</h3></div><p className="mt-3 text-sm leading-6 text-fg-muted">Member invitations and profile emails remain locked. Owner notifications stay active.</p></div>
      </section>}
    </div>

    <nav aria-label="Admin dashboard" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface-0/95 px-1.5 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-12px_35px_rgb(0_0_0/0.35)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">{navigation.map((item) => <button key={item.id} onClick={() => { setActiveView(item.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-current={activeView === item.id ? "page" : undefined} className={`relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-[9px] font-bold transition ${activeView === item.id ? "bg-accent/12 text-accent" : "text-fg-subtle"}`}><span className="relative scale-90">{item.icon}{item.badge ? <span className="absolute -right-3 -top-2 min-w-4 rounded-full bg-accent px-1 text-center text-[9px] leading-4 text-white">{item.badge}</span> : null}</span>{item.label}</button>)}</div>
    </nav>
  </main>;
}

function Metric({ icon, label, value, note, tone, href }: { icon: React.ReactNode; label: string; value: number; note: string; tone: "pink" | "blue" | "amber" | "red"; href?: string }) {
  const tones = { pink: "bg-accent/12 text-accent", blue: "bg-sky-400/12 text-sky-300", amber: "bg-amber-400/12 text-amber-300", red: "bg-red-400/12 text-red-300" };
  const content = <><div className="flex items-start justify-between gap-2"><span className="text-xs text-fg-muted md:text-sm">{label}</span><span className={`rounded-xl p-2 md:p-2.5 ${tones[tone]}`}>{icon}</span></div><strong className="mt-3 block text-3xl tabular-nums md:mt-5 md:text-4xl">{value}</strong><p className="mt-3 text-[11px] leading-4 text-fg-subtle md:mt-5 md:text-xs">{note}</p></>;
  return href ? <a href={href} className={`${panel} block p-4 transition hover:-translate-y-0.5 hover:border-accent/60 md:p-5`}>{content}</a> : <article className={`${panel} p-4 md:p-5`}>{content}</article>;
}

function ExternalMetric({ icon, label, value, note, tone }: { icon: React.ReactNode; label: string; value: number | null; note: string; tone: "pink" | "blue" | "green" | "amber" }) {
  const tones = { pink: "bg-accent/12 text-accent", blue: "bg-sky-400/12 text-sky-300", green: "bg-emerald-400/12 text-emerald-300", amber: "bg-amber-400/12 text-amber-300" };
  return <article className={`${panel} p-5`}><div className="flex items-center justify-between"><span className="text-sm text-fg-muted">{label}</span><span className={`rounded-xl p-2.5 ${tones[tone]}`}>{icon}</span></div><strong className="mt-5 block text-4xl tabular-nums">{value === null ? "—" : value.toLocaleString("en-GB")}</strong><p className="mt-5 text-xs text-fg-subtle">{note}</p></article>;
}

function Breakdown({ title, items }: { title: string; items: [string, number][] }) {
  const highest = Math.max(...items.map((item) => item[1]), 1);
  return <article className={`${panel} p-3 md:p-6`}><h3 className="text-sm md:text-xl">{title}</h3><div className="mt-3 grid gap-2.5 md:mt-5 md:gap-4">{items.slice(0, 6).map(([name, count], index) => <div key={name} className={index > 3 ? "hidden md:block" : "block"}><div className="flex justify-between gap-2 text-[10px] md:text-sm"><span className="truncate">{name}</span><strong>{count}</strong></div><div className="mt-1 h-1 overflow-hidden rounded-full bg-white/6 md:mt-2 md:h-1.5"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(8, (count / highest) * 100)}%` }} /></div></div>)}{!items.length && <p className="text-[10px] text-fg-subtle md:text-sm">No directory data yet.</p>}</div></article>;
}

function SectionHeading({ title, count, note }: { title: string; count?: number; note: string }) {
  return <div className="flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between md:gap-2"><div className="flex items-center gap-2 md:gap-3"><h2 className="text-2xl md:text-3xl">{title}</h2>{typeof count === "number" && <span className="rounded-full bg-accent/12 px-2 py-0.5 text-[10px] font-bold text-accent md:px-3 md:py-1 md:text-xs">{count}</span>}</div>{note && <p className="max-w-sm text-xs leading-5 text-fg-subtle md:text-sm">{note}</p>}</div>;
}

function Status({ value }: { value: string }) {
  const positive = ["active", "approved", "resolved", "sent", "complete"].includes(value);
  const warning = ["pending", "open", "unclaimed", "invited", "in_progress"].includes(value);
  const color = positive ? "bg-emerald-400/12 text-emerald-300" : warning ? "bg-amber-400/12 text-amber-300" : "bg-red-400/12 text-red-300";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold md:px-3 md:py-1 md:text-xs ${color}`}>{value.replaceAll("_", " ")}</span>;
}

function OperationCard({ icon, title, pending, failed, locked = false }: { icon: React.ReactNode; title: string; pending: number; failed: number; locked?: boolean }) {
  return <article className={`${panel} p-3 md:p-5`}><div className="flex items-start justify-between gap-2"><h3 className="text-sm md:text-lg">{title}</h3><span className="scale-75 text-accent md:scale-100">{icon}</span></div><div className="mt-3 grid grid-cols-2 gap-1.5 md:mt-5 md:gap-3"><div className="rounded-lg bg-surface-0 p-2 md:rounded-xl md:p-3"><span className="text-[9px] text-fg-subtle md:text-xs">Pending</span><strong className="mt-0.5 block text-xl md:mt-1 md:text-2xl">{pending}</strong></div><div className="rounded-lg bg-surface-0 p-2 md:rounded-xl md:p-3"><span className="text-[9px] text-fg-subtle md:text-xs">Failed</span><strong className="mt-0.5 block text-xl md:mt-1 md:text-2xl">{failed}</strong></div></div>{locked && <p className="mt-2 text-[9px] font-semibold text-amber-300 md:mt-4 md:text-xs">Sending locked</p>}</article>;
}

function SmallMetric({ label, value }: { label: string; value: number | null }) { return <div className="rounded-xl border border-line bg-surface-0 p-4"><span className="text-xs text-fg-subtle">{label}</span><strong className="mt-2 block text-2xl tabular-nums">{value === null ? "—" : value.toLocaleString("en-GB")}</strong></div>; }

function FeatureLink({ icon, title, note, onClick, active = false }: { icon: React.ReactNode; title: string; note: string; onClick: () => void; active?: boolean }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`${panel} group min-h-32 p-3 text-left transition hover:-translate-y-0.5 hover:border-accent/60 active:scale-[0.98] md:min-h-40 md:p-5 ${active ? "border-accent bg-accent/6 shadow-[0_12px_35px_rgb(255_0_188/0.12)]" : ""}`}><span className="inline-flex scale-90 rounded-lg bg-accent/12 p-2 text-accent md:scale-100 md:rounded-xl md:p-2.5">{icon}</span><h3 className="mt-3 text-sm md:mt-5 md:text-lg">{title}</h3><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-fg-subtle md:mt-2 md:text-xs md:leading-5">{note}</p></button>;
}

function ConnectionStatus({ label, connected }: { label: string; connected: boolean }) {
  return <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-0 p-2.5 md:p-4"><span className="text-[10px] font-semibold md:text-sm">{label}</span><span className={`h-2 w-2 shrink-0 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400"}`} aria-label={connected ? "Connected" : "Connection needed"} /></div>;
}

function Empty({ text }: { text: string }) { return <div className={`${panel} p-4 text-center text-[11px] text-fg-subtle md:p-8 md:text-sm`}>{text}</div>; }
