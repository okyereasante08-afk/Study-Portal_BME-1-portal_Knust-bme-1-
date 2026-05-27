// app/components/tabs/HomeTab.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calculator, BookOpen, Zap, Bell, ExternalLink } from "lucide-react";
import { TIMETABLE, COURSE_COLORS, getSessionsByWeekday, MAX_ATTENDANCE_EDITS } from "@/lib/data";
import { AttendanceBadge } from "@/app/components/ui";

interface Props {
  studentName: string;
  attendance: Record<string, number>;
  attendanceStatus: Record<string, "attended" | "skipped" | null>;
  attendanceEdits: Record<string, number>;
  avgAttPct: number;
  totalCreditHours: number;
  timerSessions: number;
  nextClassInfo: { course: string; venue: string; startTime: string; minsUntil: number } | null;
  announcements: any[];
  onCWA: () => void;
  onSurvivalKit: () => void;
  onFocus: () => void;
  onUpdates: () => void;
  onSchedule: () => void;
  setAttendanceChoice: (id: string, choice: "attended" | "skipped") => void;
  getAttendancePct: (classId: string, weekday?: number) => number;
}

export default function HomeTab({
  studentName, attendance, attendanceStatus, attendanceEdits,
  avgAttPct, totalCreditHours, timerSessions, nextClassInfo,
  announcements, onCWA, onSurvivalKit, onFocus, onUpdates, onSchedule,
  setAttendanceChoice, getAttendancePct,
}: Props) {
  const S = {
    card: { background: "#ffffff", borderRadius: 20, border: "1px solid rgb(225,221,210)", overflow: "hidden" } as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 700, color: "#888888", textTransform: "uppercase" as const, letterSpacing: 0.8 },
    sectionTitle: { fontSize: 15, fontWeight: 800, color: "#111111", margin: "0 0 14px", fontFamily: "'Syne', sans-serif" },
  };

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const todayName = daysList[new Date().getDay() - 1] || "Weekend";
  const todayClasses = TIMETABLE[todayName] || [];
  const AT_RISK_THRESHOLD = 70;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Greeting */}
      <div style={{ paddingBottom: 4 }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: "#2d2416", margin: "0 0 2px", fontFamily: "'Tangerine', cursive" }}>
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {studentName.split(" ")[0]}.
        </h2>
        <p style={{ fontSize: 13, color: "#a8967a", margin: 0 }}>
          {new Date().toLocaleDateString("en-GB", { weekday: "long" })} · Semester 2, Week {Math.ceil((new Date().getTime() - new Date("2026-01-12").getTime()) / (7 * 24 * 60 * 60 * 1000))}
        </p>
      </div>

      {/* Next class alert */}
      {nextClassInfo && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ ...S.card, background: "#2d2416", border: "none", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 8, height: 8, borderRadius: 4, background: "#f59e0b" }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#f0ebe3", margin: "0 0 1px", fontFamily: "'Syne', sans-serif" }}>{nextClassInfo.course}</p>
              <p style={{ fontSize: 12, color: "#a8967a", margin: 0, fontStyle: "italic" }}>{nextClassInfo.venue} · {nextClassInfo.startTime}</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b", margin: "0 0 1px" }}>
              {nextClassInfo.minsUntil < 60 ? `${nextClassInfo.minsUntil}m` : `${Math.floor(nextClassInfo.minsUntil / 60)}h ${nextClassInfo.minsUntil % 60}m`}
            </p>
            <p style={{ fontSize: 10, color: "#6b5438", margin: 0, textTransform: "uppercase", letterSpacing: 0.5, fontStyle: "italic", fontWeight: 600 }}>until class</p>
          </div>
        </motion.div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Credit hours", value: totalCreditHours, sub: "Sem 2", color: "#2d2416" },
          { label: "Avg attendance", value: `${avgAttPct}%`, sub: avgAttPct >= AT_RISK_THRESHOLD ? "On track ✓" : "At Risk ⚠", color: "#2d2416" },
          { label: "Focus sessions", value: timerSessions, sub: "Today", color: "#2d2416" },
        ].map((stat) => (
          <div key={stat.label} style={{ ...S.card, padding: "14px 12px" }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: stat.color, margin: "0 0 2px", lineHeight: 1 }}>{stat.value}</p>
            <p style={{ ...S.label, margin: "0 0 3px" }}>{stat.label}</p>
            <p style={{ fontSize: 11, color: "#a8967a", margin: 0 }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Today's classes */}
      <div style={S.card}>
        <div style={{ padding: "16px 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={S.sectionTitle}>Today's classes</h3>
          <button onClick={onSchedule} style={{ fontSize: 12, color: "#8b7355", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View week →</button>
        </div>
        {todayClasses.length === 0 ? (
          <div style={{ padding: "20px 18px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#c9b89a" }}>No classes today 🎉</p>
          </div>
        ) : (
          <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {todayClasses.map((cls) => {
              const pct = getAttendancePct(cls.id, cls.weekday);
              const status = attendanceStatus[cls.id] ?? null;
              const edits = attendanceEdits[cls.id] || 0;
              const locked = edits >= MAX_ATTENDANCE_EDITS;
              return (
                <div key={cls.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 10px", borderRadius: 14, background: "#faf8f4" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1208", margin: 0 }}>{cls.course}</p>
                      <span style={{ fontSize: 11, color: "#a8967a" }}>{cls.time.split(" - ")[0]}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#8b7355", margin: "0 0 4px" }}>{cls.venue} · {cls.lecturer}</p>
                    <span style={{ fontSize: 11, color: "#a8967a" }}>{pct}%</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0 }}>
                    <select
                      value={status ?? ""}
                      disabled={locked}
                      onChange={(e) => { const v = e.target.value as "attended" | "skipped"; if (v) setAttendanceChoice(cls.id, v); }}
                      style={{ padding: "6px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: locked ? "not-allowed" : "pointer", border: "none", outline: "none", appearance: "auto", background: status === "attended" ? "#f0fdf4" : status === "skipped" ? "#fef2f2" : "#2d2416", color: status === "attended" ? "#16a34a" : status === "skipped" ? "#dc2626" : "#f0ebe3", opacity: locked ? 0.7 : 1, minWidth: 60 }}
                    >
                      <option value="" disabled style={{ background: "#fff", color: "#1a1208" }}>{status ? "Edit" : "Here?"}</option>
                      <option value="attended" style={{ background: "#fff", color: "#16a34a" }}>✓ Here</option>
                      <option value="skipped" style={{ background: "#fff", color: "#dc2626" }}>✗ Skip</option>
                    </select>
                    {status && <span style={{ fontSize: 9, color: locked ? "#ef4444" : "#c9b89a", fontWeight: 600 }}>{locked ? "🔒" : `${MAX_ATTENDANCE_EDITS - edits}x`}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <p style={{ ...S.label, marginBottom: 10 }}>Quick actions</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: <Calculator size={20} color="#2d2416" />, label: "CWA calc", sub: "Project your grade", action: onCWA },
            { icon: <BookOpen size={20} color="#2d2416" />, label: "Survival kit", sub: "Course resources", action: onSurvivalKit },
            { icon: <Zap size={20} color="#2d2416" />, label: "Focus Studio", sub: "Timer · Lofi · Deep work", action: onFocus },
            { icon: <Bell size={20} color="#2d2416" />, label: "Updates", sub: "Announcements", action: onUpdates, badge: announcements.length },
          ].map((item) => (
            <button key={item.label} onClick={item.action}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16, background: "#faf8f4", border: "none", cursor: "pointer", textAlign: "left", position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1208", margin: "0 0 2px" }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#a8967a", margin: 0 }}>{item.sub}</p>
              </div>
              {(item as any).badge > 0 && (
                <span style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, borderRadius: 9, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{(item as any).badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Slides link */}
        <a href="https://drive.google.com/drive/folders/1Es-zeNtSEYnxcgjknbubkIkGrLSqHB1Y?usp=sharing"
          target="_blank" rel="noopener noreferrer"
          style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16, background: "#faf8f4", textDecoration: "none" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <svg width="22" height="20" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1208", margin: "0 0 2px" }}>Class Slides</p>
            <p style={{ fontSize: 11, color: "#a8967a", margin: 0 }}>Class presentations · Google Drive</p>
          </div>
          <ExternalLink size={14} color="#8b7355" />
        </a>
      </div>
    </div>
  );
}
