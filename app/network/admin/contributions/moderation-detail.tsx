"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CircleAlert,
  Clock3,
  Eye,
  LockKeyhole,
  MessageSquareReply,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  contributionFormatDetails,
  type ContributionAssetView,
  type ContributionDocument,
  type ContributionFormat,
  type ContributionStatus,
} from "@/lib/network-contributions/types";

export type ModerationDetailRecord = {
  id: string;
  format: ContributionFormat;
  title: string;
  summary: string;
  content: ContributionDocument;
  status: ContributionStatus;
  memberName: string;
  memberEmail: string;
  originalWorkConfirmed: boolean;
  imageRightsConfirmed: boolean;
  noGeneratedTextConfirmed: boolean;
  submittedAt: string | null;
  updatedAt: string;
  adminFeedback: string | null;
  versionNumber: number | null;
  assets?: ContributionAssetView[];
  timeline: Array<{
    id: string;
    eventType: string;
    note: string | null;
    createdAt: string;
  }>;
};

const eventLabels: Record<string, string> = {
  created: "Draft started",
  submitted: "Submitted for review",
  review_started: "Review started",
  changes_requested: "Changes requested",
  resubmitted: "Resubmitted by member",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  hidden: "Hidden from the hub",
  restored: "Restored",
  rejected: "Not accepted",
  withdrawn: "Withdrawn",
};

