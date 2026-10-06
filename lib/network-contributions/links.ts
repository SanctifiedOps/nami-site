export function normaliseContributionUrl(value: string | null | undefined) {
  const raw = value?.trim();
  if (!raw) return null;

  try {
    const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export type ContributionVideoSource =
  | { kind: "embed"; url: string; title: string }
  | { kind: "file"; url: string }
  | { kind: "link"; url: string };

export function contributionVideoSource(
  value: string | null | undefined,
): ContributionVideoSource | null {
  const safeUrl = normaliseContributionUrl(value);
  if (!safeUrl) return null;

  const url = new URL(safeUrl);
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  let videoId = "";

  if (hostname === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
  } else if (hostname === "youtube.com" || hostname === "m.youtube.com") {
    if (url.pathname === "/watch") videoId = url.searchParams.get("v") ?? "";
    if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.split("/").filter(Boolean)[1] ?? "";
    }
  }

  if (/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
    return {
      kind: "embed",
      url: `https://www.youtube-nocookie.com/embed/${videoId}`,
      title: "YouTube video",
    };
  }

  if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
    const vimeoId = url.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
    if (vimeoId) {
      return {
        kind: "embed",
        url: `https://player.vimeo.com/video/${vimeoId}`,
        title: "Vimeo video",
      };
    }
  }

  if (hostname === "loom.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const shareIndex = parts.indexOf("share");
    const loomId = shareIndex >= 0 ? parts[shareIndex + 1] : "";
    if (/^[A-Za-z0-9]+$/.test(loomId)) {
      return {
        kind: "embed",
        url: `https://www.loom.com/embed/${loomId}`,
        title: "Loom video",
      };
    }
  }

  if (/\.(mp4|webm|ogg)(?:$|\?)/i.test(safeUrl)) {
    return { kind: "file", url: safeUrl };
  }

  return { kind: "link", url: safeUrl };
}
