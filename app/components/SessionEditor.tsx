"use client";

import React, { useMemo, useState } from "react";
import { Modal } from "./ui";
import type { Day, Session, SessionType, YearConfig } from "../lib/types";
import { DAYS, toMinutes } from "../lib/schedule";
import type { SessionDraft } from "./useTimetable";

interface Props {
  year: YearConfig;
  session: Session | null;                // null = adding a new class
  preset?: { day: Day; start: string };   // when adding from an empty grid cell
  edited: boolean;                        // official class that has local changes
  custom: boolean;                        // class the user created
  onSave: (d: SessionDraft) => void;
  onDelete: () => void;
  onRevert: () => void;
  onClose: () => void;
}

function Label({ id, children }: { id: string; children: React.ReactNode }) {
  return <label htmlFor={id} className="eyebrow block" style={{ marginBottom: 6 }}>{children}</label>;
}

const plusHour = (t: string) => { const m = toMinutes(t) + 55; return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };

export function SessionEditor({ year, session, preset, edited, custom, onSave, onDelete, onRevert, onClose }: Props) {
  const [day, setDay] = useState<Day>(session?.day ?? preset?.day ?? "Monday");
  const [start, setStart] = useState(session?.start ?? preset?.start ?? "08:00");
  const [end, setEnd] = useState(session?.end ?? (preset ? plusHour(preset.start) : "08:55"));
  const [course, setCourse] = useState(session?.course ?? "");
  const [group, setGroup] = useState(session?.group ?? "");
  const [venue, setVenue] = useState(session?.venue ?? "");
  const [lecturer, setLecturer] = useState(session?.lecturer ?? "");
  const [type, setType] = useState<SessionType>(session?.type ?? "Lecture");
  const [tried, setTried] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!course.trim()) e.course = "Enter a course code";
    if (!venue.trim()) e.venue = "Enter a venue";
    if (!start || !end) e.time = "Pick a start and end time";
    else if (toMinutes(end) <= toMinutes(start)) e.time = "End time must be after the start time";
    return e;
  }, [course, venue, start, end]);

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setTried(true);
    if (Object.keys(errors).length) return;
    onSave({ id: session?.id, day, start, end, course: course.trim().toUpperCase(), group: group.trim() || undefined,
      venue: venue.trim(), lecturer: lecturer.trim() || undefined, type });
    onClose();
  };

  const courseName = year.courses.find((c) => c.code === course.trim().toUpperCase())?.name;
  const err = (k: string) => (tried && errors[k] ? <p role="alert" style={{ color: "var(--bad)", fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>{errors[k]}</p> : null);

  return (
    <Modal wide title={session ? "Edit class" : "Add a class"} sub={session ? `${year.title} · changes are saved on this device` : `${year.title} · added to your timetable on this device`} onClose={onClose}>
      <form onSubmit={submit} noValidate style={{ padding: 20 }} className="stack gap-4">
        <div className="grid gap-3" style={{ gridTemplateColumns: "2fr 1fr" }}>
          <div>
            <Label id="se-course">Course</Label>
            <input id="se-course" className="input" list="se-courses" value={course} placeholder="e.g. MATH 152" onChange={(e) => setCourse(e.target.value)} autoFocus />
            <datalist id="se-courses">{year.courses.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</datalist>
            {courseName && <p className="text-muted-x" style={{ fontSize: 11, margin: "4px 0 0" }}>{courseName}</p>}
            {err("course")}
          </div>
          <div>
            <Label id="se-group">Group</Label>
            <input id="se-group" className="input" value={group} placeholder="A / B" maxLength={6} onChange={(e) => setGroup(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <Label id="se-day">Day</Label>
            <select id="se-day" className="select" value={day} onChange={(e) => setDay(e.target.value as Day)}>{DAYS.map((d) => <option key={d}>{d}</option>)}</select>
          </div>
          <div>
            <Label id="se-type">Type</Label>
            <select id="se-type" className="select" value={type} onChange={(e) => setType(e.target.value as SessionType)}>
              {(["Lecture", "Lab", "Tutorial"] as SessionType[]).map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div><Label id="se-start">Starts</Label><input id="se-start" type="time" className="input" value={start} onChange={(e) => setStart(e.target.value)} /></div>
            <div><Label id="se-end">Ends</Label><input id="se-end" type="time" className="input" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
          </div>
          {err("time")}
        </div>

        <div>
          <Label id="se-venue">Venue</Label>
          <input id="se-venue" className="input" value={venue} placeholder="e.g. NEB – First Floor" onChange={(e) => setVenue(e.target.value)} />
          {err("venue")}
        </div>
        <div>
          <Label id="se-lect">Lecturer</Label>
          <input id="se-lect" className="input" value={lecturer} placeholder="Optional" onChange={(e) => setLecturer(e.target.value)} />
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap" style={{ paddingTop: 6 }}>
          <div className="flex gap-2">
            {session && (
              <button type="button" className="btn btn-sm" onClick={() => {
                if (window.confirm(custom ? "Delete this class?" : "Remove this class from your timetable? You can restore it with “Reset changes”.")) { onDelete(); onClose(); }
              }} style={{ color: "var(--bad)" }}>{custom ? "Delete" : "Remove"}</button>
            )}
            {edited && !custom && <button type="button" className="btn btn-sm" onClick={() => { onRevert(); onClose(); }}>Undo my edits</button>}
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{session ? "Save changes" : "Add class"}</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
