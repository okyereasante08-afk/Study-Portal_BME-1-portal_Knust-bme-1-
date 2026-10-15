"use client";
// app/community/page.tsx
// Drop this at: app/community/page.tsx in your Next.js project.
// Reads student identity from localStorage (same keys as the rest of the portal).

import { useEffect, useState } from "react";
import FeedShell from "../components/community/FeedShell";

export default function CommunityPage() {
  const [authorId,   setAuthorId]   = useState<string | null>(null);
  const [authorName, setAuthorName] = useState<string>("BME Student");
  const [yearLevel,  setYearLevel]  = useState<number | null>(null);
  const [ready,      setReady]      = useState(false);

  useEffect(() => {
    // Read identity from the portal's localStorage keys
    const id   = localStorage.getItem("bme-session-id");
    const name = localStorage.getItem("bme-name") ?? "BME Student";
    const year = localStorage.getItem("bme-year");

    if (!id) {
      // Not logged in — redirect to portal root
      window.location.replace("/");
      return;
    }

    setAuthorId(id);
    setAuthorName(name);
    setYearLevel(year ? parseInt(year, 10) : null);
    setReady(true);
  }, []);

  if (!ready || !authorId) {
    return (
      <div className="community-loading">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <main className="community-page">
      <div className="community-header">
        <h1 className="community-title">Community</h1>
        <p className="community-subtitle">
          KNUST Biomedical Engineering · {yearLevel ? `Year ${yearLevel}` : "All years"}
        </p>
      </div>
      <FeedShell
        authorId={authorId}
        authorName={authorName}
        yearLevel={yearLevel}
      />
    </main>
  );
}
