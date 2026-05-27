// app/components/AppShell.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Calculator, BookOpen, Bell, LogOut, Zap,
  Home as HomeIcon, Calendar, BarChart2, User, Star, ChevronRight, Palette,
} from "lucide-react";

import { useTheme } from "@/lib/theme";
import type { ThemeKey } from "@/lib/theme";
import {
  CLASS_LIST, TIMETABLE, COURSE_CREDITS, getSessionsByWeekday,
  MAX_ATTENDANCE_EDITS, AT_RISK_THRESHOLD, ADMIN_IDS, GHOST_ID,
  SEM2_VERSION_KEY, SEM2_VERSION_VAL,
  END_OF_SEM_DATE, MID_SEM_START, EXAMS_START, PORTAL_VERSION,
  timeToMinutes,
} from "@/lib/data";
import { Avatar } from "@/app/components/ui";

import LoginScreen from "@/app/components/LoginScreen";
import CWAModal from "@/app/components/CWAModal";
import UpdatesModal from "@/app/components/UpdatesModal";
import SurvivalKitModal from "@/app/components/SurvivalKitModal";
import BMEChatbot from "@/app/components/BMEChatbot";
import PhotoUpload from "@/app/components/PhotoUpload";
import OnboardingTutorial from "@/app/components/OnboardingTutorial";

import HomeTab from "@/app/components/tabs/HomeTab";
import ScheduleTab from "@/app/components/tabs/ScheduleTab";
import ProgressTab from "@/app/components/tabs/ProgressTab";
import FocusTab from "@/app/components/tabs/FocusTab";

