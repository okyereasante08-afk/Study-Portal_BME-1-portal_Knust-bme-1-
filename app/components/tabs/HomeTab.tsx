"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calculator, CalendarClock, ExternalLink, Folder, Megaphone, Timer, BookOpen } from "lucide-react";
import type { YearConfig } from "../../lib/types";
import type { Attendance } from "../useAttendance";
import type { TabId } from "../YearPortal";
import { AttendanceBadge, AttendancePicker, EmptyState } from "../ui";
import { CountUp, Item, Stagger } from "../../lib/motion";
import { CountdownWidget } from "../CountdownWidget";
import {
  fmtClock, fmtCountdown, lecturesRunning, nextClassToday, semesterOver, semesterWeek,
  sessionLabel, sessionsOn, todayDayName,
} from "../../lib/schedule";

interface Props {
  year: YearConfig; now: Date | null; att: Attendance; name: string;
  setTab: (t: TabId) => void; openCwa: () => void;
}

const ANN_CHIP: Record<string, string> = { info: "chip-info", quiz: "chip-warn", deadline: "chip-warn", urgent: "chip-bad" };

export function HomeTab({ year, now, att, name, setTab, openCwa }: Props) {
  const d = now ?? new Date();
  const hour = d.getHours();
  const greet = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const first = name.trim().split(" ")[0];
  const today = todayDayName(d);
  const todays = sessionsOn(year, today);
  const next = now ? nextClassToday(year, now) : null;
  const sem = year.semester;
  const week = semesterWeek(sem, d);
  const over = semesterOver(sem, d);
  const running = lecturesRunning(sem, d);
  const credits = year.courses.reduce((s, c) => s + c.credits, 0);
  const avg = now ? att.average(now) : null;
  const hasTT = year.timetable.length > 0;

  const stats: { n: number | null; suffix?: string; l: string; s: string }[] = [
    { n: year.courses.length || null, l: "Courses", s: credits ? `${credits} credit hrs` : "Not published yet" },
    { n: hasTT ? year.timetable.length : null, l: "Classes / week", s: hasTT ? "On your timetable" : "Not published yet" },
    { n: avg, suffix: "%", l: "Attendance", s: avg === null ? "Mark a class to start" : avg >= 70 ? "On track" : "At risk" },
  ];

  const actions = [
    { icon: <Calculator size={18} />, t: "CWA calculator", s: "Project your grade", f: openCwa },
    { icon: <BookOpen size={18} />, t: "Resources", s: "Slides & study links", f: () => setTab("resources") },
    { icon: <Timer size={18} />, t: "Focus studio", s: "Timer · lofi", f: () => setTab("focus") },
    year.slidesFolderUrl
      ? { icon: <Folder size={18} />, t: "Class slides", s: "Google Drive", href: year.slidesFolderUrl }
      : { icon: <Folder size={18} />, t: "Class slides", s: "Coming soon", f: () => setTab("resources") },
  ];

  return (
    <Stagger raw className="home-grid" stagger={0.12} delay={0.05}>
      {/* greeting */}
      <Item className={next ? "c-7" : "c-12"} style={{ alignSelf: "center" }}>
        <h1 className="font-script text-ink greeting" style={{ fontSize: "clamp(40px, 6vw, 60px)", fontWeight: 700, margin: 0, lineHeight: 1 }}>
          Good {greet}{first ? `, ${first}` : ""}.
        </h1>
        <p className="text-muted-x" style={{ fontSize: 13, margin: "10px 0 0" }}>
          {d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · {year.title} · {over ? `${sem.label} (ended)` : week ? `${sem.label}, week ${week}` : sem.label}
        </p>
        {!first && (
          <button className="text-ink-2" style={{ background: "none", border: "none", padding: 0, marginTop: 6, fontSize: 12, fontWeight: 600, textDecoration: "underline" }}
            onClick={() => setTab("profile")}>Add your name to personalise this page</button>
        )}
      </Item>

      {/* next class: only while lectures are actually running */}
      {next && (
        <Item className="c-5">
          <div className="card-hero flex items-center justify-between gap-3" style={{ padding: "18px 22px", height: "100%" }}>
            <div className="flex items-center gap-3">
              <motion.span animate={{ scale: [1, 1.5, 1], opacity: [1, 0.55, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 10, height: 10, borderRadius: 10, background: "var(--hot)", flexShrink: 0 }} />
              <div>
                <p className="eyebrow" style={{ color: "var(--hero-muted)", marginBottom: 3 }}>Up next</p>
                <p className="h-title" style={{ fontSize: 18, margin: 0, color: "var(--hero-fg)" }}>{sessionLabel(next.session)}</p>
                <p style={{ fontSize: 12, margin: "2px 0 0", color: "var(--hero-muted)" }}>{next.session.venue} · {fmtClock(next.session.start)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="h-title" style={{ fontSize: 28, margin: 0, color: "var(--hot)" }}>{fmtCountdown(next.minsUntil)}</p>
              <p className="eyebrow" style={{ color: "var(--hero-muted)" }}>to go</p>
            </div>
          </div>
        </Item>
      )}

      {/* stats */}
      {stats.map((s) => (
        <Item key={s.l} className="c-stat">
          <div className="card" style={{ padding: "16px 14px", height: "100%" }}>
            <p className="h-display" style={{ fontSize: 34, margin: "0 0 6px" }}>{s.n === null ? "—" : <CountUp value={s.n} suffix={s.suffix} />}</p>
            <p className="eyebrow" style={{ marginBottom: 3, fontSize: 10, letterSpacing: "0.06em" }}>{s.l}</p>
            <p className="text-muted-x" style={{ fontSize: 11, margin: 0 }}>{s.s}</p>
          </div>
        </Item>
      ))}

      {/* today */}
      <Item className="c-7">
        {hasTT ? (
          <div className="card" style={{ padding: 20, height: "100%" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
              <h3 className="h-title" style={{ fontSize: 17, margin: 0 }}>Today&apos;s classes</h3>
              <button className="text-ink-2" style={{ background: "none", border: "none", fontSize: 12, fontWeight: 700 }} onClick={() => setTab("timetable")}>Full timetable →</button>
            </div>
            {!running && <p className="chip chip-info" style={{ marginBottom: 12 }}>{over ? "Semester ended · showing your weekly schedule" : "Lectures aren't running right now"}</p>}
            {todays.length === 0 ? (
              <p className="text-muted-x text-center" style={{ fontSize: 13, padding: "22px 0" }}>{today ? "No classes today 🎉" : "It's the weekend. Rest up. 🎉"}</p>
            ) : (
              <div className="stack gap-3">
                {todays.map((s) => {
                  const st = att.stats(s, d);
                  return (
                    <div key={s.id} className="card-soft flex items-center gap-4 flex-wrap" style={{ padding: "14px 16px" }}>
                      <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="h-title" style={{ fontSize: 15, margin: 0 }}>{sessionLabel(s)}</p>
                          <span className="text-muted-x" style={{ fontSize: 11, fontWeight: 700 }}>{fmtClock(s.start)}–{fmtClock(s.end)}</span>
                        </div>
                        <p className="text-ink-2" style={{ fontSize: 12, margin: "3px 0 8px" }}>{s.venue}{s.lecturer ? ` · ${s.lecturer}` : ""}</p>
                        <div className="flex items-center gap-2"><AttendanceBadge pct={st.pct} />{st.pct !== null && <span className="text-muted-x" style={{ fontSize: 11 }}>{st.pct}%</span>}</div>
                      </div>
                      {running && <AttendancePicker session={s} att={att} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <EmptyState icon={<CalendarClock size={22} />} title={`${year.title} timetable coming soon`}
            body="Courses, lecture times and venues for this year haven't been published yet. You can add your own classes in the Timetable tab, or use the focus timer, the CWA calculator and the assistant in the meantime."
            action={<button className="btn btn-primary btn-sm" onClick={() => setTab("timetable")}>Open timetable</button>} />
        )}
      </Item>

      {/* updates + key dates */}
      <Item className="c-5">
        <div className="stack gap-4" style={{ height: "100%" }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <Megaphone size={15} style={{ color: "var(--ink-2)" }} />
              <h3 className="h-title" style={{ fontSize: 17, margin: 0 }}>Updates</h3>
            </div>
            {year.announcements.length === 0 ? (
              <p className="text-muted-x text-center" style={{ fontSize: 13, padding: "14px 0" }}>No announcements for {year.title} right now.</p>
            ) : (
              <div className="stack gap-2">
                {year.announcements.map((a) => (
                  <div key={a.id} className="card-soft" style={{ padding: "11px 13px" }}>
                    <p style={{ fontSize: 13, margin: "0 0 6px", lineHeight: 1.5 }}>{a.text}</p>
                    <div className="flex items-center gap-2">
                      <span className={`chip ${ANN_CHIP[a.type]}`}>{a.type}</span>
                      <span className="text-muted-x" style={{ fontSize: 11 }}>{new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <CountdownWidget semester={sem} compact />
        </div>
      </Item>

      {/* quick actions */}
      {actions.map((a) => {
        const inner = (
          <>
            <span className="avatar" style={{ width: 40, height: 40, background: "var(--soft-2)", color: "var(--ink)" }}>{a.icon}</span>
            <span style={{ minWidth: 0 }}>
              <span className="h-title block" style={{ fontSize: 13 }}>{a.t}</span>
              <span className="text-muted-x block" style={{ fontSize: 11 }}>{a.s}</span>
            </span>
            {"href" in a && <ExternalLink size={12} style={{ marginLeft: "auto", color: "var(--muted)" }} />}
          </>
        );
        const cls = "card card-link flex items-center gap-3 text-left";
        return (
          <Item key={a.t} className="c-act">
            {"href" in a && a.href
              ? <a href={a.href} target="_blank" rel="noopener noreferrer" className={cls} style={{ padding: 14, height: "100%" }}>{inner}</a>
              : <button onClick={a.f} className={cls} style={{ padding: 14, height: "100%", width: "100%" }}>{inner}</button>}
          </Item>
        );
      })}
    </Stagger>
  );
}
