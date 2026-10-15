"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SOUND_DEFAULT_ON, SOUND_STORAGE_KEY, soundEngine } from "../lib/sound";
import { useStoredString } from "./hooks";

interface SoundCtx { muted: boolean; setMuted: (m: boolean) => void; toggle: () => void }
const Ctx = createContext<SoundCtx | null>(null);
export const useSound = () => { const c = useContext(Ctx); if (!c) throw new Error("useSound must be used inside <SoundProvider>"); return c; };

const TEXT_INPUT = new Set(["text", "search", "email", "url", "tel", "password", "number", "date", "time", ""]);
const isTextField = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable || el.tagName === "TEXTAREA") return true;
  return el.tagName === "INPUT" && TEXT_INPUT.has((el as HTMLInputElement).type);
};
const CLICKABLE = 'button, a[href], [role="button"], [role="radio"], [role="tab"], summary, label[for], input[type="checkbox"]';

/**
 * Global UI sound: one pair of delegated listeners on <html>, so every button, link and text field in the
 * app (including future ones) gets feedback with no per-component code. Mute state is saved to localStorage.
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useStoredString(SOUND_STORAGE_KEY, "");
  const muted = raw === "off" || (raw === "" && !SOUND_DEFAULT_ON);
  const mutedRef = useRef(muted);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (mutedRef.current || !(e.target instanceof Element)) return;
      const el = e.target.closest(CLICKABLE);
      if (!el || el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true" || el.closest("[data-no-sound]")) return;
      soundEngine.play("click");
    };
    const onKey = (e: KeyboardEvent) => {
      if (mutedRef.current || e.ctrlKey || e.metaKey || e.altKey || !isTextField(e.target)) return;
      if (e.key === "Backspace" || e.key === "Delete") soundEngine.play("back");
      else if (e.key === "Enter") soundEngine.play("enter");
      else if (e.key.length === 1) soundEngine.play("key");
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    return () => { document.removeEventListener("click", onClick, true); document.removeEventListener("keydown", onKey, true); };
  }, []);

  const setMuted = useCallback((m: boolean) => {
    if (m) soundEngine.play("off");           // confirm "off" before going silent
    setRaw(m ? "off" : "on");
    if (!m) soundEngine.play("on");           // and confirm "on" once it is audible
  }, [setRaw]);
  const toggle = useCallback(() => setMuted(!mutedRef.current), [setMuted]);

  return <Ctx.Provider value={{ muted, setMuted, toggle }}>{children}</Ctx.Provider>;
}

/** Navbar button: mute / unmute all interface sounds. */
export function SoundToggle() {
  const { muted, toggle } = useSound();
  return (
    <button className="icon-btn" data-no-sound onClick={toggle} aria-pressed={!muted}
      aria-label={muted ? "Turn interface sounds on" : "Turn interface sounds off"} title={muted ? "Sounds off. Click to turn on" : "Sounds on. Click to mute"}>
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}
