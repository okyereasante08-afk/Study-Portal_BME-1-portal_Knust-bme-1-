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

import type { YearConfig, YearLevel, KitSection, Session, Course, Announcement } from "./types";
import { TIMETABLES } from "./timetables";
import { COURSE_INFO } from "./courses";
import { CALENDAR_NOTICES } from "./calendar";

// Semester dates live in ./calendar.ts (edit them there).
import { SEMESTER } from "./calendar";
export { SEMESTER };

// ------------------------------- YEAR 1 ------------------------------------

const Y1_KIT: KitSection[] = [
  {
    course: "MATH 151 — Algebra", color: "#3b82f6", emoji: "📐",
    resources: [
      { label: "Linear Algebra Playlist (SkanCity Academy)", url: "https://www.youtube.com/playlist?list=PLInywrvFyvq4IE-nW-ikwkZ2v81n31HQX" },
      {label: "Complex numbers - De Moivre's Theorem", url: "https://youtu.be/J6TnZxUUzqU?si=-Z5cNKw6TBe5yMF_"},
      { label: "MULTIPLICATION OF A (3 x 3) MATRIX (Maths Hub GH)", url: "https://www.youtube.com/watch?v=yhEoKRmflTA" },
      { label: "Algebra of complex numbers/Modulus/argument (Maths Hub GH)", url: "https://www.youtube.com/watch?v=fykXhS2Nqbw" },
    ]
  },
  {
    course: "EE 151 — Applied Electricity", color: "#eab308", emoji: "⚡",
    resources: [
      { label: "Applied Electricity Complete Playlist (SkanCity Academy)", url: "https://www.youtube.com/playlist?list=PLInywrvFyvq7pFsDEDu2-n0f5UOhpqWBD" },
      { label: "Kirchhoff's Voltage Law - KVL Circuits (The Organic Chemistry Tutor)", url: "https://www.youtube.com/watch?v=6F_rmZ1nXFQ" },
      { label: "Kirchhoff's Current Law, Junction Rule (The Organic Chemistry Tutor)", url: "https://www.youtube.com/watch?v=Q39xQUlTGew" },
      { label: "Magnetism, Magnetic Field Force & Ampere's Law (The Organic Chemistry Tutor)", url: "https://www.youtube.com/watch?v=csMqfwJRjCs" },
      { label: "Reciprocity Theorem (Neso Academy)", url: "https://www.youtube.com/watch?v=X79SNOd1Izw" },
      { label: "How Three Phase Electricity Works (The Engineering Mindset)", url: "https://www.youtube.com/watch?v=4oRT7PoXSS0" },
    ]
  },
  {
    course: "ME 159 — Basic Mechanics", color: "#ef4444", emoji: "🏗️",
    resources: [
      { label: "INTRODUCTION TO BASIC MEHANICS: RESOLUTION OF FORCES", url: "https://www.youtube.com/watch?v=-Hj18wMcG6U" },
      { label: "BASIC MECHANICS SOLVED PROBLEMS", url: "https://www.youtube.com/watch?v=KdR9Lk97jyM" },
      { label: "END OF SEM - POSSIBLE QUESTIONS (BENAM ACADEMY)", url: "https://www.youtube.com/watch?v=bXJhnmyKGcY&list=PLZX9WOQeh5xUhFWcIhbz5uRcOG5G3TiJE&pp=sAg" },
    ]
  },
  {
    course: "BIOL 151 — Cell Biology", color: "#10b981", emoji: "🔬",
    resources: [
       { label: "Cell Biology - all in one", url: "https://www.youtube.com/watch?v=FQFBygnIONU&list=PLZX9WOQeh5xWxafRH3n-NPtwCMjVGFOgL" },
      { label: "The Cell Cycle and Cancer / Apoptosis (Amoeba Sisters)", url: "https://www.youtube.com/watch?v=QVCjdNxJreE" },
      { label: "Mitosis - Updated (Amoeba Sisters)", url: "https://www.youtube.com/watch?v=ShEzlXZPpPM" },
      { label: "Mitosis vs. Meiosis: Side by Side Comparison (Amoeba Sisters)", url: "https://www.youtube.com/watch?v=zrKdz93WlVk" },
    ]
  },
  {
    course: "ENGL 157 — Communication Skills", color: "#8b5cf6", emoji: "🗣️",
    resources: [
      { label: "Second Semester: Tutorial 2: Comm Skills (Philos MasterClass)", url: "https://www.youtube.com/watch?v=_NriXFXFRHI" },
      { label: "GPDR 111: COMMUNICATION SKILLS", url: "https://www.youtube.com/watch?v=Om5vITp-vOw" },
    ]
  },
  {
    course: "BME 160 — Engineering Tech", color: "#64748b", emoji: "💻",
    resources: [
      { label: "SolidWorks - Tutorial for Beginners in 13 MINUTES! (Skills Factory)", url: "https://www.youtube.com/watch?v=CiBwrjUeB8U" },
      { label: "SOLIDWORKS 2026 Beginner Tutorial (Design Forge)", url: "https://www.youtube.com/watch?v=jhaPTx056vI" },
      { label: "SolidWorks Tutorial for Beginners #1 (CAD CAM Tutorials)", url: "https://www.youtube.com/watch?v=Ulttc_2p4DY&list=PLrOFa8sDv6jcp8E3ayUFZ4iNI8uuPjXHe" },
      { label: "HTML CSS and Javascript Website Design Tutorial (Brian Design)", url: "https://www.youtube.com/watch?v=FazgJVnrVuI" },
      { label: "HTML, CSS, and Javascript in 30 minutes (devdojo)", url: "https://www.youtube.com/watch?v=_GTMOmRrqkU" },
    ]
  },
  {
    course: "CHEM 151 — General Chemistry", color: "#06b6d4", emoji: "🥽",
    resources: [
      { label: "The genius of Mendeleev's periodic table (TED-Ed)", url: "https://www.youtube.com/watch?v=fPnwBITSmgU" },
      { label: "How To Find The Percent Abundance of Each Isotope (The Organic Chemistry Tutor)", url: "https://www.youtube.com/watch?v=w-WhwWNC8-Q" },
      { label: "Second Law of Thermodynamics - Entropy & Spontaneous Processes (The Organic Chemistry Tutor)", url: "https://www.youtube.com/watch?v=DWiCaDPM7Hk" },
      { label: "Organic Chemistry 1 Final Exam Review (The Organic Chemistry Tutor)", url: "https://www.youtube.com/watch?v=3dHy7RJru68" },
    ]
  },
];

