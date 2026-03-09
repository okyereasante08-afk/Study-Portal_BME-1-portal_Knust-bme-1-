"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, MessageCircle, BookOpen, Calendar, LogOut, Activity,
  Download, Upload, Bell, CheckCircle, FileText, Settings, User, Palette, Plus, X, Star, Medal, Award, ThumbsUp, MessageSquare,
  Folder, List, Layout, Users
} from "lucide-react";

// --- IMPORT UPDATES (Check these filenames in your folder!) ---
import { THEMES, CLASS_LIST, TIMETABLE, COURSE_CREDITS, ADMIN_IDS, ACHIEVEMENTS, RESOURCES } from "@/lib/lib/lib/constants";
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

// --- ERROR BOUNDARY WRAPPER ---
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
    // Log to error tracking service here (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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

function HomePage() {
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

  // --- SAFE LOCALSTORAGE HELPERS ---
  const safeGetItem = (key: string, fallback: string = ''): string => {
    try {
      if (typeof window === 'undefined') return fallback;
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return fallback;
    }
  };

  const safeSetItem = (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
      return false;
    }
  };

  const safeParseJSON = <T,>(str: string, fallback: T): T => {
    try {
      return JSON.parse(str) as T;
    } catch (error) {
      console.error('JSON parse error:', error);
      return fallback;
    }
  };

  useEffect(() => {
    try {
      setMounted(true);
      
      if (typeof window !== 'undefined') {
        // Restore session
        const savedID = safeGetItem('bme-session-id');
        if (savedID && CLASS_LIST[savedID]) {
          restoreSession(savedID);
        }
        
        // Restore theme
        const savedThemeId = safeGetItem('bme-theme');
        if (savedThemeId && THEMES[savedThemeId]) {
          setCurrentTheme(THEMES[savedThemeId]);
        }
        
        // Check notifications
        if ("Notification" in window && Notification.permission === "granted") {
          setNotificationsEnabled(true);
        }
        
        // Restore feedback
        const savedFeedback = safeGetItem('bme-feedback');
        if (savedFeedback) {
          setFeedbackList(safeParseJSON(savedFeedback, []));
        }
      }
      
      // Calculate days to mid-sem
      const midSemDate = new Date('2026-02-23T00:00:00');
      const today = new Date();
      const diffTime = midSemDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysToMidSem(diffDays);
      
    } catch (error) {
      console.error('Initialization error:', error);
      // Continue with defaults
    }
  }, []);

  const restoreSession = (id: string) => {
    try {
      setStudentID(id);
      setStudentName(CLASS_LIST[id] || 'Unknown Student');
      setIsLoggedIn(true);
      setIsAdmin(ADMIN_IDS.includes(id));
      
      // Restore attendance
      const savedAtt = safeGetItem('bme-attendance');
      if (savedAtt) {
        setAttendance(safeParseJSON(savedAtt, {}));
      }
      
      // Restore marked attendance
      const savedMarked = safeGetItem(`bme-marked-${id}`);
      if (savedMarked) {
        setAttendanceMarked(safeParseJSON(savedMarked, {}));
      }
      
      // Restore notes
      const savedNotes = safeGetItem('bme-notes');
      if (savedNotes) setNotes(savedNotes);
      
      // Restore avatar
      const savedAvatar = safeGetItem(`bme-avatar-${id}`);
      if (savedAvatar) setAvatar(savedAvatar);

      // Restore CWA usage
      const savedCwaUsage = parseInt(safeGetItem(`bme-cwa-usage-${id}`, '0'));
      setCwaUsageCount(isNaN(savedCwaUsage) ? 0 : savedCwaUsage);

      // Restore achievements
      const savedAchievements = safeGetItem(`bme-achievements-${id}`, '[]');
      setUnlockedAchievements(safeParseJSON(savedAchievements, []));

      // Restore streak
      const storedStreak = parseInt(safeGetItem('bme-streak', '0'));
      setStreak(isNaN(storedStreak) ? 0 : storedStreak);
      
    } catch (error) {
      console.error('Session restoration error:', error);
      setLoginError('Error restoring session. Please try logging in again.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      // Admin login
      if (loginMode === 'admin') {
        if (adminAccessCode === 'ASANT3&GOD') {
          proceedToLogin('22028883', true);
        } else {
          setLoginError('Invalid admin access code.');
        }
        return;
      }
      
      // Validate student ID
      if (!studentID || !studentID.trim()) {
        setLoginError('Please enter a Student ID.');
        return;
      }
      
      if (!CLASS_LIST[studentID]) {
        setLoginError('Invalid Student ID.');
        return;
      }
      
      // Check stored password
      const stored = safeGetItem(`pw-${studentID}`);
      
      if (!stored) {
        // First time login - set password
        if (!isFirstLogin) {
          setIsFirstLogin(true);
          return;
        }
        
        if (!password || password.length < 4) {
          setLoginError('Password must be at least 4 characters.');
          return;
        }
        
        safeSetItem(`pw-${studentID}`, password);
        proceedToLogin(studentID);
      } else {
        // Verify password
        if (password === stored) {
          proceedToLogin(studentID);
        } else {
          setLoginError('Incorrect password.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again.');
    }
  };

  const proceedToLogin = (id: string, adminOverride = false) => {
    try {
      setStudentName(CLASS_LIST[id] || 'Unknown Student');
      setStudentID(id);
      setIsLoggedIn(true);
      setIsAdmin(adminOverride || ADMIN_IDS.includes(id));
      safeSetItem('bme-session-id', id);
      restoreSession(id);
    } catch (error) {
      console.error('Login completion error:', error);
      setLoginError('Failed to complete login. Please try again.');
    }
  };

  const handleLogout = () => {
    try {
      // Save current state before logout
      if (studentID) {
        safeSetItem('bme-notes', notes);
        safeSetItem('bme-attendance', JSON.stringify(attendance));
        safeSetItem(`bme-marked-${studentID}`, JSON.stringify(attendanceMarked));
        safeSetItem(`bme-cwa-usage-${studentID}`, cwaUsageCount.toString());
        safeSetItem(`bme-achievements-${studentID}`, JSON.stringify(unlockedAchievements));
      }
      
      // Clear session
      localStorage.removeItem('bme-session-id');
      
      // Reset state
      setIsLoggedIn(false);
      setStudentID('');
      setPassword('');
      setStudentName('');
      setIsAdmin(false);
      setIsFirstLogin(false);
      setLoginError('');
      setActiveTab('dashboard');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout anyway
      setIsLoggedIn(false);
      window.location.reload();
    }
  };

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <BioBackground theme={currentTheme} />
      
      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h1 className="text-4xl font-bold text-white mb-2 text-center">BME Portal</h1>
              <p className="text-white/60 text-center mb-8">Welcome back!</p>
              
              {loginError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {loginError}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2 text-sm">
                    {loginMode === 'admin' ? 'Admin Access' : 'Student ID'}
                  </label>
                  {loginMode === 'student' ? (
                    <input
                      type="text"
                      value={studentID}
                      onChange={(e) => setStudentID(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your student ID"
                      required
                    />
                  ) : (
                    <input
                      type="password"
                      value={adminAccessCode}
                      onChange={(e) => setAdminAccessCode(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter admin code"
                      required
                    />
                  )}
                </div>
                
                {loginMode === 'student' && (
                  <div>
                    <label className="block text-white/80 mb-2 text-sm">
                      {isFirstLogin ? 'Set Password' : 'Password'}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={isFirstLogin ? 'Create a password (min 4 chars)' : 'Enter your password'}
                      required
                    />
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition"
                >
                  {isFirstLogin ? 'Create Account' : 'Login'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode(loginMode === 'student' ? 'admin' : 'student');
                    setLoginError('');
                  }}
                  className="w-full text-white/60 text-sm hover:text-white/80 transition"
                >
                  {loginMode === 'student' ? 'Admin Access' : 'Student Login'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="min-h-screen p-4">
          {/* Your dashboard content here */}
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white">Welcome, {studentName}!</h2>
                  <p className="text-white/60">Student ID: {studentID}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl transition flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
              
              {/* Add your dashboard widgets and content here */}
              <p className="text-white/80">Dashboard content goes here...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export with Error Boundary wrapper
export default function Home() {
  return (
    <ErrorBoundary>
      <HomePage />
    </ErrorBoundary>
  );
}
