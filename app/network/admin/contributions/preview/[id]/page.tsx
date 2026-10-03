import { notFound } from "next/navigation";
import type { ModerationDetailRecord } from "../../moderation-detail";
import { ModerationDetail } from "../../moderation-detail";

export const metadata = {
  title: "Review contribution preview | NAMI Network admin",
  robots: { index: false, follow: false },
};

export default async function ReviewContributionPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { id } = await params;
  const now = Date.now();
  const iso = (hoursAgo: number) =>
    new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();

  const contribution: ModerationDetailRecord = {
    id,
    format: "project_story",
    title: "What painting a studio wall taught me about working in public",
    summary:
      "A short account of making a mural while the building stayed open, and what changed when people could watch it develop.",
    content: {
      version: 1,
      blocks: [
        {
          id: "opening",
          type: "paragraph",
          text: "I thought the difficult part would be scaling the drawing onto a twelve-metre wall. It turned out to be answering questions while I was halfway up a ladder with a brush in my hand.",
        },
        {
          id: "heading-one",
          type: "heading",
          text: "The room stayed open",
        },
        {
          id: "middle",
          type: "paragraph",
          text: "People passed through all week. Some stopped for ten seconds, some came back each day, and a few told me what the building meant to them. Those conversations changed small parts of the image. A colour became warmer. A face turned slightly towards the door.",
        },
        {
          id: "quote",
          type: "quote",
          text: "The work felt less like a reveal and more like something we had watched grow together.",
        },
        {
          id: "ending",
          type: "paragraph",
          text: "I still like the quiet of a studio, but I would work in public again. It made the process visible, including the awkward bits, and people understood the finished wall differently because they had seen those decisions happen.",
        },
      ],
    },
    status: "under_review",
    memberName: "Mara Bell",
    memberEmail: "mara@preview.local",
    originalWorkConfirmed: true,
    imageRightsConfirmed: true,
    noGeneratedTextConfirmed: true,
    submittedAt: iso(3),
    updatedAt: iso(3),
    adminFeedback: null,
    versionNumber: 1,
    timeline: [
      {
        id: "review",
        eventType: "review_started",
        note: null,
        createdAt: iso(1),
      },
      {
        id: "submitted",
        eventType: "submitted",
        note: null,
        createdAt: iso(3),
      },
      {
        id: "created",
        eventType: "created",
        note: null,
        createdAt: iso(30),
      },
    ],
  };

  return <ModerationDetail contribution={contribution} previewMode />;
}
