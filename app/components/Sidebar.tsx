// app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { Calculator, BookOpen, Bell, LogOut, Star } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import Avatar from "@/app/components/Avatar";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactElement;
}

interface SidebarProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentName: string;
  studentID: string;
  avatarUrl: string | null;
  announcementsCount: number;
  handleLogout: () => void;
  getFirstName: (name: string) => string;
  onShowCWA: () => void;
  onShowSurvivalKit: () => void;
  onShowUpdates: () => void;
}

export default function Sidebar({
  tabs, activeTab, setActiveTab,
  studentName, studentID, avatarUrl,
  announcementsCount, handleLogout, getFirstName,
  onShowCWA, onShowSurvivalKit, onShowUpdates,
}: SidebarProps) {
  const { theme } = useTheme();

  const quickLinks = [
    { label: "CWA Calculator", icon: <Calculator size={15} />, action: onShowCWA },
    { label: "Survival Kit", icon: <BookOpen size={15} />, action: onShowSurvivalKit },
    { label: "Updates", icon: <Bell size={15} />, action: onShowUpdates, badge: announcementsCount },
    { label: "Orion Hub", icon: <Star size={15} />, href: "/orion" },
  ];

  return (
    <aside
      className="desktop-sidebar"
      style={{
        width: 260, flexShrink: 0, padding: "28px 0",
        display: "flex", flexDirection: "column",
        borderRight: `1px solid ${theme.border}`,
        background: theme.sidebarBg,
        position: "sticky", top: 0, height: "100vh",
      }}
    >
      {/* Logo / Brand */}
      <div style={{ padding: "0 20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <button
            onClick={() => { if (window.confirm("Sign out of BME Portal?")) handleLogout(); }}
            title="Sign out"
            style={{ display: "flex", alignItems: "center", gap: 11, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
          >
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

      {/* Nav tabs */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1.2, padding: "0 10px", marginBottom: 6 }}>
          Navigation
        </p>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 14, border: "none", cursor: "pointer",
              marginBottom: 3,
              background: activeTab === tab.id ? theme.navActiveBg : "transparent",
              color: activeTab === tab.id ? theme.navActiveText : theme.textSecondary,
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: 14, fontFamily: theme.fontBody,
              boxShadow: activeTab === tab.id ? "0 2px 12px rgba(0,0,0,0.07)" : "none",
              transition: "all 0.15s", textAlign: "left",
            }}>
            <span style={{ opacity: activeTab === tab.id ? 1 : 0.55, color: activeTab === tab.id ? theme.accent : theme.textMuted }}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}

        {/* Quick links */}
        <div style={{ marginTop: 20, borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1.2, padding: "0 10px", marginBottom: 6 }}>
            Quick links
          </p>
          {quickLinks.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 12, textDecoration: "none", color: theme.textSecondary, fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
                <span style={{ color: theme.textMuted }}>{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <button key={item.label} onClick={item.action}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 12, border: "none", background: "none", cursor: "pointer", color: theme.textSecondary, fontSize: 13, fontWeight: 500, fontFamily: theme.fontBody, textAlign: "left", marginBottom: 2, position: "relative" }}>
                <span style={{ color: theme.textMuted }}>{item.icon}</span>
                {item.label}
                {item.badge && item.badge > 0 ? (
                  <span style={{ marginLeft: "auto", minWidth: 18, height: 18, borderRadius: 9, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            )
          )}
        </div>
      </nav>

      {/* User card at bottom */}
      <div style={{ padding: "16px 20px 20px", borderTop: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, background: theme.cardBg, border: `1px solid ${theme.border}` }}>
          <Avatar name={studentName} size={36} onClick={() => setActiveTab("profile")} photoUrl={avatarUrl} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: theme.textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {getFirstName(studentName)}
            </p>
            <p style={{ fontSize: 10, color: theme.textMuted, margin: 0, fontStyle: "italic" }}>{studentID}</p>
          </div>
          <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8 }} title="Sign out">
            <LogOut size={15} color={theme.textMuted} />
          </button>
        </div>
      </div>
    </aside>
  );
}