// app/components/tabs/ScheduleTab.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { TIMETABLE, COURSE_COLORS, getSessionsByWeekday, MAX_ATTENDANCE_EDITS } from "@/lib/data";
import { AttendanceBadge } from "@/app/components/ui";
import { useTheme } from "@/lib/theme";

interface Props {
  attendance: Record<string, number>;
  attendanceStatus: Record<string, "attended" | "skipped" | null>;
  attendanceEdits: Record<string, number>;
  setAttendanceChoice: (id: string, choice: "attended" | "skipped") => void;
  getAttendancePct: (classId: string, weekday?: number) => number;
}

const GRID_STYLES: Record<string, { bg: string; text: string }> = {
  "PHY 154":    { bg: "#E6F1FB", text: "#0C447C" },
  "ENGL 158":   { bg: "#FFF3E0", text: "#633806" },
  "SOC 152":    { bg: "#FBEAF0", text: "#72243E" },
  "COE 152":    { bg: "#EAF3DE", text: "#27500A" },
  "BME 166":    { bg: "#EEEDFE", text: "#3C3489" },
  "MATH 152 A": { bg: "#E1F5EE", text: "#085041" },
  "MATH 152 B": { bg: "#E1F5EE", text: "#085041" },
  "ME 166":     { bg: "#FAECE7", text: "#712B13" },
};

const TIME_SLOTS = ["08:00", "09:00", "10:30", "11:30", "13:00", "14:00", "15:00", "16:00"];
const GRID_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const GRID_DAY_MAP: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };

