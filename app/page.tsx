"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Calculator, MessageCircle, BookOpen, Bell, LogOut, Activity,
  Download, Upload, CheckCircle, Send, Zap, Coffee, Laugh,
  Play, ChevronRight, X, ExternalLink, MessageSquare, Home as HomeIcon,
  Calendar, BarChart2, User, Menu, ChevronDown, Clock, MapPin,
  TrendingUp, AlertCircle, FileText, Star
} from "lucide-react";

// ============================================================
// DATA
// ============================================================

const ADMIN_IDS = ["22028883"];
const GHOST_ID = "BME_BETA1";

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
  "21896223": "Maya", "22184311": "Jenefails Akuffo-Gyan", "22710811": "Josephine Nana Akosua Pinamang Gyebi",
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
  "BME_BETA1": "Beta Tester",
};

const COURSE_CREDITS = [
  { code: "MATH 152", name: "Calculus", credits: 4 },
  { code: "COE 152", name: "Basic Electronics", credits: 3 },
  { code: "BME 166", name: "Biochemistry", credits: 3 },
  { code: "PHY 154", name: "Properties of Matter", credits: 3 },
  { code: "ME 166", name: "Applied Thermodynamics", credits: 2 },
  { code: "ENGL 158", name: "Comm. Skills II", credits: 2 },
  { code: "SOC 152", name: "Sociology", credits: 2 },
];

const COURSE_COLORS: Record<string, string> = {
  "SOC 152": "#22c55e",
  "COE 152": "#f59e0b",
  "BME 166": "#3b82f6",
  "MATH 152": "#8b5cf6",
  "MATH 152 A": "#8b5cf6",
  "MATH 152 B": "#8b5cf6",
  "PHY 154": "#06b6d4",
  "ME 166": "#f97316",
  "ENGL 158": "#ec4899",
};

const TIMETABLE: { [key: string]: any[] } = {
  Monday: [
    { id: "m1", time: "13:00 - 14:55", course: "PHY 154", venue: "Room G01", lecturer: "R. M. Noye", type: "Lecture", weekday: 1 },
    { id: "m2", time: "15:00 - 16:55", course: "ENGL 158", venue: "Eng. Audit", lecturer: "Z. Osei", type: "Lecture", weekday: 1 },
  ],
  Tuesday: [
    { id: "t1", time: "08:00 - 09:55", course: "SOC 152", venue: "PB012", lecturer: "O. K. J. R. Kwabena", type: "Lecture", weekday: 2 },
    { id: "t2", time: "10:30 - 12:25", course: "COE 152", venue: "PB020", lecturer: "D. A. Addo", type: "Lecture", weekday: 2 },
    { id: "t3", time: "13:00 - 14:55", course: "BME 166", venue: "PB020", lecturer: "C. Apprey", type: "Lecture", weekday: 2 },
  ],
  Wednesday: [
    { id: "w1", time: "08:00 - 09:55", course: "MATH 152 A", venue: "NEB-GF", lecturer: "J. K. K. Asamoah", type: "Lecture", weekday: 3 },
  ],
  Thursday: [
    { id: "th1", time: "13:00 - 14:55", course: "MATH 152 B", venue: "NEB-FF1", lecturer: "J. K. K. Asamoah", type: "Lecture", weekday: 4 },
  ],
  Friday: [
    { id: "f1", time: "08:00 - 09:55", course: "ME 166", venue: "NEB-FF2", lecturer: "K. O. Amoabeng", type: "Lecture", weekday: 5 },
    { id: "f2", time: "10:30 - 11:25", course: "COE 152", venue: "Lab", lecturer: "D. A. Addo", type: "Lab", weekday: 5 },
  ],
};

const SURVIVAL_KIT = [
  {
    course: "MATH 152 — CALCULUS WITH ANALYSIS", color: "#8b5cf6", emoji: "🧮",
    resources: [{ label: "Calculus 1/Math 152- Full Playlist(Skancity Academy)", url: "https://www.youtube.com/playlist?list=PLInywrvFyvq6_G3iA7LHbt5exJgGbp4Ok" },
    { label: "Calculus Tutorials-Finish Calculus 1 in just 19 videos", url: "https://www.youtube.com/playlist?list=PLLRIy3Upn5vLRQWLdtVN_OkMYobabpj0i" },
    { label: "Calculus in 22 days- with simply 4 videos a day finish Calculus in just 3 weeks", url: "https://www.youtube.com/playlist?list=PLLRIy3Upn5vJ6TW_6ex6cMXWhcvAt3JZl" },
    ]
  },

  {
    course: "ME 166 — Basic Electronics", color: "#f97316", emoji: "🪫",
    resources: [
      { label: "Basic Electronics-KNUST(Maths Hub GH)", url: "https://www.youtube.com/playlist?list=PLldc0i2lkatVFhbnQRS-dOcI6xRdTJ0Lm" },
      { label: "SemiConductors", url: "https://youtu.be/ErcH_OuCaNY?si=woPM9OXzL6NrihZe" },
      { label: "Half-Wave Rectification", url: "https://youtu.be/CpcJxhFnmMo?si=8l5HO3BrsVDO3fgk" },
      { label: "Full-Wave Rectification", url: "https://youtu.be/quyqtaKIr78?si=pMMeyYYVmKqkhHGg" },
      { label: "Full-Wave Rectification (Demonstration)", url: "https://youtu.be/dNi_T0P5TLk?si=spqbtmaZ8CEkZyWk" },
      { label: "Diodes", url: "https://youtu.be/n4XZ02N11Hc?si=hhDRvOEa4MtBWwsP" },
      { label: "Solving Diode Circuits", url: "https://youtu.be/sDWWGhuRqFs?si=MozZmpTDcPLBV8dh" },
      { label: "Basic Electronics for Begginers (Organic Chem Tutor)", url: "https://youtu.be/uXr4lXYjXuU?list=PL0o_zxa4K1BV9E-N8tSExU1djL6slnjbL" },

    ]
  },
  {
    course: "BME 166 — Biochemistry", color: "#f59e0b", emoji: "⚕️",
    resources: [
      { label: "Biochemistry (Ninja Nerd) Playlist ", url: "https://www.youtube.com/playlist?list=PLTF9h-T1TcJhcNo9M1VFXz6rMKT6CM_wd" },
      { label: "Metabolism (Ninja Nerd) Playlist", url: "https://www.youtube.com/watch?v=4eLjRcHnMCk&list=PLTF9h-T1TcJhcNo9M1VFXz6rMKT6CM_wd" },
      { label: "Drug Metabolism", url: "https://youtu.be/qvucMHUVZA4?si=6w3bg-OtR_dZxIt6" },
      { label: "Pharmacokinetics simplified", url: "https://youtu.be/16wNysLC9Fs?si=GUyEDdHymiWSSvD" },
      { label: "Fatty Acid Metabolism", url: "https://youtu.be/uYutpPY7xcw?si=OcIViUwwzDZLqNAh" },
    ]
  },
  {
    course: "ME 166 — Applied thermodynamics", color: "#22c55e", emoji: "⚙️",
    resources: [
      { label: "Engineering Thermodynamics I Online Course", url: "https://www.youtube.com/playlist?list=PLISIF5ACui17dQ5VbzxNu9QtMnfKb856n" },
      { label: "First Law of Thermodynamics Open Systems 1(Control Volume Analysis)", url: "https://www.youtube.com/watch?v=VBdapBeycv4&list=PLKnQ46F19QdhH1ykna30gNoHBr_bJjGBH" },
      { label: "First Law of Thermodynamics Open Systems 2(Enthalpy)", url: "https://www.youtube.com/watch?v=ReOaRZA2eLo&list=PLKnQ46F19QdhH1ykna30gNoHBr_bJjGBH&index=2" },
      { label: "Turbines, Throttles, Nozzles, Fans, and Heaters", url: "https://www.youtube.com/watch?v=WAHa3y7NEsk&list=PLKnQ46F19QdhH1ykna30gNoHBr_bJjGBH&index=5" },
      { label: "Entropy: Thermodynamics - Second Law", url: "https://www.youtube.com/watch?v=QBd2zraOe2k" },
    ]
  },
  {
    course: "PHY 154 — Properties of Matter ", color: "#06b6d4", emoji: "🧪",
    resources: [{ label: "Density", url: "youtube.com/watch?v=NL9LRvcWxHs&pp=ygUURGVuc2l0eSBsZWN0dXJlIGZ1bGw%3D" },
    { label: "Fortins Barometer", url: "https://www.youtube.com/watch?v=S4pUMNdSIYk" },
    { label: "Variation of atmospheric pressure with altitude", url: "https://youtu.be/WGxuELoFzO4?si=nNJskZvYXo0Wvo9p" },
    { label: "Bernoulli's Equation Example Problems, Fluid Mechanics", url: "https://www.youtube.com/watch?v=xTAfyc06ZxQ" },
    { label: "Bernoulli's Principle Demo: Levitated Balls", url: "https://www.youtube.com/watch?v=Ye3QPgDdJNg" },
    { label: "Torricelli's Theorem -Explained", url: "https://youtu.be/2vfTwnlsrCM?si=nkc2XVXY6nxZCTAU" },
    { label: "Torricelli's Law in 2 minutes", url: "https://youtu.be/LNgrIssGZlc?si=XLYtVYkwWHNv-b9S" },
    { label: "Torricelli's Theorem practice problems", url: "https://www.youtube.com/watch?v=046-DygKrhc" },
    { label: "What is pitot tube? 3D Animation", url: "https://youtu.be/3zEdtkuNYLU?si=66XMbfPdG3ykQLM6" },
    { label: "Pitot Static Tube Introduction & Example", url: "https://www.youtube.com/watch?v=VOMO7zsvHsM" },
    { label: "Streamlines and Velocity", url: "https://youtu.be/AGve4RZ4zjw?si=yVwwXP6W9udDhT-_" },
    { label: "Streamlines and Velocity 2", url: "https://youtu.be/kDO3EcXblwg?si=Z4Ix44waDRcyxQPn" },
    { label: "Steady vs Unsteady Flow", url: "https://youtu.be/-a7EtooUf5U?si=LNGn5kMW1HF2fiUq" },
    { label: "Elasticity", url: "https://www.youtube.com/watch?v=HALbtyDUjp0&pp=ygUXZWxhc3RpY2l0eSBmdWxsIGxlY3R1cmU%3D" },
    { label: "Poiseuille's Law - Pressure Difference-Volume Flow Rate", url: "https://youtu.be/UeQu19VChjE?si=8ZFcvj7jwmA7FfRa" },
    { label: "Viscosity of Fluids& Velocity Gradient", url: "https://youtu.be/PoG14wRRQmM?si=pR7OFoRmBhoUYPwD" },
    { label: "★Newtons law of viscosity ★Stoke's law ★Terminal velocity", url: "https://youtu.be/tWO-NikCrzs?si=HHl_lcQShn_hWq1k" },

    ]
  },
];


