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

const COURSE_CREDITS = [
  { code: 'MATH 151', name: 'Algebra', credits: 4 },
  { code: 'BME 161', name: 'Cell Biology', credits: 3 },
  { code: 'EE 151', name: 'Applied Electricity', credits: 3 },
  { code: 'ME 161', name: 'Basic Mechanics', credits: 3 },
  { code: 'CHEM 151', name: 'General Chemistry', credits: 2 },
  { code: 'COE 153', name: 'Engineering Tech', credits: 2 },
  { code: 'ENGL 157', name: 'Comm. Skills I', credits: 2 },
];

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
  const [darkMode, setDarkMode] = useState(false);
  const [showWeekView, setShowWeekView] = useState(false);
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [attendance, setAttendance] = useState<{ [key: string]: number }>({});
  const [marks, setMarks] = useState<{ [key: string]: string }>({});
  const [calculatedCWA, setCalculatedCWA] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setDarkMode(localStorage.getItem('bme-dark') === 'true');
    setAttendance(JSON.parse(localStorage.getItem('bme-attendance') || '{}'));
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('bme-dark', next.toString());
  };

  const markAttendance = (id: string) => {
    const newAtt = { ...attendance, [id]: (attendance[id] || 0) + 1 };
    setAttendance(newAtt);
    localStorage.setItem('bme-attendance', JSON.stringify(newAtt));
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
  const todayClasses = TIMETABLE[todayName] || [];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'} ${outfit.className} transition-colors`}>
      
      {/* HEADER */}
      <header className="bg-[#3b0764] text-white p-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-400 rounded-full flex items-center justify-center font-black text-purple-950 text-[10px] text-center shadow-lg">KNUST<br/>BME</div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Student Portal</h1>
              <p className="text-amber-400 text-[10px] font-bold tracking-widest">BIOMEDICAL ENGINEERING • L100</p>
            </div>
          </div>
          <button onClick={toggleDarkMode} className="p-3 bg-white/10 rounded-2xl text-xl hover:bg-white/20 transition">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="https://chat.whatsapp.com/EqsJ9zo4goBA6RFjv035Ei" target="_blank" className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg hover:scale-105 transition flex flex-col items-center gap-1">
            <span className="text-2xl">💬</span><span className="font-bold text-xs">WhatsApp</span>
          </a>
          <a href="https://drive.google.com/drive/folders/1QsLCU6OA8fswVkqO4A09ynnXSbk3PsWk" target="_blank" className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-105 transition flex flex-col items-center gap-1">
            <span className="text-2xl">📚</span><span className="font-bold text-xs">Resources</span>
          </a>
          <button onClick={() => setShowCWAModal(true)} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-105 transition flex flex-col items-center gap-1">
            <span className="text-2xl">📈</span><span className="font-bold text-xs">CWA Calc</span>
          </button>
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} p-4 rounded-2xl shadow-md flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800`}>
            <span className="text-lg font-black text-emerald-500">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Live Node</span>
          </div>
        </div>

        {/* TIMETABLE CONTAINER */}
        <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-[32px] p-6 shadow-xl border border-slate-200 dark:border-slate-800`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black flex items-center gap-2">
              🧬 {showWeekView ? 'Weekly Schedule' : "Today's Agenda"}
            </h2>
            <button onClick={() => setShowWeekView(!showWeekView)} className="px-5 py-2 bg-emerald-500 text-white rounded-full font-bold text-xs hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20">
              {showWeekView ? 'Show Today' : 'Show Full Week'}
            </button>
          </div>

          <div className="space-y-8">
            {(showWeekView ? days : [todayName]).map(day => (
              <div key={day} className="space-y-4">
                {showWeekView && <h3 className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em] border-b border-emerald-500/10 pb-2">{day}</h3>}
                {TIMETABLE[day]?.length ? TIMETABLE[day].map((cls) => (
                  <div key={cls.id} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-3xl ${darkMode ? 'bg-slate-800/40 hover:bg-slate-800' : 'bg-slate-50 hover:bg-white'} border border-transparent hover:border-emerald-500/20 transition-all gap-4`}>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 text-center font-black text-xs opacity-40">{cls.time.split(' - ')[0]}</div>
                      <div>
                        <h4 className="font-black text-lg">{cls.course}</h4>
                        <p className="text-xs opacity-50 font-bold uppercase">📍 {cls.venue} • {cls.lecturer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${cls.type === 'Lab' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{cls.type}</span>
                       <button 
                        onClick={() => markAttendance(cls.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${attendance[cls.id] ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}
                       >
                         PRESENT: {attendance[cls.id] || 0}
                       </button>
                    </div>
                  </div>
                )) : <p className="text-sm opacity-30 italic py-4">No academic activities scheduled.</p>}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CWA MODAL (RESTORED) */}
      {showCWAModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} w-full max-w-md rounded-[40px] p-8 shadow-2xl relative`}>
            <button onClick={() => setShowCWAModal(false)} className="absolute top-6 right-6 text-xl">✕</button>
            <h2 className="text-2xl font-black mb-6">CWA Tracker</h2>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto mb-6 pr-2">
              {COURSE_CREDITS.map(c => (
                <div key={c.code} className="flex justify-between items-center bg-slate-500/5 p-4 rounded-2xl">
                  <div><p className="font-black text-xs">{c.code}</p><p className="text-[10px] opacity-40">{c.credits} Credits</p></div>
                  <input type="number" placeholder="0" className="w-16 p-2 rounded-xl bg-white dark:bg-slate-800 text-center font-bold border-none" onChange={(e) => setMarks({...marks, [c.code]: e.target.value})} />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t border-slate-500/10 pt-4 mb-6">
              <span className="font-bold text-sm uppercase opacity-50">Predicted CWA</span>
              <span className="text-4xl font-black text-emerald-500">{calculatedCWA || '--'}</span>
            </div>
            <button onClick={handleCalculateCWA} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-500/20">CALCULATE</button>
          </div>
        </div>
      )}
    </div>
  );
}
