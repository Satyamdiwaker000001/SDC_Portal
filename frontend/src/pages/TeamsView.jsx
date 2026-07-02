import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Plus, Users, Shield, Star, Code, X, Search, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { teamsAPI, usersAPI } from '../api/services';

const MOCK_TEAMS = [
  { id: 'mock-t1', name: 'Alpha Strike', leaderId: 'mock-u1', memberIds: ['mock-u2', 'mock-u3', 'mock-u4'], project: 'SDC Portal v2' },
  { id: 'mock-t2', name: 'Omega Web', leaderId: 'mock-u2', memberIds: ['mock-u1', 'mock-u5'], project: 'Campus Connect App' },
  { id: 'mock-t3', name: 'Phantom AI', leaderId: 'mock-u3', memberIds: ['mock-u6', 'mock-u7'], project: 'AI Attendance System' },
  { id: 'mock-t4', name: 'Nexus Cyber', leaderId: 'mock-u5', memberIds: ['mock-u1', 'mock-u8', 'mock-u9'], project: 'Cybersec Dashboard' },
];

const MOCK_USERS = [
  { id: 'mock-u1', name: 'Aryan Sharma', email: 'aryan@sdc.edu', role: 'developer', profile_image_url: null },
  { id: 'mock-u2', name: 'Priya Singh', email: 'priya@sdc.edu', role: 'mentor', profile_image_url: null },
  { id: 'mock-u3', name: 'Rahul Verma', email: 'rahul@sdc.edu', role: 'developer', profile_image_url: null },
  { id: 'mock-u4', name: 'Sneha Patel', email: 'sneha@sdc.edu', role: 'developer', profile_image_url: null },
  { id: 'mock-u5', name: 'Dev Kapoor', email: 'dev@sdc.edu', role: 'mentor', profile_image_url: null },
  { id: 'mock-u6', name: 'Anjali Mehta', email: 'anjali@sdc.edu', role: 'developer', profile_image_url: null },
  { id: 'mock-u7', name: 'Vikram Nair', email: 'vikram@sdc.edu', role: 'developer', profile_image_url: null },
  { id: 'mock-u8', name: 'Isha Bose', email: 'isha@sdc.edu', role: 'developer', profile_image_url: null },
  { id: 'mock-u9', name: 'Kabir Roy', email: 'kabir@sdc.edu', role: 'developer', profile_image_url: null },
];

