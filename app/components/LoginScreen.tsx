// app/components/LoginScreen.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { CLASS_LIST, PORTAL_VERSION } from "@/lib/data";
import { useTheme } from "@/lib/theme";

interface Props {
  studentID: string;
  setStudentID: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  securityAnswer: string;
  setSecurityAnswer: (v: string) => void;
  showPw: boolean;
  setShowPw: (v: boolean | ((s: boolean) => boolean)) => void;
  isFirstLogin: boolean;
  setIsFirstLogin: (v: boolean) => void;
  firstLoginStep: "password" | "security";
  setFirstLoginStep: (v: "password" | "security") => void;
  loginError: string;
  setLoginError: (v: string) => void;
  loginMode: "student" | "admin";
  setLoginMode: (v: "student" | "admin") => void;
  adminAccessCode: string;
  setAdminAccessCode: (v: string) => void;
  showReset: boolean;
  setShowReset: (v: boolean) => void;
  resetID: string;
  setResetID: (v: string) => void;
  resetAnswer: string;
  setResetAnswer: (v: string) => void;
  resetNewPw: string;
  setResetNewPw: (v: string) => void;
  resetStep: "verify" | "newpw";
  setResetStep: (v: "verify" | "newpw") => void;
  resetError: string;
  setResetError: (v: string) => void;
  resetSuccess: boolean;
  setResetSuccess: (v: boolean) => void;
  handleLogin: (e: any) => void;
  handleReset: () => void;
}

