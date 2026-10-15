"use client";

import React from "react";
import type { Semester } from "../lib/types";
import { countdownsFor, timeLeft, type Countdown } from "../lib/schedule";
import { CountUp } from "../lib/motion";
import { useNow } from "./hooks";

const pad = (n: number) => String(n).padStart(2, "0");
const fmtDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/**
 * Live academic countdowns: mid-sem exams, end-of-sem exams, end of semester.
 * Dates come from app/lib/calendar.ts. Ticks every second, and only this widget re-renders.
 */
export function CountdownWidget({ semester, compact }: { semester: Semester; compact?: boolean }) {
  const now = useNow(1000);
  const items = now ? countdownsFor(semester, now) : [];
  const min = compact ? 116 : 170;

  return (
    <section aria-label="Academic countdowns">
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))` }}>
        {(now ? items : [0, 1, 2].map((i) => ({ id: `s${i}` }) as unknown as Countdown)).map((c) => {
          if (!now) return <div key={c.id} className="card" style={{ padding: 16, minHeight: compact ? 132 : 148 }} aria-hidden />;
          const t = timeLeft(c.target, now);
          const done = c.state === "done";
          return (
            <div key={c.id} className="card" style={{ padding: compact ? "14px 12px 12px" : "16px 16px 14px" }} role="timer" aria-label={`${c.label}: ${done ? "finished" : `${t.days} days ${t.hours} hours ${t.minutes} minutes`}`}>
              <p className="eyebrow" style={{ marginBottom: 10, fontSize: compact ? 9 : 11, lineHeight: 1.35 }}>{c.label}</p>
              {done ? (
                <>
                  <p className="h-display" style={{ fontSize: 30, margin: "0 0 6px", color: "var(--ok)" }}>Done ✓</p>
                  <p className="text-muted-x" style={{ fontSize: 11, margin: 0 }}>{c.note}</p>
                </>
              ) : (
                <>
                  <p className="h-display flex items-baseline gap-2" style={{ margin: "0 0 6px" }}>
                    <span style={{ fontSize: compact ? 32 : 40, lineHeight: 1 }}><CountUp value={t.days} /></span>
                    <span className="eyebrow" style={{ letterSpacing: "0.06em" }}>{t.days === 1 ? "day" : "days"}</span>
                  </p>
                  <p className="font-mono-x" style={{ fontSize: compact ? 11 : 13, fontWeight: 700, margin: "0 0 8px", letterSpacing: 1 }} aria-hidden>
                    {pad(t.hours)}<span className="text-muted-x">h</span> {pad(t.minutes)}<span className="text-muted-x">m</span> {pad(t.seconds)}<span className="text-muted-x">s</span>
                  </p>
                  <p className="text-muted-x" style={{ fontSize: 11, margin: 0 }}>
                    {c.state === "active" && <span className="chip chip-warn" style={{ marginRight: 6 }}>Now</span>}
                    {c.note} · {c.id === "end" ? fmtDate(c.endIso) : c.state === "active" ? fmtDate(c.endIso) : fmtDate(c.startIso)}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