const Y2_KIT: KitSection[] = [
  {
    course: "Differential Equations",
    color: "#3b82f6",
    emoji: "",
    resources: [
      {
        label: "Dr. Eghan's Differential Equations Playlist",
        url: "https://www.youtube.com/watch?v=_GmLbuw40PU&list=PLawdnow2MW-wqDJlVE4UEVVOlX1P3mYgm"
      }
    ]
  },
  {
    course: "French",
    color: "#8b5cf6",
    emoji: "",
    resources: [
      {
        label: "How to Build a Sentence in French — Grammar Course Lesson 1 (The Perfect French with Dylane)",
        url: "https://www.youtube.com/watch?v=rYVhuQeYTik"
      },
      {
        label: "All the French Articles You Need to Know (The Perfect French with Dylane)",
        url: "https://www.youtube.com/watch?v=3XVsYOInmfA"
      },
      {
        label: "French Subject Pronouns — Beginner Grammar (The Perfect French with Dylane)",
        url: "https://www.youtube.com/watch?v=LVsK_6MTTzg"
      },
      {
        label: "French Conjugation Explained in 30 Minutes — Verb Groups and Tenses (Learn French With Alexa)",
        url: "https://www.youtube.com/watch?v=I1fSiKNn6aY"
      },
      {
        label: "Learn French in 5 Days — Day 1 (Learn French with Vincent)",
        url: "https://www.youtube.com/watch?v=Gs96pLzbGwI"
      }
    ]
  },
  {
    course: "Introductory Economics",
    color: "#14b8a6",
    emoji: "",
    resources: [
      {
        label: "Intro to Economics — Course Trailer (Khan Academy)",
        url: "https://www.youtube.com/watch?v=wCHm5SdNO5U"
      },
      {
        label: "Law of Demand — Supply, Demand, and Market Equilibrium (Khan Academy)",
        url: "https://www.youtube.com/watch?v=ShzPtU7IOXs"
      },
      {
        label: "Equilibrium Price and Quantity for Supply and Demand (Khan Academy)",
        url: "https://www.youtube.com/watch?v=PEMkfgrifDw"
      },
      {
        label: "Change in Supply versus Change in Quantity Supplied (Khan Academy)",
        url: "https://www.youtube.com/watch?v=NrlF8mMHfLE"
      },
      {
        label: "Elasticity of Demand — Micro Topic 2.3 (Jacob Clifford)",
        url: "https://www.youtube.com/watch?v=HHcblIxiAAk"
      },
      {
        label: "Elasticity Overview and Tips — Price, Income, and Cross-Price Elasticity (Jacob Clifford)",
        url: "https://www.youtube.com/watch?v=eylEJ8OKFKE"
      }
    ]
  },
  {
    course: "BME 265 — Biomedical Transport Phenomena",
    color: "#10b981",
    emoji: "",
    resources: [
      {
        label: "Introduction to Viscous Flow — Laminar Flow between Parallel Plates (LearnChemE)",
        url: "https://www.youtube.com/watch?v=Cj8-vu2zsQI"
      },
      {
        label: "Shear Stress between Parallel Plates (LearnChemE)",
        url: "https://www.youtube.com/watch?v=oe-jAK5i5dw"
      },
      {
        label: "Heat Transfer Basics — Conduction, Convection, and Radiation (LearnChemE)",
        url: "https://www.youtube.com/watch?v=NwOZ1tSe9hs"
      },
      {
        label: "Fourier's Law of Heat Conduction Explained",
        url: "https://www.youtube.com/watch?v=m7PvME2UzSY"
      },
      {
        label: "Convective Mass Transfer: Part 1 — Biomedical Example (LearnChemE)",
        url: "https://www.youtube.com/watch?v=ha_tdquI32Y"
      },
      {
        label: "Equimolar Counterdiffusion — Mass Transfer Fundamentals (LearnChemE)",
        url: "https://www.youtube.com/watch?v=IKmE3Z3zzBo"
      },
      {
        label: "Equimolar Counterdiffusion Example — Solved Problem (LearnChemE)",
        url: "https://www.youtube.com/watch?v=mex15lPG-64"
      }
    ]
  },
  {
    course: "COE 251 — C Programming",
    color: "#64748b",
    emoji: "🖥️",
    resources: [
      {
        label: "C Programming for Beginners — Complete Full Course (Portfolio Courses)",
        url: "https://www.youtube.com/watch?v=ssJY5MDLjlo"
      },
      {
        label: "C Programming Playlist (Neso Academy)",
        url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRggZZgYpPMUxdY1CYkZtARR"
      },
      {
        label: "Pointers in C/C++ — Full Course for Beginners (freeCodeCamp.org)",
        url: "https://www.youtube.com/watch?v=zuegQmMdy8M"
      }
    ]
  }
];


