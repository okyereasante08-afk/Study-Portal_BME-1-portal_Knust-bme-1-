// app/lib/cwa.ts
// Pure CWA maths (no React), so it can be unit-tested.
//
//   CWA = Σ(score × credits) / Σ(credits)
//
// For a continuing student with accumulated CWA `c0` over `C` credits, taking `s` new credits:
//   overall = (c0·C + semAvg·s) / (C + s)
//   ⇒ semester average needed to reach `target`:  (target·(C+s) − c0·C) / s

export interface ScoredCourse { score: number; credits: number }

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Weighted average of this semester's scored courses (null if nothing scored). */
export function semesterCwa(courses: ScoredCourse[]): number | null {
  let ws = 0, tc = 0;
  for (const c of courses) if (c.credits > 0 && Number.isFinite(c.score)) { ws += c.score * c.credits; tc += c.credits; }
  return tc > 0 ? ws / tc : null;
}

/** New overall CWA after adding scored courses to accumulated records. */
export function combinedCwa(accCwa: number, accCredits: number, courses: ScoredCourse[]): number | null {
  const sem = courses.filter((c) => c.credits > 0 && Number.isFinite(c.score));
  const add = sem.reduce((s, c) => s + c.credits, 0);
  if (add + accCredits <= 0) return null;
  return (accCwa * accCredits + sem.reduce((s, c) => s + c.score * c.credits, 0)) / (accCredits + add);
}

/** Average you must score over `semCredits` this semester to finish on `target` overall. */
export function neededSemesterAvg(accCwa: number, accCredits: number, target: number, semCredits: number): number | null {
  if (semCredits <= 0) return null;
  return (target * (accCredits + semCredits) - accCwa * accCredits) / semCredits;
}

/** Best / worst overall CWA still possible after this semester. */
export const maxOverall = (accCwa: number, accCredits: number, semCredits: number) =>
  (accCwa * accCredits + 100 * semCredits) / (accCredits + semCredits);
export const minOverall = (accCwa: number, accCredits: number, semCredits: number) =>
  (accCwa * accCredits) / (accCredits + semCredits);

/** Average needed over ALL remaining credits in the programme to finish on `target`. */
export function neededOverRemaining(accCwa: number, accCredits: number, target: number, totalCredits: number): number | null {
  const remaining = totalCredits - accCredits;
  if (remaining <= 0) return null;
  return (target * totalCredits - accCwa * accCredits) / remaining;
}

export type Reach = "secured" | "reachable" | "out-of-reach";

export interface BandPlan {
  needed: number | null;        // semester average required (can be <0 or >100)
  reach: Reach;
  neededRemaining: number | null;
}

/** What this semester must look like to land at or above `target`. */
export function planFor(target: number, accCwa: number, accCredits: number, semCredits: number, totalCredits?: number): BandPlan {
  const needed = neededSemesterAvg(accCwa, accCredits, target, semCredits);
  let reach: Reach = "reachable";
  if (needed === null) reach = "out-of-reach";
  else if (needed <= 0) reach = "secured";
  else if (needed > 100) reach = "out-of-reach";
  const neededRemaining = totalCredits && totalCredits > accCredits ? neededOverRemaining(accCwa, accCredits, target, totalCredits) : null;
  return { needed, reach, neededRemaining };
}

/** Round UP to 1 dp: "you need at least X", never an optimistic X. */
export const ceil1 = (n: number) => Math.ceil(n * 10 - 1e-9) / 10;
export const fmt = (n: number) => r2(n).toFixed(2);
