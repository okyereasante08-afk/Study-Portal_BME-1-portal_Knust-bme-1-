'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState('today');
  const [showWeekView, setShowWeekView] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto dark mode after 6pm
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) setDarkMode(true);
  }, []);

  // Sample timetable data (will be replaced with parsed PDF data)
  const timetable = {
    Monday: [
      { time: '08:00 - 09:55', course: 'COE 181', name: 'Engineering Workshop Practice', lecturer: 'K.O.K. Sarkodie', location: 'VCR', type: 'Lecture' },
      { time: '10:00 - 11:55', course: 'MATH 171', name: 'Algebra and Trigonometry', lecturer: 'Dr. Mensah', location: 'PB212', type: 'Lecture' },
    ],
    Tuesday: [
      { time: '08:00 - 09:55', course: 'CHEM 151', name: 'General Chemistry', lecturer: 'Prof. Adu', location: 'VSLA', type: 'Lecture' },
      { time: '12:00 - 13:55', course: 'PHYS 151', name: 'Mechanics and Heat', lecturer: 'Dr. Owusu', location: 'PB101', type: 'Lab' },
    ],
    Wednesday: [
      { time: '08:00 - 09:55', course: 'ENGL 157', name: 'Communication Skills', lecturer: 'Mrs. Asante', location: 'VSLA', type: 'Lecture' },
    ],
    Thursday: [
      { time: '10:00 - 11:55', course: 'MATH 172', name: 'Calculus I', lecturer: 'Dr. Boateng', location: 'PB212', type: 'Lecture' },
      { time: '14:00 - 15:55', course: 'COE 181', name: 'Engineering Workshop', lecturer: 'K.O.K. Sarkodie', location: 'Workshop', type: 'Practical' },
    ],
    Friday: [
      { time: '08:00 - 09:55', course: 'CHEM 151', name: 'General Chemistry Lab', lecturer: 'Prof. Adu', location: 'Chem Lab', type: 'Lab' },
    ],
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = days[new Date().getDay() - 1] || 'Monday';
  const todayClasses = timetable[today] || [];

  // Get next class
  const getNextClass = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (const cls of todayClasses) {
      const [startTime] = cls.time.split(' - ');
      const [hours, minutes] = startTime.split(':').map(Number);
      const classMinutes = hours * 60 + minutes;
      
      if (classMinutes > currentMinutes) {
        const diff = classMinutes - currentMinutes;
        const hoursLeft = Math.floor(diff / 60);
        const minsLeft = diff % 60;
        return { ...cls, countdown: `${hoursLeft}h ${minsLeft}m` };
      }
    }
    return null;
  };

  const nextClass = getNextClass();

  const announcements = [
    { date: 'Today', text: 'CHEM 151 Quiz on Friday - Chapter 1-3', type: 'quiz' },
    { date: 'Yesterday', text: 'Lab groups updated - Check WhatsApp', type: 'info' },
    { date: '2 days ago', text: 'MATH 171 Assignment due Monday', type: 'deadline' },
  ];

  const openMap = (location) => {
    const maps = {
      'VCR': 'https://maps.google.com/?q=KNUST+VCR+Hall',
      'PB212': 'https://maps.google.com/?q=KNUST+Physical+Sciences+Building',
      'VSLA': 'https://maps.google.com/?q=KNUST+VSLA+Building',
    };
    window.open(maps[location] || 'https://maps.google.com/?q=KNUST', '_blank');
  };

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold">Biomedical Engineering</h1>
              <p className="text-blue-200 text-sm">Level 100 Student Portal</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          <p className="text-blue-100 text-xs">Kwame Nkrumah University of Science and Technology</p>
          <p className="text-blue-300 text-sm mt-2">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Next Class Card */}
        {nextClass && (
          <div className={`${cardBg} border-2 border-green-500 rounded-xl p-6 mb-6 shadow-lg`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-green-600 font-semibold text-sm mb-1">NEXT CLASS</p>
                <h2 className="text-2xl font-bold">{nextClass.name}</h2>
                <p className="text-gray-500 mt-1">{nextClass.course} • {nextClass.lecturer}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">{nextClass.countdown}</p>
                <p className="text-sm text-gray-500">starts in</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                📍 {nextClass.location}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                🕐 {nextClass.time}
              </span>
              <button
                onClick={() => openMap(nextClass.location)}
                className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition"
              >
                🗺️ Open Map
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4 text-center`}>
            <p className="text-2xl font-bold text-blue-600">85%</p>
            <p className="text-sm text-gray-500">Attendance</p>
          </div>
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4 text-center`}>
            <p className="text-2xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-500">Classes Today</p>
          </div>
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4 text-center`}>
            <p className="text-2xl font-bold text-orange-600">2</p>
            <p className="text-sm text-gray-500">Upcoming Quizzes</p>
          </div>
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4 text-center`}>
            <p className="text-2xl font-bold text-purple-600">5</p>
            <p className="text-sm text-gray-500">Days to Exam</p>
          </div>
        </div>

        {/* Timetable */}
        <div className={`${cardBg} border ${borderColor} rounded-xl p-6 mb-6 shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📅 {showWeekView ? 'Week' : 'Today'}'s Schedule</h2>
            <button
              onClick={() => setShowWeekView(!showWeekView)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              {showWeekView ? 'Show Today' : 'Show Week'}
            </button>
          </div>

          {!showWeekView ? (
            <div className="space-y-3">
              {todayClasses.length > 0 ? (
                todayClasses.map((cls, i) => (
                  <div key={i} className={`border ${borderColor} rounded-lg p-4 hover:shadow-md transition`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{cls.name}</h3>
                        <p className="text-sm text-gray-500">{cls.course} • {cls.lecturer}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cls.type === 'Lecture' ? 'bg-blue-100 text-blue-800' :
                        cls.type === 'Lab' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {cls.type}
                      </span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-gray-600">🕐 {cls.time}</span>
                      <span className="text-gray-600">📍 {cls.location}</span>
                      <button
                        onClick={() => openMap(cls.location)}
                        className="ml-auto text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Map →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No classes today! 🎉</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {days.map(day => (
                <div key={day}>
                  <h3 className="font-bold mb-2 text-blue-600">{day}</h3>
                  <div className="space-y-2 ml-4">
                    {timetable[day]?.map((cls, i) => (
                      <div key={i} className="text-sm border-l-2 border-blue-300 pl-3 py-1">
                        <p className="font-medium">{cls.time} - {cls.name}</p>
                        <p className="text-gray-500 text-xs">{cls.location} • {cls.lecturer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Announcements */}
          <div className={`${cardBg} border ${borderColor} rounded-xl p-6 shadow-lg`}>
            <h2 className="text-xl font-bold mb-4">📢 Announcements</h2>
            <div className="space-y-3">
              {announcements.map((ann, i) => (
                <div key={i} className={`border-l-4 ${
                  ann.type === 'quiz' ? 'border-orange-500' :
                  ann.type === 'deadline' ? 'border-red-500' :
                  'border-blue-500'
                } pl-3 py-2`}>
                  <p className="text-sm font-medium">{ann.text}</p>
                  <p className="text-xs text-gray-500">{ann.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`${cardBg} border ${borderColor} rounded-xl p-6 shadow-lg`}>
            <h2 className="text-xl font-bold mb-4">⚡ Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                💬 Class WhatsApp
              </button>
              <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                📚 Resources
              </button>
              <button className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                📊 GPA Calculator
              </button>
              <button className="p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
                ⏱️ Study Timer
              </button>
            </div>
          </div>
        </div>

        {/* Missed Classes */}
        <div className={`${cardBg} border ${borderColor} rounded-xl p-6 shadow-lg`}>
          <h2 className="text-xl font-bold mb-4">📖 Missed a Class?</h2>
          <p className="text-gray-500 mb-4">Access lecture notes, recordings, and slides here.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border ${borderColor} rounded-lg p-4">
              <p className="font-medium mb-2">CHEM 151 - Week 3</p>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-600 hover:underline">📄 Lecture Notes</a>
                <a href="#" className="block text-blue-600 hover:underline">🎥 Recording</a>
              </div>
            </div>
            <div className="border ${borderColor} rounded-lg p-4">
              <p className="font-medium mb-2">MATH 171 - Week 3</p>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-600 hover:underline">📄 Slides</a>
                <a href="#" className="block text-blue-600 hover:underline">📝 Problem Set</a>
              </div>
            </div>
            <div className="border ${borderColor} rounded-lg p-4">
              <p className="font-medium mb-2">PHYS 151 - Week 2</p>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-600 hover:underline">📄 Lab Manual</a>
                <a href="#" className="block text-blue-600 hover:underline">🎥 Demo Video</a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-12">
        <p className="text-sm">Department of Biomedical Engineering</p>
        <p className="text-xs text-gray-500">College of Engineering • KNUST • 2024/2025 Academic Year</p>
      </footer>
    </div>
  );
}
