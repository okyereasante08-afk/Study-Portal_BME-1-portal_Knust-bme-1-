"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Calendar, BarChart2, Zap, User,
  ChevronRight, ChevronLeft, X, Sparkles,
  CheckCircle, BookOpen, Bell, Coffee, Palette,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Step {
  tab: string | null;          // null = no navigation (welcome / finish)
  icon: React.ReactNode;
  emoji: string;
  title: string;
  body: string;
  highlight?: string;          // small pill label
}

interface Props {
  show: boolean;
  studentName: string;
  onFinish: () => void;
  onNavigate: (tab: string) => void;
}

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    tab: null,
    icon: <Sparkles size={28} />,
    emoji: "👋",
    title: "Welcome to BME Portal",
    body: "Your all-in-one academic companion for BME1 at KNUST. This quick tour will show you everything — takes about 60 seconds.",
    highlight: "Let's go",
  },
  {
    tab: "home",
    icon: <Home size={22} />,
    emoji: "🏠",
    title: "Home",
    body: "Your daily dashboard. See today's classes, upcoming deadlines, class announcements, and quick-access tools — all in one glance.",
    highlight: "Home tab",
  },
  {
    tab: "schedule",
    icon: <Calendar size={22} />,
    emoji: "📅",
    title: "Timetable",
    body: "View today's lectures, browse the weekly grid, and never miss a class. Tap a day to see what's on.",
    highlight: "Timetable tab",
  },
  {
    tab: "progress",
    icon: <BarChart2 size={22} />,
    emoji: "📊",
    title: "Progress",
    body: "Track your attendance, CWA, and academic milestones. See where you stand and what needs attention.",
    highlight: "Progress tab",
  },
  {
    tab: "focus",
    icon: <Zap size={22} />,
    emoji: "⚡",
    title: "Focus Mode",
    body: "Pomodoro timer, lo-fi music, and a distraction-free study environment. Stay in the zone when it counts.",
    highlight: "Focus tab",
  },
  {
    tab: "profile",
    icon: <User size={22} />,
    emoji: "🎨",
    title: "Profile & Settings",
    body: "Upload your photo, switch between themes (Warm, Dark, Mono, Custom), and manage your account.",
    highlight: "Profile tab",
  },
  {
    tab: null,
    icon: <CheckCircle size={28} />,
    emoji: "🎉",
    title: "You're all set!",
    body: "Explore freely. You can replay this guide anytime from the Profile tab → Settings → View Guide.",
    highlight: "Done",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function OnboardingTutorial({ show, studentName, onFinish, onNavigate }: Props) {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // Reset to step 0 whenever the tutorial is (re)opened
  useEffect(() => {
    if (show) setStep(0);
  }, [show]);

  // Navigate to the tab of the current step
  useEffect(() => {
    if (!show) return;
    const tab = STEPS[step]?.tab;
    if (tab) onNavigate(tab);
  }, [step, show]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFinish = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bme-onboarded", "true");
    }
    setLeaving(true);
    setTimeout(() => {
      setLeaving(false);
      onFinish();
    }, 300);
  }, [onFinish]);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else handleFinish();
  }, [step, handleFinish]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  // Keyboard navigation
  useEffect(() => {
    if (!show) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") handleFinish();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [show, next, prev, handleFinish]);

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const progress = ((step) / (STEPS.length - 1)) * 100;

  const firstName = studentName ? studentName.split(" ")[0] : "there";

  return (
    <AnimatePresence>
      {show && !leaving && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleFinish}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10, 8, 5, 0.55)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 9998,
            }}
          />

          {/* ── Card ── */}
          <motion.div
            key={`card-${step}`}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            style={{
              position: "fixed",
              bottom: "clamp(16px, 4vw, 40px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(92vw, 420px)",
              zIndex: 9999,
              /* Glass */
              background: "rgba(255, 251, 240, 0.72)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderRadius: 24,
              border: "1px solid rgba(255, 251, 240, 0.55)",
              boxShadow:
                "0 8px 40px rgba(45, 36, 22, 0.18), 0 2px 8px rgba(45, 36, 22, 0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
              overflow: "hidden",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {/* Progress bar */}
            <div style={{ height: 3, background: "rgba(45,36,22,0.10)", position: "relative" }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #2d2416, #8b6f3e)",
                  borderRadius: 2,
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              />
            </div>

            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
              {/* Step dots */}
              <div style={{ display: "flex", gap: 5 }}>
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    style={{
                      width: i === step ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === step ? "#2d2416" : "rgba(45,36,22,0.2)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.25s",
                    }}
                  />
                ))}
              </div>
              {/* Close */}
              <button
                onClick={handleFinish}
                style={{
                  background: "rgba(45,36,22,0.08)",
                  border: "none",
                  borderRadius: 10,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#2d2416",
                  flexShrink: 0,
                }}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "18px 22px 20px" }}>
              {/* Emoji + pill */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 30, lineHeight: 1 }}>{current.emoji}</span>
                {current.highlight && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "3px 9px",
                    borderRadius: 20,
                    background: "rgba(45,36,22,0.10)",
                    color: "#2d2416",
                  }}>
                    {current.highlight}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: "clamp(17px, 4.5vw, 20px)",
                fontWeight: 800,
                color: "#1a1208",
                fontFamily: "'Syne', sans-serif",
                margin: "0 0 8px",
                lineHeight: 1.2,
              }}>
                {isFirst ? `Hey, ${firstName}! 👋` : current.title}
              </h2>

              {/* Body text */}
              <p style={{
                fontSize: "clamp(13px, 3.5vw, 14px)",
                color: "#5a4a30",
                margin: 0,
                lineHeight: 1.6,
              }}>
                {current.body}
              </p>
            </div>

            {/* Footer nav */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 22px 20px",
              gap: 10,
            }}>
              {/* Back */}
              <button
                onClick={prev}
                disabled={isFirst}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "9px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(45,36,22,0.15)",
                  background: isFirst ? "transparent" : "rgba(255,255,255,0.5)",
                  color: isFirst ? "transparent" : "#2d2416",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isFirst ? "default" : "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                  transition: "all 0.15s",
                  pointerEvents: isFirst ? "none" : "auto",
                }}
              >
                <ChevronLeft size={14} strokeWidth={2.5} />
                Back
              </button>

              {/* Skip / step counter */}
              {!isLast ? (
                <button
                  onClick={handleFinish}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 12,
                    color: "rgba(45,36,22,0.4)",
                    cursor: "pointer",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    padding: "4px 6px",
                  }}
                >
                  Skip tour
                </button>
              ) : (
                <span style={{ fontSize: 12, color: "rgba(45,36,22,0.35)", fontWeight: 500 }}>
                  {step + 1} / {STEPS.length}
                </span>
              )}

              {/* Next / Finish */}
              <button
                onClick={next}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "9px 18px",
                  borderRadius: 12,
                  border: "none",
                  background: "#2d2416",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                  boxShadow: "0 2px 8px rgba(45,36,22,0.25)",
                  transition: "all 0.15s",
                }}
              >
                {isLast ? "Let's go!" : "Next"}
                {!isLast && <ChevronRight size={14} strokeWidth={2.5} />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