const END_OF_SEM_DATE = new Date("2026-09-04T00:00:00");
const MID_SEM_START = new Date("2026-07-06T00:00:00");
const EXAMS_START = new Date("2026-08-17T00:00:00");
const PORTAL_VERSION = "2.1.0";

// ── Semester session calculation ─────────────────────────────────────────────
const SEM_START = new Date("2026-05-25T00:00:00");

/** Periods that contain no teaching: mid-sem break + exam period */
const EXCLUDED_RANGES: [Date, Date][] = [
  [new Date("2026-07-06T00:00:00"), new Date("2026-07-10T00:00:00")],
  [new Date("2026-08-17T00:00:00"), new Date("2026-09-04T00:00:00")],
];

/** Returns true if the given date falls inside an excluded period. */
const isExcluded = (date: Date): boolean =>
  EXCLUDED_RANGES.some(([s, e]) => date >= s && date <= e);

/**
 * Counts how many teaching occurrences of a given ISO weekday (0 Sun … 6 Sat)
 * fall between SEM_START and END_OF_SEM_DATE, excluding break/exam periods.
 */
const calcTotalSemesterSessions = (weekday: number): number => {
  let count = 0;
  const cursor = new Date(SEM_START);
  while (cursor <= END_OF_SEM_DATE) {
    if (cursor.getDay() === weekday && !isExcluded(new Date(cursor))) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
};

/** Pre-computed totals: Mon=1 … Fri=5 */
const SESSIONS_BY_WEEKDAY: Record<number, number> = {
  1: calcTotalSemesterSessions(1),
  2: calcTotalSemesterSessions(2),
  3: calcTotalSemesterSessions(3),
  4: calcTotalSemesterSessions(4),
  5: calcTotalSemesterSessions(5),
};

/** Courses below this attendance % are flagged "At Risk" */
const AT_RISK_THRESHOLD = 70;

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// ============================================================
// HELPER COMPONENTS
// ============================================================

const Avatar = ({ name, size = 36 }: { name: string; size?: number }) => {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <div
      style={{ width: size, height: size, borderRadius: size / 2, background: "linear-gradient(135deg, #e8d5c4, #c9a87c)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
    >
      <span style={{ fontSize: size * 0.36, fontWeight: 700, color: "#5c3d1e", fontFamily: "'Syne', sans-serif" }}>{initials}</span>
    </div>
  );
};

const AttendanceBadge = ({ pct }: { pct: number }) => {
  const color = pct >= AT_RISK_THRESHOLD ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const label = pct >= AT_RISK_THRESHOLD ? "On track" : pct >= 50 ? "At Risk ⚠" : "At Risk 🚨";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + "18", color }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: color, display: "inline-block" }} /> {label}
    </span>
  );
};

