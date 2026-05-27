// app/components/ui.tsx
// ============================================================
// SHARED UI COMPONENTS — Avatar, AttendanceBadge
// ============================================================

import React from "react";
import { AT_RISK_THRESHOLD } from "@/lib/data";

export const Avatar = ({
  name, size = 36, onClick, photoUrl,
}: {
  name: string; size?: number; onClick?: () => void; photoUrl?: string | null;
}) => {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  if (photoUrl) {
    return (
      <img src={photoUrl} alt={name} onClick={onClick}
        title={onClick ? "Go to profile" : undefined}
        style={{ width: size, height: size, borderRadius: size / 2, objectFit: "cover", cursor: onClick ? "pointer" : "default", border: "2px solid #e8d5c4", flexShrink: 0 }} />
    );
  }
  return (
    <div onClick={onClick} title={onClick ? "Go to profile" : undefined}
      style={{ width: size, height: size, borderRadius: size / 2, background: "linear-gradient(135deg, #e8d5c4, #c9a87c)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: onClick ? "pointer" : "default", transition: "opacity 0.15s" }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.opacity = "0.8"; }}
      onMouseLeave={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}>
      <span style={{ fontSize: size * 0.36, fontWeight: 700, color: "#5c3d1e", fontFamily: "'Syne', sans-serif" }}>{initials}</span>
    </div>
  );
};

export const AttendanceBadge = ({ pct }: { pct: number }) => {
  const atRisk = pct < AT_RISK_THRESHOLD;
  const label = atRisk ? <><em><strong>At Risk</strong></em></> : "On track";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(45,36,22,0.07)", color: "#2d2416" }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: "#2d2416", display: "inline-block" }} /> {label}
    </span>
  );
};
