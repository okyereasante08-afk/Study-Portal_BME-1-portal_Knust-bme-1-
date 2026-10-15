// Radio / lofi stations for Focus Studio

export interface Station { id: string; label: string; emoji: string; tag: string; type: "audio" | "iframe"; src: string }

export const STATIONS: Station[] = [
  { id: "lofi-hiphop",  label: "Lofi Hip-Hop",    emoji: "🎧", tag: "chill",   type: "audio", src: "https://play.streamafrica.net/lofiradio" },
  { id: "lofi-jazz",    label: "Jazz Vibes",       emoji: "🎷", tag: "jazz",    type: "audio", src: "https://jazz.streamr.ru/jazz-64.mp3" },
  { id: "lofi-chill",   label: "Chillhop",         emoji: "🌿", tag: "chill",   type: "audio", src: "https://streams.radiomast.io/ref:ea3b7e44-c477-4a6a-bc41-d8986ef01590" },
  { id: "lofi-study",   label: "Study Radio",      emoji: "📚", tag: "study",   type: "audio", src: "https://streams.radiomast.io/ref:c80aeec4-c1cb-4a6b-8b8a-6fe040e0d476" },
  { id: "lofi-sleep",   label: "Ambient Drift",    emoji: "🌙", tag: "ambient", type: "audio", src: "https://ambientradio.co.uk:8443/ambient.mp3" },
  { id: "lofi-piano",   label: "Solo Piano",       emoji: "🎹", tag: "ambient", type: "audio", src: "https://piano.streamr.ru/piano-64.mp3" },
  { id: "lofi-pop",     label: "Lofi Pop",         emoji: "🌸", tag: "pop",     type: "audio", src: "https://lofi.stream.laut.fm/lofi" },
  { id: "lofi-rnb",     label: "R&B Soul",         emoji: "🎶", tag: "r&b",     type: "audio", src: "https://rnbradio.stream.laut.fm/rnbradio" },
  { id: "custom",       label: "Custom Link",      emoji: "🔗", tag: "custom",  type: "iframe", src: "" },
];

export const TAG_COLORS: Record<string, { bg: string; fg: string }> = {
  chill:   { bg: "#e0f2fe", fg: "#075985" },
  jazz:    { bg: "#fef9c3", fg: "#78350f" },
  pop:     { bg: "#fce7f3", fg: "#831843" },
  study:   { bg: "#dcfce7", fg: "#14532d" },
  ambient: { bg: "#ede9fe", fg: "#4c1d95" },
  "r&b":   { bg: "#ffedd5", fg: "#7c2d12" },
  custom:  { bg: "#f1f5f9", fg: "#334155" },
};
