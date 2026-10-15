// app/lib/years.ts
// ---------------------------------------------------------------------------
// ALL year-specific content lives in this file. To update a year, edit its
// block below: no UI code needs to change.
//
//   courses        -> used by the CWA calculator and the AI assistant
//   timetable      -> Timetable tab, Home "today" list, attendance tracking
//   kit            -> Resources tab: curated study links per course
//   files          -> Resources tab: slides / notes / manuals you upload
//   announcements  -> Home tab updates feed
// ---------------------------------------------------------------------------

import type { YearConfig, YearLevel, KitSection, Session } from "./types";

// Semester dates live in ./calendar.ts (edit them there).
import { SEMESTER } from "./calendar";
export { SEMESTER };

// ------------------------------- YEAR 1 ------------------------------------

const Y1_KIT: KitSection[] = [
  {
    course: "MATH 152 — CALCULUS WITH ANALYSIS", color: "#8b5cf6", emoji: "🧮",
    resources: [
      { label: "Calculus 1/Math 152- Full Playlist(Skancity Academy)", url: "https://www.youtube.com/playlist?list=PLInywrvFyvq6_G3iA7LHbt5exJgGbp4Ok" },
      { label: "Calculus Tutorials-Finish Calculus 1 in just 19 videos", url: "https://www.youtube.com/playlist?list=PLLRIy3Upn5vLRQWLdtVN_OkMYobabpj0i" },
      { label: "Calculus in 22 days- with simply 4 videos a day finish Calculus in just 3 weeks", url: "https://www.youtube.com/playlist?list=PLLRIy3Upn5vJ6TW_6ex6cMXWhcvAt3JZl" },
    ]
  },
  {
    course: "COE 152 — Basic Electronics", color: "#f97316", emoji: "🪫",
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
    course: "BME 166 — Biochemistry", color: "#f59e0b", emoji: "⚕️",
    resources: [
      { label: "Biochemistry (Ninja Nerd) Playlist", url: "https://www.youtube.com/playlist?list=PLTF9h-T1TcJhcNo9M1VFXz6rMKT6CM_wd" },
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
    course: "PHY 154 — Properties of Matter", color: "#06b6d4", emoji: "🧪",
    resources: [
      { label: "Density", url: "https://www.youtube.com/watch?v=NL9LRvcWxHs&pp=ygUURGVuc2l0eSBsZWN0dXJlIGZ1bGw%3D" },
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

const Y1_TIMETABLE: Session[] = [
  { id: "m1",  day: "Monday",    start: "07:00", end: "09:00", course: "BME 166",  venue: "LT (Behind Levine Building)", lecturer: "C. Apprey",          type: "Lecture" },
  { id: "m2",  day: "Monday",    start: "13:00", end: "14:55", course: "PHY 154",  venue: "Room G01",                    lecturer: "R. M. Noye",         type: "Lecture" },
  { id: "m3",  day: "Monday",    start: "15:00", end: "16:55", course: "ENGL 158", venue: "Eng. Audit",                  lecturer: "Z. Osei",            type: "Lecture" },
  { id: "t1",  day: "Tuesday",   start: "08:00", end: "09:55", course: "SOC 152",  venue: "PB012",                       lecturer: "O. K. J. R. Kwabena", type: "Lecture" },
  { id: "t2",  day: "Tuesday",   start: "10:30", end: "12:25", course: "COE 152",  venue: "PB020",                       lecturer: "D. A. Addo",         type: "Lecture" },
  { id: "w1",  day: "Wednesday", start: "08:00", end: "09:55", course: "MATH 152", group: "A", venue: "NEB - First Floor",  lecturer: "J. K. K. Asamoah",   type: "Lecture" },
  { id: "th1", day: "Thursday",  start: "13:00", end: "14:55", course: "MATH 152", group: "B", venue: "NEB - Second Floor", lecturer: "J. K. K. Asamoah",   type: "Lecture" },
  { id: "f1",  day: "Friday",    start: "08:00", end: "09:55", course: "ME 166",   venue: "NEB - FF2",                   lecturer: "K. O. Amoabeng",     type: "Lecture" },
  { id: "f2",  day: "Friday",    start: "10:30", end: "11:25", course: "COE 152",  venue: "Lab",                         lecturer: "D. A. Addo",         type: "Lab" },
];

// ------------------------------- ALL YEARS ---------------------------------

export const YEARS: Record<YearLevel, YearConfig> = {
  1: {
    level: 1,
    levelCode: "100",
    title: "Year 1",
    tagline: "Foundations: calculus, electronics, biochemistry and the physics behind it all.",
    semester: SEMESTER,
    courses: [
      { code: "MATH 152", name: "Calculus", credits: 4 },
      { code: "COE 152",  name: "Basic Electronics", credits: 3 },
      { code: "BME 166",  name: "Biochemistry", credits: 2 },
      { code: "PHY 154",  name: "Properties of Matter", credits: 2 },
      { code: "ME 166",   name: "Applied Thermodynamics", credits: 2 },
      { code: "ENGL 158", name: "Communication Skills II", credits: 2 },
      { code: "SOC 152",  name: "Sociology", credits: 3 },
    ],
    timetable: Y1_TIMETABLE,
    kit: Y1_KIT,
    files: [],
    slidesFolderUrl: "https://drive.google.com/drive/folders/1Es-zeNtSEYnxcgjknbubkIkGrLSqHB1Y?usp=sharing",
    announcements: [],
  },
  2: {
    level: 2,
    levelCode: "200",
    title: "Year 2",
    tagline: "Core biomedical engineering begins: mechanics, signals and physiology.",
    semester: SEMESTER,
    courses: [],
    timetable: [],
    kit: [],
    files: [],
    announcements: [],
  },
  3: {
    level: 3,
    levelCode: "300",
    title: "Year 3",
    tagline: "Instrumentation, imaging and biomaterials: where theory meets devices.",
    semester: SEMESTER,
    courses: [],
    timetable: [],
    kit: [],
    files: [],
    announcements: [],
  },
  4: {
    level: 4,
    levelCode: "400",
    title: "Year 4",
    tagline: "Final year: design projects, clinical engineering and your thesis.",
    semester: SEMESTER,
    courses: [],
    timetable: [],
    kit: [],
    files: [],
    announcements: [],
  },
};

export const YEAR_LEVELS: YearLevel[] = [1, 2, 3, 4];

export const parseLevel = (v: string | number | undefined | null): YearLevel | null => {
  const n = Number(v);
  return n === 1 || n === 2 || n === 3 || n === 4 ? (n as YearLevel) : null;
};

export const hasTimetable = (y: YearConfig) => y.timetable.length > 0;
