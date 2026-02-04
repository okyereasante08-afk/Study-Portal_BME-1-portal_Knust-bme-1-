// Type definitions for BME Student Portal Ultra

export interface Student {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  time: string;
  course: string;
  venue: string;
  lecturer: string;
  type: 'Lecture' | 'Lab';
}

export interface Timetable {
  [day: string]: Course[];
}

export interface Theme {
  id: 'ocean' | 'forest' | 'sunset' | 'purple';
  name: string;
  primary: string;
  accent: string;
  bgGradient: string;
  orb1: string;
  orb2: string;
}

export interface AttendanceRecord {
  [courseId: string]: number;
}

export interface Announcement {
  id: string;
  text: string;
  date: string;
  type: 'urgent' | 'quiz' | 'deadline' | 'general';
  timestamp?: number;
}

export interface SharedFile {
  id: string;
  course: string;
  week: string;
  type: 'notes' | 'recording' | 'slides' | 'manual';
  url: string;
  uploadedAt?: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  attendanceScore: number;
  badges: string[];
  id: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (data: AchievementData) => boolean;
}

export interface AchievementData {
  streak: number;
  cwaUsage: number;
  attendanceCount: number;
  hasEarlyCheckIn: boolean;
}

export interface FeedbackItem {
  id: string;
  text: string;
  type: 'suggestion' | 'issue' | 'feature';
  votes: number;
  date: string;
  author?: string;
}

export interface QuoteItem {
  text: string;
  author?: string;
}

export interface TriviaItem {
  subject: string;
  content: string;
}
export interface Theme {
  id: string;
  name: string;
  primary: string;
  bgGradient: string;
  orb1: string;
  orb2: string;
}

export interface FeedbackItem {
  id: string;
  text: string;
  type: 'suggestion' | 'issue' | 'feature';
  votes: number;
  date: string;
}
