import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Plus, X, AlertTriangle, Bell, Clock, Radio, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { announcementsAPI, teamsAPI } from '../api/services';

const MOCK_NOTICES = [
  {
    id: 1, title: 'Mandatory Code Review Session', priority: 'Urgent', is_global: true,
    body: 'All developers and mentors are required to attend the code review session scheduled for this Friday at 3 PM in Lab 4. Bring your current project files. Attendance is mandatory.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2, title: 'SRS Submission Deadline Extended', priority: 'Important', is_global: false,
    body: 'The SRS document submission deadline for all Phase 2 projects has been extended by one week. New deadline: 15th August. Please ensure all documents are reviewed by your mentor before submission.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3, title: 'SDC Portal v2 Beta Testing', priority: 'Normal', is_global: true,
    body: 'The Beta version of SDC Portal v2 is now live for internal testing. Please test all features and report any bugs to the Alpha Strike team via the Issues tab. Your feedback is valued.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4, title: 'New Batch Orientation — Volunteer Sign-ups', priority: 'Normal', is_global: true,
    body: 'We are looking for senior developers and mentors to volunteer as guides for the new batch orientation program. If interested, please fill the volunteer form linked in the portal dashboard.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
];

const MOCK_TEAMS = [
  { id: 'mock-t1', name: 'Alpha Strike' },
  { id: 'mock-t2', name: 'Omega Web' },
  { id: 'mock-t3', name: 'Phantom AI' },
];

const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const PRIORITY_COLORS = {
  'Normal': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Important': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Urgent': 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse'
};

const PRIORITY_ICONS = {
  'Normal': Bell,
  'Important': AlertTriangle,
  'Urgent': Radio
};

export default function NoticesView() {
  const { role } = useAuth();
  const [notices, setNotices] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [newNotice, setNewNotice] = useState({
    title: '',
    body: '',
    priority: 'Normal',
    is_global: true,
    team_ids: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [nData, tData] = await Promise.all([
        announcementsAPI.getAll().catch(() => []),
        teamsAPI.getAll().catch(() => [])
      ]);
      setNotices(nData?.length ? nData : MOCK_NOTICES);
      setTeams(tData?.length ? tData : MOCK_TEAMS);
    } catch (e) {
      setNotices(MOCK_NOTICES);
      setTeams(MOCK_TEAMS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const created = await announcementsAPI.create({
        ...newNotice,
        team_ids: newNotice.is_global ? [] : newNotice.team_ids
      });
      setNotices([created, ...notices]);
      setIsModalOpen(false);
      setNewNotice({ title: '', body: '', priority: 'Normal', is_global: true, team_ids: [] });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to broadcast notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTeamSelection = (teamId) => {
    setNewNotice(prev => {
      const current = prev.team_ids || [];
      if (current.includes(teamId)) {
        return { ...prev, team_ids: current.filter(id => id !== teamId) };
      } else {
        return { ...prev, team_ids: [...current, teamId] };
      }
    });
  };

  return (
    <div className="h-full flex flex-col font-sans text-white pb-6 relative z-10 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-blue-400 uppercase">Communications</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase drop-shadow-md">Global Notices</h1>
          <p className="text-sm text-white/40 mt-1 font-medium">Broadcasts, announcements, and critical updates.</p>
        </div>
        
        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-black hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 border border-white/10 uppercase tracking-widest shrink-0"
          >
            <Radio className="w-4 h-4" /> Transmit Notice
          </button>
        )}
      </div>

      {/* Notices Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {notices.length === 0 ? (
          <div className="h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-white/30 p-8">
            <Bell className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-xl font-bold text-white/50 tracking-widest uppercase mb-1">Silence on the network</p>
            <p className="text-sm opacity-50">No announcements or notices have been transmitted yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            <AnimatePresence>
              {notices.map((notice, i) => {
                const PriorityIcon = PRIORITY_ICONS[notice.priority] || Bell;
                const isUrgent = notice.priority === 'Urgent';
                const isImportant = notice.priority === 'Important';
                
                const borderColor = isUrgent ? 'border-blue-500/40' : isImportant ? 'border-sky-500/25' : 'border-white/5';
                const glowColor = isUrgent ? 'bg-blue-600/10' : isImportant ? 'bg-sky-500/8' : 'bg-white/0';
                const accentColor = isUrgent ? 'from-blue-600 to-cyan-500' : isImportant ? 'from-sky-500 to-blue-500' : 'from-white/20 to-white/10';
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    key={notice.id || i}
                    className={`bg-[#1c222b] border ${borderColor} rounded-2xl relative overflow-hidden group shadow-xl hover:border-opacity-80 transition-all`}
                  >
                    {/* Ambient Glow */}
                    <div className={`absolute top-0 right-0 w-64 h-64 ${glowColor} blur-[50px] pointer-events-none rounded-full -mt-20 -mr-20`}></div>

                    {/* Left Accent Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${accentColor} rounded-l-2xl`}></div>

                    <div className="flex items-start gap-4 relative z-10 p-5 pl-6">
                      {/* Priority Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${PRIORITY_COLORS[notice.priority]} mt-0.5`}>
                        <PriorityIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Meta row */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg border ${PRIORITY_COLORS[notice.priority]}`}>
                            {notice.priority}
                          </span>
                          {!notice.is_global && (
                            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg border bg-blue-500/15 text-blue-400 border-blue-500/25 flex items-center gap-1">
                              <Users className="w-3 h-3" /> Targeted
                            </span>
                          )}
                          {notice.is_global && (
                            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg border bg-white/5 text-white/30 border-white/10">
                              Global
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-white/30 flex items-center gap-1 ml-auto">
                            <Clock className="w-3 h-3" /> {formatDate(notice.timestamp)}
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-base font-black text-white leading-tight mb-2">
                          {notice.title}
                        </h3>
                        
                        {/* Body */}
                        <p className="text-sm font-medium text-white/60 leading-relaxed line-clamp-3">
                          {notice.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Notice Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent relative overflow-hidden shrink-0">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[50px] -mr-20 -mt-20"></div>
                 <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                       <Radio className="w-6 h-6 text-blue-400" />
                     </div>
                     <div>
                       <h2 className="text-xl font-black text-white tracking-widest uppercase">Transmit Notice</h2>
                       <p className="text-[10px] text-blue-400/80 uppercase tracking-widest font-bold">Secure Broadcast Channel</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => setIsModalOpen(false)}
                     className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <form id="notice-form" onSubmit={handleCreateNotice} className="space-y-6">
                  
                  {error && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold text-center">
                      {error}
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Subject Header</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter a clear, concise subject..."
                      value={newNotice.title}
                      onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all font-bold text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Priority */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Priority Level</label>
                      <select 
                        value={newNotice.priority}
                        onChange={e => setNewNotice({...newNotice, priority: e.target.value})}
                        className={`w-full px-4 py-3.5 rounded-xl border transition-all font-black uppercase tracking-wider cursor-pointer ${
                          newNotice.priority === 'Urgent' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 
                          newNotice.priority === 'Important' ? 'bg-cyan-500/10 border-cyan-500/50 text-blue-400' :
                          'bg-[#1c222b] border-white/10 text-blue-400'
                        }`}
                      >
                        <option value="Normal" className="bg-[#1c222b] text-blue-400">Normal</option>
                        <option value="Important" className="bg-[#1c222b] text-blue-400">Important</option>
                        <option value="Urgent" className="bg-[#1c222b] text-blue-400">Urgent</option>
                      </select>
                    </div>

                    {/* Scope */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Broadcast Scope</label>
                      <div className="flex bg-white/5 rounded-xl border border-white/10 overflow-hidden p-1">
                        <button
                          type="button"
                          onClick={() => setNewNotice({...newNotice, is_global: true})}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${newNotice.is_global ? 'bg-cyan-500 text-white shadow-md' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                          Global
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewNotice({...newNotice, is_global: false})}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${!newNotice.is_global ? 'bg-sky-500 text-white shadow-md' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                          Targeted
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Targeted Teams Selection */}
                  {!newNotice.is_global && (
                    <div className="space-y-2 p-4 bg-sky-500/10 border border-sky-500/30 rounded-xl">
                       <label className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Select Target Teams</label>
                       {teams.length === 0 ? (
                         <p className="text-xs text-white/40">No teams available to target.</p>
                       ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                           {teams.map(team => (
                             <div 
                               key={team.id}
                               onClick={() => toggleTeamSelection(team.id)}
                               className={`px-3 py-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${newNotice.team_ids.includes(team.id) ? 'bg-sky-500/20 border-sky-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-[#020617] border-white/10 hover:border-white/30'}`}
                             >
                                <div className="flex-1 min-w-0 pr-2">
                                  <p className={`text-xs font-bold truncate ${newNotice.team_ids.includes(team.id) ? 'text-sky-400' : 'text-white/70'}`}>{team.name}</p>
                                </div>
                                {newNotice.team_ids.includes(team.id) && (
                                  <div className="w-4 h-4 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                                  </div>
                                )}
                             </div>
                           ))}
                         </div>
                       )}
                    </div>
                  )}

                  {/* Body Message */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Message Body</label>
                    <textarea 
                      required
                      rows="6"
                      placeholder="Write your detailed announcement here..."
                      value={newNotice.body}
                      onChange={e => setNewNotice({...newNotice, body: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all font-medium custom-scrollbar"
                    />
                  </div>

                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  form="notice-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Transmitting...' : 'Transmit Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
}
