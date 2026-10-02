import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MessageSquareWarning,
} from "lucide-react";
import {
  contributionFormatDetails,
  type ContributionFormat,
  type ContributionStatus,
} from "@/lib/network-contributions/types";

export type ModerationQueueItem = {
  id: string;
  format: ContributionFormat;
  title: string;
  summary: string;
  status: ContributionStatus;
  memberName: string;
  memberEmail: string;
  submittedAt: string | null;
  updatedAt: string;
  adminFeedback: string | null;
};

const statusLabel: Record<ContributionStatus, string> = {
  draft: "Draft",
  submitted: "Waiting",
  under_review: "In review",
  changes_requested: "With member",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  rejected: "Not accepted",
  archived: "Archived",
};

function formatDate(value: string | null) {
  if (!value) return "Not submitted";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ModerationDashboard({
  adminName,
  contributions,
  previewMode = false,
}: {
  adminName: string;
  contributions: ModerationQueueItem[];
  previewMode?: boolean;
}) {
  const waiting = contributions.filter((item) => item.status === "submitted");
  const inReview = contributions.filter((item) => item.status === "under_review");
  const returned = contributions.filter(
    (item) => item.status === "changes_requested",
  );
  const approved = contributions.filter((item) =>
    ["approved", "scheduled", "published"].includes(item.status),
  );
  const queue = contributions.filter((item) =>
    ["submitted", "under_review", "changes_requested"].includes(item.status),
  );
  const recent = contributions.filter(
    (item) => !["draft", "submitted", "under_review", "changes_requested"].includes(item.status),
  );

  return (
    <main className="min-h-screen bg-surface-0 pb-24 pt-24 text-fg md:pt-28">
      <div className="container-shell">
        {previewMode && (
          <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
            Local moderation preview. The buttons on the article screen do not
            change live data.
          </div>
        )}

        <Link
          href={previewMode ? "/network/admin/preview" : "/network/admin"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-accent"
        >
          <ArrowLeft size={16} aria-hidden />
          Network admin
        </Link>

        <header className="mt-8 grid gap-7 border-b border-line pb-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
              Member publishing
            </p>
            <h1 className="mt-3 text-[clamp(2.8rem,7vw,6.4rem)] leading-[0.9] tracking-[-0.055em]">
              Contribution review
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
              Check permissions, safety and community standards. A member&apos;s
              words stay locked. If they need changing, send the contribution
              back with a clear note.
            </p>
          </div>
          <div className="lg:text-right">
            <p className="text-sm text-fg-subtle">Signed in as {adminName}</p>
            <p className="mt-2 text-sm font-semibold text-fg">
              {queue.length} {queue.length === 1 ? "item" : "items"} in the queue
            </p>
          </div>
        </header>

        <section className="grid gap-px border-x border-b border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Summary icon={<Clock3 />} value={waiting.length} label="Waiting" />
          <Summary icon={<FileCheck2 />} value={inReview.length} label="In review" />
          <Summary icon={<MessageSquareWarning />} value={returned.length} label="With members" />
          <Summary icon={<CheckCircle2 />} value={approved.length} label="Approved and live" />
        </section>

        <QueueSection
          title="Needs attention"
          description="New submissions, work in review and changes waiting on a member."
          items={queue}
          previewMode={previewMode}
          empty="Nothing is waiting for review."
        />

        <QueueSection
          title="Recent decisions"
          description="Approved, published and declined contributions."
          items={recent}
          previewMode={previewMode}
          empty="No decisions have been recorded yet."
        />
      </div>
    </main>
  );
}

function QueueSection({
  title,
  description,
  items,
  previewMode,
  empty,
}: {
  title: string;
  description: string;
  items: ModerationQueueItem[];
  previewMode: boolean;
  empty: string;
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <h2 className="text-3xl tracking-[-0.035em] md:text-4xl">{title}</h2>
          <p className="mt-2 text-sm text-fg-muted">{description}</p>
        </div>
        <span className="text-sm text-fg-subtle">{items.length}</span>
      </div>

      {items.length ? (
        <div className="divide-y divide-line">
          {items.map((item) => {
            const detail = contributionFormatDetails[item.format];
            const href = previewMode
              ? `/network/admin/contributions/preview/${item.id}`
              : `/network/admin/contributions/${item.id}`;
            return (
              <article
                key={item.id}
                className="group grid gap-5 py-7 md:grid-cols-[minmax(0,1fr)_13rem_auto] md:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold uppercase tracking-[0.14em] text-accent">
                      {detail.shortLabel}
                    </span>
                    <span className="text-fg-subtle">/</span>
                    <span className="text-fg-subtle">
                      {item.memberName} · {item.memberEmail}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl leading-tight tracking-[-0.03em] transition group-hover:text-accent md:text-3xl">
                    {item.title || "Untitled contribution"}
                  </h3>
                  <p className="mt-2 max-w-3xl line-clamp-2 text-sm leading-relaxed text-fg-muted">
                    {item.summary || "No introduction supplied."}
                  </p>
                </div>
                <div>
                  <span className="inline-flex rounded-full border border-accent/40 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent-soft">
                    {statusLabel[item.status]}
                  </span>
                  <p className="mt-2 text-xs text-fg-subtle">
                    {formatDate(item.submittedAt || item.updatedAt)}
                  </p>
                </div>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-accent"
                >
                  Review
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="border-b border-line py-14 text-center text-fg-muted">{empty}</p>
      )}
    </section>
  );
}

function Summary({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-surface-0 p-6">
      <div className="flex items-center justify-between text-accent">
        <span className="[&>svg]:size-5">{icon}</span>
        <strong className="text-4xl font-semibold tracking-[-0.05em] text-fg">
          {value}
        </strong>
      </div>
      <p className="mt-5 text-sm font-semibold text-fg-muted">{label}</p>
    </div>
  );
}
