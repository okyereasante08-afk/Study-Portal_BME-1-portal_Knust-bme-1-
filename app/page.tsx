import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, MessageCircle, BookOpen, Calendar, LogOut, Activity,
  Download, Upload, Bell, CheckCircle, FileText, Settings, User, Palette
} from "lucide-react";
import { THEMES, CLASS_LIST, TIMETABLE, COURSE_CREDITS, ADMIN_IDS } from "./constants";
import { Theme } from "./types";
import { GlassCard, StreakWidget, SmartReminder, Leaderboard, AnalyticsDashboard } from "./components/DashboardWidgets";

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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES.ocean);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'leaderboard'>('dashboard');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  // Data States
  const [attendance, setAttendance] = useState<{ [key: string]: number }>({});
  const [attendanceMarked, setAttendanceMarked] = useState<{ [key: string]: boolean }>({});
  const [notes, setNotes] = useState('');
  const [daysToMidSem, setDaysToMidSem] = useState(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  
  // Modals
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [showUpdatesHub, setShowUpdatesHub] = useState(false);
  
  // CWA Logic
  const [marks, setMarks] = useState<{ [key: string]: string }>({});
  const [calculatedCWA, setCalculatedCWA] = useState<number | null>(null);

  const [loginMode, setLoginMode] = useState<'student' | 'admin'>('student');
  const [adminAccessCode, setAdminAccessCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    if (savedMarked) setAttendanceMarked(JSON.parse(savedMarked));
    const savedNotes = localStorage.getItem('bme-notes');
    if (savedNotes) setNotes(savedNotes);
    const savedAvatar = localStorage.getItem(`bme-avatar-${id}`);
    if (savedAvatar) setAvatar(savedAvatar);
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
    
    // Update Streak Data
    const today = new Date().toDateString();
    localStorage.setItem('bme-last-login', today);
    
    restoreSession(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('bme-session-id');
    setIsLoggedIn(false);
    setStudentID('');
    setPassword('');
    setAvatar(null);
  };

  const markAttendance = (id: string) => {
    if (attendanceMarked[id]) return;
    const newAtt = { ...attendance, [id]: (attendance[id] || 0) + 1 };
    const newMarked = { ...attendanceMarked, [id]: true };
    setAttendance(newAtt);
    setAttendanceMarked(newMarked);
    localStorage.setItem('bme-attendance', JSON.stringify(newAtt));
    localStorage.setItem(`bme-marked-${studentID}`, JSON.stringify(newMarked));
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
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayName = days[new Date().getDay() - 1] || 'Weekend';

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
          <div className="flex items-center gap-3">
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
              <StreakWidget currentTheme={currentTheme} />
              <SmartReminder currentTheme={currentTheme} />
           </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
           <div className="bg-white/5 p-1 rounded-2xl flex gap-1">
              {[
                {id: 'dashboard', label: 'Dashboard'},
                {id: 'analytics', label: 'Analytics'},
                {id: 'leaderboard', label: 'Leaderboard'}
              ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
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
                   <button onClick={() => setShowUpdatesHub(true)} className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex flex-col items-center gap-2 hover:bg-purple-500/20 transition-all relative">
                    <Bell className="text-purple-400" />
                    <span className="text-[10px] font-bold uppercase">Updates</span>
                  </button>
                   <GlassCard className="p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                     <p className="text-2xl font-black text-white">{daysToMidSem}</p>
                     <p className="text-[8px] font-bold text-red-400 uppercase tracking-[0.1em]">Days to Midsem</p>
                  </GlassCard>
                </div>

                {/* Timetable */}
                <GlassCard className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                      <Calendar style={{color: currentTheme.primary}} /> Today's Agenda
                    </h2>
                    <span className="text-xs font-bold opacity-50 uppercase">{todayName}</span>
                  </div>
                  <div className="space-y-4">
                    {TIMETABLE[todayName]?.length ? TIMETABLE[todayName].map((cls: any) => (
                      <div key={cls.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all gap-4">
                        <div className="flex gap-4 items-center">
                          <div className="text-[10px] font-bold opacity-40 bg-white/5 p-2 rounded-lg">
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
                             disabled={attendanceMarked[cls.id]}
                             className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                               attendanceMarked[cls.id] 
                                 ? 'bg-emerald-500 text-white cursor-not-allowed' 
                                 : 'bg-white/5 text-slate-400 hover:bg-white/10 cursor-pointer'
                             }`}
                           >
                             {attendanceMarked[cls.id] ? <span className="flex items-center gap-1"><CheckCircle size={12} /> MARKED</span> : 'MARK PRESENT'}
                           </button>
                        </div>
                      </div>
                    )) : <p className="text-[10px] opacity-30 italic py-4 text-center uppercase tracking-widest">No Classes Today</p>}
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
            </>
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard currentTheme={currentTheme} />}
        {activeTab === 'leaderboard' && <Leaderboard currentTheme={currentTheme} myId={studentID} />}

      </main>

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
