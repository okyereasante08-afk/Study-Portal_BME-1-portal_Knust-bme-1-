// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ThemeContext, THEMES, buildCustomTheme } from "@/lib/theme";
import type { ThemeKey } from "@/lib/theme";
import AppShell from "@/app/components/AppShell";

export default function Home() {
  const [themeKey, setThemeKeyState] = useState<ThemeKey>("light");
  const [customAccent, setCustomAccentState] = useState("#2d2416");

  useEffect(() => {
    const saved = localStorage.getItem("bme-theme");
    const savedAccent = localStorage.getItem("bme-custom-accent");
    if (saved && THEMES[saved as ThemeKey]) setThemeKeyState(saved as ThemeKey);
    if (savedAccent) setCustomAccentState(savedAccent);
  }, []);

  const setThemeKey = (k: ThemeKey) => {
    setThemeKeyState(k);
    localStorage.setItem("bme-theme", k);
  };

  const setCustomAccent = (c: string) => {
    setCustomAccentState(c);
    localStorage.setItem("bme-custom-accent", c);
  };

  const theme = themeKey === "custom" ? buildCustomTheme(customAccent) : THEMES[themeKey];

  return (
    <ThemeContext.Provider value={{ theme, themeKey, setThemeKey, customAccent, setCustomAccent }}>
      <AppShell />
    </ThemeContext.Provider>
  );
}
