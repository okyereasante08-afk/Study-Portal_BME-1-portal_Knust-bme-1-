"use client";
import { useState, useRef, useCallback } from "react";
import { Film, Link2 } from "lucide-react";
import type { FeedScope, NewPostPayload } from "../../lib/community";
import { detectPostKind, extractFirstUrl, extractYouTubeId } from "../../lib/parseMedia";
import { createPost } from "../../lib/supabase";
import type { Post } from "../../lib/community";

interface Props {
  authorId:   string;
  authorName: string;
  scope:      FeedScope;
  yearLevel:  number | null;
  onPost:     (post: Post) => void;
}

export default function PostComposer({ authorId, authorName, scope, yearLevel, onPost }: Props) {
  const [body, setBody]           = useState("");
  const [isAnon, setIsAnon]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [preview, setPreview]     = useState<"link"|"youtube"|null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Detect link/youtube as user types
  const handleChange = useCallback((val: string) => {
    setBody(val);
    setError(null);
    const url = extractFirstUrl(val);
    if (!url) { setPreview(null); return; }
    setPreview(extractYouTubeId(url) ? "youtube" : "link");
  }, []);

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    if (trimmed.length > 2000) { setError("Post must be under 2000 characters."); return; }

    setLoading(true);
    setError(null);
    try {
      const kind = detectPostKind(trimmed);
      const url  = extractFirstUrl(trimmed);
      const payload: NewPostPayload = {
        author_id:    authorId,
        author_name:  authorName,
        is_anonymous: isAnon,
        scope,
        year_level:   scope === "class" ? yearLevel : null,
        kind,
        body:         trimmed,
        media_url:    url ?? undefined,
      };
      const post = await createPost(payload);
      onPost(post);
      setBody("");
      setPreview(null);
      textRef.current?.focus();
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = body.length;
  const overLimit = charCount > 2000;

  return (
    <div className="post-composer card">
      {/* Identity row */}
      <div className="composer-identity">
        <div className="avatar identity-avatar">
          {isAnon ? "?" : authorName.charAt(0).toUpperCase()}
        </div>
        <div className="identity-info">
          <span className="identity-name">
            {isAnon ? "Anonymous" : authorName}
          </span>
          <span className="identity-scope">
            {scope === "general" ? "General Feed" : `Year ${yearLevel} Class Feed`}
          </span>
        </div>
        {/* Anon toggle */}
        <label className="anon-toggle" title="Post anonymously">
          <input
            type="checkbox"
            checked={isAnon}
            onChange={e => setIsAnon(e.target.checked)}
          />
          <span className="anon-track">
            <span className="anon-thumb" />
          </span>
          <span className="anon-label">Anonymous</span>
        </label>
      </div>

      {/* Textarea */}
      <textarea
        ref={textRef}
        className="composer-input"
        placeholder={
          scope === "general"
            ? "Share something with the BME community..."
            : `Post to Year ${yearLevel} class feed...`
        }
        value={body}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
        rows={3}
        maxLength={2100}
      />

      {/* Preview pill */}
      {preview && (
        <div className="composer-preview-pill">
          {preview === "youtube"
            ? <><Film size={13} /> YouTube video detected</>
            : <><Link2 size={13} /> Link preview will be generated</>}
        </div>
      )}

      {/* Footer row */}
      <div className="composer-footer">
        <span className={`char-count ${overLimit ? "over" : charCount > 1800 ? "warn" : ""}`}>
          {charCount}/2000
        </span>
        {error && <span className="composer-error">{error}</span>}
        <button
          className="btn btn-primary compose-btn"
          onClick={handleSubmit}
          disabled={loading || !body.trim() || overLimit}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
