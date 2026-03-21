"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Hash, MessageCircle, Users, Plus, ArrowLeft, Smile, Paperclip, ChevronRight, Circle } from "lucide-react";
import Link from "next/link";

// ── CONFIG ─────────────────────────────────────────────────────
const SUPABASE_URL = 'https://xkrrbuoxgkusbensdtqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrcnJidW94Z2t1c2JlbnNkdHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjUyMDksImV4cCI6MjA4OTYwMTIwOX0.1je5yDEolgYN9b3u4omiFDCKa7OuNX8t48K1ujQuRno';

// ── CHANNELS ───────────────────────────────────────────────────
const CHANNELS = [
  { id: 'general',  label: 'general',  emoji: '🌐', description: 'The whole class' },
  { id: 'math-151', label: 'math-151', emoji: '📐', description: 'Linear Algebra' },
  { id: 'bme-161',  label: 'bme-161',  emoji: '🧬', description: 'Cell Biology' },
  { id: 'ee-151',   label: 'ee-151',   emoji: '⚡', description: 'Applied Electricity' },
  { id: 'me-161',   label: 'me-161',   emoji: '⚙️', description: 'Basic Mechanics' },
  { id: 'chem-151', label: 'chem-151', emoji: '🧪', description: 'General Chemistry' },
  { id: 'coe-153',  label: 'coe-153',  emoji: '🖥️', description: 'Engineering Tech' },
  { id: 'engl-157', label: 'engl-157', emoji: '📝', description: 'Comm Skills' },
];

const EMOJIS = ['👍','🔥','😂','💀','🙏','❤️','😭','👀','💯','🤙'];

// ── TYPES ──────────────────────────────────────────────────────
type Msg = {
  id: string;
  channel: string;
  sender_id: string;
  sender_name: string;
  content: string;
  file_url?: string;
  file_name?: string;
  reactions: Record<string, string[]>;
  created_at: string;
};

type Room = {
  id: string;
  name: string;
  created_by: string;
  created_by_name: string;
  course: string;
  active_users: string[];
  created_at: string;
};

type DMThread = {
  partnerId: string;
  partnerName: string;
  lastMsg: string;
  unread: number;
};

// ── SUPABASE HELPERS ───────────────────────────────────────────
async function sbGet(path: string) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
  });
  return r.ok ? r.json() : [];
}

async function sbPost(table: string, data: any) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  });
  return r.ok ? r.json() : null;
}

async function sbPatch(table: string, id: string, data: any) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

// Supabase Realtime via WebSocket
function subscribeToChannel(channel: string, onMsg: (m: Msg) => void) {
  const ws = new WebSocket(`wss://xkrrbuoxgkusbensdtqt.supabase.co/realtime/v1/websocket?apikey=${SUPABASE_ANON_KEY}&vsn=1.0.0`);
  ws.onopen = () => {
    ws.send(JSON.stringify({ topic: 'realtime:public:messages', event: 'phx_join', payload: {}, ref: '1' }));
  };
  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.event === 'INSERT' && data.payload?.record?.channel === channel) {
        onMsg(data.payload.record as Msg);
      }
    } catch {}
  };
  return ws;
}

// ── AVATAR ─────────────────────────────────────────────────────
const Avatar = ({ name, size = 32 }: { name: string; size?: number }) => {
  const initials = name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#10b981','#3b82f6','#ef4444'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, background: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: size * 0.35, fontWeight: 700, color: '#fff' }}>
      {initials}
    </div>
  );
};

