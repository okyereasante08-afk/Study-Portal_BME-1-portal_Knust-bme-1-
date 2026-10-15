// app/api/og/route.ts
// Server-side OG proxy — avoids CORS on client, caches results.
// Usage: GET /api/og?url=https://example.com

import { NextRequest, NextResponse } from "next/server";
import { fetchOG } from "../../lib/parseMedia";

export const runtime = "edge"; // fast, globally distributed

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url param required" }, { status: 400 });
  }

  // Basic URL validation
  try { new URL(url); } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  // Block internal/private URLs
  const blocked = ["localhost", "127.0.0.1", "0.0.0.0", "192.168.", "10.", "172."];
  if (blocked.some(b => url.includes(b))) {
    return NextResponse.json({ error: "blocked" }, { status: 403 });
  }

  const og = await fetchOG(url);

  return NextResponse.json(og, {
    headers: {
      // Cache for 1 hour at the edge
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
