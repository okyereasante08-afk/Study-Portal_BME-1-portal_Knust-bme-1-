"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Globe, GraduationCap, Inbox, Check } from "lucide-react";
import type { FeedScope, Post } from "../../lib/community";
import { fetchPosts, getLikedPostIds, subscribeToFeed } from "../../lib/supabase";
import PostComposer from "./PostComposer";
import PostCard from "./PostCard";

interface Props {
  authorId:   string;
  authorName: string;
  yearLevel:  number | null;
}

export default function FeedShell({ authorId, authorName, yearLevel }: Props) {
  const [scope,     setScope]     = useState<FeedScope>("general");
  const [posts,     setPosts]     = useState<Post[]>([]);
  const [likedIds,  setLikedIds]  = useState<Set<string>>(new Set());
  const [loading,   setLoading]   = useState(false);
  const [hasMore,   setHasMore]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // ── FETCH page ─────────────────────────────────────────────
  const loadPage = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const cursor = reset ? undefined : posts[posts.length - 1]?.created_at;
      const page = await fetchPosts(scope, scope === "class" ? yearLevel : null, cursor);
      setPosts(prev => reset ? page : [...prev, ...page]);
      setHasMore(page.length === 20);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, [scope, yearLevel, posts, loading]);

  // ── INITIAL LOAD + scope change ───────────────────────────
  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    loadPage(true);
    // Load liked IDs
    getLikedPostIds(authorId).then(ids => setLikedIds(ids));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, yearLevel]);

  // ── REALTIME SUBSCRIPTION ─────────────────────────────────
  useEffect(() => {
    const unsub = subscribeToFeed(scope, scope === "class" ? yearLevel : null, (newPost) => {
      // Don't duplicate own posts (already added optimistically via onPost)
      setPosts(prev => {
        if (prev.some(p => p.id === newPost.id)) return prev;
        return [newPost, ...prev];
      });
    });
    return unsub;
  }, [scope, yearLevel]);

  // ── INFINITE SCROLL ───────────────────────────────────────
  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) loadPage();
    }, { threshold: 0.1 });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [hasMore, loading, loadPage]);

  // ── HANDLERS ──────────────────────────────────────────────
  const handlePost = useCallback((post: Post) => {
    setPosts(prev => [post, ...prev]);
  }, []);

  const handleDelete = useCallback((postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  const handleLikeChange = useCallback((postId: string, liked: boolean) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      liked ? next.add(postId) : next.delete(postId);
      return next;
    });
  }, []);

  return (
    <div className="feed-shell">
      {/* Feed switcher */}
      <div className="segmented feed-switcher" role="group" aria-label="Feed">
        <button
          className="feed-tab"
          aria-pressed={scope === "general"}
          onClick={() => setScope("general")}
        >
          <Globe size={14} /> General
        </button>
        <button
          className="feed-tab"
          aria-pressed={scope === "class"}
          onClick={() => setScope("class")}
          disabled={!yearLevel}
          title={!yearLevel ? "Select your year to access the class feed" : undefined}
        >
          <GraduationCap size={14} /> Year {yearLevel ?? "?"} Class
        </button>
      </div>

      {/* Scope description */}
      <p className="feed-scope-desc">
        {scope === "general"
          ? "Posts visible to all BME students across all year groups."
          : `Posts visible only to Year ${yearLevel} students.`}
      </p>

      {/* Composer */}
      <PostComposer
        authorId={authorId}
        authorName={authorName}
        scope={scope}
        yearLevel={scope === "class" ? yearLevel : null}
        onPost={handlePost}
      />

      {/* Error state */}
      {error && (
        <div className="feed-error" role="alert">
          <p>{error}</p>
          <button className="btn btn-sm" onClick={() => loadPage(true)}>Retry</button>
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && !error && (
        <div className="feed-empty card-soft">
          <div className="feed-empty-icon" aria-hidden="true"><Inbox size={26} /></div>
          <p className="feed-empty-title">Nothing here yet</p>
          <p className="feed-empty-sub">Be the first to post in the {scope === "general" ? "general feed" : `Year ${yearLevel} class feed`}.</p>
        </div>
      )}

      {/* Posts */}
      <div className="feed-list">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            authorId={authorId}
            authorName={authorName}
            isLiked={likedIds.has(post.id)}
            onDelete={handleDelete}
            onLikeChange={handleLikeChange}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={loaderRef} className="feed-loader">
        {loading && (
          <div className="feed-spinner">
            <span className="spinner" />
            <span>Loading more posts…</span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="feed-end"><Check size={14} /> You&apos;re all caught up</p>
        )}
      </div>
    </div>
  );
}
