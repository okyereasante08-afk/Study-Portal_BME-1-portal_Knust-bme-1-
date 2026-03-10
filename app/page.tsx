"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { 
  Calculator, MessageCircle, BookOpen, Calendar, LogOut, Activity,
  Download, Upload, Bell, CheckCircle, FileText, Send, AlertTriangle,
  Zap, Coffee, Laugh, Play, ChevronRight, X, ExternalLink
} from "lucide-react";

// ============================================================
// DATA
// ============================================================

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
  "21896223": "Maya 💕", "22184311": "Jenefails Akuffo-Gyan", "22710811": "Josephine Nana Akosua Pinamang Gyebi",
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
  "22339201": "Williams-Peniel Enoch", "22239294": "Chris Nana Yaw Asare",
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
    { id: 'm2', time: '10:30 - 12:25', course: 'CHEM 151', venue: 'PB212', lecturer: 'L. Sarpong', type: 'Lecture', totalClasses: 20 },
    { id: 'm3', time: '17:00 - 17:55', course: 'ENGL 157', venue: 'ENG AUDIT', lecturer: 'P.O Yeboah', type: 'Lecture', totalClasses: 15 },
  ],
  Tuesday: [
    { id: 't1', time: '08:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo/G.S. Klogo', type: 'Lab', totalClasses: 12 },
    { id: 'm1', time: '17:00 - 19:00', course: 'COE 181', venue: 'VSLA', lecturer: 'K.O.K. Sarkodie', type: 'Lecture', totalClasses: 20 },
  ],
  Wednesday: [
    { id: 'w1', time: '08:00 - 09:55', course: 'MATH 151 A', venue: 'VSLA', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture', totalClasses: 20 },
    { id: 'w2', time: '13:00 - 13:55', course: 'COE 181', venue: '303', lecturer: 'K.O.K Sarkodie', type: 'Lecture', totalClasses: 20 },
  ],
  Thursday: [
    { id: 'th1', time: '08:00 - 09:55', course: 'ME 161', venue: 'A110', lecturer: 'K.O Amoabeng', type: 'Lecture', totalClasses: 20 },
    { id: 'th2', time: '13:00 - 14:55', course: 'MATH 151 B', venue: 'PB020', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture', totalClasses: 20 },
    { id: 'th3', time: '15:00 - 16:55', course: 'BME 161', venue: 'PB008', lecturer: 'P. Adjei', type: 'Lecture', totalClasses: 20 },
  ],
  Friday: [
    { id: 'f1', time: '10:30 - 12:25', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo', type: 'Lab', totalClasses: 12 },
    { id: 'f2', time: '13:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'G.S. Klogo', type: 'Lab', totalClasses: 12 },
  ],
};

// ============================================================
// BME SURVIVAL KIT — Your actual playlists
// ============================================================
const SURVIVAL_KIT: { course: string; color: string; emoji: string; resources: { label: string; url: string }[] }[] = [
  {
    course: 'MATH 151 — Linear Algebra',
    color: 'blue',
    emoji: '📐',
    resources: [
      { label: 'Linear Algebra Full Playlist', url: 'https://www.youtube.com/watch?v=VIhUX-8ZooM&list=PLInywrvFyvq4IE-nW-ikwkZ2v81n31HQX&t=214s' },
    ]
  },
  {
    course: 'ME 161 — Basic Mechanics',
    color: 'orange',
    emoji: '⚙️',
    resources: [
      { label: 'Basic Mechanics Playlist', url: 'https://www.youtube.com/watch?v=FnudcA72olU&list=PLInywrvFyvq6FUfAigJ3157kg-nZ020fd&t=35s' },
    ]
  },
  {
    course: 'EE 151 — Applied Electricity',
    color: 'yellow',
    emoji: '⚡',
    resources: [
      { label: 'Applied Electricity Playlist 1', url: 'https://www.youtube.com/watch?v=7VEbQWOQzA4&list=PLZX9WOQeh5xV_Aiubcy9S6kc1lpNnz2Nc' },
      { label: 'Applied Electricity Playlist 2', url: 'https://www.youtube.com/watch?v=rE_0ejMU6yM&list=PLXePpKFSUW2abKgvj_hClQS1NK86SCHfy' },
    ]
  },
  {
    course: 'BME 161 — Cell Biology',
    color: 'green',
    emoji: '🧬',
    resources: [
      { label: 'Cell Structure & Function', url: 'https://www.youtube.com/watch?v=XRwc89cGsy4&list=PPSV' },
      { label: 'Michaelis-Menten Equation (1)', url: 'https://www.youtube.com/watch?v=4eLjRcHnMCk&list=PPSV' },
      { label: 'Michaelis-Menten Equation (2)', url: 'https://www.youtube.com/watch?v=CotD9m8Wm78&list=PPSV' },
      { label: 'Bioenergetics Playlist', url: 'https://www.youtube.com/watch?v=luh2zg-dzBM&list=PL6-1ifYymxJYitIhsa4IrkHWncOicKpOy' },
      { label: 'Cell Signaling (1)', url: 'https://www.youtube.com/watch?v=-dbRterutHY&list=PPSV' },
      { label: 'Cell Signaling (2)', url: 'https://www.youtube.com/watch?v=FQFBygnIONU&list=PPSV' },
      { label: 'Cell Junctions', url: 'https://www.youtube.com/watch?v=gmlA8V2zMv4&list=PPSV&t=992s' },
      { label: 'Cell Adhesion Molecules (1)', url: 'https://www.youtube.com/watch?v=UM8i1Lfoc6U' },
      { label: 'Cell Adhesion Molecules (2)', url: 'https://www.youtube.com/watch?v=CccR-3c3Jck' },
      { label: 'DNA, Mitosis, Meiosis', url: 'https://www.youtube.com/watch?v=LUDws4JrIiI&t=2506s' },
    ]
  },
  {
    course: 'COE 153 — Engineering Tech',
    color: 'purple',
    emoji: '🖥️',
    resources: [
      { label: 'SolidWorks Tutorial', url: 'https://www.youtube.com/watch?v=Ulttc_2p4DY&list=PLrOFa8sDv6jcp8E3ayUFZ4iNI8uuPjXHe' },
      { label: 'KiCad Tutorial (1)', url: 'https://www.youtube.com/watch?v=vLnu21fS22s&list=PLUOaI24LpvQPls1Ru_qECJrENwzD7XImd' },
      { label: 'KiCad Tutorial (2)', url: 'https://www.youtube.com/watch?v=szu8dJoyikA&list=PLn6004q9oeqGl91KifK6xHGuqvXGb374G' },
      { label: 'Arduino IDE', url: 'https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=1706s' },
      { label: 'HTML for Beginners', url: 'https://www.youtube.com/watch?v=HD13eq_Pmp8' },
      { label: 'VS Code Tutorial', url: 'https://www.youtube.com/watch?v=VqCgcpAypFQ' },
      { label: 'Computer Hardware Assembly (1)', url: 'https://www.youtube.com/watch?v=EJemXALSE6U&t=195s' },
      { label: 'Computer Hardware Assembly (2)', url: 'https://www.youtube.com/watch?v=mozlEPyeVAY' },
      { label: 'Computer Hardware Assembly (3)', url: 'https://www.youtube.com/watch?v=hptoIi7X_Tk' },
      { label: 'Network Cable RJ45 (1)', url: 'https://www.youtube.com/watch?v=NWhoJp8UQpo' },
      { label: 'Network Cable RJ45 (2)', url: 'https://www.youtube.com/watch?v=QMpWkkqX1eM&t=192s' },
      { label: 'Network Cable RJ45 (3)', url: 'https://www.youtube.com/watch?v=T1Cp9F8qto8&t=78s' },
      { label: 'Peer to Peer Networking (1)', url: 'https://www.youtube.com/watch?v=ie-qRQIQT4I' },
      { label: 'Peer to Peer Networking (2)', url: 'https://www.youtube.com/watch?v=EYt8ZXsLb54' },
    ]
  },
];

// ============================================================
// KNUST/GHANA-SPECIFIC PUNS (every 15 seconds)
// ============================================================
const BME_PUNS = [
  "Ei, the trotro of knowledge has left. Were you on board? 🚌",
  "KNUST: Knowledge Never Stops Unless Tired. Very tired. 😴",
  "PB212 lecture at 8am? My body is here but my soul is at the hostel. 🛏️",
  "The way Ghanaians say 'I'll be there in 5 minutes'... that's my attendance rate. ⏰",
  "TME LAB assignment due tomorrow. I just found out. It's 11pm. God is faithful. 🙏",
  "Me to Dr. KIDI: Please sir, can you slow down?' Him: *writes faster*. 📝",
  "My data finished during the online lecture. God's plan. 📡",
  "Asante is the GOAT. No debate. 🐐",
  "Dr. Sarkodie once said: \"You ever since you came to my class you've never solved a question before, let this be your first.\" 💀",
  "Dr. Sarkodie once said: \"Just dey play.\" 😭",
  "COE 153 lab report is 40% effort, 60% formatting to look busy. Real talk. 💻",
  "If stress was creditworthy, I'd have a First Class by now. 🎓",
  "Passed Applied Electricity. My ancestors had to intervene personally. ⚡",
];

// ============================================================
// FINALS MSG
// ============================================================

const getFinalsMessage = (days: number) => {
  if (days > 60) return { msg: "Finals? What finals? You're basically on holiday. 🏖️", color: "text-emerald-400" };
  if (days > 45) return { msg: "Plenty of time. (This is a lie. Start now.) 🐢", color: "text-green-400" };
  if (days > 30) return { msg: "30+ days: Time to at least know your course codes. 📖", color: "text-cyan-400" };
  if (days > 21) return { msg: "3 weeks out: Your notes won't read themselves. 📚", color: "text-blue-400" };
  if (days > 14) return { msg: "14 days left: Time to start liking coffee. ☕", color: "text-yellow-400" };
  if (days > 7) return { msg: "One week: The library is your new bedroom. 😰", color: "text-orange-400" };
  if (days > 3) return { msg: "3 days left: Past questions only. Sleep is optional. 😭", color: "text-red-400" };
  if (days > 1) return { msg: "2 days left: May the Bio-Electricity be with you. ⚡", color: "text-red-500" };
  if (days === 1) return { msg: "TOMORROW. You either prepared or you didn't. Breathe. 🙏", color: "text-red-600" };
  if (days === 0) return { msg: "TODAY IS THE DAY. You got this, Engineer. 🚀", color: "text-purple-400" };
  return { msg: "Finals are OVER! Go outside. Touch grass. 🌿", color: "text-emerald-400" };
};

// ============================================================
// ONBOARDING SLIDES
// ============================================================
const ONBOARDING_SLIDES = [
  {
    emoji: "🎓",
    title: "Welcome to BME Portal",
    body: "Your one-stop app for KNUST BME1. Timetable, attendance, CWA calculator — all in one dark glassmorphic masterpiece.",
  },
  {
    emoji: "📅",
    title: "Track Your Attendance",
    body: "Hit 'Mark Present' after every class. The 70% bar turns green when you're exam-eligible. Don't let it go red — the danger zone is real.",
  },
  {
    emoji: "🔔",
    title: "Enable Notifications",
    body: "Allow push notifications and we'll remind you 30 minutes before every lecture. No more running to PB212 with your shoes on the wrong feet.",
  },
  {
    emoji: "📚",
    title: "BME Survival Kit",
    body: "Curated YouTube playlists for every course — Linear Algebra, Cell Biology, Applied Electricity and more. Your lecturers went too fast? We've got you.",
  },
  {
    emoji: "🚀",
    title: "You're Set!",
    body: "KNUST BME1, Class of 2029. The grind is real but so is the glory. Let's go. 💪",
  },
];

// ============================================================
// HELPERS
// ============================================================
const timeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// ============================================================
// UI COMPONENTS
// ============================================================
const BioBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0f1c]">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#050914]" />
    <motion.div animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00d4ff] blur-[120px] opacity-20" />
    <motion.div animate={{ x: [0, -100, 0], y: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#3b0764] blur-[120px] opacity-20" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
  </div>
);

const GlassCard = ({ children, className = "", delay = 0 }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
    className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] shadow-2xl ${className}`}>
    {children}
  </motion.div>
);

const DontPanic = ({ onClose }: { onClose: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
    className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center cursor-pointer">
    <motion.p animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }}
      className="text-[80px] md:text-[140px] font-black text-white tracking-tight text-center leading-none">
      DON'T<br />PANIC
    </motion.p>
    <p className="text-white/40 text-sm mt-8 uppercase tracking-widest">— The BME Student's Guide to the Galaxy</p>
    <p className="text-white/20 text-xs mt-4">tap anywhere to return to your problems</p>
  </motion.div>
);

// ============================================================
// ONBOARDING MODAL
// ============================================================
const OnboardingModal = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const isLast = step === ONBOARDING_SLIDES.length - 1;
  const slide = ONBOARDING_SLIDES[step];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[90] flex items-center justify-center p-6">
      <GlassCard className="w-full max-w-md p-8 text-center relative">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#00d4ff]' : 'w-2 bg-white/20'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <p className="text-6xl mb-6">{slide.emoji}</p>
            <h2 className="text-2xl font-black text-white mb-4">{slide.title}</h2>
            <p className="text-white/60 text-sm leading-relaxed">{slide.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-10">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white/60 rounded-2xl text-xs font-bold uppercase">Back</button>
          )}
          <button onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
            className="flex-1 py-3 bg-[#00d4ff] text-[#0a0f1c] rounded-2xl text-xs font-black uppercase hover:scale-[1.02] transition-transform">
            {isLast ? "Let's Go! 🚀" : "Next →"}
          </button>
        </div>
        <button onClick={onComplete} className="mt-4 text-[10px] opacity-20 hover:opacity-40 uppercase font-bold">Skip</button>
      </GlassCard>
    </motion.div>
  );
};

// ============================================================
// SURVIVAL KIT MODAL
// ============================================================
const SurvivalKitModal = ({ onClose }: { onClose: () => void }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const colorMap: any = {
    blue: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    orange: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
    yellow: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
    green: 'border-green-500/40 bg-green-500/10 text-green-400',
    purple: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-black text-white uppercase mb-2 flex items-center gap-2">
          <BookOpen className="text-[#00d4ff]" /> BME Survival Kit
        </h2>
        <p className="text-white/30 text-xs mb-8">Your lecturer went too fast? These playlists have you covered. 🎯</p>

        <div className="space-y-3">
          {SURVIVAL_KIT.map((kit) => (
            <div key={kit.course} className={`rounded-2xl border ${colorMap[kit.color]} overflow-hidden`}>
              <button onClick={() => setExpanded(expanded === kit.course ? null : kit.course)}
                className="w-full p-4 flex items-center justify-between text-left">
                <span className="font-black text-sm flex items-center gap-2">
                  {kit.emoji} {kit.course}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] opacity-50">{kit.resources.length} resources</span>
                  <ChevronRight size={14} className={`transition-transform ${expanded === kit.course ? 'rotate-90' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {expanded === kit.course && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-2">
                      {kit.resources.map((r, i) => (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-black/40 transition-all group">
                          <span className="text-xs text-white/70 flex items-center gap-2">
                            <Play size={10} className="text-red-400" /> {r.label}
                          </span>
                          <ExternalLink size={10} className="opacity-30 group-hover:opacity-70 transition-opacity shrink-0" />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showWeekView, setShowWeekView] = useState(false);
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [showUpdatesHub, setShowUpdatesHub] = useState(false);
  const [showSurvivalKit, setShowSurvivalKit] = useState(false);
  const [attendance, setAttendance] = useState<{ [key: string]: number }>({});
  const [attendanceMarked, setAttendanceMarked] = useState<{ [key: string]: boolean }>({});
  const [marks, setMarks] = useState<{ [key: string]: string }>({});
  const [calculatedCWA, setCalculatedCWA] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [daysToFinals, setDaysToFinals] = useState(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginMode, setLoginMode] = useState<'student' | 'admin'>('student');
  const [adminAccessCode, setAdminAccessCode] = useState('');
  const [mounted, setMounted] = useState(false);
  const [ventText, setVentText] = useState('');
  const [ventSubmitted, setVentSubmitted] = useState(false);
  const [vents, setVents] = useState<{ id: string; text: string; author: string; time: string }[]>([]);
  const [showDontPanic, setShowDontPanic] = useState(false);
  const [currentPun, setCurrentPun] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const notifScheduled = useRef(false);

  // ---- PUSH NOTIFICATIONS LOGIC ----
  const requestNotifications = async () => {
    if (!('Notification' in window)) return false;
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotificationsEnabled(true);
      if (typeof window !== 'undefined') localStorage.setItem('bme-notif-enabled', 'true');
      new Notification('BME Portal 🎓', { body: 'Notifications enabled! We\'ll remind you 30 mins before every class. 🔔' });
      return true;
    }
    return false;
  };

  const scheduleClassNotifications = () => {
    if (notifScheduled.current || typeof window === 'undefined') return;
    notifScheduled.current = true;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayClasses = TIMETABLE[days[new Date().getDay()]] || [];
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();

    todayClasses.forEach((cls: any) => {
      const startMins = timeToMinutes(cls.time.split(' - ')[0]);
      const notifyAt = startMins - 30; // 30 mins before
      const msUntil = (notifyAt - nowMins) * 60 * 1000;
      if (msUntil > 0) {
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(`⏰ ${cls.course} in 30 minutes!`, {
              body: `📍 ${cls.venue} • ${cls.time.split(' - ')[0]} start\nDon't forget your things! 🎒`,
            });
          }
        }, msUntil);
      }
    });
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedID = localStorage.getItem('bme-session-id');
      const isAdminAccess = localStorage.getItem('bme-admin-access') === 'true';
      if (savedID && CLASS_LIST[savedID]) {
        setStudentID(savedID); setStudentName(CLASS_LIST[savedID]); setIsLoggedIn(true);
        setIsAdmin(ADMIN_IDS.includes(savedID) || isAdminAccess);
      }
      const savedAtt = localStorage.getItem('bme-attendance');
      if (savedAtt) setAttendance(JSON.parse(savedAtt));
      const savedMarked = localStorage.getItem(`bme-marked-${savedID}`);
      if (savedMarked) setAttendanceMarked(JSON.parse(savedMarked));
      const savedNotes = localStorage.getItem('bme-notes');
      if (savedNotes) setNotes(savedNotes);
      const savedAnnouncements = localStorage.getItem('bme-announcements');
      if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
      const savedFiles = localStorage.getItem('bme-files');
      if (savedFiles) setFiles(JSON.parse(savedFiles));
      const savedVents = localStorage.getItem('bme-vents');
      if (savedVents) setVents(JSON.parse(savedVents));

      // Check if onboarding needed
      const onboarded = localStorage.getItem('bme-onboarded');
      if (!onboarded && savedID && CLASS_LIST[savedID]) setShowOnboarding(true);

      // Notifications
      const notifEnabled = localStorage.getItem('bme-notif-enabled') === 'true';
      if (notifEnabled) { setNotificationsEnabled(true); scheduleClassNotifications(); }
    }

    const finalsDate = new Date('2026-04-07T00:00:00');
    setDaysToFinals(Math.ceil((finalsDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    const punTimer = setInterval(() => setCurrentPun(p => (p + 1) % BME_PUNS.length), 15000);
    return () => clearInterval(punTimer);
  }, []);

  const completeOnboarding = async () => {
    if (typeof window !== 'undefined') localStorage.setItem('bme-onboarded', 'true');
    setShowOnboarding(false);
    await requestNotifications();
    scheduleClassNotifications();
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loginMode === 'admin') {
      if (adminAccessCode === 'ASANT3&GOD') proceedToLogin('22028883', true);
      else setLoginError('Invalid admin access code.');
      return;
    }
    if (!CLASS_LIST[studentID]) { setLoginError('Invalid Student ID.'); return; }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`pw-${studentID}`);
      if (!stored) {
        if (!isFirstLogin) setIsFirstLogin(true);
        else if (password.length < 4) setLoginError('Password too short.');
        else { localStorage.setItem(`pw-${studentID}`, password); proceedToLogin(studentID); }
      } else {
        if (password === stored) proceedToLogin(studentID);
        else setLoginError('Incorrect password.');
      }
    }
  };

  const proceedToLogin = (id: string, adminOverride = false) => {
    setStudentName(CLASS_LIST[id]); setStudentID(id); setIsLoggedIn(true);
    const adminStatus = adminOverride || ADMIN_IDS.includes(id);
    setIsAdmin(adminStatus);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bme-session-id', id);
      if (adminStatus) localStorage.setItem('bme-admin-access', 'true');
      const savedMarked = localStorage.getItem(`bme-marked-${id}`);
      if (savedMarked) setAttendanceMarked(JSON.parse(savedMarked));
      // Show onboarding for first-timers
      const onboarded = localStorage.getItem('bme-onboarded');
      if (!onboarded) setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') { localStorage.removeItem('bme-session-id'); localStorage.removeItem('bme-admin-access'); }
    setIsLoggedIn(false); setIsAdmin(false); setStudentID(''); setPassword(''); setAdminAccessCode(''); setLoginMode('student');
  };

  const markAttendance = (id: string) => {
    if (attendanceMarked[id]) return;
    const newAtt = { ...attendance, [id]: (attendance[id] || 0) + 1 };
    const newMarked = { ...attendanceMarked, [id]: true };
    setAttendance(newAtt); setAttendanceMarked(newMarked);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bme-attendance', JSON.stringify(newAtt));
      localStorage.setItem(`bme-marked-${studentID}`, JSON.stringify(newMarked));
    }
  };

  const handleCalculateCWA = () => {
    let weightedSum = 0, totalCredits = 0;
    COURSE_CREDITS.forEach(c => { const mark = parseFloat(marks[c.code] || '0'); if (mark > 0) { weightedSum += mark * c.credits; totalCredits += c.credits; } });
    setCalculatedCWA(totalCredits > 0 ? parseFloat((weightedSum / totalCredits).toFixed(2)) : null);
  };

  const handleVentSubmit = () => {
    if (!ventText.trim()) return;
    const newVent = { id: Date.now().toString(), text: ventText, author: studentName.split(' ')[0], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updated = [newVent, ...vents].slice(0, 20);
    setVents(updated);
    if (typeof window !== 'undefined') localStorage.setItem('bme-vents', JSON.stringify(updated));
    setVentText(''); setVentSubmitted(true);
    setTimeout(() => setVentSubmitted(false), 3000);
  };

  const handleExportProfile = () => {
    if (typeof window === 'undefined') return;
    const blob = new Blob([JSON.stringify({ studentID, studentName, attendance, attendanceMarked, notes }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `bme-profile-${studentID}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const handleImportProfile = (event: any) => {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const d = JSON.parse(e.target?.result as string);
        if (d.studentID !== studentID) { alert('Wrong profile!'); return; }
        setAttendance(d.attendance || {}); setAttendanceMarked(d.attendanceMarked || {}); setNotes(d.notes || '');
        if (typeof window !== 'undefined') { localStorage.setItem('bme-attendance', JSON.stringify(d.attendance || {})); localStorage.setItem(`bme-marked-${studentID}`, JSON.stringify(d.attendanceMarked || {})); localStorage.setItem('bme-notes', d.notes || ''); }
        alert('✅ Imported!');
      } catch { alert('❌ Invalid file!'); }
    };
    reader.readAsText(file); event.target.value = '';
  };

  const getAttendancePct = (classId: string, total: number) => total > 0 ? Math.round(((attendance[classId] || 0) / total) * 100) : 0;
  const getFirstName = (name: string) => name.split(' ')[0];
  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayName = daysList[new Date().getDay() - 1] || 'Weekend';
  const finalsInfo = getFinalsMessage(daysToFinals);

  if (!mounted) return null;

  // ============================================================
  // LOGIN SCREEN
  // ============================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <BioBackground />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
          <GlassCard className="p-8 border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#00d4ff]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#00d4ff] font-bold text-lg">BME</div>
              <h1 className="text-2xl font-black tracking-tight text-white">PORTAL ACCESS</h1>
              <p className="text-white/30 text-xs mt-1">KNUST BME1 • Class of 2029</p>
            </div>
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-2xl">
              <button onClick={() => { setLoginMode('student'); setLoginError(''); }} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition ${loginMode === 'student' ? 'bg-[#00d4ff] text-[#0a0f1c]' : 'text-slate-400'}`}>Student</button>
              <button onClick={() => { setLoginMode('admin'); setLoginError(''); setStudentID(''); setPassword(''); setIsFirstLogin(false); }} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition ${loginMode === 'admin' ? 'bg-red-500 text-white' : 'text-slate-400'}`}>Admin</button>
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
                  <div className="text-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <p className="text-xs font-bold text-red-500 uppercase">⚠️ Restricted Area</p>
                  </div>
                  <input type="password" placeholder="Admin Access Code" value={adminAccessCode} onChange={(e) => setAdminAccessCode(e.target.value)} className="w-full p-4 rounded-2xl bg-white/5 border border-red-500/30 text-center text-white outline-none focus:border-red-500" autoFocus />
                  <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase">Unlock Admin</button>
                </>
              )}
              {loginError && <p className="text-red-400 text-[10px] text-center font-bold uppercase">{loginError}</p>}
            </form>
            <div className="mt-6 p-3 bg-white/5 rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.p key={currentPun} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.4 }}
                  className="text-white/30 text-[10px] text-center italic">{BME_PUNS[currentPun]}</motion.p>
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================
  return (
    <div className="min-h-screen text-slate-100 pb-20">
      <BioBackground />

      <AnimatePresence>
        {showDontPanic && <DontPanic onClose={() => setShowDontPanic(false)} />}
        {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}
        {showSurvivalKit && <SurvivalKitModal onClose={() => setShowSurvivalKit(false)} />}
      </AnimatePresence>

      {/* HEADER */}
      <header className="sticky top-0 z-40 p-4">
        <GlassCard className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center rounded-full border-white/10">
          <div>
            <h1 className="text-lg font-bold">Hello, {getFirstName(studentName)} 👋</h1>
            <p className="text-[10px] text-[#48cae4] font-bold uppercase tracking-widest flex items-center gap-1">
              <Activity size={10} className="animate-pulse" /> ID: {studentID}
              {notificationsEnabled && <span className="ml-2 text-emerald-400">• 🔔 Active</span>}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {isAdmin && <Link href="/admin" className="p-2 bg-yellow-500/20 text-yellow-500 rounded-xl text-[10px] font-bold flex items-center px-4 uppercase">Admin</Link>}
            {!notificationsEnabled && (
              <button onClick={requestNotifications} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all flex items-center gap-1 px-3">
                <Bell size={14} /><span className="text-[10px] font-bold uppercase hidden md:inline">Enable Alerts</span>
              </button>
            )}
            <button onClick={() => setShowDontPanic(true)} className="p-2 bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all flex items-center gap-1 px-3">
              <Zap size={16} /><span className="text-[10px] font-bold uppercase hidden md:inline">Panic</span>
            </button>
            <button onClick={handleExportProfile} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all flex items-center gap-1 px-3">
              <Download size={16} /><span className="text-[10px] font-bold uppercase hidden md:inline">Export</span>
            </button>
            <label className="p-2 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-all flex items-center gap-1 px-3 cursor-pointer">
              <Upload size={16} /><span className="text-[10px] font-bold uppercase hidden md:inline">Import</span>
              <input type="file" accept="application/json,.json" onChange={handleImportProfile} className="hidden" />
            </label>
            <button onClick={handleLogout} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"><LogOut size={18} /></button>
          </div>
        </GlassCard>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="https://chat.whatsapp.com/EqsJ9zo4goBA6RFjv035Ei" target="_blank" className="p-4 bg-green-500/10 border border-green-500/20 rounded-3xl flex flex-col items-center gap-2 hover:bg-green-500/20 transition-all">
            <MessageCircle className="text-green-400" /><span className="text-[10px] font-bold uppercase">WhatsApp</span>
          </a>
          <button onClick={() => setShowSurvivalKit(true)} className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex flex-col items-center gap-2 hover:bg-blue-500/20 transition-all">
            <BookOpen className="text-blue-400" /><span className="text-[10px] font-bold uppercase">Survival Kit</span>
          </button>
          <button onClick={() => setShowCWAModal(true)} className="p-4 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-3xl flex flex-col items-center gap-2 hover:bg-[#00d4ff]/20 transition-all">
            <Calculator className="text-[#00d4ff]" /><span className="text-[10px] font-bold uppercase">CWA Calc</span>
          </button>
          <button onClick={() => setShowUpdatesHub(true)} className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex flex-col items-center gap-2 hover:bg-purple-500/20 transition-all relative">
            <Bell className="text-purple-400" /><span className="text-[10px] font-bold uppercase">Updates Hub</span>
            {announcements.length > 0 && <div className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black">{announcements.length}</div>}
          </button>
        </div>

        {/* FINALS COUNTDOWN */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group" delay={0.05}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">Finals Countdown — April 7, 2026</p>
          <div className="flex items-baseline gap-3 my-2">
            <motion.p key={daysToFinals} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-7xl font-black text-white group-hover:scale-110 transition-transform">
              {daysToFinals > 0 ? daysToFinals : '🎉'}
            </motion.p>
            {daysToFinals > 0 && <span className="text-white/40 font-bold uppercase text-sm">days</span>}
          </div>
          <p className={`text-sm font-bold mt-1 ${finalsInfo.color}`}>{finalsInfo.msg}</p>
        </GlassCard>

        {/* TIMETABLE + 70% TRACKER */}
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
            {(showWeekView ? daysList : [todayName]).map(day => (
              <div key={day} className="space-y-4">
                {showWeekView && <h3 className="text-[#48cae4] font-black text-[10px] uppercase tracking-[0.2em] pl-2 border-l-2 border-[#48cae4] mb-4">{day}</h3>}
                {TIMETABLE[day]?.length ? TIMETABLE[day].map((cls: any) => {
                  const pct = getAttendancePct(cls.id, cls.totalClasses);
                  const isSafe = pct >= 70;
                  return (
                    <div key={cls.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex gap-4 items-center">
                          <div className="text-[10px] font-bold opacity-40 bg-white/5 p-2 rounded-lg min-w-[48px] text-center">
                            <div>ENDS</div><div className="text-[#00d4ff]">{cls.time.split(' - ')[1]}</div>
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-white">{cls.course}</h4>
                            <p className="text-[10px] opacity-50 font-bold uppercase">📍 {cls.venue} • {cls.lecturer}</p>
                            <p className="text-[9px] opacity-30 font-bold mt-1">{cls.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 justify-between md:justify-end">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${cls.type === 'Lab' ? 'bg-amber-500/20 text-amber-500' : 'bg-[#00d4ff]/20 text-[#00d4ff]'}`}>{cls.type}</span>
                          <button onClick={() => markAttendance(cls.id)} disabled={attendanceMarked[cls.id]}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${attendanceMarked[cls.id] ? 'bg-emerald-500 text-white cursor-not-allowed' : 'bg-white/5 text-slate-400 hover:bg-white/10 cursor-pointer'}`}>
                            {attendanceMarked[cls.id] ? <span className="flex items-center gap-1"><CheckCircle size={12} /> MARKED</span> : 'MARK PRESENT'}
                          </button>
                        </div>
                      </div>
                      {/* 70% BAR */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold uppercase opacity-40">Attendance {attendance[cls.id] || 0}/{cls.totalClasses} ({pct}%)</span>
                          {isSafe
                            ? <span className="text-[9px] font-black text-emerald-400 flex items-center gap-1"><CheckCircle size={10} /> Exam Eligible! 🚀</span>
                            : <span className="text-[9px] font-black text-red-400 flex items-center gap-1"><AlertTriangle size={10} /> Danger Zone ⚠️</span>}
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8 }}
                            className={`h-full rounded-full ${isSafe ? 'bg-emerald-400' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-500'}`} />
                        </div>
                      </div>
                    </div>
                  );
                }) : <p className="text-[10px] opacity-30 italic py-4 text-center uppercase tracking-widest">Rest Day — your body thanks you. 🙏</p>}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* NOTES + STRESS SLIDER */}
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard className="p-6 flex flex-col h-64" delay={0.2}>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={16} className="text-[#00d4ff]" /> Quick Notes</h3>
            <textarea value={notes} onChange={(e) => { setNotes(e.target.value); if (typeof window !== 'undefined') localStorage.setItem('bme-notes', e.target.value); }} placeholder="Jot down something..." className="flex-1 w-full bg-transparent border-0 outline-none text-sm leading-relaxed resize-none text-slate-300 placeholder:text-slate-600" />
          </GlassCard>
          <GlassCard className="p-6 flex flex-col h-64 justify-between" delay={0.3}>
            <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2"><FileText size={16} className="text-emerald-400" /> Class Resources</h3>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg viewBox="0 0 87.3 78" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-xs mb-1">Shared lecture notes, past papers & more</p>
                <p className="text-white/30 text-[10px]">BME1 Class Drive Folder</p>
              </div>
            </div>
            <a href="https://drive.google.com/drive/folders/1QsLCU6OA8fswVkqO4A09ynnXSbk3PsWk" target="_blank" rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl text-[10px] font-black uppercase text-center flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-all">
              <ExternalLink size={12} /> Open Class Drive
            </a>
          </GlassCard>
        </div>

        {/* THE DEPARTMENT VENT */}
        <GlassCard className="p-6 md:p-8" delay={0.4}>
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-1">
            <Laugh className="text-yellow-400" /> The Department Vent
          </h2>
          <p className="text-white/30 text-xs mb-6">Anonymous ideas & complaints. Admin sees these. No cap. 👀</p>
          <textarea value={ventText} onChange={(e) => setVentText(e.target.value.slice(0, 280))} placeholder="What would make BME better? (Besides free food and shorter lab reports)..." className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-yellow-400/50 resize-none h-24 transition-colors" />
          <div className="flex justify-between items-center mt-3">
            <span className="text-[10px] opacity-30">{ventText.length}/280</span>
            <button onClick={handleVentSubmit} disabled={!ventText.trim() || ventSubmitted}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 transition-all ${ventSubmitted ? 'bg-emerald-500 text-white' : 'bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/30 disabled:opacity-40'}`}>
              {ventSubmitted ? <><CheckCircle size={12} /> Sent! 🎉</> : <><Send size={12} /> Submit</>}
            </button>
          </div>
          {vents.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">Recent Vents</p>
              {vents.slice(0, 3).map((v) => (
                <div key={v.id} className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-sm text-white/80">{v.text}</p>
                  <p className="text-[9px] opacity-30 mt-1 font-bold">{v.author} • {v.time}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* KNUST PUN TICKER */}
        <GlassCard className="p-5" delay={0.5}>
          <div className="flex items-center gap-3">
            <Coffee className="text-amber-400 shrink-0" size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase opacity-30 mb-1">KNUST BME Energy ☕</p>
              <AnimatePresence mode="wait">
                <motion.p key={currentPun} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.4 }}
                  className="text-sm text-white/70 italic">{BME_PUNS[currentPun]}</motion.p>
              </AnimatePresence>
            </div>
            <button onClick={() => setCurrentPun(p => (p + 1) % BME_PUNS.length)} className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white/70 transition-all shrink-0 text-xs">→</button>
          </div>
        </GlassCard>

      </main>

      {/* CWA MODAL */}
      <AnimatePresence>
        {showCWAModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-8 relative">
              <button onClick={() => setShowCWAModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
              <h2 className="text-xl font-black mb-2 text-white uppercase flex items-center gap-2"><Calculator className="text-[#00d4ff]" /> CWA Calculator</h2>
              <p className="text-white/30 text-xs mb-6">Enter marks. Pray. Calculate. 🙏</p>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto mb-6 pr-2">
                {COURSE_CREDITS.map(c => (
                  <div key={c.code} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div><p className="font-bold text-xs uppercase text-white">{c.code}</p><p className="text-[10px] opacity-40">{c.name} • {c.credits} cr</p></div>
                    <input type="number" placeholder="0" min="0" max="100" className="w-16 p-2 rounded-xl bg-black/20 text-center font-bold text-[#00d4ff] outline-none border border-transparent focus:border-[#00d4ff]"
                      onChange={(e) => { const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0)); setMarks({ ...marks, [c.code]: v.toString() }); e.target.value = v.toString(); }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-6">
                <span className="font-bold text-xs opacity-50 uppercase">Predicted CWA</span>
                <span className="text-4xl font-black text-[#00d4ff]">{calculatedCWA || '--'}</span>
              </div>
              <button onClick={handleCalculateCWA} className="w-full py-4 bg-[#00d4ff] text-[#0a0f1c] rounded-2xl font-black text-xs uppercase">Calculate Score</button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPDATES HUB */}
      <AnimatePresence>
        {showUpdatesHub && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowUpdatesHub(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white text-2xl">✕</button>
              <h2 className="text-2xl font-black mb-6 text-white uppercase flex items-center gap-2"><Bell className="text-purple-400" /> Updates Hub</h2>
              <div className="mb-8">
                <h3 className="text-lg font-black mb-4 text-white">📢 Announcements ({announcements.length})</h3>
                {announcements.length === 0 ? <p className="text-center py-8 opacity-50 text-sm">No announcements yet. Enjoy the silence. 🤫</p> : (
                  <div className="space-y-3">{announcements.map((ann: any) => (
                    <div key={ann.id} className={`p-4 rounded-2xl border-l-4 ${ann.type === 'urgent' ? 'border-red-500 bg-red-500/10' : 'border-blue-500 bg-blue-500/10'}`}>
                      <p className="text-sm text-white">{ann.text}</p><p className="text-xs opacity-50 mt-1">{ann.date}</p>
                    </div>
                  ))}</div>
                )}
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-black mb-4 text-white">📁 Shared Files ({files.length})</h3>
                {files.length === 0 ? <p className="text-center py-8 opacity-50 text-sm">No files yet. 😅</p> : (
                  <div className="grid md:grid-cols-2 gap-4">{files.map((file: any) => (
                    <div key={file.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="font-black text-sm text-white">{file.course}</p>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="mt-2 block w-full p-2 bg-blue-600 text-white rounded-lg text-xs font-bold text-center hover:bg-blue-700 transition">Open File</a>
                    </div>
                  ))}</div>
                )}
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm font-bold text-emerald-400">All courses on schedule ✅</p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
