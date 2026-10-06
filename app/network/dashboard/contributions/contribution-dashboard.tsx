"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  Eye,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import {
  contributionFormatDetails,
  type ContributionListItem,
  type ContributionStatus,
} from "@/lib/network-contributions/types";

const statusDetails: Record<
  ContributionStatus,
  { label: string; className: string; explanation: string }
> = {
  draft: {
    label: "Draft",
    className: "border-line-strong text-fg-muted",
    explanation: "Only you can see this",
  },
  submitted: {
    label: "Submitted",
    className: "border-accent/50 bg-accent/8 text-accent-soft",
    explanation: "Waiting for a NAMI check",
  },
  under_review: {
    label: "Under review",
    className: "border-accent/50 bg-accent/8 text-accent-soft",
    explanation: "NAMI is checking it",
  },
  changes_requested: {
    label: "Changes requested",
    className: "border-amber-400/40 bg-amber-400/8 text-amber-200",
    explanation: "There is something for you to check",
  },
  approved: {
    label: "Approved",
    className: "border-emerald-400/40 bg-emerald-400/8 text-emerald-200",
    explanation: "Ready to schedule",
  },
  scheduled: {
    label: "Scheduled",
    className: "border-cyan-300/40 bg-cyan-300/8 text-cyan-100",
    explanation: "Publication date confirmed",
  },
  published: {
    label: "Published",
    className: "border-emerald-400/40 bg-emerald-400/8 text-emerald-200",
    explanation: "Live in the Network",
  },
  rejected: {
    label: "Not accepted",
    className: "border-red-400/40 bg-red-400/8 text-red-200",
    explanation: "See the moderation note",
  },
  archived: {
    label: "Archived",
    className: "border-line-strong text-fg-subtle",
    explanation: "No longer public",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function ContributionDashboard({
  firstName,
  contributions,
  notice,
  previewMode = false,
}: {
  firstName: string;
  contributions: ContributionListItem[];
  notice?: string;
  previewMode?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(contributions);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const drafts = items.filter((item) => item.status === "draft");
  const inReview = items.filter((item) =>
    ["submitted", "under_review", "changes_requested"].includes(item.status),
  );
  const published = items.filter((item) =>
    ["approved", "scheduled", "published"].includes(item.status),
  );

  async function deleteDraft(item: ContributionListItem) {
    const title = item.title || "Untitled contribution";
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    if (previewMode) {
      setItems((current) => current.filter((contribution) => contribution.id !== item.id));
      setActionMessage("Draft deleted from this local preview.");
      return;
    }

    setDeletingId(item.id);
    setActionMessage("");
    try {
      const response = await fetch("/api/network/contributions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contributionId: item.id }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "The draft could not be deleted.");
      setItems((current) => current.filter((contribution) => contribution.id !== item.id));
      setActionMessage(`"${title}" was deleted.`);
      router.refresh();
    } catch (deleteError) {
      setActionMessage(deleteError instanceof Error ? deleteError.message : "The draft could not be deleted.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 pt-24 md:pt-28">
      <div className="container-shell pb-24">
        {previewMode && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
            <span>Local preview. Nothing on this page changes live data.</span>
            <Link
              href="/network/dashboard/contributions/new/preview?format=project_story"
              className="font-semibold text-accent"
            >
              Open the writer
            </Link>
          </div>
        )}

        <Link
          href={previewMode ? "/network/dashboard/preview" : "/network/dashboard"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-accent"
        >
          <ArrowLeft size={16} aria-hidden />
          Member dashboard
        </Link>

        <header className="mt-8 grid gap-8 border-b border-line pb-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
              From the Network
            </p>
            <h1 className="mt-3 text-[clamp(2.8rem,7vw,6.6rem)] leading-[0.9] tracking-[-0.055em]">
              Your contributions
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
              Share your work and experiences in your own words. NAMI checks
              submissions for safety, permissions and community standards. We
              do not rewrite them.
            </p>
          </div>
          <div className="lg:text-right">
            <p className="text-sm text-fg-subtle">
              Welcome back, {firstName}
            </p>
            <Link
              href={
                previewMode
                  ? "/network/dashboard/contributions/new/preview"
                  : "/network/dashboard/contributions/new"
              }
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-soft"
            >
              <Plus size={17} aria-hidden />
              Start a contribution
            </Link>
          </div>
        </header>

        <section className="grid gap-px overflow-hidden border-x border-b border-line bg-line md:grid-cols-3">
          <Summary number={drafts.length} label="Drafts" detail="Still yours to finish" />
          <Summary number={inReview.length} label="In review" detail="Waiting or returned" />
          <Summary number={published.length} label="Approved and live" detail="Part of the Network" />
        </section>

        {notice && (
          <p
            role="status"
            className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-100"
          >
            {notice}
          </p>
        )}

        {actionMessage && (
          <p role="status" className="mt-6 rounded-2xl border border-line bg-surface-1 px-4 py-3 text-sm text-fg-muted">
            {actionMessage}
          </p>
        )}

        <section className="py-12 md:py-16">
          <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl tracking-[-0.035em] md:text-4xl">
                Your writing
              </h2>
              <p className="mt-2 text-sm text-fg-muted">
                Drafts, submissions and published contributions in one place.
              </p>
            </div>
            <p className="text-sm text-fg-subtle">
              {items.length} {items.length === 1 ? "contribution" : "contributions"}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="grid place-items-center border-b border-line py-20 text-center">
              <FileText size={34} className="text-accent" aria-hidden />
              <h3 className="mt-5 text-2xl">You have not started anything yet</h3>
              <p className="mt-3 max-w-md text-fg-muted">
                A field note can be as short as 150 words. Start with something
                you have made, noticed or learned.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {items.map((item) => {
                const status = statusDetails[item.status];
                const format = contributionFormatDetails[item.format];
                const href = previewMode
                  ? `/network/dashboard/contributions/new/preview?format=${item.format}&sample=${item.id}`
                  : `/network/dashboard/contributions/${item.id}`;
                return (
                  <article
                    key={item.id}
                    className="group grid gap-5 py-7 md:grid-cols-[minmax(0,1fr)_10rem_18rem] md:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold uppercase tracking-[0.14em] text-accent">
                          {format.shortLabel}
                        </span>
                        <span className="text-fg-subtle">/</span>
                        <span className="inline-flex items-center gap-1.5 text-fg-subtle">
                          <Clock3 size={12} aria-hidden />
                          Updated {formatDate(item.updatedAt)}
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl leading-tight tracking-[-0.03em] transition group-hover:text-accent md:text-3xl">
                        {item.title || "Untitled contribution"}
                      </h3>
                      {item.summary && (
                        <p className="mt-2 max-w-2xl line-clamp-2 text-sm leading-relaxed text-fg-muted">
                          {item.summary}
                        </p>
                      )}
                      {item.adminFeedback && item.status === "changes_requested" && (
                        <p className="mt-3 max-w-2xl border-l-2 border-amber-300 pl-3 text-sm text-amber-100">
                          {item.adminFeedback}
                        </p>
                      )}
                    </div>
                    <div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <p className="mt-2 text-xs text-fg-subtle">
                        {status.explanation}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 md:flex-col md:items-end">
                      <Link
                        href={href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-fg transition hover:text-accent"
                      >
                        {item.status === "published" ? (
                          <Eye size={15} aria-hidden />
                        ) : null}
                        {item.status === "draft" || item.status === "changes_requested"
                          ? "Continue"
                          : "View"}
                        <ArrowUpRight size={14} aria-hidden />
                      </Link>
                      <Link
                        href={previewMode ? "/network/news/preview/member-article" : `/network/dashboard/contributions/${item.id}/reader-preview`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-accent"
                      >
                        <Eye size={15} aria-hidden />
                        View reader preview
                      </Link>
                      {item.status === "draft" && (
                        <>
                          <button
                            type="button"
                            disabled={deletingId === item.id}
                            onClick={() => void deleteDraft(item)}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-red-300 transition hover:text-red-200 disabled:cursor-wait disabled:opacity-50"
                          >
                            <Trash2 size={15} aria-hidden />
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Summary({
  number,
  label,
  detail,
}: {
  number: number;
  label: string;
  detail: string;
}) {
  return (
    <div className="bg-surface-0 px-6 py-6 md:px-8">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-4xl font-semibold tracking-[-0.05em]">{number}</span>
        <span className="text-xs text-fg-subtle">{detail}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-fg-muted">{label}</p>
    </div>
  );
}
