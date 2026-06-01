// app/context/ThemeContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ThemeKey, ThemeTokens, THEMES, buildCustomTheme } from "@/app/lib/theme";

interface ThemeContextType {
  theme: ThemeTokens;
  themeKey: ThemeKey;
  setThemeKey: (k: ThemeKey) => void;
  customAccent: string;
  setCustomAccent: (c: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES.light,
  themeKey: "light",
  setThemeKey: () => {},
  customAccent: "#2d2416",
  setCustomAccent: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
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
      {children}
    </ThemeContext.Provider>
  );
}