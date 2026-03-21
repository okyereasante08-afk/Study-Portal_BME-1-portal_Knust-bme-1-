"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, MessageCircle, Zap, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

// ── CONFIG — fill in after Supabase setup ──────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xkrrbuoxgkusbensdtqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrcnJidW94Z2t1c2JlbnNkdHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjUyMDksImV4cCI6MjA4OTYwMTIwOX0.1je5yDEolgYN9b3u4omiFDCKa7OuNX8t48K1ujQuRno';

// ── CONSTANTS ──────────────────────────────────────────────────
const COURSES = [
  { id: 'MATH151', label: 'MATH 151', color: '#60a5fa' },
  { id: 'BME161',  label: 'BME 161',  color: '#34d399' },
  { id: 'EE151',   label: 'EE 151',   color: '#fbbf24' },
  { id: 'ME161',   label: 'ME 161',   color: '#f97316' },
  { id: 'CHEM151', label: 'CHEM 151', color: '#a78bfa' },
  { id: 'ENGL157', label: 'ENGL 157', color: '#fb7185' },
];

const COE_TAGS = ['HTML', 'Arduino', 'SolidWorks', 'Networking', 'KiCad', 'PowerLab'];

const STATUS_CONFIG: Record<string, { color: string; glow: string; label: string }> = {
  lofi:     { color: '#a855f7', glow: 'rgba(168,85,247,0.6)',  label: 'In LoFi' },
  studying: { color: '#00d4ff', glow: 'rgba(0,212,255,0.6)',   label: 'Studying' },
  online:   { color: '#34d399', glow: 'rgba(52,211,153,0.5)',  label: 'Online' },
  offline:  { color: '#374151', glow: 'rgba(55,65,81,0.3)',    label: 'Offline' },
};

// Cluster centres for each course (spread across canvas %)
const CLUSTER_POS: Record<string, { x: number; y: number }> = {
  MATH151: { x: 0.2,  y: 0.25 },
  BME161:  { x: 0.75, y: 0.2  },
  EE151:   { x: 0.15, y: 0.7  },
  ME161:   { x: 0.8,  y: 0.72 },
  CHEM151: { x: 0.5,  y: 0.15 },
  ENGL157: { x: 0.5,  y: 0.82 },
  COE153:  { x: 0.5,  y: 0.5  },
};

// ── TYPES ──────────────────────────────────────────────────────
type Profile = {
  student_id: string;
  name: string;
  bio: string;
  whatsapp: string;
  strengths: string[];
};

type Presence = {
  student_id: string;
  status: 'online' | 'studying' | 'lofi' | 'offline';
  last_seen: string;
};

type Node = {
  id: string;
  name: string;
  bio: string;
  whatsapp: string;
  strengths: string[];
  status: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  r: number;
  pulse: number;
};

// ── SUPABASE HELPERS ───────────────────────────────────────────
async function sbFetch(path: string, opts?: RequestInit) {
  if (!SUPABASE_URL) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(opts?.headers || {}),
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getProfiles(): Promise<Profile[]> {
  return await sbFetch('profiles?select=*') || [];
}

async function getPresence(): Promise<Presence[]> {
  return await sbFetch('presence?select=*') || [];
}

async function upsertProfile(p: Partial<Profile> & { student_id: string }) {
  return sbFetch('profiles', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ ...p, updated_at: new Date().toISOString() }),
  });
}

async function upsertPresence(student_id: string, status: string) {
  return sbFetch('presence', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ student_id, status, last_seen: new Date().toISOString() }),
  });
}