export default function TeamsView() {
  const { role } = useAuth();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Team Form State
  const [newTeam, setNewTeam] = useState({ name: '', leaderId: '', memberIds: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tData, uData] = await Promise.all([
        teamsAPI.getAll().catch(() => []),
        usersAPI.getAll().catch(() => [])
      ]);
      setTeams(tData?.length ? tData : MOCK_TEAMS);
      setUsers(uData?.length ? uData : MOCK_USERS);
    } catch (err) {
      setTeams(MOCK_TEAMS);
      setUsers(MOCK_USERS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newTeam.name || !newTeam.leaderId) {
      setError('Team name and Leader are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await teamsAPI.create(newTeam);
      setTeams([...teams, created]);
      setIsModalOpen(false);
      setNewTeam({ name: '', leaderId: '', memberIds: [] });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMemberSelection = (userId) => {
    setNewTeam(prev => {
      const current = prev.memberIds;
      if (current.includes(userId)) {
        return { ...prev, memberIds: current.filter(id => id !== userId) };
      } else {
        return { ...prev, memberIds: [...current, userId] };
      }
    });
  };

  const filteblueTeams = teams.filter(t => t.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // Available users for leader/members (excluding admin)
  const availableUsers = users.filter(u => u.role !== 'admin' && !u.isPassout);
  
  const getLeaderDetails = (leaderId) => {
    return users.find(u => u.id === leaderId) || null;
  };

  return (
    <div className="h-full flex flex-col relative z-10">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,180,216,0.15)]">
            <Network className="w-6 h-6 text-[#00b4d8]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase drop-shadow-md">Team Formations</h1>
            <p className="text-sm text-white/50 font-medium">Manage development squads and project teams</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search teams..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00b4d8]/50 focus:bg-white/10 transition-all w-64 shadow-inner"
            />
          </div>
          {role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00b4d8] to-blue-600 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(0,180,216,0.4)] transition-all hover:-translate-y-1 border border-white/10 uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" /> Assemble Team
            </button>
          )}
        </div>
      </div>

      {/* Teams Grid */}
      {filteblueTeams.length === 0 ? (
        <div className="flex-1 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/40">
          <Network className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-bold tracking-widest uppercase mb-1">No Teams Assembled</p>
          <p className="text-sm opacity-50 text-center max-w-sm">No teams found matching your criteria. Administrators can assemble new teams.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteblueTeams.map(team => {
            const leader = getLeaderDetails(team.leaderId);
            const memberUsers = (team.memberIds || []).map(id => users.find(u => u.id === id)).filter(Boolean);
            const leaderInitials = leader ? (leader.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
            return (
              <motion.div 
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1c222b] border border-white/8 rounded-3xl overflow-hidden group hover:border-[#00b4d8]/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col"
              >
                {/* Team Header with glow */}
                <div className="p-5 border-b border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#00b4d8]/8 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-[#00b4d8]/15 transition-all"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-lg font-black text-white tracking-tight uppercase mb-0.5">{team.name}</h3>
                      {team.project && (
                        <span className="text-[10px] font-bold text-[#00b4d8]/70 uppercase tracking-widest">
                          ⬡ {team.project}
                        </span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center shrink-0">
                      <Network className="w-5 h-5 text-[#00b4d8]" />
                    </div>
                  </div>
                </div>
                
                {/* Team Body */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  {/* TL Section */}
                  <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Squad Commander (TL)</p>
                    {leader ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00b4d8] to-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-[0_0_15px_rgba(0,180,216,0.4)]">
                          {leaderInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{leader.name || leader.email?.split('@')[0]}</p>
                          <p className="text-[9px] text-[#00b4d8]/70 uppercase tracking-widest font-bold">{leader.role}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-center">
                        <span className="text-xs font-medium text-white/40">No Leader Assigned</span>
                      </div>
                    )}
                  </div>

                  {/* Members Section */}
                  <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{memberUsers.length} Squad Members</p>
                    {memberUsers.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {memberUsers.slice(0, 4).map(member => (
                          <div key={member.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#00b4d8]/40 transition-colors group/chip">
                            <div className="w-5 h-5 rounded-full bg-blue-800 flex items-center justify-center text-[9px] font-black text-blue-200 shrink-0">
                              {(member.name || '').charAt(0)}
                            </div>
                            <span className="text-[10px] font-bold text-white/70 group-hover/chip:text-white truncate max-w-[60px]">{member.name?.split(' ')[0]}</span>
                          </div>
                        ))}
                        {memberUsers.length > 4 && (
                          <div className="flex items-center px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-[10px] font-bold text-white/40">+{memberUsers.length - 4} more</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-white/30 font-medium italic">No members added yet</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto shrink-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      <Users className="w-3 h-3" /> {(team.memberIds?.length || 0) + (leader ? 1 : 0)} Total
                    </div>
                    <button className="text-[10px] font-black text-[#00b4d8] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                      View Dossier →
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Assemble Team Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent relative overflow-hidden shrink-0">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4d8]/10 rounded-full blur-[50px] -mr-20 -mt-20"></div>
                 <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/20 flex items-center justify-center border border-[#00b4d8]/30">
                       <Network className="w-5 h-5 text-[#00b4d8]" />
                     </div>
                     <h2 className="text-xl font-black text-white tracking-widest uppercase">Assemble Team</h2>
                   </div>
                   <button 
                     onClick={() => setIsModalOpen(false)}
                     className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <form id="team-form" onSubmit={handleCreateTeam} className="space-y-6">
                  
                  {error && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold text-center">
                      {error}
                    </div>
                  )}

                  {/* Team Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Team Name Designation</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Alpha Strike, Omega Web"
                      value={newTeam.name}
                      onChange={e => setNewTeam({...newTeam, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium"
                    />
                  </div>

                  {/* Leader Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Assign Team Leader (TL)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {availableUsers.map(u => (
                        <div 
                          key={u.id}
                          onClick={() => setNewTeam({...newTeam, leaderId: u.id})}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${newTeam.leaderId === u.id ? 'bg-[#00b4d8]/20 border-[#00b4d8] shadow-[0_0_15px_rgba(0,180,216,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${u.role === 'mentor' ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-blue-500/20 border-blue-500/50 text-blue-400'}`}>
                            {u.role === 'mentor' ? <Star className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{u.name || u.email.split('@')[0]}</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest truncate">{u.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Members Selection (Optional) */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Select Squad Members (Optional)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                       {availableUsers.filter(u => u.id !== newTeam.leaderId).map(u => (
                          <div 
                            key={u.id}
                            onClick={() => toggleMemberSelection(u.id)}
                            className={`px-3 py-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${newTeam.memberIds.includes(u.id) ? 'bg-white/10 border-white/30' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                          >
                             <div className="flex-1 min-w-0 pr-2">
                               <p className="text-xs font-bold text-white truncate">{u.name || u.email.split('@')[0]}</p>
                             </div>
                             {newTeam.memberIds.includes(u.id) && (
                               <div className="w-4 h-4 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0">
                                 <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                               </div>
                             )}
                          </div>
                       ))}
                    </div>
                  </div>

                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  form="team-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Initialize Team'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
