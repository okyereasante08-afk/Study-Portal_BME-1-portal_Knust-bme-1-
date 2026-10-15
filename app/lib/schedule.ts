// Pure helpers for timetable + attendance maths

import type { Day, Semester, Session, YearConfig } from "./types";

export const DAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_INDEX: Record<Day, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };

export const AT_RISK_THRESHOLD = 70;
export const MAX_ATTENDANCE_EDITS = 3;

export const toDate = (iso: string) => new Date(`${iso}T00:00:00`);

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const fmtClock = (hhmm: string) => {
  const [h, m] = hhmm.split(":");
  return `${Number(h)}:${m}`;
};

export const sessionLabel = (s: Session) => (s.group ? `${s.course} ${s.group}` : s.course);

export const todayDayName = (d = new Date()): Day | null => {
  const i = d.getDay();
  return i >= 1 && i <= 5 ? DAYS[i - 1] : null;
};

export const sessionsOn = (y: YearConfig, day: Day | null): Session[] =>
  day ? y.timetable.filter((s) => s.day === day).sort((a, b) => toMinutes(a.start) - toMinutes(b.start)) : [];

export const inBreak = (sem: Semester, d: Date) =>
  sem.breaks.some(([a, b]) => d >= toDate(a) && d <= toDate(b));

/** How many times a weekly session has occurred between semester start and `until` (inclusive). */
export const countOccurrences = (sem: Semester, session: Session, until: Date): number => {
  const end = new Date(Math.min(toDate(sem.end).getTime(), until.getTime()));
  const cursor = toDate(sem.start);
  const wd = DAY_INDEX[session.day];
  let n = 0;
  while (cursor <= end) {
    if (cursor.getDay() === wd && !inBreak(sem, cursor)) n++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return n;
};

export const totalOccurrences = (sem: Semester, session: Session) =>
  countOccurrences(sem, session, toDate(sem.end));

/** True when lectures are actually running on this date (inside the semester, not in a break/exam period). */
export const lecturesRunning = (sem: Semester, d = new Date()) => {
  const t = new Date(d); t.setHours(0, 0, 0, 0);
  return t >= toDate(sem.start) && t <= toDate(sem.end) && !inBreak(sem, t);
};

export const daysUntil = (iso: string, now = new Date()) =>
  Math.ceil((toDate(iso).getTime() - now.getTime()) / 86_400_000);

/** Week number of the semester (1-based), or null outside the semester. */
export const semesterWeek = (sem: Semester, now = new Date()): number | null => {
  const start = toDate(sem.start).getTime();
  const end = toDate(sem.end).getTime();
  if (now.getTime() < start || now.getTime() > end + 86_400_000) return null;
  return Math.floor((now.getTime() - start) / (7 * 86_400_000)) + 1;
};

export const semesterOver = (sem: Semester, now = new Date()) => now.getTime() > toDate(sem.end).getTime() + 86_400_000;

export interface NextClass { session: Session; minsUntil: number }

export const nextClassToday = (y: YearConfig, now = new Date()): NextClass | null => {
  if (!lecturesRunning(y.semester, now)) return null;
  const day = todayDayName(now);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const s of sessionsOn(y, day)) {
    const mins = toMinutes(s.start) - nowMins;
    if (mins > 0) return { session: s, minsUntil: mins };
  }
  return null;
};

export const fmtCountdown = (mins: number) =>
  mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;

export const unique = <T,>(arr: T[]) => Array.from(new Set(arr));

/* ───────── countdowns ───────── */
export type CountdownState = "upcoming" | "active" | "done";
export interface Countdown {
  id: "midsem" | "exams" | "end";
  label: string;
  state: CountdownState;
  /** the moment we are counting down to (start of the event, or its end once it is under way) */
  target: Date;
  startIso: string;
  endIso: string;
  note: string;
}

const startOfDay = (iso: string) => toDate(iso);
const endOfDay = (iso: string) => { const d = toDate(iso); d.setDate(d.getDate() + 1); return d; };

/** Build the dashboard countdowns from a Semester. Events the semester doesn't define are skipped. */
export function countdownsFor(sem: Semester, now: Date): Countdown[] {
  const out: Countdown[] = [];
  const range = (id: Countdown["id"], label: string, r: [string, string]) => {
    const s = startOfDay(r[0]), e = endOfDay(r[1]);
    const state: CountdownState = now < s ? "upcoming" : now < e ? "active" : "done";
    out.push({ id, label, state, target: state === "upcoming" ? s : e, startIso: r[0], endIso: r[1],
      note: state === "upcoming" ? "until it starts" : state === "active" ? "in progress · until it ends" : "finished" });
  };
  if (sem.midsem) range("midsem", "Mid-semester exams", sem.midsem);
  if (sem.exams) range("exams", "End-of-semester exams", sem.exams);
  const e = endOfDay(sem.end);
  out.push({ id: "end", label: "End of semester", state: now < e ? "upcoming" : "done", target: e, startIso: sem.start, endIso: sem.end,
    note: now < e ? "until the semester ends" : "semester complete" });
  return out;
}

export interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; totalMs: number }
export function timeLeft(target: Date, now: Date): TimeLeft {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const s = Math.floor(ms / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60, totalMs: ms };
}
