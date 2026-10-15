"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { usePortal } from "./PortalProvider";
import { STYLES } from "../lib/styles";

/** Light/dark toggle (icon button). */
export function ModeToggle() {
  const { mode, setMode } = usePortal();
  return (
    <button className="icon-btn" aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
      {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

/** Mini visual previews: each style drawn with its own hard-coded look, independent of the active style. */
function Preview({ id }: { id: string }) {
  const base: React.CSSProperties = { height: 64, borderRadius: 10, padding: 8, display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" };
  if (id === "classic")
    return (
      <div style={{ ...base, background: "#fffbf0", border: "1px solid #e1ddd2" }}>
        <div style={{ height: 10, width: "55%", borderRadius: 6, background: "#2d2416" }} />
        <div style={{ height: 22, borderRadius: 8, background: "#fff", border: "1px solid #e1ddd2" }} />
      </div>
    );
  if (id === "brutalist")
    return (
      <div style={{ ...base, background: "#fff", border: "3px solid #0a0f3c" }}>
        <div style={{ height: 10, width: "55%", background: "#1d3dff" }} />
        <div style={{ height: 22, background: "#e10d1f", border: "3px solid #0a0f3c", boxShadow: "3px 3px 0 #0a0f3c" }} />
      </div>
    );
  return (
    <div style={{ ...base, background: "#e8e4f8" }}>
      <div style={{ height: 10, width: "55%", borderRadius: 8, background: "linear-gradient(135deg,#8d7dff,#6a59f0)", boxShadow: "2px 3px 6px rgba(106,89,240,.35)" }} />
      <div style={{ height: 24, borderRadius: 14, background: "#f4f1fe", boxShadow: "5px 5px 10px rgba(116,100,200,.3), -4px -4px 8px #fff, inset -2px -2px 4px rgba(116,100,200,.12)" }} />
    </div>
  );
}

/** Three-way style picker. Styles that aren't built yet are shown but disabled. */
export function StylePicker({ compact = false }: { compact?: boolean }) {
  const { style, setStyle } = usePortal();
  return (
    <div role="radiogroup" aria-label="Interface style" className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
      {STYLES.map((s) => {
        const active = style === s.id;
        return (
          <button key={s.id} role="radio" aria-checked={active} disabled={!s.ready} onClick={() => setStyle(s.id)}
            className="card text-left"
            style={{ padding: 12, opacity: s.ready ? 1 : 0.6, cursor: s.ready ? "pointer" : "not-allowed",
              borderColor: active ? "var(--accent)" : undefined, boxShadow: active ? "0 0 0 1px var(--accent)" : undefined }}>
            <Preview id={s.id} />
            <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
              <span className="h-title" style={{ fontSize: 14 }}>{s.name}</span>
              {!s.ready && <span className="chip">Next up</span>}
              {active && <span className="chip chip-ok">Active</span>}
            </div>
            {!compact && <p className="text-muted-x" style={{ fontSize: 12, margin: "4px 0 0", lineHeight: 1.4 }}>{s.blurb}</p>}
          </button>
        );
      })}
    </div>
  );
}
