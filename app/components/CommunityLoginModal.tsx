"use client";
// components/CommunityLoginModal.tsx
// Opened when someone wants the Community feed and has no active session.
// Sign-in is optional for the rest of the portal. Method: Supabase email + password
// (sign in, sign up, reset).

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff, MessageCircle } from "lucide-react";
import {
  MIN_PASSWORD_LENGTH,
  resendConfirmation,
  sendPasswordReset,
  signInWithEmail,
  signUpWithEmail,
  updatePassword,
} from "../lib/auth";

type View = "signin" | "signup" | "forgot" | "recovery" | "sent";

interface Props {
  yearLevel: number;
  /** True when the user arrived from a password-reset email link. */
  recovery?: boolean;
  onAccountSuccess: () => void;
  onRecoveryComplete: () => void;
  onDismiss: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN = 30;

const COPY: Record<View, { title: string; sub: () => string }> = {
  signin: {
    title: "Sign in",
    sub: () => "Use your account to read and post in the community feed.",
  },
  signup: {
    title: "Create an account",
    sub: () => "Your name appears on posts unless you post anonymously.",
  },
  forgot: {
    title: "Reset your password",
    sub: () => "Enter your email and we will send you a link to choose a new password.",
  },
  recovery: {
    title: "Choose a new password",
    sub: () => "Enter a new password for your account.",
  },
  sent: { title: "Check your email", sub: () => "" },
};

export function CommunityLoginModal({
  yearLevel,
  recovery = false,
  onAccountSuccess,
  onRecoveryComplete,
  onDismiss,
}: Props) {
  const [viewState, setView] = useState<View>("signin");
  // Arriving from a password-reset link always shows the "new password" step.
  const view: View = recovery ? "recovery" : viewState;
  const [sentKind, setSentKind] = useState<"signup" | "reset">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const go = (next: View) => {
    setView(next);
    setError(null);
    setPassword("");
    setShowPw(false);
  };

  // Focus the first field of each view.
  useEffect(() => { firstFieldRef.current?.focus(); }, [view]);

  // Resend cooldown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const redirectTo = () => `${window.location.origin}/year/${yearLevel}`;

  /* ── handlers ───────────────────────────────────────────────── */

  const submitSignIn = async () => {
    if (!EMAIL_RE.test(email.trim())) { setError("Enter a valid email address."); return; }
    if (!password) { setError("Enter your password."); return; }
    setLoading(true); setError(null);
    const res = await signInWithEmail(email, password);
    setLoading(false);
    if (!res.ok) { setError(res.message); return; }
    onAccountSuccess();
  };

  const submitSignUp = async () => {
    const name = fullName.trim();
    if (name.length < 2 || name.length > 60) { setError("Enter your name (2 to 60 characters)."); return; }
    if (!EMAIL_RE.test(email.trim())) { setError("Enter a valid email address."); return; }
    if (password.length < MIN_PASSWORD_LENGTH) { setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`); return; }
    setLoading(true); setError(null);
    const res = await signUpWithEmail(email, password, name, redirectTo());
    setLoading(false);
    if (!res.ok) { setError(res.message); return; }
    if (res.needsConfirmation) {
      setSentKind("signup");
      setCooldown(RESEND_COOLDOWN);
      go("sent");
    } else {
      onAccountSuccess();
    }
  };

  const submitForgot = async () => {
    if (!EMAIL_RE.test(email.trim())) { setError("Enter a valid email address."); return; }
    setLoading(true); setError(null);
    const res = await sendPasswordReset(email, redirectTo());
    setLoading(false);
    if (!res.ok) { setError(res.message); return; }
    setSentKind("reset");
    setCooldown(RESEND_COOLDOWN);
    go("sent");
  };

  const submitRecovery = async () => {
    if (password.length < MIN_PASSWORD_LENGTH) { setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`); return; }
    setLoading(true); setError(null);
    const res = await updatePassword(password);
    setLoading(false);
    if (!res.ok) { setError(res.message); return; }
    onRecoveryComplete();
  };

