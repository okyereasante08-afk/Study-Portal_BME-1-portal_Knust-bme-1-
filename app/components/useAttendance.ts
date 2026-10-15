"use client";

import { useCallback, useMemo } from "react";
import type { Session, YearConfig } from "../lib/types";
import { countOccurrences, MAX_ATTENDANCE_EDITS, toMinutes, totalOccurrences } from "../lib/schedule";
import { usePersistentState } from "./hooks";

export type Mark = "attended" | "skipped";
interface Store { marks: Record<string, Mark>; edits: Record<string, number> }

const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Attendance is recorded per class *per date* ("m1@2026-06-01"), so it keeps working week after week.
 * Saved per year + semester, so a new semester starts clean automatically.
 */
export function useAttendance(year: YearConfig) {
  const [store, setStore] = usePersistentState<Store>(
    `portal:att:y${year.level}:${year.semester.id}`,
    { marks: {}, edits: {} }
  );

  const keyFor = (s: Session, d: Date) => `${s.id}@${dateKey(d)}`;

  const getMark = useCallback((s: Session, d = new Date()): Mark | null => store.marks[keyFor(s, d)] ?? null, [store]);
  const editsLeft = useCallback((s: Session, d = new Date()) => MAX_ATTENDANCE_EDITS - (store.edits[keyFor(s, d)] ?? 0), [store]);

  const setMark = useCallback((s: Session, mark: Mark, d = new Date()) => {
    const k = keyFor(s, d);
    setStore((prev) => {
      const used = prev.edits[k] ?? 0;
      if (used >= MAX_ATTENDANCE_EDITS || prev.marks[k] === mark) return prev;
      return { marks: { ...prev.marks, [k]: mark }, edits: { ...prev.edits, [k]: used + 1 } };
    });
  }, [setStore]);

  const reset = useCallback(() => setStore({ marks: {}, edits: {} }), [setStore]);

  /** attended / held-so-far for one weekly session. */
  const stats = useCallback((s: Session, now = new Date()) => {
    const sem = year.semester;
    const startedToday = now.getHours() * 60 + now.getMinutes() >= toMinutes(s.start);
    const until = new Date(now); until.setHours(0, 0, 0, 0);
    if (!startedToday) until.setDate(until.getDate() - 1);
    const held = countOccurrences(sem, s, until);
    const attended = Object.entries(store.marks).filter(([k, v]) => k.startsWith(`${s.id}@`) && v === "attended").length;
    const pct = held > 0 ? Math.min(100, Math.round((attended / held) * 100)) : null;
    return { attended, held, total: totalOccurrences(sem, s), pct };
  }, [store, year.semester]);

  const average = useCallback((now = new Date()) => {
    const pcts = year.timetable.map((s) => stats(s, now).pct).filter((p): p is number => p !== null);
    return pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : null;
  }, [year.timetable, stats]);

  return useMemo(() => ({ getMark, setMark, editsLeft, stats, average, reset }),
    [getMark, setMark, editsLeft, stats, average, reset]);
}
export type Attendance = ReturnType<typeof useAttendance>;
