// app/components/MobileHeader.tsx
"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import Avatar from "@/app/components/Avatar";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactElement;
}

interface MobileHeaderProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentName: string;
  avatarUrl: string | null;
  handleLogout: () => void;
}

export default function MobileHeader({
  tabs, activeTab, setActiveTab,
  studentName, avatarUrl, handleLogout,
}: MobileHeaderProps) {
  const { theme } = useTheme();

  return (
    <div
      className="mobile-header"
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: theme.pageBg,
        borderBottom: `1px solid ${theme.border}`,
        padding: "0 16px",
      }}
    >
      {/* Top row: logo + actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 20, margin: "0 auto 14px", overflow: "hidden" }}>
            <img src="/bme-logo.png" alt="BME Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: theme.textPrimary, fontFamily: theme.fontHeading }}>
            BME Portal
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name={studentName} size={32} onClick={() => setActiveTab("profile")} photoUrl={avatarUrl} />
          <button
            onClick={() => { if (window.confirm("Sign out of BME Portal?")) handleLogout(); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Sign out"
          >
            <LogOut size={16} color="#ef4444" />
          </button>
        </div>
      </div>

      {/* Tab pills row */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 0 12px", scrollbarWidth: "none" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 20,
              cursor: "pointer", flexShrink: 0,
              fontSize: 13, fontWeight: 600, fontFamily: theme.fontBody,
              background: activeTab === tab.id ? theme.accent : theme.pillInactiveBg,
              color: activeTab === tab.id ? theme.accentText : theme.textSecondary,
              boxShadow: activeTab === tab.id ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
              transition: "all 0.15s",
              border: activeTab === tab.id ? "none" : `1px solid ${theme.border}`,
            }}
          >
            {React.cloneElement(tab.icon, { size: 14 })}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}