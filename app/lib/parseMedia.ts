import type { OGData, PostKind } from "./community";

// ── YOUTUBE ──────────────────────────────────────────────────
// Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID,
//          youtube.com/embed/ID, youtube.com/v/ID
const YT_PATTERNS = [
  /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
  /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  /(?:youtube\.com\/v\/)([A-Za-z0-9_-]{11})/,
];

export function extractYouTubeId(url: string): string | null {
  for (const pattern of YT_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function ytThumbnail(videoId: string): string {
  // maxresdefault > hqdefault as fallback
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function ytEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

// ── LINK DETECTION ───────────────────────────────────────────
const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

export function extractFirstUrl(text: string): string | null {
  const match = text.match(URL_REGEX);
  return match?.[0] ?? null;
}

// ── POST KIND DETECTION ───────────────────────────────────────
// Given raw composer input, decide what kind of post this is.
export function detectPostKind(text: string): PostKind {
  const url = extractFirstUrl(text);
  if (!url) return "text";
  if (extractYouTubeId(url)) return "youtube";
  return "link";
}

// ── OG FETCH (called server-side in /api/og) ─────────────────
export async function fetchOG(url: string): Promise<OGData> {
  const fallback: OGData = { title: null, description: null, image: null, site_name: null, url };
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "BMEPortalBot/1.0 (link preview)" },
      next: { revalidate: 3600 }, // cache 1 hour in Next.js
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return fallback;
    const html = await res.text();

    const get = (prop: string): string | null => {
      // Try og:prop first, then name=prop, then twitter:prop
      const patterns = [
        new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, "i"),
        new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta[^>]+name=["']twitter:${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m?.[1]) return m[1].trim();
      }
      return null;
    };

    // Title: og:title → <title>
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = get("title") ?? titleMatch?.[1]?.trim() ?? null;

    return {
      title,
      description: get("description"),
      image:       get("image"),
      site_name:   get("site_name") ?? new URL(url).hostname.replace(/^www\./, ""),
      url,
    };
  } catch {
    return fallback;
  }
}
