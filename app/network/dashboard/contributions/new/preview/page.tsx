import { notFound } from "next/navigation";
import {
  contributionFormats,
  type ContributionDraft,
  type ContributionFormat,
} from "@/lib/network-contributions/types";
import { ContributionBuilder } from "../contribution-builder";

export const metadata = {
  title: "Contribution writer preview",
  robots: { index: false, follow: false },
};

const sampleDraft: ContributionDraft = {
  id: "studio-wall-preview",
  format: "project_story",
  title: "What happened when I stopped treating the studio wall as storage",
  summary:
    "A small change to the space altered how I plan work, notice connections and decide what deserves more time.",
  status: "draft",
  updatedAt: "2026-09-30T18:00:00.000Z",
  content: {
    version: 1,
    blocks: [
      {
        id: "sample-1",
        type: "paragraph",
        text: "For months, everything I was working on ended up leaning against the same wall. Finished pieces, half-used paper and ideas I kept telling myself I would return to.",
      },
      {
        id: "sample-2",
        type: "heading",
        text: "Making the work visible",
      },
      {
        id: "sample-3",
        type: "paragraph",
        text: "I cleared the wall and began pinning up only the things that still had some energy in them. Seeing them together made connections I had missed while they were sitting in separate folders.",
      },
    ],
  },
  originalWorkConfirmed: false,
  imageRightsConfirmed: false,
  noGeneratedTextConfirmed: false,
};

export default async function ContributionWriterPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ format?: string; sample?: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const params = await searchParams;
  const format = contributionFormats.includes(params.format as ContributionFormat)
    ? (params.format as ContributionFormat)
    : undefined;
  const draft = params.sample && format === sampleDraft.format ? sampleDraft : undefined;

  return <ContributionBuilder previewMode format={format} initialDraft={draft} />;
}

