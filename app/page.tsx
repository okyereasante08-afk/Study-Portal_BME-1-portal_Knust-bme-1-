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
    resources: [
      { label: "Calculus 1/Math 152- Full Playlist(Skancity Academy)", url: "https://www.youtube.com/playlist?list=PLInywrvFyvq6_G3iA7LHbt5exJgGbp4Ok" },
      { label: "Calculus Tutorials-Finish Calculus 1 in just 19 videos", url: "https://www.youtube.com/playlist?list=PLLRIy3Upn5vLRQWLdtVN_OkMYobabpj0i" },
      { label: "Calculus in 22 days- with simply 4 videos a day finish Calculus in just 3 weeks", url: "https://www.youtube.com/playlist?list=PLLRIy3Upn5vJ6TW_6ex6cMXWhcvAt3JZl" },
    ]
  },
  {
    course: "COE 152 — Basic Electronics", color: "#f59e0b", emoji: "🪫",
    resources: [
      { label: "Basic Electronics-KNUST(Maths Hub GH)", url: "https://www.youtube.com/playlist?list=PLldc0i2lkatVFhbnQRS-dOcI6xRdTJ0Lm" },
      { label: "SemiConductors", url: "https://youtu.be/ErcH_OuCaNY?si=woPM9OXzL6NrihZe" },
      { label: "Half-Wave Rectification", url: "https://youtu.be/CpcJxhFnmMo?si=8l5HO3BrsVDO3fgk" },
      { label: "Full-Wave Rectification", url: "https://youtu.be/quyqtaKIr78?si=pMMeyYYVmKqkhHGg" },
      { label: "Full-Wave Rectification (Demonstration)", url: "https://youtu.be/dNi_T0P5TLk?si=spqbtmaZ8CEkZyWk" },
      { label: "Diodes", url: "https://youtu.be/n4XZ02N11Hc?si=hhDRvOEa4MtBWwsP" },
      { label: "Solving Diode Circuits", url: "https://youtu.be/sDWWGhuRqFs?si=MozZmpTDcPLBV8dh" },
      { label: "Basic Electronics for Beginners (Organic Chem Tutor)", url: "https://youtu.be/uXr4lXYjXuU?list=PL0o_zxa4K1BV9E-N8tSExU1djL6slnjbL" },
    ]
  },
  {
    course: "BME 166 — Biochemistry", color: "#3b82f6", emoji: "⚕️",
    resources: [
      { label: "Biochemistry (Ninja Nerd) Playlist ", url: "https://www.youtube.com/playlist?list=PLTF9h-T1TcJhcNo9M1VFXz6rMKT6CM_wd" },
      { label: "Metabolism (Ninja Nerd) Playlist", url: "https://www.youtube.com/watch?v=4eLjRcHnMCk&list=PLTF9h-T1TcJhcNo9M1VFXz6rMKT6CM_wd" },
      { label: "Drug Metabolism", url: "https://youtu.be/qvucMHUVZA4?si=6w3bg-OtR_dZxIt6" },
      { label: "Pharmacokinetics simplified", url: "https://youtu.be/16wNysLC9Fs?si=GUyEDdHymiWSSvD" },
      { label: "Fatty Acid Metabolism", url: "https://youtu.be/uYutpPY7xcw?si=OcIViUwwzDZLqNAh" },
    ]
  },
  {
    course: "ME 166 — Applied Thermodynamics", color: "#f97316", emoji: "⚙️",
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
    resources: [
      { label: "Density", url: "https://www.youtube.com/watch?v=NL9LRvcWxHs" },
      { label: "Fortins Barometer", url: "https://www.youtube.com/watch?v=S4pUMNdSIYk" },
      { label: "Variation of atmospheric pressure with altitude", url: "https://youtu.be/WGxuELoFzO4?si=nNJskZvYXo0Wvo9p" },
      { label: "Bernoulli's Equation Example Problems, Fluid Mechanics", url: "https://www.youtube.com/watch?v=xTAfyc06ZxQ" },
      { label: "Bernoulli's Principle Demo: Levitated Balls", url: "https://www.youtube.com/watch?v=Ye3QPgDdJNg" },
      { label: "Torricelli's Theorem -Explained", url: "https://youtu.be/2vfTwnlsrCM?si=nkc2XVXY6nkc2XVXY" },
      { label: "Torricelli's Law in 2 minutes", url: "https://youtu.be/LNgrIssGZlc?si=XLYtVYkwWHNv-b9S" },
      { label: "Torricelli's Theorem practice problems", url: "https://www.youtube.com/watch?v=046-DygKrhc" },
      { label: "What is pitot tube? 3D Animation", url: "https://youtu.be/3zEdtkuNYLU?si=66XMbfPdG3ykQLM6" },
      { label: "Pitot Static Tube Introduction & Example", url: "https://www.youtube.com/watch?v=VOMO7zsvHsM" },
      { label: "Streamlines and Velocity", url: "https://youtu.be/AGve4RZ4zjw?si=yVwwXP6W9udDhT-_" },
      { label: "Streamlines and Velocity 2", url: "https://youtu.be/kDO3EcXblwg?si=Z4Ix44waDRcyxQPn" },
      { label: "Steady vs Unsteady Flow", url: "https://youtu.be/-a7EtooUf5U?si=LNGn5kMW1HF2fiUq" },
      { label: "Elasticity", url: "https://www.youtube.com/watch?v=HALbtyDUjp0" },
      { label: "Poiseuille's Law - Pressure Difference-Volume Flow Rate", url: "https://youtu.be/UeQu19VChjE?si=8ZFcvj7jwmA7FfRa" },
      { label: "Viscosity of Fluids & Velocity Gradient", url: "https://youtu.be/PoG14wRRQmM?si=pR7OFoRmBhoUYPwD" },
      { label: "★Newtons law of viscosity ★Stoke's law ★Terminal velocity", url: "https://youtu.be/tWO-NikCrzs?si=HHl_lcQShn_hWq1k" },
    ]
  },
];

