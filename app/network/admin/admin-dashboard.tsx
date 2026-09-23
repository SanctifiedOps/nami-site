"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowLeft, BarChart3, CalendarDays, Camera, CheckCircle2, ImageOff, Link2, Mail, MapPin, MousePointerClick, Search, ShieldCheck, TicketCheck, Users } from "lucide-react";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import type { GaSnapshot, InstagramSnapshot } from "@/lib/network-admin/external-data";

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

const panel = "rounded-[1.5rem] border border-line bg-surface-1/90 shadow-[0_18px_60px_rgb(0_0_0/0.18)]";
const button = "rounded-full border border-line-strong px-4 py-2 text-xs font-bold transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40";
const disconnectedGa: GaSnapshot = { connected: false, users: null, sessions: null, views: null, usersChange: null, directorySearches: null, profileClicks: null, error: "GA4 connection needed" };
const disconnectedInstagram: InstagramSnapshot = { connected: false, username: null, followers: null, mediaCount: null, error: "Instagram connection needed" };

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function validUrl(value: string) {
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}

export function AdminDashboard({ adminName, applications, members, tickets, events, operations, ga = disconnectedGa, instagram = disconnectedInstagram }: {
  adminName: string; applications: Application[]; members: Member[]; tickets: Ticket[]; events: NetworkEvent[]; operations: Operations; ga?: GaSnapshot; instagram?: InstagramSnapshot;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [applicationOptions, setApplicationOptions] = useState<Record<string, { primaryGroup: string; speciality: string }>>({});

  const pendingApplications = applications.filter((item) => item.status === "pending");
  const pendingEvents = events.filter((item) => item.status === "pending");
  const openTickets = tickets.filter((item) => item.status !== "resolved");
  const activeMembers = members.filter((item) => item.accountStatus === "active" && item.published);
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const newThisMonth = members.filter((item) => new Date(item.joinedAt) >= monthStart).length;
  const missingImages = members.filter((item) => item.published && !item.profileImageKey).length;
  const linkIssues = members.filter((item) => item.links.some((link) => !validUrl(link))).length;
  const groupLabels = new Map<string, string>(directoryGroups.map((group) => [group.slug, group.label]));

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

  return <main className="min-h-screen bg-surface-0 pb-24 pt-24 text-fg md:pt-28">
    <div className="container-shell">
      <div className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/network/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted hover:text-accent"><ArrowLeft size={16} /> Member dashboard</Link>
          <p className="mt-8 font-bold uppercase tracking-[0.16em] text-accent">NAMI Creative Network</p>
          <h1 className="mt-3 text-5xl md:text-7xl">Network admin</h1>
          <p className="mt-4 max-w-2xl text-fg-muted">Welcome back, {adminName}. Manage the Network without leaving the NAMI site.</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/8 px-5 py-4 text-sm">
          <span className="flex items-center gap-2 font-bold text-emerald-300"><ShieldCheck size={18} /> Admin access verified</span>
          <span className="mt-1 block text-fg-muted">Member invitations and profile emails remain locked.</span>
        </div>
      </div>

      {message && <p role="status" className="mt-6 rounded-xl border border-accent/30 bg-accent/8 p-4 text-sm">{message}</p>}

      <nav className="mt-7 flex gap-2 overflow-x-auto pb-2 text-sm font-bold">
        {[['overview','Overview'],['applications','Applications'],['members','Members'],['tickets','Tickets'],['events','Events'],['operations','Operations']].map(([href, label]) => <a key={href} href={`#${href}`} className="whitespace-nowrap rounded-full border border-line px-4 py-2 hover:border-accent hover:text-accent">{label}</a>)}
      </nav>

      <section id="overview" className="scroll-mt-28 pt-10">
        <div className="flex items-center justify-between"><h2 className="text-3xl">Membership</h2><span className="rounded-full border border-line px-3 py-1 text-xs text-fg-subtle">Connected to the site database</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={<Users size={20} />} label="Active members" value={activeMembers.length} note="Published directory profiles" tone="pink" />
          <Metric icon={<CheckCircle2 size={20} />} label="New this month" value={newThisMonth} note="Based on member join dates" tone="blue" />
          <Metric icon={<ImageOff size={20} />} label="Missing images" value={missingImages} note="Published profiles needing attention" tone="amber" />
          <Metric icon={<Link2 size={20} />} label="Link issues" value={linkIssues} note="Malformed submitted links" tone="red" />
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <Breakdown title="Largest categories" items={categoryCounts.map(([name, count]) => [groupLabels.get(name) ?? name, count])} />
          <Breakdown title="Largest locations" items={locationCounts} />
          <article className={`${panel} p-5 md:p-6`}><div className="flex items-center justify-between"><div><h3 className="text-xl">Instagram</h3><p className="mt-1 text-xs text-fg-subtle">{instagram.connected ? `@${instagram.username}` : "Professional account connection"}</p></div><Camera size={20} className="text-accent" /></div><div className="mt-5 grid grid-cols-2 gap-3"><SmallMetric label="Followers" value={instagram.followers} /><SmallMetric label="Posts" value={instagram.mediaCount} /></div>{!instagram.connected && <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/6 p-3 text-xs text-amber-200">{instagram.error}</p>}</article>
        </div>
        <div className="mt-10 flex items-center justify-between"><h2 className="text-3xl">NAMI site, last 30 days</h2><span className={`rounded-full border px-3 py-1 text-xs ${ga.connected ? "border-emerald-400/25 text-emerald-300" : "border-amber-400/25 text-amber-300"}`}>{ga.connected ? "GA4 live" : "GA4 connection needed"}</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <ExternalMetric icon={<Users size={20} />} label="Users" value={ga.users} note={ga.usersChange === null ? ga.error ?? "Awaiting GA4" : `${ga.usersChange >= 0 ? "+" : ""}${ga.usersChange}% vs previous 30 days`} tone="pink" />
          <ExternalMetric icon={<Activity size={20} />} label="Sessions" value={ga.sessions} note="All site sessions" tone="blue" />
          <ExternalMetric icon={<BarChart3 size={20} />} label="Page views" value={ga.views} note="Across namicreative.co.uk" tone="green" />
          <ExternalMetric icon={<Search size={20} />} label="Directory searches" value={ga.directorySearches} note="Tracked search activity" tone="amber" />
          <ExternalMetric icon={<MousePointerClick size={20} />} label="Profile clicks" value={ga.profileClicks} note="Directory profile visits" tone="pink" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={<Users size={20} />} label="Applications waiting" value={pendingApplications.length} note="Ready for your review" tone="pink" />
          <Metric icon={<TicketCheck size={20} />} label="Open tickets" value={openTickets.length} note="Member support requests" tone="amber" />
          <Metric icon={<CalendarDays size={20} />} label="Events waiting" value={pendingEvents.length} note="Approval queue" tone="blue" />
          <Metric icon={<AlertTriangle size={20} />} label="Failed jobs" value={operations.failedAlerts + operations.failedEmails + operations.failedSyncs} note="Notifications, email and Sheet sync" tone="red" />
        </div>
      </section>

      <section id="applications" className="scroll-mt-28 pt-14">
        <SectionHeading title="Applications" count={pendingApplications.length} note="Approving creates the directory profile. It does not send an invitation." />
        <div className="mt-5 grid gap-4">
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

      <section id="members" className="scroll-mt-28 pt-14">
        <SectionHeading title="Members" count={members.length} note="Profile, account and sign-in status in one place." />
        <div className={`${panel} mt-5 overflow-hidden`}>
          <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b border-line bg-surface-0/70 text-xs uppercase tracking-[0.1em] text-fg-subtle"><tr><th className="p-4">Member</th><th className="p-4">Directory</th><th className="p-4">Account</th><th className="p-4">Last login</th><th className="p-4 text-right">Action</th></tr></thead><tbody>{members.map((member) => <tr key={member.id} className="border-b border-line/70 last:border-0"><td className="p-4"><Link href={`/network/directory/member/${member.id}`} className="font-bold hover:text-accent">{member.displayName}</Link><span className="mt-1 block text-xs text-fg-subtle">{member.email}{member.role === "admin" ? " · Admin" : ""}</span></td><td className="p-4"><span>{(groupLabels.get(member.primaryGroup) ?? member.primaryGroup) || "No profile"}</span><span className="mt-1 block text-xs text-fg-subtle">{member.location}</span></td><td className="p-4"><Status value={member.accountStatus} /></td><td className="p-4 text-fg-muted">{formatDate(member.lastLoginAt)}</td><td className="p-4 text-right">{member.role !== "admin" && <button disabled={busy !== null} onClick={() => runAction(`member-${member.id}`, { action: "member-status", memberId: member.id, status: member.accountStatus === "disabled" ? "active" : "disabled" })} className={button}>{busy === `member-${member.id}` ? "Saving..." : member.accountStatus === "disabled" ? "Enable" : "Disable"}</button>}</td></tr>)}</tbody></table></div>
        </div>
      </section>

      <section id="tickets" className="scroll-mt-28 pt-14">
        <SectionHeading title="Support tickets" count={openTickets.length} note="New tickets sent to you by email also appear here." />
        <div className="mt-5 grid gap-4">
          {tickets.map((ticket) => <article key={ticket.id} className={`${panel} p-5 md:p-6`}><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="max-w-3xl"><div className="flex flex-wrap items-center gap-3"><h3 className="text-xl">{ticket.subject}</h3><Status value={ticket.status} />{ticket.priority === "urgent" && <span className="rounded-full bg-red-400/12 px-3 py-1 text-xs font-bold text-red-300">Urgent</span>}</div><p className="mt-2 text-xs text-fg-subtle">{ticket.id} · {ticket.name} · {ticket.email} · {formatDate(ticket.createdAt)}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-fg-muted">{ticket.description}</p>{ticket.pageUrl && <a href={ticket.pageUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-bold text-accent">Open reported page ↗</a>}</div><div className="flex shrink-0 flex-wrap gap-2">{(['open','in_progress','resolved'] as const).map((status) => <button key={status} disabled={busy !== null || ticket.status === status} onClick={() => runAction(`ticket-${ticket.id}-${status}`, { action: "ticket-status", ticketId: ticket.id, status })} className={button}>{status === "in_progress" ? "In progress" : status[0].toUpperCase() + status.slice(1)}</button>)}</div></div></article>)}
          {!tickets.length && <Empty text="No support tickets have been logged." />}
        </div>
      </section>

      <section id="events" className="scroll-mt-28 pt-14">
        <SectionHeading title="Event submissions" count={pendingEvents.length} note="Review member events before they appear on the noticeboard." />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {events.map((event) => <article key={event.id} className={`${panel} p-5 md:p-6`}><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl">{event.title}</h3><p className="mt-2 flex items-center gap-2 text-sm text-fg-muted"><MapPin size={15} /> {event.venue}, {event.location}</p></div><Status value={event.status} /></div><p className="mt-4 text-sm leading-6 text-fg-muted">{event.summary}</p><p className="mt-4 text-xs text-fg-subtle">Starts {formatDate(event.startsAt)}</p>{event.status === "pending" && <div className="mt-5 flex gap-2"><button disabled={busy !== null} onClick={() => runAction(`event-${event.id}-approved`, { action: "event-status", eventId: event.id, status: "approved" })} className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white disabled:opacity-40">Approve</button><button disabled={busy !== null} onClick={() => runAction(`event-${event.id}-rejected`, { action: "event-status", eventId: event.id, status: "rejected" })} className={button}>Reject</button></div>}</article>)}
          {!events.length && <Empty text="No events have been submitted." />}
        </div>
      </section>

      <section id="operations" className="scroll-mt-28 pt-14">
        <SectionHeading title="Operations" note="The parts that keep member records and owner notifications moving." />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <OperationCard icon={<Mail />} title="Owner notifications" pending={operations.pendingAlerts} failed={operations.failedAlerts} />
          <OperationCard icon={<Mail />} title="Member email queue" pending={operations.pendingEmails} failed={operations.failedEmails} locked />
          <OperationCard icon={<CheckCircle2 />} title="Google Sheet sync" pending={operations.pendingSyncs} failed={operations.failedSyncs} />
        </div>
        <div className={`${panel} mt-5 p-6`}><h3 className="text-xl">Data connections</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-fg-muted">Membership, applications, tickets, events and job health come directly from the NAMI database. GA4 and Instagram refresh from their APIs whenever this page loads. No Make scenario is used for this dashboard.</p></div>
      </section>
    </div>
  </main>;
}