export default function ScheduleTab({ attendance, attendanceStatus, attendanceEdits, setAttendanceChoice, getAttendancePct }: Props) {
  const { theme } = useTheme();
  const [scheduleView, setScheduleView] = useState<"today" | "week" | "grid">("today");

  const S = {
    card: { background: theme.cardBg, borderRadius: 20, border: `1px solid ${theme.border}`, overflow: "hidden" } as React.CSSProperties,
    sectionTitle: { fontSize: 15, fontWeight: 800, color: theme.textPrimary, margin: "0 0 14px", fontFamily: theme.fontHeading },
  };

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const todayName = daysList[new Date().getDay() - 1] || "Weekend";
  const todayColIdx = new Date().getDay() - 1;

  const getCell = (dayKey: string, slot: string) =>
    (TIMETABLE[GRID_DAY_MAP[dayKey]] || []).find((c) => c.time.startsWith(slot)) || null;

  const GridView = () => (
    <div style={{ overflowX: "auto", borderRadius: 16, border: `1px solid ${theme.border}` }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480 }}>
        <thead>
          <tr>
            <th style={{ padding: "8px 10px", background: "#faf8f4", borderBottom: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}`, color: theme.textMuted, fontWeight: 600, fontSize: 11, textAlign: "left", width: 52 }}>Time</th>
            {GRID_DAYS.map((d, i) => (
              <th key={d} style={{ padding: "8px 6px", background: "#faf8f4", borderBottom: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}`, color: i === todayColIdx ? theme.textPrimary : theme.textMuted, fontWeight: i === todayColIdx ? 800 : 600, fontSize: 12, textAlign: "center" }}>
                {d}{i === todayColIdx && <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: theme.accent, verticalAlign: "middle", marginLeft: 3 }} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((slot) => (
            <tr key={slot}>
              <td style={{ padding: "4px 8px", borderBottom: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 10, fontWeight: 600, background: "#faf8f4", whiteSpace: "nowrap", verticalAlign: "middle" }}>{slot}</td>
              {GRID_DAYS.map((d) => {
                const cls = getCell(d, slot);
                const st = cls ? (GRID_STYLES[cls.course] || { bg: "#f7f3ed", text: "#6b5438" }) : null;
                return (
                  <td key={d} style={{ padding: 4, borderBottom: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}`, height: 50, verticalAlign: "top", background: cls ? st!.bg : "transparent" }}>
                    {cls && (
                      <div style={{ padding: "4px 6px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: st!.text, lineHeight: 1.2 }}>{cls.course}</span>
                        <span style={{ fontSize: 10, color: st!.text, opacity: 0.7, marginTop: 2 }}>{cls.venue}</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: "10px 14px", borderTop: `1px solid ${theme.border}`, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {Object.entries(GRID_STYLES).filter(([k]) => !k.includes(" B")).map(([code, st]) => (
          <span key={code} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: theme.textMuted }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: st.text, display: "inline-block", opacity: 0.75 }} />
            {code.replace(" A", "")}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.textPrimary, margin: 0, fontFamily: theme.fontHeading }}>Timetable</h2>
        <div style={{ display: "flex", gap: 4, background: "#f0ebe3", padding: 4, borderRadius: 14 }}>
          {(["Today", "Week", "Grid"] as const).map((v) => {
            const key = v.toLowerCase() as "today" | "week" | "grid";
            const active = scheduleView === key;
            return (
              <button key={v} onClick={() => setScheduleView(key)}
                style={{ padding: "5px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: active ? "#2d2416" : "transparent", color: active ? "#f0ebe3" : "#8b7355", transition: "all 0.15s" }}>
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {scheduleView === "grid" ? <GridView /> : (
        (scheduleView === "week" ? daysList : [todayName]).map((day) => {
          const classes = TIMETABLE[day] || [];
          return (
            <div key={day}>
              {scheduleView === "week" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ height: 1, flex: 1, background: theme.border }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: day === todayName ? theme.textPrimary : theme.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {day} {day === todayName && "· Today"}
                  </span>
                  <div style={{ height: 1, flex: 1, background: theme.border }} />
                </div>
              )}
              {classes.length === 0 ? (
                <div style={{ padding: "12px 0", textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: theme.textMuted }}>No classes</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {classes.map((cls) => {
                    const pct = getAttendancePct(cls.id, cls.weekday);
                    const status = attendanceStatus[cls.id] ?? null;
                    const edits = attendanceEdits[cls.id] || 0;
                    const locked = edits >= MAX_ATTENDANCE_EDITS;
                    const editsLeft = MAX_ATTENDANCE_EDITS - edits;
                    return (
                      <div key={cls.id} style={{ ...S.card, padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 12 }}>
                          <div style={{ width: 3, borderRadius: 2, background: "rgba(45,36,22,0.18)", flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                              <div>
                                <p style={{ fontSize: 15, fontWeight: 800, color: theme.textPrimary, margin: "0 0 2px", fontFamily: "'Syne', sans-serif" }}>{cls.course}</p>
                                <p style={{ fontSize: 12, color: "#8b7355", margin: "0 0 2px", fontStyle: "italic" }}>{cls.lecturer}</p>
                                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: theme.textMuted }}><Clock size={10} color="#c9b89a" /> {cls.time}</span>
                                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: theme.textMuted }}><MapPin size={10} color="#c9b89a" /> {cls.venue}</span>
                                </div>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                                <span style={{ padding: "3px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700, background: "rgba(45,36,22,0.07)", color: "#2d2416" }}>{cls.type}</span>
                                <select
                                  value={status ?? ""}
                                  disabled={locked}
                                  onChange={(e) => { const val = e.target.value as "attended" | "skipped"; if (val) setAttendanceChoice(cls.id, val); }}
                                  style={{ padding: "5px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: locked ? "not-allowed" : "pointer", border: `1px solid ${status === "attended" ? "#bbf7d0" : status === "skipped" ? "#fecaca" : "#ece8e0"}`, background: status === "attended" ? "#f0fdf4" : status === "skipped" ? "#fef2f2" : "#fff", color: status === "attended" ? "#16a34a" : status === "skipped" ? "#dc2626" : "#6b5438", outline: "none", appearance: "auto", opacity: locked ? 0.75 : 1 }}>
                                  <option value="" disabled>{status ? "Change" : "Mark attendance"}</option>
                                  <option value="attended">✓ Attended</option>
                                  <option value="skipped">✗ Skipped</option>
                                </select>
                                <span style={{ fontSize: 9, color: locked ? "#ef4444" : "#c9b89a", fontWeight: 600 }}>
                                  {locked ? "🔒 Locked" : status ? `${editsLeft} change${editsLeft !== 1 ? "s" : ""} left` : ""}
                                </span>
                              </div>
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: theme.textMuted }}>{attendance[cls.id] || 0}/{getSessionsByWeekday(cls.weekday)} attended</span>
                                <AttendanceBadge pct={pct} />
                              </div>
                              <div style={{ height: 4, borderRadius: 2, background: "#f0ebe3", overflow: "hidden" }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, delay: 0.1 }}
                                  style={{ height: "100%", borderRadius: 2, background: "#2d2416" }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
