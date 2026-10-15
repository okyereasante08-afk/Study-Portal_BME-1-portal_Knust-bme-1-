"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, BookOpen, CalendarDays, ChevronLeft, ChevronRight, Home, MessageSquare, PartyPopper, Sparkles, Timer, User, X } from "lucide-react";
import { EASE } from "../lib/motion";

type Tab = "home" | "timetable" | "resources" | "progress" | "focus" | "profile";
interface Step { tab: Tab | null; icon: React.ReactNode; title: string; body: string; chat?: boolean }

const STEPS: Step[] = [
  { tab: null, icon: <Sparkles size={20} />, title: "Welcome to the BME Portal", body: "Everything for your year of Biomedical Engineering in one place. This tour takes about a minute." },
  { tab: "home", icon: <Home size={20} />, title: "Home", body: "Your daily dashboard: what's next, today's classes, updates, countdowns to exams, and shortcuts to the tools you use most." },
  { tab: "timetable", icon: <CalendarDays size={20} />, title: "Timetable", body: "See today, the week, or the full grid. Times, venues or lecturers changed? Tap any class in the grid to edit it, or add your own." },
  { tab: "resources", icon: <BookOpen size={20} />, title: "Resources", body: "Lecture slides, lab manuals, past questions and a curated video survival kit for each course." },
  { tab: "progress", icon: <BarChart3 size={20} />, title: "Progress", body: "Attendance for every class, so you can spot a course slipping below 70% before it becomes a problem." },
  { tab: "focus", icon: <Timer size={20} />, title: "Focus studio", body: "A Pomodoro timer and lofi radio for deep work. Pick a station, press start, and stay in the zone." },
  { tab: "profile", icon: <User size={20} />, title: "Profile & look", body: "Add your name and photo, and switch between light and dark, or between interface styles. You can replay this tour here too." },
  { tab: null, chat: true, icon: <MessageSquare size={20} />, title: "Your study assistant", body: "The round button in the corner opens the assistant. Ask about your timetable, courses, or how CWA is worked out." },
  { tab: null, icon: <PartyPopper size={20} />, title: "You're all set", body: "Explore freely. You can replay the tour any time from Profile." },
];

export default function OnboardingTour({ name, onFinish, onNavigate }: {
  name: string; onFinish: () => void; onNavigate: (tab: Tab) => void;
}) {
  const [step, setStep] = useState(0);
  const cur = STEPS[step];
  const last = step === STEPS.length - 1;
  const first = name.trim().split(" ")[0];

  useEffect(() => { if (cur.tab) onNavigate(cur.tab); }, [cur.tab, onNavigate]);

  const next = useCallback(() => (last ? onFinish() : setStep((s) => s + 1)), [last, onFinish]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") onFinish();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev, onFinish]);

  return (
    <>
      <motion.div className="tour-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} onClick={onFinish} />

      {/* pulse rings around the assistant button on its step */}
      <AnimatePresence>
        {cur.chat && (
          <motion.div key="ring" className="chat-anchor tour-ring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <span className="tour-fab"><MessageSquare size={20} /></span>
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="tour-pulse" initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="tour-card card" role="dialog" aria-modal="true" aria-label="Portal tour"
        initial={{ opacity: 0, y: 50, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.97 }} transition={{ duration: 0.7, ease: EASE }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <span className="eyebrow">Step {step + 1} of {STEPS.length}</span>
          <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={onFinish} aria-label="Skip tour"><X size={14} /></button>
        </div>

        <div style={{ minHeight: 132 }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                <span className="avatar" style={{ width: 44, height: 44 }}>{cur.icon}</span>
                <h2 className="h-title" style={{ fontSize: 20, margin: 0 }}>{step === 0 && first ? `Welcome, ${first}` : cur.title}</h2>
              </div>
              <p className="text-ink-2" style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>{cur.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1" style={{ margin: "16px 0" }} aria-hidden>
          {STEPS.map((_, i) => (
            <motion.span key={i} animate={{ width: i === step ? 26 : 8, opacity: i <= step ? 1 : 0.35 }} transition={{ duration: 0.5, ease: EASE }}
              style={{ height: 6, background: "var(--accent)", display: "block", borderRadius: 3 }} />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button className="btn btn-sm" onClick={prev} disabled={step === 0}><ChevronLeft size={14} /> Back</button>
          <div className="flex items-center gap-2">
            {!last && <button className="btn btn-sm" onClick={onFinish}>Skip</button>}
            <button className="btn btn-primary btn-sm" onClick={next} autoFocus>{last ? "Get started" : "Next"} {!last && <ChevronRight size={14} />}</button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
