// app/lib/constants.ts

export const THEMES: { [key: string]: any } = {
  ocean: {
    id: "ocean",
    name: "Ocean",
    bgGradient: "from-blue-900/50 to-cyan-900/50",
    orb1: "#3b82f6",
    orb2: "#06b6d4",
    accent: "blue",
  },
  forest: {
    id: "forest",
    name: "Forest",
    bgGradient: "from-green-900/50 to-emerald-900/50",
    orb1: "#22c55e",
    orb2: "#10b981",
    accent: "green",
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    bgGradient: "from-orange-900/50 to-pink-900/50",
    orb1: "#f97316",
    orb2: "#ec4899",
    accent: "orange",
  },
  galaxy: {
    id: "galaxy",
    name: "Galaxy",
    bgGradient: "from-purple-900/50 to-indigo-900/50",
    orb1: "#a855f7",
    orb2: "#6366f1",
    accent: "purple",
  },
  rose: {
    id: "rose",
    name: "Rose",
    bgGradient: "from-rose-900/50 to-pink-900/50",
    orb1: "#f43f5e",
    orb2: "#ec4899",
    accent: "rose",
  },
};

export const CLASS_LIST: { [key: string]: string } = {
  "22028883": "Asante Okyere",
  "22000001": "Ama Owusu",
  "22000002": "Kwame Mensah",
  "22000003": "Abena Asante",
  "22000004": "Kofi Boateng",
  "22000005": "Akosua Darko",
  "22000006": "Yaw Amponsah",
  "22000007": "Efua Quaye",
  "22000008": "Kwesi Ofori",
  "22000009": "Adwoa Sarpong",
  "22000010": "Nana Adu",
};

export const TIMETABLE: { [key: string]: { time: string; course: string; venue: string }[] } = {
  Monday: [
    { time: "08:00 - 10:00", course: "BME 251 - Biomechanics", venue: "Eng. Block A" },
    { time: "12:00 - 14:00", course: "BME 253 - Bioinstrumentation", venue: "Lab 2" },
  ],
  Tuesday: [
    { time: "10:00 - 12:00", course: "BME 255 - Physiology for Engineers", venue: "Lecture Hall 3" },
    { time: "14:00 - 16:00", course: "MATH 253 - Numerical Methods", venue: "Eng. Block B" },
  ],
  Wednesday: [
    { time: "08:00 - 10:00", course: "BME 251 - Biomechanics", venue: "Eng. Block A" },
    { time: "14:00 - 16:00", course: "BME 257 - Medical Imaging", venue: "Lab 3" },
  ],
  Thursday: [
    { time: "10:00 - 12:00", course: "BME 253 - Bioinstrumentation", venue: "Lab 2" },
    { time: "14:00 - 16:00", course: "BME 255 - Physiology for Engineers", venue: "Lecture Hall 3" },
  ],
  Friday: [
    { time: "08:00 - 10:00", course: "MATH 253 - Numerical Methods", venue: "Eng. Block B" },
    { time: "10:00 - 12:00", course: "BME 257 - Medical Imaging", venue: "Lab 3" },
  ],
};

export const COURSE_CREDITS: { [key: string]: number } = {
  "BME 251": 3,
  "BME 253": 3,
  "BME 255": 3,
  "BME 257": 3,
  "MATH 253": 3,
};

export const ADMIN_IDS: string[] = ["22028883"];

export const ACHIEVEMENTS = [
  { id: "first_login", title: "First Steps", description: "Logged in for the first time", icon: "🎉" },
  { id: "streak_7", title: "Week Warrior", description: "7-day login streak", icon: "🔥" },
  { id: "streak_30", title: "Monthly Master", description: "30-day login streak", icon: "⚡" },
  { id: "cwa_calc", title: "Grade Tracker", description: "Used the CWA calculator", icon: "📊" },
  { id: "notes_saved", title: "Note Taker", description: "Saved your first note", icon: "📝" },
  { id: "attendance_marked", title: "Present!", description: "Marked attendance for the first time", icon: "✅" },
];

export const RESOURCES = [
  { title: "BME 251 - Biomechanics Notes", url: "#", type: "pdf", course: "BME 251" },
  { title: "BME 253 - Lab Manual", url: "#", type: "pdf", course: "BME 253" },
  { title: "BME 255 - Physiology Slides", url: "#", type: "slides", course: "BME 255" },
  { title: "MATH 253 - Past Questions", url: "#", type: "pdf", course: "MATH 253" },
  { title: "BME 257 - Imaging Handbook", url: "#", type: "pdf", course: "BME 257" },
];
