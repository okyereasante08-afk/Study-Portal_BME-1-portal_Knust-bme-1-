"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Calendar, BarChart2, Zap, User,
  ChevronRight, ChevronLeft, X, Sparkles, CheckCircle,
} from "lucide-react";

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
    body: "Your daily dashboard. See today's classes, upcoming deadlines, class announcements, and quick-access tools — all in one glance.",
    highlight: "Home",
  },
  {
    tab: "schedule",
    emoji: "📅",
    title: "Timetable",
    body: "View today's lectures, browse the weekly grid, and never miss a class. Tap a day to see what's on.",
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
    body: "Pomodoro timer, lo-fi music, and a distraction-free study environment. Stay in the zone when it counts.",
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
    body: "Explore freely. You can replay this guide anytime from Profile → Appearance → View Guide.",
    highlight: "Done",
  },
];

export default function OnboardingTutorial({ show, studentName, onFinish, onNavigate }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (show) setStep(0);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const tab = STEPS[step]?.tab;
    if (tab) onNavigate(tab);
  }, [step, show]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFinish = useCallback(() => {
    onFinish();
  }, [onFinish]);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else handleFinish();
  }, [step, handleFinish]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

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
  const progress = (step / (STEPS.length - 1)) * 100;
  const firstName = studentName ? studentName.split(" ")[0] : "there";

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleFinish}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10,8,5,0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9998,
            }}
          />

          {/* Card — anchored bottom-center, safe on mobile */}
          <motion.div
            key={`card-${step}`}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            style={{
              position: "fixed",
              /* sit above mobile nav bars with safe-area */
              bottom: "max(20px, env(safe-area-inset-bottom, 20px))",
              left: "50%",
              transform: "translateX(-50%)",
              /* fluid width: full-bleed on tiny screens, capped on desktop */
              width: "min(calc(100vw - 24px), 440px)",
              zIndex: 9999,
              /* glass */
              background: "rgba(255,251,240,0.80)",
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
              borderRadius: 22,
              border: "1px solid rgba(255,251,240,0.6)",
              boxShadow:
                "0 12px 48px rgba(45,36,22,0.18), 0 2px 8px rgba(45,36,22,0.10), inset 0 1px 0 rgba(255,255,255,0.75)",
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
                  background: "linear-gradient(90deg, #2d2416 0%, #8b6f3e 100%)",
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Top row: dots + close */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px 0",
              }}
            >
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    style={{
                      width: i === step ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === step ? "#2d2416" : "rgba(45,36,22,0.18)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.22s",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={handleFinish}
                style={{
                  background: "rgba(45,36,22,0.08)",
                  border: "none",
                  borderRadius: 9,
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
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "16px 20px 4px" }}>
              {/* Emoji + pill */}
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
                <span style={{ fontSize: 26, lineHeight: 1 }}>{current.emoji}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: 20,
                    background: "rgba(45,36,22,0.09)",
                    color: "#2d2416",
                  }}
                >
                  {current.highlight}
                </span>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: "clamp(16px, 4vw, 19px)",
                  fontWeight: 800,
                  color: "#1a1208",
                  fontFamily: "'Syne', sans-serif",
                  margin: "0 0 7px",
                  lineHeight: 1.25,
                }}
              >
                {isFirst ? `Hey, ${firstName}! 👋` : current.title}
              </h2>

              {/* Body text */}
              <p
                style={{
                  fontSize: "clamp(12px, 3.2vw, 14px)",
                  color: "#5a4a30",
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                {current.body}
              </p>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px 18px",
                gap: 8,
              }}
            >
              {/* Back */}
              <button
                onClick={prev}
                disabled={isFirst}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "9px 14px",
                  borderRadius: 11,
                  border: "1px solid rgba(45,36,22,0.14)",
                  background: isFirst ? "transparent" : "rgba(255,255,255,0.55)",
                  color: isFirst ? "transparent" : "#2d2416",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isFirst ? "default" : "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                  pointerEvents: isFirst ? "none" : "auto",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                <ChevronLeft size={13} strokeWidth={2.5} />
                Back
              </button>

              {/* Skip */}
              {!isLast ? (
                <button
                  onClick={handleFinish}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 12,
                    color: "rgba(45,36,22,0.38)",
                    cursor: "pointer",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    padding: "4px 2px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Skip tour
                </button>
              ) : (
                <span style={{ fontSize: 11, color: "rgba(45,36,22,0.32)", fontWeight: 500 }}>
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
                  borderRadius: 11,
                  border: "none",
                  background: "#2d2416",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                  boxShadow: "0 2px 10px rgba(45,36,22,0.22)",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.15s",
                }}
              >
                {isLast ? "Let's go!" : "Next"}
                {!isLast && <ChevronRight size={13} strokeWidth={2.5} />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
