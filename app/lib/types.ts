// app/lib/types.ts

export interface Theme {
  id: string;
  name: string;
  bgGradient: string;
  orb1: string;
  orb2: string;
  accent: string;
}

export interface FeedbackItem {
  id: string;
  text: string;
  type: "suggestion" | "issue" | "feature";
  author: string;
  timestamp: string;
  likes: number;
}

export interface CourseAttendance {
  [course: string]: number;
}

export interface TimetableEntry {
  time: string;
  course: string;
  venue: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Resource {
  title: string;
  url: string;
  type: string;
  course: string;
}
