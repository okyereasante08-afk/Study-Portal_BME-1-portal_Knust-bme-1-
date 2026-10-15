"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import type { YearConfig } from "../../lib/types";
import type { Attendance } from "../useAttendance";
import { PageHeader } from "../ui";
import { Stagger } from "../../lib/motion";
import PhotoUpload from "../PhotoUpload";
import { usePortal } from "../PortalProvider";
import { useSound } from "../SoundProvider";
import { StylePicker } from "../StyleSwitcher";
import { ACCENTS } from "../../lib/styles";
import { YEARS, YEAR_LEVELS } from "../../lib/years";

export function ProfileTab({ year, att, onTour, tourAlways, setTourAlways }: {
  year: YearConfig; att: Attendance; onTour: () => void; tourAlways: boolean; setTourAlways: (v: boolean) => void;
}) {
  const { name, setName, mode, setMode, accent, setAccent, style } = usePortal();
  const { muted, setMuted } = useSound();

  return (
    <Stagger className="stack gap-5">
      <PageHeader title="Profile" sub="Stored only on this device" />

      <div className="card" style={{ padding: 22 }}>
        <div className="flex items-center gap-5 flex-wrap">
          <PhotoUpload storageKey="portal-avatar" fallbackName={name || "BME"} size={84} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <label htmlFor="name" className="eyebrow block" style={{ marginBottom: 6 }}>Your name</label>
            <input id="name" className="input" placeholder="e.g. Ama Mensah" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
            <p className="text-muted-x" style={{ fontSize: 11, margin: "6px 0 0" }}>Used for your greeting. Adding a photo is optional.</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Your year</p>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {YEAR_LEVELS.map((l) => (
            <Link key={l} href={`/year/${l}`} className="card-soft text-center"
              style={{ padding: "12px 4px", fontWeight: 800, fontFamily: "var(--font-head)", background: l === year.level ? "var(--accent)" : undefined, color: l === year.level ? "var(--accent-fg)" : "var(--ink)" }}>
              <span style={{ fontSize: 20 }}>{l}</span>
              <span className="block" style={{ fontSize: 10, fontWeight: 700 }}>{YEARS[l].levelCode}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Appearance</p>
        <div className="flex items-center justify-between gap-3 flex-wrap" style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Mode</span>
          <div className="segmented">
            {(["light", "dark"] as const).map((m) => <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)} style={{ textTransform: "capitalize" }}>{m}</button>)}
          </div>
        </div>
        <label className="flex items-center justify-between gap-3" style={{ marginBottom: 18, cursor: "pointer" }}>
          <span><span style={{ fontSize: 13, fontWeight: 700, display: "block" }}>Interface sounds</span>
            <span className="text-muted-x" style={{ fontSize: 11 }}>Soft clicks and typing ticks. Also in the top bar.</span></span>
          <input type="checkbox" checked={!muted} onChange={(e) => setMuted(!e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--accent)" }} />
        </label>
        {style === "classic" && <div style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Accent colour</span>
          <span className="text-muted-x" style={{ fontSize: 11, marginLeft: 8 }}>{mode === "dark" ? "applies in light mode" : ""}</span>
          <div className="flex gap-2 flex-wrap" style={{ marginTop: 10 }}>
            {ACCENTS.map((a) => (
              <button key={a.value} aria-label={a.name} title={a.name} onClick={() => setAccent(a.value)}
                style={{ width: 32, height: 32, borderRadius: 10, background: a.value, border: accent === a.value ? "3px solid var(--card)" : "1px solid var(--line)", outline: accent === a.value ? `2px solid ${a.value}` : "none" }} />
            ))}
          </div>
        </div>}
        <span style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 10 }}>Style</span>
        <StylePicker compact />
      </div>

      <div className="card" style={{ padding: 22 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Guided tour</p>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Take the tour again</p>
            <p className="text-muted-x" style={{ fontSize: 12, margin: "2px 0 0" }}>A 60-second walk through every part of the portal.</p>
          </div>
          <button className="btn" onClick={onTour}>Start tour</button>
        </div>
        <label className="flex items-center gap-3" style={{ marginTop: 16, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <input type="checkbox" checked={tourAlways} onChange={(e) => setTourAlways(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--accent)" }} />
          Show the tour every time I open the portal
        </label>
      </div>

      <div className="card flex items-center justify-between gap-3 flex-wrap" style={{ padding: 18 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Reset {year.title} attendance</p>
          <p className="text-muted-x" style={{ fontSize: 12, margin: "2px 0 0" }}>Clears every class you&apos;ve marked this semester. This can&apos;t be undone.</p>
        </div>
        <button className="btn" onClick={() => { if (window.confirm(`Clear all ${year.title} attendance marks?`)) att.reset(); }}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </Stagger>
  );
}