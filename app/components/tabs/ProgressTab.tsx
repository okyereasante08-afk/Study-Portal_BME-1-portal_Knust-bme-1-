// app/components/tabs/ProgressTab.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { TIMETABLE, COURSE_COLORS, SESSIONS_BY_WEEKDAY } from "@/lib/data";
import { AttendanceBadge } from "@/app/components/ui";
import { useTheme } from "@/lib/theme";

interface Props {
  attendance: Record<string, number>;
  avgAttPct: number;
  daysToMidSem: number;
  daysToExams: number;
  daysToEnd: number;
  getAttendancePct: (classId: string, weekday?: number) => number;
}

export default function ProgressTab({ attendance, avgAttPct, daysToMidSem, daysToExams, daysToEnd, getAttendancePct }: Props) {
  const { theme } = useTheme();
  const S = {
    card: { background: theme.cardBg, borderRadius: 20, border: `1px solid ${theme.border}`, overflow: "hidden" } as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase" as const, letterSpacing: 0.8 },
    sectionTitle: { fontSize: 15, fontWeight: 800, color: theme.textPrimary, margin: "0 0 14px", fontFamily: theme.fontHeading },
  };
  const allClasses = Object.values(TIMETABLE).flat();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ paddingBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.textPrimary, margin: "0 0 2px", fontFamily: theme.fontHeading }}>Progress</h2>
        <p style={{ fontSize: 13, color: theme.textMuted, margin: 0 }}>Attendance overview</p>
      </div>
      <div style={S.card}>
        <div style={{ padding: "16px 18px 12px" }}>
          <h3 style={{ ...S.sectionTitle, marginBottom: 6 }}>Attendance</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: "#2d2416" }}>{avgAttPct}%</span>
            <div>
              <p style={{ fontSize: 12, color: theme.textPrimary, fontWeight: 600, margin: "0 0 2px" }}>Average across all courses</p>
              <AttendanceBadge pct={avgAttPct} />
            </div>
          </div>
        </div>
        <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {allClasses.map((cls) => {
            const pct = getAttendancePct(cls.id, cls.weekday);
            const color = COURSE_COLORS[cls.course] || "#8b7355";
            return (
              <div key={cls.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: color, display: "inline-block" }} />
                    {cls.course}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#2d2416" }}>{pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#f0ebe3", overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, delay: 0.1 }}
                    style={{ height: "100%", borderRadius: 3, background: "#2d2416" }} />
                </div>
                <p style={{ fontSize: 10, color: theme.textMuted, margin: "4px 0 0" }}>{attendance[cls.id] || 0} of {SESSIONS_BY_WEEKDAY[cls.weekday] ?? "?"} classes</p>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Mid-sems", sub: "6–10 Jul", days: daysToMidSem },
          { label: "Exams", sub: "Aug 17", days: daysToExams },
          { label: "End of sem", sub: "Sep 4", days: daysToEnd },
        ].map((m) => (
          <div key={m.label} style={{ ...S.card, padding: "16px 10px", textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#2d2416", margin: "0 0 2px", lineHeight: 1 }}>{m.days <= 0 ? "✓" : m.days}</p>
            <p style={{ ...S.label, margin: "0 0 3px" }}>{m.label}</p>
            <p style={{ fontSize: 10, color: theme.textMuted, margin: 0 }}>{m.days <= 0 ? "Done" : m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