function formatDate(value: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ModerationDetail({
  contribution,
  previewMode = false,
}: {
  contribution: ModerationDetailRecord;
  previewMode?: boolean;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState(contribution.adminFeedback || "");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const detail = contributionFormatDetails[contribution.format];
  const canDecide = ["submitted", "under_review"].includes(contribution.status);
  const inlineAssets = contribution.assets ?? [];

  async function runAction(
    action: "start_review" | "request_changes" | "approve" | "reject",
  ) {
    if (previewMode) {
      setMessage(
        action === "request_changes" || action === "reject"
          ? "Preview only. Your note would be sent to the member."
          : `Preview only. This would mark the contribution as ${action.replaceAll("_", " ")}.`,
      );
      return;
    }

    setBusy(action);
    setMessage("");
    try {
      const response = await fetch("/api/network/admin/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          contributionId: contribution.id,
          ...(["request_changes", "reject"].includes(action)
            ? { feedback }
            : {}),
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; warning?: string }
        | null;
      if (!response.ok) {
        throw new Error(payload?.error || "The moderation action failed.");
      }
      setMessage(payload?.warning || "Decision saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The moderation action failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="min-h-screen bg-surface-0 pb-24 pt-24 text-fg md:pt-28">
      <div className="container-shell">
        {previewMode && (
          <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
            Local moderation preview. Try the review controls below. No data is changed.
          </div>
        )}

        <Link
          href={
            previewMode
              ? "/network/admin/contributions/preview"
              : "/network/admin/contributions"
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-accent"
        >
          <ArrowLeft size={16} aria-hidden />
          Contribution queue
        </Link>

        <header className="mt-8 border-b border-line pb-9">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold uppercase tracking-[0.15em] text-accent">
              {detail.shortLabel}
            </span>
            <span className="text-fg-subtle">/</span>
            <span className="rounded-full border border-line-strong px-3 py-1.5 font-semibold capitalize text-fg-muted">
              {contribution.status.replaceAll("_", " ")}
            </span>
          </div>
          <h1 className="mt-5 max-w-5xl text-[clamp(2.7rem,6vw,5.8rem)] leading-[0.94] tracking-[-0.05em]">
            {contribution.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-fg-muted">
            {contribution.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-sm text-fg-subtle">
            <span>{contribution.memberName}</span>
            <a href={`mailto:${contribution.memberEmail}`} className="hover:text-accent">
              {contribution.memberEmail}
            </a>
            <span>Submitted {formatDate(contribution.submittedAt)}</span>
          </div>
          <Link
            href={
              previewMode
                ? "/network/news/preview/member-article"
                : `/network/admin/contributions/${contribution.id}/public-preview`
            }
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-bold transition hover:border-accent hover:text-accent"
          >
            <Eye size={16} aria-hidden />
            Preview the reader page
          </Link>
        </header>

        <div className="grid gap-10 py-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
          <article className="min-w-0">
            <div className="mb-8 flex items-start gap-3 border border-emerald-400/25 bg-emerald-400/5 p-4 text-sm leading-relaxed text-emerald-100">
              <LockKeyhole size={18} className="mt-0.5 shrink-0" aria-hidden />
              <p>
                Submitted version {contribution.versionNumber || 1} is locked.
                The approval check compares this page with the member&apos;s saved
                submission before it can pass review.
              </p>
            </div>

            <div className="space-y-7 text-[1.05rem] leading-[1.8] text-fg-muted md:text-lg">
              {contribution.content.blocks.map((block) =>
                block.type === "image" ? (() => {
                  const asset = inlineAssets.find((item) => item.id === block.assetId);
                  return asset ? <figure key={block.id} className="my-8"><img src={asset.url} alt={block.altText || asset.altText} className="max-h-[42rem] w-full object-contain" />{block.text && <figcaption className="mt-3 text-sm text-fg-subtle">{block.text}</figcaption>}</figure> : null;
                })() : block.type === "heading" ? (
                  <h2
                    key={block.id}
                    className="pt-4 text-3xl leading-tight tracking-[-0.035em] text-fg md:text-4xl"
                  >
                    {block.text}
                  </h2>
                ) : block.type === "quote" ? (
                  <blockquote
                    key={block.id}
                    className="border-l-2 border-accent py-2 pl-5 text-xl italic leading-relaxed text-fg md:text-2xl"
                  >
                    {block.text}
                  </blockquote>
                ) : (
                  block.text.split(/\n\s*\n/).filter(Boolean).map((paragraph, paragraphIndex) => (
                    <p key={`${block.id}-${paragraphIndex}`} className="whitespace-pre-line">
                      {paragraph.trim()}
                    </p>
                  ))
                ),
              )}
            </div>
          </article>

          <aside className="space-y-5 xl:sticky xl:top-28">
            <section className="border border-line bg-surface-1 p-5">
              <h2 className="text-xl">Submission checks</h2>
              <div className="mt-4 space-y-3">
                <Declaration ok={contribution.originalWorkConfirmed}>
                  Member confirms this is their work
                </Declaration>
                <Declaration ok={contribution.noGeneratedTextConfirmed}>
                  Member confirms no generative AI writing
                </Declaration>
                <Declaration ok={contribution.imageRightsConfirmed}>
                  Member confirms image permissions
                </Declaration>
              </div>
            </section>

            {contribution.status === "submitted" && (
              <section className="border border-accent/30 bg-accent/5 p-5">
                <h2 className="text-xl">Begin the check</h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  This marks the contribution as in review so the queue shows
                  that somebody is handling it.
                </p>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void runAction("start_review")}
                  className="mt-5 w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
                >
                  {busy === "start_review" ? "Starting..." : "Start review"}
                </button>
              </section>
            )}

            {contribution.status === "under_review" && (
              <section className="border border-line bg-surface-1 p-5">
                <h2 className="text-xl">Review decision</h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Approve it as submitted, or write a clear note for the member.
                  You cannot edit their article here.
                </p>
                <label className="mt-5 block text-xs font-bold text-fg-muted">
                  Note to the member
                  <textarea
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    rows={5}
                    maxLength={2000}
                    placeholder="Explain exactly what they need to check"
                    className="mt-2 w-full resize-y rounded-xl border border-line-strong bg-surface-0 px-3 py-3 text-sm font-normal leading-relaxed text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
                  />
                </label>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void runAction("approve")}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
                >
                  <Check size={16} aria-hidden />
                  {busy === "approve" ? "Approving..." : "Approve as submitted"}
                </button>
                <button
                  type="button"
                  disabled={busy !== null || feedback.trim().length < 5}
                  onClick={() => void runAction("request_changes")}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-bold transition hover:border-accent hover:text-accent disabled:opacity-40"
                >
                  <MessageSquareReply size={16} aria-hidden />
                  {busy === "request_changes" ? "Sending..." : "Return with this note"}
                </button>
                <button
                  type="button"
                  disabled={busy !== null || feedback.trim().length < 5}
                  onClick={() => void runAction("reject")}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-400/40 px-5 py-3 text-sm font-bold text-red-200 transition hover:bg-red-400/10 disabled:opacity-40"
                >
                  <X size={16} aria-hidden />
                  {busy === "reject" ? "Saving..." : "Do not accept"}
                </button>
              </section>
            )}

            {!canDecide && (
              <section className="border border-line bg-surface-1 p-5">
                <h2 className="text-xl">Decision recorded</h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  This contribution is {contribution.status.replaceAll("_", " ")}.
                  Its submitted content remains read only.
                </p>
              </section>
            )}

            {message && (
              <p
                role="status"
                className="border-l-2 border-accent pl-3 text-sm leading-relaxed text-fg-muted"
              >
                {message}
              </p>
            )}

            <section className="border-t border-line pt-5">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <Clock3 size={16} className="text-accent" aria-hidden />
                Moderation history
              </h2>
              <ol className="mt-4 space-y-4">
                {contribution.timeline.map((event) => (
                  <li key={event.id} className="border-l border-line pl-4 text-xs">
                    <p className="font-semibold text-fg">
                      {eventLabels[event.eventType] || event.eventType.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-fg-subtle">{formatDate(event.createdAt)}</p>
                    {event.note && (
                      <p className="mt-2 leading-relaxed text-fg-muted">{event.note}</p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Declaration({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm leading-relaxed text-fg-muted">
      {ok ? (
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden />
      ) : (
        <CircleAlert size={17} className="mt-0.5 shrink-0 text-red-300" aria-hidden />
      )}
      <span>{children}</span>
    </div>
  );
}
