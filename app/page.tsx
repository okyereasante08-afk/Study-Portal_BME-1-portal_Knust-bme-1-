"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { 
  Calculator, 
  MessageCircle, 
  BookOpen, 
  Calendar, 
  Lock, 
  LogOut, 
  ChevronRight,
  Activity,
  Moon,
  Sun,
  Clock,
  ExternalLink,
  FileText
} from "lucide-react";

// --- YOUR ORIGINAL DATA ---
const ADMIN_IDS = ['22028883']; 
const CLASS_LIST: { [id: string]: string } = {
  "21935355": "Aaron Oduro", "22123354": "Abena Dufie Opare-Baah", "22088436": "Abena Tabuaa Obeng-Mensah",
  "21949701": "Adelaide Selorm Afi Dzimadzor", "21948324": "Adjei Pomaa Cresta", "21875208": "Adjoa Kwansema Eshun",
  "22245585": "Adune Dasha Bagase", "22337376": "Adwoa Abrafi Adjei", "21931395": "Afia Serwaa Kwarteng Amaning",
  "22416594": "Afriyie Jeanefel Owusu", "22331047": "Agyarko-Nyamekye Max Abankwa", "21787360": "Agyei Chrislla Birago",
  "22208586": "Ahenkorah Emmanuella Kyei", "21947631": "Albert Affum Opare", "21938073": "Amankwaah Beatrice Sarpong Akosua",
  "22312345": "Amoaba Keren-Happuch Winvel", "22341588": "Amoah-Owusu Cecil Williams", "21888854": "AMPOFO Abena Gyamfia",
  "22048359": "Ampofo Nana Yaw Kwegya", "22561241": "Ampomah Daniel", "22547391": "Amuzu Richmond Kwame",
  "22259193": "Ankomah Maxi-Priest", "22277904": "Anlaagmen Pearl Nuonta", "22341786": "Annan Nora Odokai",
  "22166367": "Appiah Roberta Achiaa", "22082053": "Asante Emmanuella Twumasiwaa", "22028883": "Asante Kwaku Okyere",
  "21716259": "Asare Godfred", "22129935": "Awurakua Akomea-Dankyi", "21893253": "Ayiku Richmond Lartey",
  "22224514": "Baaba Nyarko Assabil", "21760006": "Baffoe Renia Gyan", "22077735": "Baiden Abdul Ghaffar Benyi",
  "22315225": "Bezalel Addy Bamflo", "21809851": "Blessing Dadzie", "22178256": "Blessing Pokuaa",
  "21795884": "Boadu Kelvin Kwabena", "21854625": "Boakye Justice Ofori", "21840594": "Boakye Nana Akosua Agyeiwaa",
  "22504820": "Boatemaa-Ayim Nana Akua", "21902739": "Boateng Yiedie Akyaa", "21976026": "Caleb Adjei Mensah",
  "22247538": "Carlis Appiah-Sarkodie", "21822251": "Christabel Dadzie", "22300069": "Christian Amoah",
  "22541775": "Daniel Kwabena Affum", "22200510": "Darko Lisa Ampem", "22208865": "Darlington Mawuena Anyomi",
  "22698331": "David Adjei", "22313191": "Davies Mawuli Kamsey", "22108018": "Deborah Adjei Acquah",
  "21763979": "Dennis Gyebi", "21837887": "Doma-Her Skylar Sungbawiere", "22544637": "Dzansi Virginia Makafui",
  "21974352": "Ekow Amoah Benyi-Acquah", "22215957": "Elizabeth Tetebea Agyemang", "22046739": "Ernest Nimako-Boateng",
  "21797396": "Esi Asor Hemaa Aboagye", "22048114": "Fieve Brain Delanyo", "22430218": "Frimpong Precious Antwowaah",
  "21983696": "Frimpong Wilhelmina", "22514233": "Fudzie Kelvin Delali", "22328187": "Fuseini Ibtihaaj Gaida",
  "21841024": "Fynn Emmanuella Esi", "21946146": "Gifty Asantewaa Adoma", "22190892": "Grace Armoo",
  "21969430": "Hammond Kevin Nii Obli", "22010557": "Israelna Ama Yeboah", "21995972": "James Adjei Mensah",
  "21896223": "Jazlyn Yaa Asantewah Okae-Kyei", "22184311": "Jenefails Akuffo-Gyan", "22710811": "Josephine Nana Akosua Pinamang Gyebi",
  "22429815": "Keren Naa Klorkor Quaye", "21904638": "Keziah Deborah Wilson", "22645870": "Koramah Mercy",
  "22243432": "Kusi Constance Abrafi", "21882887": "Lakeisha Lord-Mensah", "22083170": "Laura Naa Tiokor Amartey",
  "22127161": "Lawrencia Awuah Adobea", "21949982": "Lisa Timbilla Azasumah", "22331976": "Maame Ama Tiwaa Ofori-Agyeman",
  "21859658": "Marfo Isaac", "21795451": "Mary Achiaa Sarpong", "22333045": "Mawaddatu Abdul Rashid",
  "22565526": "Michael Fiifi Djan", "22051165": "Naa Teley Ayorkor Quaye", "21885234": "Nadia Stoner-Darku",
  "21877955": "Nana Adwoa Gyamfua Hyeaman", "22334053": "Nana Ekua Serwah Ampomah", "22213391": "Nana Frimpong Desu",
  "21974163": "Narh Otabil Mensah", "21889745": "Nina Osman Mustapha", "22408944": "Nyamador Kenneth Selorm",
  "22429220": "NYANTAKYI Pascal", "22052236": "Obeng Antoinette Maame Adjoa Antwiwaa", "21913089": "Obiri-Yeboah Vanessa",
  "22472240": "Odame Daniel", "21694679": "Oduro John Luther Kweku", "22364718": "Oduro Prince Peasah",
  "22440821": "Ofori Ayimwaah Nana Akua", "21989933": "Okai Eugene Kobina", "22042804": "OKYNE Adjetey Godson",
  "22086375": "OLIVIA Nhyira Dwomoh", "21783110": "Opoku Gospel Kwame", "22030735": "Oppong Badu Andrea",
  "22332966": "Paula Sedinam Foriwa Apawu", "22011457": "Pearl Maame Nyarko Ofori-Ameyaw", "22003933": "Raudatu Deishini Mohammed Awal",
  "22218511": "Roxann Ankobea-Kokroe", "21919326": "Sarfo Vannessa Adams", "22538085": "Sarkodie Raymond",
  "21008757": "Sarpong Abena Adutwumwaa", "22648542": "Segbefia Jake Etse", "22435656": "Segbenya Edem",
  "21914691": "Sekyi Kelvin Asiedu", "22065297": "Serwaa Afia Opoku Agyemang", "21756237": "Serwaa Nana Adoma",
  "21873633": "Shanti Abena Thanki", "22086004": "Somuah Herbert Koranteng", "22551945": "Stacey Shenchu Kimbi",
  "22462485": "Stephan Kofi Ewenam Zewuze", "22399422": "Stephen Kofi Apemah-Baah", "22646382": "Stephen Nana Boamah",
  "22042354": "Sumani Anis Wonta", "21910531": "TAHIRU Akor Munziru", "22272601": "Takyi Timothy",
  "22677767": "Taufiq Nassara Sadiq", "22336160": "Tetteh Daniel Nii Awuley", "21830521": "Tibu Seth",
  "21721342": "Tieku Timah Princess", "22185447": "Twumasi Nicolina Nana Akua", "22263241": "Winnifred Monney",
  "22345160": "Worlase Afua Kportufe", "22247637": "Yao-Kumah Davida Eyram", "22348338": "Yeboah Yaa Gyamfuaa",
  "22339201": "Williams-Peniel Enoch",
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

const TIMETABLE: { [key: string]: any[] } = {
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

// --- STYLED COMPONENTS ---

const BioBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0f1c]">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#050914]" />
    <motion.div 
      animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00d4ff] blur-[120px] opacity-20"
    />
    <motion.div 
      animate={{ x: [0, -100, 0], y: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#3b0764] blur-[120px] opacity-20"
    />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
  </div>
);

const GlassCard = ({ children, className = "", delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

export default function Home() {
  // --- STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [showWeekView, setShowWeekView] = useState(false);
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [attendance, setAttendance] = useState<{ [key: string]: number }>({});
  const [marks, setMarks] = useState<{ [key: string]: string }>({});
  const [calculatedCWA, setCalculatedCWA] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [daysToMidSem, setDaysToMidSem] = useState(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginMode, setLoginMode] = useState<'student' | 'admin'>('student');
  const [adminAccessCode, setAdminAccessCode] = useState('');
  const [mounted, setMounted] = useState(false);

  // --- LOGIC ---
  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage if we're in the browser
    if (typeof window !== 'undefined') {
      const savedID = localStorage.getItem('bme-session-id');
      const isAdminAccess = localStorage.getItem('bme-admin-access') === 'true';
      if (savedID && CLASS_LIST[savedID]) {
        setStudentID(savedID);
        setStudentName(CLASS_LIST[savedID]);
        setIsLoggedIn(true);
        setIsAdmin(ADMIN_IDS.includes(savedID) || isAdminAccess);
        localStorage.setItem('bme-student-id', savedID);
      }
      
      const savedAtt = localStorage.getItem('bme-attendance');
      if (savedAtt) setAttendance(JSON.parse(savedAtt));
      
      const savedNotes = localStorage.getItem('bme-notes');
      if (savedNotes) setNotes(savedNotes);
      
      const savedAnnouncements = localStorage.getItem('bme-announcements');
      if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
      
      const savedFiles = localStorage.getItem('bme-files');
      if (savedFiles) setFiles(JSON.parse(savedFiles));
    }

    const midSemDate = new Date('2026-02-23T00:00:00');
    setDaysToMidSem(Math.ceil((midSemDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: any) => {
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
    
    if (typeof window !== 'undefined') {
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
    }
  };

  const proceedToLogin = (id: string, adminOverride = false) => {
    setStudentName(CLASS_LIST[id]);
    setIsLoggedIn(true);
    const adminStatus = adminOverride || ADMIN_IDS.includes(id);
    setIsAdmin(adminStatus);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('bme-session-id', id);
      localStorage.setItem('bme-student-id', id);
      if (adminStatus) localStorage.setItem('bme-admin-access', 'true');
      
      // Log the login
      const loginLog = {
        studentId: id,
        studentName: CLASS_LIST[id],
        timestamp: new Date().toLocaleString()
      };
      const existingLogs = JSON.parse(localStorage.getItem('bme-login-logs') || '[]');
      existingLogs.push(loginLog);
      localStorage.setItem('bme-login-logs', JSON.stringify(existingLogs));
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bme-session-id');
      localStorage.removeItem('bme-student-id');
      localStorage.removeItem('bme-admin-access');
    }
    setIsLoggedIn(false);
    setIsAdmin(false);
    setStudentID('');
    setPassword('');
    setAdminAccessCode('');
    setLoginMode('student');
  };

  const markAttendance = (id: string) => {
    const newAtt = { ...attendance, [id]: (attendance[id] || 0) + 1 };
    setAttendance(newAtt);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bme-attendance', JSON.stringify(newAtt));
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

  const getFirstName = (name: string) => name.split(' ')[0];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayName = days[new Date().getDay() - 1] || 'Weekend';

  // Don't render until mounted (prevents SSR issues)
  if (!mounted) {
    return null;
  }

  // --- RENDER LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <BioBackground />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
          <GlassCard className="p-8 border-white/20">
            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-[#00d4ff]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#00d4ff] font-bold">BME</div>
               <h1 className="text-2xl font-black tracking-tight text-white">PORTAL ACCESS</h1>
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-2xl">
              <button 
                onClick={() => {
                  setLoginMode('student');
                  setLoginError('');
                  setAdminAccessCode('');
                }} 
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition ${loginMode === 'student' ? 'bg-[#00d4ff] text-[#0a0f1c]' : 'text-slate-400'}`}
              >
                Student
              </button>
              <button 
                onClick={() => {
                  setLoginMode('admin');
                  setLoginError('');
                  setStudentID('');
                  setPassword('');
                  setIsFirstLogin(false);
                }} 
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition ${loginMode === 'admin' ? 'bg-red-500 text-white' : 'text-slate-400'}`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginMode === 'student' ? (
                <>
                  <input type="text" placeholder="Student ID" value={studentID} disabled={isFirstLogin} onChange={(e) => setStudentID(e.target.value)} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-white outline-none focus:border-[#00d4ff]" />
                  {(isFirstLogin || (typeof window !== 'undefined' && localStorage.getItem(`pw-${studentID}`))) && (
                    <input type="password" placeholder={isFirstLogin ? "Create Password" : "Password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-white outline-none focus:border-[#00d4ff]" autoFocus />
                  )}
                  <button className="w-full py-4 bg-[#00d4ff] text-[#0a0f1c] rounded-2xl font-black uppercase hover:scale-[1.02] transition-transform">{isFirstLogin ? 'SAVE & ENTER' : 'CONTINUE'}</button>
                  {isFirstLogin && <button type="button" onClick={() => setIsFirstLogin(false)} className="w-full text-[10px] font-bold opacity-40 uppercase">Back</button>}
                </>
              ) : (
                <>
                  <div className="text-center mb-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider">⚠️ Restricted Area</p>
                    <p className="text-[10px] opacity-60 mt-1 text-white">Enter admin access code to proceed</p>
                  </div>
                  <input type="password" placeholder="Admin Access Code" value={adminAccessCode} onChange={(e) => setAdminAccessCode(e.target.value)} className="w-full p-4 rounded-2xl bg-white/5 border border-red-500/30 text-center text-white outline-none focus:border-red-500" autoFocus />
                  <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase">Unlock Admin</button>
                </>
              )}
              {loginError && <p className="text-red-400 text-[10px] text-center font-bold uppercase">{loginError}</p>}
            </form>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="min-h-screen text-slate-100 pb-20">
      <BioBackground />
      
      <header className="sticky top-0 z-40 p-4">
        <GlassCard className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center rounded-full border-white/10">
          <div>
            <h1 className="text-lg font-bold">Hello, {getFirstName(studentName)}</h1>
            <p className="text-[10px] text-[#48cae4] font-bold uppercase tracking-widest flex items-center gap-1">
              <Activity size={10} className="animate-pulse" /> ID: {studentID}
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin && <Link href="/admin" className="p-2 bg-yellow-500/20 text-yellow-500 rounded-xl text-[10px] font-bold flex items-center px-4 uppercase">Admin</Link>}
            <button onClick={handleLogout} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"><LogOut size={18} /></button>
          </div>
        </GlassCard>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="https://chat.whatsapp.com/EqsJ9zo4goBA6RFjv035Ei" target="_blank" className="p-4 bg-green-500/10 border border-green-500/20 rounded-3xl flex flex-col items-center gap-2 group hover:bg-green-500/20 transition-all">
            <MessageCircle className="text-green-400" />
            <span className="text-[10px] font-bold uppercase">WhatsApp</span>
          </a>
          <a href="https://drive.google.com/drive/folders/1QsLCU6OA8fswVkqO4A09ynnXSbk3PsWk" target="_blank" className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex flex-col items-center gap-2 hover:bg-blue-500/20 transition-all">
            <BookOpen className="text-blue-400" />
            <span className="text-[10px] font-bold uppercase">Resources</span>
          </a>
          <button onClick={() => setShowCWAModal(true)} className="p-4 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-3xl flex flex-col items-center gap-2 hover:bg-[#00d4ff]/20 transition-all">
            <Calculator className="text-[#00d4ff]" />
            <span className="text-[10px] font-bold uppercase">CWA Calc</span>
          </button>
          <div className="p-4 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center">
            <Clock className="text-slate-400 mb-1" size={20} />
            <span className="text-sm font-black">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Timetable */}
        <GlassCard className="p-6 md:p-8" delay={0.1}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Calendar className="text-[#00d4ff]" /> {showWeekView ? 'Weekly Schedule' : "Today's Agenda"}
            </h2>
            <button onClick={() => setShowWeekView(!showWeekView)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10">
              {showWeekView ? 'Close' : 'View Week'}
            </button>
          </div>

          <div className="space-y-6">
            {(showWeekView ? days : [todayName]).map(day => (
              <div key={day} className="space-y-4">
                {showWeekView && <h3 className="text-[#48cae4] font-black text-[10px] uppercase tracking-[0.2em] pl-2 border-l-2 border-[#48cae4] mb-4">{day}</h3>}
                {TIMETABLE[day]?.length ? TIMETABLE[day].map((cls: any) => (
                  <div key={cls.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="text-[10px] font-bold opacity-40 bg-white/5 p-2 rounded-lg">{cls.time.split(' - ')[0]}</div>
                      <div>
                        <h4 className="font-bold text-base text-white">{cls.course}</h4>
                        <p className="text-[10px] opacity-50 font-bold uppercase">📍 {cls.venue} • {cls.lecturer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-between md:justify-end">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${cls.type === 'Lab' ? 'bg-amber-500/20 text-amber-500' : 'bg-[#00d4ff]/20 text-[#00d4ff]'}`}>{cls.type}</span>
                       <button onClick={() => markAttendance(cls.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${attendance[cls.id] ? 'bg-[#00d4ff] text-[#0a0f1c]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                         {attendance[cls.id] ? `PRESENT (${attendance[cls.id]})` : 'MARK PRESENT'}
                       </button>
                    </div>
                  </div>
                )) : <p className="text-[10px] opacity-30 italic py-4 text-center uppercase tracking-widest">Rest Day</p>}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Secondary Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard className="p-6 flex flex-col h-64" delay={0.2}>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileText size={16} className="text-[#00d4ff]" /> Quick Notes
            </h3>
            <textarea 
              value={notes} 
              onChange={(e) => {
                setNotes(e.target.value);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('bme-notes', e.target.value);
                }
              }} 
              placeholder="Jot down something..." 
              className="flex-1 w-full bg-transparent border-0 outline-none text-sm leading-relaxed resize-none text-slate-300 placeholder:text-slate-600"
            />
          </GlassCard>

          <GlassCard className="p-6 flex flex-col h-64 items-center justify-center text-center relative overflow-hidden group" delay={0.3}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            <h3 className="font-bold text-sm uppercase tracking-widest mb-2 opacity-60">Mid-Sem Countdown</h3>
            <p className="text-7xl font-black text-white group-hover:scale-110 transition-transform">{daysToMidSem}</p>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mt-2">Days Remaining</p>
          </GlassCard>
        </div>
      </main>

      {/* CWA MODAL */}
      <AnimatePresence>
        {showCWAModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-8 relative">
              <button onClick={() => setShowCWAModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
              <h2 className="text-xl font-black mb-6 text-white uppercase flex items-center gap-2"><Calculator className="text-[#00d4ff]" /> CWA Calculator</h2>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto mb-6 pr-2">
                {COURSE_CREDITS.map(c => (
                  <div key={c.code} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div><p className="font-bold text-xs uppercase text-white">{c.code}</p><p className="text-[10px] opacity-40 uppercase">{c.credits} Credits</p></div>
                    <input type="number" placeholder="0" className="w-16 p-2 rounded-xl bg-black/20 text-center font-bold text-[#00d4ff] outline-none focus:border-[#00d4ff] border border-transparent" 
                      onChange={(e) => setMarks({...marks, [c.code]: e.target.value})} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-6">
                <span className="font-bold text-xs opacity-50 uppercase">Predicted CWA</span>
                <span className="text-4xl font-black text-[#00d4ff]">{calculatedCWA || '--'}</span>
              </div>
              <button onClick={handleCalculateCWA} className="w-full py-4 bg-[#00d4ff] text-[#0a0f1c] rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,212,255,0.3)]">Calculate Score</button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
