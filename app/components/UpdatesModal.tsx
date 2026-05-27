// app/components/UpdatesModal.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  announcements: any[];
  files: any[];
  onClose: () => void;
}

export default function UpdatesModal({ announcements, files, onClose }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 560, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0ebe3" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1208", margin: 0 }}>Updates</h2>
            <p style={{ fontSize: 12, color: "#a8967a", margin: "2px 0 0" }}>Announcements & shared files</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid #ece8e0", background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="#8b7355" />
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "14px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#a8967a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Announcements</p>
          {announcements.length === 0 ? (
            <p style={{ fontSize: 13, color: "#c9b89a", textAlign: "center", padding: "24px 0" }}>No announcements yet.</p>
          ) : announcements.map((a: any) => (
            <div key={a.id} style={{ padding: "12px 14px", borderRadius: 12, borderLeft: `3px solid ${a.type === "urgent" ? "#ef4444" : "#3b82f6"}`, background: a.type === "urgent" ? "#fef2f2" : "#eff6ff", marginBottom: 8 }}>
              <p style={{ fontSize: 13, color: "#1a1208", margin: "0 0 3px" }}>{a.text}</p>
              <p style={{ fontSize: 10, color: "#a8967a", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>{a.date}</p>
            </div>
          ))}
          {files.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#a8967a", textTransform: "uppercase", letterSpacing: 1, margin: "16px 0 8px" }}>Shared Files</p>
              {files.map((f: any) => (
                <div key={f.id} style={{ padding: "12px 14px", borderRadius: 12, background: "#faf8f4", border: "1px solid #ece8e0", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1208", margin: 0 }}>{f.course}</p>
                  <a href={f.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, fontWeight: 600, color: "#8b7355", padding: "5px 12px", borderRadius: 8, background: "#f0ebe3", textDecoration: "none" }}>Open</a>
                </div>
              ))}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
