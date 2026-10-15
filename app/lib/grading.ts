// app/lib/grading.ts
// ---------------------------------------------------------------------------
// KNUST degree classification, by Cumulative Weighted Average (CWA).
//
// Source: KNUST College of Humanities & Social Sciences (cohss.knust.edu.gh,
// "Examination and grading system"): First 70%+, Second Upper 60-69.9,
// Second Lower 50-59.9, Pass starts at 45.
//
// ⚠ Some third-party sites list the lowest pass band differently (e.g. 40).
//   If your handbook says otherwise, change `min` below. Nothing else needs editing.
// ---------------------------------------------------------------------------

export interface ClassBand {
  id: "first" | "upper" | "lower" | "pass";
  name: string;
  min: number;      // lowest CWA in this band
  max: number;      // highest CWA in this band (display only)
}

/** Ordered best → worst. */
export const CLASS_BANDS: ClassBand[] = [
  { id: "first", name: "First Class",         min: 70, max: 100   },
  { id: "upper", name: "Second Class Upper",  min: 60, max: 69.99 },
  { id: "lower", name: "Second Class Lower",  min: 50, max: 59.99 },
  { id: "pass",  name: "Pass",                min: 45, max: 49.99 },
];

export const BELOW_PASS = "Below pass";

/** Approximate 4.0-scale equivalents (from a third-party KNUST conversion table). Display-only. */
export const GPA_STEPS: { min: number; gpa: number }[] = [
  { min: 70, gpa: 4.0 }, { min: 65, gpa: 3.5 }, { min: 60, gpa: 3.0 }, { min: 55, gpa: 2.5 },
  { min: 50, gpa: 2.0 }, { min: 45, gpa: 1.5 }, { min: 40, gpa: 1.0 },
];

export const bandOf = (cwa: number): ClassBand | null => CLASS_BANDS.find((b) => cwa >= b.min) ?? null;
export const bandName = (cwa: number) => bandOf(cwa)?.name ?? BELOW_PASS;
export const approxGpa = (cwa: number) => GPA_STEPS.find((s) => cwa >= s.min)?.gpa ?? 0;
