"use client";
import { useState } from "react";
import type { Post } from "../../lib/community";
import { ytEmbedUrl } from "../../lib/parseMedia";

// ── YOUTUBE EMBED ─────────────────────────────────────────────
export function YouTubeEmbed({ post }: { post: Post }) {
  const [playing, setPlaying] = useState(false);
  if (!post.yt_video_id) return null;

  return (
    <div className="media-embed yt-embed">
      {playing ? (
        <iframe
          className="yt-player"
          src={ytEmbedUrl(post.yt_video_id)}
          title={post.media_title ?? "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button className="yt-thumbnail-btn" onClick={() => setPlaying(true)} aria-label="Play video">
          {post.media_image ? (
            <img
              src={post.media_image}
              alt={post.media_title ?? "Video thumbnail"}
              className="yt-thumbnail"
              loading="lazy"
            />
          ) : (
            <div className="yt-thumbnail-placeholder" />
          )}
          <div className="yt-play-icon">
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.8 0 34 0 34 0S12.2 0 7.5 1.7a8.5 8.5 0 0 0-6 6C0 11.4 0 24 0 24s0 12.6 1.5 16.3a8.5 8.5 0 0 0 6 6C12.2 48 34 48 34 48s21.8 0 26.5-1.7a8.5 8.5 0 0 0 6-6C68 36.6 68 24 68 24s0-12.6-1.5-16.3z" fill="#ff0000"/>
              <path d="M45 24 27 14v20z" fill="#fff"/>
            </svg>
          </div>
          {post.media_title && (
            <div className="yt-title-bar">
              <span>{post.media_title}</span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}

// ── LINK PREVIEW CARD ─────────────────────────────────────────
export function LinkPreview({ post }: { post: Post }) {
  if (!post.media_url) return null;

  return (
    <a
      href={post.media_url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-preview"
    >
      {post.media_image && (
        <img
          src={post.media_image}
          alt={post.media_title ?? ""}
          className="link-preview-image"
          loading="lazy"
          onError={e => (e.currentTarget.style.display = "none")}
        />
      )}
      <div className="link-preview-body">
        {post.media_site && (
          <span className="link-preview-site">{post.media_site}</span>
        )}
        {post.media_title && (
          <p className="link-preview-title">{post.media_title}</p>
        )}
        {post.media_desc && (
          <p className="link-preview-desc">
            {post.media_desc.length > 120
              ? post.media_desc.slice(0, 120) + "…"
              : post.media_desc}
          </p>
        )}
        <span className="link-preview-url">
          {new URL(post.media_url).hostname.replace(/^www\./, "")}
        </span>
      </div>
    </a>
  );
}

// ── DISPATCHER ────────────────────────────────────────────────
export default function MediaEmbed({ post }: { post: Post }) {
  if (post.kind === "youtube") return <YouTubeEmbed post={post} />;
  if (post.kind === "link" || post.media_url) return <LinkPreview post={post} />;
  return null;
}
