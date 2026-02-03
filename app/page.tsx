'use client';

import { useState, useEffect } from 'react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

// --- DATA TYPES ---
type ClassSession = {
  id: string;
  time: string;
  course: string;
  venue: string;
  lecturer: string;
  type: 'Lecture' | 'Lab' | 'Practical';
};

// --- UPDATED DATA WITH UNIQUE IDs FOR ATTENDANCE ---
const TIMETABLE: { [key: string]: ClassSession[] } = {
  Monday: [
    { id: 'm1', time: '08:00 - 09:55', course: 'COE 181', venue: 'VCR', lecturer: 'K.O.K. Sarkodie', type: 'Lecture' },
    { id: 'm2', time: '10:30 - 12:25', course: 'CHEM 151', venue: 'PB212', lecturer: 'L. Sarpong', type: 'Lecture' },
    { id: 'm3', time: '17:00 - 17:55', course: 'ENGL 157', venue: 'ENG AUDIT', lecturer: 'P.O Yeboah', type: 'Lecture' },
  ],
  Tuesday: [
    { id: 't1', time: '08:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo/G.S. Klogo', type: 'Lab' },
  ],
  Wednesday: [
    { id: 'w1', time: '08:00 - 09:55', course: 'MATH 151 A', venue: 'VSLA', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture' },
    { id: 'w2', time: '13:00 - 13:55', course: 'COE 181', venue: '303', lecturer: 'K.O.K Sarkodie', type: 'Lecture' },
  ],
  Thursday: [
    { id: 'th1', time: '08:00 - 09:55', course: 'ME 161', venue: 'A110', lecturer: 'K.O Amoabeng', type: 'Lecture' },
    { id: 'th2', time: '13:00 - 14:55', course: 'MATH 151 B', venue: 'PB020', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture' },
    { id: 'th3', time: '15:00 - 16:55', course: 'BME 161', venue: 'PB008', lecturer: 'P. Adjei', type: 'Lecture' },
  ],
  Friday: [
    { id: 'f1', time: '10:30 - 12:25', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo', type: 'Lab' },
    { id: 'f2', time: '13:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'G.S. Klogo', type: 'Lab' },
  ],
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [attendance, setAttendance] = useState<{ [key: string]: number }>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Persistence & Hydration
  useEffect(() => {
    const savedDark = localStorage.getItem('bme-dark') === 'true';
    const savedAttendance = JSON.parse(localStorage.getItem('bme-attendance') || '{}');
    setDarkMode(savedDark);
    setAttendance(savedAttendance);
    
    // Simulate loading for skeleton state
    setTimeout(() => setIsLoading(false), 800);

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('bme-dark', darkMode.toString());
  }, [darkMode]);

  const markAttendance = (id: string) => {
    const newAtt = { ...attendance, [id]: (attendance[id] || 0) + 1 };
    setAttendance(newAtt);
    localStorage.setItem('bme-attendance', JSON.stringify(newAtt));
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayName = days[new Date().getDay() - 1] || 'Weekend';
  const todayClasses = TIMETABLE[todayName] || [];

  // Theme Logic
  const theme = {
    bg: darkMode ? 'bg-[#0f172a]' : 'bg-[#f0f9f6]',
    card: darkMode ? 'bg-slate-800/50' : 'bg-white',
    accent: 'text-emerald-500',
    border: darkMode ? 'border-slate-700' : 'border-emerald-100',
    knustPurple: 'bg-[#3b0764]',
    knustGold: 'bg-[#fbbf24]'
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${darkMode ? 'text-slate-200' : 'text-slate-900'} ${outfit.className} transition-colors duration-500`}>
      
      {/* KNUST HEADER */}
      <header className={`${theme.knustPurple} text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">🧬</div>
        <div className="max-w-4xl mx-auto p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 ${theme.knustGold} rounded-full flex items-center justify-center border-2 border-white shadow-xl`}>
              <span className="text-purple-900 font-black text-[10px] text-center">KNUST<br/>BME</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none uppercase">Biomedical Engineering</h1>
              <p className="text-amber-400 text-[10px] font-bold tracking-widest mt-1">KWAME NKRUMAH UNIVERSITY OF SCIENCE & TECHNOLOGY</p>
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* SKELETON / NEXT CLASS */}
        {isLoading ? (
          <div className={`w-full h-32 ${theme.card} rounded-[32px] animate-pulse flex items-center p-8 gap-4`}>
             <div className="h-12 w-12 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
             <div className="space-y-2 flex-1">
                <div className="h-4 w-1/4 bg-slate-300 dark:bg-slate-700 rounded"></div>
                <div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-700 rounded"></div>
             </div>
          </div>
        ) : (
          <div className={`${theme.card} rounded-[32px] p-8 shadow-xl border-b-8 border-emerald-500 relative overflow-hidden`}>
            <div className="absolute -right-4 -bottom-4 opacity-5 text-9xl">🔬</div>
            <div className="relative z-10">
              <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Current Vital Signs</span>
              <h2 className="text-4xl font-black mt-2 tracking-tight">System Ready.</h2>
              <div className="flex gap-6 mt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold opacity-50">Local Time</span>
                  <span className="text-xl font-black text-emerald-500">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold opacity-50">Avg Attendance</span>
                  <span className="text-xl font-black text-amber-500">74%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE TRACKER SECTION */}
        <section className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <h3 className="font-black text-lg flex items-center gap-2">
              <span className="text-emerald-500">🦠</span> Today's Sessions
            </h3>
            <span className="text-[10px] font-bold opacity-40 uppercase">{todayName}</span>
          </div>

          <div className="grid gap-4">
            {todayClasses.map((cls) => (
              <div key={cls.id} className={`${theme.card} p-5 rounded-[24px] border border-transparent hover:border-emerald-500/30 transition-all flex justify-between items-center group`}>
                <div className="flex gap-4 items-center">
                  <div className="text-center bg-slate-100 dark:bg-slate-900 w-16 py-2 rounded-xl">
                    <p className="text-[10px] font-black opacity-40">{cls.time.split(' ')[0]}</p>
                    <p className="text-[10px] font-black opacity-40">AM</p>
                  </div>
                  <div>
                    <h4 className="font-black text-lg leading-tight">{cls.course}</h4>
                    <p className="text-xs opacity-50 font-medium">📍 {cls.venue} • {cls.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => markAttendance(cls.id)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  I'M PRESENT ({attendance[cls.id] || 0})
                </button>
              </div>
            ))}
            {todayClasses.length === 0 && (
              <div className="text-center py-12 opacity-30">
                <p className="text-5xl mb-2">🧬</p>
                <p className="font-bold">No biological activity scheduled today.</p>
              </div>
            )}
          </div>
        </section>

        {/* QUICK ACCESS ACTION BAR */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button className={`${theme.card} p-4 rounded-3xl flex items-center gap-3 border ${theme.border} hover:scale-95 transition-all`}>
            <span className="bg-emerald-500/20 p-2 rounded-lg">🧪</span>
            <div className="text-left">
              <p className="text-[10px] font-black opacity-50 uppercase">Lab Logs</p>
              <p className="text-xs font-bold">COE 153 Data</p>
            </div>
          </button>
          <button className={`${theme.card} p-4 rounded-3xl flex items-center gap-3 border ${theme.border} hover:scale-95 transition-all`}>
            <span className="bg-purple-500/20 p-2 rounded-lg">🩸</span>
            <div className="text-left">
              <p className="text-[10px] font-black opacity-50 uppercase">Coursework</p>
              <p className="text-xs font-bold">BME 161 Slides</p>
            </div>
          </button>
          <button className={`${theme.card} p-4 rounded-3xl flex items-center gap-3 border ${theme.border} hover:scale-95 transition-all md:col-span-1 col-span-2`}>
            <span className="bg-amber-500/20 p-2 rounded-lg">🫀</span>
            <div className="text-left">
              <p className="text-[10px] font-black opacity-50 uppercase">Directory</p>
              <p className="text-xs font-bold">Lecturer Contact</p>
            </div>
          </button>
        </div>

      </main>

      {/* OFFLINE STATUS PILL */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 z-50">
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-white text-[10px] font-black tracking-widest uppercase">Local Node Active</span>
      </div>
    </div>
  );
}
