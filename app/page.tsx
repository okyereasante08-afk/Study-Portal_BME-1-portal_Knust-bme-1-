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
                { label: "Calculus Tutorials-Finish Calculus 1 in just 19 videos", url:"https://www.youtube.com/playlist?list=PLLRIy3Upn5vLRQWLdtVN_OkMYobabpj0i"},
                { label: "Calculus in 22 days- with simply 4 videos a day finish Calculus in just 3 weeks", url:"https://www.youtube.com/playlist?list=PLLRIy3Upn5vJ6TW_6ex6cMXWhcvAt3JZl"},
                ]
  },
  {
    course: "ME 166 — Basic Electronics", color: "#f97316", emoji: "🪫",
    resources: [
      { label: "Basic Electronics-KNUST(Maths Hub GH)", url:"https://www.youtube.com/playlist?list=PLldc0i2lkatVFhbnQRS-dOcI6xRdTJ0Lm"},
      { label: "SemiConductors", url: "https://youtu.be/ErcH_OuCaNY?si=woPM9OXzL6NrihZe" },
      { label: "Half-Wave Rectification", url: "https://youtu.be/CpcJxhFnmMo?si=8l5HO3BrsVDO3fgk" },
      { label: "Full-Wave Rectification", url: "https://youtu.be/quyqtaKIr78?si=pMMeyYYVmKqkhHGg" },
      { label: "Full-Wave Rectification (Demonstration)", url: "https://youtu.be/dNi_T0P5TLk?si=spqbtmaZ8CEkZyWk" },
      { label: "Diodes", url: "https://youtu.be/n4XZ02N11Hc?si=hhDRvOEa4MtBWwsP" },
      { label: "Solving Diode Circuits", url:"https://youtu.be/sDWWGhuRqFs?si=MozZmpTDcPLBV8dh"},
      { label: "Basic Electronics for Begginers (Organic Chem Tutor)", url:"https://youtu.be/uXr4lXYjXuU?list=PL0o_zxa4K1BV9E-N8tSExU1djL6slnjbL"},
    ]
  },
  {
    course: "BME 166 — Biochemistry", color: "#f59e0b", emoji: "⚕️",
    resources: [
      { label: "Biochemistry (Ninja Nerd) Playlist ", url: "https://www.youtube.com/playlist?list=PLTF9h-T1TcJhcNo9M1VFXz6rMKT6CM_wd" },
      { label: "Metabolism (Ninja Nerd) Playlist", url: "https://www.youtube.com/watch?v=4eLjRcHnMCk&list=PLTF9h-T1TcJhcNo9M1VFXz6rMKT6CM_wd" },
      { label: "Drug Metabolism", url: "https://youtu.be/qvucMHUVZA4?si=6w3bg-OtR_dZxIt6"},
      { label: "Pharmacokinetics simplified", url:"https://youtu.be/16wNysLC9Fs?si=GUyEDdHymiWSSvD"},
      { label: "Fatty Acid Metabolism", url:"https://youtu.be/uYutpPY7xcw?si=OcIViUwwzDZLqNAh"},
    ]
  },
  {
    course: "ME 166 — Applied thermodynamics", color: "#22c55e", emoji: "⚙️",
    resources: [
      { label: "Engineering Thermodynamics I Online Course", url: "https://www.youtube.com/playlist?list=PLISIF5ACui17dQ5VbzxNu9QtMnfKb856n" },
      { label: "First Law of Thermodynamics Open Systems 1(Control Volume Analysis)", url: "https://www.youtube.com/watch?v=VBdapBeycv4&list=PLKnQ46F19QdhH1ykna30gNoHBr_bJjGBH" },
      { label: "First Law of Thermodynamics Open Systems 2(Enthalpy)", url: "https://www.youtube.com/watch?v=ReOaRZA2eLo&list=PLKnQ46F19QdhH1ykna30gNoHBr_bJjGBH&index=2"},
      { label: "Turbines, Throttles, Nozzles, Fans, and Heaters", url: "https://www.youtube.com/watch?v=WAHa3y7NEsk&list=PLKnQ46F19QdhH1ykna30gNoHBr_bJjGBH&index=5"},
      { label: "Entropy: Thermodynamics - Second Law", url:"https://www.youtube.com/watch?v=QBd2zraOe2k"}, 
      ] 
  },
  {
    course: "PHY 154 — Properties of Matter ", color: "#06b6d4", emoji: "🧪",
    resources: [{ label: "Density", url:"youtube.com/watch?v=NL9LRvcWxHs&pp=ygUURGVuc2l0eSBsZWN0dXJlIGZ1bGw%3D" },
                { label: "Fortins Barometer", url:"https://www.youtube.com/watch?v=S4pUMNdSIYk"},
                { label: "Variation of atmospheric pressure with altitude", url:"https://youtu.be/WGxuELoFzO4?si=nNJskZvYXo0Wvo9p"},
                { label: "Bernoulli's Equation Example Problems, Fluid Mechanics", url:"https://www.youtube.com/watch?v=xTAfyc06ZxQ"},
                { label: "Bernoulli's Principle Demo: Levitated Balls", url:"https://www.youtube.com/watch?v=Ye3QPgDdJNg"},
                { label: "Torricelli's Theorem -Explained", url:"https://youtu.be/2vfTwnlsrCM?si=nkc2XVXY6nxZCTAU"},
                { label: "Torricelli's Law in 2 minutes", url:"https://youtu.be/LNgrIssGZlc?si=XLYtVYkwWHNv-b9S"},
                { label: "Torricelli's Theorem practice problems", url:"https://www.youtube.com/watch?v=046-DygKrhc"},
                { label: "What is pitot tube? 3D Animation", url:"https://youtu.be/3zEdtkuNYLU?si=66XMbfPdG3ykQLM6"},
                { label: "Pitot Static Tube Introduction & Example", url:"https://www.youtube.com/watch?v=VOMO7zsvHsM"},
                { label: "Streamlines and Velocity", url:"https://youtu.be/AGve4RZ4zjw?si=yVwwXP6W9udDhT-_"},
                { label: "Streamlines and Velocity 2", url:"https://youtu.be/kDO3EcXblwg?si=Z4Ix44waDRcyxQPn"},
                { label: "Steady vs Unsteady Flow", url:"https://youtu.be/-a7EtooUf5U?si=LNGn5kMW1HF2fiUq"},
                { label: "Elasticity", url: "https://www.youtube.com/watch?v=HALbtyDUjp0&pp=ygUXZWxhc3RpY2l0eSBmdWxsIGxlY3R1cmU%3D"},
                { label: "Poiseuille's Law - Pressure Difference-Volume Flow Rate", url:"https://youtu.be/UeQu19VChjE?si=8ZFcvj7jwmA7FfRa"},
                { label: "Viscosity of Fluids& Velocity Gradient", url:"https://youtu.be/PoG14wRRQmM?si=pR7OFoRmBhoUYPwD"},
                { label: "★Newtons law of viscosity ★Stoke's law ★Terminal velocity", url:"https://youtu.be/tWO-NikCrzs?si=HHl_lcQShn_hWq1k"},
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

const Avatar = ({
  name, size = 36, onClick, avatarUrl, showUploadHint = false, onRemove
}: {
  name: string; size?: number; onClick?: () => void;
  avatarUrl?: string; showUploadHint?: boolean; onRemove?: () => void;
}) => {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const isClickable = !!onClick || showUploadHint;

  return (
    <div
      onClick={onClick}
      title={showUploadHint ? "Change photo" : isClickable ? "Go to profile" : undefined}
      style={{
        width: size, height: size, borderRadius: size / 2,
        background: avatarUrl ? "transparent" : "linear-gradient(135deg, #e8d5c4, #c9a87c)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        cursor: isClickable ? "pointer" : "default",
        transition: "transform 0.15s, box-shadow 0.15s",
        position: "relative", overflow: "visible",
      }}
      onMouseEnter={e => {
        if (isClickable) {
          e.currentTarget.style.transform = "scale(1.05)";
        }
        const overlay = e.currentTarget.querySelector(".avatar-overlay") as HTMLDivElement;
        if (overlay && showUploadHint) overlay.style.opacity = "1";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        const overlay = e.currentTarget.querySelector(".avatar-overlay") as HTMLDivElement;
        if (overlay && showUploadHint) overlay.style.opacity = "0";
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", position: "relative" }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: size * 0.36, fontWeight: 700, color: "#5c3d1e", fontFamily: "'Syne', sans-serif" }}>{initials}</span>
        )}
        
        {showUploadHint && (
          <div className="avatar-overlay" style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            opacity: 0, transition: "opacity 0.2s"
          }}>
            <span style={{ fontSize: size * 0.25 }}>📷</span>
            {size >= 60 && <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, marginTop: 2 }}>CHANGE</span>}
          </div>
        )}
      </div>

      {avatarUrl && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            position: "absolute", bottom: 0, right: -4, width: 20, height: 20,
            borderRadius: 10, background: "#ef4444", border: "2px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#fff", fontSize: 10, fontWeight: "bold", padding: 0
          }}
        >
          ✕
        </button>
      )}
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
// MAIN COMPONENT EXPORT ENTRY
// ============================================================
export default function StudentPortal() {
  // ──────────────────────────────────────────────────────────
  // 1. ALL HOOKS - UNCONDITIONAL AND GROUPED AT ROOT TOP
  // ──────────────────────────────────────────────────────────
  const [studentID, setStudentID] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [attendance, setAttendance] = useState<Record<string, number[]>>({});
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [showSurvivalKit, setShowSurvivalKit] = useState(false);
  const [showUpdatesHub, setShowUpdatesHub] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  // Custom Avatar and Pipeline Hooks
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Time ticker effect listener
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sync profile avatar picture cache strings out of localStorage safely on initialization/login shifts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem("studentPortal_id");
      if (savedId && CLASS_LIST[savedId]) {
        setStudentID(savedId);
        const savedAvatar = localStorage.getItem(`avatar_${savedId}`);
        if (savedAvatar) setAvatarDataUrl(savedAvatar);
      }
    }
  }, []);

  useEffect(() => {
    if (studentID && CLASS_LIST[studentID]) {
      const savedAvatar = localStorage.getItem(`avatar_${studentID}`);
      setAvatarDataUrl(savedAvatar || "");
    } else {
      setAvatarDataUrl("");
    }
  }, [studentID]);

  // Read operational parameters from storage structures
  useEffect(() => {
    if (studentID) {
      try {
        const stored = localStorage.getItem(`attendance_v2_${studentID}`);
        if (stored) setAttendance(JSON.parse(stored));
        else setAttendance({});
      } catch (e) {
        setAttendance({});
      }
    }
  }, [studentID]);

  // Fetch contextual updates information from network endpoints
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch("/api/updates");
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data.announcements || []);
          setFiles(data.files || []);
        }
      } catch (err) {
        console.error("Failed fetching hub notifications:", err);
      }
    };
    fetchUpdates();
  }, []);

  // Canvas context layout compression pipeline handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid graphical image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image payload exceeds 10MB threshold. Choose a smaller asset file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 200;
        canvas.height = 200;

        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        ctx.drawImage(img, startX, startY, size, size, 0, 0, 200, 200);
        const compressedB64 = canvas.toDataURL("image/jpeg", 0.82);

        try {
          setAvatarDataUrl(compressedB64);
          if (studentID) {
            localStorage.setItem(`avatar_${studentID}`, compressedB64);
          }
        } catch (error) {
          console.error("LocalStorage persistence allocation failed:", error);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ──────────────────────────────────────────────────────────
  // 2. DATA DERIVATIONS & MEMOS (SAFE AFTER HOOK DECLARATIONS)
  // ──────────────────────────────────────────────────────────
  const studentName = CLASS_LIST[studentID] || "";
  const isAdmin = ADMIN_IDS.includes(studentID);
  const isLoggedIn = !!studentName;

  const handleLogin = (id: string) => {
    if (CLASS_LIST[id]) {
      setStudentID(id);
      localStorage.setItem("studentPortal_id", id);
    } else {
      alert("Invalid ID token entered.");
    }
  };

  const handleLogout = () => {
    setStudentID("");
    setAvatarDataUrl("");
    localStorage.removeItem("studentPortal_id");
  };

  // Pre-calculate session totals arrays 
  const courseStats = useMemo(() => {
    return COURSE_CREDITS.map((c) => {
      const logs = attendance[c.code] || [];
      const attended = logs.filter((val) => val === 1).length;
      const missed = logs.filter((val) => val === 0).length;
      
      let weekdayNum = 1;
      if (c.code.startsWith("SOC")) weekdayNum = 2;
      else if (c.code.startsWith("COE")) weekdayNum = 2;
      else if (c.code.startsWith("BME")) weekdayNum = 2;
      else if (c.code.includes("MATH 152 A")) weekdayNum = 3;
      else if (c.code.includes("MATH 152 B")) weekdayNum = 4;
      else if (c.code.startsWith("ME")) weekdayNum = 5;
      else if (c.code.startsWith("PHY")) weekdayNum = 1;

      const totalSessions = SESSIONS_BY_WEEKDAY[weekdayNum] || 12;
      const totalLogged = attended + missed;
      const unlogged = Math.max(0, totalSessions - totalLogged);
      const pct = totalLogged > 0 ? Math.round((attended / totalLogged) * 100) : 100;

      return { ...c, attended, missed, unlogged, totalSessions, pct };
    });
  }, [attendance]);

  // ──────────────────────────────────────────────────────────
  // 3. CONDITIONAL RENDER RETURN FOR UNAUTHENTICATED USERS
  // ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fcfaf7", padding: 20 }}>
        <div style={{ maxWidth: 400, width: "100%", background: "#fff", padding: "40px 32px", borderRadius: 24, border: "1px solid #f0ebe3", boxShadow: "0 12px 40px rgba(139,115,85,0.06)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#2d2416", margin: "0 0 8px" }}>BME Portal Workspace</h1>
            <p style={{ fontSize: 13, color: "#8b7355", margin: 0 }}>Enter your student ID credentials below to connect</p>
          </div>
          <input
            type="text"
            placeholder="Student ID Code"
            maxLength={12}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin(e.currentTarget.value.trim());
            }}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid #ece8e0", background: "#faf8f4", fontSize: 15, outline: "none", color: "#1a1208", textAlign: "center", letterSpacing: 1, marginBottom: 16 }}
          />
          <button
            onClick={(e) => {
              const inputNode = e.currentTarget.previousSibling as HTMLInputElement;
              if (inputNode) handleLogin(inputNode.value.trim());
            }}
            style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "#2d2416", color: "#f0ebe3", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "opacity 0.2s" }}
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // 4. MAIN AUTHENTICATED RENDER (SAFE FROM RULE VIOLATIONS)
  // ──────────────────────────────────────────────────────────
  const tabContent: Record<string, React.ReactNode> = {
    Overview: (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1208", margin: 0 }}>Welcome back, {studentName.split(" ")[0]} 👋</h2>
          <p style={{ fontSize: 13, color: "#a8967a", margin: "4px 0 0" }}>Biomedical Engineering Workspace Workspace · Version {PORTAL_VERSION}</p>
        </div>
        {/* Metric grids and charts go directly here */}
      </div>
    ),
    Timetable: (
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1208", marginBottom: 16 }}>Class Schedule Planner</h2>
        {/* Schedule layout logic goes here */}
      </div>
    ),
    Attendance: (
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1208", marginBottom: 16 }}>Attendance Compliance Monitor</h2>
        {/* Compliance details logic goes here */}
      </div>
    ),
    Profile: (
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ece8e0", padding: 24, maxWidth: 500 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>User Identity Profile</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <Avatar 
            name={studentName} 
            size={88} 
            avatarUrl={avatarDataUrl} 
            showUploadHint={true} 
            onClick={() => fileInputRef.current?.click()} 
            onRemove={() => {
              setAvatarDataUrl("");
              localStorage.removeItem(`avatar_${studentID}`);
            }}
          />
          <div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1208" }}>{studentName}</h4>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8b7355" }}>ID Token Reference: #{studentID}</p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#fcfaf7" }}>
      {/* Hidden layout native picture upload field hook */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarUpload} 
        accept="image/*" 
        style={{ display: "none" }} 
      />

      {/* DESKTOP SIDEBAR VIEW CONTAINER */}
      <aside className="desktop-sidebar" style={{ width: 260, borderRight: "1px solid #f0ebe3", background: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: 24, borderBottom: "1px solid #f0ebe3", display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={studentName} avatarUrl={avatarDataUrl} onClick={() => setActiveTab("Profile")} />
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: "#1a1208", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{studentName}</p>
            <p style={{ fontSize: 11, color: "#a8967a", margin: 0 }}>BME Undergraduate</p>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {Object.keys(tabContent).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12, border: "none",
                background: activeTab === tab ? "#f7f3ed" : "transparent",
                color: activeTab === tab ? "#2d2416" : "#6b5438",
                fontWeight: activeTab === tab ? 700 : 500, fontSize: 13, textAlign: "left", cursor: "pointer"
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div style={{ padding: 16, borderTop: "1px solid #f0ebe3" }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: "none", background: "transparent", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <LogOut size={16} /> Disconnect Session
          </button>
        </div>
      </aside>

      {/* CENTRAL CORE PLATFORM BOARD AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* MOBILE HEADER VIEW */}
        <header className="mobile-header" style={{ display: "none", background: "#fff", borderBottom: "1px solid #f0ebe3", padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Avatar name={studentName} avatarUrl={avatarDataUrl} onClick={() => setActiveTab("Profile")} />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
              <Menu size={24} color="#2d2416" />
            </button>
          </div>
          
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden", marginTop: 12 }}>
                {Object.keys(tabContent).map((tab) => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }} style={{ width: "100%", padding: "12px 8px", border: "none", background: "transparent", textTransform: "capitalize", textAlign: "left", fontSize: 14, color: activeTab === tab ? "#2d2416" : "#6b5438", fontWeight: activeTab === tab ? 700 : 500 }}>
                    {tab}
                  </button>
                ))}
                <button onClick={handleLogout} style={{ width: "100%", padding: "12px 8px", border: "none", background: "transparent", color: "#ef4444", textAlign: "left", fontSize: 14, fontWeight: 600 }}>
                  Disconnect Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* CONTROLLER MAIN CONTENT ELEMENT VIEW PAINT */}
        <main style={{ flex: 1, padding: "24px 20px 40px", overflowY: "auto" }} className="content-area">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* FLOATING ARTIFICIAL INTELLIGENCE CHATBOT CONTAINER */}
      {isLoggedIn && <BMEChatbot studentName={studentName} studentID={studentID} />}

      {/* INTERACTIVE MODAL COMPONENT PORTALS */}
      <AnimatePresence>
        {showCWAModal && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} onClick={() => setShowCWAModal(false)} />}
        {showSurvivalKit && <SURVIVAL_KIT onClose={() => setShowSurvivalKit(false)} />}
      </AnimatePresence>

      {/* RESPONSIVE LAYOUT GLOBAL CORE CSS SCOPES */}
      <style>{`
        .desktop-sidebar { display: flex !important; }
        .mobile-header { display: none !important; }
        @media (max-width: 767px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: block !important; }
          .content-area { padding: 20px 16px 36px !important; }
        }
      `}</style>
    </div>
  );
}
