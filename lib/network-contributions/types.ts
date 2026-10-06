export const contributionFormats = [
  "project_story",
  "member_story",
  "useful_resource",
  "field_note",
] as const;

export type ContributionFormat = (typeof contributionFormats)[number];

export const contributionStatuses = [
  "draft",
  "submitted",
  "under_review",
  "changes_requested",
  "approved",
  "scheduled",
  "published",
  "rejected",
  "archived",
] as const;

export type ContributionStatus = (typeof contributionStatuses)[number];

export type ContributionBlockType =
  | "paragraph"
  | "heading"
  | "quote"
  | "image"
  | "link"
  | "video";

export type ContributionBlock = {
  id: string;
  type: ContributionBlockType;
  text: string;
  assetId?: string;
  altText?: string;
  url?: string;
};

export type ContributionDocument = {
  version: 1;
  blocks: ContributionBlock[];
};

export type ContributionListItem = {
  id: string;
  format: ContributionFormat;
  title: string;
  summary: string;
  status: ContributionStatus;
  updatedAt: string;
  publishedAt?: string | null;
  adminFeedback?: string | null;
};

export type ContributionDraft = ContributionListItem & {
  content: ContributionDocument;
  originalWorkConfirmed: boolean;
  imageRightsConfirmed: boolean;
  noGeneratedTextConfirmed: boolean;
};

export type ContributionAssetView = {
  id: string;
  kind: "cover" | "inline";
  url: string;
  altText: string;
  caption: string;
  width: number;
  height: number;
};

export type ContributionAssetSnapshot = {
  id: string;
  kind: "cover" | "inline";
  r2Key: string;
  altText: string;
  caption: string;
  position: number;
  width: number;
  height: number;
  contentType: string;
};

export const contributionFormatDetails: Record<
  ContributionFormat,
  {
    label: string;
    shortLabel: string;
    description: string;
    prompt: string;
    suggestedLength: string;
  }
> = {
  project_story: {
    label: "Show your work",
    shortLabel: "Project story",
    description:
      "Share what you made, how it developed and the people involved.",
    prompt: "Tell people what you made and what happened behind the finished work.",
    suggestedLength: "300 to 1,200 words",
  },
  member_story: {
    label: "Tell a story",
    shortLabel: "Member story",
    description:
      "Write about an experience, a turning point or part of your creative life.",
    prompt: "Start with the part of the story that still feels clear to you.",
    suggestedLength: "500 to 1,800 words",
  },
  useful_resource: {
    label: "Share something useful",
    shortLabel: "Useful resource",
    description:
      "Pass on a process, lesson or resource that could help another member.",
    prompt: "What could somebody else do more easily after reading this?",
    suggestedLength: "300 to 1,500 words",
  },
  field_note: {
    label: "Write a field note",
    shortLabel: "Field note",
    description:
      "A quick observation, studio update, small win or useful mistake.",
    prompt: "Share one clear thing while it is still fresh.",
    suggestedLength: "150 to 500 words",
  },
};

export function emptyContributionDocument(
  _format: ContributionFormat,
): ContributionDocument {
  return {
    version: 1,
    blocks: [
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        text: "",
      },
      {
        id: crypto.randomUUID(),
        type: "heading",
        text: "",
      },
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        text: "",
      },
    ],
  };
}
