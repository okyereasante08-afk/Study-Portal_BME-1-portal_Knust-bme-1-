// ============================================================
// YearPortal.tsx — Auth Integration Patch
// These are the EXACT additions to make to your existing
// YearPortal.tsx. Not a full file replacement — just the
// insertions/changes, clearly marked.
// ============================================================

// ── STEP 1: ADD THESE IMPORTS at the top of YearPortal.tsx ──
import { useState, useEffect } from "react";
import { CommunityLoginModal } from "./CommunityLoginModal";
import { CommunityTab }        from "./tabs/CommunityTab";
// (adjust paths to match your folder structure)


// ── STEP 2: ADD THESE STATE VARIABLES inside YearPortal() ───
// Place after your existing useState declarations:

const [studentId,         setStudentId]         = useState<string | null>(null);
const [studentName,       setStudentName]        = useState<string>("BME Student");
const [showLoginModal,    setShowLoginModal]     = useState(false);
const [activeTab,         setActiveTab]          = useState<string>("home");
//     ↑ if you already have activeTab, skip adding it again


// ── STEP 3: ADD THIS useEffect to rehydrate session ─────────
// Place after the state declarations, before any other effects:

useEffect(() => {
  const savedId   = localStorage.getItem("bme-session-id");
  const savedName = localStorage.getItem("bme-name");
  if (savedId)   setStudentId(savedId);
  if (savedName) setStudentName(savedName);
}, []);


// ── STEP 4: ADD THIS HANDLER for login success ───────────────

const handleLoginSuccess = (id: string, name: string) => {
  setStudentId(id);
  setStudentName(name);
  setShowLoginModal(false);
  // Immediately switch to the community tab after login
  setActiveTab("community");
};


// ── STEP 5: ADD THIS HANDLER for logout ─────────────────────
// Wire to a logout button in your header if you want one

const handleLogout = () => {
  localStorage.removeItem("bme-session-id");
  localStorage.removeItem("bme-name");
  setStudentId(null);
  setStudentName("BME Student");
  // Return to home tab
  setActiveTab("home");
};


// ── STEP 6: UPDATE your tab click handler ───────────────────
// Find where you handle tab switching. Wrap the community
// tab case to show the login modal if no session exists.
// Example — replace your existing tab switch logic with this:

const handleTabClick = (tabId: string) => {
  if (tabId === "community" && !studentId) {
    // Gate: show login modal instead of switching
    setShowLoginModal(true);
    return;
  }
  setActiveTab(tabId);
};


// ── STEP 7: UPDATE your tab definitions array ────────────────
// Make sure "community" is in your tabs. Example:

const TABS = [
  { id: "home",      label: "Home",      icon: "🏠" },
  { id: "timetable", label: "Timetable", icon: "📅" },
  { id: "resources", label: "Resources", icon: "📚" },
  { id: "community", label: "Community", icon: "💬" },
  { id: "profile",   label: "Profile",   icon: "👤" },
];
// Use handleTabClick (from Step 6) as the onClick for each tab button.


// ── STEP 8: UPDATE your tab content renderer ─────────────────
// Where you render tab content (switch/if block), add:

{activeTab === "community" && (
  <CommunityTab
    studentId={studentId}
    studentName={studentName}
    yearLevel={year.level}           // your YearConfig.level prop
    onRequestLogin={() => setShowLoginModal(true)}
  />
)}


// ── STEP 9: RENDER the modal at the bottom of your JSX ───────
// Place just before the closing </div> of your root return:

{showLoginModal && (
  <CommunityLoginModal
    yearLevel={year.level}           // your YearConfig.level prop
    onSuccess={handleLoginSuccess}
    onDismiss={() => setShowLoginModal(false)}
  />
)}


// ── STEP 10: OPTIONAL — show logged-in state in header ───────
// Somewhere in your header JSX, add a session indicator:

{studentId ? (
  <div className="header-session">
    <span className="header-session-name">{studentName.split(" ")[0]}</span>
    <button className="header-session-logout" onClick={handleLogout}>
      Sign out
    </button>
  </div>
) : (
  <button
    className="header-session-login btn-primary"
    onClick={() => setShowLoginModal(true)}
  >
    Log in
  </button>
)}
