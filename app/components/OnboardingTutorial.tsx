"use client";

/**
 * OnboardingTutorial.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * First-login spotlight tutorial for the KNUST BME1 Portal.
 *
 * HOW IT WORKS
 * ─────────────
 * - Shows automatically on first login (checks localStorage "bme-onboarded")
 * - Dark overlay with a circular spotlight that animates between UI targets
 * - 6 steps, each with a card anchored near the spotlight
 * - Skip or finish → sets "bme-onboarded" = "true" in localStorage
 * - Replay: call with `show={true}` from Profile tab's Guide button
 *
 * USAGE in page.tsx
 * ──────────────────
 * 1. Import at the top:
 *    import OnboardingTutorial from "./components/OnboardingTutorial";
 *
 * 2. Add state (near your other useState calls, line ~675):
 *    const [showTutorial, setShowTutorial] = useState(false);
 *
 * 3. Trigger on login — inside proceedToLogin() after setIsLoggedIn(true):
 *    const seen = localStorage.getItem("bme-onboarded");
 *    if (!seen) setShowTutorial(true);
 *
 * 4. Add the component just before the closing </div> of the dashboard
 *    (right before the Copyright Footer, around line ~1948):
 *    <OnboardingTutorial
 *      show={showTutorial}
 *      studentName={studentName}
 *      onFinish={() => setShowTutorial(false)}
 *      onReplay={() => setShowTutorial(true)}
 *    />
 *
 * 5. In renderProfile(), inside the "About this portal" card, add a Guide button:
 *    <button onClick={() => { localStorage.removeItem("bme-onboarded"); setShowTutorial(true); }}
 *      style={{ marginTop: 12, width: "100%", padding: "10px 0", borderRadius: 12, border: "1.5px solid #ece8e0",
 *               background: "#fff", color: "#2d2416", fontSize: 13, fontWeight: 700, cursor: "pointer",
 *               fontFamily: "'Montserrat', sans-serif" }}>
 *      ✦ View Guide
 *    </button>
 */

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Step {
  id: string;
  emoji: string;
  title: string;
  body: string;
  /** CSS selector of the element to spotlight. null = center screen (welcome/farewell) */
  target: string | null;
  /** Which side of the spotlight the card appears on */
  cardSide: "bottom" | "top" | "right" | "left" | "center";
}

interface OnboardingTutorialProps {
  show: boolean;
  studentName: string;
  onFinish: () => void;
  onReplay?: () => void;
}

