"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, X } from "lucide-react";
import { EASE } from "../lib/motion";
import type { YearConfig } from "../lib/types";

type Msg = { role: "user" | "assistant"; content: string };

export function Chatbot({ year, name }: { year: YearConfig; name: string }) {
  const first = name.trim().split(" ")[0];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const intro: Msg = { role: "assistant", content: `Hi${first ? ` ${first}` : ""} 👋 I'm the BME assistant for ${year.title}. Ask me about your timetable, courses or CWA.` };
  const all = [intro, ...msgs];

  useEffect(() => { if (open) endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open, loading]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs(next); setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: year.level, name: first, messages: next.slice(-10) }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply || "Something went wrong. Try again." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "I couldn't reach the server. Check your connection and try again." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <motion.button onClick={() => setOpen((o) => !o)} aria-label={open ? "Close assistant" : "Open assistant"} aria-expanded={open} data-chatbot-toggle
        className="chat-fab chat-anchor" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
        initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 140, damping: 14, delay: 1.2 }}
        style={{ zIndex: 60, borderRadius: 26, border: "none", background: "var(--accent)", color: "var(--accent-fg)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-pop)" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? "x" : "m"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }} style={{ display: "flex" }}>
            {open ? <X size={20} /> : <MessageSquare size={20} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
      {open && (
        <motion.div className="card chat-panel" role="dialog" aria-label="BME assistant"
          initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.95 }} transition={{ duration: 0.6, ease: EASE }}
          style={{ position: "fixed", right: 12, zIndex: 60, width: "min(380px, calc(100vw - 24px))", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "var(--shadow-pop)", transformOrigin: "bottom right" }}>
          <div className="flex items-center gap-3" style={{ padding: "14px 16px", borderBottom: "var(--border-w) solid var(--line)" }}>
            <span className="avatar" style={{ width: 32, height: 32, background: "var(--soft-2)", color: "var(--ink)" }}><MessageSquare size={14} /></span>
            <div><p className="h-title" style={{ fontSize: 14, margin: 0 }}>BME assistant</p>
              <p className="eyebrow" style={{ fontSize: 9 }}>{year.title} · beta</p></div>
          </div>
          <div style={{ height: 280, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {all.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "84%", padding: "9px 13px", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? "var(--accent)" : "var(--soft-2)", color: m.role === "user" ? "var(--accent-fg)" : "var(--ink)" }}>{m.content}</div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-1" style={{ padding: "8px 12px", background: "var(--soft-2)", borderRadius: 14, alignSelf: "flex-start" }}>
                {[0, 150, 300].map((d) => <span key={d} style={{ width: 6, height: 6, borderRadius: 3, background: "var(--muted)", animation: "bounce-dot 1.2s infinite", animationDelay: `${d}ms` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>
          {msgs.length === 0 && (
            <div className="flex gap-2 flex-wrap" style={{ padding: "0 14px 10px" }}>
              {["What's my timetable today?", "How is CWA calculated?"].map((s) => <button key={s} className="chip" onClick={() => send(s)} style={{ border: "none" }}>{s}</button>)}
            </div>
          )}
          <form className="flex gap-2" style={{ padding: "10px 14px", borderTop: "var(--border-w) solid var(--line)" }} onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input className="input" style={{ padding: "9px 12px", fontSize: 13 }} placeholder="Ask anything…" value={input} maxLength={500} onChange={(e) => setInput(e.target.value)} aria-label="Message" />
            <button className="btn btn-primary" type="submit" disabled={!input.trim() || loading} aria-label="Send" style={{ padding: "0 14px" }}><Send size={14} /></button>
          </form>
        </motion.div>
      )}
      </AnimatePresence>
      <style>{`.chat-panel{bottom:calc(146px + env(safe-area-inset-bottom))}@media(min-width:900px){.chat-panel{bottom:88px;right:24px !important}}`}</style>
    </>
  );
}
