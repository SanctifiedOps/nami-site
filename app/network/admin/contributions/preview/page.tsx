import { notFound } from "next/navigation";
import { ModerationDashboard } from "../moderation-dashboard";

export const metadata = {
  title: "Contribution review preview | NAMI Network admin",
  robots: { index: false, follow: false },
};

export default function ContributionModerationPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const now = Date.now();
  const iso = (hoursAgo: number) =>
    new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();

  return (
    <ModerationDashboard
      adminName="Joe"
      previewMode
      contributions={[
        {
          id: "studio-wall-preview",
          format: "project_story",
          title: "What painting a studio wall taught me about working in public",
          summary:
            "A short account of making a mural while the building stayed open, and what changed when people could watch it develop.",
          status: "submitted",
          memberName: "Mara Bell",
          memberEmail: "mara@preview.local",
          submittedAt: iso(3),
          updatedAt: iso(3),
          adminFeedback: null,
        },
        {
          id: "tour-poster-preview",
          format: "field_note",
          title: "Three things I learned printing my first tour poster",
          summary:
            "A quick note on paper stock, small type and why I now print a full-size proof before sending anything away.",
          status: "under_review",
          memberName: "Eleanor Osada",
          memberEmail: "eleanor@preview.local",
          submittedAt: iso(26),
          updatedAt: iso(5),
          adminFeedback: null,
        },
        {
          id: "market-table-preview",
          format: "useful_resource",
          title: "A practical checklist for your first makers market",
          summary:
            "The packing list I wish I had before my first stall, including the unglamorous things that saved the day.",
          status: "changes_requested",
          memberName: "Robin Grey",
          memberEmail: "robin@preview.local",
          submittedAt: iso(74),
          updatedAt: iso(12),
          adminFeedback: "Please add the photographer credit for the market image.",
        },
        {
          id: "venue-access-preview",
          format: "member_story",
          title: "Making small music venues easier to enter",
          summary:
            "Notes from a year of asking venues better questions about access before the doors open.",
          status: "approved",
          memberName: "Tessa North",
          memberEmail: "tessa@preview.local",
          submittedAt: iso(120),
          updatedAt: iso(48),
          adminFeedback: null,
        },
      ]}
    />
  );
}
