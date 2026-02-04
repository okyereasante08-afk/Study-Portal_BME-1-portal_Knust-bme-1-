import { Timetable, Theme, Achievement, SharedFile } from './types';

export const ADMIN_IDS = ['22028883'];

export const THEMES: Record<string, Theme> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#00d4ff',
    accent: '#48cae4',
    bgGradient: 'from-[#0f172a] via-[#0b1120] to-[#050914]',
    orb1: '#00d4ff',
    orb2: '#3b0764'
  },
  forest: {
    id: 'forest',
    name: 'Forest Green',
    primary: '#10b981',
    accent: '#34d399',
    bgGradient: 'from-[#052e16] via-[#022c22] to-[#064e3b]',
    orb1: '#10b981',
    orb2: '#065f46'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    primary: '#f97316',
    accent: '#fbbf24',
    bgGradient: 'from-[#431407] via-[#2c0b0e] to-[#0f0505]',
    orb1: '#f97316',
    orb2: '#9a3412'
  },
  purple: {
    id: 'purple',
    name: 'Purple Night',
    primary: '#a855f7',
    accent: '#d8b4fe',
    bgGradient: 'from-[#2e1065] via-[#1e1b4b] to-[#000000]',
    orb1: '#a855f7',
    orb2: '#4c1d95'
  }
};

export const ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'first_week', 
    title: 'First Week Complete!', 
    description: 'Maintained a 7-day study streak', 
    icon: '🔥',
    condition: (data) => data.streak >= 7
  },
  { 
    id: 'cwa_pro', 
    title: 'CWA Calculator Pro', 
    description: 'Used the CWA calculator 10 times', 
    icon: '🧮',
    condition: (data) => data.cwaUsage >= 10
  },
  { 
    id: 'perfect_month', 
    title: 'Perfect Attendance', 
    description: 'Marked attendance 20 times', 
    icon: '✨',
    condition: (data) => data.attendanceCount >= 20
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Checked in before 8 AM',
    icon: '🌅',
    condition: (data) => data.hasEarlyCheckIn
  }
];

export const RESOURCES: SharedFile[] = [
  { id: '1', course: 'BME 161', week: 'Week 1', type: 'slides', url: '#' },
  { id: '2', course: 'MATH 151', week: 'Week 2', type: 'notes', url: '#' },
  { id: '3', course: 'COE 153', week: 'Week 3', type: 'manual', url: '#' },
  { id: '4', course: 'CHEM 151', week: 'Week 4', type: 'recording', url: '#' },
  { id: '5', course: 'BME 161', week: 'Week 5', type: 'slides', url: '#' },
];

export const QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
  "Your future is created by what you do today, not tomorrow. - Robert Kiyosaki",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The expert in anything was once a beginner. - Helen Hayes",
  "There are no shortcuts to any place worth going. - Beverly Sills"
];

export const TRIVIA = [
  { subject: "Algebra", content: "Recall: The determinant of a 2x2 matrix [a b; c d] is ad - bc. If it's zero, the matrix has no inverse." },
  { subject: "Algebra", content: "Complex Numbers: i² is equal to -1. The conjugate of a + bi is a - bi." },
  { subject: "Algebra", content: "Vectors: The dot product of two orthogonal (perpendicular) vectors is always zero." },
  { subject: "Kindergarten Math", content: "Mental Gym: What is 1 + 300?" },
  { subject: "Kindergarten Math", content: "Quick Check: What is 50 - 25?" },
  { subject: "Applied Electricity", content: "Thevenin's Theorem: Any linear bilateral network can be replaced by a single voltage source (Vth) and a series resistance (Rth)." },
  { subject: "Applied Electricity", content: "Norton's Theorem: Replaces the circuit with a current source (In) and a parallel resistance (Rn)." },
  { subject: "Applied Electricity", content: "KCL (Kirchhoff's Current Law): The algebraic sum of currents entering a node is zero. (Conservation of Charge)" },
  { subject: "Applied Electricity", content: "Superposition: In a linear circuit with multiple sources, the total response is the sum of responses from each source acting alone." },
  { subject: "Basic Mechanics", content: "Physics 101: Force = Mass × Acceleration (Newton's Second Law)." },
  { subject: "Cell Biology", content: "Fact: Mitochondria are the powerhouses of the cell, generating most of the cell's supply of ATP." },
  { subject: "Cell Biology", content: "Fact: The cell membrane is a phospholipid bilayer that controls what enters and exits the cell." },
  { subject: "General Chemistry", content: "Fact: Avogadro's constant is approximately 6.022 × 10²³ particles per mole." },
  { subject: "Applied Electricity", content: "Voltage Drop: Across a resistor R carrying current I is given by V = IR (Ohm's Law)." }
];

export const CLASS_LIST: { [id: string]: string } = {
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
  "21896223": "Jazlyn Yaa Asantewah Okae-Kyei", "22184311": "Jenefails Akuffo-Gyan", "22710811": "Josephine Nana Akosua Pinamang Gyebi",
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
  "22339201": "Williams-Peniel Enoch",
};

export const COURSE_CREDITS = [
  { code: 'MATH 151', name: 'Algebra', credits: 4 },
  { code: 'BME 161', name: 'Cell Biology', credits: 3 },
  { code: 'EE 151', name: 'Applied Electricity', credits: 3 },
  { code: 'ME 161', name: 'Basic Mechanics', credits: 3 },
  { code: 'CHEM 151', name: 'General Chemistry', credits: 2 },
  { code: 'COE 153', name: 'Engineering Tech', credits: 2 },
  { code: 'ENGL 157', name: 'Comm. Skills I', credits: 2 },
];

export const TIMETABLE: Timetable = {
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
