"use client";

import React, { useMemo, useRef, useState } from "react";
import { Plus, Trash2, Target, TrendingUp } from "lucide-react";
import type { YearConfig } from "../lib/types";
import { Modal } from "./ui";
import { usePersistentState } from "./hooks";
import { CLASS_BANDS, BELOW_PASS, approxGpa, bandName, bandOf } from "../lib/grading";
import { ceil1, combinedCwa, fmt, maxOverall, minOverall, planFor, semesterCwa } from "../lib/cwa";

interface Row { id: number; name: string; credits: string; score: string }
interface Saved { cwa: string; credits: string; target: string; total: string }
type Mode = "semester" | "continuing";

const num = (s: string): number | null => { const v = parseFloat(s); return s.trim() !== "" && Number.isFinite(v) ? v : null; };
const clamp = (v: string, max: number) => (v === "" ? "" : String(Math.min(max, Math.max(0, Number(v) || 0))));

function Field({ id, label, hint, value, onChange, error, max, step = "0.01", placeholder }: {
  id: string; label: string; hint?: string; value: string; onChange: (v: string) => void; error?: string | null; max?: number; step?: string; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block" style={{ marginBottom: 6 }}>{label}</label>
      <input id={id} className="input" type="number" inputMode="decimal" min={0} max={max} step={step} value={value} placeholder={placeholder}
        aria-invalid={!!error} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} onChange={(e) => onChange(e.target.value)} />
      {error ? <p id={`${id}-err`} role="alert" style={{ color: "var(--bad)", fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>{error}</p>
        : hint ? <p id={`${id}-hint`} className="text-muted-x" style={{ fontSize: 11, margin: "4px 0 0" }}>{hint}</p> : null}
    </div>
  );
}

export function CwaModal({ year, onClose }: { year: YearConfig; onClose: () => void }) {
  const [mode, setMode] = useState<Mode>("semester");
  const [rows, setRows] = useState<Row[]>(() =>
    year.courses.length
      ? year.courses.map((c, i) => ({ id: i, name: c.name ? `${c.code} · ${c.name}` : c.code, credits: c.credits ? String(c.credits) : "", score: "" }))
      : [{ id: 0, name: "", credits: "3", score: "" }, { id: 1, name: "", credits: "3", score: "" }]
  );
  const nextId = useRef(rows.length + 1);
  // saved on this device so continuing students don't retype their record each time
  const [saved, setSaved] = usePersistentState<Saved>("portal:cwa:continuing", { cwa: "", credits: "", target: "", total: "" });
  const set = (k: keyof Saved, v: string) => setSaved({ ...saved, [k]: v });

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  /* ───────── this-semester mode ───────── */
  const scored = useMemo(() => rows.map((r) => ({ score: num(r.score), credits: num(r.credits) }))
    .filter((r): r is { score: number; credits: number } => r.score !== null && r.credits !== null && r.credits > 0), [rows]);
  const semCwa = useMemo(() => semesterCwa(scored), [scored]);
  const semCredits = useMemo(() => rows.reduce((s, r) => s + Math.max(0, num(r.credits) ?? 0), 0), [rows]);

  /* ───────── continuing-student mode ───────── */
  const acc = num(saved.cwa), accCr = num(saved.credits), target = num(saved.target), total = num(saved.total);
  const errors = {
    cwa: saved.cwa !== "" && (acc === null || acc < 0 || acc > 100) ? "Enter a CWA between 0 and 100" : null,
    credits: saved.credits !== "" && (accCr === null || accCr < 0) ? "Enter 0 or more credits" : null,
    target: saved.target !== "" && (target === null || target < 0 || target > 100) ? "Enter a target between 0 and 100" : null,
    total: saved.total !== "" && (total === null || total <= (accCr ?? 0)) ? "Must be more than the credits you've done" : null,
  };
  const ready = acc !== null && accCr !== null && !errors.cwa && !errors.credits && semCredits > 0;

  const calc = useMemo(() => {
    if (!ready || acc === null || accCr === null) return null;
    const totalOk = total !== null && !errors.total ? total : undefined;
    const targetPlan = target !== null && !errors.target ? planFor(target, acc, accCr, semCredits, totalOk) : null;
    const bands = CLASS_BANDS.map((b) => ({ band: b, plan: planFor(b.min, acc, accCr, semCredits, totalOk) }));
    const cur = bandOf(acc);
    const idx = cur ? CLASS_BANDS.findIndex((b) => b.id === cur.id) : CLASS_BANDS.length;
    const stay = cur ? planFor(cur.min, acc, accCr, semCredits, totalOk) : null;
    const up = idx > 0 ? { band: CLASS_BANDS[idx - 1], plan: planFor(CLASS_BANDS[idx - 1].min, acc, accCr, semCredits, totalOk) } : null;
    const projected = scored.length ? combinedCwa(acc, accCr, scored) : null;
    return { targetPlan, bands, cur, stay, up, projected, hi: maxOverall(acc, accCr, semCredits), lo: minOverall(acc, accCr, semCredits), totalOk };
  }, [ready, acc, accCr, target, total, semCredits, scored, errors.target, errors.total]);

  const tone = semCwa === null ? "var(--ink)" : semCwa >= 70 ? "var(--ok)" : semCwa >= 60 ? "var(--warn)" : "var(--bad)";

  const needText = (n: number | null, reach: string) =>
    n === null ? "—" : reach === "secured" ? "Secured" : reach === "out-of-reach" ? "Out of reach" : `${ceil1(n)}%`;

  const coursesBlock = (
      <div className="stack gap-2" style={{ padding: "16px 16px 14px" }}>
      <p className="eyebrow" style={{ marginBottom: 2 }}>{mode === "continuing" ? "This semester's courses · adjust your load here" : "Your courses"}</p>
      {mode === "continuing" && <p className="text-muted-x" style={{ fontSize: 11, margin: "0 0 4px" }}>Credits set your semester load. Scores are optional: add any you already know to see your projected overall CWA.</p>}
      {semCredits <= 0 && year.courses.length > 0 && <p className="chip chip-info" style={{ alignSelf: "flex-start", marginBottom: 4 }}>Credit hours aren&apos;t set for these courses yet. Enter them from your course registration.</p>}
      <div className="flex gap-2 eyebrow" style={{ padding: "0 4px" }}>
        <span style={{ flex: 1 }}>Course</span><span style={{ width: 56, textAlign: "center" }}>Credits</span><span style={{ width: 64, textAlign: "center" }}>Score</span><span style={{ width: 28 }} />
      </div>
      {rows.map((r) => (
        <div key={r.id} className="flex items-center gap-2">
          <input className="input" style={{ flex: 1, minWidth: 0, padding: "9px 10px", fontSize: 13 }} placeholder="Course name" value={r.name} aria-label="Course name"
            onChange={(e) => update(r.id, { name: e.target.value })} />
          <input className="input" style={{ width: 56, padding: "9px 4px", textAlign: "center", fontSize: 13 }} type="number" inputMode="decimal" min={0} max={10} value={r.credits} aria-label="Credit hours"
            onChange={(e) => update(r.id, { credits: clamp(e.target.value, 10) })} />
          <input className="input" style={{ width: 64, padding: "9px 4px", textAlign: "center", fontSize: 13, fontWeight: 700 }} type="number" inputMode="decimal" min={0} max={100} placeholder="—" value={r.score} aria-label="Score"
            onChange={(e) => update(r.id, { score: clamp(e.target.value, 100) })} />
          <button className="icon-btn" style={{ width: 28, height: 28 }} aria-label="Remove course" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}><Trash2 size={12} /></button>
        </div>
      ))}
      <button className="btn btn-sm" style={{ alignSelf: "flex-start", marginTop: 4 }}
        onClick={() => setRows((rs) => [...rs, { id: nextId.current++, name: "", credits: "3", score: "" }])}><Plus size={13} /> Add course</button>
    </div>
  );

  return (
    <Modal wide title="CWA calculator" sub={`${year.title} · plan your semester and your degree class`} onClose={onClose}>
      <div style={{ padding: "14px 16px 0" }}>
        <div className="segmented" role="group" aria-label="Calculator mode" style={{ display: "flex" }}>
          {([["semester", "This semester"], ["continuing", "Continuing student"]] as [Mode, string][]).map(([m, l]) => (
            <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)} style={{ flex: 1 }}>{l}</button>
          ))}
        </div>
      </div>

      {/* ── continuing: accumulated record ── */}
      {mode === "continuing" && (
        <div style={{ padding: "16px 16px 0" }}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>Your record so far</p>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", alignItems: "end" }}>
            <Field id="cw-acc" label="Current accumulated CWA" value={saved.cwa} onChange={(v) => set("cwa", clamp(v, 100))} max={100} placeholder="e.g. 64.25" error={errors.cwa} />
            <Field id="cw-cr" label="Credits completed so far" value={saved.credits} onChange={(v) => set("credits", clamp(v, 400))} step="1" placeholder="e.g. 36" error={errors.credits} />
            <Field id="cw-tg" label="Target CWA" value={saved.target} onChange={(v) => set("target", clamp(v, 100))} max={100} placeholder="e.g. 70" error={errors.target} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Field id="cw-total" label="Total credits in your programme (optional)" value={saved.total} onChange={(v) => set("total", clamp(v, 600))} step="1"
              placeholder="e.g. 150" hint="Adds a whole-degree view: the average you'd need over all remaining credits." error={errors.total} />
          </div>
          <p className="text-muted-x" style={{ fontSize: 11, margin: "8px 0 0" }}>Saved on this device only.</p>
        </div>
      )}

      {mode === "semester" && coursesBlock}

      {/* ── this-semester result ── */}
      {mode === "semester" && (
        <div className="card-soft flex items-center justify-between" style={{ margin: "0 16px 18px", padding: "14px 18px" }} aria-live="polite">
          <div>
            <span className="text-ink-2" style={{ fontSize: 13, fontWeight: 700 }}>Projected semester CWA</span>
            {semCwa !== null && <p className="text-muted-x" style={{ fontSize: 11, margin: "3px 0 0" }}>{bandName(semCwa)} range · ≈ GPA {approxGpa(semCwa).toFixed(1)}</p>}
          </div>
          <span className="h-display" style={{ fontSize: 34, color: tone }}>{semCwa === null ? "—" : fmt(semCwa)}</span>
        </div>
      )}

      {/* ── continuing results ── */}
      {mode === "continuing" && (
        <div className="stack gap-3" style={{ padding: "0 16px 18px" }} aria-live="polite">
          {!calc && (
            <div className="card-soft" style={{ padding: 16 }}>
              <p className="text-ink-2" style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                {semCredits <= 0 ? "Enter the credit hours for your courses below (from your course registration), then your numbers above." : "Enter your current CWA and completed credits to see what you need this semester."}
              </p>
            </div>
          )}

          {calc && (
            <>
              {/* needed for target */}
              <div className="card-soft" style={{ padding: 18 }}>
                <p className="eyebrow flex items-center gap-2" style={{ marginBottom: 8 }}><Target size={13} /> Needed this semester <span className="text-muted-x" style={{ textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>· {semCredits} credits · {rows.filter((r) => (num(r.credits) ?? 0) > 0).length} courses</span></p>
                {!calc.targetPlan ? (
                  <p className="text-ink-2" style={{ fontSize: 13, margin: 0 }}>Enter a target CWA to see the exact semester average you need.</p>
                ) : (
                  <>
                    <div className="flex items-end justify-between gap-3 flex-wrap">
                      <span className="h-display" style={{ fontSize: 44, lineHeight: 1,
                        color: calc.targetPlan.reach === "secured" ? "var(--ok)" : calc.targetPlan.reach === "out-of-reach" ? "var(--bad)" : "var(--ink)" }}>
                        {needText(calc.targetPlan.needed, calc.targetPlan.reach)}
                      </span>
                      {calc.targetPlan.reach === "reachable" && calc.targetPlan.needed !== null && (
                        <span className="chip chip-info">≈ GPA {approxGpa(calc.targetPlan.needed).toFixed(1)}</span>
                      )}
                    </div>
                    <p className="text-ink-2" style={{ fontSize: 13, lineHeight: 1.6, margin: "10px 0 0" }}>
                      {calc.targetPlan.reach === "secured" && <>Even a 0% semester keeps you at or above <b>{fmt(target!)}</b>. Your lowest possible overall is {fmt(calc.lo)}.</>}
                      {calc.targetPlan.reach === "reachable" && <>Score an average of at least <b>{ceil1(calc.targetPlan.needed!)}%</b> across your {semCredits} credits to finish on <b>{fmt(target!)}</b> overall ({bandName(target!)}).</>}
                      {calc.targetPlan.reach === "out-of-reach" && <>A perfect 100% in every course only takes you to <b>{fmt(calc.hi)}</b> this semester, so <b>{fmt(target!)}</b> needs more than one semester.</>}
                    </p>
                    {calc.targetPlan.neededRemaining !== null && (
                      <p className="text-muted-x" style={{ fontSize: 12, margin: "8px 0 0" }}>
                        Whole-degree view: about <b>{calc.targetPlan.neededRemaining > 100 ? "more than 100" : calc.targetPlan.neededRemaining <= 0 ? "any score" : `${ceil1(calc.targetPlan.neededRemaining)}%`}</b> average over your remaining {total! - accCr!} credits.
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* projection from scores already entered */}
              {calc.projected !== null && (
                <div className="card-soft flex items-center justify-between gap-3" style={{ padding: "14px 18px" }}>
                  <div>
                    <p className="eyebrow flex items-center gap-2" style={{ marginBottom: 4 }}><TrendingUp size={13} /> With your entered scores</p>
                    <p className="text-muted-x" style={{ fontSize: 11, margin: 0 }}>{bandName(calc.projected)}{target !== null && !errors.target ? (calc.projected >= target ? " · on target ✓" : ` · ${fmt(target - calc.projected)} short of target`) : ""}</p>
                  </div>
                  <span className="h-display" style={{ fontSize: 30 }}>{fmt(calc.projected)}</span>
                </div>
              )}

              {/* stay / move-up guidance */}
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {calc.cur && calc.stay && (
                  <div className="card-soft" style={{ padding: 14 }}>
                    <p className="eyebrow" style={{ marginBottom: 6 }}>To stay in {calc.cur.name}</p>
                    <p style={{ fontSize: 13, margin: 0, lineHeight: 1.55 }}>
                      {calc.stay.reach === "secured" ? <>You stay in this class <b>whatever you score</b> this semester.</> : <>Score at least <b>{ceil1(calc.stay.needed!)}%</b> this semester.</>}
                    </p>
                  </div>
                )}
                {!calc.cur && (
                  <div className="card-soft" style={{ padding: 14 }}>
                    <p className="eyebrow" style={{ marginBottom: 6 }}>Current standing</p>
                    <p style={{ fontSize: 13, margin: 0, lineHeight: 1.55 }}>{BELOW_PASS}. Reaching <b>{CLASS_BANDS[CLASS_BANDS.length - 1].name}</b> needs {planFor(CLASS_BANDS[CLASS_BANDS.length - 1].min, acc!, accCr!, semCredits).reach === "out-of-reach" ? "more than one semester" : `at least ${ceil1(planFor(CLASS_BANDS[CLASS_BANDS.length - 1].min, acc!, accCr!, semCredits).needed!)}%`}.</p>
                  </div>
                )}
                {calc.up && (
                  <div className="card-soft" style={{ padding: 14 }}>
                    <p className="eyebrow" style={{ marginBottom: 6 }}>To move up to {calc.up.band.name}</p>
                    <p style={{ fontSize: 13, margin: 0, lineHeight: 1.55 }}>
                      {calc.up.plan.reach === "out-of-reach" ? <>Not possible in one semester (best case <b>{fmt(calc.hi)}</b>).</> : calc.up.plan.reach === "secured" ? <>You&apos;re already there.</> : <>Score at least <b>{ceil1(calc.up.plan.needed!)}%</b> this semester.</>}
                    </p>
                  </div>
                )}
              </div>

              {/* dynamic class ranges */}
              <div className="card-soft" style={{ padding: "14px 16px" }}>
                <p className="eyebrow" style={{ marginBottom: 10 }}>Class ranges · what each needs from this semester</p>
                <div className="stack gap-2">
                  {calc.bands.map(({ band, plan }) => {
                    const here = calc.cur?.id === band.id, isTarget = target !== null && !errors.target && bandOf(target)?.id === band.id;
                    return (
                      <div key={band.id} className="flex items-center justify-between gap-3 flex-wrap"
                        style={{ padding: "10px 12px", borderRadius: "var(--radius-ctl)", background: "var(--card)", border: `var(--border-w) solid ${here ? "var(--accent)" : "var(--line)"}` }}>
                        <div style={{ minWidth: 0 }}>
                          <p className="h-title" style={{ fontSize: 14, margin: 0 }}>{band.name}
                            {here && <span className="chip chip-info" style={{ marginLeft: 8 }}>You&apos;re here</span>}
                            {isTarget && <span className="chip" style={{ marginLeft: 6 }}>Target</span>}
                          </p>
                          <p className="text-muted-x" style={{ fontSize: 11, margin: "2px 0 0" }}>{band.min.toFixed(2)} – {band.max === 100 ? "100" : band.max.toFixed(2)} overall{plan.neededRemaining !== null ? ` · ${plan.neededRemaining > 100 ? ">100" : plan.neededRemaining <= 0 ? "any" : ceil1(plan.neededRemaining) + "%"} over remaining credits` : ""}</p>
                        </div>
                        {plan.reach === "secured" && <span className="chip chip-ok">Secured</span>}
                        {plan.reach === "reachable" && <span className="chip chip-info">Need ≥ {ceil1(plan.needed!)}%</span>}
                        {plan.reach === "out-of-reach" && <span className="chip chip-bad">Out of reach</span>}
                      </div>
                    );
                  })}
                </div>
                <p className="text-muted-x" style={{ fontSize: 11, margin: "10px 0 0", lineHeight: 1.5 }}>
                  Bands follow KNUST regulations (First 70+, Second Upper 60–69.99, Second Lower 50–59.99, Pass 45–49.99). GPA figures are approximate. Always confirm against your handbook.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {mode === "continuing" && coursesBlock}
    </Modal>
  );
}
