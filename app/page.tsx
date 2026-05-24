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
      alert("Image is too large. Please choose an image under 10MB.");
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
          const virtualFile = dataURLtoFile(compressedB64, file.name);
          onFileSelect(virtualFile);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset value so choosing the same photo after removal fires onChange cleanly
    e.target.value = "";
  };

  // Helper conversion mechanic
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div 
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
      className="avatar-container"
    >
      <div
        onClick={() => showUploadHint && fileInputRef.current?.click()}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: avatarUrl ? "transparent" : "linear-gradient(135deg, #e8d5c4, #c9a87c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: showUploadHint ? "pointer" : "default",
          position: "relative",
          border: avatarUrl ? "1px solid #ece8e0" : "none"
        }}
      >
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        ) : (
          <span style={{ fontSize: size * 0.36, fontWeight: 700, color: "#5c3d1e", fontFamily: "'Syne', sans-serif" }}>
            {initials}
          </span>
        )}

        {/* Hover Upload Overlay Trigger */}
        {showUploadHint && (
          <div
            className="upload-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(45, 36, 22, 0.75)", // Uses your #2d2416 background token
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s ease",
              color: "#f7f3ed"
            }}
          >
            <span style={{ fontSize: size >= 88 ? "20px" : "14px" }}>📷</span>
            {size >= 60 && (
              <span style={{ fontSize: "9px", fontWeight: 700, marginTop: 2, letterSpacing: 0.5 }}>
                CHANGE
              </span>
            )}
          </div>
        )}
      </div>

      {/* Profile Page Context Remover Pin */}
      {avatarUrl && onRemove && size >= 88 && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Stop click from popping open the input panel
            onRemove();
          }}
          style={{
            position: "absolute",
            bottom: 0,
            right: -4,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid #fff",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            fontSize: 12,
            fontWeight: 800
          }}
        >
          ✕
        </button>
      )}

      {showUploadHint && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
      )}

      <style>{`
        .avatar-container:hover .upload-overlay {
          opacity: 1 !important;
        }
      `}</style>
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
// MODAL IMPLEMENTATIONS
// ============================================================

const SurvivalKitModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(26, 18, 8, 0.4)", backdropFilter: "blur(4px)" }} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: "relative", width: "100%", maxWidth: 540, maxHeight: "80vh", background: "#fff", borderRadius: 24, border: "1px solid #ece8e0", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🎒</span>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#2d2416", margin: 0 }}>BME Survival Kit</h3>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}><X size={18} color="#8b7355" /></button>
        </div>
        <p style={{ fontSize: 13, color: "#8b7355", marginTop: 0, marginBottom: 24 }}>Handpicked resources, video playlists, and reference sheets for your core Semester 2 modules.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SURVIVAL_KIT.map((kit, idx) => (
            <div key={idx} style={{ padding: 16, borderRadius: 16, border: "1px solid #ece8e0", background: "#faf9f6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>{kit.emoji}</span>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: kit.color }}>{kit.course}</h4>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {kit.resources.map((res, rIdx) => (
                  <a key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: "#fff", border: "1px solid #f0ebe3", textDecoration: "none", fontSize: 12, color: "#4a3b2c", fontWeight: 500, transition: "background 0.2s" }}
                     onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fdfcfb"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{res.label}</span>
                    <ExternalLink size={12} style={{ flexShrink: 0, color: "#a8967a" }} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const CWAModal = ({ onClose }: { onClose: () => void }) => {
  const [grades, setGrades] = useState<Record<string, string>>({});
  const calculatedCWA = useMemo(() => {
    let totalWeightedMarks = 0;
    let totalCredits = 0;
    COURSE_CREDITS.forEach(course => {
      const markStr = grades[course.code] || "";
      const mark = parseFloat(markStr);
      if (!isNaN(mark) && mark >= 0 && mark <= 100) {
        totalWeightedMarks += mark * course.credits;
        totalCredits += course.credits;
      }
    });
    return totalCredits > 0 ? (totalWeightedMarks / totalCredits).toFixed(2) : null;
  }, [grades]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(26, 18, 8, 0.4)", backdropFilter: "blur(4px)" }} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: "relative", width: "100%", maxWidth: 480, maxHeight: "85vh", background: "#fff", borderRadius: 24, border: "1px solid #ece8e0", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Calculator size={22} color="#2d2416" />
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 19, color: "#2d2416", margin: 0 }}>CWA Predictor</h3>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}><X size={18} color="#8b7355" /></button>
        </div>
        <p style={{ fontSize: 13, color: "#8b7355", marginTop: 0, marginBottom: 20 }}>Input your estimated raw module marks to predict your weighted average metrics.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {COURSE_CREDITS.map((course) => (
            <div key={course.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: "#faf9f6", border: "1px solid #f0ebe3" }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#2d2416" }}>{course.code}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#a8967a" }}>{course.name} · {course.credits} Cr</p>
              </div>
              <input
                type="number"
                placeholder="Score"
                min={0}
                max={100}
                value={grades[course.code] || ""}
                onChange={e => setGrades({ ...grades, [course.code]: e.target.value })}
                style={{ width: 70, padding: "8px 10px", borderRadius: 10, border: "1px solid #ece8e0", background: "#fff", fontSize: 13, textAlign: "center", outline: "none", fontWeight: 600 }}
              />
            </div>
          ))}
        </div>
        {calculatedCWA !== null ? (
          <div style={{ background: "#2d2416", padding: 16, borderRadius: 16, textAlign: "center", color: "#f0ebe3" }}>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "#c9a87c", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>Estimated Semester CWA</p>
            <p style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>{calculatedCWA}</p>
          </div>
        ) : (
          <div style={{ background: "#faf9f6", border: "1px dashed #ece8e0", padding: 14, borderRadius: 16, textAlign: "center", fontSize: 12, color: "#a8967a" }}>
            Enter your numeric course scores above to generate average metrics.
          </div>
        )}
      </motion.div>
    </div>
  );
};

const UpdatesModal = ({ announcements, files, onClose }: { announcements: any[]; files: any[]; onClose: () => void }) => {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(26, 18, 8, 0.4)", backdropFilter: "blur(4px)" }} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: "relative", width: "100%", maxWidth: 500, maxHeight: "80vh", background: "#fff", borderRadius: 24, border: "1px solid #ece8e0", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Bell size={20} color="#2d2416" />
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 19, color: "#2d2416", margin: 0 }}>Updates Hub</h3>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}><X size={18} color="#8b7355" /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#8b7355", textTransform: "uppercase", letterSpacing: 0.5 }}>Broad Announcements</h4>
            {announcements.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {announcements.map((ann, idx) => (
                  <div key={idx} style={{ padding: 12, borderRadius: 12, background: "#faf9f6", border: "1px solid #f0ebe3", fontSize: 12, lineHeight: 1.5, color: "#4a3b2c" }}>
                    {ann.text}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: "#a8967a", fontStyle: "italic" }}>No current platform broad announcements.</p>
            )}
          </div>
          <div>
            <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#8b7355", textTransform: "uppercase", letterSpacing: 0.5 }}>Resources & Handouts</h4>
            {files.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {files.map((file, idx) => (
                  <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, background: "#fff", border: "1px solid #ece8e0", textDecoration: "none" }}>
                    <FileText size={16} color="#c9a87c" />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#2d2416", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                    <Download size={14} color="#8b7355" style={{ flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: "#a8967a", fontStyle: "italic" }}>No files uploaded yet.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================
// MAIN PORTAL
// ============================================================
export default function StudentPortal() {
  // ── 1. ALL HOOKS DEFINED UNCONDITIONALLY AT TOP ────────────────────────────
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
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("");


  // ====== 1. AVATAR STATE & AUTO-HYDRATION HOOK ======
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn && studentID) {
      try {
        const savedAvatar = localStorage.getItem(`bme_avatar_${studentID}`);
        if (savedAvatar) setAvatarDataUrl(savedAvatar);
      } catch (e) {
        console.error("Failed to read from storage cache:", e);
      }
    } else if (!isLoggedIn) {
      setAvatarDataUrl(null);
    }
  }, [isLoggedIn, studentID]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
        console.error("Failed fetching updates hub notifications:", err);
      }
    };
    fetchUpdates();
  }, []);

