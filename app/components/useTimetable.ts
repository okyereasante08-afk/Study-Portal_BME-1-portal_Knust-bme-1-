"use client";

import { useCallback, useMemo } from "react";
import type { Day, Session, SessionType, YearConfig } from "../lib/types";
import { usePersistentState } from "./hooks";

type Editable = "day" | "start" | "end" | "course" | "group" | "venue" | "lecturer" | "type";
const FIELDS: Editable[] = ["day", "start", "end", "course", "group", "venue", "lecturer", "type"];

interface Overrides {
  edits: Record<string, Partial<Record<Editable, string>>>; // official session id -> changed fields only
  added: Session[];                                          // classes the user created
  removed: string[];                                         // official sessions the user hid
}
const EMPTY: Overrides = { edits: {}, added: [], removed: [] };

export type SessionDraft = Omit<Session, "id"> & { id?: string };

/**
 * Layers the user's own timetable changes over the official timetable in years.ts.
 * Saved per year + semester, on this device only. Returns a YearConfig whose `timetable`
 * is the merged result, so every other part of the app just uses `year` as usual.
 */
export function useTimetable(base: YearConfig) {
  const [ov, setOv] = usePersistentState<Overrides>(`portal:tt:y${base.level}:${base.semester.id}`, EMPTY);

  const year = useMemo<YearConfig>(() => {
    const merged = base.timetable
      .filter((s) => !ov.removed.includes(s.id))
      .map((s) => (ov.edits[s.id] ? ({ ...s, ...ov.edits[s.id] } as Session) : s));
    return { ...base, timetable: [...merged, ...ov.added] };
  }, [base, ov]);

  const officialOf = useCallback((id: string) => base.timetable.find((s) => s.id === id) ?? null, [base.timetable]);
  const isEdited = useCallback((id: string) => id in ov.edits || ov.added.some((a) => a.id === id), [ov]);
  const isCustom = useCallback((id: string) => ov.added.some((a) => a.id === id), [ov]);

  const save = useCallback((d: SessionDraft) => {
    setOv((prev) => {
      // brand-new class
      if (!d.id) {
        const id = `u${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
        return { ...prev, added: [...prev.added, { ...d, id } as Session] };
      }
      // edit of a class the user created
      if (prev.added.some((a) => a.id === d.id)) {
        return { ...prev, added: prev.added.map((a) => (a.id === d.id ? ({ ...d, id: d.id! } as Session) : a)) };
      }
      // edit of an official class: store only what differs
      const official = base.timetable.find((s) => s.id === d.id);
      if (!official) return prev;
      const diff: Partial<Record<Editable, string>> = {};
      for (const k of FIELDS) {
        const a = (d[k] ?? "") as string, b = (official[k] ?? "") as string;
        if (a !== b) diff[k] = a; // "" (not undefined) so clearing a field survives JSON
      }
      const edits = { ...prev.edits };
      if (Object.keys(diff).length) edits[d.id] = diff; else delete edits[d.id];
      return { ...prev, edits };
    });
  }, [base.timetable, setOv]);

  const remove = useCallback((id: string) => {
    setOv((prev) => {
      if (prev.added.some((a) => a.id === id)) return { ...prev, added: prev.added.filter((a) => a.id !== id) };
      const edits = { ...prev.edits }; delete edits[id];
      return { ...prev, edits, removed: prev.removed.includes(id) ? prev.removed : [...prev.removed, id] };
    });
  }, [setOv]);

  const revert = useCallback((id: string) => {
    setOv((prev) => { const edits = { ...prev.edits }; delete edits[id]; return { ...prev, edits, removed: prev.removed.filter((r) => r !== id) }; });
  }, [setOv]);

  const reset = useCallback(() => setOv(EMPTY), [setOv]);
  const changeCount = Object.keys(ov.edits).length + ov.added.length + ov.removed.length;

  return { year, save, remove, revert, reset, officialOf, isEdited, isCustom, changeCount };
}
export type TimetableApi = ReturnType<typeof useTimetable>;
export type { Day, SessionType };
