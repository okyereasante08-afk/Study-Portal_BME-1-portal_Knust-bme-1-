'use client';

import { useState, useEffect } from 'react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

// --- STUDENT DATABASE (Extracted from BME1_CLASS LIST.docx) ---
const CLASS_LIST: { [id: string]: string } = {
  "21935355": "Aaron Oduro",
  "22123354": "Abena Dufie Opare-Baah",
  "22088436": "Abena Tabuaa Obeng-Mensah",
  "21949701": "Adelaide Selorm Afi Dzimadzor",
  "21948324": "Adjei Pomaa Cresta",
  "21875208": "Adjoa Kwansema Eshun",
  "22245585": "Adune Dasha Bagase",
  "22337376": "Adwoa Abrafi Adjei",
  "21931395": "Afia Serwaa Kwarteng Amaning",
  "22416594": "Afriyie Jeanefel Owusu",
  "22331047": "Agyarko-Nyamekye Max Abankwa",
  "21787360": "Agyei Chrislla Birago",
  "22208586": "Ahenkorah Emmanuella Kyei",
  "21947631": "Albert Affum Opare",
  "21938073": "Amankwaah Beatrice Sarpong Akosua",
  "22312345": "Amoaba Keren-Happuch Winvel",
  "22341588": "Amoah-Owusu Cecil Williams",
  "21888854": "AMPOFO Abena Gyamfia",
  "22048359": "Ampofo Nana Yaw Kwegya",
  "22561241": "Ampomah Daniel",
  "22547391": "Amuzu Richmond Kwame",
  "22259193": "Ankomah Maxi-Priest",
  "22277904": "Anlaagmen Pearl Nuonta",
  "22341786": "Annan Nora Odokai",
  "22166367": "Appiah Roberta Achiaa",
  "22082053": "Asante Emmanuella Twumasiwaa",
  "22028883": "Asante Kwaku Okyere",
  "21716259": "Asare Godfred",
  "22129935": "Awurakua Akomea-Dankyi",
  "21893253": "Ayiku Richmond Lartey",
  "22224514": "Baaba Nyarko Assabil",
  "21760006": "Baffoe Renia Gyan",
  "22077735": "Baiden Abdul Ghaffar Benyi",
  "22315225": "Bezalel Addy Bamflo",
  "21809851": "Blessing Dadzie",
  "22178256": "Blessing Pokuaa",
  "21795884": "Boadu Kelvin Kwabena",
  "21854625": "Boakye Justice Ofori",
  "21840594": "Boakye Nana Akosua Agyeiwaa",
  "22504820": "Boatemaa-Ayim Nana Akua",
  "21902739": "Boateng Yiedie Akyaa",
  "21976026": "Caleb Adjei Mensah",
  "22247538": "Carlis Appiah-Sarkodie",
  "21822251": "Christabel Dadzie",
  "22300069": "Christian Amoah",
  "22541775": "Daniel Kwabena Affum",
  "22200510": "Darko Lisa Ampem",
  "22208865": "Darlington Mawuena Anyomi",
  "22698331": "David Adjei",
  "22313191": "Davies Mawuli Kamsey",
  "22108018": "Deborah Adjei Acquah",
  "21763979": "Dennis Gyebi",
  "21837887": "Doma-Her Skylar Sungbawiere",
  "22544637": "Dzansi Virginia Makafui",
  "21974352": "Ekow Amoah Benyi-Acquah",
  "22215957": "Elizabeth Tetebea Agyemang",
  "22046739": "Ernest Nimako-Boateng",
  "21797396": "Esi Asor Hemaa Aboagye",
  "22048114": "Fieve Brain Delanyo",
  "22430218": "Frimpong Precious Antwowaah",
  "21983696": "Frimpong Wilhelmina",
  "22514233": "Fudzie Kelvin Delali",
  "22328187": "Fuseini Ibtihaaj Gaida",
  "21841024": "Fynn Emmanuella Esi",
  "21946146": "Gifty Asantewaa Adoma",
  "22190892": "Grace Armoo",
  "21969430": "Hammond Kevin Nii Obli",
  "22010557": "Israelna Ama Yeboah",
  "21995972": "James Adjei Mensah",
  "21896223": "Jazlyn Yaa Asantewah Okae-Kyei",
  "22184311": "Jenefails Akuffo-Gyan",
  "22710811": "Josephine Nana Akosua Pinamang Gyebi",
  "22429815": "Keren Naa Klorkor Quaye",
  "21904638": "Keziah Deborah Wilson",
  "22645870": "Koramah Mercy",
  "22243432": "Kusi Constance Abrafi",
  "21882887": "Lakeisha Lord-Mensah",
  "22083170": "Laura Naa Tiokor Amartey",
  "22127161": "Lawrencia Awuah Adobea",
  "21949982": "Lisa Timbilla Azasumah",
  "22331976": "Maame Ama Tiwaa Ofori-Agyeman",
  "21859658": "Marfo Isaac",
  "21795451": "Mary Achiaa Sarpong",
  "22333045": "Mawaddatu Abdul Rashid",
  "22565526": "Michael Fiifi Djan",
  "22051165": "Naa Teley Ayorkor Quaye",
  "21885234": "Nadia Stoner-Darku",
  "21877955": "Nana Adwoa Gyamfua Hyeaman",
  "22334053": "Nana Ekua Serwah Ampomah",
  "22213391": "Nana Frimpong Desu",
  "21974163": "Narh Otabil Mensah",
  "21889745": "Nina Osman Mustapha",
  "22408944": "Nyamador Kenneth Selorm",
  "22429220": "NYANTAKYI Pascal",
  "22052236": "Obeng Antoinette Maame Adjoa Antwiwaa",
  "21913089": "Obiri-Yeboah Vanessa",
  "22472240": "Odame Daniel",
  "21694679": "Oduro John Luther Kweku",
  "22364718": "Oduro Prince Peasah",
  "22440821": "Ofori Ayimwaah Nana Akua",
  "21989933": "Okai Eugene Kobina",
  "22042804": "OKYNE Adjetey Godson",
  "22086375": "OLIVIA Nhyira Dwomoh",
  "21783110": "Opoku Gospel Kwame",
  "22030735": "Oppong Badu Andrea",
  "22332966": "Paula Sedinam Foriwa Apawu",
  "22011457": "Pearl Maame Nyarko Ofori-Ameyaw",
  "22003933": "Raudatu Deishini Mohammed Awal",
  "22218511": "Roxann Ankobea-Kokroe",
  "21919326": "Sarfo Vannessa Adams",
  "22538085": "Sarkodie Raymond",
  "21008757": "Sarpong Abena Adutwumwaa",
  "22648542": "Segbefia Jake Etse",
  "22435656": "Segbenya Edem",
  "21914691": "Sekyi Kelvin Asiedu",
  "22065297": "Serwaa Afia Opoku Agyemang",
  "21756237": "Serwaa Nana Adoma",
  "21873633": "Shanti Abena Thanki",
  "22086004": "Somuah Herbert Koranteng",
  "22551945": "Stacey Shenchu Kimbi",
  "22462485": "Stephan Kofi Ewenam Zewuze",
  "22399422": "Stephen Kofi Apemah-Baah",
  "22646382": "Stephen Nana Boamah",
  "22042354": "Sumani Anis Wonta",
  "21910531": "TAHIRU Akor Munziru",
  "22272601": "Takyi Timothy",
  "22677767": "Taufiq Nassara Sadiq",
  "22336160": "Tetteh Daniel Nii Awuley",
  "21830521": "Tibu Seth",
  "21721342": "Tieku Timah Princess",
  "22185447": "Twumasi Nicolina Nana Akua",
  "22263241": "Winnifred Monney",
  "22345160": "Worlase Afua Kportufe",
  "22247637": "Yao-Kumah Davida Eyram",
  "22348338": "Yeboah Yaa Gyamfuaa"
};

