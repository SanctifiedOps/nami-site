import { normalizeExternalUrl } from "@/lib/external-url";

function cleanCandidate(value: string) {
  return value
    .trim()
    .replace(/^htpps:\/\//i, "https://")
    .replace(/^[<(\[]+|[>)\],;]+$/g, "");
}

export function normalizeProfileUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  const candidates = trimmed.split(/\s+/).map(cleanCandidate).filter(Boolean).reverse();
  for (const candidate of candidates) {
    const normalized = normalizeExternalUrl(candidate);
    if (!normalized) continue;
    try {
      const url = new URL(normalized);
      if (url.hostname.includes(".")) return url.toString();
    } catch {
      // Try the next token.
    }
  }
  return "";
}

export function normalizeInstagramProfileUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  const candidate = trimmed.split(/[\s,]+/).find((part) =>
    part.startsWith("@") || /^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i.test(part),
  ) ?? trimmed;
  const handle = candidate
    .replace(/^https?:\/\/(?:www\.)?instagram\.com\//i, "")
    .replace(/^(?:www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0];

  return /^[a-z0-9._]+$/i.test(handle)
    ? `https://www.instagram.com/${handle}/`
    : "";
}
