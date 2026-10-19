"use client";
// components/tabs/CommunityTab.tsx
// Embedded community feed tab — receives identity from YearPortal.
// No localStorage reads, no redirects. Pure props-driven.

import { MessageCircle } from "lucide-react";
import FeedShell  from "../community/FeedShell";

interface Props {
  studentId:      string | null;   // null = not signed in (student ID or account)
  studentName:    string;
  yearLevel:      number;
  onRequestLogin: () => void;      // opens CommunityLoginModal in YearPortal
}

export function CommunityTab({
  studentId,
  studentName,
  yearLevel,
  onRequestLogin,
}: Props) {

  // ── LOCKED STATE — no session ────────────────────────────────
  if (!studentId) {
    return (
      <div className="community-locked">
        <div className="community-locked-icon" aria-hidden="true"><MessageCircle size={26} /></div>
        <h2 className="community-locked-title">Community Feed</h2>
        <p className="community-locked-sub">
          Sign in with your student ID or an account to read and post
          in the community feed. Signing in is optional.
        </p>
        <button
          className="btn btn-primary community-locked-btn"
          onClick={onRequestLogin}
        >
          Sign in to access
        </button>
      </div>
    );
  }

  // ── AUTHENTICATED STATE ──────────────────────────────────────
  return (
    <div className="community-tab">
      <FeedShell
        authorId={studentId}
        authorName={studentName}
        yearLevel={yearLevel}
      />
    </div>
  );
}