  const resend = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true); setError(null);
    const res = sentKind === "signup"
      ? await resendConfirmation(email, redirectTo())
      : await sendPasswordReset(email, redirectTo());
    setLoading(false);
    if (!res.ok) { setError(res.message); return; }
    setCooldown(RESEND_COOLDOWN);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (view === "signin") void submitSignIn();
    else if (view === "signup") void submitSignUp();
    else if (view === "forgot") void submitForgot();
    else if (view === "recovery") void submitRecovery();
  };

  /* ── view helpers ───────────────────────────────────────────── */

  const submitLabel: Record<Exclude<View, "sent">, string> = {
    signin: "Sign in",
    signup: "Create account",
    forgot: "Send reset link",
    recovery: "Update password",
  };
  const busyLabel: Record<Exclude<View, "sent">, string> = {
    signin: "Signing in…",
    signup: "Creating account…",
    forgot: "Sending…",
    recovery: "Updating…",
  };

  const passwordField = (id: string, label: string, autoComplete: string, hint?: string, focus = false) => (
    <div className="community-modal-field">
      <label className="community-modal-label" htmlFor={id}>{label}</label>
      <div className="community-modal-password">
        <input
          ref={focus ? firstFieldRef : undefined}
          id={id}
          type={showPw ? "text" : "password"}
          className="community-modal-input community-modal-input--plain"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(null); }}
          autoComplete={autoComplete}
          disabled={loading}
        />
        <button
          type="button"
          className="community-modal-reveal"
          onClick={() => setShowPw((v) => !v)}
          aria-label={showPw ? "Hide password" : "Show password"}
          aria-pressed={showPw}
          tabIndex={-1}
        >
          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && <p className="community-modal-hint">{hint}</p>}
    </div>
  );

  const emailField = (focus = false) => (
    <div className="community-modal-field">
      <label className="community-modal-label" htmlFor="community-email">Email</label>
      <input
        ref={focus ? firstFieldRef : undefined}
        id="community-email"
        type="email"
        inputMode="email"
        className="community-modal-input community-modal-input--plain"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(null); }}
        autoComplete="email"
        disabled={loading}
      />
    </div>
  );

  const errorBlock = error && <p className="community-modal-error community-modal-error--gap" role="alert">{error}</p>;

  return (
    <div
      className="community-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onDismiss(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Community sign in"
    >
      <div className="community-modal">

        <div className="community-modal-header">
          <div className="community-modal-icon" aria-hidden="true"><MessageCircle size={26} /></div>
          <h2 className="community-modal-title">{COPY[view].title}</h2>
          {view !== "sent" && <p className="community-modal-sub">{COPY[view].sub()}</p>}
        </div>

        {/* ── sent: confirmation / reset email ── */}
        {view === "sent" ? (
          <>
            <p className="community-modal-notice" role="status">
              {sentKind === "signup"
                ? <>We sent a confirmation link to <strong>{email.trim()}</strong>. Open it to activate your account, then sign in.</>
                : <>If an account exists for <strong>{email.trim()}</strong>, a password reset link is on its way.</>}
            </p>
            {errorBlock}
            <div className="community-modal-actions">
              <button type="button" className="btn community-modal-btn" onClick={resend} disabled={cooldown > 0 || loading}>
                {cooldown > 0 ? `Resend email (${cooldown}s)` : "Resend email"}
              </button>
              <button type="button" className="btn btn-primary community-modal-btn" onClick={() => go("signin")}>
                Back to sign in
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {view === "signup" && (
              <div className="community-modal-field">
                <label className="community-modal-label" htmlFor="community-name">Display name</label>
                <input
                  ref={firstFieldRef}
                  id="community-name"
                  type="text"
                  className="community-modal-input community-modal-input--plain"
                  placeholder="e.g. Ama Mensah"
                  value={fullName}
                  maxLength={60}
                  onChange={(e) => { setFullName(e.target.value); setError(null); }}
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
            )}

            {(view === "signin" || view === "forgot") && emailField(true)}
            {view === "signup" && emailField()}

            {view === "signin" && passwordField("community-password", "Password", "current-password")}
            {view === "signup" && passwordField("community-password", "Password", "new-password", `At least ${MIN_PASSWORD_LENGTH} characters.`)}
            {view === "recovery" && passwordField("community-new-password", "New password", "new-password", `At least ${MIN_PASSWORD_LENGTH} characters.`, true)}

            {errorBlock}

            <div className="community-modal-actions">
              <button
                type="submit"
                className="btn btn-primary community-modal-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="community-modal-loading">
                    <span className="spinner" />
                    {busyLabel[view]}
                  </span>
                ) : submitLabel[view]}
              </button>
            </div>

            {/* secondary links */}
            {view === "signin" && (
              <div className="community-modal-links">
                <button type="button" className="community-modal-link" onClick={() => go("forgot")} disabled={loading}>Forgot password?</button>
                <button type="button" className="community-modal-link" onClick={() => go("signup")} disabled={loading}>Create an account</button>
              </div>
            )}
            {view === "signup" && (
              <div className="community-modal-links community-modal-links--center">
                <button type="button" className="community-modal-link" onClick={() => go("signin")} disabled={loading}>Already have an account? Sign in</button>
              </div>
            )}
            {view === "forgot" && (
              <div className="community-modal-links community-modal-links--center">
                <button type="button" className="community-modal-link" onClick={() => go("signin")} disabled={loading}>Back to sign in</button>
              </div>
            )}
          </form>
        )}

        {view !== "sent" && (
          <div className="community-modal-actions" style={{ marginBottom: 14 }}>
            <button type="button" className="community-modal-cancel" onClick={onDismiss} disabled={loading}>
              {view === "recovery" ? "Skip for now" : "Maybe later"}
            </button>
          </div>
        )}
        {view === "sent" && (
          <button type="button" className="community-modal-cancel" onClick={onDismiss} style={{ marginBottom: 14 }}>
            Close
          </button>
        )}

        <p className="community-modal-privacy">
          Signing in is optional; the rest of the portal works without it. Your email is used only for sign-in and is never shown to other students.
        </p>
      </div>
    </div>
  );
}