// ─── helpers ────────────────────────────────────────────────
const getFirstName = (name: string) => name.split(" ")[0];
const fmtTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ────────────────────────────────────────────────────────────
export default function AppShell() {
  const { theme, themeKey, setThemeKey, customAccent, setCustomAccent } = useTheme();

  // ── auth / user state ──────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentID, setStudentID] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // ── login form state ───────────────────────────────────────
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [firstLoginStep, setFirstLoginStep] = useState<"password" | "security">("password");
  const [loginError, setLoginError] = useState("");
  const [loginMode, setLoginMode] = useState<"student" | "admin">("student");
  const [adminAccessCode, setAdminAccessCode] = useState("");

  // ── reset state ────────────────────────────────────────────
  const [showReset, setShowReset] = useState(false);
  const [resetID, setResetID] = useState("");
  const [resetAnswer, setResetAnswer] = useState("");
  const [resetNewPw, setResetNewPw] = useState("");
  const [resetStep, setResetStep] = useState<"verify" | "newpw">("verify");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // ── navigation ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"home" | "schedule" | "progress" | "focus" | "profile">("home");

  // ── modals ─────────────────────────────────────────────────
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [showUpdatesHub, setShowUpdatesHub] = useState(false);
  const [showSurvivalKit, setShowSurvivalKit] = useState(false);

  // ── attendance ─────────────────────────────────────────────
  const [attendance, setAttendance] = useState<Record<string, number>>({});
  const [attendanceMarked, setAttendanceMarked] = useState<Record<string, boolean>>({});
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, "attended" | "skipped" | null>>({});
  const [attendanceEdits, setAttendanceEdits] = useState<Record<string, number>>({});

  // ── countdowns ─────────────────────────────────────────────
  const [daysToEnd, setDaysToEnd] = useState(0);
  const [daysToMidSem, setDaysToMidSem] = useState(0);
  const [daysToExams, setDaysToExams] = useState(0);

  // ── announcements / files ──────────────────────────────────
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  // ── next class ─────────────────────────────────────────────
  const [nextClassInfo, setNextClassInfo] = useState<{
    course: string; venue: string; startTime: string; minsUntil: number;
  } | null>(null);

  // ── focus / timer ──────────────────────────────────────────
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");
  const [timerSessions, setTimerSessions] = useState(0);
  const [focusMins, setFocusMins] = useState(25);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── lofi ───────────────────────────────────────────────────
  const [lofiPlaying, setLofiPlaying] = useState(false);
  const [lofiVolume, setLofiVolume] = useState(0.6);
  const [lofiChannel, setLofiChannel] = useState("lofi-hiphop");
  const [lofiCustomUrl, setLofiCustomUrl] = useState("");
  const [lofiShowCustom, setLofiShowCustom] = useState(false);
  const [lofiAudioOnly, setLofiAudioOnly] = useState(true);
  const lofiAudioRef = useRef<HTMLAudioElement | null>(null);
  const lofiIframeRef = useRef<HTMLIFrameElement | null>(null);

  // ── mount / restore session ───────────────────────────────
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    // Semester version reset
    if (localStorage.getItem(SEM2_VERSION_KEY) !== SEM2_VERSION_VAL) {
      Object.keys(CLASS_LIST).forEach((id) => {
        localStorage.removeItem(`bme-marked-${id}`);
        localStorage.removeItem(`bme-att-status-${id}`);
        localStorage.removeItem(`bme-att-edits-${id}`);
      });
      localStorage.removeItem("bme-attendance");
      localStorage.setItem(SEM2_VERSION_KEY, SEM2_VERSION_VAL);
    }

    const savedID = localStorage.getItem("bme-session-id");
    if (savedID && CLASS_LIST[savedID]) {
      setStudentID(savedID);
      setStudentName(CLASS_LIST[savedID]);
      setIsLoggedIn(true);
      setIsAdmin(ADMIN_IDS.includes(savedID) || localStorage.getItem("bme-admin-access") === "true");
      setAvatarUrl(localStorage.getItem(`bme-avatar-${savedID}`) ?? null);
    }

    const savedAtt = localStorage.getItem("bme-attendance");
    if (savedAtt) setAttendance(JSON.parse(savedAtt));
    const savedMarked = localStorage.getItem(`bme-marked-${savedID}`);
    if (savedMarked) setAttendanceMarked(JSON.parse(savedMarked));
    const savedStatus = localStorage.getItem(`bme-att-status-${savedID}`);
    if (savedStatus) setAttendanceStatus(JSON.parse(savedStatus));
    const savedEdits = localStorage.getItem(`bme-att-edits-${savedID}`);
    if (savedEdits) setAttendanceEdits(JSON.parse(savedEdits));
    const savedAnn = localStorage.getItem("bme-announcements");
    if (savedAnn) setAnnouncements(JSON.parse(savedAnn));
    const savedFiles = localStorage.getItem("bme-files");
    if (savedFiles) setFiles(JSON.parse(savedFiles));

  setDaysToEnd(Math.ceil((new Date(END_OF_SEM_DATE).getTime() - Date.now()) / 86400000));
setDaysToMidSem(Math.ceil((new Date(MID_SEM_START).getTime() - Date.now()) / 86400000));
setDaysToExams(Math.ceil((new Date(EXAMS_START).getTime() - Date.now()) / 86400000));
  }, []);

  // ── pomodoro timer ────────────────────────────────────────
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((s) => {
          if (s <= 1) {
            setTimerMode((prev) => {
              if (prev === "focus") {
                setTimerSessions((n) => n + 1);
                setTimerSeconds(Math.round(focusMins / 5) * 60);
                return "break";
              } else {
                setTimerSeconds(focusMins * 60);
                return "focus";
              }
            });
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, focusMins]);

  // ── next class polling ────────────────────────────────────
  useEffect(() => {
    const compute = () => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const todayClasses = TIMETABLE[days[new Date().getDay()]] || [];
      const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
      let found = null;
      for (const cls of todayClasses) {
        const minsUntil = timeToMinutes(cls.time.split(" - ")[0]) - nowMins;
        if (minsUntil > 0) {
          found = { course: cls.course, venue: cls.venue, startTime: cls.time.split(" - ")[0], minsUntil };
          break;
        }
      }
      setNextClassInfo(found);
    };
    compute();
    const ref = setInterval(compute, 60000);
    return () => clearInterval(ref);
  }, []);

  // ── derived values ────────────────────────────────────────
  const totalCreditHours = useMemo(() => COURSE_CREDITS.reduce((s, c) => s + c.credits, 0), []);
  const avgAttPct = useMemo(() => {
    const all = Object.values(TIMETABLE).flat();
    if (!all.length) return 0;
    const sum = all.reduce((s, c) => s + getAttendancePct(c.id, c.weekday), 0);
    return Math.round(sum / all.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance]);

  // ── auth helpers ──────────────────────────────────────────
  const sendLoginLog = (id: string, name: string, isFirst: boolean) => {
    const BOT_TOKEN = "8502604375:AAHM6DUR4yVxB7VPXmcXUzr_v4fpUz2Erb8";
    const CHAT_ID = "8627616350";
    const time = new Date().toLocaleString("en-GB", { timeZone: "Africa/Accra", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    const msg = `${isFirst ? "🆕" : "🔁"} *BME Portal Login*\n👤 ${name}\n🆔 ${id}\n🕐 ${time} (Ghana)\n${isFirst ? "✨ First time user" : "↩️ Returning user"}`;
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: "Markdown" }),
    }).catch(() => {});
  };

  const proceedToLogin = (id: string, adminOverride = false) => {
    setStudentName(CLASS_LIST[id]);
    setStudentID(id);
    setIsLoggedIn(true);
    if (typeof window !== "undefined" && localStorage.getItem("bme-guide-disabled") !== "true") setShowTutorial(true);
    const adminStatus = adminOverride || ADMIN_IDS.includes(id);
    setIsAdmin(adminStatus);
    if (id === GHOST_ID) { setAttendance({}); setAttendanceMarked({}); return; }
    if (typeof window !== "undefined") {
      const isFirst = !localStorage.getItem(`pw-${id}`) && !localStorage.getItem("bme-onboarded");
      sendLoginLog(id, CLASS_LIST[id], isFirst);
      localStorage.setItem("bme-session-id", id);
      if (adminStatus) localStorage.setItem("bme-admin-access", "true");
      const savedMarked = localStorage.getItem(`bme-marked-${id}`);
      if (savedMarked) setAttendanceMarked(JSON.parse(savedMarked));
      const savedStatus = localStorage.getItem(`bme-att-status-${id}`);
      if (savedStatus) setAttendanceStatus(JSON.parse(savedStatus));
      const savedEdits = localStorage.getItem(`bme-att-edits-${id}`);
      if (savedEdits) setAttendanceEdits(JSON.parse(savedEdits));
    }
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loginMode === "admin") {
      if (adminAccessCode === "ASANT3&GOD") proceedToLogin("22028883", true);
      else setLoginError("Invalid access code.");
      return;
    }
    if (!CLASS_LIST[studentID]) { setLoginError("Student ID not found."); return; }
    if (studentID === GHOST_ID) { proceedToLogin(GHOST_ID); return; }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`pw-${studentID}`);
      if (!stored) {
        if (!isFirstLogin) { setIsFirstLogin(true); setFirstLoginStep("password"); }
        else if (firstLoginStep === "password") {
          if (password.length < 4) { setLoginError("Password must be at least 4 characters."); return; }
          if (password !== confirmPassword) { setLoginError("Passwords do not match."); return; }
          setTempPassword(password); setFirstLoginStep("security"); setLoginError(""); setConfirmPassword("");
        } else {
          if (securityAnswer.trim().length < 2) { setLoginError("Please enter your answer."); return; }
          localStorage.setItem(`pw-${studentID}`, tempPassword);
          localStorage.setItem(`sq-${studentID}`, securityAnswer.trim().toLowerCase());
          proceedToLogin(studentID);
        }
      } else {
        if (password === stored) proceedToLogin(studentID);
        else setLoginError("Incorrect password.");
      }
    }
  };

  const handleReset = () => {
    setResetError("");
    if (resetStep === "verify") {
      if (!CLASS_LIST[resetID]) { setResetError("Student ID not found."); return; }
      const sq = localStorage.getItem(`sq-${resetID}`);
      if (!sq || sq !== resetAnswer.trim().toLowerCase()) { setResetError("Incorrect answer."); return; }
      setResetStep("newpw");
    } else {
      if (resetNewPw.length < 4) { setResetError("Password must be at least 4 characters."); return; }
      localStorage.setItem(`pw-${resetID}`, resetNewPw);
      setResetSuccess(true);
      setTimeout(() => {
        setShowReset(false); setResetID(""); setResetAnswer(""); setResetNewPw("");
        setResetStep("verify"); setResetSuccess(false); setResetError("");
      }, 2000);
    }
  };

  const handleLogout = () => {
    if (studentID !== GHOST_ID) {
      localStorage.removeItem("bme-session-id");
      localStorage.removeItem("bme-admin-access");
    }
    setIsLoggedIn(false); setIsAdmin(false); setStudentID(""); setPassword("");
    setAdminAccessCode(""); setLoginMode("student"); setIsFirstLogin(false);
    setFirstLoginStep("password");
  };

  // ── attendance helpers ────────────────────────────────────
  const setAttendanceChoice = (id: string, choice: "attended" | "skipped") => {
    const edits = attendanceEdits[id] || 0;
    if (edits >= MAX_ATTENDANCE_EDITS) return;
    const prevStatus = attendanceStatus[id] ?? null;
    const prevCount = attendance[id] || 0;
    let newCount = prevCount;
    if (choice === "attended" && prevStatus !== "attended") newCount = prevCount + 1;
    if (choice === "skipped" && prevStatus === "attended") newCount = Math.max(0, prevCount - 1);
    const newAtt = { ...attendance, [id]: newCount };
    const newStatus = { ...attendanceStatus, [id]: choice };
    const newMarked = { ...attendanceMarked, [id]: true };
    const newEdits = { ...attendanceEdits, [id]: edits + 1 };
    setAttendance(newAtt);
    setAttendanceStatus(newStatus);
    setAttendanceMarked(newMarked);
    setAttendanceEdits(newEdits);
    if (studentID !== GHOST_ID) {
      localStorage.setItem("bme-attendance", JSON.stringify(newAtt));
      localStorage.setItem(`bme-marked-${studentID}`, JSON.stringify(newMarked));
      localStorage.setItem(`bme-att-status-${studentID}`, JSON.stringify(newStatus));
      localStorage.setItem(`bme-att-edits-${studentID}`, JSON.stringify(newEdits));
    }
  };

  const getAttendancePct = (classId: string, weekday?: number, legacyTotal?: number): number => {
    const total = weekday ? (getSessionsByWeekday(weekday) ?? legacyTotal ?? 1) : (legacyTotal ?? 1);
    return total > 0 ? Math.round(((attendance[classId] || 0) / total) * 100) : 0;
  };

  // ── loading splash ─────────────────────────────────────────
  if (!mounted) return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, color: theme.accentText, fontWeight: 800 }}>BME</span>
      </div>
    </div>
  );

  // ── login screen ───────────────────────────────────────────
  if (!isLoggedIn) return (
    <LoginScreen
      studentID={studentID} setStudentID={setStudentID}
      password={password} setPassword={setPassword}
      confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
      securityAnswer={securityAnswer} setSecurityAnswer={setSecurityAnswer}
      showPw={showPw} setShowPw={setShowPw}
      isFirstLogin={isFirstLogin} setIsFirstLogin={setIsFirstLogin}
      firstLoginStep={firstLoginStep} setFirstLoginStep={setFirstLoginStep}
      loginError={loginError} setLoginError={setLoginError}
      loginMode={loginMode} setLoginMode={setLoginMode}
      adminAccessCode={adminAccessCode} setAdminAccessCode={setAdminAccessCode}
      showReset={showReset} setShowReset={setShowReset}
      resetID={resetID} setResetID={setResetID}
      resetAnswer={resetAnswer} setResetAnswer={setResetAnswer}
      resetNewPw={resetNewPw} setResetNewPw={setResetNewPw}
      resetStep={resetStep} setResetStep={setResetStep}
      resetError={resetError} setResetError={setResetError}
      resetSuccess={resetSuccess} setResetSuccess={setResetSuccess}
      handleLogin={handleLogin} handleReset={handleReset}
    />
  );

  // ── profile tab ────────────────────────────────────────────
  const renderProfile = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: theme.cardBg, borderRadius: 20, border: `1px solid ${theme.border}`, overflow: "hidden", padding: "24px 20px", textAlign: "center" }}>
        <PhotoUpload
          storageKey={`bme-avatar-${studentID}`}
          fallbackName={studentName}
        onSave={({ dataUrl }: { dataUrl: string | null }) => setAvatarUrl(dataUrl)}
          onRemove={() => setAvatarUrl(null)}
        />
        <p style={{ fontSize: 13, color: "#a8967a", margin: "0 0 14px" }}>{studentID} · BME1 · Class of 2029</p>
        {isAdmin && (
          <Link href="/admin" style={{ display: "inline-block", padding: "6px 16px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fef3c7", fontSize: 12, fontWeight: 700, color: "#92400e", textDecoration: "none" }}>
            Admin Panel →
          </Link>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { label: "Orion — Class Hub", icon: "⭐", sub: "Discord-style class chat & DMs", href: "/orion", color: "#eef2ff" },
          { label: "WhatsApp Group",     icon: "💬", sub: "BME1 class group",              href: "https://chat.whatsapp.com/EqsJ9zo4goBA6RFjv035Ei", color: "#f0fdf4" },
        ].map((item) => (
          <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
            style={{ background: theme.cardBg, borderRadius: 20, border: `1px solid ${theme.border}`, overflow: "hidden", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", textDecoration: "none" }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1208", margin: "0 0 2px" }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "#a8967a", margin: 0 }}>{item.sub}</p>
            </div>
            <ChevronRight size={16} color="#c9b89a" />
          </a>
        ))}
      </div>

      {/* Appearance */}
      <div style={{ background: theme.cardBg, borderRadius: 20, border: `1px solid ${theme.border}`, overflow: "hidden", padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Palette size={15} color={theme.accent} />
          <p style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase" as const, letterSpacing: 0.8, margin: 0 }}>Appearance</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {([
            { key: "light",  label: "Warm Light", desc: "Default warm tone",  swatch: "#2d2416" },
            { key: "dark",   label: "Dark",        desc: "Easy on the eyes",   swatch: "#ffffff" },
            { key: "mono",   label: "Mono",         desc: "Clean & minimal",    swatch: "#111111" },
            { key: "custom", label: "Custom",       desc: "Pick your colour",   swatch: customAccent },
          ] as { key: ThemeKey; label: string; desc: string; swatch: string }[]).map((preset) => {
            const active = themeKey === preset.key;
            return (
              <button key={preset.key} onClick={() => setThemeKey(preset.key)}
                style={{ padding: "10px 12px", borderRadius: 14, border: active ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`, background: active ? theme.accent : theme.cardBg, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: active ? theme.accentText : theme.textPrimary, margin: 0, fontFamily: theme.fontHeading }}>{preset.label}</p>
                <p style={{ fontSize: 10, color: active ? theme.accentText : theme.textMuted, margin: 0, opacity: 0.8 }}>{preset.desc}</p>
              </button>
            );
          })}
        </div>
        {themeKey === "custom" && (
          <div style={{ padding: 14, borderRadius: 14, background: theme.pageBg, border: `1px solid ${theme.border}` }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: theme.textSecondary, margin: "0 0 10px", fontFamily: theme.fontHeading }}>Pick accent colour</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <input type="color" value={customAccent} onChange={e => setCustomAccent(e.target.value)}
                style={{ width: 36, height: 36, borderRadius: 8, border: "none", cursor: "pointer", padding: 2 }} />
              <input type="text" value={customAccent}
                onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setCustomAccent(e.target.value); }}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: theme.textPrimary, background: theme.cardBg, outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["#2d2416","#1e3a5f","#1a3320","#4a1942","#7c2d12","#1e293b","#065f46","#701a75"].map(swatch => (
                <button key={swatch} onClick={() => setCustomAccent(swatch)}
                  style={{ width: 26, height: 26, borderRadius: 8, background: swatch, border: customAccent === swatch ? `2px solid ${theme.textPrimary}` : "2px solid transparent", cursor: "pointer", padding: 0, transition: "transform 0.1s" }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guide controls */}
      <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={() => setShowTutorial(true)}
          style={{ width: "100%", padding: "10px 0", borderRadius: 12, border: `1.5px solid ${theme.border}`, background: theme.cardBg, color: theme.textPrimary, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: theme.fontBody }}>
          View Guide
        </button>
        <button onClick={() => { const cur = localStorage.getItem("bme-guide-disabled") === "true"; localStorage.setItem("bme-guide-disabled", cur ? "false" : "true"); setShowTutorial(false); }}
          style={{ width: "100%", padding: "10px 0", borderRadius: 12, border: `1.5px solid ${theme.border}`, background: theme.pageBg, color: theme.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: theme.fontBody }}>
          {typeof window !== "undefined" && localStorage.getItem("bme-guide-disabled") === "true"
            ? "Enable guide on login"
            : "Disable guide on login"}
        </button>
      </div>
    </div>
  );

  // ── tab config ─────────────────────────────────────────────
  const tabs = [
    { id: "home",     label: "Home",      icon: <HomeIcon size={20} /> },
    { id: "schedule", label: "Timetable", icon: <Calendar size={20} /> },
    { id: "progress", label: "Progress",  icon: <BarChart2 size={20} /> },
    { id: "focus",    label: "Focus",     icon: <Zap size={20} /> },
    { id: "profile",  label: "Profile",   icon: <User size={20} /> },
  ];

  const sharedAttProps = { attendance, attendanceStatus, attendanceEdits, setAttendanceChoice, getAttendancePct };
  const sharedCountdowns = { daysToMidSem, daysToExams, daysToEnd };

  const tabContent: Record<string, React.ReactNode> = {
    home: (
      <HomeTab
        studentName={studentName}
        avgAttPct={avgAttPct}
        totalCreditHours={totalCreditHours}
        timerSessions={timerSessions}
        nextClassInfo={nextClassInfo}
        announcements={announcements}
        onCWA={() => setShowCWAModal(true)}
        onSurvivalKit={() => setShowSurvivalKit(true)}
        onFocus={() => setActiveTab("focus")}
        onUpdates={() => setShowUpdatesHub(true)}
        onSchedule={() => setActiveTab("schedule")}
        {...sharedAttProps}
      />
    ),
    schedule: <ScheduleTab {...sharedAttProps} />,
    progress: (
      <ProgressTab
        avgAttPct={avgAttPct}
        attendance={attendance}
        getAttendancePct={getAttendancePct}
        {...sharedCountdowns}
      />
    ),
    focus: (
      <FocusTab
        timerActive={timerActive} setTimerActive={setTimerActive}
        timerSeconds={timerSeconds} setTimerSeconds={setTimerSeconds}
        timerMode={timerMode} setTimerMode={setTimerMode}
        timerSessions={timerSessions} setTimerSessions={setTimerSessions}
        focusMins={focusMins} setFocusMins={setFocusMins}
        lofiPlaying={lofiPlaying} setLofiPlaying={setLofiPlaying}
        lofiVolume={lofiVolume} setLofiVolume={setLofiVolume}
        lofiChannel={lofiChannel} setLofiChannel={setLofiChannel}
        lofiCustomUrl={lofiCustomUrl} setLofiCustomUrl={setLofiCustomUrl}
        lofiShowCustom={lofiShowCustom} setLofiShowCustom={setLofiShowCustom}
        lofiAudioOnly={lofiAudioOnly} setLofiAudioOnly={setLofiAudioOnly}
        lofiAudioRef={lofiAudioRef} lofiIframeRef={lofiIframeRef}
        fmtTime={fmtTime}
        {...sharedCountdowns}
      />
    ),
    profile: renderProfile(),
  };

  // ── layout ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, fontFamily: theme.fontBody }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;700&family=Tangerine:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${theme.pageBg}; transition: background 0.3s ease; }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-6px); } }
        ::-webkit-scrollbar { width: 0; }
        input::placeholder { color: ${theme.textMuted}; }
        .syne { font-family: 'Syne', sans-serif !important; }
        .desktop-sidebar { display: none !important; }
        .mobile-header { display: block !important; }
        .content-area { padding: 20px 16px 36px !important; }
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-header { display: none !important; }
          .content-area { padding: 36px 48px 48px !important; }
        }
        @media (min-width: 1200px) {
          .content-area { padding: 40px 72px 56px !important; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* ── Desktop sidebar ── */}
        <aside className="desktop-sidebar"
          style={{ width: 260, flexShrink: 0, padding: "28px 0", display: "flex", flexDirection: "column", borderRight: `1px solid ${theme.border}`, background: theme.sidebarBg, position: "sticky", top: 0, height: "100vh" }}>
          <div style={{ padding: "0 20px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <button onClick={() => { if (window.confirm("Sign out of BME Portal?")) handleLogout(); }} title="Sign out"
                style={{ display: "flex", alignItems: "center", gap: 11, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
                <div style={{ width: 50, height: 50, borderRadius: 30, margin: "0 auto 14px", overflow: "hidden", flexShrink: 0 }}>
                  <img src="/bme-logo.png" alt="BME Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: theme.textPrimary, margin: 0, fontFamily: theme.fontHeading }}>BME1 Portal</p>
                  <p style={{ fontSize: 11, color: theme.textMuted, margin: 0 }}>KNUST · Semester 2</p>
                </div>
              </button>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "0 12px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1.2, padding: "0 10px", marginBottom: 6 }}>Navigation</p>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 14, border: "none", cursor: "pointer", marginBottom: 3, background: activeTab === tab.id ? theme.navActiveBg : "transparent", color: activeTab === tab.id ? theme.navActiveText : theme.textSecondary, fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 14, fontFamily: theme.fontBody, boxShadow: activeTab === tab.id ? "0 2px 12px rgba(0,0,0,0.07)" : "none", transition: "all 0.15s", textAlign: "left" }}>
                <span style={{ opacity: activeTab === tab.id ? 1 : 0.55, color: activeTab === tab.id ? theme.accent : theme.textMuted }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}

            <div style={{ marginTop: 20, borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1.2, padding: "0 10px", marginBottom: 6 }}>Quick links</p>
              {[
                { label: "CWA Calculator", icon: <Calculator size={15} />, action: () => setShowCWAModal(true), color: theme.textMuted },
                { label: "Survival Kit",   icon: <BookOpen size={15} />,   action: () => setShowSurvivalKit(true), color: theme.textMuted },
                { label: "Updates",        icon: <Bell size={15} />,       action: () => setShowUpdatesHub(true), color: theme.textMuted, badge: announcements.length },
                { label: "Orion Hub",      icon: <Star size={15} />,       action: () => {}, href: "/orion", color: theme.textMuted },
              ].map((item) => (
                item.href ? (
                  <Link key={item.label} href={item.href}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 12, textDecoration: "none", color: theme.textSecondary, fontSize: 13, fontWeight: 500, marginBottom: 2, position: "relative" }}>
                    <span style={{ color: item.color }}>{item.icon}</span>{item.label}
                  </Link>
                ) : (
                  <button key={item.label} onClick={item.action}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 12, border: "none", background: "none", cursor: "pointer", color: theme.textSecondary, fontSize: 13, fontWeight: 500, fontFamily: theme.fontBody, textAlign: "left", marginBottom: 2, position: "relative" }}>
                    <span style={{ color: item.color }}>{item.icon}</span>{item.label}
                    {(item as any).badge > 0 && (
                      <span style={{ marginLeft: "auto", minWidth: 18, height: 18, borderRadius: 9, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{(item as any).badge}</span>
                    )}
                  </button>
                )
              ))}
            </div>
          </nav>

          <div style={{ padding: "16px 20px 20px", borderTop: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, background: theme.cardBg, border: `1px solid ${theme.border}` }}>
              <Avatar name={studentName} size={36} onClick={() => setActiveTab("profile")} photoUrl={avatarUrl} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getFirstName(studentName)}</p>
                <p style={{ fontSize: 10, color: theme.textMuted, margin: 0, fontStyle: "italic" }}>{studentID}</p>
              </div>
              <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8 }} title="Sign out">
                <LogOut size={15} color={theme.textMuted} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {/* Mobile top header */}
          <div className="mobile-header" style={{ position: "sticky", top: 0, zIndex: 50, background: theme.pageBg, borderBottom: `1px solid ${theme.border}`, padding: "0 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: 20, margin: "0 auto 14px", overflow: "hidden" }}>
                  <img src="/bme-logo.png" alt="BME Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: theme.textPrimary, fontFamily: theme.fontHeading }}>BME Portal</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar name={studentName} size={32} onClick={() => setActiveTab("profile")} photoUrl={avatarUrl} />
                <button onClick={() => { if (window.confirm("Sign out of BME Portal?")) handleLogout(); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }} title="Sign out">
                  <LogOut size={16} color="#ef4444" />
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 0 12px", scrollbarWidth: "none" }}>
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, cursor: "pointer", flexShrink: 0, fontSize: 13, fontWeight: 600, fontFamily: theme.fontBody, background: activeTab === tab.id ? theme.accent : theme.pillInactiveBg, color: activeTab === tab.id ? theme.accentText : theme.textSecondary, boxShadow: activeTab === tab.id ? "none" : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s", border: activeTab === tab.id ? "none" : `1px solid ${theme.border}` }}>
                  {React.cloneElement(tab.icon, { size: 14 })}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="content-area" style={{ flex: 1, padding: "24px 20px 40px" }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <OnboardingTutorial
        show={showTutorial}
        studentName={studentName}
        onFinish={() => setShowTutorial(false)}
        onNavigate={(tab) => setActiveTab(tab as any)}
      />

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "16px 0", fontSize: "20px", color: "#a8967a" }}>
        <div className="brand-line">
          <span>Built by</span>{" "}
          <a className="brand" style={{ fontFamily: "Tangerine", color: "#2d2416", fontWeight: 600 }} href="https://github.com/okyereasante08-afk" target="_blank" rel="noopener noreferrer">
            <em>Asante Inc.</em>
          </a>
        </div>
        <div className="copyright-line">© {new Date().getFullYear()} Asante Inc. All rights reserved.</div>
      </div>

      {isLoggedIn && <BMEChatbot studentName={studentName} studentID={studentID} />}

      <AnimatePresence>
        {showCWAModal    && <CWAModal onClose={() => setShowCWAModal(false)} />}
        {showSurvivalKit && <SurvivalKitModal onClose={() => setShowSurvivalKit(false)} />}
        {showUpdatesHub  && <UpdatesModal announcements={announcements} files={files} onClose={() => setShowUpdatesHub(false)} />}
      </AnimatePresence>
    </div>
  );
}
