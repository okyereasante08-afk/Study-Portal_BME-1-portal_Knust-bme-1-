// lib/roster.ts
// Closed beta — Year 1 BME student roster.
// Format: { id: "STUDENT_ID", name: "Display Name" }
// Add Years 2–4 rosters here when you have them.
// NEVER commit real student IDs to a public repo — consider
// moving this to an env var or Supabase table before going public.

export interface Student {
  id:   string;
  name: string;
}

// ── YEAR 1 ────────────────────────────────────────────────────
export const YEAR1_ROSTER: Student[] = [
  { id: "22028883", name: "Asante Kwaku Okyere" },
  // Add the rest of your classmates here:
  // { id: "22XXXXXXX", name: "Full Name" },
];

// ── FUTURE YEARS (add when ready) ────────────────────────────
export const YEAR2_ROSTER: Student[] = [];
export const YEAR3_ROSTER: Student[] = [];
export const YEAR4_ROSTER: Student[] = [];

// ── LOOKUP HELPER ─────────────────────────────────────────────
const ALL_ROSTERS: Record<number, Student[]> = {
  1: YEAR1_ROSTER,
  2: YEAR2_ROSTER,
  3: YEAR3_ROSTER,
  4: YEAR4_ROSTER,
};

export function lookupStudent(
  studentId: string,
  yearLevel: number
): Student | null {
  const roster = ALL_ROSTERS[yearLevel] ?? [];
  return roster.find(s => s.id.trim() === studentId.trim()) ?? null;
}

// For checking if a beta is open for a year
export function isBetaOpen(yearLevel: number): boolean {
  return (ALL_ROSTERS[yearLevel] ?? []).length > 0;
}
