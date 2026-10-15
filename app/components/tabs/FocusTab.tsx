"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward, Volume2 } from "lucide-react";
import type { YearConfig } from "../../lib/types";
import { PageHeader } from "../ui";
import { Stagger } from "../../lib/motion";
import { motion } from "framer-motion";
import { usePersistentState } from "../hooks";
import { STATIONS, TAG_COLORS } from "../../lib/lofi";

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export function FocusTab({ now }: { year: YearConfig; now: Date | null }) {
  /* ───── pomodoro ───── */
  const [focusMins, setFocusMins] = useState(25);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const [sessions, setSessions] = usePersistentState<number>(`portal:focus:${dayKey(now ?? new Date())}`, 0);

  const live_ = useRef({ mode, focusMins, remaining });
  useEffect(() => { live_.current = { mode, focusMins, remaining }; });

  useEffect(() => {
    if (!active) return;
    const breakLen = (m: number) => Math.max(1, Math.round(m / 5)) * 60;
    const t = setInterval(() => {
      const { mode: md, focusMins: fm, remaining: r } = live_.current;
      if (r > 1) { setRemaining(r - 1); return; }
      if (md === "focus") { setSessions((n) => n + 1); setMode("break"); setRemaining(breakLen(fm)); }
      else { setMode("focus"); setRemaining(fm * 60); }
    }, 1000);
    return () => clearInterval(t);
  }, [active, setSessions]);

  const reset = () => { setActive(false); setMode("focus"); setRemaining(focusMins * 60); };
  const skip = () => { const next = mode === "focus" ? "break" : "focus"; setMode(next); setRemaining(next === "focus" ? focusMins * 60 : Math.max(1, Math.round(focusMins / 5)) * 60); };

  /* ───── lofi ───── */
  const [playing, setPlaying] = useState(false);
  const [stationId, setStationId] = useState(STATIONS[0].id);
  const [volume, setVolume] = useState(0.6);
  const [custom, setCustom] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const station = STATIONS.find((s) => s.id === stationId) ?? STATIONS[0];
  const isCustom = stationId === "custom";
  const ytId = custom.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1];
  const audioSrc = isCustom ? (!ytId && custom.trim() ? custom.trim() : "") : station.src;

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume, audioSrc, playing]);

  const focusing = mode === "focus";
  const live = active;

  return (
    <Stagger className="stack gap-5">
      <PageHeader title="Focus studio" sub="Pomodoro timer and background music for deep work" />

      {/* timer */}
      <div className={live ? "card-hero" : "card"} style={{ padding: 24, transition: "background .3s" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <span className="eyebrow" style={{ color: live ? (focusing ? "var(--hot)" : "var(--hot-2)") : undefined }}>
            {focusing ? "Focus" : "Break"} · round {sessions + 1}
          </span>
          <span className="eyebrow" style={{ color: live ? "var(--hero-muted)" : undefined }}>{sessions} done today</span>
        </div>
        <motion.p animate={active ? { scale: [1, 1.03, 1] } : { scale: 1 }} transition={active ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }} className="font-mono-x text-center" style={{ fontSize: "clamp(56px, 14vw, 84px)", fontWeight: 700, margin: "6px 0 20px", letterSpacing: 2, color: live ? "var(--hero-fg)" : "var(--ink)" }}
          aria-live="off">{fmt(Math.max(0, remaining))}</motion.p>
        <div className="flex items-center justify-center gap-4" style={{ marginBottom: 22 }}>
          <button className="icon-btn" style={{ width: 44, height: 44, borderRadius: 22 }} onClick={reset} aria-label="Reset"><RotateCcw size={16} /></button>
          <span style={{ position: "relative", display: "inline-flex" }}>
            {active && <motion.span aria-hidden initial={{ scale: 1, opacity: 0.55 }} animate={{ scale: 1.7, opacity: 0 }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} style={{ position: "absolute", inset: 0, borderRadius: 40, border: "3px solid var(--hot)" }} />}
          <button className="fab-go" onClick={() => setActive((a) => !a)} aria-label={active ? "Pause" : "Start"}
            style={{ width: 64, height: 64, borderRadius: 32, border: "none", background: live ? "var(--hot)" : "var(--accent)", color: live ? "var(--hot-fg)" : "var(--accent-fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {active ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          </span>
          <button className="icon-btn" style={{ width: 44, height: 44, borderRadius: 22 }} onClick={skip} aria-label="Skip"><SkipForward size={16} /></button>
        </div>
        <div style={{ paddingTop: 14, borderTop: `var(--border-w) solid ${live ? "color-mix(in srgb, var(--hero-fg) 18%, transparent)" : "var(--line)"}` }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <label htmlFor="focusLen" className="eyebrow" style={{ color: live ? "var(--hero-muted)" : undefined }}>Focus length</label>
            <span style={{ fontSize: 12, fontWeight: 800, color: live ? "var(--hero-fg)" : "var(--ink)" }}>
              {focusMins >= 60 ? `${Math.floor(focusMins / 60)}h${focusMins % 60 ? ` ${focusMins % 60}m` : ""}` : `${focusMins}m`}
            </span>
          </div>
          <input id="focusLen" type="range" min={20} max={120} step={5} value={focusMins} style={{ width: "100%", accentColor: "var(--slider)" }}
            onChange={(e) => { const v = Number(e.target.value); setFocusMins(v); if (!active && focusing) setRemaining(v * 60); }} />
        </div>
      </div>

      {/* lofi */}
      <div className="card" style={{ padding: 18 }}>
        <div className="flex items-center justify-between gap-3 flex-wrap" style={{ marginBottom: 14 }}>
          <div>
            <h3 className="h-title" style={{ fontSize: 16, margin: 0 }}>Lofi mode</h3>
            <p className="text-muted-x" style={{ fontSize: 12, margin: "2px 0 0" }}>{playing ? `Now playing · ${isCustom ? "Custom link" : station.label}` : "Pick a station and press play"}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2"><Volume2 size={14} style={{ color: "var(--muted)" }} />
              <input type="range" min={0} max={1} step={0.05} value={volume} aria-label="Volume" onChange={(e) => setVolume(Number(e.target.value))} style={{ width: 80, accentColor: "var(--accent)" }} /></span>
            <button className={`btn ${playing ? "" : "btn-primary"}`} onClick={() => setPlaying((p) => !p)}>{playing ? "Stop" : "Play"}</button>
          </div>
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
          {STATIONS.filter((s) => s.id !== "custom").map((s) => {
            const on = stationId === s.id;
            const tag = TAG_COLORS[s.tag] ?? TAG_COLORS.custom;
            return (
              <button key={s.id} onClick={() => setStationId(s.id)} aria-pressed={on} className="card flex items-center gap-3 text-left"
                style={{ padding: "10px 12px", borderColor: on ? "var(--accent)" : undefined, boxShadow: on ? "0 0 0 1px var(--accent)" : undefined }}>
                <span style={{ fontSize: 22 }}>{s.emoji}</span>
                <span style={{ minWidth: 0 }}>
                  <span className="block" style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 6, background: `var(--tag-bg, ${tag.bg})`, color: `var(--tag-fg, ${tag.fg})` }}>{s.tag}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 10 }}>
          <button className="card flex items-center gap-3 text-left" aria-pressed={isCustom} onClick={() => setStationId("custom")}
            style={{ width: "100%", padding: "10px 14px", borderStyle: isCustom ? "solid" : "dashed", borderColor: isCustom ? "var(--accent)" : undefined }}>
            <span style={{ fontSize: 20 }}>🔗</span>
            <span><span className="block" style={{ fontSize: 12, fontWeight: 700 }}>Custom link</span>
              <span className="text-muted-x block" style={{ fontSize: 11 }}>YouTube or a direct audio stream URL</span></span>
          </button>
          {isCustom && (
            <input className="input" style={{ marginTop: 8 }} placeholder="Paste a YouTube or stream URL…" value={custom} onChange={(e) => setCustom(e.target.value)} />
          )}
        </div>

        {playing && audioSrc && (
          <audio key={audioSrc} ref={audioRef} src={audioSrc} autoPlay controls style={{ width: "100%", marginTop: 14 }} />
        )}
        {playing && isCustom && ytId && (
          <iframe key={ytId} title="YouTube player" width="100%" height="180" style={{ marginTop: 14, borderRadius: 12, border: 0 }}
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} allow="autoplay; encrypted-media" />
        )}
        {playing && isCustom && !audioSrc && !ytId && (
          <p className="chip chip-warn" style={{ marginTop: 14 }}>Paste a link above to start streaming</p>
        )}
        <p className="text-muted-x" style={{ fontSize: 11, margin: "12px 0 0" }}>Streams come from third-party radio stations and may occasionally be offline.</p>
      </div>
    </Stagger>
  );
}