// app/lib/sound.ts
// ---------------------------------------------------------------------------
// Tiny synthesised UI sounds (Web Audio API). No audio files, no downloads.
//   • one shared AudioContext, created on the first user gesture (browser autoplay rules)
//   • each sound is 1-3 short oscillator/noise nodes that free themselves (~30-90ms)
//   • tone changes with the active interface style (data-style on <html>)
//   • throttled, so fast typing can never pile up nodes or lag
// ---------------------------------------------------------------------------

export type SoundKind = "click" | "key" | "back" | "enter" | "on" | "off";

/** Flip to false to ship with sound OFF until a student turns it on. */
export const SOUND_DEFAULT_ON = true;
export const SOUND_STORAGE_KEY = "portal:sound";   // "off" = muted; anything else = on
const MASTER = 0.55;
const MIN_GAP: Record<SoundKind, number> = { click: 45, key: 22, back: 22, enter: 60, on: 0, off: 0 };

type Style = "classic" | "brutalist" | "clay";
interface Ctx { ctx: AudioContext; out: GainNode; noise: AudioBuffer }

class SoundEngine {
  private c: Ctx | null = null;
  private last: Partial<Record<SoundKind, number>> = {};

  /** create / resume the context. Must be called from a user-gesture handler the first time. */
  private ensure(): Ctx | null {
    if (typeof window === "undefined") return null;
    if (!this.c) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC({ latencyHint: "interactive" });
      const out = ctx.createGain(); out.gain.value = MASTER;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 6;
      out.connect(comp); comp.connect(ctx.destination);
      const len = Math.floor(ctx.sampleRate * 0.06); const noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = noise.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.c = { ctx, out, noise };
    }
    if (this.c.ctx.state === "suspended") void this.c.ctx.resume();
    return this.c;
  }

  play(kind: SoundKind) {
    const now = typeof performance !== "undefined" ? performance.now() : 0;
    if (now - (this.last[kind] ?? -1e9) < MIN_GAP[kind]) return;
    this.last[kind] = now;
    const c = this.ensure(); if (!c) return;
    const style = (document.documentElement.dataset.style as Style) || "classic";
    const t = c.ctx.currentTime;
    const jitter = 0.94 + Math.random() * 0.12;       // ±6% pitch so repeated keys don't sound robotic
    VOICES[style][kind](c, t, jitter);
  }
}

/* ───────── building blocks ───────── */
function tone(c: Ctx, t: number, type: OscillatorType, f0: number, f1: number, dur: number, gain: number) {
  const o = c.ctx.createOscillator(), g = c.ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.out); o.start(t); o.stop(t + dur + 0.02);
}
function tick(c: Ctx, t: number, hp: number, dur: number, gain: number) {
  const s = c.ctx.createBufferSource(), f = c.ctx.createBiquadFilter(), g = c.ctx.createGain();
  s.buffer = c.noise; f.type = "highpass"; f.frequency.value = hp;
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(c.out); s.start(t); s.stop(t + dur + 0.01);
}
function thunk(c: Ctx, t: number, lp: number, dur: number, gain: number) {
  const s = c.ctx.createBufferSource(), f = c.ctx.createBiquadFilter(), g = c.ctx.createGain();
  s.buffer = c.noise; f.type = "lowpass"; f.frequency.value = lp;
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(c.out); s.start(t); s.stop(t + dur + 0.01);
}

type Voice = (c: Ctx, t: number, j: number) => void;
const VOICES: Record<Style, Record<SoundKind, Voice>> = {
  // Classic: soft wooden ticks
  classic: {
    key:   (c, t, j) => { tone(c, t, "sine", 1900 * j, 1500 * j, 0.032, 0.05); tick(c, t, 3500, 0.012, 0.03); },
    back:  (c, t, j) => { tone(c, t, "sine", 1250 * j, 900 * j, 0.04, 0.05); tick(c, t, 2500, 0.012, 0.025); },
    enter: (c, t) => { tone(c, t, "sine", 520, 470, 0.09, 0.07); tone(c, t + 0.05, "sine", 780, 700, 0.1, 0.06); },
    click: (c, t, j) => { tone(c, t, "sine", 660 * j, 430 * j, 0.07, 0.09); tick(c, t, 4000, 0.008, 0.03); },
    on:    (c, t) => { tone(c, t, "sine", 523, 523, 0.1, 0.08); tone(c, t + 0.07, "sine", 784, 784, 0.14, 0.08); },
    off:   (c, t) => { tone(c, t, "sine", 659, 659, 0.08, 0.07); tone(c, t + 0.06, "sine", 440, 440, 0.12, 0.07); },
  },
  // Neo-Brutalist: hard, clicky, square-wave
  brutalist: {
    key:   (c, t, j) => { tone(c, t, "square", 1500 * j, 1100 * j, 0.016, 0.022); tick(c, t, 2500, 0.01, 0.04); },
    back:  (c, t, j) => { tone(c, t, "square", 900 * j, 600 * j, 0.022, 0.022); thunk(c, t, 1400, 0.02, 0.05); },
    enter: (c, t) => { tone(c, t, "square", 330, 220, 0.06, 0.035); thunk(c, t, 900, 0.07, 0.09); },
    click: (c, t, j) => { tone(c, t, "square", 280 * j, 140 * j, 0.045, 0.05); thunk(c, t, 1100, 0.04, 0.09); },
    on:    (c, t) => { tone(c, t, "square", 440, 440, 0.07, 0.04); tone(c, t + 0.07, "square", 660, 660, 0.1, 0.04); },
    off:   (c, t) => { tone(c, t, "square", 440, 440, 0.07, 0.04); tone(c, t + 0.07, "square", 220, 220, 0.1, 0.04); },
  },
  // Claymorphic: round, bubbly pops
  clay: {
    key:   (c, t, j) => { tone(c, t, "sine", 720 * j, 1050 * j, 0.05, 0.06); },
    back:  (c, t, j) => { tone(c, t, "sine", 620 * j, 380 * j, 0.06, 0.06); },
    enter: (c, t) => { tone(c, t, "sine", 440, 760, 0.1, 0.07); tone(c, t + 0.06, "sine", 660, 1000, 0.12, 0.06); },
    click: (c, t, j) => { tone(c, t, "sine", 470 * j, 940 * j, 0.1, 0.09); tone(c, t, "sine", 940 * j, 1880 * j, 0.06, 0.025); },
    on:    (c, t) => { tone(c, t, "sine", 523, 784, 0.12, 0.08); tone(c, t + 0.08, "sine", 784, 1175, 0.16, 0.07); },
    off:   (c, t) => { tone(c, t, "sine", 784, 523, 0.12, 0.08); tone(c, t + 0.08, "sine", 523, 330, 0.16, 0.07); },
  },
};

export const soundEngine = new SoundEngine();
