// app/lib/calendar.ts
// ---------------------------------------------------------------------------
// ★ THE ONE PLACE TO EDIT SEMESTER DATES ★
// Every countdown, "week N" label, attendance count, the Home updates card and the assistant read from here.
// Dates are ISO "YYYY-MM-DD". Each semester also needs a unique `id`: attendance is saved
// per id, so changing it starts a fresh semester.
//
//   start   first day of lectures          midsem  [first day, last day]  (optional)
//   end     last day of the semester       exams   [first day, last day]  (optional)
//   breaks  date ranges with NO lectures (mid-sems, exams, holidays); used for attendance maths
// ---------------------------------------------------------------------------

import type { Semester } from "./types";

export const SEMESTER: Semester = {
  id: "2026-S1",
  label: "Semester 1 · 2026/27",
  start: "2026-10-19",                    // Teaching period begins
  end: "2027-02-13",                      // Students depart
  midsem: ["2026-12-14", "2026-12-18"],   // Mid-semester examinations
  exams: ["2027-01-25", "2027-02-12"],    // First semester examinations
  breaks: [
    ["2026-12-14", "2026-12-18"],         // mid-semester examinations (no lectures)
    ["2026-12-19", "2027-01-03"],         // Christmas break
    ["2027-01-25", "2027-02-12"],         // first semester examinations
  ],
};

/**
 * Other dates from the academic calendar that students care about. They appear in the Home "Updates" card.
 * `years` limits an item to certain levels (omit = everyone). Delete or edit freely.
 */
export interface CalendarNotice { id: string; text: string; date: string; until?: string; years?: (1 | 2 | 3 | 4)[]; type: "info" | "deadline" }
export const CALENDAR_NOTICES: CalendarNotice[] = [
  { id: "reg-online",  text: "Online course registration is open (Oct 12 – 29)",               date: "2026-10-12", until: "2026-10-29", type: "deadline" },
  { id: "arrival-c",   text: "Arrival of continuing students: Saturday, Oct 17",               date: "2026-10-17", years: [2, 3, 4], type: "info" },
  { id: "orient",      text: "Freshmen orientation (Oct 14 – 16)",                             date: "2026-10-14", until: "2026-10-16", years: [1], type: "info" },
  { id: "teach-start", text: "Teaching period begins: Monday, Oct 19",                         date: "2026-10-19", type: "info" },
  { id: "biometric",   text: "Biometric registration for all students (Oct 19 – Nov 12)",      date: "2026-10-19", until: "2026-11-12", type: "deadline" },
  { id: "matric",      text: "Matriculation (Nov 13 – 14)",                                    date: "2026-11-13", until: "2026-11-14", years: [1], type: "info" },
  { id: "midsem",      text: "Mid-semester examinations (Dec 14 – 18)",                        date: "2026-12-14", until: "2026-12-18", type: "deadline" },
  { id: "lect-assess", text: "Assessment of lecturers by students (Dec 16 – Jan 23)",          date: "2026-12-16", until: "2027-01-23", type: "info" },
  { id: "xmas",        text: "Christmas break (Dec 19 – Jan 3). Lectures resume Monday, Jan 4", date: "2026-12-19", until: "2027-01-03", type: "info" },
  { id: "exams",       text: "First semester examinations (Jan 25 – Feb 12)",                  date: "2027-01-25", until: "2027-02-12", type: "deadline" },
];