const END_OF_SEM_DATE = new Date("2026-09-04T00:00:00");
const MID_SEM_START = new Date("2026-07-06T00:00:00");
const EXAMS_START = new Date("2026-08-17T00:00:00");
const PORTAL_VERSION = "2.1.0";

// ── Semester sessions calculation ─────────────────────────────────────────────
const SEM_START = new Date("2026-05-25T00:00:00");

const EXCLUDED_RANGES: [Date, Date][] = [
  [new Date("2026-07-06T00:00:00"), new Date("2026-07-10T00:00:00")],
  [new Date("2026-08-17T00:00:00"), new Date("2026-09-04T00:00:00")],
];

const isExcluded = (date: Date): boolean =>
  EXCLUDED_RANGES.some(([s, e]) => date >= s && date <= e);

const calcTotalSemesterSessions = (weekday: number): number => {
  let count = 0;
  const cursor = new Date(SEM_START);
  while (cursor <= END_OF_SEM_DATE) {
    if (cursor.getDay() === weekday && !isExcluded(new Date(cursor))) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
};

const SESSIONS_BY_WEEKDAY: Record<number, number> = {
  1: calcTotalSemesterSessions(1),
  2: calcTotalSemesterSessions(2),
  3: calcTotalSemesterSessions(3),
  4: calcTotalSemesterSessions(4),
  5: calcTotalSemesterSessions(5),
};

const AT_RISK_THRESHOLD = 70;

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// ============================================================
// HELPER COMPONENTS
// ============================================================

// ============================================================
// ENHANCED AVATAR COMPONENT WITH COMPRESSION & CROP
// ============================================================

interface AvatarProps {
  name: string;
  size?: number;
  avatarUrl?: string | null;
  showUploadHint?: boolean;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 36,
  avatarUrl = null,
  showUploadHint = false,
  onFileSelect,
  onRemove
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onFileSelect) return;

    // Guard 1: Reject PDFs, videos, and non-image types
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      e.target.value = "";
      return;
    }

    // Guard 2: Reject files greater than 3MB to prevent browser freeze during context drawing
    if (file.size > 3 * 1024 * 1024) {
      alert("Image is too large. Please choose an image under 3MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          onFileSelect(file);
          return;
        }

        // Target size: 200px square gives crisp 2x retina headroom across all viewports
        const targetSize = 200;
        canvas.width = targetSize;
        canvas.height = targetSize;

        // Centre-crop calculation: extract largest square region from source dimensions
        const srcWidth = img.width;
        const srcHeight = img.height;
        let sx = 0, sy = 0, sWidth = srcWidth, sHeight = srcHeight;

        if (srcWidth > srcHeight) {
          sWidth = srcHeight;
          sx = (srcWidth - srcHeight) / 2;
        } else {
          sHeight = srcWidth;
          sy = (srcHeight - srcWidth) / 2;
        }

        // Draw cropped square region onto the 200x200 canvas
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetSize, targetSize);

        // Compress to JPEG at 82% quality (optimum visual fidelity vs minimal payload size)
        const compressedB64 = canvas.toDataURL("image/jpeg", 0.82);

        // Guard 3: Verify approximate KB payload size via standard base64-to-bytes formula
        const approxKB = (compressedB64.length * 3) / 4 / 1024;
        if (approxKB > 80) {
          // Fallback compression sweep for pathological cases
          const aggressiveB64 = canvas.toDataURL("image/jpeg", 0.60);
          const virtualFile = dataURLtoFile(aggressiveB64, file.name);
          onFileSelect(virtualFile);
        } else {
          const virtualFile = dataURLtoFile(
