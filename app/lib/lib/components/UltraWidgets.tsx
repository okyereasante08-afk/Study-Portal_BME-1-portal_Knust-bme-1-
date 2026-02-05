"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Clock, 
  MapPin, 
  Trophy, 
  BarChart2,
  FileText,
  Video,
  Download,
  Lightbulb,
  Quote,
  MessageSquare,
  ThumbsUp,
  Plus
} from 'lucide-react';
import { TIMETABLE, CLASS_LIST, QUOTES, TRIVIA } from '@/lib/constants';
import { Theme, LeaderboardEntry, SharedFile, FeedbackItem } from '@/lib/types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Shared Components ---

export const GlassCard = ({ children, className = "", delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

// --- Helper for Time Calc ---
const calculateDuration = (timeStr: string): number => {
    try {
        const [start, end] = timeStr.split(' - ');
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        // Calculate diff in hours
        let diff = (eh + em/60) - (sh + sm/60);
        if (diff < 0) diff += 24; // Handle overnight if necessary, though unlikely for classes
        return diff;
    } catch (e) {
        return 0;
    }
};

// --- Streak Tracker (Feature 2) ---

export const StreakWidget = ({ currentTheme, streak }: { currentTheme: Theme, streak: number }) => {
  const getFlameConfig = (s: number) => {
    if (s >= 50) return { 
        color: '#d946ef', // Fuschia/Pink
        msg: 'COSMIC', 
        shadow: 'shadow-[0_0_30px_rgba(217,70,239,0.5)]',
        animate: { 
            scale: [1, 1.2, 1.1, 1.3, 1],
            filter: ["hue-rotate(0deg)", "hue-rotate(45deg)", "hue-rotate(0deg)"]
        }
    };
    if (s >= 30) return { 
        color: '#8b5cf6', // Violet
        msg: 'MYSTIC', 
        shadow: 'shadow-[0_0_25px_rgba(139,92,246,0.5)]',
        animate: { 
            scale: [1, 1.15, 1],
            filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
        }
    };
    if (s >= 14) return { 
        color: '#3b82f6', // Blue
        msg: 'PLASMA', 
        shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
        animate: { 
            y: [0, -5, 0],
            scale: [1, 1.1, 1]
        }
    };
    if (s >= 7) return { 
        color: '#10b981', // Emerald
        msg: 'WILDFIRE', 
        shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
        animate: { 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
        }
    };
    if (s >= 3) return { 
        color: '#f59e0b', // Amber/Gold
        msg: 'BLAZE', 
        shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
        animate: { 
            y: [0, -3, 0]
        }
    };
    return { 
        color: '#ef4444', // Red
        msg: 'SPARK', 
        shadow: 'shadow-none',
        animate: {} 
    };
  };

  const config = getFlameConfig(streak);

  return (
    <GlassCard className="p-6 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 opacity-10 transition-colors duration-1000">
            <Flame size={120} color={config.color} />
        </div>
        <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full bg-white/5 relative border border-white/10 ${config.shadow} transition-all duration-1000`}>
                <motion.div
                    animate={config.animate}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Flame size={32} color={config.color} fill={config.color} className="drop-shadow-md" />
                </motion.div>
            </div>
            <div>
                <h3 className="text-3xl font-black text-white flex items-baseline gap-2">
                    {streak} 
                    <span 
                        className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 font-bold uppercase tracking-wider transition-colors duration-500"
                        style={{ color: config.color, borderColor: `${config.color}33` }}
                    >
                        {config.msg}
                    </span>
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Attendance Streak</p>
                <p className="text-[10px] font-bold mt-1 transition-colors duration-500" style={{ color: config.color }}>
                    {streak > 0 ? `🔥 The fire is turning ${config.color === '#ef4444' ? 'hot' : 'hotter'}!` : "Mark attendance to start!"}
                </p>
            </div>
        </div>
    </GlassCard>
  );
};

// --- Smart Reminders (Feature 3) ---

export const SmartReminder = ({ currentTheme }: { currentTheme: Theme }) => {
  const [status, setStatus] = useState<{msg: string, color: string, timeDisplay: string, course: string, venue: string} | null>(null);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()];
      const courses = TIMETABLE[dayName] || [];
      
      let nextCourse = null;
      let minDiff = Infinity;

      for (let c of courses) {
        const [startStr] = c.time.split(' - ');
        const [h, m] = startStr.split(':').map(Number);
        const startTime = new Date(now);
        startTime.setHours(h, m, 0);

        const diff = (startTime.getTime() - now.getTime()) / 60000; // diff in minutes

        if (diff > -15 && diff < minDiff) { 
            minDiff = diff;
            nextCourse = c;
        }
      }

      if (nextCourse) {
        let timeDisplay = "";
        
        if (minDiff < 0) {
           timeDisplay = "Started " + Math.abs(Math.floor(minDiff)) + "m ago";
           setStatus({ msg: "YOU'RE LATE!", color: "text-red-500", timeDisplay, course: nextCourse.course, venue: nextCourse.venue });
        } else if (minDiff <= 60) {
            // Precise countdown for next hour
            const seconds = Math.floor((minDiff * 60) % 60);
            const minutes = Math.floor(minDiff);
            timeDisplay = `${minutes}m ${seconds}s`;
            
            if (minDiff <= 10) {
                setStatus({ msg: "HURRY UP!", color: "text-red-400", timeDisplay, course: nextCourse.course, venue: nextCourse.venue });
            } else if (minDiff <= 30) {
                setStatus({ msg: "GET READY", color: "text-yellow-400", timeDisplay, course: nextCourse.course, venue: nextCourse.venue });
            } else {
                setStatus({ msg: "UPCOMING", color: "text-emerald-400", timeDisplay, course: nextCourse.course, venue: nextCourse.venue });
            }
        } else {
           timeDisplay = "Starts in " + Math.floor(minDiff/60) + "h " + Math.floor(minDiff%60) + "m";
           setStatus({ msg: "UPCOMING", color: "text-emerald-400", timeDisplay, course: nextCourse.course, venue: nextCourse.venue });
        }
      } else {
          setStatus(null);
      }
    };

    checkTime();
    // Update every second for countdown effect
    const timer = setInterval(checkTime, 1000); 
    return () => clearInterval(timer);
  }, []);

  if (!status) return (
      <GlassCard className="p-6 flex items-center justify-center opacity-50">
          <p className="text-xs font-bold uppercase">No upcoming classes today</p>
      </GlassCard>
  );

  return (
    <GlassCard className="p-6 relative overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 w-2 ${status.color.replace('text', 'bg')}`} />
        <div className="flex justify-between items-start pl-4">
            <div>
                <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${status.color} animate-pulse`}>
                    <Clock size={12} className="inline mr-1" /> {status.msg}
                </div>
                <h3 className="text-xl font-black text-white">{status.course}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs opacity-60 font-bold">
                    <MapPin size={12} /> {status.venue}
                </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-white tabular-nums">{status.timeDisplay}</p>
                <p className="text-[10px] opacity-40 uppercase">Countdown</p>
            </div>
        </div>
    </GlassCard>
  );
};

// --- Daily Inspiration & Trivia (New Feature) ---

export const DailyInspiration = ({ currentTheme }: { currentTheme: Theme }) => {
    const [quote, setQuote] = useState("");
    const [trivia, setTrivia] = useState<{subject: string, content: string} | null>(null);

    useEffect(() => {
        // Pick random items on mount
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        const randomTrivia = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
        setQuote(randomQuote);
        setTrivia(randomTrivia);
    }, []);

    if (!trivia) return null;

    return (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
             <GlassCard className="p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-10">
                    <Quote size={64} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3 flex items-center gap-2">
                    <Quote size={12} style={{color: currentTheme.primary}} /> Daily Motivation
                </h4>
                <p className="text-sm font-bold italic text-white/90 leading-relaxed">"{quote}"</p>
             </GlassCard>

             <GlassCard className="p-6 relative overflow-hidden">
                 <div className="absolute top-4 right-4 opacity-10">
                    <Lightbulb size={64} />
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3 flex items-center gap-2">
                     <Lightbulb size={12} style={{color: currentTheme.primary}} /> Brain Spark • {trivia.subject}
                 </h4>
                 <p className="text-sm font-medium text-white/90 leading-relaxed">{trivia.content}</p>
             </GlassCard>
        </div>
    );
};


// --- Leaderboard (Feature 1) ---

export const Leaderboard = ({ currentTheme, myId }: { currentTheme: Theme, myId: string }) => {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        // 1. Get real user score
        const userAtt = JSON.parse(localStorage.getItem('bme-attendance') || '{}');
        const myScore = Object.values(userAtt).reduce((a: any, b: any) => a + b, 0) as number;

        // 2. Generate list. Since we don't have a backend to get other users' real-time scores,
        // we display the list of students with score 0 (except the current user).
        
        const allStudents = Object.entries(CLASS_LIST).map(([id, name]) => {
            return {
                id,
                name,
                // If it's me, use my real score, otherwise 0
                attendanceScore: id === myId ? myScore : 0,
                badges: id === myId && myScore > 10 ? ["🏆"] : [],
                rank: 0
            };
        });

        // 3. Sort by Score (Desc), then Name (Asc)
        allStudents.sort((a, b) => {
            if (b.attendanceScore !== a.attendanceScore) {
                return b.attendanceScore - a.attendanceScore;
            }
            return a.name.localeCompare(b.name);
        });

        // 4. Take top 10
        const top10 = allStudents.slice(0, 10).map((s, i) => ({...s, rank: i + 1}));
        setLeaders(top10);

    }, [myId]);

    return (
        <div className="mt-8">
            <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
                <Trophy className={`text-[${currentTheme.primary}]`} /> Attendance Leaderboard
            </h3>
            <div className="space-y-3">
                {leaders.map((student: any) => (
                    <div key={student.rank} className={`flex items-center p-4 rounded-2xl border ${student.id === myId ? `bg-[${currentTheme.primary}]/20 border-[${currentTheme.primary}]` : 'bg-white/5 border-white/5'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm mr-4 ${student.rank <= 3 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}>
                            {student.rank}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-white flex items-center gap-2">
                                {student.name}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="font-black text-white">{student.attendanceScore}</span>
                            <span className="text-[10px] opacity-50 block uppercase">Classes</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Feedback Board (New Feature) ---

export const FeedbackBoard = ({ currentTheme, feedbackList, onUpvote, onRequestPost }: { 
    currentTheme: Theme, 
    feedbackList: FeedbackItem[], 
    onUpvote: (id: string) => void,
    onRequestPost: () => void
}) => {
    return (
        <div className="mt-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black uppercase flex items-center gap-2">
                    <MessageSquare className={`text-[${currentTheme.primary}]`} /> Community Feedback
                </h3>
                <button 
                  onClick={onRequestPost}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase transition-all flex items-center gap-2"
                >
                    <Plus size={14} /> Post
                </button>
             </div>
             
             {feedbackList.length === 0 ? (
                 <GlassCard className="p-8 text-center opacity-50 italic">
                     No feedback or suggestions yet. Be the first to post!
                 </GlassCard>
             ) : (
                 <div className="space-y-4">
                     {feedbackList.map(item => (
                         <GlassCard key={item.id} className="p-6">
                             <div className="flex justify-between items-start mb-3">
                                 <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-lg bg-white/5 border border-white/5 ${
                                     item.type === 'issue' ? 'text-red-400' : item.type === 'feature' ? 'text-purple-400' : 'text-blue-400'
                                 }`}>
                                     {item.type}
                                 </span>
                                 <span className="text-[10px] opacity-40 font-mono">{item.date}</span>
                             </div>
                             <p className="text-sm font-medium text-slate-200 leading-relaxed mb-4">"{item.text}"</p>
                             <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <span className="text-[10px] opacity-30 uppercase font-bold">Anonymous User</span>
                                <button 
                                  onClick={() => onUpvote(item.id)}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <ThumbsUp size={14} className={item.votes > 0 ? `text-[${currentTheme.primary}]` : 'text-slate-500'} />
                                    <span className="text-xs font-bold">{item.votes}</span>
                                </button>
                             </div>
                         </GlassCard>
                     ))}
                 </div>
             )}
        </div>
    );
};

// --- Analytics (Feature 5) ---

export const AnalyticsDashboard = ({ currentTheme, attendance }: { currentTheme: Theme, attendance: {[key: string]: number} }) => {
    const [stats, setStats] = useState({
        chartData: [] as any[],
        totalHours: 0,
        classesAttended: 0,
        completionRate: 0,
        prediction: "Keep working!"
    });

    useEffect(() => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        let totalH = 0;
        let totalC = 0;
        
        // Calculate total weekly slots for context (simple approximation of "100%" being one full perfect week)
        const weeklySlotsCount = Object.values(TIMETABLE).reduce((acc, courses) => acc + courses.length, 0);

        const chartData = days.map(day => {
            const dayCourses = TIMETABLE[day] || [];
            let dayAttendedCount = 0;

            dayCourses.forEach(course => {
                const count = attendance[course.id] || 0;
                if (count > 0) {
                    dayAttendedCount += count;
                    const duration = calculateDuration(course.time);
                    totalH += (duration * count);
                    totalC += count;
                }
            });

            return {
                name: day.substring(0, 3), 
                attended: dayAttendedCount,
                // Make the 'total' bar effectively invisible or scaled to the user's max to keep chart looking good
                // Or just show attended. We'll leave the comparison bar empty/same color for now.
                total: dayAttendedCount 
            };
        });

        let prediction = "Start attending classes!";
        if (totalH > 50) prediction = "First Class Honours 🏆";
        else if (totalH > 20) prediction = "Second Class Upper 📈";
        else if (totalH > 5) prediction = "On Track 👍";
        
        // Cap rate at 100% per week "cycle" visually, or let it overflow if they have history
        const completionRate = Math.min(100, Math.round((totalC / weeklySlotsCount) * 100));

        setStats({
            chartData,
            totalHours: parseFloat(totalH.toFixed(1)),
            classesAttended: totalC,
            completionRate,
            prediction
        });

    }, [attendance]);

    return (
        <div className="mt-8 grid md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
                <h3 className="text-sm font-black uppercase mb-6 flex items-center gap-2">
                    <BarChart2 size={16} /> Attendance History
                </h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chartData}>
                            <XAxis dataKey="name" tick={{fill: 'white', fontSize: 10}} axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px'}} 
                                itemStyle={{color: currentTheme.primary}}
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            />
                            <Bar dataKey="attended" radius={[4, 4, 0, 0]}>
                                {stats.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={currentTheme.primary} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col justify-center">
                 <h3 className="text-sm font-black uppercase mb-4">Performance Metrics</h3>
                 <div className="space-y-4">
                     <div>
                         <div className="flex justify-between text-xs font-bold mb-1">
                             <span className="opacity-60">Total Classes</span>
                             <span className="text-emerald-400">{stats.classesAttended}</span>
                         </div>
                         <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                             <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{width: `${stats.completionRate}%`}}></div>
                         </div>
                     </div>
                     <div>
                         <div className="flex justify-between text-xs font-bold mb-1">
                             <span className="opacity-60">Study Hours</span>
                             <span style={{ color: currentTheme.primary }}>{stats.totalHours} hrs</span>
                         </div>
                         <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                             <div className="bg-white h-full rounded-full opacity-50 transition-all duration-1000" style={{width: `${Math.min(100, stats.totalHours * 2)}%`}}></div>
                         </div>
                     </div>
                     <div className="p-3 rounded-xl bg-white/5 border border-white/5 mt-2">
                         <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Prediction</p>
                         <p className="text-xs text-white">{stats.prediction}</p>
                     </div>
                 </div>
            </GlassCard>
        </div>
    );
};

// --- Resources (Feature 15) ---

export const ResourcesList = ({ files, currentTheme }: { files: SharedFile[], currentTheme: Theme }) => {
    return (
        <div className="mt-8 grid gap-4">
             {files.map(file => (
                 <GlassCard key={file.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-[${currentTheme.primary}]/10 text-[${currentTheme.primary}]`}>
                            {file.type === 'recording' ? <Video size={20}/> : <FileText size={20}/>}
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">{file.course}</h4>
                            <p className="text-[10px] opacity-50 uppercase">{file.week} • {file.type}</p>
                        </div>
                    </div>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <Download size={16} />
                    </button>
                 </GlassCard>
             ))}
        </div>
    )
}
