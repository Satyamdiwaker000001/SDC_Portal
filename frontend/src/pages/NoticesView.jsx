import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, X, AlertTriangle, Bell, Clock, Radio,
  Users, Pin, Globe, FileText, Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { announcementsAPI, teamsAPI } from '../api/services';

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_NOTICES = [
  {
    id: 1, title: 'Mandatory Code Review Session', priority: 'Urgent', is_global: true,
    body: 'All developers and mentors are required to attend the code review session scheduled for this Friday at 3 PM in Lab 4. Bring your current project files. Attendance is mandatory.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), pinned: true,
  },
  {
    id: 2, title: 'SRS Submission Deadline Extended', priority: 'Important', is_global: false,
    body: 'The SRS document submission deadline for all Phase 2 projects has been extended by one week. New deadline: 15th August. Please ensure all documents are reviewed by your mentor before submission.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), pinned: true,
  },
  {
    id: 3, title: 'SDC Portal v2 Beta Testing', priority: 'Normal', is_global: true,
    body: 'The Beta version of SDC Portal v2 is now live for internal testing. Please test all features and report any bugs to the Alpha Strike team via the Issues tab. Your feedback is valued.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), pinned: false,
  },
];

const MOCK_TEAMS = [
  { id: 'mock-t1', name: 'Alpha Strike' },
  { id: 'mock-t2', name: 'Omega Web' },
  { id: 'mock-t3', name: 'Phantom AI' },
];

const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ─── Priority Config ─────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  Urgent: {
    pinColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    headerColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    icon: Radio,
    borderColor: 'border-red-500/30'
  },
  Important: {
    pinColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    headerColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    icon: AlertTriangle,
    borderColor: 'border-blue-500/30'
  },
  Normal: {
    pinColor: 'text-[#00b4d8]',
    bgColor: 'bg-[#00b4d8]/10',
    headerColor: 'bg-[#00b4d8]/20',
    textColor: 'text-[#00b4d8]',
    icon: Bell,
    borderColor: 'border-[#00b4d8]/30'
  },
};

// ─── Pin Button ──────────────────────────────────────────────────────────────
function PushPin({ color, isPinned, onClick }) {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`absolute top-4 right-4 z-20 cursor-pointer transition-all p-1.5 rounded-full hover:bg-white/10 ${!isPinned ? 'opacity-30 hover:opacity-100 text-white' : `opacity-100 ${color}`}`}
      title={isPinned ? 'Unpin' : 'Pin'}
    >
      <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
    </button>
  );
}

