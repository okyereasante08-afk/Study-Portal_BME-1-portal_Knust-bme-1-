// app/lib/theme.ts

export type ThemeKey = "light" | "dark" | "mono" | "custom";

export interface ThemeTokens {
  pageBg: string; sidebarBg: string; cardBg: string; inputBg: string;
  pillActiveBg: string; pillInactiveBg: string; headerBg: string; userCardBg: string;
  border: string; borderStrong: string;
  textPrimary: string; textSecondary: string; textMuted: string; textInverse: string;
  accent: string; accentText: string;
  navActiveBg: string; navActiveText: string; navInactiveText: string;
  fontBody: string; fontHeading: string;
}

export const THEMES: Record<ThemeKey, ThemeTokens> = {
  light: {
    pageBg:"rgb(255,251,240)", sidebarBg:"rgb(255,255,250)", cardBg:"#ffffff", inputBg:"#ffffff",
    pillActiveBg:"#2d2416", pillInactiveBg:"#ffffff", headerBg:"rgb(255,251,240)", userCardBg:"#ffffff",
    border:"rgb(225,221,210)", borderStrong:"#d4c9b8",
    textPrimary:"#111111", textSecondary:"rgb(25,6,12)", textMuted:"#888888", textInverse:"#ffffff",
    accent:"#2d2416", accentText:"#ffffff",
    navActiveBg:"#ffffff", navActiveText:"#111111", navInactiveText:"rgb(25,6,12)",
    fontBody:"'Montserrat', sans-serif", fontHeading:"'Syne', sans-serif",
  },
  dark: {
    pageBg:"#0f0f0f", sidebarBg:"#161616", cardBg:"#1e1e1e", inputBg:"#252525",
    pillActiveBg:"#ffffff", pillInactiveBg:"#252525", headerBg:"#0f0f0f", userCardBg:"#252525",
    border:"#2a2a2a", borderStrong:"#3a3a3a",
    textPrimary:"#ffffff", textSecondary:"#b8a99a", textMuted:"#6b5e52", textInverse:"#0f0f0f",
    accent:"#ffffff", accentText:"#111111",
    navActiveBg:"#2a2a2a", navActiveText:"#ffffff", navInactiveText:"#6b5e52",
    fontBody:"'Montserrat', sans-serif", fontHeading:"'Syne', sans-serif",
  },
  mono: {
    pageBg:"#ffffff", sidebarBg:"#fafafa", cardBg:"#ffffff", inputBg:"#ffffff",
    pillActiveBg:"#111111", pillInactiveBg:"#ffffff", headerBg:"#ffffff", userCardBg:"#ffffff",
    border:"#e5e5e5", borderStrong:"#cccccc",
    textPrimary:"#111111", textSecondary:"#444444", textMuted:"#999999", textInverse:"#ffffff",
    accent:"#111111", accentText:"#ffffff",
    navActiveBg:"#ffffff", navActiveText:"#111111", navInactiveText:"#999999",
    fontBody:"'Montserrat', sans-serif", fontHeading:"'Syne', sans-serif",
  },
  custom: {
    pageBg:"rgb(255,251,240)", sidebarBg:"rgb(255,255,250)", cardBg:"#ffffff", inputBg:"#ffffff",
    pillActiveBg:"#2d2416", pillInactiveBg:"#ffffff", headerBg:"rgb(255,251,240)", userCardBg:"#ffffff",
    border:"rgb(225,221,210)", borderStrong:"#d4c9b8",
    textPrimary:"#111111", textSecondary:"rgb(25,6,12)", textMuted:"#888888", textInverse:"#ffffff",
    accent:"#2d2416", accentText:"#ffffff",
    navActiveBg:"#ffffff", navActiveText:"#111111", navInactiveText:"rgb(25,6,12)",
    fontBody:"'Montserrat', sans-serif", fontHeading:"'Syne', sans-serif",
  },
};

export function buildCustomTheme(accent: string): ThemeTokens {
  const r = parseInt(accent.slice(1,3), 16);
  const g = parseInt(accent.slice(3,5), 16);
  const b = parseInt(accent.slice(5,7), 16);
  const brightness = (r*299 + g*587 + b*114) / 1000;
  const accentText = brightness > 140 ? "#111111" : "#ffffff";
  const tint = (add: number, v: number) => Math.min(255, v + add);
  const pageBg = `rgb(${tint(210,r)},${tint(215,g)},${tint(218,b)})`;
  const sidebarBg = `rgb(${tint(220,r)},${tint(225,g)},${tint(228,b)})`;
  const border = `rgb(${tint(180,r)},${tint(185,g)},${tint(188,b)})`;
  const textSecondary = `rgb(${Math.max(0,r-20)},${Math.max(0,g-30)},${Math.max(0,b-10)})`;
  return {
    pageBg, sidebarBg, cardBg:"#ffffff", inputBg:"#ffffff",
    pillActiveBg: accent, pillInactiveBg:"#ffffff", headerBg: pageBg, userCardBg:"#ffffff",
    border, borderStrong: border,
    textPrimary:"#111111", textSecondary, textMuted:"#888888", textInverse: accentText,
    accent, accentText,
    navActiveBg:"#ffffff", navActiveText:"#111111", navInactiveText:"#888888",
    fontBody:"'Montserrat', sans-serif", fontHeading:"'Syne', sans-serif",
  };
}