// ── MAIN PAGE ──────────────────────────────────────────────────
export default function BrainMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [counts, setCounts] = useState({ online: 0, studying: 0, lofi: 0, total: 0 });

  // Current user from localStorage
  const [myID, setMyID] = useState('');
  const [myName, setMyName] = useState('');
  const [myProfile, setMyProfile] = useState<Partial<Profile>>({});

  // Setup form state
  const [bio, setBio] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Load current user
  useEffect(() => {
    const id = localStorage.getItem('bme-session-id') || '';
    const name = id ? (localStorage.getItem('bme-name') || '') : '';
    setMyID(id);
    setMyName(name);
    if (id) upsertPresence(id, 'online');
  }, []);

  // Load all profiles + presence and build nodes
  const loadData = useCallback(async () => {
    const [profiles, presenceList] = await Promise.all([getProfiles(), getPresence()]);
    const presenceMap: Record<string, string> = {};
    presenceList.forEach((p: Presence) => { presenceMap[p.student_id] = p.status; });

    const W = window.innerWidth, H = window.innerHeight;

    const newNodes: Node[] = profiles.map((p: Profile) => {
      const existing = nodesRef.current.find(n => n.id === p.student_id);
      const primaryStrength = p.strengths?.[0] || 'COE153';
      const cluster = CLUSTER_POS[primaryStrength] || CLUSTER_POS['COE153'];
      const tx = cluster.x * W + (Math.random() - 0.5) * 120;
      const ty = cluster.y * H + (Math.random() - 0.5) * 120;
      return {
        id: p.student_id,
        name: p.name,
        bio: p.bio || '',
        whatsapp: p.whatsapp || '',
        strengths: p.strengths || [],
        status: presenceMap[p.student_id] || 'offline',
        x: existing?.x ?? tx,
        y: existing?.y ?? ty,
        vx: existing?.vx ?? (Math.random() - 0.5) * 0.3,
        vy: existing?.vy ?? (Math.random() - 0.5) * 0.3,
        targetX: tx,
        targetY: ty,
        r: p.student_id === myID ? 10 : 7,
        pulse: Math.random() * Math.PI * 2,
      };
    });

    nodesRef.current = newNodes;

    // Update counts
    const online = newNodes.filter(n => n.status === 'online').length;
    const studying = newNodes.filter(n => n.status === 'studying').length;
    const lofi = newNodes.filter(n => n.status === 'lofi').length;
    setCounts({ online, studying, lofi, total: newNodes.length });
  }, [myID]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [loadData]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });

    const onClick = (e: MouseEvent) => {
      const mx = e.clientX, my = e.clientY;
      const hit = nodesRef.current.find(n => Math.hypot(n.x - mx, n.y - my) < n.r + 12);
      setSelectedNode(hit || null);
    };
    canvas.addEventListener('click', onClick);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Deep space background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#060a14');
      bg.addColorStop(1, '#03060f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Draw cluster labels
      COURSES.forEach(c => {
        const pos = CLUSTER_POS[c.id];
        if (!pos) return;
        ctx.font = '500 11px sans-serif';
        ctx.fillStyle = `${c.color}30`;
        ctx.textAlign = 'center';
        ctx.fillText(c.label.toUpperCase(), pos.x * W, pos.y * H - 40);
      });

      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const nodes = nodesRef.current;

      // Update physics
      nodes.forEach(n => {
        n.pulse += 0.025;

        // Attract to cluster target
        const toTx = n.targetX - n.x, toTy = n.targetY - n.y;
        n.vx += toTx * 0.0008;
        n.vy += toTy * 0.0008;

        // Mouse repulsion
        const dx = n.x - mx, dy = n.y - my, d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) {
          n.vx += (dx / d) * (120 - d) * 0.003;
          n.vy += (dy / d) * (120 - d) * 0.003;
        }

        // Node-node repulsion
        nodes.forEach(o => {
          if (o === n) return;
          const dx2 = n.x - o.x, dy2 = n.y - o.y, d2 = Math.hypot(dx2, dy2);
          if (d2 < 28 && d2 > 0) {
            n.vx += (dx2 / d2) * 0.4;
            n.vy += (dy2 / d2) * 0.4;
          }
        });

        n.vx *= 0.92; n.vy *= 0.92;
        n.x = Math.max(20, Math.min(W - 20, n.x + n.vx));
        n.y = Math.max(20, Math.min(H - 20, n.y + n.vy));
      });

      // Draw connections between same-strength nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const shared = a.strengths.filter(s => b.strengths.includes(s));
          if (shared.length === 0) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 160) continue;
          const course = COURSES.find(c => c.id === shared[0]);
          const alpha = (1 - d / 160) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = course ? `${course.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}` : `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const isFiltered = filter && !n.strengths.includes(filter);
        const isMe = n.id === myID;
        const cfg = STATUS_CONFIG[n.status] || STATUS_CONFIG.offline;
        const isSelected = selectedNode?.id === n.id;
        const opacity = isFiltered ? 0.15 : 1;

        ctx.globalAlpha = opacity;

        // Outer glow
        const glowR = n.r + 6 + (isSelected ? 6 : 0) + Math.sin(n.pulse) * 2;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR * 2.5);
        grad.addColorStop(0, cfg.glow);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + (isSelected ? 4 : 0), 0, Math.PI * 2);
        ctx.fillStyle = cfg.color;
        ctx.fill();

        // "Me" ring
        if (isMe) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff60';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Name label
        if (!isFiltered) {
          ctx.font = `${isMe ? '600' : '400'} 10px sans-serif`;
          ctx.fillStyle = isMe ? '#ffffff' : '#ffffff90';
          ctx.textAlign = 'center';
          ctx.fillText(n.name.split(' ')[0], n.x, n.y + n.r + 14);
        }

        ctx.globalAlpha = 1;
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      canvas.removeEventListener('click', onClick);
    };
  }, [myID, filter, selectedNode]);

  // Save profile
  const handleSave = async () => {
    if (!myID) return;
    setSaving(true);
    await upsertProfile({ student_id: myID, name: myName, bio, whatsapp, strengths });
    await upsertPresence(myID, 'online');
    setMyProfile({ bio, whatsapp, strengths });
    setSaving(false);
    setShowSetup(false);
    loadData();
  };

  const toggleStrength = (s: string) => {
    setStrengths(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div className="fixed inset-0 bg-[#060a14] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
            <ArrowLeft size={13} /> Portal
          </Link>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white font-black text-sm">BME1 Brain Map</p>
            <p className="text-white/30 text-[9px] uppercase tracking-widest">
              {counts.total} people · {counts.online + counts.studying + counts.lofi} online now
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live status pills */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { status: 'lofi', icon: '🎵', count: counts.lofi },
              { status: 'studying', icon: '📖', count: counts.studying },
              { status: 'online', icon: '●', count: counts.online },
            ].map(({ status, icon, count }) => (
              <div key={status} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                <span className="text-[10px]">{icon}</span>
                <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{count} {status}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowSetup(true)}
            className="px-4 py-2 bg-[#00d4ff] text-[#060a14] rounded-xl text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform">
            My Node
          </button>
        </div>
      </div>

      {/* COURSE FILTER BAR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 flex-wrap justify-center px-4">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${!filter ? 'bg-white text-[#060a14] border-white' : 'bg-white/5 border-white/15 text-white/40 hover:border-white/30'}`}>
          All
        </button>
        {COURSES.map(c => (
          <button key={c.id}
            onClick={() => setFilter(filter === c.id ? null : c.id)}
            style={{ borderColor: filter === c.id ? c.color : undefined, color: filter === c.id ? c.color : undefined }}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${filter === c.id ? 'bg-white/10' : 'bg-white/5 border-white/15 text-white/40 hover:border-white/30'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* NODE PROFILE CARD */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 w-[min(360px,calc(100vw-32px))] rounded-3xl border border-white/10 overflow-hidden"
            style={{ background: 'rgba(6,10,20,0.97)', backdropFilter: 'blur(24px)' }}>

            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                    style={{ background: STATUS_CONFIG[selectedNode.status]?.glow || '#333' }}>
                    {selectedNode.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{selectedNode.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_CONFIG[selectedNode.status]?.color }} />
                      <span className="text-[10px] uppercase tracking-wider" style={{ color: STATUS_CONFIG[selectedNode.status]?.color }}>
                        {STATUS_CONFIG[selectedNode.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-white/20 hover:text-white/60 transition-colors"><X size={16} /></button>
              </div>

              {selectedNode.bio && (
                <p className="text-white/50 text-xs mb-4 leading-relaxed italic">"{selectedNode.bio}"</p>
              )}

              {selectedNode.strengths.length > 0 && (
                <div className="mb-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-2">Strong in</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.strengths.map(s => {
                      const course = COURSES.find(c => c.id === s);
                      return (
                        <span key={s} className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                          style={{ background: `${course?.color || '#00d4ff'}20`, color: course?.color || '#00d4ff', border: `1px solid ${course?.color || '#00d4ff'}40` }}>
                          {s.includes('COE') ? s : (course?.label || s)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedNode.whatsapp && selectedNode.id !== myID && (
                <a href={`https://wa.me/${selectedNode.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all">
                  <MessageCircle size={14} /> Message on WhatsApp
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MY NODE SETUP MODAL */}
      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md rounded-3xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
              style={{ background: 'rgba(6,10,20,0.98)' }}>

              <div className="p-6 pb-4 border-b border-white/8 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-wider">My Node</h2>
                  <p className="text-white/30 text-xs mt-0.5">How you appear on the map</p>
                </div>
                <button onClick={() => setShowSetup(false)} className="text-white/20 hover:text-white/60"><X size={16} /></button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-5">
                {/* Bio */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Your vibe / bio</p>
                  <input type="text" value={bio} onChange={e => setBio(e.target.value.slice(0, 80))}
                    placeholder='e.g. "Ask me about vectors. Don\'t ask about ENGL."'
                    className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder:text-white/20" />
                  <p className="text-[9px] text-white/20 mt-1 text-right">{bio.length}/80</p>
                </div>

                {/* WhatsApp */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">WhatsApp number (optional)</p>
                  <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                    placeholder="+233 XX XXX XXXX"
                    className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder:text-white/20" />
                  <p className="text-[9px] text-white/20 mt-1">Only visible if you add it. People can tap to message you.</p>
                </div>

                {/* Strengths */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-3">I can help with</p>
                  <div className="flex flex-wrap gap-2">
                    {COURSES.map(c => (
                      <button key={c.id} onClick={() => toggleStrength(c.id)}
                        style={strengths.includes(c.id) ? { background: `${c.color}20`, borderColor: `${c.color}60`, color: c.color } : {}}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${strengths.includes(c.id) ? '' : 'bg-white/5 border-white/15 text-white/40 hover:border-white/30'}`}>
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* COE sub-tags */}
                  {strengths.includes('COE153') && (
                    <div className="mt-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">COE 153 specialty</p>
                      <div className="flex flex-wrap gap-1.5">
                        {COE_TAGS.map(tag => {
                          const id = `COE_${tag}`;
                          return (
                            <button key={tag} onClick={() => toggleStrength(id)}
                              className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all ${strengths.includes(id) ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-white/30 hover:border-white/25'}`}>
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">Current status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['online', 'studying', 'lofi', 'offline'] as const).map(s => {
                      const cfg = STATUS_CONFIG[s];
                      return (
                        <button key={s} onClick={() => upsertPresence(myID, s)}
                          className="p-3 rounded-xl border border-white/10 bg-white/3 flex items-center gap-2 hover:bg-white/8 transition-all">
                          <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 shrink-0">
                <button onClick={handleSave} disabled={saving}
                  className="w-full py-3.5 bg-[#00d4ff] text-[#060a14] rounded-2xl font-black text-xs uppercase tracking-wider hover:scale-[1.01] transition-transform disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save & Go Live on Map'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
