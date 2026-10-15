// app/lib/calendar.ts
// ---------------------------------------------------------------------------
// ★ THE ONE PLACE TO EDIT SEMESTER DATES ★
// Every countdown, "week N" label, attendance count and the assistant read from here.
// Dates are ISO "YYYY-MM-DD". Each semester also needs a unique `id`: attendance is saved
// per id, so changing it starts a fresh semester.
//
//   start   first day of lectures          midsem  [first day, last day]  (optional)
//   end     last day of the semester       exams   [first day, last day]  (optional)
//   breaks  date ranges with NO lectures (mid-sems, exams, holidays); used for attendance maths
// ---------------------------------------------------------------------------

import type { Semester } from "./types";

export const SEMESTER: Semester = {
  id: "2026-S2",
  label: "Semester 2 · 2025/26",
  start: "2026-05-25",
  end: "2026-09-04",
  midsem: ["2026-07-06", "2026-07-10"],
  exams: ["2026-08-17", "2026-09-04"],
  breaks: [
    ["2026-07-06", "2026-07-10"],
    ["2026-08-17", "2026-09-04"],
  ],
};
