"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { 
  Calculator, MessageCircle, BookOpen, Calendar, LogOut, Activity,
  Download, Upload, Bell, CheckCircle, FileText, Send,
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
    { id: 'm2', time: '10:30 - 12:25', course: 'CHEM 151', venue: 'PB212', lecturer: 'L. Sarpong', type: 'Lecture', totalClasses: 4 },
    { id: 'm3', time: '17:00 - 17:55', course: 'ENGL 157', venue: 'ENG AUDIT', lecturer: 'P.O Yeboah', type: 'Lecture', totalClasses: 4 },
  ],
  Tuesday: [
    { id: 't1', time: '08:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo/G.S. Klogo', type: 'Lab', totalClasses: 4 },
    { id: 'm1', time: '17:00 - 19:00', course: 'COE 181', venue: 'VSLA', lecturer: 'K.O.K. Sarkodie', type: 'Lecture', totalClasses: 4 },
  ],
  Wednesday: [
    { id: 'w1', time: '08:00 - 09:55', course: 'MATH 151 A', venue: 'VSLA', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture', totalClasses: 3 },
    { id: 'w2', time: '13:00 - 13:55', course: 'COE 181', venue: '303', lecturer: 'K.O.K Sarkodie', type: 'Lecture', totalClasses: 3 },
  ],
  Thursday: [
    { id: 'th1', time: '08:00 - 09:55', course: 'ME 161', venue: 'A110', lecturer: 'K.O Amoabeng', type: 'Lecture', totalClasses: 3 },
    { id: 'th2', time: '13:00 - 14:55', course: 'MATH 151 B', venue: 'PB020', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture', totalClasses: 3 },
    { id: 'th3', time: '15:00 - 16:55', course: 'BME 161', venue: 'PB008', lecturer: 'P. Adjei', type: 'Lecture', totalClasses: 3 },
  ],
  Friday: [
    { id: 'f1', time: '10:30 - 12:25', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo', type: 'Lab', totalClasses: 3 },
    { id: 'f2', time: '13:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'G.S. Klogo', type: 'Lab', totalClasses: 3 },
  ],
};

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
      { label: 'Basic Mechanics R.C hibbler solved', url: 'https://www.youtube.com/watch?v=09o0125cde8&list=PLWWf-r6pJvvXjhc2-uOzvFTqigm8o14g8'},
      { label: 'Basic Mechanics Playlist', url: 'https://www.youtube.com/watch?v=FnudcA72olU&list=PLInywrvFyvq6FUfAigJ3157kg-nZ020fd&t=35s' },
      { label: 'RC hibbler Force Vectors', url: 'https://www.youtube.com/watch?v=bGj55QoS65w&list=PLBWqF09uZJ9UlHekluVGdO_B2sKNkAe62'},
      { label: 'Equillibrium of a Rigid body', url: 'https://www.youtube.com/watch?v=YBvHNTTzic8&list=PLBWqF09uZJ9UXCyaK_noCtd3oQa9FgWaY'},
      { label: 'Equillibrium of a Particle', url: 'https://www.youtube.com/watch?v=xxhhgfhJtyA&list=PLBWqF09uZJ9Uc-848ySvjH_6o-6uk-nzk'},
      { label: 'Structural Analysis', url: 'https://www.youtube.com/watch?v=KfoqQcCua_8&list=PLBWqF09uZJ9V_K5uvVB78Y68GlSuwRkIm'},
      { label: 'Moments and Internal Forces', url: 'https://www.youtube.com/watch?v=wOp8dkj-_e8&list=PLBWqF09uZJ9XAlU5uZjqgaxU0AcjleUNy'},
      { label: 'Friction', url: 'https://www.youtube.com/watch?v=GGiXSPyXT3Y&list=PLBWqF09uZJ9UTd0bywwHNpqkrnl9NOTTo'},
    ]
  },
  {
    course: 'EE 151 — Applied Electricity',
    color: 'yellow',
    emoji: '⚡',
    resources: [
      { label: 'Applied Electricity Playlist 1- Skancity Academy', url: 'https://www.youtube.com/playlist?list=PLInywrvFyvq7pFsDEDu2-n0f5UOhpqWBD' },
      { label: 'Applied Electricity Playlist 2- Learn the basics', url: 'https://www.youtube.com/watch?v=rE_0ejMU6yM&list=PLXePpKFSUW2abKgvj_hClQS1NK86SCHfy' },
      { label: 'Applied Electricity Playlist 3- Maths Hub Gh', url: 'https://www.youtube.com/watch?v=f1o5dXu8zKM&list=PLldc0i2lkatV0FTguKTiFDE3Fz3xhVwZ7'},
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
      { label: 'Apoptosis vs Necrosis', url:  'https://www.youtube.com/watch?v=jRZHDhHf3tA&pp=ygUJYXBvcHRvc2lz'},
      { label: 'Endosomes', url: 'https://www.youtube.com/watch?v=6MZN24Il5Sc&pp=ygUJZW5kb3NvbWVz'},
      { label: 'Lysosomes- Structure and function (Ninja Nerd)', url: 'https://www.youtube.com/watch?v=QtGMAgxv72Y&pp=ygUJZW5kb3NvbWVz'}
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

const BME_PUNS = [
  "Ei, the trotro of knowledge has left. Were you on board?",
  "KNUST: Knowledge Never Stops Unless Tired. Very tired.",
  "PB212 lecture at 8am? My body is here but my soul is at the hostel.",
  "The way Ghanaians say 'I'll be there in 5 minutes'... that's my attendance rate.",
  "CHEM 151 assignment due tomorrow. I just found out. It's 11pm. God is faithful.",
  "Me to the lecturer: 'Please sir, can you slow down?' Him: *writes faster*.",
  "My data finished during the online lecture. God's plan.",
  "Asante is the GOAT. No debate.",
  "CWA - hmm",
  "Dr. Sarkodie once said: \"You since you came to my class you've never solved a question before, let this be your first.\"",
  "Dr. Sarkodie once said: \"Just dey play.\"",
  "If stress was creditworthy, I'd have a First Class by now.",
  "Passed Applied Electricity. My ancestors had to intervene personally.",
];

const END_OF_SEM_DATE = new Date('2026-04-07T00:00:00');

const getFinalsMessage = (days: number) => {
  if (days > 60) return { msg: "End of semester exams are far. But far doesn't mean forever.", color: "text-emerald-400" };
  if (days > 45) return { msg: "Plenty of time. Use it well.", color: "text-green-400" };
  if (days > 30) return { msg: "30+ days. A good time to start being consistent.", color: "text-cyan-400" };
  if (days > 21) return { msg: "3 weeks out. Your notes won't read themselves.", color: "text-blue-400" };
  if (days > 14) return { msg: "14 days. Past questions and consistency from here.", color: "text-yellow-400" };
  if (days > 7)  return { msg: "One week. Everything you do now compounds.", color: "text-orange-400" };
  if (days > 3)  return { msg: "3 days. Past questions only. Rest well.", color: "text-red-400" };
  if (days > 1)  return { msg: "2 days. You either prepared or you didn't. Either way — rest.", color: "text-red-500" };
  if (days === 1) return { msg: "Tomorrow. Breathe. You've put in the work.", color: "text-red-600" };
  if (days === 0) return { msg: "Today is the day. You are ready.", color: "text-purple-400" };
  return { msg: "Exams done. Go rest. You earned it.", color: "text-emerald-400" };
};

const ONBOARDING_SLIDES = [
  {
    emoji: "🎓",
    title: "Welcome to BME Portal",
    body: "Your hub for KNUST BME1 — timetable, attendance, CWA calculator, and more.",
  },
  {
    emoji: "📅",
    title: "Track Your Attendance",
    body: "Mark yourself present after every class. The bar shows your percentage. Stay above 70% to remain exam eligible.",
  },
  {
    emoji: "🔔",
    title: "Enable Notifications",
    body: "Allow notifications and you'll get a reminder 30 minutes before every lecture.",
  },
  {
    emoji: "📚",
    title: "BME Survival Kit",
    body: "Curated YouTube playlists for every course. Linear Algebra, Cell Biology, Applied Electricity — all there when you need them.",
  },
   {
    emoji: "📞",
    title: "Need help? or have any feedback?",
    body: "Just text/call Kwaku on +233556965453",
  },
  {
    emoji: "🚀",
    title: "You're Set",
    body: "KNUST BME1, Class of 2029. Let's get to work.",
  },
];

const timeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// ============================================================
// INTERACTIVE NEURAL NETWORK BACKGROUND
// ============================================================
const BioBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const onResize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener('resize', onResize);
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onTouch = (e: TouchEvent) => { if (e.touches[0]) mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });

    const COUNT = Math.min(80, Math.floor((W * H) / 14000));
    type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };
    const nodes: Node[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1, pulse: Math.random() * Math.PI * 2,
    }));

    const CONNECT_DIST = 130, CURSOR_ATTRACT = 160;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#0a0f1c'); grad.addColorStop(0.5, '#0b1120'); grad.addColorStop(1, '#050914');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      nodes.forEach(n => {
        n.pulse += 0.02;
        const dx = mx - n.x, dy = my - n.y, dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CURSOR_ATTRACT && dist > 0) { const f = (CURSOR_ATTRACT - dist) / CURSOR_ATTRACT * 0.015; n.vx += dx/dist*f; n.vy += dy/dist*f; }
        n.vx *= 0.98; n.vy *= 0.98;
        const speed = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
        if (speed > 1.5) { n.vx = n.vx/speed*1.5; n.vy = n.vy/speed*1.5; }
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) { n.x = 0; n.vx *= -1; } if (n.x > W) { n.x = W; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; } if (n.y > H) { n.y = H; n.vy *= -1; }
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx*dx+dy*dy);
          if (d < CONNECT_DIST) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(0,212,255,${(1-d/CONNECT_DIST)*0.25})`; ctx.lineWidth = 0.8; ctx.stroke(); }
        }
        const cdx = nodes[i].x - mx, cdy = nodes[i].y - my, cd = Math.sqrt(cdx*cdx+cdy*cdy);
        if (cd < CURSOR_ATTRACT) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(mx, my); ctx.strokeStyle = `rgba(168,85,247,${(1-cd/CURSOR_ATTRACT)*0.5})`; ctx.lineWidth = 1; ctx.stroke(); }
      }

      nodes.forEach(n => {
        const cdx = n.x-mx, cdy = n.y-my, cd = Math.sqrt(cdx*cdx+cdy*cdy), near = cd < CURSOR_ATTRACT;
        const glow = near ? 0.9 : 0.4 + Math.sin(n.pulse)*0.15, radius = near ? n.r*1.8 : n.r;
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius*4);
        halo.addColorStop(0, near ? `rgba(168,85,247,${glow*0.4})` : `rgba(0,212,255,${glow*0.2})`); halo.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(n.x, n.y, radius*4, 0, Math.PI*2); ctx.fillStyle = halo; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, radius, 0, Math.PI*2); ctx.fillStyle = near ? `rgba(168,85,247,${glow})` : `rgba(0,212,255,${glow})`; ctx.fill();
      });

      if (mx > 0 && mx < W) {
        ctx.beginPath(); ctx.arc(mx, my, 18, 0, Math.PI*2); ctx.strokeStyle = 'rgba(168,85,247,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(mx, my, 5, 0, Math.PI*2); ctx.fillStyle = 'rgba(168,85,247,0.6)'; ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); window.removeEventListener('mousemove', onMove); window.removeEventListener('touchmove', onTouch); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full" style={{ touchAction: 'none' }} />;
};

const GlassCard = ({ children, className = "", delay = 0 }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
    className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-[28px] shadow-2xl ${className}`}>
    {children}
  </motion.div>
);

