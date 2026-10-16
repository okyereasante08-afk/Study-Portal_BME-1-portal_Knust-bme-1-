// app/lib/courses.ts
// ---------------------------------------------------------------------------
// Course titles and credit hours, keyed by course code.
// The timetable spreadsheet only contains codes, so fill these in from the course handbook / your
// course registration. Anything left out still works: the app shows the code, and students enter
// credit hours themselves in the CWA calculator.
//
//   "COE 181": { name: "Introduction to ...", credits: 3 },
// ---------------------------------------------------------------------------

export const COURSE_INFO: Record<string, { name?: string; credits?: number }> = {
  // ← add entries here
};
