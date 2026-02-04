"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, MessageCircle, BookOpen, Calendar, LogOut, Activity,
  Download, Upload, Bell, CheckCircle, FileText, Settings, User, Palette, Plus, X, Star, Medal, Award, ThumbsUp, MessageSquare,
  Folder, List, Layout, Users
} from "lucide-react";

// --- IMPORT UPDATES (Check these filenames in your folder!) ---
import { THEMES, CLASS_LIST, TIMETABLE, COURSE_CREDITS, ADMIN_IDS, ACHIEVEMENTS, RESOURCES } from "@/lib/constants";
import { Theme, FeedbackItem } from "@/lib/types";
import { 
  GlassCard, 
  StreakWidget, 
  SmartReminder, 
  Leaderboard, 
  AnalyticsDashboard, 
  ResourcesList, 
  DailyInspiration, 
  FeedbackBoard 
} from "@/components/UltraWidgets";

// --- Background Component ---
const BioBackground = ({ theme }: { theme: Theme }) => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0f1c]">
    <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient} transition-colors duration-1000`} />
    <motion.div 
      animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
      style={{ backgroundColor: theme.orb1 }}
    />
    <motion.div 
      animate={{ x: [0, -100, 0], y: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
      style={{ backgroundColor: theme.orb2 }}
    />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
  </div>
);

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES.ocean);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'leaderboard' | 'community'>('dashboard');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  // Data States
  const [attendance, setAttendance] = useState<{ [key: string]: number }>({});
  const [attendanceMarked, setAttendanceMarked] = useState<{ [key: string]: string }>({}); 
  const [notes, setNotes] = useState('');
  const [daysToMidSem, setDaysToMidSem] = useState(0);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [streak, setStreak] = useState(0);
  
  // Modals
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [showUpdatesHub, setShowUpdatesHub] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [showWeeklyTimetable, setShowWeeklyTimetable] = useState(false);
  
  // Feedback Form State
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'issue' | 'feature'>('suggestion');

  // CWA Logic
  const [marks, setMarks] = useState<{ [key: string]: string }>({});
  const [calculatedCWA, setCalculatedCWA] = useState<number | null>(null);
  const [cwaUsageCount, setCwaUsageCount] = useState(0);

  const [loginMode, setLoginMode] = useState<'student' | 'admin'>('student');
  const [adminAccessCode, setAdminAccessCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedID = localStorage.getItem('bme-session-id');
      if (savedID && CLASS_LIST[savedID]) {
        restoreSession(savedID);
      }
      const savedThemeId = localStorage.getItem('bme-theme');
      if (savedThemeId && THEMES[savedThemeId]) {
        setCurrentTheme(THEMES[savedThemeId]);
      }
      if ("Notification" in window && Notification.permission === "granted") {
        setNotificationsEnabled(true);
      }
      const savedFeedback = localStorage.getItem('bme-feedback');
      if (savedFeedback) setFeedbackList(JSON.parse(savedFeedback));
    }
    const midSemDate = new Date('2026-02-23T00:00:00');
    setDaysToMidSem(Math.ceil((midSemDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  }, []);

  const restoreSession = (id: string) => {
    setStudentID(id);
    setStudentName(CLASS_LIST[id]);
    setIsLoggedIn(true);
    setIsAdmin(ADMIN_IDS.includes(id));
    
    const savedAtt = localStorage.getItem('bme-attendance');
    if (savedAtt) setAttendance(JSON.parse(savedAtt));
    
    const savedMarked = localStorage.getItem(`bme-marked-${id}`);
    if (savedMarked) {
        try {
            const parsed = JSON.parse(savedMarked);
            setAttendanceMarked(parsed);
        } catch {
            setAttendanceMarked({});
        }
    }
    
    const savedNotes = localStorage.getItem('bme-notes');
    if (savedNotes) setNotes(savedNotes);
    
    const savedAvatar = localStorage.getItem(`bme-avatar-${id}`);
    if (savedAvatar) setAvatar(savedAvatar);

    const savedCwaUsage = parseInt(localStorage.getItem(`bme-cwa-usage-${id}`) || '0');
    setCwaUsageCount(savedCwaUsage);

    const savedAchievements = JSON.parse(localStorage.getItem(`bme-achievements-${id}`) || '[]');
    setUnlockedAchievements(savedAchievements);

    const storedStreak = parseInt(localStorage.getItem('bme-streak') || '0');
    setStreak(storedStreak);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMode === 'admin') {
      if (adminAccessCode === 'ASANT3&GOD') {
        proceedToLogin('22028883', true);
      } else {
        setLoginError('Invalid admin access code.');
      }
      return;
    }
    if (!CLASS_LIST[studentID]) {
      setLoginError('Invalid Student ID.');
      return;
    }
    
    const stored = localStorage.getItem(`pw-${studentID}`);
    if (!stored) {
      if (!isFirstLogin) setIsFirstLogin(true);
      else if (password.length < 4) setLoginError('Password too short.');
      else {
        localStorage.setItem(`pw-${studentID}`, password);
        proceedToLogin(studentID);
      }
    } else {
      if (password === stored) proceedToLogin(studentID);
      else setLoginError('Incorrect password.');
    }
  };

  const proceedToLogin = (id: string, adminOverride = false) => {
    setStudentName(CLASS_LIST[id]);
    setStudentID(id);
    setIsLoggedIn(true);
    setIsAdmin(adminOverride || ADMIN_IDS.includes(id));
    localStorage.setItem('bme-session-id', id);
    restoreSession(id);
  };

  const handleLogout = () => {
    l