// ... (Rest of Timetable and Course Credit constants remain same as previous version)

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentID, setStudentID] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Dashboard states
  const [darkMode, setDarkMode] = useState(false);
  const [showWeekView, setShowWeekView] = useState(false);
  const [showCWAModal, setShowCWAModal] = useState(false);
  const [attendance, setAttendance] = useState<{ [key: string]: number }>({});
  const [marks, setMarks] = useState<{ [key: string]: string }>({});
  const [calculatedCWA, setCalculatedCWA] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [daysToMidSem, setDaysToMidSem] = useState(0);

  // AUTH CHECK ON LOAD
  useEffect(() => {
    const savedID = localStorage.getItem('bme-session-id');
    if (savedID && CLASS_LIST[savedID]) {
      setStudentName(CLASS_LIST[savedID]);
      setIsLoggedIn(true);
    }
    // ... (Existing hydration for dark mode, notes, etc.)
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (CLASS_LIST[studentID]) {
      setStudentName(CLASS_LIST[studentID]);
      setIsLoggedIn(true);
      localStorage.setItem('bme-session-id', studentID);
    } else {
      setLoginError('Invalid Student ID. Access Denied.');
    }
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  // ... (Existing functions for markAttendance, saveNotes, handleCalculateCWA)

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} ${outfit.className}`}>
        <form onSubmit={handleLogin} className={`w-full max-w-md p-8 rounded-[40px] shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border`}>
          <div className="flex flex-col items-center mb-8">
            <div className="h-20 w-20 bg-[#3b0764] rounded-full flex items-center justify-center text-amber-400 font-black mb-4 shadow-xl border-4 border-amber-400/20">KNUST</div>
            <h1 className="text-2xl font-black uppercase text-center">BME Portal Login</h1>
            <p className="text-xs opacity-50 mt-1 uppercase tracking-widest font-bold text-center">Biomedical Engineering L100</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase opacity-40 ml-4 mb-2 block">Enter Student ID</label>
              <input 
                type="text" 
                placeholder="2xxxxxxx"
                value={studentID}
                onChange={(e) => setStudentID(e.target.value)}
                className={`w-full p-4 rounded-3xl border-none outline-none font-bold text-center ${darkMode ? 'bg-slate-800 focus:ring-2 ring-emerald-500' : 'bg-slate-100 focus:ring-2 ring-purple-500'}`}
              />
            </div>
            {loginError && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">{loginError}</p>}
            <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-3xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">ACCESS PORTAL</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'} ${outfit.className} transition-colors duration-300`}>
      {/* HEADER */}
      <header className="bg-[#3b0764] text-white p-6 shadow-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-400 rounded-full flex items-center justify-center font-black text-purple-950 text-[10px] text-center shadow-lg border-2 border-white">KNUST<br/>BME</div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">Welcome, {getFirstName(studentName)}</h1>
              <p className="text-amber-400 text-[10px] font-bold tracking-widest uppercase">ID: {studentID} • BIOMEDICAL ENGINEERING</p>
            </div>
          </div>
          <button onClick={toggleDarkMode} className="p-3 bg-white/10 rounded-2xl text-xl hover:bg-white/20 transition backdrop-blur-md">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ... (Existing Dashboard Main content with Timetable, Quick Notes, and Countdown) */}
    </div>
  );
}
