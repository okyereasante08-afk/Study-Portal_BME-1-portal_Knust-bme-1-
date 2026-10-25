import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Post, Comment, NewPostPayload, OGData } from "./community";
import { extractYouTubeId, fetchOG, extractFirstUrl, ytThumbnail } from "./parseMedia";

// Created lazily so importing this module never throws during `next build`
// prerendering. The client is only constructed on first actual use.
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;

  // Must be referenced statically so Next.js can inline NEXT_PUBLIC_* values.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  _client = createClient(url, key, {
    // Optional account sign-in: keep the session in the browser and refresh it automatically.
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return _client;
}

// Drop-in replacement for the previous eager `supabase` export.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

// ── POSTS ────────────────────────────────────────────────────
const PAGE_SIZE = 20;

export async function fetchPosts(
  scope: "general" | "class",
  yearLevel: number | null,
  cursor?: string // created_at of oldest post on current page
): Promise<Post[]> {
  let q = supabase
    .from("posts_with_counts")
    .select("*")
    .eq("scope", scope)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (scope === "class" && yearLevel) q = q.eq("year_level", yearLevel);
  if (cursor) q = q.lt("created_at", cursor);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function createPost(payload: NewPostPayload): Promise<Post> {
  const { body = "", media_url, kind, ...rest } = payload;

  let insert: Record<string, unknown> = { ...rest, body, kind };

  // Resolve media for link and youtube posts
  if (kind === "youtube" && media_url) {
    const vtid = extractYouTubeId(media_url);
    insert = {
      ...insert,
      media_url,
      yt_video_id: vtid,
      media_title: null,   // YouTube title fetched via OG
      media_image: vtid ? ytThumbnail(vtid) : null,
      media_site:  "YouTube",
    };
  } else if (kind === "link" && media_url) {
    const og: OGData = await fetchOG(media_url);
    insert = {
      ...insert,
      media_url,
      media_title: og.title,
      media_desc:  og.description,
      media_image: og.image,
      media_site:  og.site_name,
    };
  } else if (kind === "text" && body) {
    // Auto-detect URLs in body for preview
    const url = extractFirstUrl(body);
    if (url) {
      const og: OGData = await fetchOG(url);
      insert = {
        ...insert,
        media_url:   url,
        media_title: og.title,
        media_desc:  og.description,
        media_image: og.image,
        media_site:  og.site_name,
      };
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .insert(insert)
    .select()
    .single();
  if (error) throw error;
  return { ...data, like_count: 0, comment_count: 0 } as Post;
}

export async function deletePost(postId: string, authorId: string): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", authorId);
  if (error) throw error;
}

// ── LIKES ────────────────────────────────────────────────────
export async function toggleLike(postId: string, authorId: string): Promise<boolean> {
  // Check if already liked
  const { data: existing } = await supabase
    .from("likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("author_id", authorId)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("post_id", postId).eq("author_id", authorId);
    return false; // unliked
  } else {
    await supabase.from("likes").insert({ post_id: postId, author_id: authorId });
    return true;  // liked
  }
}

export async function getLikedPostIds(authorId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from("likes")
    .select("post_id")
    .eq("author_id", authorId);
  return new Set((data ?? []).map((r: { post_id: string }) => r.post_id));
}

// ── COMMENTS ─────────────────────────────────────────────────
export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Comment[];
}

export async function addComment(
  postId: string,
  authorId: string,
  authorName: string,
  body: string,
  isAnonymous: boolean
): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: authorId, author_name: authorName, is_anonymous: isAnonymous, body })
    .select()
    .single();
  if (error) throw error;
  return data as Comment;
}

// ── REALTIME ─────────────────────────────────────────────────
// Returns unsubscribe fn
export function subscribeToFeed(
  scope: "general" | "class",
  yearLevel: number | null,
  onInsert: (post: Post) => void
): () => void {
  const channel = supabase
    .channel(`feed:${scope}:${yearLevel ?? "all"}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      (payload) => {
        const row = payload.new as Post & { scope: string; year_level: number | null };
        if (row.scope !== scope) return;
        if (scope === "class" && row.year_level !== yearLevel) return;
        onInsert({ ...row, like_count: 0, comment_count: 0 });
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}
