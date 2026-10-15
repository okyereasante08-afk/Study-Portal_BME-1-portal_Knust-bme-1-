// Shared types for the BME Study Portal

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
export type YearLevel = 1 | 2 | 3 | 4;
export type SessionType = "Lecture" | "Lab" | "Tutorial";

export interface Course {
  code: string;      // e.g. "MATH 152"
  name: string;      // e.g. "Calculus"
  credits: number;
}

export interface Session {
  id: string;
  day: Day;
  start: string;     // 24h "HH:MM"
  end: string;       // 24h "HH:MM"
  course: string;    // must match a Course.code
  group?: string;    // e.g. "A" for MATH 152 A
  venue: string;
  lecturer?: string;
  type: SessionType;
}

export interface KitResource { label: string; url: string }
export interface KitSection {
  course: string;
  emoji: string;
  color: string;
  resources: KitResource[];
}

export type FileKind = "slides" | "notes" | "manual" | "past-questions" | "recording" | "other";
export interface SharedFile {
  id: string;
  title: string;
  course: string;    // course code, or "General"
  kind: FileKind;
  url: string;
  added?: string;    // ISO date, optional
}

export type AnnouncementType = "info" | "quiz" | "deadline" | "urgent";
export interface Announcement {
  id: string;
  text: string;
  type: AnnouncementType;
  date: string;      // ISO date
}

export interface Semester {
  id: string;        // used to namespace saved attendance, so a new semester starts fresh
  label: string;     // shown in the UI
  start: string;     // ISO date (first day of lectures)
  end: string;       // ISO date (last day counted)
  midsem?: [string, string];
  exams?: [string, string];
  /** Date ranges (inclusive) with no lectures: mid-sems, exams, breaks. */
  breaks: [string, string][];
}

export interface YearConfig {
  level: YearLevel;
  levelCode: string; // "100"
  title: string;     // "Year 1"
  tagline: string;
  semester: Semester;
  courses: Course[];
  timetable: Session[];
  kit: KitSection[];
  files: SharedFile[];
  slidesFolderUrl?: string;
  announcements: Announcement[];
  community?: { label: string; url: string };
}

export type StyleId = "classic" | "brutalist" | "clay";
export type ModeId = "light" | "dark";
