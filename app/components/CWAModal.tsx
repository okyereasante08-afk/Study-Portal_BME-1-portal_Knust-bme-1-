// app/components/CWAModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { COURSE_CREDITS } from "@/lib/data";

export default function CWAModal({ onClose }: { onClose: () => void }) {
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [cwa, setCwa] = useState<number | null>(null);

  const calculate = () => {
    let ws = 0, tc = 0;
    COURSE_CREDITS.forEach((c) => {
      const m = parseFloat(marks[c.code] || "0");
      if (m > 0) { ws += m * c.credits; tc += c.credits; }
    });
    setCwa(tc > 0 ? parseFloat((ws / tc).toFixed(2)) : null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 400, overflow: "hidden" }}>
        <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0ebe3" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1208", margin: 0 }}>CWA Calculator</h2>
            <p style={{ fontSize: 12, color: "#a8967a", margin: "2px 0 0" }}>Enter scores to project your CWA</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid #ece8e0", background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="#8b7355" />
          </button>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, maxHeight: "45vh", overflowY: "auto" }}>
          {COURSE_CREDITS.map((c) => (
            <div key={c.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: "#faf8f4", border: "1px solid #f0ebe3" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#1a1208", margin: 0, fontFamily: "'Syne', sans-serif" }}>{c.code}</p>
                <p style={{ fontSize: 11, color: "#a8967a", margin: "1px 0 0", fontStyle: "italic" }}>{c.name} · {c.credits} cr</p>
              </div>
              <input type="number" placeholder="—" min={0} max={100}
                onChange={(e) => { const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0)); setMarks({ ...marks, [c.code]: v.toString() }); e.target.value = v.toString(); }}
                style={{ width: 56, padding: "6px 8px", borderRadius: 10, border: "1px solid #ece8e0", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#3d2e1a", outline: "none", background: "#fff" }} />
            </div>
          ))}
        </div>
        {cwa !== null && (
          <div style={{ margin: "0 16px", padding: "14px 18px", borderRadius: 14, background: "#faf8f4", border: "1px solid #ece8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#8b7355", fontWeight: 700, fontStyle: "italic" }}>Projected CWA</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: cwa >= 70 ? "#22c55e" : cwa >= 60 ? "#f59e0b" : "#ef4444" }}>{cwa}</span>
          </div>
        )}
        <div style={{ padding: "14px 16px 20px" }}>
          <button onClick={calculate}
            style={{ width: "100%", padding: "13px", borderRadius: 14, border: "none", background: "#2d2416", color: "#f0ebe3", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Calculate
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
