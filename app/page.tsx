"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CalendarDays, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { EASE, RiseWords, Reveal } from "./lib/motion";
import { usePortal } from "./components/PortalProvider";
import { ModeToggle, StylePicker } from "./components/StyleSwitcher";
import { SoundToggle } from "./components/SoundProvider";
import { Footer } from "./components/Footer";
import { YEARS, YEAR_LEVELS, hasTimetable } from "./lib/years";

export default function LandingPage() {
  const { lastYear, rememberYear, name } = usePortal();
  const resume = lastYear ? YEARS[lastYear as 1 | 2 | 3 | 4] : null;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* top bar */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="flex items-center justify-between" style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 20px 0" }}>
        <div className="flex items-center gap-3">
          <Image src="/bme-logo.png" alt="" width={40} height={40} style={{ borderRadius: 12, objectFit: "cover" }} priority />
          <div>
            <p className="h-title" style={{ fontSize: 15, margin: 0 }}>BME Study Portal</p>
            <p className="text-muted-x" style={{ fontSize: 11, margin: 0 }}>KNUST · Biomedical Engineering</p>
          </div>
        </div>
        <div className="flex items-center gap-2"><SoundToggle /><ModeToggle /></div>
      </motion.header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px" }}>
        {/* hero */}
        <section style={{ padding: "56px 0 36px" }}>
          {resume && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <Link href={`/year/${resume.level}`} className="chip chip-ok" style={{ marginBottom: 20, padding: "7px 14px", fontSize: 12 }}>
                {name ? `Welcome back, ${name.split(" ")[0]}` : "Welcome back"} · Continue to {resume.title} <ArrowRight size={13} />
              </Link>
            </motion.div>
          )}
          <motion.p className="eyebrow" style={{ marginBottom: 14 }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            Study portal · All levels
          </motion.p>
          <h1 className="h-display hero-title" style={{ fontSize: "clamp(30px, 4.6vw, 54px)", maxWidth: 760, margin: 0 }}>
            <RiseWords text="Your whole degree," start={0.25} />
            <br />
            <RiseWords text="one calm place." start={0.85} wordClass="hl" />
          </h1>
          <motion.p className="text-ink-2" style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 560, margin: "22px 0 0" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 1.5 }}>
            Timetables, lecture slides, study resources and focus tools for every year of Biomedical Engineering.
            Pick your year to get started.
          </motion.p>
        </section>

        {/* year picker */}
        <section aria-labelledby="pick-year">
          <h2 id="pick-year" className="eyebrow" style={{ marginBottom: 14 }}>Select your year</h2>
          <div className="grid gap-4 year-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {YEAR_LEVELS.map((lvl, i) => {
              const y = YEARS[lvl];
              const live = hasTimetable(y);
              return (
                <motion.div key={lvl} initial={{ opacity: 0, y: 70, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1.7 + 0.18 * i, duration: 1, ease: EASE }}>
                  <Link href={`/year/${lvl}`} onClick={() => rememberYear(lvl)} className="card card-link block year-tile" style={{ padding: 22, height: "100%" }}>
                    <div className="flex items-start justify-between">
                      <span className="h-display" style={{ fontSize: 64, lineHeight: 0.9 }}>{lvl}</span>
                      <span className={`chip ${live ? "chip-ok" : ""}`}>{live ? "Timetable live" : "Coming soon"}</span>
                    </div>
                    <h3 className="h-title" style={{ fontSize: 20, margin: "18px 0 2px" }}>{y.title}</h3>
                    <p className="eyebrow" style={{ margin: 0 }}>Level {y.levelCode}</p>
                    <p className="text-ink-2" style={{ fontSize: 13, lineHeight: 1.55, margin: "12px 0 16px" }}>{y.tagline}</p>
                    <div className="flex items-center gap-3 text-muted-x" style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                      <span className="flex items-center gap-1"><Layers size={13} style={{ flexShrink: 0 }} /> {y.courses.length || "—"} courses</span>
                      <span className="flex items-center gap-1"><BookOpen size={13} style={{ flexShrink: 0 }} /> {y.kit.length + y.files.length || "—"} resources</span>
                      <ArrowRight size={16} style={{ marginLeft: "auto", color: "var(--ink)" }} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* style picker */}
        <Reveal className="" style={{ padding: "52px 0 8px" }}><section aria-labelledby="pick-style">
          <div className="flex items-end justify-between flex-wrap gap-2" style={{ marginBottom: 14 }}>
            <div>
              <h2 id="pick-style" className="eyebrow" style={{ marginBottom: 6 }}>Pick a look</h2>
              <p className="text-ink-2" style={{ fontSize: 14, margin: 0 }}>Same portal, three personalities. Switch any time.</p>
            </div>
            <span className="chip"><CalendarDays size={12} /> Saved on this device</span>
          </div>
          <StylePicker />
        </section></Reveal>
      </main>

      <Footer />
    </div>
  );
}
