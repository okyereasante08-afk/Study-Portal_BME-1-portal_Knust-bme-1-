// app/components/SurvivalKitModal.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronRight, Play, ExternalLink } from "lucide-react";
import { SURVIVAL_KIT } from "@/lib/data";

export default function SurvivalKitModal({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 560, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0ebe3" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1208", margin: 0 }}>📚 Survival Kit</h2>
            <p style={{ fontSize: 12, color: "#a8967a", margin: "2px 0 0" }}>Curated resources for every course</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid #ece8e0", background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="#8b7355" />
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {SURVIVAL_KIT.map((kit) => (
            <div key={kit.course} style={{ borderRadius: 14, border: "1px solid #ece8e0", overflow: "hidden" }}>
              <button onClick={() => setExpanded(expanded === kit.course ? null : kit.course)}
                style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#faf8f4", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: kit.color, display: "inline-block" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1208" }}>{kit.course}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#a8967a" }}>{kit.resources.length} links</span>
                  <ChevronRight size={14} color="#a8967a" style={{ transform: expanded === kit.course ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </span>
              </button>
              {expanded === kit.course && (
                <div style={{ padding: "8px 16px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {kit.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: "#fff", border: "1px solid #f0ebe3", textDecoration: "none" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#3d2e1a" }}>
                        <Play size={11} color="#ef4444" fill="#ef4444" /> {r.label}
                      </span>
                      <ExternalLink size={11} color="#c9b89a" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
