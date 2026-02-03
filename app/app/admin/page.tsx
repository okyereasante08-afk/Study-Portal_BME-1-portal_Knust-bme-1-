'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Admin IDs - these student IDs have admin access
const ADMIN_IDS = ['22028883']; // Add more admin IDs here

type Announcement = {
  id: string;
  text: string;
  type: 'info' | 'quiz' | 'deadline' | 'urgent';
  date: string;
  author: string;
};

type FileUpload = {
  id: string;
  course: string;
  week: string;
  type: 'notes' | 'recording' | 'slides' | 'manual';
  url: string;
  uploadDate: string;
};

type LoginLog = {
  studentId: string;
  studentName: string;
  timestamp: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStudentId, setCurrentStudentId] = useState('');
  
  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [announcementType, setAnnouncementType] = useState<'info' | 'quiz' | 'deadline' | 'urgent'>('info');
  
  // File Uploads
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [newFile, setNewFile] = useState({
    course: '',
    week: '',
    type: 'notes' as 'notes' | 'recording' | 'slides' | 'manual',
    url: ''
  });
  
  // Analytics
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [activeTab, setActiveTab] = useState<'announcements' | 'files' | 'analytics'>('announcements');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is admin
    const savedID = localStorage.getItem('bme-session-id');
    if (!savedID || !ADMIN_IDS.includes(savedID)) {
      router.push('/');
      return;
    }
    
    setCurrentStudentId(savedID);
    setIsAdmin(true);
    setLoading(false);

    // Load saved data
    const savedDark = localStorage.getItem('bme-dark');
    if (savedDark) setDarkMode(savedDark === 'true');

    const savedAnnouncements = localStorage.getItem('bme-announcements');
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));

    const savedFiles = localStorage.getItem('bme-files');
    if (savedFiles) setFiles(JSON.parse(savedFiles));

    const savedLogs = localStorage.getItem('bme-login-logs');
    if (savedLogs) setLoginLogs(JSON.parse(savedLogs));
  }, [router]);

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) return;

    const announcement: Announcement = {
      id: Date.now().toString(),
      text: newAnnouncement,
      type: announcementType,
      date: new Date().toLocaleDateString(),
      author: currentStudentId
    };

    const updated = [announcement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('bme-announcements', JSON.stringify(updated));
    setNewAnnouncement('');
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('bme-announcements', JSON.stringify(updated));
  };

  const handleAddFile = () => {
    if (!newFile.course || !newFile.week || !newFile.url) return;

    const file: FileUpload = {
      id: Date.now().toString(),
      ...newFile,
      uploadDate: new Date().toLocaleDateString()
    };

    const updated = [file, ...files];
    setFiles(updated);
    localStorage.setItem('bme-files', JSON.stringify(updated));
    setNewFile({ course: '', week: '', type: 'notes', url: '' });
  };

  const handleDeleteFile = (id: string) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    localStorage.setItem('bme-files', JSON.stringify(updated));
  };

  const getUniqueLogins = () => {
    const unique = new Set(loginLogs.map(log => log.studentId));
    return unique.size;
  };

  const getLoginsToday = () => {
    const today = new Date().toLocaleDateString();
    return loginLogs.filter(log => log.timestamp.includes(today)).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white text-xl font-bold">Loading Admin Panel...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const bgColor = darkMode ? 'bg-slate-950' : 'bg-slate-50';
  const textColor = darkMode ? 'text-slate-200' : 'text-slate-900';
  const cardBg = darkMode ? 'bg-slate-900' : 'bg-white';
  const borderColor = darkMode ? 'border-slate-800' : 'border-slate-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-red-900 text-white p-6 shadow-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase">Admin Dashboard</h1>
            <p className="text-red-200 text-xs font-bold tracking-widest uppercase">Level 100 BME Portal Control</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-white/10 rounded-2xl">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => router.push('/')} className="px-4 py-2 bg-white/20 rounded-2xl text-sm font-bold">
              Back to Portal
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-6 text-center`}>
            <p className="text-3xl font-black text-blue-600">{announcements.length}</p>
            <p className="text-xs font-bold opacity-50 uppercase mt-1">Announcements</p>
          </div>
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-6 text-center`}>
            <p className="text-3xl font-black text-green-600">{files.length}</p>
            <p className="text-xs font-bold opacity-50 uppercase mt-1">Files Uploaded</p>
          </div>
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-6 text-center`}>
            <p className="text-3xl font-black text-purple-600">{getUniqueLogins()}</p>
            <p className="text-xs font-bold opacity-50 uppercase mt-1">Total Users</p>
          </div>
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-6 text-center`}>
            <p className="text-3xl font-black text-orange-600">{getLoginsToday()}</p>
            <p className="text-xs font-bold opacity-50 uppercase mt-1">Logins Today</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b-2 border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'announcements'
                ? 'border-b-4 border-red-600 text-red-600'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            📢 Announcements
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'files'
                ? 'border-b-4 border-red-600 text-red-600'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            📁 Files
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'analytics'
                ? 'border-b-4 border-red-600 text-red-600'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            📊 Analytics
          </button>
        </div>

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className={`${cardBg} border ${borderColor} rounded-3xl p-6 shadow-xl`}>
              <h2 className="text-xl font-black mb-4 uppercase">Create New Announcement</h2>
              
              <div className="space-y-4">
                <textarea
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="Type your announcement here..."
                  className={`w-full p-4 rounded-2xl border ${borderColor} ${darkMode ? 'bg-slate-800' : 'bg-slate-50'} outline-none resize-none h-32`}
                />
                
                <div className="flex gap-3">
                  <select
                    value={announcementType}
                    onChange={(e) => setAnnouncementType(e.target.value as any)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} outline-none`}
                  >
                    <option value="info">ℹ️ Info</option>
                    <option value="quiz">📝 Quiz</option>
                    <option value="deadline">⏰ Deadline</option>
                    <option value="urgent">🚨 Urgent</option>
                  </select>
                  
                  <button
                    onClick={handleAddAnnouncement}
                    className="flex-1 px-6 py-2 bg-red-600 text-white rounded-xl font-black text-sm uppercase hover:bg-red-700 transition"
                  >
                    Post Announcement
                  </button>
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className={`${cardBg} border ${borderColor} rounded-3xl p-6 shadow-xl`}>
              <h2 className="text-xl font-black mb-4 uppercase">Active Announcements ({announcements.length})</h2>
              
              {announcements.length === 0 ? (
                <p className="text-center py-8 opacity-50 text-sm">No announcements yet. Create one above!</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div
                      key={ann.id}
                      className={`p-4 rounded-2xl border-l-4 ${
                        ann.type === 'urgent' ? 'border-red-500 bg-red-500/5' :
                        ann.type === 'quiz' ? 'border-orange-500 bg-orange-500/5' :
                        ann.type === 'deadline' ? 'border-yellow-500 bg-yellow-500/5' :
                        'border-blue-500 bg-blue-500/5'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{ann.text}</p>
                          <p className="text-xs opacity-50 font-bold">
                            {ann.date} • Posted by Admin ({ann.author})
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="ml-4 p-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className={`${cardBg} border ${borderColor} rounded-3xl p-6 shadow-xl`}>
              <h2 className="text-xl font-black mb-4 uppercase">Upload New File</h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Course Code (e.g., CHEM 151)"
                    value={newFile.course}
                    onChange={(e) => setNewFile({ ...newFile, course: e.target.value })}
                    className={`p-4 rounded-2xl border ${borderColor} ${darkMode ? 'bg-slate-800' : 'bg-slate-50'} outline-none font-bold`}
                  />
                  <input
                    type="text"
                    placeholder="Week (e.g., Week 3)"
                    value={newFile.week}
                    onChange={(e) => setNewFile({ ...newFile, week: e.target.value })}
                    className={`p-4 rounded-2xl border ${borderColor} ${darkMode ? 'bg-slate-800' : 'bg-slate-50'} outline-none font-bold`}
                  />
                </div>
                
                <input
                  type="url"
                  placeholder="File URL (Google Drive, Dropbox, etc.)"
                  value={newFile.url}
                  onChange={(e) => setNewFile({ ...newFile, url: e.target.value })}
                  className={`w-full p-4 rounded-2xl border ${borderColor} ${darkMode ? 'bg-slate-800' : 'bg-slate-50'} outline-none font-bold`}
                />
                
                <div className="flex gap-3">
                  <select
                    value={newFile.type}
                    onChange={(e) => setNewFile({ ...newFile, type: e.target.value as any })}
                    className={`px-4 py-2 rounded-xl font-bold text-sm ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} outline-none`}
                  >
                    <option value="notes">📄 Lecture Notes</option>
                    <option value="recording">🎥 Recording</option>
                    <option value="slides">📊 Slides</option>
                    <option value="manual">📖 Lab Manual</option>
                  </select>
                  
                  <button
                    onClick={handleAddFile}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-xl font-black text-sm uppercase hover:bg-blue-700 transition"
                  >
                    Upload File
                  </button>
                </div>
              </div>
            </div>

            {/* Files List */}
            <div className={`${cardBg} border ${borderColor} rounded-3xl p-6 shadow-xl`}>
              <h2 className="text-xl font-black mb-4 uppercase">Uploaded Files ({files.length})</h2>
              
              {files.length === 0 ? (
                <p className="text-center py-8 opacity-50 text-sm">No files uploaded yet. Add one above!</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {files.map(file => (
                    <div key={file.id} className={`p-4 rounded-2xl border ${borderColor}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-black text-sm">{file.course} - {file.week}</p>
                          <p className="text-xs opacity-50 font-bold uppercase mt-1">
                            {file.type === 'notes' ? '📄 Notes' :
                             file.type === 'recording' ? '🎥 Recording' :
                             file.type === 'slides' ? '📊 Slides' : '📖 Manual'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full mt-2 p-2 bg-blue-600 text-white rounded-lg text-xs font-bold text-center hover:bg-blue-700 transition"
                      >
                        Open File →
                      </a>
                      <p className="text-xs opacity-30 mt-2 text-center">Uploaded: {file.uploadDate}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className={`${cardBg} border ${borderColor} rounded-3xl p-6 shadow-xl`}>
              <h2 className="text-xl font-black mb-4 uppercase">Login Activity</h2>
              
              {loginLogs.length === 0 ? (
                <p className="text-center py-8 opacity-50 text-sm">No login data yet. Students will appear here as they log in.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loginLogs.slice(0, 50).map((log, i) => (
                    <div key={i} className={`p-3 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'} flex justify-between items-center`}>
                      <div>
                        <p className="font-bold text-sm">{log.studentName}</p>
                        <p className="text-xs opacity-50">ID: {log.studentId}</p>
                      </div>
                      <p className="text-xs font-bold opacity-50">{log.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`${cardBg} border ${borderColor} rounded-3xl p-6 shadow-xl`}>
              <h2 className="text-xl font-black mb-4 uppercase">Portal Statistics</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <p className="text-4xl font-black text-green-600 mb-2">{getUniqueLogins()}</p>
                  <p className="text-xs font-bold opacity-50 uppercase">Unique Students</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-black text-blue-600 mb-2">{loginLogs.length}</p>
                  <p className="text-xs font-bold opacity-50 uppercase">Total Logins</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-black text-purple-600 mb-2">
                    {loginLogs.length > 0 ? Math.round((getUniqueLogins() / 117) * 100) : 0}%
                  </p>
                  <p className="text-xs font-bold opacity-50 uppercase">Class Coverage</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
      }