export default function LoginScreen({
  studentID, setStudentID,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  securityAnswer, setSecurityAnswer,
  showPw, setShowPw,
  isFirstLogin, setIsFirstLogin,
  firstLoginStep, setFirstLoginStep,
  loginError, setLoginError,
  loginMode, setLoginMode,
  adminAccessCode, setAdminAccessCode,
  showReset, setShowReset,
  resetID, setResetID,
  resetAnswer, setResetAnswer,
  resetNewPw, setResetNewPw,
  resetStep, setResetStep,
  resetError, setResetError,
  resetSuccess, setResetSuccess,
  handleLogin, handleReset,
}: Props) {
  const { theme } = useTheme();

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: theme.fontBody }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;700&family=Tangerine:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #c9b89a; }
        input:focus { border-color: ${theme.accent} !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, margin: "0 auto 14px", overflow: "hidden" }}>
            <img src="/bme-logo.png" alt="BME Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1208", margin: "0 0 4px", fontFamily: "'Syne', sans-serif" }}>Portal Access</h1>
          <p style={{ fontSize: 13, color: "#a8967a", margin: 0 }}>KNUST BME1 · Semester 2</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: 24, boxShadow: "0 4px 32px rgba(0,0,0,0.06)", border: "1px solid #ece8e0" }}>
          {/* Mode toggle */}
          {!showReset && (
            <div style={{ display: "flex", gap: 6, padding: 4, background: "#f7f3ed", borderRadius: 14, marginBottom: 20 }}>
              {(["student", "admin"] as const).map((m) => (
                <button key={m} onClick={() => { setLoginMode(m); setLoginError(""); setStudentID(""); setPassword(""); setIsFirstLogin(false); }}
                  style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s", background: loginMode === m ? (m === "admin" ? "#ef4444" : "#2d2416") : "transparent", color: loginMode === m ? "#fff" : "#8b7355", textTransform: "capitalize" }}>
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* Reset password flow */}
          {showReset ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <button onClick={() => { setShowReset(false); setResetStep("verify"); setResetError(""); setResetSuccess(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#8b7355", fontSize: 13, padding: 0 }}>← Back</button>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1208", margin: 0 }}>Reset Password</p>
              </div>
              {resetSuccess ? (
                <div style={{ padding: 16, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", textAlign: "center" }}>
                  <p style={{ color: "#16a34a", fontWeight: 700, margin: 0 }}>✓ Password reset successfully!</p>
                </div>
              ) : (
                <>
                  {resetStep === "verify" ? (
                    <>
                      <input type="text" placeholder="Student ID" value={resetID} onChange={(e) => setResetID(e.target.value)}
                        style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                      <input type="text" placeholder="Mother's first name (security answer)" value={resetAnswer} onChange={(e) => setResetAnswer(e.target.value)}
                        style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                    </>
                  ) : (
                    <input type="password" placeholder="New password (min 4 chars)" value={resetNewPw} onChange={(e) => setResetNewPw(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                  )}
                  {resetError && <p style={{ color: "#ef4444", fontSize: 12, margin: 0, textAlign: "center" }}>{resetError}</p>}
                  <button onClick={handleReset}
                    style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: "#2d2416", color: "#f0ebe3", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    {resetStep === "verify" ? "Verify" : "Set New Password"}
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Login form */
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {loginMode === "student" ? (
                <>
                  {/* First-login step indicator */}
                  {isFirstLogin && (
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                      <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#2d2416" }} />
                      <div style={{ flex: 1, height: 3, borderRadius: 2, background: firstLoginStep === "security" ? "#2d2416" : "#ece8e0" }} />
                    </div>
                  )}

                  <input type="text" placeholder="Student ID" value={studentID} disabled={isFirstLogin}
                    onChange={(e) => setStudentID(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208", background: isFirstLogin ? "#f7f3ed" : "#fff" }} />

                  {/* Returning user password field */}
                  {!isFirstLogin && typeof window !== "undefined" && localStorage.getItem(`pw-${studentID}`) && (
                    <div style={{ position: "relative" }}>
                      <input type={showPw ? "text" : "password"} placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)} autoFocus
                        style={{ width: "100%", padding: "12px 48px 12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                      <button type="button" onClick={() => setShowPw((s) => !s)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#8b7355", fontWeight: 600 }}>
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </div>
                  )}

                  {/* First login: set password */}
                  {isFirstLogin && firstLoginStep === "password" && (
                    <>
                      <div style={{ position: "relative" }}>
                        <input type={showPw ? "text" : "password"} placeholder="Create password (min 4 chars)" value={password}
                          onChange={(e) => setPassword(e.target.value)} autoFocus
                          style={{ width: "100%", padding: "12px 48px 12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                        <button type="button" onClick={() => setShowPw((s) => !s)}
                          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#8b7355", fontWeight: 600 }}>
                          {showPw ? "Hide" : "Show"}
                        </button>
                      </div>
                      <div style={{ position: "relative" }}>
                        <input type={showPw ? "text" : "password"} placeholder="Confirm password" value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={{ width: "100%", padding: "12px 36px 12px 14px", borderRadius: 12, border: `1px solid ${confirmPassword && confirmPassword !== password ? "#ef4444" : confirmPassword && confirmPassword === password ? "#22c55e" : "#ece8e0"}`, fontSize: 14, outline: "none", color: "#1a1208" }} />
                        {confirmPassword && (
                          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: confirmPassword === password ? "#22c55e" : "#ef4444" }}>
                            {confirmPassword === password ? "✓" : "✗"}
                          </span>
                        )}
                      </div>
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fef3c7" }}>
                        <p style={{ fontSize: 12, color: "#92400e", margin: 0, textAlign: "center" }}>Remember this password — you cannot log in without it</p>
                      </div>
                    </>
                  )}

                  {/* First login: security question */}
                  {isFirstLogin && firstLoginStep === "security" && (
                    <>
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#075985", margin: "0 0 2px" }}>Security Question</p>
                        <p style={{ fontSize: 12, color: "#0c4a6e", margin: 0 }}>What is your mother's first name?</p>
                      </div>
                      <input type="text" placeholder="Your answer" value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)} autoFocus
                        style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                    </>
                  )}

                  <button type="submit"
                    style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: "#2d2416", color: "#f0ebe3", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                    {!isFirstLogin ? "Continue" : firstLoginStep === "password" ? "Next →" : "Finish Setup"}
                  </button>

                  {isFirstLogin && (
                    <button type="button"
                      onClick={() => { if (firstLoginStep === "security") { setFirstLoginStep("password"); setLoginError(""); } else { setIsFirstLogin(false); setLoginError(""); } }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#a8967a", padding: "4px 0", textAlign: "center" }}>
                      Back
                    </button>
                  )}
                  {!isFirstLogin && (
                    <button type="button" onClick={() => setShowReset(true)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#a8967a", padding: "2px 0", textAlign: "center" }}>
                      Forgot password?
                    </button>
                  )}
                </>
              ) : (
                /* Admin mode */
                <>
                  <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", textAlign: "center" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#991b1b", margin: 0 }}>Restricted Access</p>
                  </div>
                  <input type="password" placeholder="Access Code" value={adminAccessCode}
                    onChange={(e) => setAdminAccessCode(e.target.value)} autoFocus
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #fecaca", fontSize: 14, outline: "none", color: "#1a1208" }} />
                  <button type="submit"
                    style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    Unlock
                  </button>
                </>
              )}

              {loginError && (
                <p style={{ color: "#ef4444", fontSize: 12, margin: 0, textAlign: "center", fontWeight: 600 }}>{loginError}</p>
              )}
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#c9b89a", marginTop: 20 }}>
          KNUST BME1 · Class of 2029 · v{PORTAL_VERSION}
        </p>
      </motion.div>
    </div>
  );
}
