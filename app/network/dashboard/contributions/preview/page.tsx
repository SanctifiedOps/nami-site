import { notFound } from "next/navigation";
import { ContributionDashboard } from "../contribution-dashboard";

export const metadata = {
  title: "Publishing foundation preview",
  robots: { index: false, follow: false },
};

export default function ContributionsPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <ContributionDashboard
      firstName="Joe"
      previewMode
      contributions={[
        {
          id: "studio-wall-preview",
          format: "project_story",
          title: "What happened when I stopped treating the studio wall as storage",
          summary:
            "A small change to the space altered how I plan work, notice connections and decide what deserves more time.",
          status: "draft",
          updatedAt: "2026-09-30T18:00:00.000Z",
        },
        {
          id: "pricing-preview",
          format: "field_note",
          title: "The first time I said the price without apologising",
          summary:
            "A short note about pricing creative work and the strange silence after sending a quote.",
          status: "changes_requested",
          updatedAt: "2026-09-29T14:20:00.000Z",
          adminFeedback:
            "Please confirm that the client is comfortable being named, or remove their name before resubmitting.",
        },
        {
          id: "risograph-preview",
          format: "useful_resource",
          title: "A practical first guide to risograph printing in the North East",
          summary:
            "What to prepare, where colour behaves differently and what I wish I knew before my first print run.",
          status: "published",
          updatedAt: "2026-09-25T10:00:00.000Z",
          publishedAt: "2026-09-26T08:00:00.000Z",
        },
      ]}
    />
  );
}