// ============================================================
// AI CHATBOT
// ============================================================
const BMEChatbot = ({ studentName, studentID }: { studentName: string; studentID: string }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: `Hey ${studentName.split(" ")[0]} 👋 I'm your BME assistant. I know your timetable and can help with CWA calculations. What do you need?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: userMsg }].map((m) => ({ role: m.role, content: m.content })), studentName, studentID }),
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "Something went wrong." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Could not reach the server. Check your connection." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <div style={{ position: "fixed", bottom: 88, right: 16, zIndex: 70 }}>
        <button
          onClick={() => setOpen((o) => !o)}
          data-chatbot-toggle="true"
          style={{ width: 52, height: 52, borderRadius: 26, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: open ? "#f0ebe3" : "#2d2416", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "all 0.2s" }}
        >
          {open ? <X size={18} color="#8b7355" /> : <MessageSquare size={20} color="#f0ebe3" />}
        </button>
        {!open && (
          <span style={{ position: "absolute", top: -4, right: -4, background: "#f59e0b", color: "#fff", fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 10, letterSpacing: 0.5 }}>BETA</span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ position: "fixed", bottom: 152, right: 12, zIndex: 70, width: "min(370px, calc(100vw - 24px))", borderRadius: 20, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden", border: "1px solid #ece8e0" }}
          >
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0ebe3", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare size={14} color="#8b7355" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1208", margin: 0 }}>BME Assistant</p>
                <p style={{ fontSize: 10, color: "#a8967a", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>Powered by Groq · Beta</p>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: "#22c55e" }} />
                <span style={{ fontSize: 10, color: "#22c55e" }}>Online</span>
              </div>
            </div>
            <div style={{ height: 260, overflowY: "auto", padding: "14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: 13, lineHeight: 1.5, background: msg.role === "user" ? "#2d2416" : "#f7f3ed", color: msg.role === "user" ? "#f0ebe3" : "#3d2e1a" }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ background: "#f7f3ed", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 4 }}>
                    {[0, 150, 300].map((d) => (
                      <div key={d} style={{ width: 7, height: 7, borderRadius: 3.5, background: "#c9a87c", animation: "bounce 1.2s infinite", animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {messages.length === 1 && (
              <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Today's timetable", "Calculate CWA", "What's next?"].map((s) => (
                  <button key={s} onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
                    style={{ fontSize: 11, padding: "5px 10px", borderRadius: 12, border: "1px solid #ece8e0", background: "#faf8f4", color: "#6b5438", cursor: "pointer", fontWeight: 500 }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div style={{ padding: "10px 14px", borderTop: "1px solid #f0ebe3", display: "flex", gap: 8 }}>
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything…"
                style={{ flex: 1, padding: "9px 12px", borderRadius: 12, border: "1px solid #ece8e0", background: "#faf8f4", fontSize: 13, outline: "none", color: "#1a1208" }} />
              <button onClick={sendMessage} disabled={!input.trim() || loading}
                style={{ width: 38, height: 38, borderRadius: 12, border: "none", background: "#2d2416", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: !input.trim() || loading ? 0.4 : 1 }}>
                <Send size={15} color="#f0ebe3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================
// SURVIVAL KIT MODAL
// ============================================================
const SurvivalKitModal = ({ onClose }: { onClose: () => void }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 560, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0ebe3" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1208", margin: 0 }}>📚 Survival Kit</h2>
            <p style={{ fontSize: 12, color: "#a8967a", margin: "2px 0 0" }}>Curated resources for every course</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid #ece8e0", background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="#8b7355" />
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {SURVIVAL_KIT.map((kit) => (
            <div key={kit.course} style={{ borderRadius: 14, border: "1px solid #ece8e0", overflow: "hidden" }}>
              <button onClick={() => setExpanded(expanded === kit.course ? null : kit.course)}
                style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#faf8f4", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: kit.color, display: "inline-block" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1208" }}>{kit.course}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#a8967a" }}>{kit.resources.length} links</span>
                  <ChevronRight size={14} color="#a8967a" style={{ transform: expanded === kit.course ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </span>
              </button>
              {expanded === kit.course && (
                <div style={{ padding: "8px 16px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {kit.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: "#fff", border: "1px solid #f0ebe3", textDecoration: "none" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#3d2e1a" }}>
                        <Play size={11} color="#ef4444" fill="#ef4444" /> {r.label}
                      </span>
                      <ExternalLink size={11} color="#c9b89a" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// CWA MODAL
// ============================================================
const CWAModal = ({ onClose }: { onClose: () => void }) => {
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [cwa, setCwa] = useState<number | null>(null);

  const calculate = () => {
    let ws = 0, tc = 0;
    COURSE_CREDITS.forEach((c) => { const m = parseFloat(marks[c.code] || "0"); if (m > 0) { ws += m * c.credits; tc += c.credits; } });
    setCwa(tc > 0 ? parseFloat((ws / tc).toFixed(2)) : null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 400, overflow: "hidden" }}>
        <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0ebe3" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1208", margin: 0 }}>CWA Calculator</h2>
            <p style={{ fontSize: 12, color: "#a8967a", margin: "2px 0 0" }}>Enter scores to project your CWA</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid #ece8e0", background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="#8b7355" />
          </button>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, maxHeight: "45vh", overflowY: "auto" }}>
          {COURSE_CREDITS.map((c) => (
            <div key={c.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: "#faf8f4", border: "1px solid #f0ebe3" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1208", margin: 0 }}>{c.code}</p>
                <p style={{ fontSize: 11, color: "#a8967a", margin: "1px 0 0" }}>{c.name} · {c.credits} cr</p>
              </div>
              <input type="number" placeholder="—" min={0} max={100}
                onChange={(e) => { const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0)); setMarks({ ...marks, [c.code]: v.toString() }); e.target.value = v.toString(); }}
                style={{ width: 56, padding: "6px 8px", borderRadius: 10, border: "1px solid #ece8e0", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#3d2e1a", outline: "none", background: "#fff" }} />
            </div>
          ))}
        </div>
        {cwa !== null && (
          <div style={{ margin: "0 16px", padding: "14px 18px", borderRadius: 14, background: "#faf8f4", border: "1px solid #ece8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#8b7355", fontWeight: 600 }}>Projected CWA</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: cwa >= 70 ? "#22c55e" : cwa >= 60 ? "#f59e0b" : "#ef4444" }}>{cwa}</span>
          </div>
        )}
        <div style={{ padding: "14px 16px 20px" }}>
          <button onClick={calculate}
            style={{ width: "100%", padding: "13px", borderRadius: 14, border: "none", background: "#2d2416", color: "#f0ebe3", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Calculate
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// UPDATES MODAL
// ============================================================
const UpdatesModal = ({ announcements, files, onClose }: { announcements: any[]; files: any[]; onClose: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    onClick={onClose}>
    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
      onClick={(e) => e.stopPropagation()}
      style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 560, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0ebe3" }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1208", margin: 0 }}>Updates</h2>
          <p style={{ fontSize: 12, color: "#a8967a", margin: "2px 0 0" }}>Announcements & shared files</p>
        </div>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid #ece8e0", background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={14} color="#8b7355" />
        </button>
      </div>
      <div style={{ overflowY: "auto", padding: "14px 16px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#a8967a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Announcements</p>
        {announcements.length === 0 ? (
          <p style={{ fontSize: 13, color: "#c9b89a", textAlign: "center", padding: "24px 0" }}>No announcements yet.</p>
        ) : announcements.map((a: any) => (
          <div key={a.id} style={{ padding: "12px 14px", borderRadius: 12, borderLeft: `3px solid ${a.type === "urgent" ? "#ef4444" : "#3b82f6"}`, background: a.type === "urgent" ? "#fef2f2" : "#eff6ff", marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: "#1a1208", margin: "0 0 3px" }}>{a.text}</p>
            <p style={{ fontSize: 10, color: "#a8967a", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>{a.date}</p>
          </div>
        ))}
        {files.length > 0 && (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#a8967a", textTransform: "uppercase", letterSpacing: 1, margin: "16px 0 8px" }}>Shared Files</p>
            {files.map((f: any) => (
              <div key={f.id} style={{ padding: "12px 14px", borderRadius: 12, background: "#faf8f4", border: "1px solid #ece8e0", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1208", margin: 0 }}>{f.course}</p>
                <a href={f.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, fontWeight: 600, color: "#8b7355", padding: "5px 12px", borderRadius: 8, background: "#f0ebe3", textDecoration: "none" }}>Open</a>
              </div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  </motion.div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentID, setStudentID] = useState("");
  const [password, setPassword] = useState("");
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [firstLoginStep, setFirstLoginStep] = useState<"password" | "security">("password");
  const [tempPassword, setTempPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetID, setResetID] = useState("");
  const [resetAnswer, setResetAnswer] = useState("");
  const [resetNewPw, setResetNewPw] = useState("");
  const [resetStep, setResetStep] = useState<"verify" | "newpw">("verify");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loginMode, setLoginMode] = useState<"student" | "admin">("student");
  const [adminAccessCode, setAdminAccessCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"home" | "schedule" | "progress" | "profile">("home");
  const [showWeekView, setShowWeekView] = useState(false);
  const [scheduleView, setScheduleView] = useState<"today" | "week" | "grid">("today");
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [showUpdatesHub, setShowUpdatesHub] = useState(false);
  const [showSurvivalKit, setShowSurvivalKit] = useState(false);
  const [attendance, setAttendance] = useState<{ [key: string]: number }>({});
  const [attendanceMarked, setAttendanceMarked] = useState<{ [key: string]: boolean }>({});
  const [daysToEnd, setDaysToEnd] = useState(0);
  const [daysToMidSem, setDaysToMidSem] = useState(0);
  const [daysToExams, setDaysToExams] = useState(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [nextClassInfo, setNextClassInfo] = useState<{ course: string; venue: string; startTime: string; minsUntil: number } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");
  const [timerSessions, setTimerSessions] = useState(0);
  const [focusMins, setFocusMins] = useState(25);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedID = localStorage.getItem("bme-session-id");
      if (savedID && CLASS_LIST[savedID]) {
        setStudentID(savedID); setStudentName(CLASS_LIST[savedID]); setIsLoggedIn(true);
        setIsAdmin(ADMIN_IDS.includes(savedID) || localStorage.getItem("bme-admin-access") === "true");
      }
      const savedAtt = localStorage.getItem("bme-attendance");
      if (savedAtt) setAttendance(JSON.parse(savedAtt));
      const savedMarked = localStorage.getItem(`bme-marked-${savedID}`);
      if (savedMarked) setAttendanceMarked(JSON.parse(savedMarked));
      const savedAnn = localStorage.getItem("bme-announcements");
      if (savedAnn) setAnnouncements(JSON.parse(savedAnn));
      const savedFiles = localStorage.getItem("bme-files");
      if (savedFiles) setFiles(JSON.parse(savedFiles));
    } // Closes the 'if (typeof window !== "undefined")' block

    // Restored: Semester countdown
    setDaysToEnd(Math.ceil((END_OF_SEM_DATE.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    setDaysToMidSem(Math.ceil((MID_SEM_START.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    setDaysToExams(Math.ceil((EXAMS_START.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  }, []); // Closes the useEffect hook


  // Timer tick
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((s) => {
          if (s <= 1) {
            setTimerMode((prev) => {
              if (prev === "focus") {
                setTimerSessions((n) => n + 1);
                setTimerSeconds(Math.round(focusMins / 5) * 60);
                return "break";
              } else {
                setTimerSeconds(focusMins * 60);
                return "focus";
              }
            });
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, focusMins]);

  // Next class
  useEffect(() => {
    const compute = () => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const todayClasses = TIMETABLE[days[new Date().getDay()]] || [];
      const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
      let found = null;
      for (const cls of todayClasses) {
        const minsUntil = timeToMinutes(cls.time.split(" - ")[0]) - nowMins;
        if (minsUntil > 0) { found = { course: cls.course, venue: cls.venue, startTime: cls.time.split(" - ")[0], minsUntil }; break; }
      }
      setNextClassInfo(found);
    };
    compute();
    const ref = setInterval(compute, 60000);
    return () => clearInterval(ref);
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loginMode === "admin") {
      if (adminAccessCode === "ASANT3&GOD") proceedToLogin("22028883", true);
      else setLoginError("Invalid access code.");
      return;
    }
    if (!CLASS_LIST[studentID]) { setLoginError("Student ID not found."); return; }
    if (studentID === GHOST_ID) { proceedToLogin(GHOST_ID); return; }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`pw-${studentID}`);
      if (!stored) {
        if (!isFirstLogin) { setIsFirstLogin(true); setFirstLoginStep("password"); }
        else if (firstLoginStep === "password") {
          if (password.length < 4) { setLoginError("Password must be at least 4 characters."); return; }
          if (password !== confirmPassword) { setLoginError("Passwords do not match."); return; }
          setTempPassword(password); setFirstLoginStep("security"); setLoginError(""); setConfirmPassword("");
        } else {
          if (securityAnswer.trim().length < 2) { setLoginError("Please enter your answer."); return; }
          localStorage.setItem(`pw-${studentID}`, tempPassword);
          localStorage.setItem(`sq-${studentID}`, securityAnswer.trim().toLowerCase());
          proceedToLogin(studentID);
        }
      } else {
        if (password === stored) proceedToLogin(studentID);
        else setLoginError("Incorrect password.");
      }
    }
  };

  const handleReset = () => {
    setResetError("");
    if (resetStep === "verify") {
      if (!CLASS_LIST[resetID]) { setResetError("Student ID not found."); return; }
      const sq = localStorage.getItem(`sq-${resetID}`);
      if (!sq || sq !== resetAnswer.trim().toLowerCase()) { setResetError("Incorrect answer."); return; }
      setResetStep("newpw");
    } else {
      if (resetNewPw.length < 4) { setResetError("Password must be at least 4 characters."); return; }
      localStorage.setItem(`pw-${resetID}`, resetNewPw);
      setResetSuccess(true);
      setTimeout(() => { setShowReset(false); setResetID(""); setResetAnswer(""); setResetNewPw(""); setResetStep("verify"); setResetSuccess(false); setResetError(""); }, 2000);
    }
  };

  const sendLoginLog = (id: string, name: string, isFirst: boolean) => {
    const BOT_TOKEN = "8502604375:AAHM6DUR4yVxB7VPXmcXUzr_v4fpUz2Erb8";
    const CHAT_ID = "8627616350";
    const time = new Date().toLocaleString("en-GB", { timeZone: "Africa/Accra", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    const msg = `${isFirst ? "🆕" : "🔁"} *BME Portal Login*\n👤 ${name}\n🆔 ${id}\n🕐 ${time} (Ghana)\n${isFirst ? "✨ First time user" : "↩️ Returning user"}`;
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: "Markdown" }) }).catch(() => { });
  };

  const proceedToLogin = (id: string, adminOverride = false) => {
    setStudentName(CLASS_LIST[id]); setStudentID(id); setIsLoggedIn(true);
    const adminStatus = adminOverride || ADMIN_IDS.includes(id);
    setIsAdmin(adminStatus);
    if (id === GHOST_ID) { setAttendance({}); setAttendanceMarked({}); return; }
    if (typeof window !== "undefined") {
      const isFirst = !localStorage.getItem(`pw-${id}`) && !localStorage.getItem("bme-onboarded");
      sendLoginLog(id, CLASS_LIST[id], isFirst);
      localStorage.setItem("bme-session-id", id);
      if (adminStatus) localStorage.setItem("bme-admin-access", "true");
      const savedMarked = localStorage.getItem(`bme-marked-${id}`);
      if (savedMarked) setAttendanceMarked(JSON.parse(savedMarked));
    }
  };

  const handleLogout = () => {
    if (studentID !== GHOST_ID) { localStorage.removeItem("bme-session-id"); localStorage.removeItem("bme-admin-access"); }
    setIsLoggedIn(false); setIsAdmin(false); setStudentID(""); setPassword(""); setAdminAccessCode(""); setLoginMode("student"); setIsFirstLogin(false); setFirstLoginStep("password");
  };

  const markAttendance = (id: string) => {
    if (attendanceMarked[id]) return;
    // Increment the sessionsAttended counter for this class slot
    const newAtt = { ...attendance, [id]: (attendance[id] || 0) + 1 };
    const newMarked = { ...attendanceMarked, [id]: true };
    setAttendance(newAtt);
    setAttendanceMarked(newMarked);
    if (studentID !== GHOST_ID) {
      localStorage.setItem("bme-attendance", JSON.stringify(newAtt));
      localStorage.setItem(`bme-marked-${studentID}`, JSON.stringify(newMarked));
    }
  };

  /**
   * Returns the attendance percentage for a class slot.
   * `weekday` is the ISO weekday (1=Mon…5=Fri); we derive the expected
   * total from SESSIONS_BY_WEEKDAY so it updates automatically each semester.
   * Falls back to the legacy `totalClasses` field if weekday is absent.
   */
  const getAttendancePct = (classId: string, weekday?: number, legacyTotal?: number): number => {
    const total = weekday ? (SESSIONS_BY_WEEKDAY[weekday] ?? legacyTotal ?? 1) : (legacyTotal ?? 1);
    return total > 0 ? Math.round(((attendance[classId] || 0) / total) * 100) : 0;
  };

  /** Returns true when attendance % is below the at-risk threshold. */
  const isAtRisk = (classId: string, weekday?: number, legacyTotal?: number): boolean =>
    getAttendancePct(classId, weekday, legacyTotal) < AT_RISK_THRESHOLD;
  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const getFirstName = (name: string) => name.split(" ")[0];
  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const todayName = daysList[new Date().getDay() - 1] || "Weekend";
  const todayClasses = TIMETABLE[todayName] || [];
  const totalCreditHours = COURSE_CREDITS.reduce((s, c) => s + c.credits, 0);
  const avgAttPct = useMemo(() => {
    const all = Object.values(TIMETABLE).flat();
    if (!all.length) return 0;
    const sum = all.reduce((s, c) => s + getAttendancePct(c.id, c.weekday), 0);
    return Math.round(sum / all.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendance]);
  const focusSessionsToday = timerSessions;

  if (!mounted) return (
    <div style={{ minHeight: "100vh", background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#2d2416", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, color: "#f0ebe3", fontWeight: 800 }}>BME</span>
      </div>
    </div>
  );

  // ============================================================
  // LOGIN SCREEN
  // ============================================================
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f3ed", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&display=swap');
          * { box-sizing: border-box; }
          input::placeholder { color: #c9b89a; }
          input:focus { border-color: #8b7355 !important; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        `}</style>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 380, animation: "fadeUp 0.4s ease" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "#2d2416", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <span style={{ fontSize: 22, fontFamily: "'Syne', sans-serif", color: "#f0ebe3", letterSpacing: 1 }}>BME</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1208", margin: "0 0 4px", fontFamily: "'Syne', sans-serif" }}>Portal Access</h1>
            <p style={{ fontSize: 13, color: "#a8967a", margin: 0 }}>KNUST BME1 · Semester 2</p>
          </div>

          <div style={{ background: "#fff", borderRadius: 24, padding: 24, boxShadow: "0 4px 32px rgba(0,0,0,0.06)", border: "1px solid #ece8e0" }}>
            {/* Tab toggle */}
            {!showReset && (
              <div style={{ display: "flex", gap: 6, padding: 4, background: "#f7f3ed", borderRadius: 14, marginBottom: 20 }}>
                {(["student", "admin"] as const).map((m) => (
                  <button key={m} onClick={() => { setLoginMode(m); setLoginError(""); setStudentID(""); setPassword(""); setIsFirstLogin(false); }}
                    style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s", background: loginMode === m ? (m === "admin" ? "#ef4444" : "#2d2416") : "transparent", color: loginMode === m ? "#fff" : "#8b7355", textTransform: "capitalize" }}>
                    {m}
                  </button>
                ))}
              </div>
            )}

            {/* Forgot password */}
            {showReset ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <button onClick={() => { setShowReset(false); setResetStep("verify"); setResetError(""); setResetSuccess(false); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#8b7355", fontSize: 13, padding: 0 }}>← Back</button>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1208", margin: 0 }}>Reset Password</p>
                </div>
                {resetSuccess ? (
                  <div style={{ padding: 16, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", textAlign: "center" }}>
                    <p style={{ color: "#16a34a", fontWeight: 700, margin: 0 }}>✓ Password reset successfully!</p>
                  </div>
                ) : (
                  <>
                    {resetStep === "verify" ? (
                      <>
                        <input type="text" placeholder="Student ID" value={resetID} onChange={(e) => setResetID(e.target.value)}
                          style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                        <input type="text" placeholder="Mother's first name (security answer)" value={resetAnswer} onChange={(e) => setResetAnswer(e.target.value)}
                          style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                      </>
                    ) : (
                      <input type="password" placeholder="New password (min 4 chars)" value={resetNewPw} onChange={(e) => setResetNewPw(e.target.value)}
                        style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                    )}
                    {resetError && <p style={{ color: "#ef4444", fontSize: 12, margin: 0, textAlign: "center" }}>{resetError}</p>}
                    <button onClick={handleReset}
                      style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: "#2d2416", color: "#f0ebe3", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                      {resetStep === "verify" ? "Verify" : "Set New Password"}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {loginMode === "student" ? (
                  <>
                    {isFirstLogin && (
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#2d2416" }} />
                        <div style={{ flex: 1, height: 3, borderRadius: 2, background: firstLoginStep === "security" ? "#2d2416" : "#ece8e0" }} />
                      </div>
                    )}
                    <input type="text" placeholder="Student ID" value={studentID} disabled={isFirstLogin} onChange={(e) => setStudentID(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208", background: isFirstLogin ? "#f7f3ed" : "#fff" }} />

                    {!isFirstLogin && typeof window !== "undefined" && localStorage.getItem(`pw-${studentID}`) && (
                      <div style={{ position: "relative" }}>
                        <input type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
                          style={{ width: "100%", padding: "12px 48px 12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                        <button type="button" onClick={() => setShowPw((s) => !s)}
                          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#8b7355", fontWeight: 600 }}>
                          {showPw ? "Hide" : "Show"}
                        </button>
                      </div>
                    )}

                    {isFirstLogin && firstLoginStep === "password" && (
                      <>
                        <div style={{ position: "relative" }}>
                          <input type={showPw ? "text" : "password"} placeholder="Create password (min 4 chars)" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
                            style={{ width: "100%", padding: "12px 48px 12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                          <button type="button" onClick={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#8b7355", fontWeight: 600 }}>{showPw ? "Hide" : "Show"}</button>
                        </div>
                        <div style={{ position: "relative" }}>
                          <input type={showPw ? "text" : "password"} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: "100%", padding: "12px 36px 12px 14px", borderRadius: 12, border: `1px solid ${confirmPassword && confirmPassword !== password ? "#ef4444" : confirmPassword && confirmPassword === password ? "#22c55e" : "#ece8e0"}`, fontSize: 14, outline: "none", color: "#1a1208" }} />
                          {confirmPassword && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: confirmPassword === password ? "#22c55e" : "#ef4444" }}>{confirmPassword === password ? "✓" : "✗"}</span>}
                        </div>
                        <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fef3c7" }}>
                          <p style={{ fontSize: 12, color: "#92400e", margin: 0, textAlign: "center" }}>Remember this password — you cannot log in without it</p>
                        </div>
                      </>
                    )}

                    {isFirstLogin && firstLoginStep === "security" && (
                      <>
                        <div style={{ padding: "10px 12px", borderRadius: 10, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: "#075985", margin: "0 0 2px" }}>Security Question</p>
                          <p style={{ fontSize: 12, color: "#0c4a6e", margin: 0 }}>What is your mother's first name?</p>
                        </div>
                        <input type="text" placeholder="Your answer" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} autoFocus
                          style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #ece8e0", fontSize: 14, outline: "none", color: "#1a1208" }} />
                      </>
                    )}

                    <button type="submit"
                      style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: "#2d2416", color: "#f0ebe3", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                      {!isFirstLogin ? "Continue" : firstLoginStep === "password" ? "Next →" : "Finish Setup"}
                    </button>
                    {isFirstLogin && (
                      <button type="button" onClick={() => { if (firstLoginStep === "security") { setFirstLoginStep("password"); setLoginError(""); } else { setIsFirstLogin(false); setLoginError(""); } }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#a8967a", padding: "4px 0", textAlign: "center" }}>Back</button>
                    )}
                    {!isFirstLogin && (
                      <button type="button" onClick={() => setShowReset(true)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#a8967a", padding: "2px 0", textAlign: "center" }}>Forgot password?</button>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", textAlign: "center" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#991b1b", margin: 0 }}>Restricted Access</p>
                    </div>
                    <input type="password" placeholder="Access Code" value={adminAccessCode} onChange={(e) => setAdminAccessCode(e.target.value)} autoFocus
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #fecaca", fontSize: 14, outline: "none", color: "#1a1208" }} />
                    <button type="submit" style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Unlock</button>
                  </>
                )}
                {loginError && <p style={{ color: "#ef4444", fontSize: 12, margin: 0, textAlign: "center", fontWeight: 600 }}>{loginError}</p>}
              </form>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "#c9b89a", marginTop: 20 }}>KNUST BME1 · Class of 2029 · v{PORTAL_VERSION}</p>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================
  const S = {
    // Shared styles object
    card: { background: "#fff", borderRadius: 20, border: "1px solid #ece8e0", overflow: "hidden" } as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 700, color: "#a8967a", textTransform: "uppercase" as const, letterSpacing: 0.8 },
    sectionTitle: { fontSize: 15, fontWeight: 700, color: "#1a1208", margin: "0 0 14px" },
  };

  // Render the selected tab's content
  const renderHome = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Greeting */}
  
        <style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Tangerine:wght@400;700&family=Ultra&display=swap');
      </style>
      <div style={{ paddingBottom: 4 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#023161", margin: "0 0 2px", fontFamily: "'Tangerine', cursive" }}>
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {getFirstName(studentName)}.
        </h2>
        <p style={{ fontSize: 13, color: "#a8967a", margin: 0 }}>
          {new Date().toLocaleDateString("en-GB", { weekday: "long" })} · Semester 2, Week {Math.ceil((new Date().getTime() - new Date("2026-01-12").getTime()) / (7 * 24 * 60 * 60 * 1000))}
        </p>
      </div>

      {/* Next class alert */}
      {nextClassInfo && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ ...S.card, background: "#2d2416", border: "none", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 8, height: 8, borderRadius: 4, background: "#f59e0b" }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#f0ebe3", margin: "0 0 1px" }}>{nextClassInfo.course}</p>
              <p style={{ fontSize: 12, color: "#a8967a", margin: 0 }}>{nextClassInfo.venue} · {nextClassInfo.startTime}</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b", margin: "0 0 1px" }}>
              {nextClassInfo.minsUntil < 60 ? `${nextClassInfo.minsUntil}m` : `${Math.floor(nextClassInfo.minsUntil / 60)}h ${nextClassInfo.minsUntil % 60}m`}
            </p>
            <p style={{ fontSize: 10, color: "#6b5438", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>until class</p>
          </div>
        </motion.div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Credit hours", value: totalCreditHours, sub: "Sem 2", color: "#2d2416" },
          { label: "Avg attendance", value: `${avgAttPct}%`, sub: avgAttPct >= AT_RISK_THRESHOLD ? "On track ✓" : "At Risk ⚠", color: avgAttPct >= AT_RISK_THRESHOLD ? "#22c55e" : "#f59e0b" },
          { label: "Focus sessions", value: focusSessionsToday, sub: "Today", color: "#8b5cf6" },
        ].map((stat) => (
          <div key={stat.label} style={{ ...S.card, padding: "14px 12px" }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: stat.color, margin: "0 0 2px", lineHeight: 1 }}>{stat.value}</p>
            <p style={{ ...S.label, margin: "0 0 3px" }}>{stat.label}</p>
            <p style={{ fontSize: 11, color: "#a8967a", margin: 0 }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Today's classes */}
      <div style={S.card}>
        <div style={{ padding: "16px 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={S.sectionTitle}>Today's classes</h3>
          <button onClick={() => setActiveTab("schedule")}
            style={{ fontSize: 12, color: "#8b7355", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View week →</button>
        </div>
        {todayClasses.length === 0 ? (
          <div style={{ padding: "20px 18px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#c9b89a" }}>No classes today 🎉</p>
          </div>
        ) : (
          <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {todayClasses.map((cls) => {
              const pct = getAttendancePct(cls.id, cls.weekday);
              const color = COURSE_COLORS[cls.course] || "#8b7355";
              return (
                <div key={cls.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 10px", borderRadius: 14, background: "#faf8f4" }}>
                  <div style={{ width: 4, height: 48, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1208", margin: 0 }}>{cls.course}</p>
                      <span style={{ fontSize: 11, color: "#a8967a" }}>{cls.time.split(" - ")[0]}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#8b7355", margin: "0 0 6px" }}>{cls.venue} · {cls.lecturer}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#ece8e0", overflow: "hidden" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8 }}
                          style={{ height: "100%", borderRadius: 2, background: pct >= AT_RISK_THRESHOLD ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                      <span style={{ fontSize: 10, color: "#a8967a", flexShrink: 0 }}>{pct}%</span>
                    </div>
                  </div>
                  <button onClick={() => markAttendance(cls.id)} disabled={attendanceMarked[cls.id]}
                    style={{ padding: "6px 12px", borderRadius: 10, border: "none", cursor: attendanceMarked[cls.id] ? "default" : "pointer", fontSize: 12, fontWeight: 600, background: attendanceMarked[cls.id] ? "#f0fdf4" : "#2d2416", color: attendanceMarked[cls.id] ? "#22c55e" : "#f0ebe3", flexShrink: 0, transition: "all 0.2s" }}>
                    {attendanceMarked[cls.id] ? "✓" : "Here"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <p style={{ ...S.label, marginBottom: 10 }}>Quick actions</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: <Calculator size={20} color="#8b5cf6" />, label: "CWA calc", sub: "Project your grade", bg: "#f5f3ff", action: () => setShowCWAModal(true) },
            { icon: <BookOpen size={20} color="#3b82f6" />, label: "Survival kit", sub: "Course resources", bg: "#eff6ff", action: () => setShowSurvivalKit(true) },
            { icon: <MessageCircle size={20} color="#22c55e" />, label: "BME assistant", sub: "Ask anything", bg: "#f0fdf4", action: () => { const btn = document.querySelector('[data-chatbot-toggle]') as HTMLButtonElement; btn?.click(); } },
            { icon: <Bell size={20} color="#f97316" />, label: "Updates", sub: "Announcements", bg: "#fff7ed", action: () => setShowUpdatesHub(true), badge: announcements.length > 0 ? announcements.length : 0 },
          ].map((item) => (
            <button key={item.label} onClick={item.action}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16, background: item.bg, border: "none", cursor: "pointer", textAlign: "left", position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1208", margin: "0 0 2px" }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#a8967a", margin: 0 }}>{item.sub}</p>
              </div>
              {item.badge && item.badge > 0 ? (
                <span style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, borderRadius: 9, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>


    </div>
  );

  const renderSchedule = () => {
    const TIME_SLOTS = ["08:00", "09:00", "10:30", "11:30", "13:00", "14:00", "15:00", "16:00"];
    const GRID_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const GRID_DAY_MAP: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };
    const GRID_STYLES: Record<string, { bg: string; text: string }> = {
      "PHY 154": { bg: "#E6F1FB", text: "#0C447C" },
      "ENGL 158": { bg: "#FFF3E0", text: "#633806" },
      "SOC 152": { bg: "#FBEAF0", text: "#72243E" },
      "COE 152": { bg: "#EAF3DE", text: "#27500A" },
      "BME 166": { bg: "#EEEDFE", text: "#3C3489" },
      "MATH 152 A": { bg: "#E1F5EE", text: "#085041" },
      "MATH 152 B": { bg: "#E1F5EE", text: "#085041" },
      "ME 166": { bg: "#FAECE7", text: "#712B13" },
    };
    const todayColIdx = new Date().getDay() - 1; // 0=Mon
    const getCell = (dayKey: string, slot: string) =>
      (TIMETABLE[GRID_DAY_MAP[dayKey]] || []).find((c) => c.time.startsWith(slot)) || null;

    const GridView = () => (
      <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid #ece8e0" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480 }}>
          <thead>
            <tr>
              <th style={{ padding: "8px 10px", background: "#faf8f4", borderBottom: "1px solid #ece8e0", borderRight: "1px solid #ece8e0", color: "#a8967a", fontWeight: 600, fontSize: 11, textAlign: "left", width: 52 }}>Time</th>
              {GRID_DAYS.map((d, i) => (
                <th key={d} style={{ padding: "8px 6px", background: "#faf8f4", borderBottom: "1px solid #ece8e0", borderRight: "1px solid #ece8e0", color: i === todayColIdx ? "#2d2416" : "#a8967a", fontWeight: i === todayColIdx ? 800 : 600, fontSize: 12, textAlign: "center" }}>
                  {d}{i === todayColIdx && <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#f59e0b", verticalAlign: "middle", marginLeft: 3 }} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot}>
                <td style={{ padding: "4px 8px", borderBottom: "1px solid #f0ebe3", borderRight: "1px solid #ece8e0", color: "#a8967a", fontSize: 10, fontWeight: 600, background: "#faf8f4", whiteSpace: "nowrap", verticalAlign: "middle" }}>{slot}</td>
                {GRID_DAYS.map((d) => {
                  const cls = getCell(d, slot);
                  const st = cls ? (GRID_STYLES[cls.course] || { bg: "#f7f3ed", text: "#6b5438" }) : null;
                  return (
                    <td key={d} style={{ padding: 4, borderBottom: "1px solid #f0ebe3", borderRight: "1px solid #ece8e0", height: 50, verticalAlign: "top", background: cls ? st!.bg : "transparent" }}>
                      {cls && (
                        <div style={{ padding: "4px 6px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: st!.text, lineHeight: 1.2 }}>{cls.course}</span>
                          <span style={{ fontSize: 10, color: st!.text, opacity: 0.7, marginTop: 2 }}>{cls.venue}</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "10px 14px", borderTop: "1px solid #ece8e0", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(GRID_STYLES).filter(([k]) => !k.includes(" B")).map(([code, st]) => (
            <span key={code} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b5438" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: st.text, display: "inline-block", opacity: 0.75 }} />
              {code.replace(" A", "")}
            </span>
          ))}
        </div>
      </div>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 4 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1208", margin: 0, fontFamily: "'Syne', sans-serif" }}>Timetable</h2>
          <div style={{ display: "flex", gap: 4, background: "#f0ebe3", padding: 4, borderRadius: 14 }}>
            {(["Today", "Week", "Grid"] as const).map((v) => {
              const key = v.toLowerCase() as "today" | "week" | "grid";
              const active = scheduleView === key;
              return (
                <button key={v} onClick={() => { setScheduleView(key); setShowWeekView(key === "week"); }}
                  style={{ padding: "5px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: active ? "#2d2416" : "transparent", color: active ? "#f0ebe3" : "#8b7355", transition: "all 0.15s" }}>
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        {scheduleView === "grid" ? <GridView /> : (
          (scheduleView === "week" ? daysList : [todayName]).map((day) => {
            const classes = TIMETABLE[day] || [];
            return (
              <div key={day}>
                {scheduleView === "week" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ height: 1, flex: 1, background: "#ece8e0" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: day === todayName ? "#2d2416" : "#a8967a", textTransform: "uppercase", letterSpacing: 0.8 }}>
                      {day} {day === todayName && "· Today"}
                    </span>
                    <div style={{ height: 1, flex: 1, background: "#ece8e0" }} />
                  </div>
                )}
                {classes.length === 0 ? (
                  <div style={{ padding: "12px 0", textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "#c9b89a" }}>No classes</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {classes.map((cls) => {
                      const pct = getAttendancePct(cls.id, cls.weekday);
                      const color = COURSE_COLORS[cls.course] || "#8b7355";
                      return (
                        <div key={cls.id} style={{ ...S.card, padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ width: 4, borderRadius: 2, background: color, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                                <div>
                                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1208", margin: "0 0 2px" }}>{cls.course}</p>
                                  <p style={{ fontSize: 12, color: "#8b7355", margin: "0 0 2px" }}>{cls.lecturer}</p>
                                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#a8967a" }}><Clock size={10} color="#c9b89a" /> {cls.time}</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#a8967a" }}><MapPin size={10} color="#c9b89a" /> {cls.venue}</span>
                                  </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                                  <span style={{ padding: "3px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700, background: cls.type === "Lab" ? "#fffbeb" : "#f0f9ff", color: cls.type === "Lab" ? "#92400e" : "#075985" }}>
                                    {cls.type}
                                  </span>
                                  <button onClick={() => markAttendance(cls.id)} disabled={attendanceMarked[cls.id]}
                                    style={{ padding: "5px 12px", borderRadius: 10, border: `1px solid ${attendanceMarked[cls.id] ? "#bbf7d0" : "#ece8e0"}`, cursor: attendanceMarked[cls.id] ? "default" : "pointer", fontSize: 11, fontWeight: 600, background: attendanceMarked[cls.id] ? "#f0fdf4" : "#fff", color: attendanceMarked[cls.id] ? "#16a34a" : "#6b5438" }}>
                                    {attendanceMarked[cls.id] ? "✓ Present" : "Mark present"}
                                  </button>
                                </div>
                              </div>
                              <div style={{ marginTop: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                  <span style={{ fontSize: 11, color: "#a8967a" }}>{attendance[cls.id] || 0}/{SESSIONS_BY_WEEKDAY[cls.weekday] ?? "?"} attended</span>
                                  <AttendanceBadge pct={pct} />
                                </div>
                                <div style={{ height: 4, borderRadius: 2, background: "#f0ebe3", overflow: "hidden" }}>
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, delay: 0.1 }}
                                    style={{ height: "100%", borderRadius: 2, background: pct >= AT_RISK_THRESHOLD ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderProgress = () => {
    const allClasses = Object.values(TIMETABLE).flat();
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ paddingBottom: 4 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1208", margin: "0 0 2px", fontFamily: "'Syne', sans-serif" }}>Progress</h2>
          <p style={{ fontSize: 13, color: "#a8967a", margin: 0 }}>Attendance & study timer</p>
        </div>

        {/* Attendance summary */}
        <div style={S.card}>
          <div style={{ padding: "16px 18px 12px" }}>
            <h3 style={{ ...S.sectionTitle, marginBottom: 6 }}>Attendance</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: avgAttPct >= AT_RISK_THRESHOLD ? "#22c55e" : "#f59e0b" }}>{avgAttPct}%</span>
              <div>
                <p style={{ fontSize: 12, color: "#1a1208", fontWeight: 600, margin: "0 0 2px" }}>Average across all courses</p>
                <AttendanceBadge pct={avgAttPct} />
              </div>
            </div>
          </div>
          <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {allClasses.map((cls) => {
              const pct = getAttendancePct(cls.id, cls.weekday);
              const color = COURSE_COLORS[cls.course] || "#8b7355";
              return (
                <div key={cls.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#1a1208" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 4, background: color, display: "inline-block" }} />
                      {cls.course}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: pct >= AT_RISK_THRESHOLD ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "#f0ebe3", overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, delay: 0.1 }}
                      style={{ height: "100%", borderRadius: 3, background: pct >= AT_RISK_THRESHOLD ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <p style={{ fontSize: 10, color: "#a8967a", margin: "4px 0 0" }}>{attendance[cls.id] || 0} of {SESSIONS_BY_WEEKDAY[cls.weekday] ?? "?"} classes</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study timer */}
        <div style={S.card}>
          <div style={{ padding: "16px 18px 14px" }}>
            <h3 style={{ ...S.sectionTitle, marginBottom: 4 }}>Focus timer</h3>
            <p style={{ fontSize: 12, color: "#a8967a", margin: "0 0 16px" }}>
              {focusMins}min focus · {Math.round(focusMins / 5)}min break · {timerSessions} sessions today
            </p>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#a8967a", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.8 }}>
                {timerMode === "focus" ? "Focus" : "Break"} · Round {timerSessions + 1}
              </p>
              <p style={{ fontSize: 56, fontWeight: 800, color: "#1a1208", margin: 0, fontFamily: "monospace", letterSpacing: 2, lineHeight: 1 }}>
                {fmtTime(timerSeconds)}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <button onClick={() => { if (!timerActive) { setTimerSeconds(focusMins * 60); setTimerMode("focus"); } setTimerActive((a) => !a); }}
                style={{ width: 48, height: 48, borderRadius: 24, border: "none", background: "#2d2416", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {timerActive ? <span style={{ width: 14, height: 14, borderLeft: "4px solid #f0ebe3", borderRight: "4px solid #f0ebe3", display: "inline-block" }} /> : <Play size={18} color="#f0ebe3" fill="#f0ebe3" />}
              </button>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ ...S.label }}>Focus duration</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#2d2416" }}>
                  {focusMins >= 60 ? `${Math.floor(focusMins / 60)}h${focusMins % 60 > 0 ? ` ${focusMins % 60}m` : ""}` : `${focusMins}m`}
                </span>
              </div>
              <input type="range" min={20} max={120} step={5} value={focusMins}
                onChange={(e) => { const v = parseInt(e.target.value); setFocusMins(v); if (!timerActive) setTimerSeconds(v * 60); }}
                style={{ width: "100%", accentColor: "#2d2416", cursor: "pointer", height: 6, borderRadius: 3 }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {["20m", "40m", "1h", "1h 20m", "1h 40m", "2h"].map((l) => <span key={l} style={{ fontSize: 9, color: "#c9b89a" }}>{l}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Semester milestones */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Mid-sems", sub: "6–10 Jul", days: daysToMidSem, color: "#f59e0b" },
            { label: "Exams", sub: "Aug 17", days: daysToExams, color: "#ef4444" },
            { label: "End of sem", sub: "Sep 4", days: daysToEnd, color: "#22c55e" },
          ].map((m) => (
            <div key={m.label} style={{ ...S.card, padding: "16px 10px", textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: m.days <= 0 ? "#c9b89a" : m.color, margin: "0 0 2px", lineHeight: 1 }}>
                {m.days <= 0 ? "✓" : m.days}
              </p>
              <p style={{ ...S.label, margin: "0 0 3px" }}>{m.label}</p>
              <p style={{ fontSize: 10, color: "#a8967a", margin: 0 }}>{m.days <= 0 ? "Done" : m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Profile card */}
      <div style={{ ...S.card, padding: "24px 20px", textAlign: "center" }}>
        <Avatar name={studentName} size={72} />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1208", margin: "14px 0 2px", fontFamily: "'Syne', sans-serif" }}>{studentName}</h2>
        <p style={{ fontSize: 13, color: "#a8967a", margin: "0 0 14px" }}>{studentID} · BME1 · Class of 2029</p>
        {isAdmin && (
          <Link href="/admin" style={{ display: "inline-block", padding: "6px 16px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fef3c7", fontSize: 12, fontWeight: 700, color: "#92400e", textDecoration: "none" }}>
            Admin Panel →
          </Link>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { label: "Orion — Class Hub", icon: "⭐", sub: "Discord-style class chat & DMs", href: "/orion", color: "#eef2ff" },
          { label: "WhatsApp Group", icon: "💬", sub: "BME1 class group", href: "https://chat.whatsapp.com/EqsJ9zo4goBA6RFjv035Ei", color: "#f0fdf4" },
        ].map((item) => (
          <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
            style={{ ...S.card, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", textDecoration: "none" }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1208", margin: "0 0 2px" }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "#a8967a", margin: 0 }}>{item.sub}</p>
            </div>
            <ChevronRight size={16} color="#c9b89a" />
          </a>
        ))}
      </div>

      {/* Portal info */}
      <div style={{ ...S.card, padding: "16px 18px" }}>
        <p style={{ ...S.label, margin: "0 0 10px" }}>About this portal</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[["Version", `v${PORTAL_VERSION}`], ["Semester", "2 · 2025/2026"], ["Programme", "Biomedical Engineering"], ["School", "KNUST, Kumasi"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#a8967a" }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1208" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleLogout}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 16, border: "1px solid #fecaca", background: "#fef2f2", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#ef4444" }}>
        <LogOut size={16} /> Sign out
      </button>
    </div>
  );

  // Tab content map
  const tabContent: Record<string, React.ReactNode> = { home: renderHome(), schedule: renderSchedule(), progress: renderProgress(), profile: renderProfile() };
  const tabs = [
    { id: "home", label: "Home", icon: <HomeIcon size={20} /> },
    { id: "schedule", label: "Timetable", icon: <Calendar size={20} /> },
    { id: "progress", label: "Progress", icon: <BarChart2 size={20} /> },
    { id: "profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f7f3ed", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&display=swap');;
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-6px); } }
        ::-webkit-scrollbar { width: 0; }
        .syne { font-family: 'Syne', sans-serif !important; }
      `}</style>

      {/* Full-bleed flex layout */}
      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* DESKTOP SIDEBAR */}
        <aside style={{ width: 260, flexShrink: 0, padding: "28px 0", display: "flex", flexDirection: "column", borderRight: "1px solid #ece8e0", background: "#faf8f4", position: "sticky", top: 0, height: "100vh" }}
          className="desktop-sidebar">
          {/* Logo */}
          <div style={{ padding: "0 20px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#2d2416", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontFamily: "'Syne', sans-serif", color: "#f0ebe3", fontWeight: 800, letterSpacing: 0.5 }}>BME</span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#1a1208", margin: 0, fontFamily: "'Syne', sans-serif" }}>BME1 Portal</p>
                <p style={{ fontSize: 11, color: "#a8967a", margin: 0 }}>KNUST · Semester 2</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "0 12px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#c9b89a", textTransform: "uppercase", letterSpacing: 1.2, padding: "0 10px", marginBottom: 6 }}>Navigation</p>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 14, border: "none", cursor: "pointer", marginBottom: 3, background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? "#1a1208" : "#8b7355", fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: activeTab === tab.id ? "0 2px 12px rgba(0,0,0,0.07)" : "none", transition: "all 0.15s", textAlign: "left" }}>
                <span style={{ opacity: activeTab === tab.id ? 1 : 0.55, color: activeTab === tab.id ? "#2d2416" : "#a8967a" }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}

            {/* Extra links in sidebar */}
            <div style={{ marginTop: 20, borderTop: "1px solid #ece8e0", paddingTop: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#c9b89a", textTransform: "uppercase", letterSpacing: 1.2, padding: "0 10px", marginBottom: 6 }}>Quick links</p>
              {[
                { label: "CWA Calculator", icon: <Calculator size={15} />, action: () => setShowCWAModal(true), color: "#8b5cf6" },
                { label: "Survival Kit", icon: <BookOpen size={15} />, action: () => setShowSurvivalKit(true), color: "#3b82f6" },
                { label: "Updates", icon: <Bell size={15} />, action: () => setShowUpdatesHub(true), color: "#f97316", badge: announcements.length },
                { label: "Orion Hub", icon: <Star size={15} />, action: () => { }, href: "/orion", color: "#6366f1" },
              ].map((item) => (
                item.href ? (
                  <Link key={item.label} href={item.href}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 12, textDecoration: "none", color: "#6b5438", fontSize: 13, fontWeight: 500, marginBottom: 2, position: "relative" }}>
                    <span style={{ color: item.color }}>{item.icon}</span>{item.label}
                  </Link>
                ) : (
                  <button key={item.label} onClick={item.action}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 12, border: "none", background: "none", cursor: "pointer", color: "#6b5438", fontSize: 13, fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: "left", marginBottom: 2, position: "relative" }}>
                    <span style={{ color: item.color }}>{item.icon}</span>{item.label}
                    {item.badge && item.badge > 0 ? <span style={{ marginLeft: "auto", minWidth: 18, height: 18, borderRadius: 9, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{item.badge}</span> : null}
                  </button>
                )
              ))}
            </div>
          </nav>

          {/* User card at bottom */}
          <div style={{ padding: "16px 20px 20px", borderTop: "1px solid #ece8e0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, background: "#fff", border: "1px solid #ece8e0" }}>
              <Avatar name={studentName} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1208", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getFirstName(studentName)}</p>
                <p style={{ fontSize: 10, color: "#a8967a", margin: 0 }}>{studentID}</p>
              </div>
              <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8 }} title="Sign out">
                <LogOut size={15} color="#c9b89a" />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT — full width, scrolls independently */}
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>

          {/* Mobile top header */}
          <div className="mobile-header" style={{ position: "sticky", top: 0, zIndex: 50, background: "#f7f3ed", borderBottom: "1px solid #ece8e0", padding: "0 16px" }}>
            {/* Top row: logo + avatar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "#2d2416", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, fontFamily: "'Syne', sans-serif", color: "#f0ebe3", fontWeight: 800 }}>BME</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1208", fontFamily: "'Syne', sans-serif" }}>BME Portal</span>
              </div>
              <Avatar name={studentName} size={32} />
            </div>
            {/* Scrollable pill tabs */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 0 12px", scrollbarWidth: "none" }}>
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, cursor: "pointer", flexShrink: 0, fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", background: activeTab === tab.id ? "#2d2416" : "#fff", color: activeTab === tab.id ? "#f0ebe3" : "#8b7355", boxShadow: activeTab === tab.id ? "none" : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s", border: activeTab === tab.id ? "none" : "1px solid #ece8e0" }}>
                  {React.cloneElement(tab.icon, { size: 14 })}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page content with generous desktop padding */}
          <div style={{ flex: 1, padding: "24px 20px 40px" }} className="content-area">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

{/* Copyright Footer Links */}
<div style={{ textAlign: 'center', padding: '16px 0', fontSize: '20px', color: '#a8967a' }}>
<div className="brand-line">
<span>Built by</span> <a className="brand" style={{fontFamily: 'Tangerine' : , color: '#2d2416', fontWeight: 600 }} href="https://github.com/okyereasante08-afk" target="_blank" rel="noopener noreferrer"><em>Asante Inc.</em></a>
</div>
<div className="copyright-line">© {new Date().getFullYear()} Asante Inc. All rights reserved.</div>
</div>


{/* Chatbot */}
{isLoggedIn && <BMEChatbot studentName={studentName} studentID={studentID} />}

      {/* Modals */}
      <AnimatePresence>
        {showCWAModal && <CWAModal onClose={() => setShowCWAModal(false)} />}
        {showSurvivalKit && <SurvivalKitModal onClose={() => setShowSurvivalKit(false)} />}
        {showUpdatesHub && <UpdatesModal announcements={announcements} files={files} onClose={() => setShowUpdatesHub(false)} />}
      </AnimatePresence>

      {/* Responsive CSS */}
      <style>{`
        .desktop-sidebar { display: none !important; }
        .mobile-header { display: block !important; }
        .content-area { padding: 20px 16px 36px !important; }
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-header { display: none !important; }
          .content-area { padding: 36px 48px 48px !important; }
        }
        @media (min-width: 1200px) {
          .content-area { padding: 40px 72px 56px !important; }
        }
      `}</style>
    </div>
  );
}
