"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Eye,
  FileText,
  ImagePlus,
  ListPlus,
  Plus,
  Quote,
  Save,
  Send,
  Trash2,
  Type,
} from "lucide-react";
import {
  contributionFormatDetails,
  contributionFormats,
  emptyContributionDocument,
  type ContributionBlock,
  type ContributionBlockType,
  type ContributionAssetView,
  type ContributionDraft,
  type ContributionFormat,
} from "@/lib/network-contributions/types";
import { prepareFullImageForUpload } from "@/lib/network/prepare-dashboard-image";

type BuilderState = {
  title: string;
  summary: string;
  content: ContributionDraft["content"];
  originalWorkConfirmed: boolean;
  imageRightsConfirmed: boolean;
  noGeneratedTextConfirmed: boolean;
};

const inputClass =
  "w-full rounded-2xl border border-line-strong bg-surface-0 px-4 py-3.5 text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none";

const blockLabels: Record<ContributionBlockType, string> = {
  paragraph: "Text",
  heading: "Heading",
  quote: "Quote",
};

export function ContributionBuilder({
  format,
  initialDraft,
  initialAssets = [],
  previewMode = false,
}: {
  format?: ContributionFormat;
  initialDraft?: ContributionDraft;
  initialAssets?: ContributionAssetView[];
  previewMode?: boolean;
}) {
  if (!format) {
    return <FormatChooser previewMode={previewMode} />;
  }

  return (
    <Writer
      key={initialDraft?.id ?? format}
      format={format}
      initialDraft={initialDraft}
      initialAssets={initialAssets}
      previewMode={previewMode}
    />
  );
}

