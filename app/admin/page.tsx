'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Admin IDs - these student IDs have admin access
const ADMIN_IDS = ['22028883']; // Add more admin IDs here

// --- STUDENT DATABASE ---
const CLASS_LIST: { [id: string]: string } = {
  "21935355": "Aaron Oduro",
  "22123354": "Abena Dufie Opare-Baah",
  "22088436": "Abena Tabuaa Obeng-Mensah",
  "21949701": "Adelaide Selorm Afi Dzimadzor",
  "21948324": "Adjei Pomaa Cresta",
  "21875208": "Adjoa Kwansema Eshun",
  "22245585": "Adune Dasha Bagase",
  "22337376": "Adwoa Abrafi Adjei",
  "21931395": "Afia Serwaa Kwarteng Amaning",
  "22416594": "Afriyie Jeanefel Owusu",
  "22331047": "Agyarko-Nyamekye Max Abankwa",
  "21787360": "Agyei Chrislla Birago",
  "22208586": "Ahenkorah Emmanuella Kyei",
  "21947631": "Albert Affum Opare",
  "21938073": "Amankwaah Beatrice Sarpong Akosua",
  "22312345": "Amoaba Keren-Happuch Winvel",
  "22341588": "Amoah-Owusu Cecil Williams",
  "21888854": "AMPOFO Abena Gyamfia",
  "22048359": "Ampofo Nana Yaw Kwegya",
  "22561241": "Ampomah Daniel",
  "22547391": "Amuzu Richmond Kwame",
  "22259193": "Ankomah Maxi-Priest",
  "22277904": "Anlaagmen Pearl Nuonta",
  "22341786": "Annan Nora Odokai",
  "22166367": "Appiah Roberta Achiaa",
  "22082053": "Asante Emmanuella Twumasiwaa",
  "22028883": "Asante Kwaku Okyere",
  "21716259": "Asare Godfred",
  "22129935": "Awurakua Akomea-Dankyi",
  "21893253": "Ayiku Richmond Lartey",
  "22224514": "Baaba Nyarko Assabil",
  "21760006": "Baffoe Renia Gyan",
  "22077735": "Baiden Abdul Ghaffar Benyi",
  "22315225": "Bezalel Addy Bamflo",
  "21809851": "Blessing Dadzie",
  "22178256": "Blessing Pokuaa",
  "21795884": "Boadu Kelvin Kwabena",
  "21854625": "Boakye Justice Ofori",
  "21840594": "Boakye Nana Akosua Agyeiwaa",
  "22504820": "Boatemaa-Ayim Nana Akua",
  "21902739": "Boateng Yiedie Akyaa",
  "21976026": "Caleb Adjei Mensah",
  "22247538": "Carlis Appiah-Sarkodie",
  "21822251": "Christabel Dadzie",
  "22300069": "Christian Amoah",
  "22541775": "Daniel Kwabena Affum",
  "22200510": "Darko Lisa Ampem",
  "22208865": "Darlington Mawuena Anyomi",
  "22698331": "David Adjei",
  "22313191": "Davies Mawuli Kamsey",
  "22108018": "Deborah Adjei Acquah",
  "21763979": "Dennis Gyebi",
  "21837887": "Doma-Her Skylar Sungbawiere",
  "22544637": "Dzansi Virginia Makafui",
  "21974352": "Ekow Amoah Benyi-Acquah",
  "22215957": "Elizabeth Tetebea Agyemang",
  "22046739": "Ernest Nimako-Boateng",
  "21797396": "Esi Asor Hemaa Aboagye",
  "22048114": "Fieve Brain Delanyo",
  "22430218": "Frimpong Precious Antwowaah",
  "21983696": "Frimpong Wilhelmina",
  "22514233": "Fudzie Kelvin Delali",
  "22328187": "Fuseini Ibtihaaj Gaida",
  "21841024": "Fynn Emmanuella Esi",
  "21946146": "Gifty Asantewaa Adoma",
  "22190892": "Grace Armoo",
  "21969430": "Hammond Kevin Nii Obli",
  "22010557": "Israelna Ama Yeboah",
  "21995972": "James Adjei Mensah",
  "21896223": "Jazlyn Yaa Asantewah Okae-Kyei",
  "22184311": "Jenefails Akuffo-Gyan",
  "22710811": "Josephine Nana Akosua Pinamang Gyebi",
  "22429815": "Keren Naa Klorkor Quaye",
  "21904638": "Keziah Deborah Wilson",
  "22645870": "Koramah Mercy",
  "22243432": "Kusi Constance Abrafi",
  "21882887": "Lakeisha Lord-Mensah",
  "22083170": "Laura Naa Tiokor Amartey",
  "22127161": "Lawrencia Awuah Adobea",
  "21949982": "Lisa Timbilla Azasumah",
  "22331976": "Maame Ama Tiwaa Ofori-Agyeman",
  "21859658": "Marfo Isaac",
  "21795451": "Mary Achiaa Sarpong",
  "22333045": "Mawaddatu Abdul Rashid",
  "22565526": "Michael Fiifi Djan",
  "22051165": "Naa Teley Ayorkor Quaye",
  "21885234": "Nadia Stoner-Darku",
  "21877955": "Nana Adwoa Gyamfua Hyeaman",
  "22334053": "Nana Ekua Serwah Ampomah",
  "22213391": "Nana Frimpong Desu",
  "21974163": "Narh Otabil Mensah",
  "21889745": "Nina Osman Mustapha",
  "22408944": "Nyamador Kenneth Selorm",
  "22429220": "NYANTAKYI Pascal",
  "22052236": "Obeng Antoinette Maame Adjoa Antwiwaa",
  "21913089": "Obiri-Yeboah Vanessa",
  "22472240": "Odame Daniel",
  "21694679": "Oduro John Luther Kweku",
  "22364718": "Oduro Prince Peasah",
  "22440821": "Ofori Ayimwaah Nana Akua",
  "21989933": "Okai Eugene Kobina",
  "22042804": "OKYNE Adjetey Godson",
  "22086375": "OLIVIA Nhyira Dwomoh",
  "21783110": "Opoku Gospel Kwame",
  "22030735": "Oppong Badu Andrea",
  "22332966": "Paula Sedinam Foriwa Apawu",
  "22011457": "Pearl Maame Nyarko Ofori-Ameyaw",
  "22003933": "Raudatu Deishini Mohammed Awal",
  "22218511": "Roxann Ankobea-Kokroe",
  "21919326": "Sarfo Vannessa Adams",
  "22538085": "Sarkodie Raymond",
  "21008757": "Sarpong Abena Adutwumwaa",
  "22648542": "Segbefia Jake Etse",
  "22435656": "Segbenya Edem",
  "21914691": "Sekyi Kelvin Asiedu",
  "22065297": "Serwaa Afia Opoku Agyemang",
  "21756237": "Serwaa Nana Adoma",
  "21873633": "Shanti Abena Thanki",
  "22086004": "Somuah Herbert Koranteng",
  "22551945": "Stacey Shenchu Kimbi",
  "22462485": "Stephan Kofi Ewenam Zewuze",
  "22399422": "Stephen Kofi Apemah-Baah",
  "22646382": "Stephen Nana Boamah",
  "22042354": "Sumani Anis Wonta",
  "21910531": "TAHIRU Akor Munziru",
  "22272601": "Takyi Timothy",
  "22677767": "Taufiq Nassara Sadiq",
  "22336160": "Tetteh Daniel Nii Awuley",
  "21830521": "Tibu Seth",
  "21721342": "Tieku Timah Princess",
  "22185447": "Twumasi Nicolina Nana Akua",
  "22263241": "Winnifred Monney",
  "22345160": "Worlase Afua Kportufe",
  "22247637": "Yao-Kumah Davida Eyram",
  "22348338": "Yeboah Yaa Gyamfuaa"
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

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [darkMode, setDarkMode] = useState(false);
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

  const checkStoredPassword = (id: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`pw-${id}`);
    }
    return null;
  };

  useEffect(() => {
    const savedID = localStorage.getItem('bme-session-id');
    if (savedID && CLASS_LIST[savedID]) {
      setStudentID(savedID); // ADD THIS LINE - set the ID state
      setStudentName(CLASS_LIST[savedID]);
      setIsLoggedIn(true);
      setIsAdmin(ADMIN_IDS.includes(savedID));
      
      // Also save to bme-student-id for admin page compatibility
      localStorage.setItem('bme-student-id', savedID);
    }

    const savedDark = localStorage.getItem('bme-dark');
    if (savedDark !== null) setDarkMode(savedDark === 'true');
    
    const savedAtt = localStorage.getItem('bme-attendance');
    if (savedAtt) setAttendance(JSON.parse(savedAtt));

    const savedNotes = localStorage.getItem('bme-notes');
    if (savedNotes) setNotes(savedNotes);

    const savedAnnouncements = localStorage.getItem('bme-announcements');
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));

    const savedFiles = localStorage.getItem('bme-files');
    if (savedFiles) setFiles(JSON.parse(savedFiles));

    const midSemDate = new Date('2026-02-23T00:00:00');
    const diff = Math.ceil((midSemDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    setDaysToMidSem(diff);

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (!CLASS_LIST[studentID]) {
      setLoginError('Invalid Student ID.');
      return;
    }

    const storedPassword = checkStoredPassword(studentID);

    if (!storedPassword) {
      if (!isFirstLogin) {
        setIsFirstLogin(true);
        setLoginError('');
      } else {
        if (password.length < 4) {
          setLoginError('Password must be at least 4 characters.');
        } else {
          localStorage.setItem(`pw-${studentID}`, password);
          proceedToLogin();
        }
      }
    } else {
      if (password === storedPassword) {
        proceedToLogin();
      } else {
        setLoginError('Incorrect password.');
      }
    }
  };

  const proceedToLogin = () => {
    setStudentName(CLASS_LIST[studentID]);
    setIsLoggedIn(true);
    setIsAdmin(ADMIN_IDS.includes(studentID)); // ADD THIS LINE
    localStorage.setItem('bme-session-id', studentID);
    localStorage.setItem('bme-student-id', studentID); // ADD THIS LINE - for admin page
    
    // Log the login for analytics
    const loginLog = {
      studentId: studentID,
      studentName: CLASS_LIST[studentID],
      timestamp: new Date().toLocaleString()
    };
    const existingLogs = JSON.parse(localStorage.getItem('bme-login-logs') || '[]');
    existingLogs.push(loginLog);
    localStorage.setItem('bme-login-logs', JSON.stringify(existingLogs));
  };

  const handleLogout = () => {
    localStorage.removeItem('bme-session-id');
    localStorage.removeItem('bme-student-id'); // ADD THIS LINE
    setIsLoggedIn(false);
    setStudentID('');
    setPassword('');
    setIsFirstLogin(false);
  };

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

  const getFirstName = (name: string) => name.split(' ')[0];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayName = days[new Date().getDay() - 1] || 'Weekend';

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-950'}`}>
        <form onSubmit={handleLogin} className={`w-full max-w-md p-8 rounded-[40px] shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border`}>
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-[#3b0764] rounded-full flex items-center justify-center text-amber-400 font-black mb-4">KNUST</div>
            <h1 className="text-xl font-black uppercase">{isFirstLogin ? 'Set Password' : 'Portal Access'}</h1>
            <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest mt-2">{isFirstLogin ? 'Secure your new account' : 'Enter your credentials'}</p>
          </div>
          
          <div className="space-y-4">
            <input 
              type="text" placeholder="Student ID" value={studentID} disabled={isFirstLogin}
              onChange={(e) => setStudentID(e.target.value)}
              className={`w-full p-4 rounded-3xl font-bold text-center outline-none ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} ${isFirstLogin ? 'opacity-50' : ''}`}
            />
            
            {(isFirstLogin || checkStoredPassword(studentID)) && (
              <input 
                type="password" placeholder={isFirstLogin ? "Create Password" : "Password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className={`w-full p-4 rounded-3xl font-bold text-center outline-none ${darkMode ? 'bg-slate-800 ring-2 ring-emerald-500/20' : 'bg-slate-100 ring-2 ring-purple-500/10'}`}
              />
            )}

            {loginError && <p className="text-red-500 text-[10px] text-center font-bold uppercase">{loginError}</p>}
            
            <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-3xl font-black shadow-lg hover:bg-emerald-700 transition-all">
              {isFirstLogin ? 'SAVE & ENTER' : 'CONTINUE'}
            </button>
            
            {isFirstLogin && <button type="button" onClick={() => setIsFirstLogin(false)} className="w-full text-[10px] font-bold opacity-40 uppercase">Back</button>}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      <header className="bg-[#3b0764] text-white p-6 shadow-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black uppercase">Welcome, {getFirstName(studentName)}</h1>
            <p className="text-amber-400 text-[10px] font-bold tracking-widest uppercase">ID: {studentID}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleDarkMode} className="p-3 bg-white/10 rounded-2xl"> {darkMode ? '☀️' : '🌙'} </button>
            {isAdmin && (
              <Link href="/admin" className="p-3 bg-yellow-500/20 text-yellow-500 rounded-2xl text-[10px] font-bold uppercase">
                Admin
              </Link>
            )}
            <button onClick={handleLogout} className="p-3 bg-red-500/20 text-red-500 rounded-2xl text-[10px] font-bold uppercase">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="https://chat.whatsapp.com/EqsJ9zo4goBA6RFjv035Ei" target="_blank" rel="noopener noreferrer" className="p-4 bg-emerald-600 text-white rounded-2xl flex flex-col items-center gap-1 shadow-lg"><span className="text-2xl">💬</span><span className="font-bold text-xs">WhatsApp</span></a>
          <a href="https://drive.google.com/drive/folders/1QsLCU6OA8fswVkqO4A09ynnXSbk3PsWk" target="_blank" rel="noopener noreferrer" className="p-4 bg-blue-600 text-white rounded-2xl flex flex-col items-center gap-1 shadow-lg"><span className="text-2xl">📚</span><span className="font-bold text-xs">Resources</span></a>
          <button onClick={() => setShowCWAModal(true)} className="p-4 bg-indigo-600 text-white rounded-2xl flex flex-col items-center gap-1 shadow-lg"><span className="text-2xl">📈</span><span className="font-bold text-xs">CWA Calc</span></button>
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800`}>
             <span className="text-lg font-black text-emerald-500">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
             <span className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">System Live</span>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-[32px] p-6 shadow-xl border border-slate-200 dark:border-slate-800`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black">🧬 {showWeekView ? 'Weekly Schedule' : "Today's Agenda"}</h2>
            <button onClick={() => setShowWeekView(!showWeekView)} className="px-5 py-2 bg-emerald-500 text-white rounded-full font-bold text-xs uppercase tracking-wider">{showWeekView ? 'Today' : 'Full Week'}</button>
          </div>
          <div className="space-y-6">
            {(showWeekView ? days : [todayName]).map(day => (
              <div key={day} className="space-y-4">
                {showWeekView && <h3 className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em]">{day}</h3>}
                {TIMETABLE[day]?.length ? TIMETABLE[day].map((cls: any) => (
                  <div key={cls.id} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-3xl ${darkMode ? 'bg-slate-800/40' : 'bg-slate-50'} gap-4 group`}>
                    <div className="flex gap-4 items-center">
                      <div className="w-16 font-black text-xs opacity-40">{cls.time.split(' - ')[0]}</div>
                      <div>
                        <h4 className="font-black text-lg">{cls.course}</h4>
                        <p className="text-xs opacity-50 font-bold uppercase tracking-tighter">📍 {cls.venue} • {cls.lecturer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${cls.type === 'Lab' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{cls.type}</span>
                       <button onClick={() => markAttendance(cls.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black ${attendance[cls.id] ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 uppercase tracking-tighter'}`}>PRESENT ({attendance[cls.id] || 0})</button>
                    </div>
                  </div>
                )) : <p className="text-xs opacity-30 italic py-4 text-center">No activities scheduled.</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-[32px] p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col h-64`}>
            <h3 className="font-black text-lg mb-4">📝 Quick Notes</h3>
            <textarea value={notes} onChange={(e) => {setNotes(e.target.value); localStorage.setItem('bme-notes', e.target.value)}} 
              placeholder="Type anything..." className="flex-1 w-full bg-transparent border-0 outline-none text-sm leading-relaxed resize-none"/>
          </div>
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-[32px] p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col h-64 items-center justify-center text-center`}>
            <span className="bg-red-500/20 text-red-500 p-2 rounded-lg text-lg mb-4">⏳</span>
            <h3 className="font-black text-lg mb-2">Mid-Sem Countdown</h3>
            <p className="text-6xl font-black text-emerald-500 leading-none mb-2">{daysToMidSem}</p>
            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Days until Feb 23</p>
          </div>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-[32px] p-6 shadow-xl border border-slate-200 dark:border-slate-800`}>
            <h3 className="font-black text-lg mb-4">📢 Announcements</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {announcements.slice(0, 5).map((ann: any) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-2xl border-l-4 ${
                    ann.type === 'urgent' ? 'border-red-500 bg-red-500/5' :
                    ann.type === 'quiz' ? 'border-orange-500 bg-orange-500/5' :
                    ann.type === 'deadline' ? 'border-yellow-500 bg-yellow-500/5' :
                    'border-blue-500 bg-blue-500/5'
                  }`}
                >
                  <p className="font-medium text-sm mb-1">{ann.text}</p>
                  <p className="text-xs opacity-50 font-bold">{ann.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missed Classes */}
        {files.length > 0 && (
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-[32px] p-6 shadow-xl border border-slate-200 dark:border-slate-800`}>
            <h3 className="font-black text-lg mb-4">📖 Missed a Class?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {files.slice(0, 6).map((file: any) => (
                <div key={file.id} className={`p-4 rounded-2xl border ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <p className="font-bold text-sm mb-2">{file.course} - {file.week}</p>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full p-2 bg-blue-600 text-white rounded-lg text-xs font-bold text-center hover:bg-blue-700 transition"
                  >
                    {file.type === 'notes' ? '📄 Notes' :
                     file.type === 'recording' ? '🎥 Recording' :
                     file.type === 'slides' ? '📊 Slides' : '📖 Manual'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showCWAModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} w-full max-w-md rounded-[40px] p-8 shadow-2xl relative`}>
            <button onClick={() => setShowCWAModal(false)} className="absolute top-6 right-6 font-black opacity-50">✕</button>
            <h2 className="text-2xl font-black mb-6 text-emerald-500 uppercase tracking-tighter">CWA Calculator 📈</h2>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto mb-6 pr-2">
              {COURSE_CREDITS.map(c => (
                <div key={c.code} className="flex justify-between items-center bg-slate-500/5 p-4 rounded-2xl border border-transparent">
                  <div><p className="font-black text-xs uppercase">{c.code}</p><p className="text-[10px] opacity-40 uppercase">{c.credits} Credits</p></div>
                  <input type="number" placeholder="0" className={`w-16 p-2 rounded-xl text-center font-bold ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`} 
                    onChange={(e) => setMarks({...marks, [c.code]: e.target.value})} />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t border-slate-500/10 pt-4 mb-6">
              <span className="font-bold text-sm opacity-50 uppercase tracking-tighter">Predicted CWA</span>
              <span className="text-4xl font-black text-emerald-500">{calculatedCWA || '--'}</span>
            </div>
            <button onClick={handleCalculateCWA} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest">Calculate</button>
          </div>
        </div>
      )}
    </div>
  );
}