// ── MESSAGE BUBBLE ─────────────────────────────────────────────
const MessageBubble = ({ msg, isMe, onReact, myID }: { msg: Msg; isMe: boolean; onReact: (id: string, emoji: string) => void; myID: string }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 group px-4 py-1 hover:bg-white/3 transition-colors ${isMe ? 'flex-row-reverse' : ''}`}>
      {!isMe && <Avatar name={msg.sender_name} size={34} />}
      <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && (
          <span className="text-[10px] font-bold text-white/40 mb-1 px-1">{msg.sender_name.split(' ')[0]}</span>
        )}
        <div className={`relative px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-[#00d4ff] text-[#060a14] rounded-tr-sm font-medium' : 'bg-white/8 text-white/85 border border-white/8 rounded-tl-sm'}`}>
          {msg.content && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
          {msg.file_url && (
            <a href={msg.file_url} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-2 mt-1 text-xs underline ${isMe ? 'text-[#060a14]/70' : 'text-[#00d4ff]'}`}>
              <Paperclip size={11} /> {msg.file_name || 'File'}
            </a>
          )}
          {/* Reaction button — shows on hover */}
          <button onClick={() => setShowEmoji(s => !s)}
            className={`absolute -bottom-3 ${isMe ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity bg-[#0d1526] border border-white/15 rounded-full w-6 h-6 flex items-center justify-center text-[10px]`}>
            😊
          </button>
        </div>

        {/* Emoji picker */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className={`flex gap-1 mt-1 p-1.5 bg-[#0d1526] border border-white/10 rounded-2xl z-10 ${isMe ? 'flex-row-reverse' : ''}`}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => { onReact(msg.id, e); setShowEmoji(false); }}
                  className="w-7 h-7 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-base">
                  {e}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reactions display */}
        {Object.keys(msg.reactions || {}).length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(msg.reactions).map(([emoji, users]) =>
              (users as string[]).length > 0 && (
                <button key={emoji} onClick={() => onReact(msg.id, emoji)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border transition-all ${(users as string[]).includes(myID) ? 'bg-[#00d4ff]/20 border-[#00d4ff]/40 text-[#00d4ff]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                  {emoji} <span className="font-bold">{(users as string[]).length}</span>
                </button>
              )
            )}
          </div>
        )}

        <span className="text-[9px] text-white/20 mt-1 px-1">{time}</span>
      </div>
    </motion.div>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────────────
export default function Orion() {
  const [myID, setMyID] = useState('');
  const [myName, setMyName] = useState('');
  const [view, setView] = useState<'channels' | 'dms' | 'rooms' | 'map'>('channels');
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeDM, setActiveDM] = useState<{ id: string; name: string } | null>(null);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [dmMessages, setDmMessages] = useState<Msg[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [allProfiles, setAllProfiles] = useState<{ student_id: string; name: string }[]>([]);
  const [dmThreads, setDmThreads] = useState<DMThread[]>([]);
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCourse, setNewRoomCourse] = useState('');
  const [showMemberList, setShowMemberList] = useState(false);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current user
  useEffect(() => {
    const id = localStorage.getItem('bme-session-id') || '';
    const name = localStorage.getItem('bme-name') || '';
    setMyID(id);
    setMyName(name);
    if (!id) window.location.href = '/';
  }, []);

  // Load profiles for DM list
  useEffect(() => {
    if (!myID) return;
    sbGet('profiles?select=student_id,name&order=name.asc').then(data => {
      setAllProfiles((data || []).filter((p: any) => p.student_id !== myID));
    });
    sbGet('presence?select=student_id,status').then(data => {
      const online = (data || []).filter((p: any) => p.status !== 'offline').map((p: any) => p.student_id);
      setOnlineUsers(online);
    });
  }, [myID]);

  // Load messages for active channel
  const loadMessages = useCallback(async () => {
    if (!activeChannel) return;
    const data = await sbGet(`messages?channel=eq.${activeChannel}&order=created_at.asc&limit=100`);
    setMessages(data || []);
  }, [activeChannel]);

  useEffect(() => {
    loadMessages();
    // Set up realtime subscription
    if (wsRef.current) wsRef.current.close();
    wsRef.current = subscribeToChannel(activeChannel, (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, [activeChannel, loadMessages]);

  // Load DM messages
  const loadDMs = useCallback(async () => {
    if (!activeDM || !myID) return;
    const data = await sbGet(`dms?or=(and(sender_id.eq.${myID},channel.eq.dm_${activeDM.id}),and(sender_id.eq.${activeDM.id},channel.eq.dm_${myID}))&order=created_at.asc&limit=100`);
    // Fetch both directions
    const dmChannel = [myID, activeDM.id].sort().join('_');
    const data2 = await sbGet(`dms?channel=eq.${dmChannel}&order=created_at.asc&limit=100`);
    setDmMessages(data2 || []);
  }, [activeDM, myID]);

  useEffect(() => { loadDMs(); }, [loadDMs]);

  // Load rooms
  const loadRooms = useCallback(async () => {
    const data = await sbGet('rooms?order=created_at.desc&limit=20');
    setRooms(data || []);
  }, []);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, dmMessages]);

  // Poll for new messages every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      if (view === 'channels') loadMessages();
      if (view === 'dms' && activeDM) loadDMs();
    }, 3000);
    return () => clearInterval(interval);
  }, [view, activeChannel, activeDM, loadMessages, loadDMs]);

  const sendMessage = async () => {
    if (!input.trim() || !myID) return;
    const text = input.trim();
    setInput('');

    if (view === 'dms' && activeDM) {
      const dmChannel = [myID, activeDM.id].sort().join('_');
      const newMsg = {
        channel: dmChannel,
        sender_id: myID,
        sender_name: myName,
        content: text,
        reactions: {},
      };
      await sbPost('dms', newMsg);
      loadDMs();
    } else {
      const newMsg = {
        channel: activeChannel,
        sender_id: myID,
        sender_name: myName,
        content: text,
        reactions: {},
      };
      const result = await sbPost('messages', newMsg);
      if (result?.[0]) setMessages(prev => [...prev, result[0]]);
      else loadMessages();
    }
  };

  const handleReact = async (msgId: string, emoji: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;
    const reactions = { ...msg.reactions };
    const users: string[] = reactions[emoji] || [];
    if (users.includes(myID)) {
      reactions[emoji] = users.filter(u => u !== myID);
    } else {
      reactions[emoji] = [...users, myID];
    }
    await sbPatch('messages', msgId, { reactions });
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reactions } : m));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !myID) return;
    setUploading(true);
    // Upload to Supabase Storage
    const fileName = `${Date.now()}_${file.name}`;
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/orion-files/${fileName}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': file.type,
      },
      body: file,
    });

    if (uploadRes.ok) {
      const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/orion-files/${fileName}`;
      await sbPost('messages', {
        channel: activeChannel,
        sender_id: myID,
        sender_name: myName,
        content: '',
        file_url: fileUrl,
        file_name: file.name,
        reactions: {},
      });
      loadMessages();
    }
    setUploading(false);
    e.target.value = '';
  };

  const createRoom = async () => {
    if (!newRoomName.trim() || !myID) return;
    await sbPost('rooms', {
      name: newRoomName.trim(),
      created_by: myID,
      created_by_name: myName,
      course: newRoomCourse,
      active_users: [myID],
    });
    setNewRoomName('');
    setNewRoomCourse('');
    setShowNewRoom(false);
    loadRooms();
  };

  const joinRoom = async (room: Room) => {
    if (!room.active_users.includes(myID)) {
      await sbPatch('rooms', room.id, { active_users: [...room.active_users, myID] });
    }
    setActiveRoom({ ...room, active_users: [...(room.active_users.includes(myID) ? room.active_users : [...room.active_users, myID])] });
    setActiveChannel(`room_${room.id}`);
    setView('channels');
  };

  const currentChannel = CHANNELS.find(c => c.id === activeChannel);

  const Sidebar = () => (
    <div className="flex flex-col h-full w-64 shrink-0 border-r border-white/8" style={{ background: 'rgba(6,10,20,0.98)' }}>
      {/* Server header */}
      <div className="px-4 py-4 border-b border-white/8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">⭐</span>
          <h1 className="text-white font-black text-sm tracking-wide">ORION</h1>
          <span className="text-[8px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded-full">BME1</span>
        </div>
        <p className="text-white/25 text-[10px] uppercase tracking-widest">Class of 2029</p>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        {/* Channels */}
        <div>
          <p className="px-4 text-[9px] font-black uppercase tracking-widest text-white/25 mb-1">Channels</p>
          {CHANNELS.map(ch => (
            <button key={ch.id}
              onClick={() => { setActiveChannel(ch.id); setView('channels'); setActiveDM(null); setActiveRoom(null); setSidebarOpen(false); }}
              className={`w-full px-3 py-1.5 flex items-center gap-2 rounded-lg mx-1 transition-all text-left ${activeChannel === ch.id && view === 'channels' ? 'bg-white/10 text-white' : 'text-white/35 hover:bg-white/5 hover:text-white/70'}`}>
              <Hash size={13} className="shrink-0 opacity-60" />
              <span className="text-xs font-medium truncate">{ch.label}</span>
              {unread[ch.id] > 0 && (
                <span className="ml-auto bg-[#00d4ff] text-[#060a14] text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{unread[ch.id]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Study Rooms */}
        <div>
          <div className="px-4 flex items-center justify-between mb-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/25">Study Rooms</p>
            <button onClick={() => setShowNewRoom(true)} className="text-white/25 hover:text-white/60 transition-colors">
              <Plus size={12} />
            </button>
          </div>
          {rooms.slice(0, 6).map(room => (
            <button key={room.id}
              onClick={() => { joinRoom(room); setSidebarOpen(false); }}
              className={`w-full px-3 py-1.5 flex items-center gap-2 rounded-lg mx-1 transition-all text-left ${activeRoom?.id === room.id ? 'bg-white/10 text-white' : 'text-white/35 hover:bg-white/5 hover:text-white/70'}`}>
              <Circle size={8} className="shrink-0 text-emerald-400 fill-emerald-400" />
              <span className="text-xs font-medium truncate">{room.name}</span>
              <span className="ml-auto text-[9px] text-white/20">{room.active_users.length}</span>
            </button>
          ))}
          {rooms.length === 0 && (
            <p className="px-4 text-[10px] text-white/20 italic">No rooms yet — create one</p>
          )}
        </div>

        {/* DMs */}
        <div>
          <p className="px-4 text-[9px] font-black uppercase tracking-widest text-white/25 mb-1">Direct Messages</p>
          {allProfiles.slice(0, 8).map(p => (
            <button key={p.student_id}
              onClick={() => { setActiveDM({ id: p.student_id, name: p.name }); setView('dms'); setActiveRoom(null); setSidebarOpen(false); }}
              className={`w-full px-3 py-1.5 flex items-center gap-2 rounded-lg mx-1 transition-all text-left ${activeDM?.id === p.student_id ? 'bg-white/10 text-white' : 'text-white/35 hover:bg-white/5 hover:text-white/70'}`}>
              <div className="relative shrink-0">
                <Avatar name={p.name} size={22} />
                {onlineUsers.includes(p.student_id) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#060a14]" />
                )}
              </div>
              <span className="text-xs font-medium truncate">{p.name.split(' ')[0]}</span>
            </button>
          ))}
          {allProfiles.length === 0 && (
            <p className="px-4 text-[10px] text-white/20 italic">No profiles yet</p>
          )}
        </div>
      </div>

      {/* My identity bar */}
      <div className="p-3 border-t border-white/8 flex items-center gap-2">
        <Avatar name={myName || 'You'} size={30} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-bold truncate">{myName.split(' ')[0]}</p>
          <p className="text-emerald-400 text-[9px] uppercase tracking-wider">Online</p>
        </div>
        <Link href="/map" className="text-white/20 hover:text-white/60 transition-colors" title="Orion Map">
          <span className="text-sm">🗺️</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex" style={{ background: '#060a14' }}>

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              className="absolute left-0 top-0 bottom-0 w-64 z-50" onClick={e => e.stopPropagation()}>
              <Sidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Channel header */}
        <div className="h-14 px-4 flex items-center gap-3 border-b border-white/8 shrink-0" style={{ background: 'rgba(6,10,20,0.98)' }}>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white/40 hover:text-white/70 transition-colors mr-1">
            ☰
          </button>
          <Link href="/" className="text-white/20 hover:text-white/60 transition-colors mr-1">
            <ArrowLeft size={16} />
          </Link>
          {view === 'dms' && activeDM ? (
            <>
              <Avatar name={activeDM.name} size={28} />
              <div>
                <p className="text-white font-bold text-sm">{activeDM.name.split(' ')[0]}</p>
                <p className="text-white/30 text-[9px]">{onlineUsers.includes(activeDM.id) ? '🟢 Online' : '⚫ Offline'}</p>
              </div>
            </>
          ) : activeRoom ? (
            <>
              <Circle size={10} className="text-emerald-400 fill-emerald-400 shrink-0" />
              <div>
                <p className="text-white font-bold text-sm">{activeRoom.name}</p>
                <p className="text-white/30 text-[9px]">{activeRoom.active_users.length} in room · {activeRoom.course || 'General'}</p>
              </div>
            </>
          ) : (
            <>
              <Hash size={16} className="text-white/40 shrink-0" />
              <div>
                <p className="text-white font-bold text-sm">{currentChannel?.label || activeChannel}</p>
                <p className="text-white/30 text-[9px]">{currentChannel?.description || ''}</p>
              </div>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setShowMemberList(s => !s)} className="text-white/25 hover:text-white/60 transition-colors">
              <Users size={16} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-0.5">
          {/* Welcome message for channels */}
          {view === 'channels' && !activeRoom && messages.length === 0 && (
            <div className="px-8 py-12 text-center">
              <p className="text-4xl mb-3">{currentChannel?.emoji || '#'}</p>
              <p className="text-white font-bold text-lg mb-1">Welcome to #{currentChannel?.label}</p>
              <p className="text-white/30 text-sm">{currentChannel?.description} — Start the conversation.</p>
            </div>
          )}

          {/* Channel messages */}
          {view === 'channels' && (messages).map(msg => (
            <MessageBubble key={msg.id} msg={msg} isMe={msg.sender_id === myID} onReact={handleReact} myID={myID} />
          ))}

          {/* DM messages */}
          {view === 'dms' && activeDM && dmMessages.length === 0 && (
            <div className="px-8 py-12 text-center">
              <Avatar name={activeDM.name} size={56} />
              <p className="text-white font-bold text-lg mt-4 mb-1">{activeDM.name}</p>
              <p className="text-white/30 text-sm">Start a private conversation.</p>
            </div>
          )}
          {view === 'dms' && dmMessages.map(msg => (
            <MessageBubble key={msg.id} msg={msg as Msg} isMe={msg.sender_id === myID} onReact={() => {}} myID={myID} />
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="px-4 pb-4 pt-2 shrink-0">
          <div className="flex gap-2 items-end bg-white/5 border border-white/10 rounded-2xl px-3 py-2 focus-within:border-white/25 transition-colors">
            <button onClick={() => fileInputRef.current?.click()} className="text-white/25 hover:text-white/60 transition-colors mb-1 shrink-0" disabled={uploading}>
              <Paperclip size={16} />
            </button>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={view === 'dms' && activeDM ? `Message ${activeDM.name.split(' ')[0]}...` : `Message #${currentChannel?.label || activeChannel}...`}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20 py-1 resize-none"
            />
            <button onClick={sendMessage} disabled={!input.trim()}
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${input.trim() ? 'bg-[#00d4ff] hover:scale-105' : 'bg-white/5'}`}>
              <Send size={14} className={input.trim() ? 'text-[#060a14]' : 'text-white/20'} />
            </button>
          </div>
          <p className="text-[9px] text-white/15 mt-1.5 px-1">Enter to send · Hover a message to react</p>
        </div>
      </div>

      {/* Member list panel */}
      <AnimatePresence>
        {showMemberList && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 220, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            className="border-l border-white/8 overflow-hidden shrink-0" style={{ background: 'rgba(6,10,20,0.98)' }}>
            <div className="p-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-3">
                Online — {onlineUsers.length}
              </p>
              <div className="space-y-2">
                {allProfiles.filter(p => onlineUsers.includes(p.student_id)).map(p => (
                  <div key={p.student_id} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar name={p.name} size={26} />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#060a14]" />
                    </div>
                    <span className="text-white/60 text-xs truncate">{p.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/15 mb-3 mt-4">
                Offline — {allProfiles.filter(p => !onlineUsers.includes(p.student_id)).length}
              </p>
              <div className="space-y-2">
                {allProfiles.filter(p => !onlineUsers.includes(p.student_id)).map(p => (
                  <div key={p.student_id} className="flex items-center gap-2">
                    <Avatar name={p.name} size={26} />
                    <span className="text-white/25 text-xs truncate">{p.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Room Modal */}
      <AnimatePresence>
        {showNewRoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="w-full max-w-sm rounded-3xl border border-white/10 p-6" style={{ background: '#0d1526' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-black text-sm uppercase tracking-wider">New Study Room</h2>
                <button onClick={() => setShowNewRoom(false)} className="text-white/20 hover:text-white/60"><X size={16} /></button>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="Room name e.g. MATH 151 grind" value={newRoomName}
                  onChange={e => setNewRoomName(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#00d4ff]/50 placeholder:text-white/20" />
                <select value={newRoomCourse} onChange={e => setNewRoomCourse(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#00d4ff]/50">
                  <option value="">Select course (optional)</option>
                  {CHANNELS.filter(c => c.id !== 'general').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                <button onClick={createRoom} disabled={!newRoomName.trim()}
                  className="w-full py-3.5 bg-[#00d4ff] text-[#060a14] rounded-xl font-black text-xs uppercase tracking-wider disabled:opacity-30">
                  Create Room
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