// PASTE THIS EXPLICITLY TYPED FILE HANDLER INSTEAD:
const handleAvatarUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64String = e.target?.result as string;
    
    // Instantly sync state across headers, sidebars, and components
    setAvatarDataUrl(base64String);

    // Save with error boundaries for storage quotas
    try {
      localStorage.setItem(`bme_avatar_${studentID}`, base64String);
    } catch (error) {
      console.error("Storage quota exceeded:", error);
      alert("Storage limit hit. Your profile photo will reset upon refreshing the tab.");
    }
  };
  reader.readAsDataURL(file);
};

  // ── 2. DERIVE AND MEMO VALUES (SAFE AFTER ALL HOOKS) ──────────────────────
  const studentName = CLASS_LIST[studentID] || "";
  const isAdmin = ADMIN_IDS.includes(studentID);
  const isLoggedIn = !!studentName;

  const handleLogin = (id: string) => {
    if (CLASS_LIST[id]) {
      setStudentID(id);
      localStorage.setItem("studentPortal_id", id);
    } else {
      alert("Invalid Student ID.");
    }
  };

  const handleLogout = () => {
    setStudentID("");
    setAvatarDataUrl("");
    localStorage.removeItem("studentPortal_id");
  };

  const toggleAttendance = (courseCode: string, dayIdx: number) => {
    const currentLogs = attendance[courseCode] || [];
    const updatedLogs = [...currentLogs];
    const currentVal = updatedLogs[dayIdx];
    if (currentVal === 1) updatedLogs[dayIdx] = 0;
    else if (currentVal === 0) updatedLogs[dayIdx] = -1;
    else updatedLogs[dayIdx] = 1;
    const nextAttendance = { ...attendance, [courseCode]: updatedLogs };
    setAttendance(nextAttendance);
    localStorage.setItem(`attendance_v2_${studentID}`, JSON.stringify(nextAttendance));
  };

  const countdownText = useMemo(() => {
    if (!currentTime) return "...";
    const diff = END_OF_SEM_DATE.getTime() - currentTime.getTime();
    if (diff <= 0) return "Semester Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${mins}m left`;
  }, [currentTime]);

  const courseStats = useMemo(() => {
    return COURSE_CREDITS.map((c) => {
      const logs = attendance[c.code] || [];
      const attended = logs.filter((v) => v === 1).length;
      const missed = logs.filter((v) => v === 0).length;
      let weekdayNum = 1;
      if (c.code.startsWith("SOC") || c.code.startsWith("BME")) weekdayNum = 2;
      else if (c.code === "COE 152") weekdayNum = 2;
      else if (c.code === "MATH 152") weekdayNum = 3;
      else if (c.code.startsWith("PHY")) weekdayNum = 1;
      else if (c.code.startsWith("ME")) weekdayNum = 5;
      const totalSessions = SESSIONS_BY_WEEKDAY[weekdayNum] || 12;
      const totalLogged = attended + missed;
      const unlogged = Math.max(0, totalSessions - totalLogged);
      const pct = totalLogged > 0 ? Math.round((attended / totalLogged) * 100) : 100;
      return { ...c, attended, missed, unlogged, totalSessions, pct };
    });
  }, [attendance]);

  const overallAttendancePct = useMemo(() => {
    let totalAttended = 0;
    let totalLogged = 0;
    Object.values(attendance).forEach((logs) => {
      logs.forEach((val) => {
        if (val === 1) { totalAttended++; totalLogged++; }
        else if (val === 0) { totalLogged++; }
      });
    });
    return totalLogged > 0 ? Math.round((totalAttended / totalLogged) * 100) : 100;
  }, [attendance]);

  const nextClass = useMemo(() => {
    if (!currentTime) return null;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[currentTime.getDay()];
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const todayClasses = TIMETABLE[todayName] || [];
    const upcoming = todayClasses.filter((c) => {
      const startTimeStr = c.time.split(" - ")[0];
      return timeToMinutes(startTimeStr) > currentMinutes;
    });
    if (upcoming.length > 0) {
      upcoming.sort((a, b) => timeToMinutes(a.time.split(" - ")[0]) - timeToMinutes(b.time.split(" - ")[0]));
      return { ...upcoming[0], day: "Today" };
    }
    return null;
  }, [currentTime]);

  // ====== 2. THE MISSING HANDLERS WRITTEN FOR THE COMPILER ======
  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setAvatarDataUrl(base64String);

      try {
        localStorage.setItem(`bme_avatar_${studentID}`, base64String);
      } catch (error) {
        console.error("Storage quota exceeded:", error);
        alert("Storage limit hit. Your profile photo will reset upon refreshing the tab.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setAvatarDataUrl(null);
    try {
      localStorage.removeItem(`bme_avatar_${studentID}`);
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  };

  // ── 3. EARLY RETURN FOR LOGIN SCREEN (SAFE) ────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fcfaf7", padding: 16 }}>
        <div style={{ maxWidth: 400, width: "100%", background: "#fff", padding: "40px 32px", borderRadius: 24, border: "1px solid #f0ebe3", boxShadow: "0 12px 40px rgba(139,115,85,0.06)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#2d2416", margin: "0 0 8px" }}>BME Portal Workspace</h1>
            <p style={{ fontSize: 13, color: "#8b7355", margin: 0 }}>Enter your student ID to enter the workspace</p>
          </div>
          <input
            type="text"
            placeholder="Student ID Code"
            maxLength={12}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(e.currentTarget.value.trim()); }}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid #ece8e0", background: "#faf8f4", fontSize: 15, outline: "none", color: "#1a1208", textAlign: "center", letterSpacing: 1, marginBottom: 16 }}
          />
          <button
            onClick={(e) => { const node = e.currentTarget.previousSibling as HTMLInputElement; if (node) handleLogin(node.value.trim()); }}
            style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "#2d2416", color: "#f0ebe3", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── 4. DASHBOARD TABS ──────────────────────────────────────────────────────
  const tabContent: Record<string, React.ReactNode> = {
    Overview: (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1208", margin: 0 }}>Welcome back, {studentName.split(" ")[0]} 👋</h2>
            <p style={{ fontSize: 13, color: "#a8967a", margin: "4px 0 0" }}>Biomedical Engineering Workspace · Year 1 Sem 2</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowCWAModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 12, border: "1px solid #ece8e0", background: "#fff", fontSize: 12, color: "#4a3b2c", fontWeight: 600, cursor: "pointer" }}>
              <Calculator size={14} /> Predict CWA
            </button>
            <button onClick={() => setShowSurvivalKit(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 12, border: "none", background: "#2d2416", fontSize: 12, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
              <BookOpen size={14} /> Survival Kit
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 20, border: "1px solid #ece8e0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 12, color: "#8b7355", fontWeight: 600 }}>SEMESTER COUNTDOWN</span><Clock size={16} color="#c9a87c" /></div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1a1208", fontFamily: "'Syne', sans-serif" }}>{countdownText}</p>
          </div>
          <div style={{ background: "#fff", padding: 20, borderRadius: 20, border: "1px solid #ece8e0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 12, color: "#8b7355", fontWeight: 600 }}>OVERALL COMPLIANCE</span><Activity size={16} color="#22c55e" /></div>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#22c55e", fontFamily: "'Syne', sans-serif" }}>{overallAttendancePct}%</p>
          </div>
          <div style={{ background: "#fff", padding: 20, borderRadius: 20, border: "1px solid #ece8e0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 12, color: "#8b7355", fontWeight: 600 }}>NEXT LECTURE</span><MapPin size={16} color="#f59e0b" /></div>
            {nextClass ? (
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1208" }}>{nextClass.course} ({nextClass.venue})</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#a8967a" }}>{nextClass.time}</p>
              </div>
            ) : <p style={{ margin: 0, fontSize: 13, color: "#a8967a", fontStyle: "italic" }}>No upcoming classes today</p>}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ece8e0", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Attendance Tracker Matrix</h3>
            <button onClick={() => setActiveTab("Attendance")} style={{ fontSize: 12, background: "none", border: "none", color: "#c9a87c", fontWeight: 600, cursor: "pointer" }}>Manage Matrix →</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0ebe3", textAlign: "left" }}>
                  <th style={{ padding: "10px 8px", color: "#8b7355", fontWeight: 600 }}>Module</th>
                  <th style={{ padding: "10px 8px", color: "#8b7355", fontWeight: 600 }}>Attended</th>
                  <th style={{ padding: "10px 8px", color: "#8b7355", fontWeight: 600 }}>Missed</th>
                  <th style={{ padding: "10px 8px", color: "#8b7355", fontWeight: 600 }}>Rate</th>
                  <th style={{ padding: "10px 8px", color: "#8b7355", fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {courseStats.map((c) => (
                  <tr key={c.code} style={{ borderBottom: "1px solid #faf8f4" }}>
                    <td style={{ padding: "12px 8px", fontWeight: 600, color: "#2d2416" }}>{c.code}</td>
                    <td style={{ padding: "12px 8px", color: "#22c55e", fontWeight: 600 }}>{c.attended}</td>
                    <td style={{ padding: "12px 8px", color: "#ef4444", fontWeight: 600 }}>{c.missed}</td>
                    <td style={{ padding: "12px 8px", fontWeight: 700 }}>{c.pct}%</td>
                    <td style={{ padding: "12px 8px" }}><AttendanceBadge pct={c.pct} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    Timetable: (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1208", margin: 0 }}>Class Schedule Matrix</h2>
          <p style={{ fontSize: 12, color: "#a8967a", margin: "2px 0 0" }}>Weekly synchronized lecture and laboratory schedule</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.entries(TIMETABLE).map(([day, classes]) => (
            <div key={day} style={{ background: "#fff", borderRadius: 16, border: "1px solid #ece8e0", padding: 16 }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#8b7355", textTransform: "uppercase" }}>{day}</h4>
              {classes.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                  {classes.map((c) => (
                    <div key={c.id} style={{ display: "flex", gap: 12, padding: 12, borderRadius: 12, background: "#faf8f4", borderLeft: `4px solid ${COURSE_COLORS[c.course] || "#ece8e0"}` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1208" }}>{c.course}</span>
                          <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 8, background: "#fff", border: "1px solid #ece8e0", color: "#6b5438", fontWeight: 600 }}>{c.type}</span>
                        </div>
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#8b7355", display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {c.time}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#a8967a", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {c.venue} · {c.lecturer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p style={{ margin: 0, fontSize: 12, color: "#a8967a", fontStyle: "italic" }}>No lectures scheduled</p>}
            </div>
          ))}
        </div>
      </div>
    ),
    Attendance: (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1208", margin: 0 }}>Compliance Monitor Workspace</h2>
          <p style={{ fontSize: 12, color: "#a8967a", margin: "2px 0 0" }}>Click columns to alternate state triggers: Attended (Green), Missed (Red), Clear (Gray)</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {courseStats.map((c) => (
            <div key={c.code} style={{ background: "#fff", borderRadius: 18, border: "1px solid #ece8e0", padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#2d2416" }}>{c.code} — {c.name}</h4>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#a8967a" }}>Required semester session runs: ~ {c.totalSessions} targets</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1208" }}>{c.pct}% Rate</span>
                  <AttendanceBadge pct={c.pct} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Array.from({ length: c.totalSessions }).map((_, idx) => {
                  const val = (attendance[c.code] || [])[idx];
                  let bg = "#eef0f2";
                  if (val === 1) bg = "#22c55e";
                  else if (val === 0) bg = "#ef4444";
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleAttendance(c.code, idx)}
                      style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: bg, cursor: "pointer", transition: "transform 0.1s" }}
                      title={`Session #${idx + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    Profile: (
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ece8e0", padding: 24, maxWidth: 500 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Identity Settings</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          {/* PASTE THIS CLEAN BLOCK INSTEAD */}
<Avatar 
  name={studentName} 
  avatarUrl={avatarDataUrl} 
  size={88} 
  showUploadHint={true} 
  onFileSelect={handleAvatarUpload}
  onRemove={handleAvatarRemove}
/>
          <div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1208" }}>{studentName}</h4>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8b7355" }}>Student ID Reference: #{studentID}</p>
          </div>
        </div>
        <div style={{ paddingTop: 16, borderTop: "1px solid #f0ebe3" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#a8967a" }}>Your access credentials are saved locally in your browser workspace storage maps.</p>
        </div>
      </div>
    )
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#fcfaf7" }}>
      <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: "none" }} />

      {/* DESKTOP SIDEBAR */}
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
          <button onClick={() => setShowUpdatesHub(true)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "none", background: "transparent", color: "#6b5438", fontWeight: 500, fontSize: 13, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Bell size={14} /> Updates Hub {(announcements.length > 0 || files.length > 0) && <span style={{ width: 6, height: 6, borderRadius: 3, background: "#ef4444" }} />}
          </button>
        </nav>

        <div style={{ padding: 16, borderTop: "1px solid #f0ebe3" }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: "none", background: "transparent", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <LogOut size={16} /> Disconnect Session
          </button>
        </div>
      </aside>

      {/* CORE FRAME CONTAINER */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* MOBILE HEADER */}
        <header className="mobile-header" style={{ background: "#fff", borderBottom: "1px solid #f0ebe3", padding: "12px 16px" }}>
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
                  <button key={tab} onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }} style={{ width: "100%", padding: "12px 8px", border: "none", background: "transparent", textAlign: "left", fontSize: 14, color: activeTab === tab ? "#2d2416" : "#6b5438", fontWeight: activeTab === tab ? 700 : 500 }}>
                    {tab}
                  </button>
                ))}
                <button onClick={() => { setShowUpdatesHub(true); setMobileMenuOpen(false); }} style={{ width: "100%", padding: "12px 8px", border: "none", background: "transparent", color: "#6b5438", textAlign: "left", fontSize: 14, fontWeight: 500 }}>
                  Updates Hub
                </button>
                <button onClick={handleLogout} style={{ width: "100%", padding: "12px 8px", border: "none", background: "transparent", color: "#ef4444", textAlign: "left", fontSize: 14, fontWeight: 600 }}>
                  Disconnect Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* CONTROLLER MAIN WINDOW */}
        <main style={{ flex: 1, padding: "24px 20px 40px", overflowY: "auto" }} className="content-area">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* FLOATING ARTIFICIAL INTELLIGENCE CHATBOT */}
      {isLoggedIn && <BMEChatbot studentName={studentName} studentID={studentID} />}

      {/* MODAL PORTAL ATTACHMENTS */}
      <AnimatePresence>
        {showCWAModal && <CWAModal onClose={() => setShowCWAModal(false)} />}
        {showSurvivalKit && <SurvivalKitModal onClose={() => setShowSurvivalKit(false)} />}
        {showUpdatesHub && <UpdatesModal announcements={announcements} files={files} onClose={() => setShowUpdatesHub(false)} />}
      </AnimatePresence>

      {/* LAYOUT ARCHITECTURE RESPONSIVE CSS SCOPES */}
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