const Y4_KIT: KitSection[] = [
  {
    course: "BIOINSTRUMENTATION II",
    color: "#2563eb",
    emoji: "🔃",
    resources: [
      {
        label: "NPTEL — Biomedical Instrumentation Course",
        url: "https://onlinecourses.nptel.ac.in/e-learning/preview/noc26_bt78"
      },
      {
        label: "Biomedical Instrumentation — Sensors and Transducers",
        url: "https://www.youtube.com/results?search_query=NPTEL+biomedical+instrumentation+sensors+transducers"
      },
      {
        label: "ECG, EMG and EEG — Biopotential Measurements",
        url: "https://www.youtube.com/results?search_query=biomedical+instrumentation+ECG+EMG+EEG+lectures"
      },
      {
        label: "Biomedical Instrumentation — Amplifiers and Signal Conditioning",
        url: "https://www.youtube.com/results?search_query=biomedical+instrumentation+amplifiers+signal+conditioning+lectures"
      },
      {
        label: "Medical Instrumentation — Safety and Electrical Isolation",
        url: "https://www.youtube.com/results?search_query=medical+instrumentation+electrical+safety+patient+isolation+lecture"
      }
    ]
  },
  {
    course: "BIOMATERIALS",
    color: "#8b5cf6",
    emoji: "🪡",
    resources: [
      {
        label: "MIT OpenCourseWare — Biomaterials-Tissue Interactions",
        url: "https://ocw.mit.edu/courses/2-79j-biomaterials-tissue-interactions-fall-2022/pages/lecture-videos/"
      },
      {
        label: "MIT OpenCourseWare — Materials for Biomedical Applications",
        url: "https://ocw.mit.edu/courses/3-051j-materials-for-biomedical-applications-spring-2006/"
      },
      {
        label: "NPTEL — Introduction to Biomaterials (IIT Kanpur)",
        url: "https://www.youtube.com/results?search_query=NPTEL+Introduction+to+Biomaterials+IIT+Kanpur"
      },
      {
        label: "Biocompatibility and the Foreign Body Response",
        url: "https://www.youtube.com/results?search_query=biomaterials+biocompatibility+foreign+body+response+lecture"
      },
      {
        label: "Biomaterials — Metals, Ceramics and Polymers",
        url: "https://www.youtube.com/results?search_query=biomaterials+metals+ceramics+polymers+university+lecture"
      },
      {
        label: "Biodegradable Materials and Tissue Engineering",
        url: "https://www.youtube.com/results?search_query=biodegradable+biomaterials+tissue+engineering+lecture"
      }
    ]
  },
  {
    course: "BME - 461 - BIOMECHANICS",
    color: "#059669",
    emoji: "🏗️",
    resources: [
      {
        label: "UC San Diego — Musculoskeletal Biomechanics",
        url: "https://sites.google.com/ucsd.edu/the-big-beng/course-offerings/beng-110"
      },
      {
        label: "NPTEL — Biomechanics: Forces and Equilibrium",
        url: "https://www.youtube.com/results?search_query=NPTEL+biomechanics+forces+equilibrium+lectures"
      },
      {
        label: "Statics and Dynamics in Biomechanics",
        url: "https://www.youtube.com/results?search_query=biomechanics+statics+dynamics+university+lectures"
      },
      {
        label: "Joint Mechanics, Moments and Muscle Forces",
        url: "https://www.youtube.com/results?search_query=biomechanics+joint+moments+muscle+forces+lecture"
      },
      {
        label: "Gait Analysis and Human Movement",
        url: "https://www.youtube.com/results?search_query=biomechanics+gait+analysis+human+movement+lecture"
      },
      {
        label: "Stress, Strain and Mechanical Properties of Biological Tissues",
        url: "https://www.youtube.com/results?search_query=biomechanics+stress+strain+biological+tissues+lecture"
      }
    ]
  },
  {
    course: "ME 491 - ENG ECONOMICS AND MANAGEMENT",
    color: "#d97706",
    emoji: "💹",
    resources: [
      {
        label: "Cal Poly Pomona — Engineering Economics Video Tutorials",
        url: "https://www.cpp.edu/videotutorials/ime/engineering-economics.shtml"
      },
      {
        label: "Engineering Economics — Time Value of Money",
        url: "https://www.youtube.com/results?search_query=engineering+economics+time+value+of+money+lectures"
      },
      {
        label: "Cash Flow Diagrams and Equivalence",
        url: "https://www.youtube.com/results?search_query=engineering+economics+cash+flow+diagrams+equivalence+lecture"
      },
      {
        label: "Net Present Value (NPV) and Internal Rate of Return (IRR)",
        url: "https://www.youtube.com/results?search_query=engineering+economics+NPV+IRR+worked+examples"
      },
      {
        label: "Depreciation, Inflation and Cost Analysis",
        url: "https://www.youtube.com/results?search_query=engineering+economics+depreciation+inflation+cost+analysis"
      },
      {
        label: "Engineering Project Management — Planning and Scheduling",
        url: "https://www.youtube.com/results?search_query=engineering+project+management+planning+scheduling+university+lecture"
      }
    ]
  },
  {
    course: "MEDICAL IMAGING II",
    color: "#0891b2",
    emoji: "",
    resources: [
      {
        label: "Yale University — Biomedical Imaging Technologies",
        url: "https://www.youtube.com/results?search_query=Yale+Biomedical+Imaging+Technologies+MRI+fMRI+Ultrasound+Nuclear+Imaging"
      },
      {
        label: "MRI Physics — Principles and Image Formation",
        url: "https://www.youtube.com/results?search_query=MRI+physics+principles+image+formation+university+lecture"
      },
      {
        label: "Computed Tomography (CT) — Reconstruction and Principles",
        url: "https://www.youtube.com/results?search_query=CT+computed+tomography+image+reconstruction+lecture"
      },
      {
        label: "Ultrasound Imaging — Pulse Echo and Doppler",
        url: "https://www.youtube.com/results?search_query=medical+ultrasound+imaging+pulse+echo+Doppler+lecture"
      },
      {
        label: "Nuclear Medicine — PET and SPECT Imaging",
        url: "https://www.youtube.com/results?search_query=nuclear+medicine+PET+SPECT+imaging+university+lecture"
      },
      {
        label: "Digital Image Processing in Medical Imaging",
        url: "https://www.youtube.com/watch?v=lIbF0uuTEDE&list=PLPGPGYs4qj_NrR_RvEcWbruazLgqgnxBS"
      }
    ]
  },
  {
    course: "Project I",
    color: "#64748b",
    emoji: "",
    resources: [
      {
        label: "Tulane University — Biomedical Engineering Design Projects",
        url: "https://www.youtube.com/playlist?list=PLQb3tdUlXBYuSjbotzKhE89JnABDEXgin"
      },
      {
        label: "Biomedical Engineering — From Problem Identification to Prototype",
        url: "https://www.youtube.com/results?search_query=biomedical+engineering+design+process+problem+identification+prototype"
      },
      {
        label: "Research Methodology — Literature Review and Research Questions",
        url: "https://www.youtube.com/results?search_query=engineering+research+methodology+literature+review+research+questions+lecture"
      },
      {
        label: "Writing a Biomedical Engineering Project Proposal",
        url: "https://www.youtube.com/results?search_query=biomedical+engineering+project+proposal+writing+university"
      },
      {
        label: "Experimental Design, Data Analysis and Validation",
        url: "https://www.youtube.com/results?search_query=engineering+experimental+design+data+analysis+validation+lecture"
      },
      {
        label: "Biomedical Engineering Capstone Design Presentations",
        url: "https://www.youtube.com/results?search_query=biomedical+engineering+capstone+design+project+presentations"
      }
    ]
  }
];


