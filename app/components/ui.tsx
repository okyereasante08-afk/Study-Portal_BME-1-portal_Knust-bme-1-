"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { EASE } from "../lib/motion";
import type { Session } from "../lib/types";
import type { Attendance } from "./useAttendance";
import { MAX_ATTENDANCE_EDITS } from "../lib/schedule";

export function PageHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 flex-wrap" style={{ marginBottom: 20 }}>
      <div>
        <h2 className="h-display" style={{ fontSize: "clamp(26px, 4vw, 34px)", margin: 0 }}>{title}</h2>
        {sub && <p className="text-muted-x" style={{ fontSize: 13, margin: "6px 0 0" }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="card text-center" style={{ padding: "40px 24px" }}>
      <div className="avatar" style={{ width: 52, height: 52, margin: "0 auto 14px", background: "var(--soft-2)", color: "var(--ink-2)" }}>{icon}</div>
      <h3 className="h-title" style={{ fontSize: 17, margin: "0 0 6px" }}>{title}</h3>
      <p className="text-ink-2" style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>{body}</p>
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}

export function Modal({ title, sub, onClose, sheet, wide, children }: {
  title: string; sub?: string; onClose: () => void; sheet?: boolean; wide?: boolean; children: React.ReactNode;
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <motion.div className={`modal-backdrop ${sheet ? "sheet" : ""}`} onClick={onClose} role="presentation"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <motion.div className={`modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 56, scale: 0.93 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 28, scale: 0.97 }}
        transition={{ duration: 0.65, ease: EASE }}>
        <div className="flex items-center justify-between" style={{ padding: "18px 20px 14px", borderBottom: "var(--border-w) solid var(--line)" }}>
          <div>
            <h2 className="h-title" style={{ fontSize: 17, margin: 0 }}>{title}</h2>
            {sub && <p className="text-muted-x" style={{ fontSize: 12, margin: "3px 0 0" }}>{sub}</p>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close" style={{ width: 32, height: 32 }}><X size={14} /></button>
        </div>
        <div style={{ overflowY: "auto" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

/** "Here / Skipped" control for today's sessions. */
export function AttendancePicker({ session, att }: { session: Session; att: Attendance }) {
  const mark = att.getMark(session);
  const left = att.editsLeft(session);
  const locked = left <= 0;
  return (
    <div className="flex flex-col items-end gap-1" style={{ flexShrink: 0 }}>
      <div className="segmented" role="group" aria-label="Mark attendance">
        <button data-tone="ok" aria-pressed={mark === "attended"} disabled={locked} onClick={() => att.setMark(session, "attended")}
          style={mark === "attended" ? { color: "var(--ok)" } : undefined}><Check size={12} style={{ display: "inline", marginRight: 3 }} />Here</button>
        <button data-tone="bad" aria-pressed={mark === "skipped"} disabled={locked} onClick={() => att.setMark(session, "skipped")}
          style={mark === "skipped" ? { color: "var(--bad)" } : undefined}><X size={12} style={{ display: "inline", marginRight: 3 }} />Skipped</button>
      </div>
      {mark && <span className="text-muted-x" style={{ fontSize: 10, fontWeight: 600 }}>
        {locked ? "Locked for today" : `${left}/${MAX_ATTENDANCE_EDITS} changes left`}
      </span>}
    </div>
  );
}

export function AttendanceBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="chip">No classes yet</span>;
  return pct < 70 ? <span className="chip chip-bad">At risk</span> : <span className="chip chip-ok">On track</span>;
}
