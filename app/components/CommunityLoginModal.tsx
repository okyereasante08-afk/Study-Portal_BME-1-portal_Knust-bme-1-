"use client";
// components/CommunityLoginModal.tsx
// Shown when user clicks Community tab but has no active session.
// Validates against local roster, writes to localStorage, calls onSuccess.

import { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { lookupStudent, isBetaOpen } from "../lib/roster";

interface Props {
  yearLevel: number;
  onSuccess: (studentId: string, studentName: string) => void;
  onDismiss: () => void;
}

export function CommunityLoginModal({ yearLevel, onSuccess, onDismiss }: Props) {
  const [inputId,  setInputId]  = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal mounts
  useEffect(() => { inputRef.current?.focus(); }, []);

  const betaOpen = isBetaOpen(yearLevel);

  const handleSubmit = async () => {
    const trimmed = inputId.trim();
    if (!trimmed) { setError("Please enter your student ID."); return; }

    setLoading(true);
    setError(null);

    // Small artificial delay so it doesn't feel instant/insecure
    await new Promise(r => setTimeout(r, 400));

    const student = lookupStudent(trimmed, yearLevel);

    if (!student) {
      setError(
        "Student ID not found in the Year " + yearLevel + " beta roster. " +
        "Contact Asante to be added."
      );
      setLoading(false);
      return;
    }

    // ── Write session to localStorage ─────────────────────────
    localStorage.setItem("bme-session-id", student.id);
    localStorage.setItem("bme-name",       student.name);
    localStorage.setItem("bme-year",       String(yearLevel));

    setLoading(false);
    onSuccess(student.id, student.name);
  };

  return (
    // Backdrop
    <div
      className="community-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onDismiss(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Community login"
    >
      <div className="community-modal">

        {/* Header */}
        <div className="community-modal-header">
          <div className="community-modal-icon" aria-hidden="true"><MessageCircle size={26} /></div>
          <h2 className="community-modal-title">Join the Community</h2>
          <p className="community-modal-sub">
            {betaOpen
              ? `Year ${yearLevel} closed beta — enter your student ID to access the feed.`
              : `The Year ${yearLevel} community opens soon. Check back later.`}
          </p>
        </div>

        {betaOpen ? (
          <>
            {/* Input */}
            <div className="community-modal-field">
              <label className="community-modal-label" htmlFor="community-student-id">
                Student ID
              </label>
              <input
                ref={inputRef}
                id="community-student-id"
                type="text"
                inputMode="numeric"
                className="community-modal-input"
                placeholder="e.g. 22028883"
                value={inputId}
                onChange={e => { setInputId(e.target.value); setError(null); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                autoComplete="off"
                disabled={loading}
              />
              {error && (
                <p className="community-modal-error" role="alert">{error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="community-modal-actions">
              <button
                className="btn btn-primary community-modal-btn"
                onClick={handleSubmit}
                disabled={loading || !inputId.trim()}
              >
                {loading ? (
                  <span className="community-modal-loading">
                    <span className="spinner" />
                    Checking…
                  </span>
                ) : "Access Community"}
              </button>
              <button
                className="community-modal-cancel"
                onClick={onDismiss}
                disabled={loading}
              >
                Maybe later
              </button>
            </div>

            {/* Privacy note */}
            <p className="community-modal-privacy">
              Your student ID is only used to verify access and display your name.
              Anonymous posting is available inside the feed.
            </p>
          </>
        ) : (
          <button className="btn btn-primary community-modal-btn" onClick={onDismiss}>
            Got it
          </button>
        )}

      </div>
    </div>
  );
}