function FormatChooser({ previewMode }: { previewMode: boolean }) {
  const base = previewMode
    ? "/network/dashboard/contributions/new/preview"
    : "/network/dashboard/contributions/new";

  return (
    <main className="min-h-screen bg-surface-0 pt-24 md:pt-28">
      <div className="container-shell pb-24">
        {previewMode && <PreviewNotice />}
        <Link
          href={
            previewMode
              ? "/network/dashboard/contributions/preview"
              : "/network/dashboard/contributions"
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-accent"
        >
          <ArrowLeft size={16} aria-hidden />
          Your contributions
        </Link>

        <header className="mt-10 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
            Start with the shape of it
          </p>
          <h1 className="mt-3 text-[clamp(2.7rem,7vw,6.4rem)] leading-[0.91] tracking-[-0.055em]">
            What would you like to share?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
            Choose a starting point. It changes the guidance around the page,
            not your words or the way your contribution is published.
          </p>
        </header>

        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {contributionFormats.map((item, index) => {
            const detail = contributionFormatDetails[item];
            return (
              <Link
                key={item}
                href={`${base}?format=${item}`}
                className="group relative min-h-72 bg-surface-0 p-7 transition hover:bg-surface-1 md:p-9"
              >
                <span className="font-mono text-xs text-fg-subtle">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-12">
                  <h2 className="text-3xl tracking-[-0.04em] transition group-hover:text-accent md:text-4xl">
                    {detail.label}
                  </h2>
                  <p className="mt-4 max-w-md leading-relaxed text-fg-muted">
                    {detail.description}
                  </p>
                  <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-4 text-xs">
                    <span className="text-fg-subtle">{detail.suggestedLength}</span>
                    <span className="inline-flex items-center gap-2 font-bold text-accent">
                      Start here <Plus size={14} aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <section className="mt-12 grid gap-5 border-y border-line py-7 text-sm md:grid-cols-[13rem_1fr]">
          <p className="font-bold text-fg">The NAMI promise</p>
          <p className="max-w-3xl leading-relaxed text-fg-muted">
            NAMI will check your contribution for safety, permissions and
            community standards. We will never generate, rewrite or polish it.
            If something needs changing, it comes back to you.
          </p>
        </section>
      </div>
    </main>
  );
}

function Writer({
  format,
  initialDraft,
  initialAssets,
  previewMode,
}: {
  format: ContributionFormat;
  initialDraft?: ContributionDraft;
  initialAssets: ContributionAssetView[];
  previewMode: boolean;
}) {
  const router = useRouter();
  const detail = contributionFormatDetails[format];
  const editable =
    !initialDraft ||
    initialDraft.status === "draft" ||
    initialDraft.status === "changes_requested";
  const [draftId, setDraftId] = useState(initialDraft?.id);
  const [state, setState] = useState<BuilderState>(() => ({
    title: initialDraft?.title ?? "",
    summary: initialDraft?.summary ?? "",
    content: initialDraft?.content ?? emptyContributionDocument(format),
    originalWorkConfirmed: initialDraft?.originalWorkConfirmed ?? false,
    imageRightsConfirmed: initialDraft?.imageRightsConfirmed ?? false,
    noGeneratedTextConfirmed: initialDraft?.noGeneratedTextConfirmed ?? false,
  }));
  const [savedState, setSavedState] = useState(state);
  const [saveMessage, setSaveMessage] = useState(
    previewMode ? "Preview draft" : "Not saved yet",
  );
  const [busy, setBusy] = useState(false);
  const initialCover = initialAssets.find((asset) => asset.kind === "cover") ?? null;
  const [cover, setCover] = useState<ContributionAssetView | null>(initialCover);
  const [coverAlt, setCoverAlt] = useState(initialCover?.altText ?? "");
  const [savedCoverAlt, setSavedCoverAlt] = useState(initialCover?.altText ?? "");
  const [assetBusy, setAssetBusy] = useState(false);
  const [assetMessage, setAssetMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const dirty = JSON.stringify(state) !== JSON.stringify(savedState);
  const wordCount = useMemo(() => {
    const words = [state.title, state.summary, ...state.content.blocks.map((block) => block.text)]
      .join(" ")
      .trim();
    return words ? words.split(/\s+/).length : 0;
  }, [state]);

  useEffect(() => {
    if (!dirty || !editable) return;
    if (previewMode) {
      setSaveMessage("Saving locally...");
      const timeout = window.setTimeout(() => {
        setSavedState(state);
        setSaveMessage("Saved locally");
      }, 650);
      return () => window.clearTimeout(timeout);
    }
    if (busy) return;
    setSaveMessage("Saving draft...");
    const timeout = window.setTimeout(() => {
      void persistDraft("save", state);
    }, 1200);
    return () => window.clearTimeout(timeout);
    // persistDraft deliberately uses the state snapshot supplied by this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, dirty, editable, previewMode, state]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty && !previewMode) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, previewMode]);

  function updateBlock(id: string, patch: Partial<ContributionBlock>) {
    setState((current) => ({
      ...current,
      content: {
        ...current.content,
        blocks: current.content.blocks.map((block) =>
          block.id === id ? { ...block, ...patch } : block,
        ),
      },
    }));
  }

  function addBlock(type: ContributionBlockType) {
    setState((current) => ({
      ...current,
      content: {
        ...current.content,
        blocks: [
          ...current.content.blocks,
          { id: crypto.randomUUID(), type, text: "" },
        ],
      },
    }));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= state.content.blocks.length) return;
    setState((current) => {
      const blocks = [...current.content.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...current, content: { ...current.content, blocks } };
    });
  }

  function removeBlock(id: string) {
    setState((current) => ({
      ...current,
      content: {
        ...current.content,
        blocks: current.content.blocks.filter((block) => block.id !== id),
      },
    }));
  }

  async function postDraft(
    action: "create" | "save" | "submit",
    snapshot: BuilderState,
    contributionId?: string,
  ) {
    const response = await fetch("/api/network/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        ...(contributionId ? { contributionId } : {}),
        data: { format, ...snapshot },
      }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { contributionId?: string; error?: string; warning?: string }
      | null;
    if (!response.ok) {
      throw new Error(payload?.error || "The contribution could not be saved.");
    }
    return payload;
  }

  async function persistDraft(
    intent: "save" | "submit",
    snapshot: BuilderState = state,
  ) {
    if (previewMode) {
      setSavedState(snapshot);
      setSaveMessage("Saved locally");
      return draftId;
    }
    if (!editable || busy) return undefined;

    setBusy(true);
    setError("");
    setSaveMessage(intent === "submit" ? "Submitting..." : "Saving draft...");

    try {
      let contributionId = draftId;
      if (!contributionId) {
        const created = await postDraft("create", snapshot);
        contributionId = created?.contributionId;
        if (!contributionId) throw new Error("The new draft could not be opened.");
        setDraftId(contributionId);
      }

      const result =
        intent === "submit"
          ? await postDraft("submit", snapshot, contributionId)
          : draftId
            ? await postDraft("save", snapshot, contributionId)
            : null;

      setSavedState(snapshot);
      if (intent === "submit") {
        router.push("/network/dashboard/contributions?submitted=1");
        router.refresh();
        return contributionId;
      }

      setSaveMessage(result?.warning || "Draft saved");
      if (!draftId) {
        router.replace(`/network/dashboard/contributions/${contributionId}`);
      }
      return contributionId;
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The contribution could not be saved.",
      );
      setSaveMessage("Not saved");
      return undefined;
    } finally {
      setBusy(false);
    }
  }

  async function uploadCover(event: ChangeEvent<HTMLInputElement>) {
    const source = event.target.files?.[0];
    event.target.value = "";
    if (!source) return;
    if (coverAlt.trim().length < 4) {
      setAssetMessage("Add a short image description before choosing the cover.");
      return;
    }

    setAssetBusy(true);
    setAssetMessage("Preparing the cover image...");
    try {
      const prepared = await prepareFullImageForUpload(
        source,
        2400,
        1600,
        "contribution-cover.webp",
      );

      if (previewMode) {
        const nextCover: ContributionAssetView = {
          id: "preview-cover",
          kind: "cover",
          url: URL.createObjectURL(prepared),
          altText: coverAlt.trim(),
          caption: "",
          width: 1600,
          height: 1067,
        };
        setCover(nextCover);
        setSavedCoverAlt(nextCover.altText);
        setAssetMessage("Cover ready in this local preview.");
        return;
      }

      const contributionId = draftId || (await persistDraft("save", state));
      if (!contributionId) {
        throw new Error("Save the draft before adding its cover image.");
      }

      const data = new FormData();
      data.set("image", prepared);
      data.set("contributionId", contributionId);
      data.set("altText", coverAlt.trim());
      const response = await fetch("/api/network/contributions/assets", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json().catch(() => null)) as
        | { asset?: ContributionAssetView; error?: string }
        | null;
      if (!response.ok || !payload?.asset) {
        throw new Error(payload?.error || "The cover image could not be saved.");
      }
      setCover(payload.asset);
      setCoverAlt(payload.asset.altText);
      setSavedCoverAlt(payload.asset.altText);
      setAssetMessage("Cover image saved.");
    } catch (uploadError) {
      setAssetMessage(
        uploadError instanceof Error
          ? uploadError.message
          : "The cover image could not be saved.",
      );
    } finally {
      setAssetBusy(false);
    }
  }

  async function saveCoverDescription() {
    if (!cover || coverAlt.trim().length < 4) return;
    if (previewMode) {
      setCover((current) =>
        current ? { ...current, altText: coverAlt.trim() } : current,
      );
      setSavedCoverAlt(coverAlt.trim());
      setAssetMessage("Image description saved in this preview.");
      return;
    }

    setAssetBusy(true);
    setAssetMessage("Saving image description...");
    try {
      const response = await fetch("/api/network/contributions/assets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: cover.id, altText: coverAlt.trim() }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!response.ok) {
        throw new Error(payload?.error || "The image description could not be saved.");
      }
      setCover((current) =>
        current ? { ...current, altText: coverAlt.trim() } : current,
      );
      setSavedCoverAlt(coverAlt.trim());
      setAssetMessage("Image description saved.");
    } catch (saveError) {
      setAssetMessage(
        saveError instanceof Error
          ? saveError.message
          : "The image description could not be saved.",
      );
    } finally {
      setAssetBusy(false);
    }
  }

  const canSubmit = editable &&
    state.title.trim().length >= 5 &&
    state.summary.trim().length >= 20 &&
    state.content.blocks.some((block) => block.text.trim().length >= 20) &&
    state.originalWorkConfirmed &&
    state.imageRightsConfirmed &&
    state.noGeneratedTextConfirmed;

  const backHref = previewMode
    ? "/network/dashboard/contributions/preview"
    : "/network/dashboard/contributions";

  return (
    <main className="min-h-screen bg-surface-0 pt-24 md:pt-28">
      <div className="container-shell pb-24">
        {previewMode && <PreviewNotice />}

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden />
            Your contributions
          </Link>
          <div className="flex items-center gap-3 text-xs text-fg-subtle">
            <span>{wordCount.toLocaleString()} words</span>
            <span aria-hidden>/</span>
            <span className={dirty ? "text-accent-soft" : undefined}>
              {dirty && !previewMode ? "Unsaved changes" : saveMessage}
            </span>
          </div>
        </div>

        <header className="grid gap-7 py-9 md:grid-cols-[minmax(0,1fr)_17rem] md:items-end md:py-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
              {detail.shortLabel}
            </p>
            <h1 className="mt-3 text-[clamp(2.5rem,6vw,5.6rem)] leading-[0.92] tracking-[-0.05em]">
              Write it in your words
            </h1>
          </div>
          <div className="border-l border-accent pl-4 text-sm leading-relaxed text-fg-muted">
            <p>{detail.prompt}</p>
            <p className="mt-2 text-xs text-fg-subtle">Suggested: {detail.suggestedLength}</p>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start">
          <div>
            <section className="border border-line bg-surface-1 p-5 md:p-8">
              <label className="block text-sm font-semibold">
                Title
                <input
                  value={state.title}
                  onChange={(event) =>
                    setState((current) => ({ ...current, title: event.target.value }))
                  }
                  maxLength={140}
                  disabled={!editable}
                  placeholder="Give people a clear reason to read"
                  className={`${inputClass} mt-2 text-xl font-semibold md:text-2xl`}
                />
                <span className="mt-2 block text-right text-xs font-normal text-fg-subtle">
                  {state.title.length}/140
                </span>
              </label>

              <label className="mt-6 block text-sm font-semibold">
                Short introduction
                <textarea
                  value={state.summary}
                  onChange={(event) =>
                    setState((current) => ({ ...current, summary: event.target.value }))
                  }
                  rows={3}
                  maxLength={320}
                  disabled={!editable}
                  placeholder="Tell readers what this is about in one or two sentences"
                  className={`${inputClass} mt-2 resize-y`}
                />
                <span className="mt-2 block text-right text-xs font-normal text-fg-subtle">
                  {state.summary.length}/320
                </span>
              </label>
            </section>

            <section className="mt-6 border border-line bg-surface-1 p-5 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl">Cover image</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
                    Use one strong image that belongs with the story. It will
                    appear in the hub and at the top of the article.
                  </p>
                </div>
                <span className="text-xs text-fg-subtle">JPG or WebP · 16:9 works best</span>
              </div>

              {cover && (
                <div className="mt-5 aspect-[16/8] overflow-hidden rounded-2xl border border-line bg-surface-2">
                  <img
                    src={cover.url}
                    alt={cover.altText}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <label className="mt-5 block text-sm font-semibold">
                Image description
                <input
                  value={coverAlt}
                  onChange={(event) => setCoverAlt(event.target.value)}
                  disabled={!editable || assetBusy}
                  maxLength={180}
                  placeholder="Describe what is visible for someone who cannot see the image"
                  className={`${inputClass} mt-2`}
                />
                <span className="mt-2 block text-right text-xs font-normal text-fg-subtle">
                  {coverAlt.length}/180
                </span>
              </label>

              {editable && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label
                    className={`inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white ${
                      assetBusy || coverAlt.trim().length < 4
                        ? "cursor-not-allowed opacity-40"
                        : "cursor-pointer"
                    }`}
                  >
                    <ImagePlus size={16} aria-hidden />
                    {assetBusy ? "Working..." : cover ? "Replace cover" : "Choose cover"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={assetBusy || coverAlt.trim().length < 4}
                      onChange={(event) => void uploadCover(event)}
                      className="sr-only"
                    />
                  </label>
                  {cover && coverAlt.trim() !== savedCoverAlt && (
                    <button
                      type="button"
                      disabled={assetBusy || coverAlt.trim().length < 4}
                      onClick={() => void saveCoverDescription()}
                      className="rounded-full border border-line-strong px-5 py-3 text-sm font-bold transition hover:border-accent hover:text-accent disabled:opacity-40"
                    >
                      Save description
                    </button>
                  )}
                </div>
              )}
              {assetMessage && (
                <p role="status" className="mt-4 text-sm text-fg-muted">
                  {assetMessage}
                </p>
              )}
            </section>

            <section className="mt-6 space-y-3">
              {state.content.blocks.map((block, index) => (
                <article
                  key={block.id}
                  className="group border border-line bg-surface-1 p-4 transition focus-within:border-accent/50 md:p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={block.type}
                        onChange={(event) =>
                          updateBlock(block.id, {
                            type: event.target.value as ContributionBlockType,
                          })
                        }
                        aria-label="Section type"
                        disabled={!editable}
                        className="rounded-full border border-line-strong bg-surface-0 px-3 py-1.5 text-xs font-semibold"
                      >
                        <option value="paragraph">Text</option>
                        <option value="heading">Heading</option>
                        <option value="quote">Quote</option>
                      </select>
                      <span className="text-xs text-fg-subtle">Section {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconButton label="Move up" onClick={() => moveBlock(index, -1)} disabled={!editable || index === 0}>
                        <ArrowUp size={15} />
                      </IconButton>
                      <IconButton label="Move down" onClick={() => moveBlock(index, 1)} disabled={!editable || index === state.content.blocks.length - 1}>
                        <ArrowDown size={15} />
                      </IconButton>
                      <IconButton label="Remove section" onClick={() => removeBlock(block.id)} disabled={!editable || state.content.blocks.length === 1}>
                        <Trash2 size={15} />
                      </IconButton>
                    </div>
                  </div>
                  <textarea
                    value={block.text}
                    onChange={(event) => updateBlock(block.id, { text: event.target.value })}
                    rows={block.type === "paragraph" ? 7 : block.type === "heading" ? 2 : 4}
                    disabled={!editable}
                    placeholder={
                      block.type === "heading"
                        ? "Name this part of the story"
                        : block.type === "quote"
                          ? "Use your own words or credit the person who said this"
                          : "Write naturally. This stays in your voice."
                    }
                    className={`w-full resize-y bg-transparent text-fg placeholder:text-fg-subtle focus:outline-none ${
                      block.type === "heading"
                        ? "text-2xl font-semibold leading-tight md:text-3xl"
                        : block.type === "quote"
                          ? "border-l-2 border-accent pl-4 text-lg italic leading-relaxed"
                          : "min-h-44 leading-[1.75]"
                    }`}
                  />
                </article>
              ))}
            </section>

            {editable && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <AddButton label="Text" icon={<ListPlus size={16} />} onClick={() => addBlock("paragraph")} />
              <AddButton label="Heading" icon={<Type size={16} />} onClick={() => addBlock("heading")} />
              <AddButton label="Quote" icon={<Quote size={16} />} onClick={() => addBlock("quote")} />
              <button
                type="button"
                disabled
                title="Image uploads are added in the media stage"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-3 text-sm text-fg-subtle opacity-60"
              >
                <ImagePlus size={16} aria-hidden />
                Image
              </button>
            </div>
            )}

            <section className="mt-8 border-y border-line py-7">
              <h2 className="text-2xl">Before you submit</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                These promises protect your voice and everyone featured in the contribution.
              </p>
              <div className="mt-5 space-y-4">
                <Confirmation
                  checked={state.originalWorkConfirmed}
                  disabled={!editable}
                  onChange={(checked) => setState((current) => ({ ...current, originalWorkConfirmed: checked }))}
                >
                  I wrote this contribution and have permission to share the material in it.
                </Confirmation>
                <Confirmation
                  checked={state.noGeneratedTextConfirmed}
                  disabled={!editable}
                  onChange={(checked) => setState((current) => ({ ...current, noGeneratedTextConfirmed: checked }))}
                >
                  I have not used generative AI to create or rewrite the title, summary or article.
                </Confirmation>
                <Confirmation
                  checked={state.imageRightsConfirmed}
                  disabled={!editable}
                  onChange={(checked) => setState((current) => ({ ...current, imageRightsConfirmed: checked }))}
                >
                  I own any images I add, or I have permission to publish them through NAMI.
                </Confirmation>
              </div>
            </section>

            {editable ? (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void persistDraft("save")}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-bold transition hover:border-accent hover:text-accent"
              >
                <Save size={16} aria-hidden />
                Save draft
              </button>
              <button
                type="button"
                onClick={() => setShowPreview((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-bold transition hover:border-accent hover:text-accent xl:hidden"
              >
                <Eye size={16} aria-hidden />
                {showPreview ? "Hide preview" : "Preview"}
              </button>
              <button
                type="button"
                onClick={() => void persistDraft("submit")}
                disabled={!canSubmit || previewMode || busy}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={16} aria-hidden />
                Submit for review
              </button>
              {!canSubmit && (
                <p className="w-full text-xs text-fg-subtle sm:w-auto">
                  Add a title, introduction, some writing and complete all three confirmations.
                </p>
              )}
              {error && (
                <p role="alert" className="w-full text-sm text-red-300">
                  {error}
                </p>
              )}
            </div>
            ) : (
              <div className="mt-7 border-l-2 border-accent pl-4 text-sm leading-relaxed text-fg-muted">
                {initialDraft?.status === "submitted" || initialDraft?.status === "under_review"
                  ? "This contribution is locked while NAMI reviews it. Your submitted words cannot be changed during review."
                  : "This submitted contribution is read only. Its saved version remains part of the moderation record."}
              </div>
            )}
          </div>

          <aside className={`${showPreview ? "block" : "hidden"} xl:sticky xl:top-28 xl:block`}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-accent">
              Live preview
            </p>
            <ArticlePreview state={state} format={format} cover={cover} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function ArticlePreview({
  state,
  format,
  cover,
}: {
  state: BuilderState;
  format: ContributionFormat;
  cover: ContributionAssetView | null;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-line bg-surface-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_70%_25%,rgb(255_0_188/0.28),transparent_34%),linear-gradient(145deg,#18141a,#0c0d0f)] p-5">
        {cover && (
          <img
            src={cover.url}
            alt={cover.altText}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {cover && <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />}
        <div className="flex h-full items-end">
          <span className="relative rounded-full border border-accent/50 bg-black/30 px-3 py-1 text-[0.65rem] font-semibold text-white backdrop-blur">
            {contributionFormatDetails[format].shortLabel}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-accent">
          From the Network
        </p>
        <h2 className="mt-3 text-2xl leading-[1] tracking-[-0.035em]">
          {state.title || "Your title will appear here"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          {state.summary || "Your short introduction will help people decide whether to read on."}
        </p>
        <div className="mt-6 space-y-4 border-t border-line pt-5 text-sm leading-relaxed text-fg-muted">
          {state.content.blocks.filter((block) => block.text.trim()).slice(0, 4).map((block) =>
            block.type === "heading" ? (
              <h3 key={block.id} className="text-lg text-fg">{block.text}</h3>
            ) : block.type === "quote" ? (
              <blockquote key={block.id} className="border-l-2 border-accent pl-3 italic text-fg">{block.text}</blockquote>
            ) : (
              <p key={block.id}>{block.text}</p>
            ),
          )}
          {!state.content.blocks.some((block) => block.text.trim()) && (
            <p>Your writing will appear here as you add it.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Confirmation({
  checked,
  disabled = false,
  onChange,
  children,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex items-start gap-3 text-sm leading-relaxed text-fg-muted ${disabled ? "cursor-default" : "cursor-pointer"}`}>
      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border ${checked ? "border-accent bg-accent text-white" : "border-line-strong bg-surface-0"}`}>
        {checked && <Check size={14} aria-hidden />}
      </span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="sr-only" />
      <span>{children}</span>
    </label>
  );
}

function AddButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong px-3 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent">
      {icon}
      {label}
    </button>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className="grid size-8 place-items-center rounded-full text-fg-subtle transition hover:bg-surface-2 hover:text-accent disabled:opacity-25">
      {children}
    </button>
  );
}

function PreviewNotice() {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
      <FileText size={16} className="text-accent" aria-hidden />
      Local preview. Writing and autosave stay in this browser session.
    </div>
  );
}
