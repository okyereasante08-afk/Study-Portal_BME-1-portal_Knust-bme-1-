"use client";

// Shared Framer Motion building blocks. Everything here is deliberately SLOW
// (0.8–1.4s) with a long ease-out so each element has time to be noticed.

import React, { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform, type Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const DUR = 0.85;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: DUR, ease: EASE } },
};

export function Item({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <motion.div variants={itemVariants} className={className} style={style}>{children}</motion.div>;
}

interface StaggerProps {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
  stagger?: number; delay?: number;
  /** children are already <Item/>s (use when each child needs its own className, e.g. grid spans) */
  raw?: boolean;
}

/** Fades + lifts its children in one after another. Wraps each child in <Item/> unless `raw`. */
export function Stagger({ children, className, style, stagger = 0.13, delay = 0.05, raw }: StaggerProps) {
  const kids = React.Children.toArray(children);
  return (
    <motion.div className={className} style={style} initial="hidden" animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {raw ? kids : kids.map((c, i) => <Item key={React.isValidElement(c) && c.key != null ? c.key : i}>{c}</Item>)}
    </motion.div>
  );
}

/** Scroll-triggered fade-up for sections lower on a page. */
export function Reveal({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div className={className} style={style} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/** Number that counts up from 0. */
export function CountUp({ value, suffix = "", duration = 1.6 }: { value: number; suffix?: string; duration?: number }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);
  useEffect(() => {
    const c = animate(mv, value, { duration, ease: EASE });
    return () => c.stop();
  }, [value, duration, mv]);
  return <motion.span>{text}</motion.span>;
}

/** Progress bar whose fill grows in. */
export function Bar({ pct, delay = 0.25 }: { pct: number; delay?: number }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <motion.span initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: EASE, delay }} />
    </div>
  );
}

/** Headline that rises word-by-word out of a mask. */
export function RiseWords({ text, className, start = 0.2, step = 0.14, wordClass }: {
  text: string; className?: string; start?: number; step?: number; wordClass?: string;
}) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className={className} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.12em" }}>
          <motion.span className={wordClass} style={{ display: "inline-block" }}
            initial={{ y: "115%", rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 1, ease: EASE, delay: start + i * step }}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </>
  );
}
