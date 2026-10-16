"use client";

import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, BookOpen, CalendarDays, Home, Timer, User, ArrowLeft } from "lucide-react";
import { YEARS, YEAR_LEVELS } from "../lib/years";
import type { YearLevel } from "../lib/types";
import { EASE } from "../lib/motion";
import { usePortal } from "./PortalProvider";
import { ModeToggle } from "./StyleSwitcher";
import { SoundToggle } from "./SoundProvider";
import { useAttendance } from "./useAttendance";
import { useTimetable } from "./useTimetable";
import { useNow, useStoredString } from "./hooks";
import { Footer } from "./Footer";
import { HomeTab } from "./tabs/HomeTab";
import { TimetableTab } from "./tabs/TimetableTab";
import { ResourcesTab } from "./tabs/ResourcesTab";
import { ProgressTab } from "./tabs/ProgressTab";
import { FocusTab } from "./tabs/FocusTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { CwaModal } from "./CwaModal";
import { Chatbot } from "./Chatbot";
import OnboardingTour from "./OnboardingTour";

export type TabId = "home" | "timetable" | "resources" | "progress"  | "focus" | "profile" ;
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home size={18} /> },
  { id: "timetable", label: "Timetable", icon: <CalendarDays size={18} /> },
  { id: "resources", label: "Resources", icon: <BookOpen size={18} /> },
  { id: "progress", label: "Progress", icon: <BarChart3 size={18} /> },
  { id: "focus", label: "Focus", icon: <Timer size={18} /> },
  { id: "profile", label: "Profile", icon: <User size={18} /> },
];

