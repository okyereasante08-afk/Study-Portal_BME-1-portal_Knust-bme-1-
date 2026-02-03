'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// STUDENT DATABASE (same as main page)
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

const ADMIN_IDS = ['22028883'];

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentID, setStudentID] = useState('');
  
  // Announcement state
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ text: '', type: 'general' });
  
  // File upload state
  const [files, setFiles] = useState<any[]>([]);
  const [newFile, setNewFile] = useState({ course: '', week: '', type: 'notes', url: '' });
  
  // Attendance data
  const [attendanceData, setAttendanceData] = useState<any>({});
  
  // Statistics
  const [stats, setStats] = useState({
    totalStudents: Object.keys(CLASS_LIST).length,
    totalAnnouncements: 0,
    totalFiles: 0,
    averageAttendance: 0
  });

  useEffect(() => {
    const id = localStorage.getItem('bme-student-id');
    if (id && ADMIN_IDS.includes(id)) {
      setStudentID(id);
      setIsAuthenticated(true);
      loadData();
    }

    const savedDarkMode = localStorage.getItem('bme-dark-mode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const loadData = () => {
    // Load announcements
    const savedAnnouncements = localStorage.getItem('bme-admin-announcements');
    if (savedAnnouncements) {
      const parsed = JSON.parse(savedAnnouncements);
      setAnnouncements(parsed);
      setStats(prev => ({ ...prev, totalAnnouncements: parsed.length }));
    }

    // Load files
    const savedFiles = localStorage.getItem('bme-admin-files');
    if (savedFiles) {
      const parsed = JSON.parse(savedFiles);
      setFiles(parsed);
      setStats(prev => ({ ...prev, totalFiles: parsed.length }));
    }

    // Load attendance data
    const savedAttendance = localStorage.getItem('bme-attendance');
    if (savedAttendance) {
      const parsed = JSON.parse(savedAttendance);
      setAttendanceData(parsed);
      
      // Calculate average attendance
      const values = Object.values(parsed) as number[];
      const avg = values.length > 0 
        ? Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length)
        : 0;
      setStats(prev => ({ ...prev, averageAttendance: avg }));
    }
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.text.trim()) return;

    const announcement = {
      id: Date.now().toString(),
      text: newAnnouncement.text,
      type: newAnnouncement.type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: Date.now()
    };

    const updated = [announcement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('bme-admin-announcements', JSON.stringify(updated));
    localStorage.setItem('bme-announcements', JSON.stringify(updated)); // For main page
    setNewAnnouncement({ text: '', type: 'general' });
    setStats(prev => ({ ...prev, totalAnnouncements: updated.length }));
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('bme-admin-announcements', JSON.stringify(updated));
    localStorage.setItem('bme-announcements', JSON.stringify(updated));
    setStats(prev => ({ ...prev, totalAnnouncements: updated.length }));
  };

  const handleAddFile = () => {
    if (!newFile.course.trim() || !newFile.url.trim()) return;

    const file = {
      id: Date.now().toString(),
      course: newFile.course,
      week: newFile.week,
      type: newFile.type,
      url: newFile.url,
      uploadedAt: Date.now()
    };

    const updated = [file, ...files];
    setFiles(updated);
    localStorage.setItem('bme-admin-files', JSON.stringify(updated));
    localStorage.setItem('bme-files', JSON.stringify(updated)); // For main page
    setNewFile({ course: '', week: '', type: 'notes', url: '' });
    setStats(prev => ({ ...prev, totalFiles: updated.length }));
  };

  const handleDeleteFile = (id: string) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    localStorage.setItem('bme-admin-files', JSON.stringify(updated));
    localStorage.setItem('bme-files', JSON.stringify(updated));
    setStats(prev => ({ ...prev, totalFiles: updated.length }));
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('bme-dark-mode', newMode.toString());
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-12 max-w-md w-full text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Access Denied</h1>
          <p className="text-white/60 mb-8 font-medium">This area is restricted to administrators only.</p>
          <Link href="/" className="inline-block px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold uppercase tracking-wider hover:bg-emerald-600 transition">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white p-6 shadow-2xl sticky top-0 z-40 border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Admin Control Panel</h1>
            <p className="text-yellow-300 text-[10px] font-bold tracking-widest uppercase">System Administrator</p>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleDarkMode} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Link href="/" className="px-6 py-3 bg-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-white/20 transition">
              Exit Admin
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-6 shadow-xl border-4 border-emerald-500`}>
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-black text-emerald-500">{stats.totalStudents}</div>
            <div className="text-xs font-bold opacity-40 uppercase tracking-wider">Total Students</div>
          </div>
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-6 shadow-xl border-4 border-blue-500`}>
            <div className="text-4xl mb-2">📢</div>
            <div className="text-3xl font-black text-blue-500">{stats.totalAnnouncements}</div>
            <div className="text-xs font-bold opacity-40 uppercase tracking-wider">Announcements</div>
          </div>
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-6 shadow-xl border-4 border-purple-500`}>
            <div className="text-4xl mb-2">📁</div>
            <div className="text-3xl font-black text-purple-500">{stats.totalFiles}</div>
            <div className="text-xs font-bold opacity-40 uppercase tracking-wider">Files Uploaded</div>
          </div>
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-6 shadow-xl border-4 border-orange-500`}>
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-black text-orange-500">{stats.averageAttendance}</div>
            <div className="text-xs font-bold opacity-40 uppercase tracking-wider">Avg Attendance</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-2 shadow-xl mb-8 flex gap-2 overflow-x-auto`}>
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'announcements', label: '📢 Announcements', icon: '📢' },
            { id: 'files', label: '📁 Files', icon: '📁' },
            { id: 'attendance', label: '✅ Attendance', icon: '✅' },
            { id: 'students', label: '👥 Students', icon: '👥' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-8 shadow-xl`}>
                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">System Overview</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider text-emerald-500 mb-3">Recent Activity</h3>
                    <div className="space-y-2">
                      <div className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📢</span>
                          <div>
                            <p className="font-bold text-sm">Latest announcement posted</p>
                            <p className="text-xs opacity-50">
                              {announcements.length > 0 
                                ? announcements[0].date 
                                : 'No announcements yet'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📁</span>
                          <div>
                            <p className="font-bold text-sm">Latest file uploaded</p>
                            <p className="text-xs opacity-50">
                              {files.length > 0 
                                ? new Date(files[0].uploadedAt).toLocaleDateString()
                                : 'No files yet'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider text-blue-500 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('announcements')}
                        className="w-full p-4 bg-blue-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-blue-700 transition"
                      >
                        Post New Announcement
                      </button>
                      <button
                        onClick={() => setActiveTab('files')}
                        className="w-full p-4 bg-purple-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-purple-700 transition"
                      >
                        Upload New File
                      </button>
                      <button
                        onClick={() => setActiveTab('attendance')}
                        className="w-full p-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-emerald-700 transition"
                      >
                        View Attendance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-8 shadow-xl`}>
                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Post New Announcement</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">
                      Announcement Type
                    </label>
                    <select
                      value={newAnnouncement.type}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                      className={`w-full p-4 rounded-2xl font-bold ${
                        darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                      }`}
                    >
                      <option value="general">📌 General</option>
                      <option value="urgent">🚨 Urgent</option>
                      <option value="quiz">📝 Quiz/Test</option>
                      <option value="deadline">⏰ Deadline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">
                      Message
                    </label>
                    <textarea
                      value={newAnnouncement.text}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, text: e.target.value })}
                      placeholder="Enter your announcement here..."
                      rows={4}
                      className={`w-full p-4 rounded-2xl font-medium resize-none ${
                        darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                      }`}
                    />
                  </div>
                  <button
                    onClick={handleAddAnnouncement}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                  >
                    📢 Post Announcement
                  </button>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-8 shadow-xl`}>
                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">All Announcements</h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {announcements.length === 0 ? (
                    <p className="text-center py-8 opacity-40 italic">No announcements yet</p>
                  ) : (
                    announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className={`p-5 rounded-2xl border-l-4 ${
                          ann.type === 'urgent' ? 'border-red-500 bg-red-500/5' :
                          ann.type === 'quiz' ? 'border-orange-500 bg-orange-500/5' :
                          ann.type === 'deadline' ? 'border-yellow-500 bg-yellow-500/5' :
                          'border-blue-500 bg-blue-500/5'
                        } flex justify-between items-start gap-4`}
                      >
                        <div className="flex-1">
                          <p className="font-bold text-sm mb-2">{ann.text}</p>
                          <div className="flex gap-3 items-center">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                              ann.type === 'urgent' ? 'bg-red-500 text-white' :
                              ann.type === 'quiz' ? 'bg-orange-500 text-white' :
                              ann.type === 'deadline' ? 'bg-yellow-500 text-white' :
                              'bg-blue-500 text-white'
                            }`}>
                              {ann.type}
                            </span>
                            <span className="text-xs opacity-50 font-bold">{ann.date}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl font-bold text-xs uppercase hover:bg-red-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-8 shadow-xl`}>
                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Upload New File</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">
                        Course Name
                      </label>
                      <input
                        type="text"
                        value={newFile.course}
                        onChange={(e) => setNewFile({ ...newFile, course: e.target.value })}
                        placeholder="e.g., MATH 151"
                        className={`w-full p-4 rounded-2xl font-bold ${
                          darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">
                        Week/Topic
                      </label>
                      <input
                        type="text"
                        value={newFile.week}
                        onChange={(e) => setNewFile({ ...newFile, week: e.target.value })}
                        placeholder="e.g., Week 3"
                        className={`w-full p-4 rounded-2xl font-bold ${
                          darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">
                      File Type
                    </label>
                    <select
                      value={newFile.type}
                      onChange={(e) => setNewFile({ ...newFile, type: e.target.value })}
                      className={`w-full p-4 rounded-2xl font-bold ${
                        darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                      }`}
                    >
                      <option value="notes">📄 Notes</option>
                      <option value="recording">🎥 Recording</option>
                      <option value="slides">📊 Slides</option>
                      <option value="manual">📖 Lab Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">
                      File URL (Google Drive, etc.)
                    </label>
                    <input
                      type="url"
                      value={newFile.url}
                      onChange={(e) => setNewFile({ ...newFile, url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className={`w-full p-4 rounded-2xl font-medium ${
                        darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                      }`}
                    />
                  </div>
                  <button
                    onClick={handleAddFile}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                  >
                    📁 Upload File
                  </button>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-8 shadow-xl`}>
                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">All Uploaded Files</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.length === 0 ? (
                    <p className="col-span-full text-center py-8 opacity-40 italic">No files uploaded yet</p>
                  ) : (
                    files.map((file) => (
                      <div
                        key={file.id}
                        className={`p-5 rounded-2xl border ${darkMode ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-slate-50'}`}
                      >
                        <div className="mb-3">
                          <p className="font-black text-sm mb-1">{file.course}</p>
                          <p className="text-xs opacity-50 font-bold uppercase">{file.week}</p>
                        </div>
                        <div className="flex gap-2 mb-3">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 p-2 bg-blue-600 text-white rounded-lg text-xs font-bold text-center hover:bg-blue-700 transition"
                          >
                            {file.type === 'notes' ? '📄 Notes' :
                             file.type === 'recording' ? '🎥 Recording' :
                             file.type === 'slides' ? '📊 Slides' : '📖 Manual'}
                          </a>
                        </div>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="w-full p-2 bg-red-500/10 text-red-500 rounded-lg font-bold text-xs uppercase hover:bg-red-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-8 shadow-xl`}>
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Attendance Overview</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {Object.keys(attendanceData).length === 0 ? (
                  <p className="text-center py-8 opacity-40 italic">No attendance data yet</p>
                ) : (
                  Object.entries(attendanceData)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([classId, count]) => (
                      <div
                        key={classId}
                        className={`p-5 rounded-2xl flex justify-between items-center ${
                          darkMode ? 'bg-slate-800/40' : 'bg-slate-50'
                        }`}
                      >
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">Class ID: {classId}</p>
                          <p className="text-xs opacity-50 font-bold">Students marked present</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-emerald-500">{count as number}</p>
                          <p className="text-[10px] font-bold opacity-40 uppercase">Students</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-3xl p-8 shadow-xl`}>
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">All Students</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  className={`w-full p-4 rounded-2xl font-medium ${
                    darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'
                  }`}
                  onChange={(e) => {
                    // Simple search implementation
                    const value = e.target.value.toLowerCase();
                    const rows = document.querySelectorAll('[data-student-row]');
                    rows.forEach((row: any) => {
                      const text = row.textContent.toLowerCase();
                      row.style.display = text.includes(value) ? '' : 'none';
                    });
                  }}
                />
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {Object.entries(CLASS_LIST).map(([id, name]) => (
                  <div
                    key={id}
                    data-student-row
                    className={`p-4 rounded-2xl flex justify-between items-center ${
                      darkMode ? 'bg-slate-800/40' : 'bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm">{name}</p>
                      <p className="text-xs opacity-50 font-mono">{id}</p>
                    </div>
                    <div className="flex gap-2">
                      {id === studentID && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-lg text-[10px] font-black uppercase">
                          You
                        </span>
                      )}
                      {ADMIN_IDS.includes(id) && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg text-[10px] font-black uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
