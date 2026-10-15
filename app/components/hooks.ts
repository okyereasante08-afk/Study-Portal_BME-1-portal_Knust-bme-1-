"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "../lib/storage";

/* ──────────────────────────────────────────────────────────────────────────
   localStorage as an external store.
   useSyncExternalStore gives us SSR-safe reads (server snapshot = the default,
   client snapshot = the saved value after hydration) with no effect + setState.
   ────────────────────────────────────────────────────────────────────────── */

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => { listeners.delete(cb); window.removeEventListener("storage", cb); };
}

interface Codec<T> { parse: (raw: string) => T; stringify: (v: T) => string }
const jsonCodec = <T,>(): Codec<T> => ({ parse: (r) => JSON.parse(r) as T, stringify: (v) => JSON.stringify(v) });
const rawCodec: Codec<string> = { parse: (r) => r, stringify: (v) => v };

const cache = new Map<string, { raw: string; value: unknown }>();

function useStoredValue<T>(key: string, initial: T, codec: Codec<T>): [T, (v: T | ((p: T) => T)) => void] {
  const initialRef = useRef(initial);
  const codecRef = useRef(codec);

  const getSnapshot = useCallback((): T => {
    const raw = safeGetItem(key, "");
    if (!raw) return initialRef.current;
    const hit = cache.get(key);
    if (hit && hit.raw === raw) return hit.value as T;
    try {
      const value = codecRef.current.parse(raw);
      cache.set(key, { raw, value });
      return value;
    } catch {
      return initialRef.current;
    }
  }, [key]);

  const value = useSyncExternalStore(subscribe, getSnapshot, () => initialRef.current);

  const set = useCallback((v: T | ((p: T) => T)) => {
    const prev = getSnapshot();
    const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
    const raw = codecRef.current.stringify(next);
    safeSetItem(key, raw);
    cache.set(key, { raw, value: next });
    notify();
  }, [key, getSnapshot]);

  return [value, set];
}

/** JSON-serialised persistent state. */
export function usePersistentState<T>(key: string, initial: T) {
  return useStoredValue<T>(key, initial, jsonCodec<T>());
}

/** Plain-string persistent state (readable by the no-flash theme script in layout.tsx). */
export function useStoredString(key: string, initial: string) {
  return useStoredValue<string>(key, initial, rawCodec);
}

/** false on the server / first render, true once hydrated. */
export function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

/** Re-renders every `ms` so "next class" / countdowns stay fresh. null until mounted. */
export function useNow(ms = 60_000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, ms);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [ms]);
  return now;
}