function Metric({ icon, label, value, note, tone }: { icon: React.ReactNode; label: string; value: number; note: string; tone: "pink" | "blue" | "amber" | "red" }) {
  const tones = { pink: "bg-accent/12 text-accent", blue: "bg-sky-400/12 text-sky-300", amber: "bg-amber-400/12 text-amber-300", red: "bg-red-400/12 text-red-300" };
  return <article className={`${panel} p-5`}><div className="flex items-center justify-between"><span className="text-sm text-fg-muted">{label}</span><span className={`rounded-xl p-2.5 ${tones[tone]}`}>{icon}</span></div><strong className="mt-5 block text-4xl">{value}</strong><p className="mt-5 text-xs text-fg-subtle">{note}</p></article>;
}

function ExternalMetric({ icon, label, value, note, tone }: { icon: React.ReactNode; label: string; value: number | null; note: string; tone: "pink" | "blue" | "green" | "amber" }) {
  const tones = { pink: "bg-accent/12 text-accent", blue: "bg-sky-400/12 text-sky-300", green: "bg-emerald-400/12 text-emerald-300", amber: "bg-amber-400/12 text-amber-300" };
  return <article className={`${panel} p-5`}><div className="flex items-center justify-between"><span className="text-sm text-fg-muted">{label}</span><span className={`rounded-xl p-2.5 ${tones[tone]}`}>{icon}</span></div><strong className="mt-5 block text-4xl tabular-nums">{value === null ? "—" : value.toLocaleString("en-GB")}</strong><p className="mt-5 text-xs text-fg-subtle">{note}</p></article>;
}

