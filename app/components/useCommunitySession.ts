"use client";
// components/useCommunitySession.ts
// One community identity, from either source:
//   1. "account"    : an optional Supabase Auth account (email + password)
//   2. "student-id" : the original roster login, kept in localStorage
// If both exist, the account wins. Signing in with one method clears the other.

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { displayNameOf, signOutAccount } from "../lib/auth";

const ID_KEY = "bme-session-id";
const NAME_KEY = "bme-name";
const YEAR_KEY = "bme-year";

export type SessionMethod = "student-id" | "account";

export interface CommunitySession {
  /** Value stored as author_id on posts, likes and comments. */
  id: string;
  name: string;
  method: SessionMethod;
}

const SESSION_EVENT = "bme-session-change";

function subscribeStudent(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(SESSION_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(SESSION_EVENT, cb);
  };
}

function readKey(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function notifyStudent() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}

function clearStudent() {
  const had = readKey(ID_KEY) !== null;
  try {
    localStorage.removeItem(ID_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(YEAR_KEY);
  } catch {
    /* storage unavailable */
  }
  if (had) notifyStudent();
}

export function useCommunitySession() {
  const [account, setAccount] = useState<User | null>(null);
  const [accountChecked, setAccountChecked] = useState(false);
  const [recovery, setRecovery] = useState(false);

  // Student-ID session lives in localStorage; the server snapshot is null so hydration matches.
  const studentId = useSyncExternalStore(subscribeStudent, () => readKey(ID_KEY), () => null);
  const studentName = useSyncExternalStore(subscribeStudent, () => readKey(NAME_KEY), () => null);
  const student = useMemo(
    () => (studentId ? { id: studentId, name: studentName || "BME Student" } : null),
    [studentId, studentName]
  );

  // Supabase account session, kept in sync for the lifetime of the page.
  useEffect(() => {
    let active = true;

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      if (!active) return;
      const user = next?.user ?? null;
      setAccount(user);
      setAccountChecked(true);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (user) clearStudent();
    });

    // Fallback for clients that do not emit INITIAL_SESSION.
    supabase.auth.getSession().then(({ data: s }) => {
      if (!active) return;
      setAccount((prev) => prev ?? s.session?.user ?? null);
      setAccountChecked(true);
    }).catch(() => { if (active) setAccountChecked(true); });

    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  const session = useMemo<CommunitySession | null>(() => {
    if (account) return { id: account.id, name: displayNameOf(account), method: "account" };
    if (student) return { id: student.id, name: student.name, method: "student-id" };
    return null;
  }, [account, student]);

  const loginWithStudent = useCallback(async (id: string, name: string, yearLevel: number) => {
    try {
      localStorage.setItem(ID_KEY, id);
      localStorage.setItem(NAME_KEY, name);
      localStorage.setItem(YEAR_KEY, String(yearLevel));
    } catch {
      /* storage unavailable: session lasts until reload */
    }
    notifyStudent();
    if (account) await signOutAccount();
  }, [account]);

  const signOut = useCallback(async () => {
    clearStudent();
    if (account) await signOutAccount();
  }, [account]);

  const clearRecovery = useCallback(() => setRecovery(false), []);

  return {
    session,
    ready: accountChecked,
    recovery,
    clearRecovery,
    loginWithStudent,
    signOut,
  };
}
