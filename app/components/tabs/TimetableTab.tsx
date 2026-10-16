"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Clock, MapPin, Pencil, Plus, RotateCcw } from "lucide-react";
import type { Day, Session, YearConfig } from "../../lib/types";
import type { Attendance } from "../useAttendance";
import type { TimetableApi } from "../useTimetable";
import { AttendanceBadge, AttendancePicker, EmptyState, PageHeader } from "../ui";
import { SessionEditor } from "../SessionEditor";
import { Bar, EASE, Stagger } from "../../lib/motion";
import { DAYS, fmtClock, lecturesRunning, sessionLabel, sessionsOn, todayDayName, toMinutes, unique } from "../../lib/schedule";

type View = "today" | "week" | "grid";
const SHORT: Record<Day, string> = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri" };
const PALETTE = Array.from({ length: 10 }, (_, i) => `var(--c${i + 1})`);

type Editing = { session: Session | null; preset?: { day: Day; start: string } } | null;

export function TimetableTab({ year, now, att, tt }: { year: YearConfig; now: Date | null; att: Attendance; tt: TimetableApi }) {
  const [view, setView] = useState<View>("today");
  const [editing, setEditing] = useState<Editing>(null);
  const d = now ?? new Date();
  const today = todayDayName(d);
  const running = lecturesRunning(year.semester, d);

  // course colours are used ONLY by the grid
  const colorOf = useMemo(() => {
    const codes = unique(year.timetable.map((s) => s.course));
    return (c: string) => PALETTE[codes.indexOf(c) % PALETTE.length];
  }, [year.timetable]);

  const addBtn = <button className="btn btn-primary btn-sm" onClick={() => setEditing({ session: null })}><Plus size={14} /> Add class</button>;
  const resetBtn = tt.changeCount > 0 && (
    <button className="btn btn-sm" onClick={() => { if (window.confirm("Discard all your timetable changes and go back to the official timetable?")) tt.reset(); }}>
      <RotateCcw size={13} /> Reset changes ({tt.changeCount})
    </button>
  );

  const editor = (
    <AnimatePresence>
      {editing && (
        <SessionEditor key={editing.session?.id ?? `new-${editing.preset?.day}-${editing.preset?.start}`}
          year={year} session={editing.session} preset={editing.preset}
          edited={editing.session ? tt.isEdited(editing.session.id) : false}
          custom={editing.session ? tt.isCustom(editing.session.id) : false}
          onSave={tt.save}
          onDelete={() => editing.session && tt.remove(editing.session.id)}
          onRevert={() => editing.session && tt.revert(editing.session.id)}
          onClose={() => setEditing(null)} />
      )}
    </AnimatePresence>
  );

  if (year.timetable.length === 0) {
    return (
      <>
        <PageHeader title="Timetable" sub={`${year.title} · Level ${year.levelCode}`} right={<div className="flex gap-2">{resetBtn}{addBtn}</div>} />
        <EmptyState icon={<CalendarClock size={22} />} title="Timetable not published yet"
          body={`Once the official ${year.title} timetable is uploaded, every course, lecture time, venue and lecturer will show up here. Until then you can add your own classes.`}
          action={addBtn} />
        {editor}
      </>
    );
  }

  const renderCard = (s: Session, markable: boolean) => {
    const st = att.stats(s, d);
    return (
      <div key={s.id} className="card" style={{ padding: "16px 18px" }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div style={{ minWidth: 0 }}>
            <p className="h-title" style={{ fontSize: 15, margin: 0 }}>{sessionLabel(s)}
              {year.courses.find((c) => c.code === s.course)?.name && <span className="text-muted-x" style={{ fontWeight: 600, fontSize: 12 }}> · {year.courses.find((c) => c.code === s.course)?.name}</span>}
              {tt.isEdited(s.id) && <span className="chip chip-info" style={{ marginLeft: 8 }}>{tt.isCustom(s.id) ? "Yours" : "Edited"}</span>}
            </p>
            {s.lecturer && <p className="text-ink-2" style={{ fontSize: 12, margin: "3px 0 0", fontStyle: "italic" }}>{s.lecturer}</p>}
            <div className="flex gap-3 text-muted-x" style={{ fontSize: 11, marginTop: 6, fontWeight: 600 }}>
              <span className="flex items-center gap-1"><Clock size={11} />{fmtClock(s.start)} – {fmtClock(s.end)}</span>
              <span className="flex items-center gap-1"><MapPin size={11} />{s.venue}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="chip">{s.type}</span>
              <button className="icon-btn" style={{ width: 30, height: 30 }} aria-label={`Edit ${sessionLabel(s)}`} onClick={() => setEditing({ session: s })}><Pencil size={13} /></button>
            </div>
            {markable && running && <AttendancePicker session={s} att={att} />}
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span className="text-muted-x" style={{ fontSize: 11 }}>{st.attended} attended of {st.held} held so far ({st.total} this semester)</span>
            <AttendanceBadge pct={st.pct} />
          </div>
          <Bar pct={st.pct ?? 0} />
        </div>
      </div>
    );
  };

  const slots = unique(year.timetable.map((s) => s.start)).sort((a, b) => toMinutes(a) - toMinutes(b));

  return (
    <div className="stack gap-4">
      <PageHeader title="Timetable" sub={`${year.title} · ${year.semester.label}`}
        right={
          <div className="flex items-center gap-2 flex-wrap">
            {resetBtn}{addBtn}
            <div className="segmented" role="group" aria-label="View">
              {(["today", "week", "grid"] as View[]).map((v) => (
                <button key={v} aria-pressed={view === v} onClick={() => setView(v)} style={{ textTransform: "capitalize" }}>{v}</button>
              ))}
            </div>
          </div>
        } />

      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.55, ease: EASE }}>
          {view === "grid" && (
            <>
              <p className="text-muted-x" style={{ fontSize: 12, margin: "0 0 10px" }}>Tap a class to change its time, venue or lecturer. Tap an empty cell to add one. Changes are saved on this device only.</p>
              <div className="card" style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 640, tableLayout: "fixed" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: 10, width: 64 }} />
                      {DAYS.map((dn) => (
                        <th key={dn} className="eyebrow" style={{ padding: 10, textAlign: "left", color: dn === today ? "var(--ink)" : undefined }}>
                          {SHORT[dn]}{dn === today && " ·"}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot) => (
                      <tr key={slot}>
                        <td className="text-muted-x" style={{ padding: "8px 10px", fontSize: 11, fontWeight: 700, borderTop: "var(--border-w) solid var(--line)", verticalAlign: "top" }}>{fmtClock(slot)}</td>
                        {DAYS.map((dn) => {
                          const here = year.timetable.filter((x) => x.day === dn && x.start === slot);
                          return (
                            <td key={dn} style={{ padding: 5, borderTop: "var(--border-w) solid var(--line)", verticalAlign: "top", height: 72 }}>
                              {here.length === 0 ? (
                                <button className="tt-add" aria-label={`Add a class on ${dn} at ${fmtClock(slot)}`} onClick={() => setEditing({ session: null, preset: { day: dn, start: slot } })}><Plus size={14} /></button>
                              ) : (
                                <div className="stack gap-1" style={{ height: "100%" }}>
                                  {here.map((s) => (
                                    <button key={s.id} className="tt-cell" onClick={() => setEditing({ session: s })}
                                      aria-label={`Edit ${sessionLabel(s)}, ${dn} ${fmtClock(s.start)}`}
                                      style={{ background: `color-mix(in srgb, ${colorOf(s.course)} 16%, var(--card))`, borderLeft: `4px solid ${colorOf(s.course)}` }}>
                                      <span className="flex items-center justify-between gap-1">
                                        <span style={{ fontSize: 12, fontWeight: 800 }}>{sessionLabel(s)}</span>
                                        {tt.isEdited(s.id) && <span className="tt-dot" title="Edited by you" />}
                                      </span>
                                      <span className="block text-ink-2" style={{ fontSize: 10, marginTop: 2 }}>{s.venue}</span>
                                      <span className="block text-muted-x" style={{ fontSize: 10, fontWeight: 600 }}>{fmtClock(s.start)}–{fmtClock(s.end)}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {view === "today" && (
            today && sessionsOn(year, today).length > 0
              ? <Stagger className="stack gap-3" stagger={0.15}>{sessionsOn(year, today).map((s) => renderCard(s, true))}</Stagger>
              : <EmptyState icon={<CalendarClock size={22} />} title="No classes today" body={today ? "Enjoy the free day, or switch to Week to see what's coming." : "It's the weekend. Switch to Week to see Monday."} />
          )}

          {view === "week" && (
            <Stagger className="stack gap-4" stagger={0.14}>
              {DAYS.map((dn) => {
                const list = sessionsOn(year, dn);
                return (
                  <section key={dn}>
                    <div className="flex items-center gap-3" style={{ margin: "6px 0 10px" }}>
                      <span className="eyebrow" style={{ color: dn === today ? "var(--ink)" : undefined }}>{dn}{dn === today && " · Today"}</span>
                      <span style={{ height: 1, flex: 1, background: "var(--line)" }} />
                    </div>
                    {list.length === 0
                      ? <p className="text-muted-x" style={{ fontSize: 12, margin: "0 0 8px" }}>No classes</p>
                      : <div className="stack gap-3">{list.map((s) => renderCard(s, dn === today))}</div>}
                  </section>
                );
              })}
            </Stagger>
          )}
        </motion.div>
      </AnimatePresence>
      {editor}
    </div>
  );
}
