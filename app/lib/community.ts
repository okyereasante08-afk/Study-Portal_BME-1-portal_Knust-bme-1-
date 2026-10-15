// ── COMMUNITY DASHBOARD TYPES ────────────────────────────────
// Mirrors the Supabase schema exactly. Import these everywhere.

export type FeedScope = "general" | "class";
export type PostKind  = "text" | "link" | "youtube";

export interface Post {
  id:           string;
  created_at:   string;
  updated_at:   string;
  // authorship
  author_id:    string;
  author_name:  string;
  is_anonymous: boolean;
  // routing
  scope:        FeedScope;
  year_level:   number | null;
  // content
  kind:         PostKind;
  body:         string | null;
  // media
  media_url:    string | null;
  media_title:  string | null;
  media_desc:   string | null;
  media_image:  string | null;
  media_site:   string | null;
  yt_video_id:  string | null;
  // counts (from view)
  like_count:     number;
  comment_count:  number;
}

export interface Comment {
  id:           string;
  created_at:   string;
  post_id:      string;
  author_id:    string;
  author_name:  string;
  is_anonymous: boolean;
  body:         string;
}

export interface NewPostPayload {
  author_id:   string;
  author_name: string;
  is_anonymous: boolean;
  scope:       FeedScope;
  year_level:  number | null;
  kind:        PostKind;
  body?:       string;
  media_url?:  string;
}

export interface OGData {
  title:       string | null;
  description: string | null;
  image:       string | null;
  site_name:   string | null;
  url:         string;
}
