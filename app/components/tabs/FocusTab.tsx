// app/components/tabs/FocusTab.tsx
"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

const LOFI_STATIONS = [
  { id: "lofi-hiphop", label: "Lofi Hip-Hop",  emoji: "🎧", tag: "chill",   type: "audio" as const, src: "https://play.streamafrica.net/lofiradio" },
  { id: "lofi-jazz",   label: "Jazz Vibes",     emoji: "🎷", tag: "jazz",    type: "audio" as const, src: "https://jazz.streamr.ru/jazz-64.mp3" },
  { id: "lofi-chill",  label: "Chillhop",       emoji: "🌿", tag: "chill",   type: "audio" as const, src: "https://www.youtube.com/watch?v=_ITiwPMUzho" },
  { id: "lofi-study",  label: "Study Radio",    emoji: "📚", tag: "study",   type: "audio" as const, src: "https://www.youtube.com/watch?v=1Tl2FtV06qo" },
  { id: "lofi-sleep",  label: "Ambient Drift",  emoji: "🌙", tag: "ambient", type: "audio" as const, src: "https://www.youtube.com/watch?v=53gNFOqDFcE" },
  { id: "lofi-piano",  label: "Solo Piano",     emoji: "🎹", tag: "ambient", type: "audio" as const, src: "https://www.youtube.com/watch?v=N0snMcR6aaA" },
  { id: "lofi-pop",    label: "Lofi Pop",       emoji: "🌸", tag: "pop",     type: "audio" as const, src: "https://www.youtube.com/watch?v=eJ_49_P7AnQ" },
  { id: "lofi-rnb",    label: "R&B Soul",       emoji: "🎶", tag: "r&b",     type: "audio" as const, src: "https://www.youtube.com/watch?v=KnXiZgXF4Jc" },
  { id: "custom",      label: "Custom Link",    emoji: "🔗", tag: "custom",  type: "iframe" as const, src: "" },
];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  chill: { bg: "#e0f2fe", text: "#075985" }, jazz:    { bg: "#fef9c3", text: "#78350f" },
  pop:   { bg: "#fce7f3", text: "#831843" }, study:   { bg: "#dcfce7", text: "#14532d" },
  ambient: { bg: "#ede9fe", text: "#4c1d95" }, "r&b": { bg: "#ffedd5", text: "#7c2d12" },
  custom: { bg: "#f1f5f9", text: "#334155" },
};

interface Props {
  timerActive: boolean; setTimerActive: (v: boolean) => void;
  timerSeconds: number; setTimerSeconds: (v: number) => void;
  timerMode: "focus" | "break"; setTimerMode: (v: "focus" | "break") => void;
  timerSessions: number; setTimerSessions: (v: number) => void;
  focusMins: number; setFocusMins: (v: number) => void;
  lofiPlaying: boolean; setLofiPlaying: (v: boolean | ((p: boolean) => boolean)) => void;
  lofiVolume: number; setLofiVolume: (v: number) => void;
  lofiChannel: string; setLofiChannel: (v: string) => void;
  lofiCustomUrl: string; setLofiCustomUrl: (v: string) => void;
  lofiShowCustom: boolean; setLofiShowCustom: (v: boolean) => void;
  lofiAudioOnly: boolean; setLofiAudioOnly: (v: boolean | ((p: boolean) => boolean)) => void;
  lofiAudioRef: React.RefObject<HTMLAudioElement | null>;
  lofiIframeRef: React.RefObject<HTMLIFrameElement | null>;
  daysToMidSem: number; daysToExams: number; daysToEnd: number;
  fmtTime: (s: number) => string;
}

