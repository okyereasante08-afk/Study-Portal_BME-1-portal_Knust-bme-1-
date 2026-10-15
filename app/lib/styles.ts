// Registry of the portal's visual styles.
// Each style is a set of CSS-variable tokens + component overrides in globals.css,
// keyed by <html data-style="...">. Flip `ready` to true once a style is built.

import type { StyleId } from "./types";

export interface StyleDef {
  id: StyleId;
  name: string;
  blurb: string;
  ready: boolean;
}

export const STYLES: StyleDef[] = [
  { id: "classic",   name: "Classic",        blurb: "Warm paper tones, soft cards, editorial type.", ready: true },
  { id: "brutalist", name: "Neo-Brutalist",  blurb: "Thick outlines, hard shadows. Blue, red & white.", ready: true },
  { id: "clay",      name: "Claymorphic",    blurb: "Puffy, soft 3D surfaces in pastel tones.",      ready: true },
];

/** Shown in the footer so you can tell which version is actually running. Bump when you ship. */
export const BUILD_ID = "2026-10-11 · v5";

export const DEFAULT_STYLE: StyleId = "classic";
export const isStyleReady = (id: string): id is StyleId => STYLES.some((s) => s.id === id && s.ready);

export const ACCENTS = [
  { name: "Espresso", value: "#2d2416" },
  { name: "Navy",     value: "#1e3a5f" },
  { name: "Forest",   value: "#1a3320" },
  { name: "Plum",     value: "#4a1942" },
  { name: "Rust",     value: "#7c2d12" },
  { name: "Teal",     value: "#065f46" },
];
