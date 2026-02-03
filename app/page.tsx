'use client';

import { useState, useEffect } from 'react';
import { Outfit } from 'next/font/google';

// Youthful, modern font
const outfit = Outfit({ subsets: ['latin'] });

// --- DATA TYPES ---
type ClassSession = {
  time: string;
  course: string;
  venue: string;
  lecturer: string;
  type: 'Lecture' | 'Lab' | 'Practical';
};

type TimetableData = {
  [key: string]: ClassSession[];
};

type CourseCredit = {
  code: string;
  name: string;
  credits: number;
};

// --- REAL DATA FROM YOUR PDFS ---
const COURSE_CREDITS: CourseCredit[] = [
  { code: 'MATH 151', name: 'Algebra', credits: 4 },
  { code: 'BME 161', name: 'Cell Biology', credits: 3 },
  { code: 'EE 151', name: 'Applied Electricity', credits: 3 },
  { code: 'ME 161', name: 'Basic Mechanics', credits: 3 },
  { code: 'CHEM 151', name: 'General Chemistry', credits: 2 },
  { code: 'COE 153', name: 'Engineering Tech', credits: 2 },
  { code: 'ENGL 157', name: 'Comm. Skills I', credits: 2 },
];

const TIMETABLE: TimetableData = {
  Monday: [
    { time: '08:00 - 09:55', course: 'COE 181', venue: 'VCR', lecturer: 'K.O.K. Sarkodie', type: 'Lecture' },
    { time: '10:30 - 12:25', course: 'CHEM 151', venue: 'PB212', lecturer: 'L. Sarpong', type: 'Lecture' },
    { time: '13:00 - 14:55', course: 'FREE', venue: '-', lecturer: '-', type: 'Lecture' },
    { time: '15:00 - 16:55', course: 'FREE', venue: '-', lecturer: '-', type: 'Lecture' },
    { time: '17:00 - 17:55', course: 'ENGL 157', venue: 'ENG AUDIT', lecturer: 'P.O Yeboah', type: 'Lecture' },
  ],
  Tuesday: [
    { time: '08:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo/G.S. Klogo', type: 'Lab' },
  ],
  Wednesday: [
    { time: '08:00 - 09:55', course: 'MATH 151 A', venue: 'VSLA', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture' },
    { time: '13:00 - 13:55', course: 'COE 181', venue: '303', lecturer: 'K.O.K Sarkodie', type: 'Lecture' },
  ],
  Thursday: [
    { time: '08:00 - 08:55', course: 'ME 161', venue: 'A110', lecturer: 'K.O Amoabeng', type: 'Lecture' },
    { time: '09:00 - 09:55', course: 'ME 161', venue: 'A110', lecturer: 'K.O Amoabeng', type: 'Lecture' },
    { time: '10:30 - 12:25', course: 'FREE', venue: '-', lecturer: '-', type: 'Lecture' },
    { time: '13:00 - 14:55', course: 'MATH 151 B', venue: 'PB020', lecturer: 'J. K. K. ASAMOAH', type: 'Lecture' },
    { time: '15:00 - 16:55', course: 'BME 161', venue: 'PB008', lecturer: 'P. Adjei', type: 'Lecture' },
  ],
  Friday: [
    // Fridays are often for Labs or Tutorials - Check your specific Group Assignment
    { time: '10:30 - 12:25', course: 'COE 153', venue: 'LAB', lecturer: 'D. A Addo', type: 'Lab' },
    { time: '13:00 - 14:55', course: 'COE 153', venue: 'LAB', lecturer: 'G.S. Klogo', type: 'Lab' },
  ],
};

     
