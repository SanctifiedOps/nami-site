import "server-only";

import { z } from "zod";
import {
  contributionFormats,
  type ContributionAssetSnapshot,
  type ContributionDocument,
} from "@/lib/network-contributions/types";
import { normaliseContributionUrl } from "@/lib/network-contributions/links";

const contributionBlockSchema = z.object({
  id: z.string().trim().min(1).max(100),
  type: z.enum(["paragraph", "heading", "quote", "image", "video"]),
  text: z.string().max(12000),
  assetId: z.string().uuid().optional(),
  altText: z.string().max(180).optional(),
  url: z.string().max(2048).optional(),
  richText: z.array(z.object({
    text: z.string().max(12000),
    bold: z.boolean().optional(),
    italic: z.boolean().optional(),
    underline: z.boolean().optional(),
    href: z.string().max(2048).optional(),
  })).max(500).optional(),
});

export const contributionDocumentSchema = z.object({
  version: z.literal(1),
  blocks: z.array(contributionBlockSchema).min(1).max(100),
});

export const contributionDraftFieldsSchema = z.object({
  format: z.enum(contributionFormats),
  title: z.string().max(140),
  summary: z.string().max(320),
  content: contributionDocumentSchema,
  originalWorkConfirmed: z.boolean(),
  imageRightsConfirmed: z.boolean(),
  noGeneratedTextConfirmed: z.boolean(),
});

export function contributionPlainText(content: ContributionDocument) {
  return content.blocks
    .map((block) => block.text.trim())
    .filter(Boolean)
    .join("\n\n");
}

export async function contributionContentHash(input: {
  title: string;
  summary: string;
  content: ContributionDocument;
  assets?: ContributionAssetSnapshot[];
}) {
  const canonical = JSON.stringify({
    title: input.title.trim(),
    summary: input.summary.trim(),
    content: input.content,
    assets: [...(input.assets ?? [])]
      .sort((left, right) => left.position - right.position || left.id.localeCompare(right.id))
      .map((asset) => ({
        id: asset.id,
        kind: asset.kind,
        r2Key: asset.r2Key,
        altText: asset.altText.trim(),
        caption: asset.caption.trim(),
        position: asset.position,
        width: asset.width,
        height: asset.height,
        contentType: asset.contentType,
      })),
  });
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function validateContributionForSubmission(input: {
  title: string;
  summary: string;
  content: ContributionDocument;
  originalWorkConfirmed: boolean;
  imageRightsConfirmed: boolean;
  noGeneratedTextConfirmed: boolean;
}) {
  if (input.title.trim().length < 5) return "Add a clear title before submitting.";
  if (input.summary.trim().length < 20)
    return "Add a short introduction before submitting.";
  if (contributionPlainText(input.content).length < 20)
    return "Add some writing before submitting.";
  if (
    input.content.blocks.some(
      (block) =>
        (block.type === "video" && !normaliseContributionUrl(block.url)) ||
        block.richText?.some(
          (span) => span.href && !normaliseContributionUrl(span.href),
        ),
    )
  ) {
    return "Check the web and video links before submitting.";
  }
  if (!input.originalWorkConfirmed)
    return "Confirm that this is your work before submitting.";
  if (!input.noGeneratedTextConfirmed)
    return "Confirm that the contribution was written without generative AI.";
  if (!input.imageRightsConfirmed)
    return "Confirm the image-rights statement before submitting.";
  return null;
}
