"use client";
import { useState, useCallback } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import type { Post, Comment } from "../../lib/community";
import MediaEmbed from "./MediaEmbed";
import { toggleLike, fetchComments, addComment, deletePost } from "../../lib/supabase";

interface Props {
  post:       Post;
  authorId:   string;
  authorName: string;
  isLiked:    boolean;
  onDelete:   (postId: string) => void;
  onLikeChange: (postId: string, liked: boolean) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (mins < 1)    return "just now";
  if (mins < 60)   return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days < 7)    return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function PostCard({ post, authorId, authorName, isLiked, onDelete, onLikeChange }: Props) {
  const [likeCount,    setLikeCount]    = useState(post.like_count);
  const [liked,        setLiked]        = useState(isLiked);
  const [showComments, setShowComments] = useState(false);
  const [comments,     setComments]     = useState<Comment[]>([]);
  const [commentBody,  setCommentBody]  = useState("");
  const [anonComment,  setAnonComment]  = useState(false);
  const [loadingC,     setLoadingC]     = useState(false);
  const [postingC,     setPostingC]     = useState(false);
  const [showDelete,   setShowDelete]   = useState(false);
  const isOwner = post.author_id === authorId;

  // ── LIKE ───────────────────────────────────────────────────
  const handleLike = useCallback(async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount(c => nextLiked ? c + 1 : c - 1);
    try {
      await toggleLike(post.id, authorId);
      onLikeChange(post.id, nextLiked);
    } catch {
      // Revert on error
      setLiked(!nextLiked);
      setLikeCount(c => nextLiked ? c - 1 : c + 1);
    }
  }, [liked, post.id, authorId, onLikeChange]);

  // ── COMMENTS ───────────────────────────────────────────────
  const handleToggleComments = useCallback(async () => {
    if (!showComments && comments.length === 0) {
      setLoadingC(true);
      try {
        const data = await fetchComments(post.id);
        setComments(data);
      } finally {
        setLoadingC(false);
      }
    }
    setShowComments(s => !s);
  }, [showComments, comments.length, post.id]);

  const handleAddComment = async () => {
    if (!commentBody.trim()) return;
    setPostingC(true);
    try {
      const comment = await addComment(post.id, authorId, authorName, commentBody.trim(), anonComment);
      setComments(prev => [...prev, comment]);
      setCommentBody("");
    } finally {
      setPostingC(false);
    }
  };

  // ── DELETE ─────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await deletePost(post.id, authorId);
      onDelete(post.id);
    } catch {}
  };

  const displayName = post.is_anonymous ? "Anonymous" : post.author_name;

  return (
    <article className="post-card card">
      {/* Header */}
      <div className="post-header">
        <div className="avatar post-avatar">
          {post.is_anonymous ? "?" : post.author_name.charAt(0).toUpperCase()}
        </div>
        <div className="post-meta">
          <span className="post-author">
            {displayName}
            {post.is_anonymous && (
              <span className="anon-badge">anonymous</span>
            )}
          </span>
          <span className="post-time">{timeAgo(post.created_at)}</span>
        </div>
        {isOwner && (
          <div className="post-actions-menu">
            <button
              className="post-menu-btn"
              onClick={() => setShowDelete(s => !s)}
              aria-label="Post options"
            >
              <MoreHorizontal size={16} />
            </button>
            {showDelete && (
              <div className="post-dropdown">
                <button className="post-dropdown-item danger" onClick={handleDelete}>
                  Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Body text */}
      {post.body && (
        <p className="post-body">{post.body}</p>
      )}

      {/* Media */}
      <MediaEmbed post={post} />

      {/* Engagement bar */}
      <div className="post-engagement">
        <button
          className={`engage-btn like-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <span className="like-icon"><Heart size={16} fill={liked ? "currentColor" : "none"} /></span>
          <span>{likeCount}</span>
        </button>

        <button
          className="engage-btn comment-btn"
          onClick={handleToggleComments}
          aria-label="Toggle comments"
        >
          <span className="like-icon"><MessageCircle size={16} /></span>
          <span>{Math.max(post.comment_count, comments.length)}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="comments-section">
          {loadingC && <p className="comments-loading">Loading comments…</p>}

          {comments.map(co => (
            <div key={co.id} className="comment">
              <div className="avatar comment-avatar">
                {co.is_anonymous ? "?" : co.author_name.charAt(0).toUpperCase()}
              </div>
              <div className="comment-content">
                <span className="comment-author">
                  {co.is_anonymous ? "Anonymous" : co.author_name}
                </span>
                <p className="comment-body">{co.body}</p>
                <span className="comment-time">{timeAgo(co.created_at)}</span>
              </div>
            </div>
          ))}

          {/* Comment composer */}
          <div className="comment-composer">
            <div className="avatar comment-composer-avatar">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="comment-composer-input-wrap">
              <input
                className="comment-input"
                placeholder="Add a comment…"
                value={commentBody}
                onChange={e => setCommentBody(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleAddComment()}
                maxLength={500}
              />
              <div className="comment-composer-footer">
                <label className="anon-toggle-small">
                  <input
                    type="checkbox"
                    checked={anonComment}
                    onChange={e => setAnonComment(e.target.checked)}
                  />
                  <span>Post anonymously</span>
                </label>
                <button
                  className="btn btn-primary btn-sm comment-post-btn"
                  onClick={handleAddComment}
                  disabled={postingC || !commentBody.trim()}
                >
                  {postingC ? "…" : "Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
