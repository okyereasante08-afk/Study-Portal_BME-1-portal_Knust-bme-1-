"use client";

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, MessageCircle, BookOpen, Calendar, LogOut, Activity,
  Download, Upload, Bell, CheckCircle, FileText, Settings, User, Palette, Plus, X, Star, Medal, Award, ThumbsUp, MessageSquare,
  Folder, List, Layout, Users
} from "lucide-react";
import { THEMES, CLASS_LIST, TIMETABLE, COURSE_CREDITS, ADMIN_IDS, ACHIEVEMENTS, RESOURCES } from "@/lib/constants";
import { Theme, FeedbackItem } from "@/lib/types";
import { GlassCard, StreakWidget, SmartReminder, Leaderboard, AnalyticsDashboard, ResourcesList, DailyInspiration, FeedbackBoard } from "@/components/UltraWidgets";

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
  // Changed to store date string instead of boolean for daily reset logic
  const [attendanceMarked, setAttendanceMarked] = useState<{ [key: string]: string }>({}); 
  const [notes, setNotes] = useState('');
  const [daysToMidSem, setDaysToMidSem] = useState(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
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
      // Load Feedback
      const savedFeedback = localStorage.getItem('bme-feedback');
      if (savedFeedback) setFeedbackList(JSON.parse(savedFeedback));
    }
    const midSemDate = new Date('2026-02-23T00:00:00');
    setDaysToMidSem(Math.ceil((midSemDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  }, []);

  // Smart Notifications Interval
  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkUpcoming = () => {
      const now = new Date();
      const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()];
      const courses = TIMETABLE[dayName] || [];
      const notifiedKey = `notified-${now.toDateString()}`;
      
      courses.forEach(c => {
        const [startStr] = c.time.split(' - ');
        const [h, m] = startStr.split(':').map(Number);
        const startTime = new Date(now);
        startTime.setHours(h, m, 0);

        const diff = (startTime.getTime() - now.getTime()) / 60000;
        const eventId = `${notifiedKey}-${c.id}`;

        if (diff > 0 && diff <= 30 && !sessionStorage.getItem(eventId)) {
           new Notification("Class Starting Soon!", {
             body: `${c.course} starts in ${Math.floor(diff)} minutes at ${c.venue}`,
             icon: "/favicon.ico" // assuming default favicon
           });
           sessionStorage.setItem(eventId, 'true');
        }
      });
    };

    const interval = setInterval(checkUpcoming, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [notificationsEnabled]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") setNotificationsEnabled(true);
  };

  const restoreSession = (id: string) => {
    setStudentID(id);
    setStudentName(CLASS_LIST[id]);
    setIsLoggedIn(true);
    setIsAdmin(ADMIN_IDS.includes(id));
    
    const savedAtt = localStorage.getItem('bme-attendance');
    if (savedAtt) setAttendance(JSON.parse(savedAtt));
    
    const savedMarked = localStorage.getItem(`bme-marked-${id}`);
    if (savedMarked) {
        // Handle potential backward compatibility if it was boolean
        try {
            const parsed = JSON.parse(savedMarked);
            if (typeof Object.values(parsed)[0] === 'boolean') {
                 setAttendanceMarked({}); // Reset if old format
            } else {
                 setAttendanceMarked(parsed);
            }
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

    // Initial Streak Check
    const storedStreak = parseInt(localStorage.getItem('bme-streak') || '0');
    const lastAttDate = localStorage.getItem('bme-last-attendance');
    
    // Check if streak is broken (more than 1 day gap from TODAY, ignoring if today is not marked yet)
    if (lastAttDate) {
         const today = new Date();
         today.setHours(0,0,0,0);
         const last = new Date(lastAttDate);
         last.setHours(0,0,0,0);
         const diffTime = Math.abs(today.getTime() - last.getTime());
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
         
         // If last marked was yesterday (1 day diff) or today (0 day diff), streak survives.
         // If diff > 1, streak resets to 0 (or 1 if we count previous valid block, but let's reset to 0 to force consistency).
         if (diffDays > 1) {
             setStreak(0);
             localStorage.setItem('bme-streak', '0');
         } else {
             setStreak(storedStreak);
         }
    } else {
        setStreak(0);
    }

    checkAchievements(id, { 
      streak: storedStreak,
      cwaUsage: savedCwaUsage,
      attendanceCount: Object.values(JSON.parse(savedAtt || '{}')).reduce((a: any, b: any) => a + b, 0),
      hasEarlyCheckIn: false 
    }, savedAchievements);
  };

  const checkAchievements = (id: string, data: any, currentUnlocked: string[]) => {
    const newUnlocked = [...currentUnlocked];
    let changed = false;

    ACHIEVEMENTS.forEach(ach => {
      if (!newUnlocked.includes(ach.id) && ach.condition(data)) {
         newUnlocked.push(ach.id);
         changed = true;
         // Show notification for achievement
         if (notificationsEnabled) {
            new Notification("Achievement Unlocked! 🏆", { body: ach.title });
         } else {
            alert(`Achievement Unlocked: ${ach.title}`);
         }
      }
    });

    if (changed) {
      setUnlockedAchievements(newUnlocked);
      localStorage.setItem(`bme-achievements-${id}`, JSON.stringify(newUnlocked));
    }
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
    const adminStatus = adminOverride || ADMIN_IDS.includes(id);
    setIsAdmin(adminStatus);
    
    localStorage.setItem('bme-session-id', id);
    if (adminStatus) localStorage.setItem('bme-admin-access', 'true');
    
    restoreSession(id);
    
    if (notificationsEnabled === false && "Notification" in window && Notification.permission === "default") {
        setTimeout(requestNotificationPermission, 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bme-session-id');
    setIsLoggedIn(false);
    setStudentID('');
    setPassword('');
    setAvatar(null);
  };

  const markAttendance = (id: string) => {
    const today = new Date().toDateString();
    // Only allow marking if not already marked for TODAY
    if (attendanceMarked[id] === today) return;

    const newAtt = { ...attendance, [id]: (attendance[id] || 0) + 1 };
    const newMarked = { ...attendanceMarked, [id]: today }; 
    
    setAttendance(newAtt);
    setAttendanceMarked(newMarked);
    localStorage.setItem('bme-attendance', JSON.stringify(newAtt));
    localStorage.setItem(`bme-marked-${studentID}`, JSON.stringify(newMarked));

    // --- Update Streak Logic ---
    const lastAttDate = localStorage.getItem('bme-last-attendance');
    let newStreak = streak;

    if (!lastAttDate) {
        newStreak = 1;
    } else {
        const last = new Date(lastAttDate);
        const now = new Date();
        // Reset hours for day comparison
        last.setHours(0,0,0,0);
        now.setHours(0,0,0,0);
        
        const diffTime = Math.abs(now.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newStreak = streak + 1;
        } else if (diffDays > 1) {
            newStreak = 1; // Reset if broken
        } 
        // if diffDays === 0, already marked once today, streak stays same
    }
    
    if (newStreak !== streak) {
        setStreak(newStreak);
        localStorage.setItem('bme-streak', newStreak.toString());
    }
    localStorage.setItem('bme-last-attendance', new Date().toISOString());
    // ---------------------------

    // Check Achievements
    const isEarly = new Date().getHours() < 8;
    checkAchievements(studentID, {
      streak: newStreak,
      cwaUsage: cwaUsageCount,
      attendanceCount: Object.values(newAtt).reduce((a: any, b: any) => a + b, 0),
      hasEarlyCheckIn: isEarly
    }, unlockedAchievements);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        localStorage.setItem(`bme-avatar-${studentID}`, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCalculateCWA = () => {
      let weightedSum = 0, totalCredits = 0;
      COURSE_CREDITS.forEach(c => {
        const mark = parseFloat(marks[c.code] || '0');
        if (mark > 0) { weightedSum += mark * c.credits; totalCredits += c.credits; }
      });
      setCalculatedCWA(totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : null);
      
      const newCount = cwaUsageCount + 1;
      setCwaUsageCount(newCount);
      localStorage.setItem(`bme-cwa-usage-${studentID}`, newCount.toString());

      checkAchievements(studentID, {
        streak: parseInt(localStorage.getItem('bme-streak') || '0'),
        cwaUsage: newCount,
        attendanceCount: Object.values(attendance).reduce((a: any, b: any) => a + b, 0),
        hasEarlyCheckIn: false
      }, unlockedAchievements);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!feedbackText.trim()) return;
      const newItem: FeedbackItem = {
          id: Date.now().toString(),
          text: feedbackText,
          type: feedbackType,
          votes: 0,
          date: new Date().toLocaleDateString()
      };
      const newList = [newItem, ...feedbackList];
      setFeedbackList(newList);
      localStorage.setItem('bme-feedback', JSON.stringify(newList));
      setFeedbackText('');
      setShowFeedbackModal(false);
  };

  const handleUpvote = (id: string) => {
      const newList = feedbackList.map(item => {
          if(item.id === id) return {...item, votes: item.votes + 1};
          return item;
      }).sort((a,b) => b.votes - a.votes);
      setFeedbackList(newList);
      localStorage.setItem('bme-feedback', JSON.stringify(newList));
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayName = days[new Date().getDay() - 1] || 'Weekend';

  const renderClassRow = (cls: any, canMark: boolean) => (
    <div key={cls.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all gap-4 mb-3">
        <div className="flex gap-4 items-center">
            <div className="text-[10px] font-bold opacity-40 bg-white/5 p-2 rounded-lg min-w-[60px] text-center">
                <div>ENDS</div>
                <div style={{color: currentTheme.primary}}>{cls.time.split(' - ')[1]}</div>
            </div>
            <div>
                <h4 className="font-bold text-base text-white">{cls.course}</h4>
                <p className="text-[10px] opacity-50 font-bold uppercase">📍 {cls.venue} • {cls.lecturer}</p>
            </div>
        </div>
        <div className="flex items-center gap-3 justify-between md:justify-end">
            <button 
                onClick={() => markAttendance(cls.id)} 
                disabled={!canMark || attendanceMarked[cls.id] === new Date().toDateString()}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                !canMark ? 'opacity-20 cursor-not-allowed bg-white/5 text-slate-500' :
                attendanceMarked[cls.id] === new Date().toDateString()
                    ? 'bg-emerald-500 text-white cursor-not-allowed' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 cursor-pointer'
                }`}
            >
                {attendanceMarked[cls.id] === new Date().toDateString() ? <span className="flex items-center gap-1"><CheckCircle size={12} /> MARKED</span> : 'MARK PRESENT'}
            </button>
        </div>
    </div>
  );

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <BioBackground theme={currentTheme} />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md relative z-10">
          <GlassCard className="p-8 border-white/20">
            <div className="text-center mb-8">
               <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 font-bold transition-colors duration-500" style={{backgroundColor: `${currentTheme.primary}33`, color: currentTheme.primary}}>BME</div>
               <h1 className="text-2xl font-black tracking-tight text-white">PORTAL ACCESS</h1>
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-white/10 rounded-2xl border border-white/5 relative z-20">
              <button 
                  onClick={() => setLoginMode('student')} 
                  className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300 ${loginMode === 'student' ? 'bg-white text-black shadow-lg scale-100' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                  Student
              </button>
              <button 
                  onClick={() => setLoginMode('admin')} 
                  className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300 ${loginMode === 'admin' ? 'bg-red-500 text-white shadow-lg scale-100' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                  Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginMode === 'student' ? (
                <>
                  <input type="text" placeholder="Student ID" value={studentID} disabled={isFirstLogin} onChange={(e) => setStudentID(e.target.value)} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-white outline-none focus:border-white/30" />
                  {(isFirstLogin || localStorage.getItem(`pw-${studentID}`)) && (
                    <input type="password" placeholder={isFirstLogin ? "Create Password" : "Password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-white outline-none focus:border-white/30" autoFocus />
                  )}
                  <button className="w-full py-4 rounded-2xl font-black uppercase hover:scale-[1.02] transition-transform text-[#0a0f1c]" style={{backgroundColor: currentTheme.primary}}>{isFirstLogin ? 'SAVE & ENTER' : 'CONTINUE'}</button>
                </>
              ) : (
                <>
                  <input type="password" placeholder="Admin Access Code" value={adminAccessCode} onChange={(e) => setAdminAccessCode(e.target.value)} className="w-full p-4 rounded-2xl bg-white/5 border border-red-500/30 text-center text-white outline-none focus:border-red-500" autoFocus />
                  <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-transform">Unlock Admin</button>
                </>
              )}
              {loginError && <p className="text-red-400 text-[10px] text-center font-bold uppercase animate-pulse">{loginError}</p>}
            </form>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-24">
      <BioBackground theme={currentTheme} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 p-4">
        <GlassCard className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center rounded-full border-white/10">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowProfileModal(true)}>
             <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border-2" style={{borderColor: currentTheme.primary}}>
                {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 opacity-50" />}
             </div>
             <div>
                <h1 className="text-sm font-bold leading-tight">{studentName.split(' ')[0]}</h1>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">ID: {studentID}</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowThemeModal(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><Settings size={18} /></button>
            <button onClick={handleLogout} className="p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20"><LogOut size={18} /></button>
          </div>
        </GlassCard>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Top Widgets (Streak & Reminder) */}
        {activeTab === 'dashboard' && (
           <div className="grid md:grid-cols-2 gap-4">
              <StreakWidget currentTheme={currentTheme} streak={streak} />
              <SmartReminder currentTheme={currentTheme} />
           </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
           <div className="bg-white/5 p-1 rounded-2xl flex gap-1 overflow-x-auto max-w-full">
              {[
                {id: 'dashboard', label: 'Dashboard'},
                {id: 'analytics', label: 'Analytics'},
                {id: 'leaderboard', label: 'Leaderboard'},
                {id: 'community', label: 'Community'}
              ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                   {tab.label}
                 </button>
              ))}
           </div>
        </div>

        {activeTab === 'dashboard' && (
            <>
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a href="https://chat.whatsapp.com/EqsJ9zo4goBA6RFjv035Ei" target="_blank" className="p-4 bg-green-500/10 border border-green-500/20 rounded-3xl flex flex-col items-center gap-2 hover:bg-green-500/20 transition-all">
                    <MessageCircle className="text-green-400" />
                    <span className="text-[10px] font-bold uppercase">WhatsApp</span>
                  </a>
                  <button onClick={() => setShowCWAModal(true)} className="p-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all bg-white/5 border border-white/10">
                    <Calculator style={{color: currentTheme.primary}} />
                    <span className="text-[10px] font-bold uppercase">CWA Calc</span>
                  </button>
                  <a href="https://drive.google.com/drive/folders/1QsLCU6OA8fswVkqO4A09ynnXSbk3PsWk" target="_blank" className="p-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all bg-blue-500/10 border border-blue-500/20">
                     <Folder className="text-blue-400" />
                     <span className="text-[10px] font-bold uppercase">Resources</span>
                  </a>
                  <button onClick={() => setShowUpdatesHub(true)} className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex flex-col items-center gap-2 hover:bg-purple-500/20 transition-all relative">
                    <Bell className="text-purple-400" />
                    <span className="text-[10px] font-bold uppercase">Updates</span>
                  </button>
                </div>

                {/* Timetable */}
                <GlassCard className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                      <Calendar style={{color: currentTheme.primary}} /> {showWeeklyTimetable ? 'Weekly Schedule' : "Today's Agenda"}
                    </h2>
                    <div className="flex items-center gap-3">
                         {!showWeeklyTimetable && <span className="text-xs font-bold opacity-50 uppercase">{todayName}</span>}
                         <button 
                            onClick={() => setShowWeeklyTimetable(!showWeeklyTimetable)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                         >
                            {showWeeklyTimetable ? <Layout size={16} /> : <List size={16} />}
                         </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {showWeeklyTimetable ? (
                        Object.entries(TIMETABLE).map(([day, classes]) => (
                            <div key={day} className="mb-6 last:mb-0">
                                <h3 className="font-bold text-xs uppercase opacity-40 mb-3 ml-1">{day}</h3>
                                {classes.map((cls: any) => renderClassRow(cls, day === todayName))}
                            </div>
                        ))
                    ) : (
                        TIMETABLE[todayName]?.length ? 
                        TIMETABLE[todayName].map((cls: any) => renderClassRow(cls, true)) : 
                        <p className="text-[10px] opacity-30 italic py-4 text-center uppercase tracking-widest">No Classes Today</p>
                    )}
                  </div>
                </GlassCard>

                {/* Quick Notes */}
                <GlassCard className="p-6 flex flex-col h-48" delay={0.2}>
                   <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                     <FileText size={16} style={{color: currentTheme.primary}} /> Quick Notes
                   </h3>
                   <textarea 
                     value={notes} 
                     onChange={(e) => {
                       setNotes(e.target.value);
                       localStorage.setItem('bme-notes', e.target.value);
                     }} 
                     placeholder="Jot down something..." 
                     className="flex-1 w-full bg-transparent border-0 outline-none text-sm leading-relaxed resize-none text-slate-300 placeholder:text-slate-600"
                   />
                </GlassCard>

                <DailyInspiration currentTheme={currentTheme} />
            </>
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard currentTheme={currentTheme} attendance={attendance} />}
        {activeTab === 'leaderboard' && <Leaderboard currentTheme={currentTheme} myId={studentID} />}
        {activeTab === 'community' && (
          <FeedbackBoard 
             currentTheme={currentTheme} 
             feedbackList={feedbackList} 
             onUpvote={handleUpvote} 
             onRequestPost={() => setShowFeedbackModal(true)}
          />
        )}

      </main>

      {/* Floating Action Button (Widget) */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {fabOpen && (
            <motion.div initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.8}} className="flex flex-col gap-3 mb-4 items-end">
               <button onClick={() => {setShowFeedbackModal(true); setFabOpen(false);}} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full shadow-xl font-bold text-xs uppercase hover:bg-gray-100">
                <span>Feedback</span> <MessageSquare size={16} />
              </button>
              <button onClick={() => {setShowCWAModal(true); setFabOpen(false);}} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full shadow-xl font-bold text-xs uppercase hover:bg-gray-100">
                <span>Check CWA</span> <Calculator size={16} />
              </button>
              <button onClick={() => {setFabOpen(false); document.querySelector('textarea')?.focus()}} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full shadow-xl font-bold text-xs uppercase hover:bg-gray-100">
                <span>Add Note</span> <FileText size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
           onClick={() => setFabOpen(!fabOpen)}
           className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
           style={{backgroundColor: currentTheme.primary, color: '#0a0f1c'}}
        >
          {fabOpen ? <X size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
        </button>
      </div>

      {/* Profile/Achievements Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-sm p-8 relative">
                <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full border-2 overflow-hidden" style={{borderColor: currentTheme.primary}}>
                     {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-full h-full p-4 opacity-50" />}
                  </div>
                  <div>
                     <h2 className="text-lg font-black leading-tight text-white">{studentName}</h2>
                     <p className="text-xs font-bold opacity-50 uppercase">{studentID}</p>
                     <div className="flex gap-2 mt-2">
                       <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-bold border border-yellow-500/30 flex items-center gap-1">
                         <Star size={10} /> {unlockedAchievements.length} Badges
                       </span>
                     </div>
                  </div>
                </div>

                <h3 className="text-xs font-black uppercase opacity-60 mb-4 flex items-center gap-2">
                   <Award size={14} /> Achievements
                </h3>
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                   {ACHIEVEMENTS.map(ach => {
                      const isUnlocked = unlockedAchievements.includes(ach.id);
                      return (
                        <div key={ach.id} className={`p-3 rounded-2xl border flex items-center gap-3 ${isUnlocked ? `bg-[${currentTheme.primary}]/10 border-[${currentTheme.primary}]/30` : 'bg-white/5 border-white/5 opacity-50 grayscale'}`}>
                           <div className="text-2xl">{ach.icon}</div>
                           <div>
                              <p className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>{ach.title}</p>
                              <p className="text-[10px] opacity-50">{ach.description}</p>
                           </div>
                           {isUnlocked && <CheckCircle size={14} className="ml-auto text-emerald-400" />}
                        </div>
                      )
                   })}
                </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
             <GlassCard className="w-full max-w-md p-8 relative flex flex-col max-h-[85vh]">
                <button onClick={() => setShowFeedbackModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
                <h2 className="text-xl font-black mb-6 text-white uppercase flex items-center gap-2">
                    <MessageSquare className="text-blue-400" /> Anonymous Box
                </h2>
                
                <form onSubmit={handleFeedbackSubmit} className="mb-6">
                    <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-xl">
                        {(['suggestion', 'issue', 'feature'] as const).map(t => (
                            <button 
                              key={t}
                              type="button"
                              onClick={() => setFeedbackType(t)}
                              className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${feedbackType === t ? `bg-[${currentTheme.primary}] text-black` : 'text-slate-400 hover:text-white'}`}
                              style={{backgroundColor: feedbackType === t ? currentTheme.primary : 'transparent'}}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <textarea 
                       value={feedbackText}
                       onChange={e => setFeedbackText(e.target.value)}
                       placeholder="Type your feedback anonymously..."
                       className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 resize-none h-24 mb-4"
                    />
                    <button className="w-full py-3 rounded-xl font-black uppercase text-xs" style={{backgroundColor: currentTheme.primary, color: '#0a0f1c'}}>
                        Submit Feedback
                    </button>
                </form>

                <div className="overflow-y-auto flex-1 pr-2 space-y-3">
                   <h3 className="text-xs font-bold opacity-50 uppercase mb-2">Recent Submissions</h3>
                   {feedbackList.length === 0 ? (
                       <p className="text-center text-xs opacity-30 italic py-4">No feedback yet. Be the first!</p>
                   ) : (
                       feedbackList.map(item => (
                           <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                               <div className="flex justify-between items-start mb-2">
                                   <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded bg-white/5 ${item.type === 'issue' ? 'text-red-400' : item.type === 'feature' ? 'text-purple-400' : 'text-blue-400'}`}>
                                       {item.type}
                                   </span>
                                   <span className="text-[9px] opacity-30">{item.date}</span>
                               </div>
                               <p className="text-sm text-slate-200 mb-3">{item.text}</p>
                               <button 
                                 onClick={() => handleUpvote(item.id)}
                                 className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                               >
                                   <ThumbsUp size={14} /> {item.votes}
                               </button>
                           </div>
                       ))
                   )}
                </div>
             </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Modal */}
      <AnimatePresence>
        {showThemeModal && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
               <GlassCard className="w-full max-w-sm p-8 relative">
                   <button onClick={() => setShowThemeModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
                   <h2 className="text-lg font-black uppercase mb-6 flex items-center gap-2"><Palette size={18} /> Customize</h2>
                   
                   <div className="space-y-6">
                       <div>
                           <p className="text-xs font-bold opacity-50 uppercase mb-3">Color Scheme</p>
                           <div className="grid grid-cols-2 gap-2">
                               {Object.values(THEMES).map(t => (
                                   <button 
                                      key={t.id} 
                                      onClick={() => {
                                          setCurrentTheme(t);
                                          localStorage.setItem('bme-theme', t.id);
                                      }}
                                      className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${currentTheme.id === t.id ? 'border-white bg-white/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                                   >
                                       <div className="w-4 h-4 rounded-full" style={{backgroundColor: t.primary}}></div>
                                       <span className="text-xs font-bold uppercase">{t.name}</span>
                                   </button>
                               ))}
                           </div>
                       </div>
                       <div>
                           <p className="text-xs font-bold opacity-50 uppercase mb-3">Profile Picture</p>
                           <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-white/30 hover:bg-white/5 transition-all">
                               <Upload size={24} className="opacity-50 mb-2" />
                               <span className="text-[10px] font-bold uppercase opacity-50">Click to upload</span>
                               <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                           </label>
                       </div>
                       <div>
                           <p className="text-xs font-bold opacity-50 uppercase mb-3">Notifications</p>
                           <button 
                             onClick={requestNotificationPermission}
                             className={`w-full py-3 rounded-xl text-xs font-bold uppercase transition-all ${notificationsEnabled ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                           >
                              {notificationsEnabled ? 'Notifications Active' : 'Enable Notifications'}
                           </button>
                       </div>
                   </div>
               </GlassCard>
           </motion.div>
        )}
      </AnimatePresence>

      {/* CWA Modal */}
      <AnimatePresence>
        {showCWAModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-8 relative">
              <button onClick={() => setShowCWAModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
              <h2 className="text-xl font-black mb-6 text-white uppercase flex items-center gap-2"><Calculator style={{color: currentTheme.primary}} /> CWA Calculator</h2>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto mb-6 pr-2">
                {COURSE_CREDITS.map(c => (
                  <div key={c.code} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div><p className="font-bold text-xs uppercase text-white">{c.code}</p><p className="text-[10px] opacity-40 uppercase">{c.credits} Credits</p></div>
                    <input type="number" placeholder="0" min="0" max="100" className="w-16 p-2 rounded-xl bg-black/20 text-center font-bold outline-none border border-transparent focus:border-white/30" 
                      style={{color: currentTheme.primary}}
                      onChange={(e) => {
                        const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                        setMarks({...marks, [c.code]: value.toString()});
                        e.target.value = value.toString();
                      }} 
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-6">
                <span className="font-bold text-xs opacity-50 uppercase">Predicted CWA</span>
                <span className="text-4xl font-black" style={{color: currentTheme.primary}}>{calculatedCWA || '--'}</span>
              </div>
              <button onClick={handleCalculateCWA} className="w-full py-4 text-[#0a0f1c] rounded-2xl font-black text-xs uppercase tracking-widest" style={{backgroundColor: currentTheme.primary}}>Calculate Score</button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Updates Hub Modal */}
      <AnimatePresence>
        {showUpdatesHub && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-2xl p-8 relative">
               <button onClick={() => setShowUpdatesHub(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
               <h2 className="text-xl font-black mb-6 text-white uppercase flex items-center gap-2"><Bell className="text-purple-400" /> Updates</h2>
               <div className="p-8 text-center opacity-50 text-sm italic">
                  No new announcements available at this time.
               </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
