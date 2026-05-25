"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

interface Step {
  tab: string | null;
  emoji: string;
  title: string;
  body: string;
  highlight: string;
}

interface Props {
  show: boolean;
  studentName: string;
  onFinish: () => void;
  onNavigate: (tab: string) => void;
}

const STEPS: Step[] = [
  {
    tab: null,
    emoji: "👋",
    title: "Welcome to BME Portal",
    body: "Your all-in-one academic companion for BME1 at KNUST. This quick tour will show you everything — takes about 60 seconds.",
    highlight: "Intro",
  },
  {
    tab: "home",
    emoji: "🏠",
    title: "Home",
    body: "Your daily dashboard. See today's classes, upcoming deadlines, announcements, and quick-access tools — all in one glance.",
    highlight: "Home",
  },
  {
    tab: "schedule",
    emoji: "📅",
    title: "Timetable",
    body: "View today's lectures, browse the full weekly grid, and never miss a class.",
    highlight: "Timetable",
  },
  {
    tab: "progress",
    emoji: "📊",
    title: "Progress",
    body: "Track your attendance, CWA, and academic milestones. See where you stand and what needs attention.",
    highlight: "Progress",
  },
  {
    tab: "focus",
    emoji: "⚡",
    title: "Focus Mode",
    body: "Pomodoro timer, lo-fi music, and a distraction-free study environment. Stay in the zone.",
    highlight: "Focus",
  },
  {
    tab: "profile",
    emoji: "🎨",
    title: "Profile & Settings",
    body: "Upload your photo, switch themes, and manage your account. You can also disable this guide from appearing on login.",
    highlight: "Profile",
  },
  {
    tab: null,
    emoji: "🎉",
    title: "You're all set!",
    body: "Explore freely. Replay this guide anytime from Profile → Appearance → View Guide.",
    highlight: "Done",
  },
];

export default function OnboardingTutorial({ show, studentName, onFinish, onNavigate }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => { if (show) setStep(0); }, [show]);

  useEffect(() => {
    if (!show) return;
    const tab = STEPS[step]?.tab;
    if (tab) onNavigate(tab);
  }, [step, show]); // eslint-disable-line

  const handleFinish = useCallback(() => onFinish(), [onFinish]);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleFinish();
  }, [step, handleFinish]);

  const prev = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  useEffect(() => {
    if (!show) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") handleFinish();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [show, next, prev, handleFinish]);

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const progress = (step / (STEPS.length - 1)) * 100;
  const firstName = studentName ? studentName.split(" ")[0] : "there";

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleFinish}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(10,8,5,0.50)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              zIndex: 9998,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          />

          {/* ── Card — true centered modal, never clipped ── */}
          <div
            style={{
              position: "fixed", inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 12px",
              pointerEvents: "none",
            }}
          >
            <motion.div
              key={`card-${step}`}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              style={{
                pointerEvents: "auto",
                width: "100%",
                maxWidth: 400,
                /* glass */
                background: "rgb(255,251,240)",
                borderRadius: 24,
                border: "1px solid rgb(225,221,210)",
                boxShadow: "0 24px 64px rgba(45,36,22,0.18), 0 4px 16px rgba(45,36,22,0.08)",
                overflow: "hidden",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {/* Progress bar */}
              <div style={{ height: 3, background: "rgba(45,36,22,0.08)" }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #2d2416, #8b6f3e)",
                  }}
                />
              </div>

              {/* Top row: dots + close */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 0" }}>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      style={{
                        width: i === step ? 22 : 6, height: 6,
                        borderRadius: 3,
                        background: i === step ? "#2d2416" : "rgba(45,36,22,0.16)",
                        border: "none", cursor: "pointer", padding: 0,
                        transition: "all 0.22s",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleFinish}
                  style={{
                    background: "rgba(45,36,22,0.08)", border: "none",
                    borderRadius: 9, width: 30, height: 30,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#2d2416", flexShrink: 0,
                  }}
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "18px 22px 6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{current.emoji}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                    textTransform: "uppercase", padding: "3px 9px", borderRadius: 20,
                    background: "rgba(45,36,22,0.09)", color: "#2d2416",
                  }}>
                    {current.highlight}
                  </span>
                </div>

                <h2 style={{
                  fontSize: 19, fontWeight: 800, color: "#1a1208",
                  fontFamily: "'Syne', sans-serif",
                  margin: "0 0 8px", lineHeight: 1.25,
                }}>
                  {isFirst ? `Hey, ${firstName}! 👋` : current.title}
                </h2>

                <p style={{ fontSize: 14, color: "#5a4a30", margin: 0, lineHeight: 1.65 }}>
                  {current.body}
                </p>
              </div>

              {/* Footer */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 22px 22px", gap: 8,
              }}>
                <button
                  onClick={prev}
                  disabled={isFirst}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "10px 16px", borderRadius: 12,
                    border: "1px solid rgba(45,36,22,0.14)",
                    background: isFirst ? "transparent" : "rgba(255,255,255,0.6)",
                    color: isFirst ? "transparent" : "#2d2416",
                    fontSize: 13, fontWeight: 600,
                    cursor: isFirst ? "default" : "pointer",
                    fontFamily: "'Montserrat', sans-serif",
                    pointerEvents: isFirst ? "none" : "auto",
                    transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                >
                  <ChevronLeft size={13} strokeWidth={2.5} /> Back
                </button>

                {!isLast ? (
                  <button
                    onClick={handleFinish}
                    style={{
                      background: "none", border: "none",
                      fontSize: 12, color: "rgba(45,36,22,0.35)",
                      cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 500, padding: "4px 4px", whiteSpace: "nowrap",
                    }}
                  >
                    Skip
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: "rgba(45,36,22,0.3)", fontWeight: 500 }}>
                    {step + 1} / {STEPS.length}
                  </span>
                )}

                <button
                  onClick={next}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "10px 20px", borderRadius: 12,
                    border: "none", background: "#2d2416", color: "#fff",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'Montserrat', sans-serif",
                    boxShadow: "0 2px 12px rgba(45,36,22,0.25)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isLast ? "Let's go!" : "Next"}
                  {!isLast && <ChevronRight size={13} strokeWidth={2.5} />}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
