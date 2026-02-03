'use client';

import { useState, useEffect } from 'react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

// --- TYPES ---
type ClassSession = {
  time: string;
  course: string;
  venue: string;
  lecturer: string;
  type: 'Lecture' | 'Lab' | 'Practical';
};

type TimetableData = {
  [key: string]: ClassSession[];
};

// --- DATA FROM REGISTRATION SLIP & YOUR UPDATES ---
const COURSE_CREDITS = [
  { code: 'MATH 151', name: 'Algebra', credits: 4 },
  { code: 'BME 161', name: 'Cell Biology', credits: 3 },
  { code: 'EE 151', name: 'Applied Electricity', credits: 3 },
  { code: 'ME 161', name: 'Basic Mechanics', credits: 3 },
  { code: 'CHEM 151', name: 'General Chemistry', credits: 2 },
  { code: 'COE 153', name: 'Engineering Tech', credits: 2 },
  { code: 'ENGL 157', name: 'Comm. Skills I', credits: 2 },
];

const TIMETABLE: TimetableData = {
  Monday: [
    { time: '08:00 - 09:55', course: 'COE 181', venue: 'VCR', lecturer: 'K.O.K. Sarkodie', type: 'Lecture' },
    { time: '10:30 - 12:25', course: 'CHEM 151', venue: 'PB212', lecturer: 'L. Sarpong', type: 'Lecture' },
    { time: '17:00 - 17:55', course: 'ENGL 157', venue: 'ENG AUDIT', lecturer: 'P.O Yeboah', type: 'Lecture' },
  ],
  Tuesday: [
    { time: '08:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo/G.S. Klogo', type: 'Lab' },
  ],
  Wednesday: [
    { time: '08:00 - 09:55', course: 'MATH 151 A', venue: 'VSLA', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture' },
    { time: '13:00 - 13:55', course: 'COE 181', venue: '303', lecturer: 'K.O.K Sarkodie', type: 'Lecture' },
  ],
  Thursday: [
    { time: '08:00 - 09:55', course: 'ME 161', venue: 'A110', lecturer: 'K.O Amoabeng', type: 'Lecture' },
    { time: '13:00 - 14:55', course: 'MATH 151 B', venue: 'PB020', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture' },
    { time: '15:00 - 16:55', course: 'BME 161', venue: 'PB008', lecturer: 'P. Adjei', type: 'Lecture' },
  ],
  Friday: [
    { time: '10:30 - 12:25', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo', type: 'Lab' },
    { time: '13:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'G.S. Klogo', type: 'Lab' },
  ],
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWeekView, setShowWeekView] = useState(false);
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [marks, setMarks] = useState<{ [key: string]: string }>({});
  const [calculatedCWA, setCalculatedCWA] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayIndex = new Date().getDay();
  const todayName = days[todayIndex - 1] || 'Weekend';
  const todayClasses = (TIMETABLE[todayName] || []).filter(c => c.course !== 'FREE');

  const getNextClass = () => {
    const now = new Date();
    const currentDayIndex = now.getDay(); 
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    if (currentDayIndex >= 1 && currentDayIndex <= 5) {
      const dayName = days[currentDayIndex - 1];
      const classes = TIMETABLE[dayName].filter(c => c.course !== 'FREE');
      for (const cls of classes) {
        const [hours, minutes] = cls.time.split(' - ')[0].split(':').map(Number);
        if ((hours * 60 + minutes) > currentMinutes) return { ...cls, day: 'Today' };
      }
    }

    let nextIdx = currentDayIndex;
    for (let i = 0; i < 7; i++) {
      nextIdx = (nextIdx % 7) + 1;
      const nextDayName = days[nextIdx - 1];
      if (TIMETABLE[nextDayName]?.length > 0) return { ...TIMETABLE[nextDayName][0], day: nextDayName };
    }
    return null;
  };

  const nextClass = getNextClass();

  const handleCalculateCWA = () => {
    let weightedSum = 0, totalCredits = 0;
    COURSE_CREDITS.forEach(c => {
      const mark = parseFloat(marks[c.code] || '0');
      if (mark > 0) { weightedSum += mark * c.credits; totalCredits += c.credits; }
    });
    setCalculatedCWA(totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} ${outfit.className} transition-all`}>
      <header className="bg-indigo-950 text-white p-6 shadow-2xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-indigo-900 font-black text-xs shadow-lg transform rotate-3">BMESS</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">BME PORTAL</h1>
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Level 100 • Year 1</p>
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-xl">{darkMode ? '☀️' : '🌙'}</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {nextClass && (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl p-8 shadow-xl border-l-[12px] border-indigo-500`}>
             <p className="text-indigo-500 font-bold text-sm uppercase mb-1 tracking-widest">{nextClass.day === 'Today' ? 'Up Next Today' : `Next: ${nextClass.day}`}</p>
             <h2 className="text-4xl font-black mb-2">{nextClass.course}</h2>
             <div className="flex flex-wrap gap-4 text-lg font-medium opacity-70">
                <span>📍 {nextClass.venue}</span>
                <span>⏰ {nextClass.time.split(' - ')[0]}</span>
                <span>👨‍🏫 {nextClass.lecturer}</span>
             </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="https://chat.whatsapp.com/EqsJ9zo4goBA6RFjv035Ei?mode=gi_t" target="_blank" className="p-6 bg-emerald-600 text-white rounded-3xl shadow-lg hover:scale-105 transition flex flex-col items-center gap-2">
            <span className="text-3xl">💬</span><span className="font-bold text-sm">WhatsApp</span>
          </a>
          <a href="https://drive.google.com/drive/folders/1QsLCU6OA8fswVkqO4A09ynnXSbk3PsWk" target="_blank" className="p-6 bg-blue-600 text-white rounded-3xl shadow-lg hover:scale-105 transition flex flex-col items-center gap-2">
            <span className="text-3xl">📚</span><span className="font-bold text-sm">Resources</span>
          </a>
          <button onClick={() => setShowCWAModal(true)} className="p-6 bg-indigo-600 text-white rounded-3xl shadow-lg hover:scale-105 transition flex flex-col items-center gap-2">
            <span className="text-3xl">📈</span><span className="font-bold text-sm">CWA Calc</span>
          </button>
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center border-2 border-indigo-500/20`}>
            <span className="text-2xl font-black text-indigo-500">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Live Time</span>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl p-6 shadow-xl`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black">{showWeekView ? 'Full Week' : 'Today'}</h2>
            <button onClick={() => setShowWeekView(!showWeekView)} className="px-6 py-2 bg-indigo-500 text-white rounded-full font-bold text-sm hover:bg-indigo-600 transition-all shadow-md">{showWeekView ? 'Today Only' : 'Weekly View'}</button>
          </div>

          <div className="space-y-6">
            {(showWeekView ? days : [todayName]).map(day => (
              <div key={day} className="space-y-4">
                {showWeekView && <h3 className="text-indigo-500 font-black text-sm uppercase tracking-tighter border-b border-indigo-500/10 pb-2">{day}</h3>}
                {TIMETABLE[day]?.length ? TIMETABLE[day].filter(c => c.course !== 'FREE').map((cls, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-all group`}>
                    <div className="w-20 text-center font-black text-sm opacity-40 group-hover:opacity-100">{cls.time.split(' - ')[0]}</div>
                    <div className="flex-1">
                      <p className="font-black text-lg">{cls.course}</p>
                      <p className="text-sm font-bold opacity-50">{cls.venue} • {cls.lecturer}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${cls.type === 'Lab' ? 'bg-orange-500/10 text-orange-500' : 'bg-indigo-500/10 text-indigo-500'}`}>{cls.type}</div>
                  </div>
                )) : <p className="text-sm opacity-30 italic py-4">No classes.</p>}
              </div>
            ))}
          </div>
        </div>
      </main>

      {showCWAModal && (
        <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} w-full max-w-md rounded-[40px] p-8 shadow-2xl relative`}>
            <button onClick={() => setShowCWAModal(false)} className="absolute top-6 right-6 text-2xl">✕</button>
            <h2 className="text-3xl font-black mb-6">CWA Tracker</h2>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto mb-6 pr-2">
              {COURSE_CREDITS.map(c => (
                <div key={c.code} className="flex justify-between items-center bg-slate-500/5 p-4 rounded-2xl">
                  <div><p className="font-black text-sm">{c.code}</p><p className="text-[10px] opacity-50">{c.credits} Credits</p></div>
                  <input type="number" placeholder="Mark" className="w-20 p-3 rounded-xl bg-white dark:bg-slate-900 border-none text-center font-bold" onChange={(e) => setMarks({...marks, [c.code]: e.target.value})} />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="font-bold">Result:</span>
              <span className="text-4xl font-black text-indigo-500">{calculatedCWA || '--'}</span>
            </div>
            <button onClick={handleCalculateCWA} className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl">CALCULATE NOW</button>
          </div>
        </div>
      )}
    </div>
  );
}
