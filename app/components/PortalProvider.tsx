"use client";

import { MotionConfig } from "framer-motion";
import React, { createContext, useCallback, useContext, useEffect } from "react";
import type { ModeId, StyleId } from "../lib/types";
import { ACCENTS, DEFAULT_STYLE, isStyleReady } from "../lib/styles";
import { useHydrated, useStoredString } from "./hooks";

interface PortalCtx {
  ready: boolean;
  style: StyleId; setStyle: (s: StyleId) => void;
  mode: ModeId;   setMode: (m: ModeId) => void;
  accent: string; setAccent: (a: string) => void;
  name: string;   setName: (n: string) => void;
  lastYear: number | null; rememberYear: (y: number) => void;
}

const Ctx = createContext<PortalCtx | null>(null);
export const usePortal = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePortal must be used inside <PortalProvider>");
  return c;
};

const brightness = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const ready = useHydrated();
  const [rawStyle, setRawStyle] = useStoredString("portal:style", DEFAULT_STYLE);
  const [rawMode, setRawMode] = useStoredString("portal:mode", "light");
  const [rawAccent, setRawAccent] = useStoredString("portal:accent", ACCENTS[0].value);
  const [name, setName] = useStoredString("portal:name", "");
  const [rawYear, setRawYear] = useStoredString("portal:lastYear", "");

  // Validate whatever is in storage
  const style: StyleId = isStyleReady(rawStyle) ? rawStyle : DEFAULT_STYLE;
  const mode: ModeId = rawMode === "dark" ? "dark" : "light";
  const accent = /^#[0-9a-fA-F]{6}$/.test(rawAccent) ? rawAccent : ACCENTS[0].value;
  const yearNum = Number(rawYear);
  const lastYear = yearNum >= 1 && yearNum <= 4 ? yearNum : null;

  // Mirror the choices onto <html> so the CSS variables switch
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.style = style;
    el.dataset.mode = mode;
    el.style.setProperty("--accent-user", accent);
    el.style.setProperty("--accent-user-fg", brightness(accent) > 140 ? "#111111" : "#ffffff");
  }, [style, mode, accent]);

  const setStyle = useCallback((s: StyleId) => { if (isStyleReady(s)) setRawStyle(s); }, [setRawStyle]);
  const setMode = useCallback((m: ModeId) => setRawMode(m), [setRawMode]);
  const setAccent = useCallback((a: string) => setRawAccent(a), [setRawAccent]);
  const rememberYear = useCallback((y: number) => setRawYear(String(y)), [setRawYear]);

  return (
    <Ctx.Provider value={{ ready, style, setStyle, mode, setMode, accent, setAccent, name, setName, lastYear, rememberYear }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Ctx.Provider>
  );
}