// ─── Notice Card (Modern Glassmorphic) ───────────────────────────────────────
function NoticeCard({ notice, onTogglePin, onOpen }) {
  const cfg = PRIORITY_CONFIG[notice.priority] || PRIORITY_CONFIG.Normal;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="relative cursor-pointer w-full"
      onClick={() => onOpen(notice)}
    >
      <div 
        className={`w-full h-64 rounded-3xl flex flex-col overflow-hidden relative bg-[#1c222b] border ${cfg.borderColor} shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-opacity-100 transition-all group`}
      >
        {/* Glow effect */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none transition-all ${cfg.bgColor}`}></div>

        <PushPin color={cfg.pinColor} isPinned={notice.pinned} onClick={() => onTogglePin(notice.id)} />

        <div className={`px-6 py-4 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.02]`}>
          <div className="flex items-center gap-2">
            <cfg.icon className={`w-4 h-4 ${cfg.textColor}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.textColor}`}>{notice.priority}</span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col relative z-10">
          <h3 className="text-base font-black text-white leading-tight mb-3 line-clamp-2">
            {notice.title}
          </h3>
          <p className="text-xs text-white/50 leading-relaxed line-clamp-3 font-medium">
            {notice.body}
          </p>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
               {notice.is_global ? (
                 <Globe className="w-3.5 h-3.5 text-white/30" title="Global Broadcast" />
               ) : (
                 <Users className="w-3.5 h-3.5 text-white/30" title="Team Specific" />
               )}
               <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{formatDate(notice.timestamp)}</span>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.textColor} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>Read <span className="text-lg leading-none">&rsaquo;</span></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Notice Detail Modal ─────────────────────────────────────────────────────
function NoticeDetailModal({ notice, onClose, onTogglePin }) {
  if (!notice) return null;
  const cfg = PRIORITY_CONFIG[notice.priority] || PRIORITY_CONFIG.Normal;

  return (
    <AnimatePresence>
      {notice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#0f172a] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className={`px-8 py-6 border-b border-white/10 flex items-start justify-between bg-white/[0.02] relative overflow-hidden shrink-0`}>
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none ${cfg.bgColor}`}></div>
              <div className="relative z-10 pr-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${cfg.headerColor} ${cfg.textColor} border ${cfg.borderColor}`}>
                    {notice.priority} Notice
                  </span>
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                    {notice.is_global ? <Globe className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                    {notice.is_global ? 'Global Broadcast' : 'Targeted Team Notice'}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white leading-snug">
                  {notice.title}
                </h2>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 relative z-10">
                <button
                  onClick={() => onTogglePin(notice.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${notice.pinned ? `${cfg.bgColor} ${cfg.textColor} ${cfg.borderColor}` : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'}`}
                >
                  <Pin className={`w-4 h-4 ${notice.pinned ? 'fill-current' : ''}`} />
                  {notice.pinned ? 'Pinned' : 'Pin'}
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative">
              <div className="flex items-center gap-6 mb-8 pb-4 border-b border-white/5 text-xs font-bold text-white/40 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatDate(notice.timestamp)}
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Ref: #{notice.id}
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-white/80 leading-relaxed whitespace-pre-wrap text-base font-medium">
                {notice.body}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Post Notice Modal ───────────────────────────────────────────────────────
function PostNoticeModal({ isOpen, onClose, onSubmit, teams }) {
  const [newNotice, setNewNotice] = useState({ title: '', body: '', priority: 'Normal', is_global: true, team_ids: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit(newNotice);
      setNewNotice({ title: '', body: '', priority: 'Normal', is_global: true, team_ids: [] });
    } catch (err) {
      setError(err.message || 'Failed to post notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTeam = (id) => {
    setNewNotice(prev => ({
      ...prev,
      team_ids: prev.team_ids.includes(id) 
        ? prev.team_ids.filter(t => t !== id) 
        : [...prev.team_ids, id]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-[#0f172a] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col overflow-hidden z-10"
          >
            <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-[#00b4d8]/20 to-transparent flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/20 flex items-center justify-center border border-[#00b4d8]/30">
                   <Megaphone className="w-5 h-5 text-[#00b4d8]" />
                 </div>
                 <h2 className="text-lg font-black text-white tracking-widest uppercase">Broadcast Notice</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh] custom-scrollbar flex-1">
              <form id="post-form" onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold rounded-xl">{error}</div>}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Title</label>
                  <input
                    type="text" required placeholder="Notice Title..."
                    value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm placeholder:text-white/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Priority</label>
                    <select
                      value={newNotice.priority} onChange={e => setNewNotice({ ...newNotice, priority: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                    >
                      <option value="Normal" className="bg-[#0f172a]">Normal</option>
                      <option value="Important" className="bg-[#0f172a]">Important</option>
                      <option value="Urgent" className="bg-[#0f172a]">Urgent</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Audience</label>
                    <select
                      value={newNotice.is_global ? "global" : "team"} 
                      onChange={e => setNewNotice({ ...newNotice, is_global: e.target.value === 'global' })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                    >
                      <option value="global" className="bg-[#0f172a]">Global Broadcast</option>
                      <option value="team" className="bg-[#0f172a]">Targeted Team</option>
                    </select>
                  </div>
                </div>

                {!newNotice.is_global && (
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Select Teams</p>
                    <div className="flex flex-wrap gap-2">
                      {teams.map(t => (
                        <button type="button" key={t.id} onClick={() => toggleTeam(t.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${newNotice.team_ids.includes(t.id) ? 'bg-[#00b4d8]/20 text-[#00b4d8] border-[#00b4d8]/30' : 'bg-white/5 text-white/50 border-white/5 hover:text-white hover:bg-white/10'}`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Message Body</label>
                  <textarea
                    required rows="6" placeholder="Write your message here..."
                    value={newNotice.body} onChange={e => setNewNotice({ ...newNotice, body: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm resize-none custom-scrollbar placeholder:text-white/30"
                  />
                </div>
                
                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button type="button" onClick={onClose} className="px-5 py-2.5 mr-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] transition-all text-sm font-black uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
                  >
                    <Megaphone className="w-4 h-4" /> {isSubmitting ? 'Posting...' : 'Broadcast'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function NoticesView() {
  const { role } = useAuth();
  const [notices, setNotices] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openNotice, setOpenNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [nData, tData] = await Promise.all([
        announcementsAPI.getAll().catch(() => []),
        teamsAPI.getAll().catch(() => [])
      ]);
      const raw = nData?.length ? nData : MOCK_NOTICES;
      // Sort pinned first, then by date
      const sorted = raw.map(n => ({ ...n, pinned: n.pinned ?? false })).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      setNotices(sorted);
      setTeams(tData?.length ? tData : MOCK_TEAMS);
    } catch {
      setNotices(MOCK_NOTICES);
      setTeams(MOCK_TEAMS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePin = (id) => {
    setNotices(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
      return updated.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    });
    if (openNotice?.id === id) setOpenNotice(prev => ({ ...prev, pinned: !prev.pinned }));
  };

  const handleCreateNotice = async (newNoticeData) => {
    const created = await announcementsAPI.create({ 
      ...newNoticeData, 
      team_ids: newNoticeData.is_global ? [] : newNoticeData.team_ids 
    });
    setNotices(prev => [{ ...created, pinned: false }, ...prev].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
    }));
    setIsModalOpen(false);
  };

  return (
    <motion.div 
      className="space-y-8 relative z-10 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-[#00b4d8]" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase drop-shadow-md">
            Broadcast Center
          </h1>
          <p className="text-sm text-white/40 mt-1 font-medium tracking-wide">System announcements, updates, and general notices.</p>
        </div>
        
        {role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00b4d8] to-blue-600 text-white text-sm font-black shadow-[0_0_20px_rgba(0,180,216,0.2)] hover:shadow-[0_0_30px_rgba(0,180,216,0.4)] transition-all hover:-translate-y-0.5 border border-white/10 uppercase tracking-widest"
          >
            <Plus className="w-5 h-5" /> Broadcast Notice
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        
        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onTogglePin={handleTogglePin}
                onOpen={setOpenNotice}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {notices.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-white/40">
            <Megaphone className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-bold tracking-widest uppercase">No Active Broadcasts</p>
            <p className="text-xs mt-2 opacity-50">All caught up on notices.</p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <NoticeDetailModal
        notice={openNotice}
        onClose={() => setOpenNotice(null)}
        onTogglePin={handleTogglePin}
      />

      <PostNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateNotice}
        teams={teams}
      />

    </motion.div>
  );
}