function Breakdown({ title, items }: { title: string; items: [string, number][] }) {
  const highest = Math.max(...items.map((item) => item[1]), 1);
  return <article className={`${panel} p-5 md:p-6`}><h3 className="text-xl">{title}</h3><div className="mt-5 grid gap-4">{items.slice(0, 6).map(([name, count]) => <div key={name}><div className="flex justify-between text-sm"><span>{name}</span><strong>{count}</strong></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/6"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(8, (count / highest) * 100)}%` }} /></div></div>)}{!items.length && <p className="text-sm text-fg-subtle">No directory data yet.</p>}</div></article>;
}

function SectionHeading({ title, count, note }: { title: string; count?: number; note: string }) {
  return <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div className="flex items-center gap-3"><h2 className="text-3xl">{title}</h2>{typeof count === "number" && <span className="rounded-full bg-accent/12 px-3 py-1 text-xs font-bold text-accent">{count}</span>}</div><p className="text-sm text-fg-subtle">{note}</p></div>;
}

function Status({ value }: { value: string }) {
  const positive = ["active", "approved", "resolved", "sent", "complete"].includes(value);
  const warning = ["pending", "open", "unclaimed", "invited", "in_progress"].includes(value);
  const color = positive ? "bg-emerald-400/12 text-emerald-300" : warning ? "bg-amber-400/12 text-amber-300" : "bg-red-400/12 text-red-300";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${color}`}>{value.replaceAll("_", " ")}</span>;
}

function OperationCard({ icon, title, pending, failed, locked = false }: { icon: React.ReactNode; title: string; pending: number; failed: number; locked?: boolean }) {
  return <article className={`${panel} p-5`}><div className="flex items-center justify-between"><h3 className="text-lg">{title}</h3><span className="text-accent">{icon}</span></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-surface-0 p-3"><span className="text-xs text-fg-subtle">Pending</span><strong className="mt-1 block text-2xl">{pending}</strong></div><div className="rounded-xl bg-surface-0 p-3"><span className="text-xs text-fg-subtle">Failed</span><strong className="mt-1 block text-2xl">{failed}</strong></div></div>{locked && <p className="mt-4 text-xs font-semibold text-amber-300">Member sending is locked.</p>}</article>;
}

function SmallMetric({ label, value }: { label: string; value: number | null }) { return <div className="rounded-xl border border-line bg-surface-0 p-4"><span className="text-xs text-fg-subtle">{label}</span><strong className="mt-2 block text-2xl tabular-nums">{value === null ? "—" : value.toLocaleString("en-GB")}</strong></div>; }

function Empty({ text }: { text: string }) { return <div className={`${panel} p-8 text-center text-sm text-fg-subtle`}>{text}</div>; }