export function YearPortal({ level }: { level: YearLevel }) {
  const base = YEARS[level];
  const tt = useTimetable(base);
  const year = tt.year; // official timetable + this user's own edits
  const { rememberYear, name, ready } = usePortal();
  
  // NEW: Grab the session ID for the community feed
  const [studentId, setStudentId] = useState<string>("");
  useEffect(() => {
    const id = localStorage.getItem("bme-session-id");
    if (id) setStudentId(id);
  }, []);

  const att = useAttendance(year);
  const now = useNow();
  const [showCwa, setShowCwa] = useState(false);

  /* ---- guided tour: auto-shows on the first visit, replayable from Profile ---- */
  const [tourDone, setTourDone] = useStoredString("portal:tour:done", "");
  const [tourAlways, setTourAlways] = useStoredString("portal:tour:always", "");
  const [tourClosed, setTourClosed] = useState(false);
  const [tourManual, setTourManual] = useState(false);
  const showTour = ready && (tourManual || (!tourClosed && (tourDone !== "1" || tourAlways === "1")));
  const finishTour = useCallback(() => { setTourClosed(true); setTourManual(false); setTourDone("1"); }, [setTourDone]);

  useEffect(() => { rememberYear(level); }, [level, rememberYear]);

  // The active tab lives in the URL hash (#timetable) so it's linkable and the back button works.
  const hash = useSyncExternalStore(
    (cb) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); },
    () => window.location.hash.replace("#", ""),
    () => ""
  );
  const tab: TabId = TABS.some((t) => t.id === hash) ? (hash as TabId) : "home";
  const setTab = useCallback((t: TabId) => { window.location.assign(`#${t}`); window.scrollTo({ top: 0 }); }, []);

  const props = { year, now, att, setTab, openCwa: () => setShowCwa(true) };

  const content: Record<TabId, React.ReactNode> = {
    home: <HomeTab {...props} name={name} />,
    timetable: <TimetableTab year={year} now={now} att={att} tt={tt} />,
    resources: <ResourcesTab year={year} />,
    progress: <ProgressTab year={year} now={now} att={att} />,
    focus: <FocusTab year={year} now={now} />,
    profile: <ProfileTab year={year} att={att} onTour={() => setTourManual(true)} tourAlways={tourAlways === "1"} setTourAlways={(v) => setTourAlways(v ? "1" : "")} />,
  };

  if (!ready)
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "100vh" }}>
        <Image src="/bme-logo.png" alt="Loading BME Portal" width={56} height={56} priority style={{ borderRadius: 16, opacity: 0.85 }} />
      </div>
    );

  return (
    <div className="flex" style={{ minHeight: "100vh" }}>
      {/* ───────── desktop sidebar ───────── */}
      <motion.aside className="sidebar" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}>
        <Link href="/" className="flex items-center gap-3" style={{ padding: "0 8px 18px" }} title="Back to all years">
          <Image src="/bme-logo.png" alt="" width={42} height={42} style={{ borderRadius: 12, objectFit: "cover" }} />
          <div>
            <p className="h-title" style={{ fontSize: 15, margin: 0 }}>BME Portal</p>
            <p className="text-muted-x" style={{ fontSize: 11, margin: 0 }}>KNUST · {year.title}</p>
          </div>
        </Link>

        <div style={{ padding: "0 8px 16px" }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Year</p>
          <div className="segmented" style={{ width: "100%" }}>
            {YEAR_LEVELS.map((l) => (
              <Link key={l} href={`/year/${l}`} aria-current={l === level ? "page" : undefined}
                data-active={l === level} style={{ flex: 1, textAlign: "center", padding: "7px 0", fontSize: 13, fontWeight: 800,
                  borderRadius: "var(--radius-ctl)", background: l === level ? "var(--card)" : "transparent",
                  color: l === level ? "var(--ink)" : "var(--ink-2)", boxShadow: l === level ? "var(--shadow-card)" : "none" }}>
                {l}
              </Link>
            ))}
          </div>
        </div>

        <nav aria-label="Sections" className="stack gap-1" style={{ flex: 1 }}>
          {TABS.map((t) => (
            <button key={t.id} className="nav-item" aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
              {tab === t.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: "spring", stiffness: 140, damping: 20 }} />}
              <span className="nav-label">{t.icon}{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-between" style={{ padding: "12px 8px 0", borderTop: "var(--border-w) solid var(--line)" }}>
          <Link href="/" className="flex items-center gap-2 text-muted-x" style={{ fontSize: 12, fontWeight: 700 }}>
            <ArrowLeft size={14} /> All years
          </Link>
          <div className="flex items-center gap-2"><SoundToggle /><ModeToggle /></div>
        </div>
      </motion.aside>

      {/* ───────── main ───────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <header className="topbar">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/bme-logo.png" alt="" width={30} height={30} style={{ borderRadius: 9, objectFit: "cover" }} />
            <span className="h-title" style={{ fontSize: 15 }}>{year.title}</span>
            <span className="chip" style={{ padding: "2px 8px" }}>L{year.levelCode}</span>
          </Link>
          <div className="flex items-center gap-2">
            <select className="select" aria-label="Switch year" value={level} style={{ width: "auto", padding: "7px 10px", fontSize: 12, fontWeight: 700 }}
              onChange={(e) => { window.location.href = `/year/${e.target.value}`; }}>
              {YEAR_LEVELS.map((l) => <option key={l} value={l}>Year {l}</option>)}
            </select>
            <SoundToggle />
            <ModeToggle />
          </div>
        </header>

        <main className="content">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
              {content[tab]}
            </motion.div>
          </AnimatePresence>
          <Footer />
        </main>
      </div>

      {/* ───────── mobile tab bar ───────── */}
      <motion.nav className="tabbar" aria-label="Sections" initial={{ y: 80 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}>
        {TABS.map((t) => (
          <button key={t.id} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
            {t.icon}{t.label}
          </button>
        ))}
      </motion.nav>

      <Chatbot year={year} name={name} />
      <AnimatePresence>{showCwa && <CwaModal year={year} onClose={() => setShowCwa(false)} />}</AnimatePresence>
      <AnimatePresence>{showTour && <OnboardingTour name={name} onFinish={finishTour} onNavigate={setTab} />}</AnimatePresence>
    </div>
  );
}
