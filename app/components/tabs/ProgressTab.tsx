"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import type { YearConfig } from "../../lib/types";
import type { Attendance } from "../useAttendance";
import { AttendanceBadge, EmptyState, PageHeader } from "../ui";
import { sessionLabel } from "../../lib/schedule";
import { CountdownWidget } from "../CountdownWidget";
import { Bar, CountUp, Stagger } from "../../lib/motion";

export function ProgressTab({ year, now, att }: { year: YearConfig; now: Date | null; att: Attendance }) {
  const d = now ?? new Date();
  const avg = att.average(d);
  const sem = year.semester;

  if (year.timetable.length === 0)
    return (
      <>
        <PageHeader title="Progress" sub={`${year.title} · attendance`} />
        <EmptyState icon={<BarChart3 size={22} />} title="Nothing to track yet"
          body="Attendance tracking switches on as soon as this year's timetable is published." />
        <div style={{ marginTop: 20 }}><CountdownWidget semester={sem} /></div>
      </>
    );

  return (
    <Stagger className="stack gap-5">
      <PageHeader title="Progress" sub={`${year.title} · ${sem.label}`} />

      <div className="card" style={{ padding: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Overall attendance</p>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="h-display" style={{ fontSize: 48 }}>{avg === null ? "—" : <CountUp value={avg} suffix="%" />}</span>
          <div><AttendanceBadge pct={avg} />
            <p className="text-muted-x" style={{ fontSize: 12, margin: "6px 0 0" }}>Average across all weekly classes · below 70% is at risk</p></div>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>By class</p>
        <div className="stack gap-4">
          {year.timetable.map((s) => {
            const st = att.stats(s, d);
            return (
              <div key={s.id}>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{sessionLabel(s)} <span className="text-muted-x" style={{ fontWeight: 600 }}>· {s.day.slice(0, 3)}</span></span>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>{st.pct === null ? "—" : `${st.pct}%`}</span>
                </div>
                <Bar pct={st.pct ?? 0} />
                <p className="text-muted-x" style={{ fontSize: 11, margin: "5px 0 0" }}>{st.attended} attended · {st.held} held so far · {st.total} this semester</p>
              </div>
            );
          })}
        </div>
      </div>

      <CountdownWidget semester={sem} />
    </Stagger>
  );
}