/** Academic-calendar notices that apply to a level, as Home "Updates" items. */
const noticesFor = (lvl: YearLevel): Announcement[] =>
  CALENDAR_NOTICES.filter((n) => !n.years || n.years.includes(lvl)).map((n) => ({ id: n.id, text: n.text, type: n.type, date: n.date, until: n.until }));

/** Course list for a year = the distinct course codes in its timetable, enriched from app/lib/courses.ts. */
const coursesFrom = (tt: Session[]): Course[] =>
  Array.from(new Set(tt.map((x) => x.course))).map((code) => ({ code, ...COURSE_INFO[code] }));

// ------------------------------- ALL YEARS ---------------------------------

export const YEARS: Record<YearLevel, YearConfig> = {
  1: {
    level: 1,
    levelCode: "100",
    title: "Year 1",
    tagline: "Foundations: calculus, electronics, biochemistry and the physics behind it all.",
    semester: SEMESTER,
    courses: coursesFrom(TIMETABLES[1]),
    timetable: TIMETABLES[1],
    kit: Y1_KIT,
    files: [],
    slidesFolderUrl: "https://drive.google.com/drive/folders/1_Jtbe64tbaZzTZS9QJwWlR8mw6D7ZESw?usp=sharing",
    announcements: noticesFor(1),
  },
  2: {
    level: 2,
    levelCode: "200",
    title: "Year 2",
    tagline: "Core biomedical engineering begins, Differential eqns, signals, anatomy and physiology.",
    semester: SEMESTER,
    courses: coursesFrom(TIMETABLES[2]),
    timetable: TIMETABLES[2],
    kit: Y2_KIT,
    files: [],
    slidesFolderUrl: "https://drive.google.com/drive/folders/1j1ElhgMt5NxBk-X6mRxhShsBNgMhXnJt?usp=drive_link",
    announcements: noticesFor(2),
  },
  3: {
    level: 3,
    levelCode: "300",
    title: "Year 3",
    tagline: "imaging and biomaterials: where theory meets devices.",
    semester: SEMESTER,
    courses: coursesFrom(TIMETABLES[3]),
    timetable: TIMETABLES[3],
    kit: [],
    files: [],
    announcements: noticesFor(3),
  },
  4: {
    level: 4,
    levelCode: "400",
    title: "Year 4",
    tagline: "Final year: design projects, Instrumentation and your thesis.",
    semester: SEMESTER,
    courses: coursesFrom(TIMETABLES[4]),
    timetable: TIMETABLES[4],
    kit: Y4_KIT,
    files: [],
    slidesFolderUrl: "https://drive.google.com/drive/folders/1-xaMaJQ2jAggndvxgjwrrl56NMdmVKbF?usp=sharing",
    announcements: noticesFor(4),
  },
};

export const YEAR_LEVELS: YearLevel[] = [1, 2, 3, 4];

export const parseLevel = (v: string | number | undefined | null): YearLevel | null => {
  const n = Number(v);
  return n === 1 || n === 2 || n === 3 || n === 4 ? (n as YearLevel) : null;
};

export const hasTimetable = (y: YearConfig) => y.timetable.length > 0;
