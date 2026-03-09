"use client";
// app/components/UltraWidgets.tsx

import React from "react";
import { motion } from "framer-motion";
import { Theme, FeedbackItem, Resource } from "@/lib/types";

// --- GlassCard ---
export const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-4 ${className}`}
  >
    {children}
  </div>
);

// --- StreakWidget ---
export const StreakWidget = ({ streak }: { streak: number }) => (
  <GlassCard className="flex items-center gap-4">
    <div className="text-4xl">🔥</div>
    <div>
      <p className="text-white/60 text-sm">Current Streak</p>
      <p className="text-white text-2xl font-bold">{streak} days</p>
    </div>
  </GlassCard>
);

// --- SmartReminder ---
export const SmartReminder = ({ daysToMidSem }: { daysToMidSem: number }) => (
  <GlassCard>
    <p className="text-white/60 text-sm mb-1">⏰ Mid-Semester Countdown</p>
    {daysToMidSem > 0 ? (
      <p className="text-white font-bold text-lg">{daysToMidSem} days to go — keep pushing! 💪</p>
    ) : daysToMidSem === 0 ? (
      <p className="text-yellow-300 font-bold text-lg">It's Mid-Sem day! Good luck! 🍀</p>
    ) : (
      <p className="text-green-300 font-bold text-lg">Mid-Sem is done! Well done! 🎉</p>
    )}
  </GlassCard>
);

// --- Leaderboard ---
export const Leaderboard = ({
  classList,
  attendance,
}: {
  classList: { [key: string]: string };
  attendance: { [key: string]: number };
}) => {
  const sorted = Object.entries(classList)
    .map(([id, name]) => ({ id, name, score: attendance[id] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <GlassCard>
      <p className="text-white font-bold mb-3">🏆 Top Attendees</p>
      {sorted.map((student, i) => (
        <div key={student.id} className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm w-5">{i + 1}.</span>
            <span className="text-white text-sm">{student.name}</span>
          </div>
          <span className="text-white/60 text-sm">{student.score} pts</span>
        </div>
      ))}
    </GlassCard>
  );
};

// --- AnalyticsDashboard ---
export const AnalyticsDashboard = ({
  attendance,
  courseCredits,
}: {
  attendance: { [key: string]: number };
  courseCredits: { [key: string]: number };
}) => {
  const total = Object.values(attendance).reduce((a, b) => a + b, 0);
  const courses = Object.keys(courseCredits);

  return (
    <GlassCard>
      <p className="text-white font-bold mb-3">📊 Attendance Analytics</p>
      <p className="text-white/60 text-sm mb-2">Total sessions attended: <span className="text-white font-semibold">{total}</span></p>
      <div className="space-y-2">
        {courses.map((course) => (
          <div key={course} className="flex justify-between items-center">
            <span className="text-white/70 text-sm">{course}</span>
            <span className="text-white text-sm font-semibold">{attendance[course] || 0} sessions</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// --- ResourcesList ---
export const ResourcesList = ({ resources }: { resources: Resource[] }) => (
  <GlassCard>
    <p className="text-white font-bold mb-3">📚 Resources</p>
    <div className="space-y-2">
      {resources.map((res, i) => (
        <a
          key={i}
          href={res.url}
          className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          <div>
            <p className="text-white text-sm">{res.title}</p>
            <p className="text-white/40 text-xs">{res.course}</p>
          </div>
          <span className="text-white/40 text-xs uppercase">{res.type}</span>
        </a>
      ))}
    </div>
  </GlassCard>
);

// --- DailyInspiration ---
const QUOTES = [
  "Engineering is the art of directing the great sources of power in nature. 🌿",
  "The scientist discovers a new type of material or energy. The engineer discovers a new use for it. ⚡",
  "To engineer is human. Keep building! 🔧",
  "Biomedical engineers save lives. That's you. 💙",
  "Every expert was once a beginner. Keep going! 🚀",
];

export const DailyInspiration = () => {
  const quote = QUOTES[new Date().getDay() % QUOTES.length];
  return (
    <GlassCard>
      <p className="text-white/60 text-xs mb-1">✨ Daily Inspiration</p>
      <p className="text-white/90 text-sm italic">{quote}</p>
    </GlassCard>
  );
};

// --- FeedbackBoard ---
export const FeedbackBoard = ({
  feedbackList,
  onLike,
}: {
  feedbackList: FeedbackItem[];
  onLike: (id: string) => void;
}) => (
  <GlassCard>
    <p className="text-white font-bold mb-3">💬 Community Feedback</p>
    {feedbackList.length === 0 ? (
      <p className="text-white/40 text-sm">No feedback yet. Be the first!</p>
    ) : (
      <div className="space-y-3">
        {feedbackList.slice(0, 5).map((item) => (
          <div key={item.id} className="p-3 bg-white/5 rounded-xl">
            <div className="flex justify-between items-start mb-1">
              <span className="text-white/60 text-xs capitalize">{item.type}</span>
              <span className="text-white/40 text-xs">{item.author}</span>
            </div>
            <p className="text-white text-sm mb-2">{item.text}</p>
            <button
              onClick={() => onLike(item.id)}
              className="text-white/50 hover:text-white text-xs flex items-center gap-1 transition"
            >
              👍 {item.likes}
            </button>
          </div>
        ))}
      </div>
    )}
  </GlassCard>
);