// ============================================================
// LOFI MODE — true fullscreen (Fullscreen API)
// ============================================================
// ── Lofi motivational quotes ──────────────────────────────────
const LOFI_QUOTES = [
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "" },
  { text: "Great things never come from comfort zones.", author: "" },
  { text: "Dream it. Wish it. Do it.", author: "" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "" },
  { text: "Little by little, a little becomes a lot.", author: "Tanzanian proverb" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "" },
];

// ── Aurora ripple canvas (separate from neural-net background) ─
const AuroraRipple = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const onResize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener('resize', onResize);

    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onTouch = (e: TouchEvent) => { if (e.touches[0]) mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });

    // Aurora orbs — slow drifting blobs of colour
    type Orb = { x: number; y: number; vx: number; vy: number; r: number; hue: number; phase: number };
    const orbs: Orb[] = [
      { x: W*0.2, y: H*0.3, vx: 0.18, vy: 0.12, r: 420, hue: 270, phase: 0 },
      { x: W*0.7, y: H*0.6, vx: -0.14, vy: 0.16, r: 380, hue: 160, phase: 1.5 },
      { x: W*0.5, y: H*0.15, vx: 0.1, vy: -0.13, r: 350, hue: 210, phase: 3 },
      { x: W*0.85, y: H*0.2, vx: -0.2, vy: 0.1, r: 300, hue: 300, phase: 4.5 },
    ];

    // Ripple rings spawned by cursor
    type Ripple = { x: number; y: number; r: number; maxR: number; alpha: number; hue: number };
    const ripples: Ripple[] = [];
    let lastRipple = 0;

    const spawnRipple = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastRipple < 120) return;
      lastRipple = now;
      ripples.push({ x, y, r: 0, maxR: 120 + Math.random()*80, alpha: 0.6, hue: 250 + Math.random()*80 });
    };

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      // Draw aurora orbs
      orbs.forEach(o => {
        o.phase += 0.005;
        // Cursor attraction
        const dx = mouseRef.current.x - o.x, dy = mouseRef.current.y - o.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 500 && dist > 0) { o.vx += dx/dist * 0.008; o.vy += dy/dist * 0.008; }
        o.vx *= 0.97; o.vy *= 0.97;
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;

        const alpha = 0.07 + Math.sin(o.phase) * 0.03;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, `hsla(${o.hue + Math.sin(t)*20}, 80%, 65%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(${o.hue + 30}, 70%, 50%, ${alpha * 0.5})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.ellipse(o.x, o.y, o.r, o.r * (0.7 + Math.sin(o.phase*0.7)*0.2), t*0.1, 0, Math.PI*2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Spawn ripple at cursor
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      if (mx > 0 && mx < W) spawnRipple(mx + (Math.random()-0.5)*30, my + (Math.random()-0.5)*30);

      // Draw & age ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 2.5;
        rp.alpha *= 0.94;
        if (rp.alpha < 0.01 || rp.r > rp.maxR) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI*2);
        ctx.strokeStyle = `hsla(${rp.hue}, 80%, 70%, ${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Glow dot at cursor
      if (mx > 0 && mx < W) {
        const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
        cg.addColorStop(0, 'rgba(200,150,255,0.25)');
        cg.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(mx, my, 60, 0, Math.PI*2);
        ctx.fillStyle = cg; ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'screen' }} />;
};

const LofiOverlay = ({ timerSeconds, timerMode, timerSessions, timerCourse, timerActive, fmtTime, onToggle, onExit, showExitWarn, onConfirmExit, daysToEnd, audioRef }: any) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [quoteIdx, setQuoteIdx] = useState(() => 0);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();

    const onKey = (e: KeyboardEvent) => { if (e.key === 'f' || e.key === 'F' || e.key === 'Escape') onExit(); };
    document.addEventListener('keydown', onKey);

    // Rotate quote every 30s
    const qt = setInterval(() => setQuoteIdx(i => (i + 1) % LOFI_QUOTES.length), 30000);

    return () => {
      document.removeEventListener('keydown', onKey);
      clearInterval(qt);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  const quote = LOFI_QUOTES[quoteIdx];

  return (
    <motion.div ref={overlayRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#04000f' }}>

      {/* Aurora ripple layer */}
      <AuroraRipple />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-6">

        {/* Course label */}
        <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.35em] mb-8">
          Studying — {timerCourse}
        </p>

        {/* Timer */}
        <motion.div key={timerMode} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6">
          <p className={`font-black leading-none tabular-nums ${timerMode === 'focus' ? 'text-white' : 'text-emerald-300'}`}
            style={{ fontSize: 'clamp(72px, 18vw, 140px)', textShadow: timerMode === 'focus' ? '0 0 60px rgba(168,85,247,0.4)' : '0 0 60px rgba(52,211,153,0.4)' }}>
            {fmtTime(timerSeconds)}
          </p>
          <p className={`text-xs font-bold uppercase tracking-[0.35em] mt-3 ${timerMode === 'focus' ? 'text-purple-400' : 'text-emerald-400'}`}>
            {timerMode === 'focus' ? 'Focus' : 'Break'}
          </p>
        </motion.div>

        {/* Motivational quote */}
        <AnimatePresence mode="wait">
          <motion.div key={quoteIdx}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 1 }}
            className="text-center mb-8 max-w-xl px-4">
            <p className="text-white/80 leading-snug"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: 'clamp(15px, 2.5vw, 22px)', fontStyle: 'italic', textShadow: '0 2px 30px rgba(168,85,247,0.3)' }}>
              "{quote.text}"
            </p>
            {quote.author && (
              <p className="text-white/30 text-xs uppercase tracking-[0.25em] mt-3 font-bold">
                — {quote.author}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Session dots */}
        <div className="flex items-center gap-2 mb-8">
          {timerSessions === 0
            ? <p className="text-white/15 text-[10px] uppercase tracking-widest">No sessions yet</p>
            : Array.from({ length: Math.min(timerSessions, 10) }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-purple-400/70" />
            ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <button onClick={onToggle}
            className={`px-10 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all backdrop-blur-sm ${timerActive ? 'bg-white/8 text-white border border-white/15 hover:bg-white/15' : 'bg-purple-600/80 text-white hover:bg-purple-500'}`}>
            {timerActive ? 'Pause' : 'Resume'}
          </button>
          <button onClick={onExit}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider bg-white/5 text-white/20 border border-white/8 hover:bg-white/10 transition-all backdrop-blur-sm">
            Exit
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 opacity-25 hover:opacity-60 transition-opacity">
          <span className="text-white text-[9px] uppercase tracking-widest">Vol</span>
          <input type="range" min="0" max="1" step="0.05" defaultValue="0.5"
            onChange={(e) => { if (audioRef?.current) audioRef.current.volume = parseFloat(e.target.value); }}
            className="w-24 accent-purple-400 cursor-pointer" />
        </div>

        <p className="text-white/10 text-[9px] mt-5 uppercase tracking-widest">Press F · Esc · or Exit to leave</p>
      </div>

      <AnimatePresence>
        {showExitWarn && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm w-[90vw] text-center">
            <p className="text-white font-bold text-sm mb-1">Leave the session?</p>
            <p className="text-white/40 text-xs mb-5">
              End of semester in <span className="font-bold text-white">{daysToEnd} days</span>. Every session matters.
            </p>
            <div className="flex gap-3">
              <button onClick={onConfirmExit} className="flex-1 py-2.5 bg-white/10 rounded-xl text-xs font-bold text-white/60 hover:bg-white/20 transition-all">Exit anyway</button>
              <button onClick={() => {}} className="flex-1 py-2.5 bg-purple-600 rounded-xl text-xs font-bold text-white hover:bg-purple-500 transition-all">Keep going</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DontPanic = ({ onClose }: { onClose: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
    className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center cursor-pointer">
    <motion.p animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }}
      className="text-[80px] md:text-[140px] font-black text-white tracking-tight text-center leading-none">
      DON'T<br />PANIC
    </motion.p>
    <p className="text-white/40 text-sm mt-8 uppercase tracking-widest">The BME Student's Guide to the Galaxy</p>
    <p className="text-white/20 text-xs mt-4">tap anywhere to dismiss</p>
  </motion.div>
);

const OnboardingModal = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const isLast = step === ONBOARDING_SLIDES.length - 1;
  const slide = ONBOARDING_SLIDES[step];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[90] flex items-center justify-center p-6">
      <GlassCard className="w-full max-w-md p-8 text-center relative">
        <div className="flex justify-center gap-2 mb-8">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#00d4ff]' : 'w-2 bg-white/20'}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <p className="text-5xl mb-6">{slide.emoji}</p>
            <h2 className="text-xl font-black text-white mb-3">{slide.title}</h2>
            <p className="text-white/50 text-sm leading-relaxed">{slide.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-3 mt-10">
          {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 bg-white/5 border border-white/10 text-white/50 rounded-2xl text-xs font-bold uppercase tracking-wider">Back</button>}
          <button onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
            className="flex-1 py-3 bg-[#00d4ff] text-[#0a0f1c] rounded-2xl text-xs font-black uppercase tracking-wider hover:scale-[1.02] transition-transform">
            {isLast ? "Let's go" : "Next"}
          </button>
        </div>
        <button onClick={onComplete} className="mt-4 text-[10px] opacity-20 hover:opacity-40 uppercase font-bold tracking-wider">Skip</button>
      </GlassCard>
    </motion.div>
  );
};

const SurvivalKitModal = ({ onClose }: { onClose: () => void }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const colorMap: any = {
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    orange: 'border-orange-500/30 bg-orange-500/5 text-orange-400',
    yellow: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
    green: 'border-green-500/30 bg-green-500/5 text-green-400',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={18} /></button>
        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
          <BookOpen size={18} className="text-[#00d4ff]" /> BME Survival Kit
        </h2>
        <p className="text-white/30 text-xs mb-8 tracking-wide">Curated playlists for every course. Open any to get started.</p>
        <div className="space-y-2">
          {SURVIVAL_KIT.map((kit) => (
            <div key={kit.course} className={`rounded-2xl border ${colorMap[kit.color]} overflow-hidden`}>
              <button onClick={() => setExpanded(expanded === kit.course ? null : kit.course)}
                className="w-full p-4 flex items-center justify-between text-left">
                <span className="font-bold text-sm flex items-center gap-2">{kit.emoji} {kit.course}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] opacity-40 uppercase tracking-wider">{kit.resources.length} resources</span>
                  <ChevronRight size={13} className={`transition-transform opacity-40 ${expanded === kit.course ? 'rotate-90' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {expanded === kit.course && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-1.5">
                      {kit.resources.map((r, i) => (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-black/40 transition-all group">
                          <span className="text-xs text-white/60 flex items-center gap-2">
                            <Play size={9} className="text-red-400 shrink-0" /> {r.label}
                          </span>
                          <ExternalLink size={9} className="opacity-20 group-hover:opacity-50 transition-opacity shrink-0" />
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
  const [daysToEnd, setDaysToEnd] = useState(0);
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

  // Pomodoro
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(35 * 60);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [timerSessions, setTimerSessions] = useState(0);
  const [timerCourse, setTimerCourse] = useState('MATH 151');
  const [lofiMode, setLofiMode] = useState(false);
  const [showLofiExit, setShowLofiExit] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lofiAudioRef = useRef<HTMLAudioElement | null>(null);

  // Next class
  const [nextClassInfo, setNextClassInfo] = useState<{ course: string; venue: string; startTime: string; minsUntil: number } | null>(null);
  const nextClassRef = useRef<NodeJS.Timeout | null>(null);

  const requestNotifications = async () => {
    if (!('Notification' in window)) return false;
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotificationsEnabled(true);
      localStorage.setItem('bme-notif-enabled', 'true');
      new Notification('BME Portal', { body: 'Notifications enabled. You will be reminded 30 minutes before each class.' });
      return true;
    }
    return false;
  };

  const scheduleClassNotifications = () => {
    if (notifScheduled.current || typeof window === 'undefined') return;
    notifScheduled.current = true;
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const todayClasses = TIMETABLE[days[new Date().getDay()]] || [];
    const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
    todayClasses.forEach((cls: any) => {
      const startMins = timeToMinutes(cls.time.split(' - ')[0]);
      const msUntil = (startMins - 30 - nowMins) * 60 * 1000;
      if (msUntil > 0) setTimeout(() => {
        if (Notification.permission === 'granted')
          new Notification(`${cls.course} in 30 minutes`, { body: `${cls.venue} — ${cls.time.split(' - ')[0]}` });
      }, msUntil);
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
      const savedAnn = localStorage.getItem('bme-announcements');
      if (savedAnn) setAnnouncements(JSON.parse(savedAnn));
      const savedFiles = localStorage.getItem('bme-files');
      if (savedFiles) setFiles(JSON.parse(savedFiles));
      const savedVents = localStorage.getItem('bme-vents');
      if (savedVents) setVents(JSON.parse(savedVents));
      if (!localStorage.getItem('bme-onboarded') && savedID && CLASS_LIST[savedID]) setShowOnboarding(true);
      if (localStorage.getItem('bme-notif-enabled') === 'true') { setNotificationsEnabled(true); scheduleClassNotifications(); }
    }
    setDaysToEnd(Math.ceil((END_OF_SEM_DATE.getTime() - new Date().getTime()) / (1000*60*60*24)));
    const punTimer = setInterval(() => setCurrentPun(p => (p + 1) % BME_PUNS.length), 15000);
    return () => clearInterval(punTimer);
  }, []);

  // Timer tick
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            setTimerMode(prev => {
              if (prev === 'focus') {
                setTimerSessions(n => n + 1);
                if (Notification.permission === 'granted') new Notification('Focus session complete', { body: 'Take a 5 minute break.' });
                setTimerSeconds(5 * 60); return 'break';
              } else {
                if (Notification.permission === 'granted') new Notification('Break over', { body: `Back to ${timerCourse}.` });
                setTimerSeconds(35 * 60); return 'focus';
              }
            });
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timerCourse]);

  // Next class bar
  useEffect(() => {
    const compute = () => {
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const todayClasses = TIMETABLE[days[new Date().getDay()]] || [];
      const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
      let found = null;
      for (const cls of todayClasses) {
        const minsUntil = timeToMinutes(cls.time.split(' - ')[0]) - nowMins;
        if (minsUntil > 0) { found = { course: cls.course, venue: cls.venue, startTime: cls.time.split(' - ')[0], minsUntil }; break; }
      }
      setNextClassInfo(found);
    };
    compute();
    nextClassRef.current = setInterval(compute, 60000);
    return () => { if (nextClassRef.current) clearInterval(nextClassRef.current); };
  }, []);

  // Lofi exit guard
  useEffect(() => {
    if (!lofiMode) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [lofiMode]);

  const completeOnboarding = async () => {
    localStorage.setItem('bme-onboarded', 'true');
    setShowOnboarding(false);
    await requestNotifications();
    scheduleClassNotifications();
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loginMode === 'admin') {
      if (adminAccessCode === 'ASANT3&GOD') proceedToLogin('22028883', true);
      else setLoginError('Invalid access code.');
      return;
    }
    if (!CLASS_LIST[studentID]) { setLoginError('Student ID not found.'); return; }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`pw-${studentID}`);
      if (!stored) {
        if (!isFirstLogin) setIsFirstLogin(true);
        else if (password.length < 4) setLoginError('Password must be at least 4 characters.');
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
      if (!localStorage.getItem('bme-onboarded')) setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bme-session-id'); localStorage.removeItem('bme-admin-access');
    setIsLoggedIn(false); setIsAdmin(false); setStudentID(''); setPassword(''); setAdminAccessCode(''); setLoginMode('student');
  };

  const markAttendance = (id: string) => {
    if (attendanceMarked[id]) return;
    const newAtt = { ...attendance, [id]: (attendance[id] || 0) + 1 };
    const newMarked = { ...attendanceMarked, [id]: true };
    setAttendance(newAtt); setAttendanceMarked(newMarked);
    localStorage.setItem('bme-attendance', JSON.stringify(newAtt));
    localStorage.setItem(`bme-marked-${studentID}`, JSON.stringify(newMarked));
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
    setVents(updated); localStorage.setItem('bme-vents', JSON.stringify(updated));
    setVentText(''); setVentSubmitted(true); setTimeout(() => setVentSubmitted(false), 3000);
  };

  const handleExportProfile = () => {
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
        if (d.studentID !== studentID) { alert('This profile belongs to a different student.'); return; }
        setAttendance(d.attendance || {}); setAttendanceMarked(d.attendanceMarked || {}); setNotes(d.notes || '');
        localStorage.setItem('bme-attendance', JSON.stringify(d.attendance || {}));
        localStorage.setItem(`bme-marked-${studentID}`, JSON.stringify(d.attendanceMarked || {}));
        localStorage.setItem('bme-notes', d.notes || '');
        alert('Profile imported successfully.');
      } catch { alert('Invalid file.'); }
    };
    reader.readAsText(file); event.target.value = '';
  };

  const getAttendancePct = (classId: string, total: number) => total > 0 ? Math.round(((attendance[classId] || 0) / total) * 100) : 0;
  const fmtTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const handleExitLofi = () => { setShowLofiExit(true); setTimeout(() => setShowLofiExit(false), 6000); };
  const confirmExitLofi = () => {
    setLofiMode(false); setShowLofiExit(false); setTimerActive(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    if (lofiAudioRef.current) { lofiAudioRef.current.pause(); lofiAudioRef.current.currentTime = 0; }
  };
  const getFirstName = (name: string) => name.split(' ')[0];
  const daysList = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const todayName = daysList[new Date().getDay() - 1] || 'Weekend';
  const finalsInfo = getFinalsMessage(daysToEnd);

  if (!mounted) return null;

  // ============================================================
  // LOGIN
  // ============================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <BioBackground />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
          <GlassCard className="p-8 border-white/15">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#00d4ff] font-black text-sm tracking-widest">BME</div>
              <h1 className="text-xl font-black tracking-tight text-white">PORTAL ACCESS</h1>
              <p className="text-white/25 text-xs mt-1 tracking-widest uppercase">KNUST BME1 · Class of 2026</p>
            </div>
            <div className="flex gap-1.5 mb-6 p-1 bg-white/5 rounded-xl">
              <button onClick={() => { setLoginMode('student'); setLoginError(''); }} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${loginMode === 'student' ? 'bg-[#00d4ff] text-[#0a0f1c]' : 'text-slate-500'}`}>Student</button>
              <button onClick={() => { setLoginMode('admin'); setLoginError(''); setStudentID(''); setPassword(''); setIsFirstLogin(false); }} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${loginMode === 'admin' ? 'bg-red-500 text-white' : 'text-slate-500'}`}>Admin</button>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              {loginMode === 'student' ? (
                <>
                  <input type="text" placeholder="Student ID" value={studentID} disabled={isFirstLogin} onChange={(e) => setStudentID(e.target.value)} className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-center text-white text-sm outline-none focus:border-[#00d4ff]/50 transition-colors" />
                  {(isFirstLogin || (typeof window !== 'undefined' && localStorage.getItem(`pw-${studentID}`))) && (
                    <input type="password" placeholder={isFirstLogin ? "Create a password" : "Password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-center text-white text-sm outline-none focus:border-[#00d4ff]/50 transition-colors" autoFocus />
                  )}
                  <button className="w-full py-3.5 bg-[#00d4ff] text-[#0a0f1c] rounded-xl font-black text-xs uppercase tracking-wider hover:scale-[1.01] transition-transform">{isFirstLogin ? 'Save & Enter' : 'Continue'}</button>
                  {isFirstLogin && <button type="button" onClick={() => setIsFirstLogin(false)} className="w-full text-[10px] font-bold opacity-30 uppercase tracking-wider">Back</button>}
                </>
              ) : (
                <>
                  <div className="text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Restricted Access</p>
                  </div>
                  <input type="password" placeholder="Access Code" value={adminAccessCode} onChange={(e) => setAdminAccessCode(e.target.value)} className="w-full p-3.5 rounded-xl bg-white/5 border border-red-500/20 text-center text-white text-sm outline-none focus:border-red-500/50 transition-colors" autoFocus />
                  <button className="w-full py-3.5 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-wider">Unlock</button>
                </>
              )}
              {loginError && <p className="text-red-400 text-[10px] text-center font-bold uppercase tracking-wider">{loginError}</p>}
            </form>
            <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/5">
              <AnimatePresence mode="wait">
                <motion.p key={currentPun} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.4 }}
                  className="text-white/25 text-[10px] text-center italic">{BME_PUNS[currentPun]}</motion.p>
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
        {lofiMode && (
          <LofiOverlay
            timerSeconds={timerSeconds} timerMode={timerMode} timerSessions={timerSessions}
            timerCourse={timerCourse} timerActive={timerActive} fmtTime={fmtTime}
            onToggle={() => setTimerActive(a => !a)} onExit={handleExitLofi}
            showExitWarn={showLofiExit} onConfirmExit={confirmExitLofi}
            daysToEnd={daysToEnd} audioRef={lofiAudioRef}
          />
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="sticky top-0 z-40 p-4">
        <GlassCard className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center rounded-full border-white/10">
          <div>
            <h1 className="text-base font-bold text-white">Hello, {getFirstName(studentName)}</h1>
            <p className="text-[9px] text-[#48cae4] font-bold uppercase tracking-widest flex items-center gap-1">
              <Activity size={9} className="animate-pulse" /> {studentID}
              {notificationsEnabled && <span className="ml-2 text-emerald-400">· Alerts on</span>}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {isAdmin && <Link href="/admin" className="px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20">Admin</Link>}
            {!notificationsEnabled && (
              <button onClick={requestNotifications} className="px-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 border border-emerald-500/20">
                <Bell size={13} /><span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Alerts</span>
              </button>
            )}
            <button onClick={() => setShowDontPanic(true)} className="px-3 py-2 bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all flex items-center gap-1.5 border border-purple-500/20">
              <Zap size={13} /><span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Panic</span>
            </button>
            <button onClick={handleExportProfile} className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all border border-blue-500/20">
              <Download size={13} />
            </button>
            <label className="px-3 py-2 bg-white/5 text-white/40 rounded-xl hover:bg-white/10 transition-all cursor-pointer border border-white/10">
              <Upload size={13} />
              <input type="file" accept="application/json,.json" onChange={handleImportProfile} className="hidden" />
            </label>
            <button onClick={handleLogout} className="px-3 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"><LogOut size={13} /></button>
          </div>
        </GlassCard>
      </header>

      {/* NEXT CLASS BAR */}
      <AnimatePresence>
        {nextClassInfo && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="max-w-5xl mx-auto px-4 pb-3">
            <div className="bg-[#00d4ff]/8 border border-[#00d4ff]/20 rounded-2xl px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] shrink-0" />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-bold text-sm">{nextClassInfo.course}</span>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-white/50 text-xs">{nextClassInfo.venue}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[#00d4ff] font-bold text-sm">
                  {nextClassInfo.minsUntil < 60 ? `${nextClassInfo.minsUntil}m` : `${Math.floor(nextClassInfo.minsUntil/60)}h ${nextClassInfo.minsUntil%60}m`}
                </p>
                <p className="text-white/25 text-[9px] uppercase tracking-widest">{nextClassInfo.startTime}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-5">

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="https://chat.whatsapp.com/EqsJ9zo4goBA6RFjv035Ei" target="_blank" className="p-4 bg-green-500/8 border border-green-500/15 rounded-2xl flex flex-col items-center gap-2 hover:bg-green-500/15 transition-all">
            <MessageCircle size={18} className="text-green-400" /><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">WhatsApp</span>
          </a>
          <button onClick={() => setShowSurvivalKit(true)} className="p-4 bg-blue-500/8 border border-blue-500/15 rounded-2xl flex flex-col items-center gap-2 hover:bg-blue-500/15 transition-all">
            <BookOpen size={18} className="text-blue-400" /><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Survival Kit</span>
          </button>
          <button onClick={() => setShowCWAModal(true)} className="p-4 bg-[#00d4ff]/8 border border-[#00d4ff]/15 rounded-2xl flex flex-col items-center gap-2 hover:bg-[#00d4ff]/15 transition-all">
            <Calculator size={18} className="text-[#00d4ff]" /><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">CWA Calc</span>
          </button>
          <button onClick={() => setShowUpdatesHub(true)} className="p-4 bg-purple-500/8 border border-purple-500/15 rounded-2xl flex flex-col items-center gap-2 hover:bg-purple-500/15 transition-all relative">
            <Bell size={18} className="text-purple-400" /><span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Updates</span>
            {announcements.length > 0 && <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black">{announcements.length}</div>}
          </button>
        </div>

        {/* END OF SEM COUNTDOWN */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden" delay={0.05}>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/25 mb-2">End of Semester — April 7, 2026</p>
          <div className="flex items-baseline gap-2 my-1">
            <p className="text-7xl font-black text-white tabular-nums">{daysToEnd > 0 ? daysToEnd : 'Done'}</p>
            {daysToEnd > 0 && <span className="text-white/25 font-bold uppercase text-xs tracking-widest">days</span>}
          </div>
          <p className={`text-sm mt-2 ${finalsInfo.color}`}>{finalsInfo.msg}</p>
        </GlassCard>

        {/* TIMETABLE */}
        <GlassCard className="p-6 md:p-8" delay={0.1}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} className="text-[#00d4ff]" /> {showWeekView ? 'Weekly Schedule' : "Today"}
            </h2>
            <button onClick={() => setShowWeekView(!showWeekView)} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border border-white/10">
              {showWeekView ? 'Collapse' : 'View Week'}
            </button>
          </div>
          <div className="space-y-5">
            {(showWeekView ? daysList : [todayName]).map(day => (
              <div key={day} className="space-y-3">
                {showWeekView && <p className="text-[#48cae4] font-bold text-[9px] uppercase tracking-[0.25em] pl-2 border-l border-[#48cae4]/50">{day}</p>}
                {TIMETABLE[day]?.length ? TIMETABLE[day].map((cls: any) => {
                  const pct = getAttendancePct(cls.id, cls.totalClasses);
                  const isSafe = pct >= 70;
                  return (
                    <div key={cls.id} className="p-4 rounded-2xl bg-white/3 border border-white/8 hover:border-white/15 transition-all space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex gap-3 items-center">
                          <div className="text-[9px] font-bold text-white/25 bg-white/5 p-2 rounded-lg min-w-[44px] text-center leading-tight">
                            <div className="uppercase tracking-wider">ends</div>
                            <div className="text-[#00d4ff] font-black">{cls.time.split(' - ')[1]}</div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white">{cls.course}</h4>
                            <p className="text-[9px] text-white/35 font-medium uppercase tracking-wider mt-0.5">{cls.venue} · {cls.lecturer}</p>
                            <p className="text-[9px] text-white/20 mt-0.5">{cls.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 justify-between md:justify-end">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${cls.type === 'Lab' ? 'bg-amber-500/15 text-amber-400' : 'bg-[#00d4ff]/10 text-[#00d4ff]'}`}>{cls.type}</span>
                          <button onClick={() => markAttendance(cls.id)} disabled={attendanceMarked[cls.id]}
                            className={`px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${attendanceMarked[cls.id] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/10 cursor-pointer'}`}>
                            {attendanceMarked[cls.id] ? <span className="flex items-center gap-1"><CheckCircle size={10} /> Present</span> : 'Mark Present'}
                          </button>
                        </div>
                      </div>
                      {/* Attendance bar — no danger zone label, just the bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-white/25 uppercase tracking-wider">{attendance[cls.id] || 0} / {cls.totalClasses} classes · {pct}%</span>
                          {isSafe && <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle size={9} /> Eligible</span>}
                        </div>
                        <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8 }}
                            className={`h-full rounded-full ${isSafe ? 'bg-emerald-400' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-500/70'}`} />
                        </div>
                      </div>
                    </div>
                  );
                }) : <p className="text-[9px] text-white/20 italic py-4 text-center uppercase tracking-widest">No classes scheduled</p>}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* POMODORO TIMER */}
        <GlassCard className="p-6 md:p-8" delay={0.15}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-base font-black uppercase tracking-wider mb-1">Study Timer</h2>
              <p className="text-white/30 text-xs mb-4 tracking-wide">35 min focus · 5 min break</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {COURSE_CREDITS.map(c => (
                  <button key={c.code} onClick={() => setTimerCourse(c.code)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${timerCourse === c.code ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/30 hover:bg-white/10 border border-white/10'}`}>
                    {c.code}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/20">Sessions today</span>
                {timerSessions > 0 && Array.from({ length: Math.min(timerSessions, 10) }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400/70" />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                  <motion.circle cx="50" cy="50" r="44" fill="none"
                    stroke={timerMode === 'focus' ? '#a855f7' : '#34d399'} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - timerSeconds / (timerMode === 'focus' ? 35*60 : 5*60))}`}
                    style={{ transition: 'stroke-dashoffset 1s linear' }} />
                </svg>
                <div className="text-center z-10">
                  <p className="text-3xl font-black text-white tabular-nums">{fmtTime(timerSeconds)}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${timerMode === 'focus' ? 'text-purple-400' : 'text-emerald-400'}`}>
                    {timerMode === 'focus' ? 'Focus' : 'Break'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setTimerActive(a => !a)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${timerActive ? 'bg-white/8 text-white border border-white/15' : 'bg-purple-600 text-white hover:bg-purple-500'}`}>
                  {timerActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={() => { setTimerSeconds(timerMode === 'focus' ? 35*60 : 5*60); setTimerActive(false); }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 text-white/30 hover:bg-white/10 border border-white/10 transition-all">
                  Reset
                </button>
                <button onClick={() => {
                  setLofiMode(true);
                  setTimerActive(true);
                  // Play audio immediately on this user click event
                  if (!lofiAudioRef.current) {
                    // Direct MP3 stream — no CORS issues, plays on click
                    lofiAudioRef.current = new Audio('https://stream.zeno.fm/f3wvbbqmdg8uv');
                    lofiAudioRef.current.loop = false; // stream handles looping
                    lofiAudioRef.current.volume = 0.5;
                  }
                  lofiAudioRef.current.play().catch((err) => console.warn('Audio play failed:', err));
                }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/20 transition-all">
                  LoFi
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* NOTES + RESOURCES */}
        <div className="grid md:grid-cols-2 gap-4">
          <GlassCard className="p-6 flex flex-col h-60" delay={0.2}>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2 text-white/50"><FileText size={13} className="text-[#00d4ff]" /> Notes</h3>
            <textarea value={notes} onChange={(e) => { setNotes(e.target.value); localStorage.setItem('bme-notes', e.target.value); }} placeholder="Jot something down..." className="flex-1 w-full bg-transparent border-0 outline-none text-sm leading-relaxed resize-none text-slate-300 placeholder:text-slate-700" />
          </GlassCard>
          <GlassCard className="p-6 flex flex-col h-60 justify-between" delay={0.3}>
            <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-white/50"><FileText size={13} className="text-emerald-400" /> Class Resources</h3>
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                <svg viewBox="0 0 87.3 78" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs">Lecture notes, past papers, shared files</p>
                <p className="text-white/20 text-[9px] mt-0.5 uppercase tracking-wider">BME1 Class Drive</p>
              </div>
            </div>
            <a href="https://drive.google.com/drive/folders/1QsLCU6OA8fswVkqO4A09ynnXSbk3PsWk" target="_blank" rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[9px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all">
              <ExternalLink size={11} /> Open Drive
            </a>
          </GlassCard>
        </div>

        {/* DEPARTMENT VENT */}
        <GlassCard className="p-6 md:p-8" delay={0.4}>
          <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2 mb-1">
            <Laugh size={16} className="text-yellow-400" /> The Department Vent
          </h2>
          <p className="text-white/25 text-xs mb-5 tracking-wide">Anonymous. Admin sees these.</p>
          <textarea value={ventText} onChange={(e) => setVentText(e.target.value.slice(0, 280))} placeholder="What would improve the BME experience?" className="w-full p-4 rounded-2xl bg-white/5 border border-white/8 text-sm text-white placeholder:text-slate-700 outline-none focus:border-white/20 resize-none h-20 transition-colors" />
          <div className="flex justify-between items-center mt-3">
            <span className="text-[9px] text-white/20 tracking-wider">{ventText.length} / 280</span>
            <button onClick={handleVentSubmit} disabled={!ventText.trim() || ventSubmitted}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${ventSubmitted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20 disabled:opacity-30'}`}>
              {ventSubmitted ? <><CheckCircle size={11} /> Submitted</> : <><Send size={11} /> Submit</>}
            </button>
          </div>
          {vents.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Recent</p>
              {vents.slice(0, 3).map((v) => (
                <div key={v.id} className="p-3 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-sm text-white/60">{v.text}</p>
                  <p className="text-[9px] text-white/20 mt-1 uppercase tracking-wider">{v.author} · {v.time}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* PUN TICKER */}
        <GlassCard className="p-4" delay={0.5}>
          <div className="flex items-center gap-3">
            <Coffee size={16} className="text-white/20 shrink-0" />
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.p key={currentPun} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.4 }}
                  className="text-xs text-white/30 italic">{BME_PUNS[currentPun]}</motion.p>
              </AnimatePresence>
            </div>
            <button onClick={() => setCurrentPun(p => (p + 1) % BME_PUNS.length)} className="text-white/20 hover:text-white/50 transition-all shrink-0 text-xs px-2">›</button>
          </div>
        </GlassCard>

      </main>

      {/* CWA MODAL */}
      <AnimatePresence>
        {showCWAModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-8 relative">
              <button onClick={() => setShowCWAModal(false)} className="absolute top-5 right-5 text-white/20 hover:text-white/60 transition-colors"><X size={16} /></button>
              <h2 className="text-base font-black mb-1 text-white uppercase tracking-wider flex items-center gap-2"><Calculator size={15} className="text-[#00d4ff]" /> CWA Calculator</h2>
              <p className="text-white/25 text-xs mb-6 tracking-wide">Enter your scores to project your CWA.</p>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto mb-6 pr-1">
                {COURSE_CREDITS.map(c => (
                  <div key={c.code} className="flex justify-between items-center bg-white/3 p-3.5 rounded-xl border border-white/8">
                    <div><p className="font-bold text-xs uppercase tracking-wider text-white">{c.code}</p><p className="text-[9px] text-white/25 tracking-wide">{c.name} · {c.credits} cr</p></div>
                    <input type="number" placeholder="—" min="0" max="100" className="w-14 p-2 rounded-lg bg-black/20 text-center font-bold text-[#00d4ff] text-sm outline-none border border-white/10 focus:border-[#00d4ff]/40 transition-colors"
                      onChange={(e) => { const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0)); setMarks({ ...marks, [c.code]: v.toString() }); e.target.value = v.toString(); }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t border-white/8 pt-4 mb-5">
                <span className="text-xs text-white/30 uppercase tracking-wider">Projected CWA</span>
                <span className="text-4xl font-black text-[#00d4ff] tabular-nums">{calculatedCWA ?? '—'}</span>
              </div>
              <button onClick={handleCalculateCWA} className="w-full py-3.5 bg-[#00d4ff] text-[#0a0f1c] rounded-xl font-black text-xs uppercase tracking-wider">Calculate</button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPDATES HUB */}
      <AnimatePresence>
        {showUpdatesHub && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowUpdatesHub(false)} className="absolute top-5 right-5 text-white/20 hover:text-white/60 transition-colors"><X size={16} /></button>
              <h2 className="text-base font-black mb-6 text-white uppercase tracking-wider flex items-center gap-2"><Bell size={15} className="text-purple-400" /> Updates Hub</h2>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Announcements ({announcements.length})</p>
                {announcements.length === 0 ? <p className="text-center py-8 text-white/20 text-sm">No announcements yet.</p> : (
                  <div className="space-y-2">{announcements.map((ann: any) => (
                    <div key={ann.id} className={`p-4 rounded-xl border-l-2 ${ann.type === 'urgent' ? 'border-red-500 bg-red-500/8' : 'border-blue-500 bg-blue-500/8'}`}>
                      <p className="text-sm text-white/80">{ann.text}</p><p className="text-[9px] text-white/25 mt-1 uppercase tracking-wider">{ann.date}</p>
                    </div>
                  ))}</div>
                )}
              </div>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Shared Files ({files.length})</p>
                {files.length === 0 ? <p className="text-center py-8 text-white/20 text-sm">No files shared yet.</p> : (
                  <div className="grid md:grid-cols-2 gap-3">{files.map((file: any) => (
                    <div key={file.id} className="p-4 rounded-xl bg-white/3 border border-white/8">
                      <p className="font-bold text-sm text-white mb-2">{file.course}</p>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="block w-full p-2.5 bg-white/8 text-white/60 rounded-lg text-xs font-bold text-center hover:bg-white/15 transition-all uppercase tracking-wider">Open</a>
                    </div>
                  ))}</div>
                )}
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">All courses on schedule</p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
