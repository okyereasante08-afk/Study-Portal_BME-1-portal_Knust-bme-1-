// app/components/BMEChatbot.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X } from "lucide-react";

interface Props {
  studentName: string;
  studentID: string;
}

export default function BMEChatbot({ studentName, studentID }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: `Hey ${studentName.split(" ")[0]} 👋 I'm your BME assistant. I know your timetable and can help with CWA calculations. What do you need?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [pos, setPos] = useState({ x: 24, y: 24 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: offset.current.x - e.clientX, y: offset.current.y - e.clientY });
    };
    const onMouseUp = () => { dragging.current = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const t = e.touches[0];
      setPos({ x: offset.current.x - t.clientX, y: offset.current.y - t.clientY });
    };
    const onTouchEnd = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMsg }].map((m) => ({ role: m.role, content: m.content })),
          studentName,
          studentID,
        }),
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "Something went wrong." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Could not reach the server. Check your connection." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <div style={{ position: "fixed", bottom: pos.y, right: pos.x, zIndex: 70 }}>
        <button
          onMouseDown={(e) => { dragging.current = true; offset.current = { x: e.clientX + pos.x, y: e.clientY + pos.y }; (e.currentTarget as HTMLButtonElement).dataset.startX = String(e.clientX); (e.currentTarget as HTMLButtonElement).dataset.startY = String(e.clientY); }}
          onClick={(e) => { const dx = e.clientX - Number((e.currentTarget as HTMLButtonElement).dataset.startX); const dy = e.clientY - Number((e.currentTarget as HTMLButtonElement).dataset.startY); if (Math.abs(dx) < 5 && Math.abs(dy) < 5) setOpen((o) => !o); }}
          data-chatbot-toggle="true"
          style={{ width: 52, height: 52, borderRadius: 26, border: "none", cursor: "grab", display: "flex", alignItems: "center", justifyContent: "center", background: open ? "#f0ebe3" : "#2d2416", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "all 0.2s" }}
        >
          {open ? <X size={18} color="#8b7355" /> : <MessageSquare size={20} color="#f0ebe3" />}
        </button>
        {!open && (
          <span style={{ position: "absolute", top: -4, right: -4, background: "#f59e0b", color: "#fff", fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 10, letterSpacing: 0.5 }}>BETA</span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ position: "fixed", bottom: 152, right: 12, zIndex: 70, width: "min(370px, calc(100vw - 24px))", borderRadius: 20, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden", border: "1px solid #ece8e0" }}
          >
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0ebe3", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare size={14} color="#8b7355" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1208", margin: 0 }}>BME Assistant</p>
                <p style={{ fontSize: 10, color: "#a8967a", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>Powered by Groq · Beta</p>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: "#22c55e" }} />
                <span style={{ fontSize: 10, color: "#22c55e" }}>Online</span>
              </div>
            </div>

            <div style={{ height: 260, overflowY: "auto", padding: "14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: 13, lineHeight: 1.5, background: msg.role === "user" ? "#2d2416" : "#f7f3ed", color: msg.role === "user" ? "#f0ebe3" : "#3d2e1a" }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ background: "#f7f3ed", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 4 }}>
                    {[0, 150, 300].map((d) => (
                      <div key={d} style={{ width: 7, height: 7, borderRadius: 3.5, background: "#c9a87c", animation: "bounce 1.2s infinite", animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Today's timetable", "Calculate CWA", "What's next?"].map((s) => (
                  <button key={s} onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
                    style={{ fontSize: 11, padding: "5px 10px", borderRadius: 12, border: "1px solid #ece8e0", background: "#faf8f4", color: "#6b5438", cursor: "pointer", fontWeight: 500 }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div style={{ padding: "10px 14px", borderTop: "1px solid #f0ebe3", display: "flex", gap: 8 }}>
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything…"
                style={{ flex: 1, padding: "9px 12px", borderRadius: 12, border: "1px solid #ece8e0", background: "#faf8f4", fontSize: 13, outline: "none", color: "#1a1208" }} />
              <button onClick={sendMessage} disabled={!input.trim() || loading}
                style={{ width: 38, height: 38, borderRadius: 12, border: "none", background: "#2d2416", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: !input.trim() || loading ? 0.4 : 1 }}>
                <Send size={15} color="#f0ebe3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