interface SpotlightRect {
  cx: number;
  cy: number;
  r: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Steps
// ─────────────────────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    id: "welcome",
    emoji: "👋",
    title: "Welcome to BME Portal",
    body: "Your personal academic companion for KNUST Biomedical Engineering Year 1. This quick tour takes 30 seconds.",
    target: null,
    cardSide: "center",
  },
  {
    id: "home",
    emoji: "🏠",
    title: "Home",
    body: "See your next class, mark attendance, check credit hours and quick links — everything at a glance.",
    target: "[data-tab='home']",
    cardSide: "right",
  },
  {
    id: "timetable",
    emoji: "📅",
    title: "Timetable",
    body: "View your full week in a clean grid. Today's column is always highlighted so you never miss a class.",
    target: "[data-tab='schedule']",
    cardSide: "right",
  },
  {
    id: "progress",
    emoji: "📊",
    title: "Progress",
    body: "Track your CWA, attendance percentage per course, and see who is at risk of falling below 70%.",
    target: "[data-tab='progress']",
    cardSide: "right",
  },
  {
    id: "focus",
    emoji: "⚡",
    title: "Focus Studio",
    body: "Pomodoro timer with lofi radio built in. Deep work mode turns the timer card dark so you stay locked in.",
    target: "[data-tab='focus']",
    cardSide: "right",
  },
  {
    id: "chatbot",
    emoji: "💬",
    title: "BME Assistant",
    body: "Your AI study buddy. Ask about your timetable, CWA projections, or anything BME-related. Tap the chat bubble anytime.",
    target: "[data-chatbot-toggle='true']",
    cardSide: "top",
  },
  {
    id: "done",
    emoji: "✦",
    title: "You're all set!",
    body: "Replay this guide anytime from Profile → About → View Guide. Now go ace Semester 2.",
    target: null,
    cardSide: "center",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getSpotlight(target: string | null): SpotlightRect {
  if (!target) {
    return { cx: window.innerWidth / 2, cy: window.innerHeight / 2, r: 0 };
  }
  const el = document.querySelector(target);
  if (!el) {
    return { cx: window.innerWidth / 2, cy: window.innerHeight / 2, r: 0 };
  }
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const r = Math.max(rect.width, rect.height) / 2 + 28;
  return { cx, cy, r };
}

function cardPosition(
  spot: SpotlightRect,
  side: Step["cardSide"],
  cardW: number,
  cardH: number
): { top: number; left: number } {
  const pad = 20;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (side === "center") {
    return {
      top: vh / 2 - cardH / 2,
      left: vw / 2 - cardW / 2,
    };
  }
  if (side === "right") {
    return {
      top: Math.min(Math.max(spot.cy - cardH / 2, pad), vh - cardH - pad),
      left: Math.min(spot.cx + spot.r + 16, vw - cardW - pad),
    };
  }
  if (side === "left") {
    return {
      top: Math.min(Math.max(spot.cy - cardH / 2, pad), vh - cardH - pad),
      left: Math.max(spot.cx - spot.r - cardW - 16, pad),
    };
  }
  if (side === "top") {
    return {
      top: Math.max(spot.cy - spot.r - cardH - 16, pad),
      left: Math.min(Math.max(spot.cx - cardW / 2, pad), vw - cardW - pad),
    };
  }
  // bottom
  return {
    top: Math.min(spot.cy + spot.r + 16, vh - cardH - pad),
    left: Math.min(Math.max(spot.cx - cardW / 2, pad), vw - cardW - pad),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const CARD_W = 300;
const CARD_H = 200; // rough estimate for positioning

export default function OnboardingTutorial({
  show,
  studentName,
  onFinish,
}: OnboardingTutorialProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [spot, setSpot] = useState<SpotlightRect>({ cx: 0, cy: 0, r: 0 });
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const isFirst = stepIdx === 0;

  const computeLayout = useCallback(() => {
    const s = getSpotlight(step.target);
    setSpot(s);
    setCardPos(cardPosition(s, step.cardSide, CARD_W, CARD_H));
  }, [step]);

  // Recompute on step change and window resize
  useEffect(() => {
    if (!show) return;
    setReady(false);
    const t = setTimeout(() => {
      computeLayout();
      setReady(true);
    }, 80);
    return () => clearTimeout(t);
  }, [show, stepIdx, computeLayout]);

  useEffect(() => {
    if (!show) return;
    window.addEventListener("resize", computeLayout);
    return () => window.removeEventListener("resize", computeLayout);
  }, [show, computeLayout]);

  // Reset step when reopened
  useEffect(() => {
    if (show) setStepIdx(0);
  }, [show]);

  const finish = () => {
    localStorage.setItem("bme-onboarded", "true");
    onFinish();
  };

  const next = () => {
    if (isLast) { finish(); return; }
    setStepIdx((i) => i + 1);
  };

  const prev = () => setStepIdx((i) => Math.max(0, i - 1));

  if (!show) return null;

  // SVG clip path id
  const clipId = "bme-tutorial-clip";

  // Spotlight radius — 0 for center steps (no target)
  const spotR = step.target ? spot.r : 0;

  const firstName = studentName.split(" ")[0];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* ── Dark overlay with spotlight cutout ── */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9000,
              pointerEvents: ready ? "auto" : "none",
            }}
            onClick={(e) => {
              // clicking outside the card advances step
              if ((e.target as HTMLElement).closest("[data-tutorial-card]")) return;
              next();
            }}
          >
            {ready && (
              <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", inset: 0 }}
              >
                <defs>
                  <mask id={clipId}>
                    <rect width="100%" height="100%" fill="white" />
                    {spotR > 0 && (
                      <circle cx={spot.cx} cy={spot.cy} r={spotR} fill="black" />
                    )}
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="rgba(26, 18, 8, 0.82)"
                  mask={`url(#${clipId})`}
                  style={{ backdropFilter: "blur(2px)" }}
                />
                {/* spotlight ring */}
                {spotR > 0 && (
                  <circle
                    cx={spot.cx}
                    cy={spot.cy}
                    r={spotR + 2}
                    fill="none"
                    stroke="rgba(240,235,227,0.25)"
                    strokeWidth="1.5"
                  />
                )}
              </svg>
            )}
          </motion.div>

          {/* ── Tutorial card ── */}
          {ready && (
            <motion.div
              key={`card-${stepIdx}`}
              data-tutorial-card="true"
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: cardPos.top,
                left: cardPos.left,
                width: CARD_W,
                zIndex: 9100,
                background: "#ffffff",
                borderRadius: 20,
                boxShadow: "0 24px 64px rgba(0,0,0,0.28), 0 0 0 1px rgba(236,232,224,0.8)",
                overflow: "hidden",
                fontFamily: "'Montserrat', sans-serif",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card top accent bar */}
              <div style={{ height: 4, background: "linear-gradient(90deg, #2d2416, #8b7355, #c9a87c)" }} />

              <div style={{ padding: "20px 20px 16px" }}>
                {/* Step indicator */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: i === stepIdx ? 18 : 6,
                          height: 6,
                          borderRadius: 3,
                          background: i === stepIdx ? "#2d2416" : i < stepIdx ? "#c9a87c" : "#ece8e0",
                          transition: "all 0.25s ease",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={finish}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#a8967a", fontWeight: 600, padding: 0, fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Skip
                  </button>
                </div>

                {/* Emoji */}
                <div style={{ fontSize: 32, marginBottom: 10, lineHeight: 1 }}>{step.emoji}</div>

                {/* Title */}
                <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1208", margin: "0 0 7px", fontFamily: "'Syne', sans-serif", lineHeight: 1.2 }}>
                  {step.id === "welcome"
                    ? `Hey ${firstName} 👋`
                    : step.id === "done"
                    ? step.title
                    : step.title}
                </p>

                {/* Body */}
                <p style={{ fontSize: 13, color: "#6b5438", margin: "0 0 18px", lineHeight: 1.55 }}>
                  {step.body}
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  {!isFirst && (
                    <button
                      onClick={prev}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 12,
                        border: "1.5px solid #ece8e0",
                        background: "#fff",
                        color: "#8b7355",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    onClick={next}
                    style={{
                      flex: 2,
                      padding: "9px 0",
                      borderRadius: 12,
                      border: "none",
                      background: "#2d2416",
                      color: "#f0ebe3",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Montserrat', sans-serif",
                      boxShadow: "0 4px 14px rgba(45,36,22,0.22)",
                    }}
                  >
                    {isLast ? "Let's go ✦" : isFirst ? "Start tour →" : "Next →"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