export default function FocusTab(props: Props) {
  const { theme } = props as any;
  const { theme: t } = useTheme();
  const S = {
    card: { background: t.cardBg, borderRadius: 20, border: `1px solid ${t.border}`, overflow: "hidden" } as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase" as const, letterSpacing: 0.8 },
    sectionTitle: { fontSize: 15, fontWeight: 800, color: t.textPrimary, margin: "0 0 14px", fontFamily: t.fontHeading },
  };

  const { timerActive, setTimerActive, timerSeconds, setTimerSeconds, timerMode, setTimerMode, timerSessions, setTimerSessions, focusMins, setFocusMins, lofiPlaying, setLofiPlaying, lofiVolume, setLofiVolume, lofiChannel, setLofiChannel, lofiCustomUrl, setLofiCustomUrl, lofiShowCustom, setLofiShowCustom, lofiAudioOnly, setLofiAudioOnly, lofiAudioRef, lofiIframeRef, daysToMidSem, daysToExams, daysToEnd, fmtTime } = props;

  const activeStation = LOFI_STATIONS.find(s => s.id === lofiChannel) ?? LOFI_STATIONS[0];
  const isCustom = lofiChannel === "custom";

  const customEmbedSrc = (() => {
    const u = lofiCustomUrl.trim();
    if (!u) return "";
    const ytMatch = u.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&controls=1&vq=tiny`;
    return u;
  })();
  const customIsYT = /youtu/.test(lofiCustomUrl);
  const customAudioSrc = (!customIsYT && lofiCustomUrl.trim()) ? lofiCustomUrl.trim() : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ paddingBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: t.textPrimary, margin: "0 0 2px", fontFamily: t.fontHeading }}>Focus Studio</h2>
        <p style={{ fontSize: 13, color: t.textMuted, margin: 0 }}>Timer · Lofi · Deep work</p>
      </div>

      {/* Pomodoro Timer */}
      <div style={{ ...S.card, background: timerActive && timerMode === "focus" ? "#1e1810" : timerActive && timerMode === "break" ? "#052e16" : t.cardBg, transition: "background 0.6s ease" }}>
        <div style={{ padding: "20px 20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {timerActive && (
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
                  style={{ width: 7, height: 7, borderRadius: "50%", background: timerMode === "focus" ? "#f59e0b" : "#22c55e" }} />
              )}
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: timerActive ? (timerMode === "focus" ? "#f59e0b" : "#22c55e") : t.textMuted, fontFamily: t.fontHeading }}>
                {timerMode === "focus" ? "Focus" : "Break"} · Round {timerSessions + 1}
              </span>
            </div>
            <span style={{ fontSize: 11, color: timerActive ? "#6b5438" : t.textMuted, fontWeight: 600 }}>{timerSessions} sessions today</span>
          </div>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 64, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: timerActive ? (timerMode === "focus" ? "#f59e0b" : "#22c55e") : t.textPrimary, letterSpacing: -2 }}>
              {fmtTime(timerSeconds)}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <button onClick={() => { setTimerActive(false); setTimerSeconds(focusMins * 60); setTimerMode("focus"); }}
              style={{ width: 40, height: 40, borderRadius: 20, border: `1px solid ${timerActive ? "#3d3020" : t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: timerActive ? "#6b5438" : t.textMuted, fontWeight: 700 }}>↺</span>
            </button>
            <button onClick={() => setTimerActive(!timerActive)}
              style={{ width: 64, height: 64, borderRadius: 32, border: "none", cursor: "pointer", background: timerActive ? "#f59e0b" : "#2d2416", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: timerActive ? "0 0 20px rgba(245,158,11,0.4)" : "0 4px 20px rgba(45,36,22,0.3)", transition: "all 0.2s" }}>
              <span style={{ fontSize: 22, color: "#fff" }}>{timerActive ? "⏸" : "▶"}</span>
            </button>
            <button onClick={() => { setTimerMode((prev: "focus" | "break") => prev === "focus" ? "break" : "focus"); setTimerSeconds(timerMode === "focus" ? Math.round(focusMins / 5) * 60 : focusMins * 60); }}
              style={{ width: 40, height: 40, borderRadius: 20, border: `1px solid ${timerActive ? "#3d3020" : t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: timerActive ? "#6b5438" : t.textMuted, fontWeight: 700 }}>⏭</span>
            </button>
          </div>

          <div style={{ padding: "14px 0 0", borderTop: `1px solid ${timerActive ? "#2a2010" : t.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: timerActive ? "#6b5438" : t.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>Focus duration</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: timerActive ? "#f0ebe3" : "#2d2416" }}>
                {focusMins >= 60 ? `${Math.floor(focusMins / 60)}h${focusMins % 60 > 0 ? ` ${focusMins % 60}m` : ""}` : `${focusMins}m`}
              </span>
            </div>
            <input type="range" min={20} max={120} step={5} value={focusMins}
              onChange={(e) => { const v = parseInt(e.target.value); setFocusMins(v); if (!timerActive) setTimerSeconds(v * 60); }}
              style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer", height: 5, borderRadius: 3 }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["20m", "40m", "1h", "1h 20m", "1h 40m", "2h"].map((l) => (
                <span key={l} style={{ fontSize: 9, color: timerActive ? "#4a3a28" : t.textMuted }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lofi Mode */}
      <div style={S.card}>
        <div style={{ padding: "16px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ ...S.sectionTitle, margin: "0 0 2px" }}>Lofi Mode</h3>
            <p style={{ fontSize: 12, color: t.textMuted, margin: 0 }}>{lofiPlaying ? `▶ ${activeStation.label}` : "Pick a station and press play"}</p>
          </div>
          <button onClick={() => setLofiPlaying((p: boolean) => !p)}
            style={{ padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: lofiPlaying ? "#fef2f2" : "#2d2416", color: lofiPlaying ? "#ef4444" : "#f0ebe3", boxShadow: lofiPlaying ? "none" : "0 2px 12px rgba(45,36,22,0.25)", transition: "all 0.2s" }}>
            {lofiPlaying ? "⏹ Stop" : "▶ Play"}
          </button>
        </div>

        <div style={{ padding: "0 18px 12px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => setLofiAudioOnly((v: boolean) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, border: `1px solid ${lofiAudioOnly ? "#2d2416" : t.border}`, background: lofiAudioOnly ? "#2d2416" : t.cardBg, cursor: "pointer", transition: "all 0.15s" }}>
            <span style={{ fontSize: 13 }}>{lofiAudioOnly ? "🎵" : "🎬"}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: lofiAudioOnly ? "#f0ebe3" : "#8b7355" }}>{lofiAudioOnly ? "Audio only" : "Show video"}</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12 }}>🔈</span>
            <input type="range" min={0} max={1} step={0.05} value={lofiVolume}
              onChange={e => { const v = parseFloat(e.target.value); setLofiVolume(v); if (lofiAudioRef.current) lofiAudioRef.current.volume = v; }}
              style={{ width: 70, accentColor: "#2d2416", cursor: "pointer", height: 4 }} />
            <span style={{ fontSize: 12 }}>🔊</span>
          </div>
        </div>

        <div style={{ padding: "0 14px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {LOFI_STATIONS.filter(s => s.id !== "custom").map(station => {
            const active = lofiChannel === station.id;
            const tagStyle = TAG_COLORS[station.tag] ?? TAG_COLORS.custom;
            return (
              <button key={station.id} onClick={() => { setLofiChannel(station.id); setLofiShowCustom(false); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, cursor: "pointer", textAlign: "left", border: active ? "2px solid #2d2416" : `1.5px solid ${t.border}`, background: active ? "#faf6f0" : t.cardBg, boxShadow: active ? "0 2px 12px rgba(45,36,22,0.1)" : "none", transition: "all 0.15s" }}>
                <span style={{ fontSize: 22, lineHeight: 1 }}>{station.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{station.label}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 6, ...tagStyle }}>{station.tag}</span>
                </div>
                {active && lofiPlaying && (
                  <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 16, flexShrink: 0 }}>
                    {[1, 2, 3].map((i) => (
                      <motion.div key={i} animate={{ height: ["40%", "100%", "40%"] }} transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15, ease: "easeInOut" }}
                        style={{ width: 3, background: "#2d2416", borderRadius: 2 }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ padding: "0 14px 14px" }}>
          <button onClick={() => { setLofiChannel("custom"); setLofiShowCustom(true); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 14, cursor: "pointer", textAlign: "left", border: lofiChannel === "custom" ? "2px solid #2d2416" : "1.5px dashed #d4c7b4", background: lofiChannel === "custom" ? "#faf6f0" : "transparent", transition: "all 0.15s" }}>
            <span style={{ fontSize: 20 }}>🔗</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary, margin: 0 }}>Custom Link</p>
              <p style={{ fontSize: 11, color: t.textMuted, margin: 0 }}>YouTube, podcast, or any stream URL</p>
            </div>
          </button>
          {(lofiChannel === "custom" || lofiShowCustom) && (
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <input type="text" placeholder="Paste YouTube or stream URL…" value={lofiCustomUrl}
                onChange={e => setLofiCustomUrl(e.target.value)}
                style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: `1px solid ${t.border}`, fontSize: 12, outline: "none", color: t.textPrimary, background: t.cardBg }} />
              <button onClick={() => { setLofiChannel("custom"); if (lofiCustomUrl.trim()) setLofiPlaying(true); }}
                style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "#2d2416", color: "#f0ebe3", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Load
              </button>
            </div>
          )}
        </div>

        {lofiPlaying && !isCustom && (
          <div style={{ padding: "0 14px 16px" }}>
            <audio key={activeStation.src} ref={lofiAudioRef as any} src={activeStation.src} autoPlay controls
              style={{ width: "100%", height: 40, borderRadius: 10, accentColor: "#2d2416" }}
              onVolumeChange={e => setLofiVolume((e.target as HTMLAudioElement).volume)} />
          </div>
        )}
        {lofiPlaying && isCustom && customAudioSrc && (
          <div style={{ padding: "0 14px 16px" }}>
            <audio key={customAudioSrc} ref={lofiAudioRef as any} src={customAudioSrc} autoPlay controls style={{ width: "100%", height: 40, borderRadius: 10 }} />
          </div>
        )}
        {lofiPlaying && isCustom && customIsYT && customEmbedSrc && (
          <div style={{ padding: "0 14px 16px" }}>
            <div style={{ borderRadius: 14, overflow: "hidden", height: lofiAudioOnly ? 0 : "auto", transition: "height 0.3s" }}>
              <iframe ref={lofiIframeRef as any} key={customEmbedSrc} src={customEmbedSrc} width="100%" height={lofiAudioOnly ? "1" : "180"}
                frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen
                style={{ display: "block", background: "#000", visibility: lofiAudioOnly ? "hidden" : "visible" }} title="Custom Stream" />
            </div>
          </div>
        )}
      </div>

      {/* Milestone countdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Mid-sems", sub: "6–10 Jul", days: daysToMidSem },
          { label: "Exams",    sub: "Aug 17",   days: daysToExams },
          { label: "End of sem", sub: "Sep 4",  days: daysToEnd },
        ].map((m) => (
          <div key={m.label} style={{ ...S.card, padding: "16px 10px", textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#2d2416", margin: "0 0 2px", lineHeight: 1 }}>{m.days <= 0 ? "✓" : m.days}</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 3px" }}>{m.label}</p>
            <p style={{ fontSize: 10, color: t.textMuted, margin: 0 }}>{m.days <= 0 ? "Done" : m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
