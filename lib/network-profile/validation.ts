import { z } from "zod";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import { normalizeInstagramProfileUrl, normalizeProfileUrl } from "./links";

function optionalLink(normalize: (value: unknown) => string) {
  return z.string().trim().max(500).transform((value, context) => {
    if (!value) return "";
    const normalized = normalize(value);
    if (!normalized) {
      context.addIssue({ code: "custom", message: "Enter a valid website or profile link." });
      return z.NEVER;
    }
    return normalized;
  });
}

const emptyOrUrl = optionalLink(normalizeProfileUrl);
const emptyOrInstagram = optionalLink(normalizeInstagramProfileUrl);

export const memberProfileSchema = z.object({
  displayName: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(120),
  primaryGroup: z.enum(directoryGroups.map((group) => group.slug) as [string, ...string[]]),
  speciality: z.string().trim().min(2).max(80),
  bio: z.string().trim().min(20).max(800),
  websiteUrl: emptyOrUrl,
  instagramUrl: emptyOrInstagram,
  facebookUrl: emptyOrUrl,
  linkedinUrl: emptyOrUrl,
  tiktokUrl: emptyOrUrl,
  youtubeUrl: emptyOrUrl,
});

export type MemberProfileInput = z.infer<typeof memberProfileSchema>;
