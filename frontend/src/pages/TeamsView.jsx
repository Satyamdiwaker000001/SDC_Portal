import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Plus, Users, Shield, Star, Code, X, Search, UserPlus, Edit2, Trash2, FolderKanban, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { teamsAPI, usersAPI, projectsAPI } from '../api/services';

export default function TeamsView() {
  const { role, user: currentUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Team Form State
  const [newTeam, setNewTeam] = useState({ name: '', leaderId: '', memberIds: [], projectId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Member search within modal
  const [memberSearch, setMemberSearch] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState('developer'); // 'developer' | 'mentor'

  // Confirmation step
  const [showConfirm, setShowConfirm] = useState(false);

  // Add Member State
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(null);
  const [addMemberData, setAddMemberData] = useState({ user_id: '', designation: 'Frontend Developer' });
  const [addMemberSearch, setAddMemberSearch] = useState('');
  const [addMemberTypeFilter, setAddMemberTypeFilter] = useState('developer');

  // Edit / Delete State
  const [editingTeam, setEditingTeam] = useState(null);
  const [editTeamData, setEditTeamData] = useState({ name: '', description: '', leaderId: '', memberIds: [], projectId: '' });
  const [deletingTeam, setDeletingTeam] = useState(null);

  // Team members cache
  const [teamMembers, setTeamMembers] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tData, uData, pData] = await Promise.all([
        teamsAPI.getAll().catch(() => []),
        usersAPI.getAll().catch(() => []),
        projectsAPI.getAll().catch(() => [])
      ]);
      setTeams(tData || []);
      setUsers(uData || []);
      setProjects(pData || []);
    } catch (err) {
      setTeams([]); setUsers([]); setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId) => {
    try {
      const membersData = await teamsAPI.getMembers(teamId);
      setTeamMembers(prev => ({ ...prev, [teamId]: membersData || [] }));
    } catch (err) {
      setTeamMembers(prev => ({ ...prev, [teamId]: [] }));
    }
  };

  useEffect(() => {
    teams.forEach(team => {
      if (team.id && !teamMembers[team.id]) fetchTeamMembers(team.id);
    });
  }, [teams]);

  // Unassigned projects: no team_id set
  const unassignedProjects = useMemo(() => {
    return projects.filter(p => !p.team_id);
  }, [projects]);

  const handleOpenModal = () => {
    setNewTeam({ name: '', leaderId: '', memberIds: [], projectId: '' });
    setMemberSearch('');
    setMemberTypeFilter('developer');
    setError('');
    setShowConfirm(false);
    setIsModalOpen(true);
  };

  // Step 1: validate → show confirm screen
  const handleProceedToConfirm = (e) => {
    e.preventDefault();
    setError('');
    if (!newTeam.name.trim()) { setError('Team name is required.'); return; }
    if (!newTeam.leaderId) { setError('Please select a Team Leader.'); return; }
    setShowConfirm(true);
  };

  // Step 2: actually create
  const handleConfirmCreate = async () => {
    setIsSubmitting(true);
    try {
      const payload = { name: newTeam.name, leaderId: newTeam.leaderId, memberIds: newTeam.memberIds };
      const created = await teamsAPI.create(payload);
      // If a project was selected, assign the team to it
      if (newTeam.projectId) {
        await projectsAPI.update(newTeam.projectId, { team_id: created.id }).catch(() => {});
        setProjects(prev => prev.map(p => p.id === newTeam.projectId ? { ...p, team_id: created.id } : p));
      }
      setTeams(prev => [...prev, created]);
      await fetchTeamMembers(created.id); // Fetch members immediately so the UI is in sync
      setIsModalOpen(false);
      setShowConfirm(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create team');
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!addMemberData.user_id || !addMemberData.designation) return;
    setIsSubmitting(true);
    try {
      await teamsAPI.addMember(addMemberModalOpen, addMemberData);
      await fetchTeamMembers(addMemberModalOpen);
      setAddMemberModalOpen(null);
      setAddMemberData({ user_id: '', designation: 'Frontend Developer' });
      setAddMemberSearch('');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (!confirm('Remove this member from the team?')) return;
    try {
      await teamsAPI.removeMember(teamId, userId);
      await fetchTeamMembers(teamId);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to remove member');
    }
  };

  const handleEditTeam = async (e) => {
    e.preventDefault();
    if (!editTeamData.name) return;
    
    // Total members: 1 leader + X members
    if (1 + editTeamData.memberIds.length > 5) {
      alert("A team can have a maximum of 5 members (including the leader and mentor).");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await teamsAPI.update(editingTeam.id, { name: editTeamData.name, description: editTeamData.description });
      
      // Update Project
      const currentProjectId = projects.find(p => p.team_id === editingTeam.id)?.id;
      if (editTeamData.projectId !== currentProjectId) {
        if (currentProjectId) {
          await projectsAPI.update(currentProjectId, { team_id: null }).catch(() => {});
          setProjects(prev => prev.map(p => p.id === currentProjectId ? { ...p, team_id: null } : p));
        }
        if (editTeamData.projectId) {
          await projectsAPI.update(editTeamData.projectId, { team_id: editingTeam.id }).catch(() => {});
          setProjects(prev => prev.map(p => p.id === editTeamData.projectId ? { ...p, team_id: editingTeam.id } : p));
        }
      }

      // Update Members
      const oldMembers = teamMembers[editingTeam.id] || [];
      const oldLeader = oldMembers.find(m => m.designation === 'lead');
      const oldMemberIds = oldMembers.filter(m => m.designation !== 'lead').map(m => m.user_id);

      // Handle Leader change
      if (oldLeader && oldLeader.user_id !== editTeamData.leaderId) {
        await teamsAPI.removeMember(editingTeam.id, oldLeader.user_id).catch(() => {});
        if (editTeamData.leaderId) {
          await teamsAPI.addMember(editingTeam.id, { user_id: editTeamData.leaderId, designation: 'lead' }).catch(() => {});
        }
      } else if (!oldLeader && editTeamData.leaderId) {
         await teamsAPI.addMember(editingTeam.id, { user_id: editTeamData.leaderId, designation: 'lead' }).catch(() => {});
      }

      // Handle other members
      const membersToRemove = oldMemberIds.filter(id => !editTeamData.memberIds.includes(id));
      const membersToAdd = editTeamData.memberIds.filter(id => !oldMemberIds.includes(id));

      for (const id of membersToRemove) {
        await teamsAPI.removeMember(editingTeam.id, id).catch(() => {});
      }
      for (const id of membersToAdd) {
        const userDetails = users.find(u => u.id === id);
        const designation = (userDetails && userDetails.role === 'mentor') ? 'mentor' : 'member';
        await teamsAPI.addMember(editingTeam.id, { user_id: id, designation }).catch(() => {});
      }

      await fetchTeamMembers(editingTeam.id);
      
      setTeams(prev => prev.map(t => t.id === updated.id ? { ...t, name: updated.name, description: updated.description } : t));
      setEditingTeam(null);
    } catch (err) {
      alert('Failed to update team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEditMemberSelection = (userId) => {
    setEditTeamData(prev => {
      const current = prev.memberIds;
      return {
        ...prev,
        memberIds: current.includes(userId)
          ? current.filter(id => id !== userId)
          : [...current, userId]
      };
    });
  };

  const handleDeleteTeam = async () => {
    setIsSubmitting(true);
    try {
      await teamsAPI.delete(deletingTeam.id);
      setTeams(prev => prev.filter(t => t.id !== deletingTeam.id));
      setDeletingTeam(null);
    } catch (err) {
      alert('Failed to delete team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMemberSelection = (userId) => {
    setNewTeam(prev => {
      const current = prev.memberIds;
      return {
        ...prev,
        memberIds: current.includes(userId)
          ? current.filter(id => id !== userId)
          : [...current, userId]
      };
    });
  };

  const filteredTeams = useMemo(() => {
    let list = teams;
    if (role !== 'admin') {
      list = list.filter(t => {
        const members = teamMembers[t.id] || [];
        return members.some(m => m.user_id === currentUser?.id);
      });
    }
    return list.filter(t => t.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [teams, searchQuery, teamMembers, role, currentUser]);

  const availableUsers = users.filter(u => u.role !== 'admin' && !u.isPassout);
  const developerUsers = availableUsers.filter(u => u.role === 'developer');
  const mentorUsers = availableUsers.filter(u => u.role === 'mentor');

  // Members list filtered by type + search
  const filteredMembersForCreate = useMemo(() => {
    const pool = memberTypeFilter === 'developer' ? developerUsers : mentorUsers;
    const q = memberSearch.toLowerCase();
    return pool.filter(u =>
      u.id !== newTeam.leaderId &&
      (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
    );
  }, [memberTypeFilter, memberSearch, developerUsers, mentorUsers, newTeam.leaderId]);

  // Add member modal: filtered by type + search
  const filteredUsersForAdd = useMemo(() => {
    const pool = addMemberTypeFilter === 'developer' ? developerUsers : mentorUsers;
    const q = addMemberSearch.toLowerCase();
    return pool.filter(u =>
      !teamMembers[addMemberModalOpen]?.some(m => m.user_id === u.id) &&
      (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
    );
  }, [addMemberTypeFilter, addMemberSearch, developerUsers, mentorUsers, addMemberModalOpen, teamMembers]);

  const getLeaderDetails = (leaderId) => users.find(u => u.id === leaderId) || null;
  const getMemberDetails = (memberId) => users.find(u => u.id === memberId) || null;

  // Confirmation summary data
  const selectedLeader = getLeaderDetails(newTeam.leaderId);
  const selectedProject = projects.find(p => p.id === newTeam.projectId);

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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00b4d8]/50 focus:bg-white/10 transition-all w-full sm:w-64 shadow-inner"
            />
          </div>
          {role === 'admin' && (
            <button
              onClick={handleOpenModal}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00b4d8] to-blue-600 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(0,180,216,0.4)] transition-all sm:hover:-translate-y-1 border border-white/10 uppercase tracking-wider whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Assemble Team
            </button>
          )}
        </div>
      </div>

      {/* Teams Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-white/40 text-xs font-mono">Syncing team roster...</div>
      ) : filteredTeams.length === 0 ? (
        <div className="flex-1 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/40">
          <Network className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-bold tracking-widest uppercase mb-1">No Teams Assembled</p>
          <p className="text-sm opacity-50 text-center max-w-sm">No teams found. Administrators can assemble new teams.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => {
            const members = teamMembers[team.id] || [];
            const leaderMember = members.find(m => m.designation === 'lead');
            const leader = leaderMember ? getLeaderDetails(leaderMember.user_id) : null;
            // Enrich non-lead members with designation
            const memberUsers = members
              .filter(m => m.designation !== 'lead')
              .map(m => ({ ...getMemberDetails(m.user_id), designation: m.designation }))
              .filter(m => m && m.id);
            const mentorChips = memberUsers.filter(m => m.designation === 'mentor');
            const devChips = memberUsers.filter(m => m.designation !== 'mentor');
            const leaderInitials = leader ? (leader.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1c222b] border border-white/8 rounded-3xl overflow-hidden group hover:border-[#00b4d8]/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col"
              >
                <div className="p-5 border-b border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#00b4d8]/8 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-[#00b4d8]/15 transition-all"></div>
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <h3 className="text-lg font-black text-white tracking-tight uppercase mb-0.5">{team.name}</h3>
                      {projects.find(p => p.team_id === team.id) && (
                        <span className="text-[10px] font-bold text-[#00b4d8]/70 uppercase tracking-widest">⬡ {projects.find(p => p.team_id === team.id).name}</span>
                      )}
                    </div>
                    {role === 'admin' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const currentMembers = teamMembers[team.id] || [];
                            const cLeader = currentMembers.find(m => m.designation === 'lead')?.user_id || '';
                            const cMembers = currentMembers.filter(m => m.designation !== 'lead').map(m => m.user_id);
                            const cProject = projects.find(p => p.team_id === team.id)?.id || '';
                            setEditingTeam(team);
                            setEditTeamData({ name: team.name, description: team.description || '', leaderId: cLeader, memberIds: cMembers, projectId: cProject });
                          }}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00b4d8]/20 hover:text-[#00b4d8] hover:border-[#00b4d8]/30 transition-colors text-white/50"
                        ><Edit2 className="w-4 h-4" /></button>
                        <button
                          onClick={() => setDeletingTeam(team)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors text-white/50"
                        ><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-4">
                  {/* Squad Commander */}
                  <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5"><Shield className="w-3 h-3 text-blue-400"/> Squad Commander</p>
                    {leader ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-inner">
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
                        <span className="text-[10px] font-medium text-white/40 italic">No Leader Assigned</span>
                      </div>
                    )}
                  </div>

                  {/* Mentors */}
                  {mentorChips.length > 0 && (
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5"><Star className="w-3 h-3 text-amber-400"/> Mentors ({mentorChips.length})</p>
                      <div className="flex flex-col gap-2">
                        {mentorChips.map(member => (
                          <div key={member.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors group/chip shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[11px] font-black text-white shrink-0 shadow-sm shadow-amber-500/20">
                              ⭐
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-amber-100 truncate">{member.name || member.email?.split('@')[0]}</p>
                              <p className="text-[8px] text-amber-400/80 uppercase tracking-widest font-bold truncate">Project Mentor</p>
                            </div>
                            {role === 'admin' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveMember(team.id, member.id); }}
                                className="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 flex items-center justify-center shrink-0 opacity-0 group-hover/chip:opacity-100 transition-all hover:text-white"
                              ><X className="w-3 h-3" /></button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Developers */}
                  <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5"><Code className="w-3 h-3 text-cyan-400"/> Developers ({devChips.length})</p>
                    {devChips.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {devChips.map(member => (
                          <div key={member.id} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors group/chip shadow-sm">
                            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-black text-cyan-300 shrink-0 border border-slate-600 shadow-inner">
                              {(member.name || '?').charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-slate-200 truncate">{member.name?.split(' ')[0]}</p>
                              <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold truncate">Developer</p>
                            </div>
                            {role === 'admin' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveMember(team.id, member.id); }}
                                className="w-5 h-5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 flex items-center justify-center shrink-0 opacity-0 group-hover/chip:opacity-100 transition-all hover:text-white ml-auto"
                              ><X className="w-3 h-3" /></button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/5 border border-dashed border-white/10 text-center">
                        <p className="text-[10px] text-white/30 font-medium italic">No developers assigned</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto shrink-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      <Users className="w-3 h-3" /> {(members.length || 0) + (leader ? 1 : 0)} Total
                    </div>
                    {role === 'admin' && (
                      <button
                        onClick={() => { setAddMemberModalOpen(team.id); setAddMemberSearch(''); setAddMemberData({ user_id: '', designation: 'Frontend Developer' }); setAddMemberTypeFilter('developer'); }}
                        className="text-[10px] font-black text-[#00b4d8] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 bg-[#00b4d8]/10 px-3 py-1.5 rounded-lg border border-[#00b4d8]/20"
                      >
                        <UserPlus className="w-3 h-3" /> Add Member
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ========== ASSEMBLE TEAM MODAL ========== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4d8]/10 rounded-full blur-[50px] -mr-20 -mt-20"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/20 flex items-center justify-center border border-[#00b4d8]/30">
                      <Network className="w-5 h-5 text-[#00b4d8]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-widest uppercase">Assemble Team</h2>
                      {showConfirm && <p className="text-[10px] text-[#00b4d8] font-bold uppercase tracking-widest mt-0.5">Step 2 — Confirm & Initialize</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsModalOpen(false); setShowConfirm(false); }}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  ><X className="w-4 h-4" /></button>
                </div>
              </div>

              {/* ---- STEP 1: FORM ---- */}
              {!showConfirm ? (
                <>
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    {error && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center flex items-center gap-2 justify-center">
                        <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                      </div>
                    )}

                    {/* Team Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Team Codename *</label>
                      <input
                        type="text"
                        placeholder="e.g. Alpha Strike, Omega Web"
                        value={newTeam.name}
                        onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium"
                      />
                    </div>

                    {/* Leader */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Assign Team Leader (TL) *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                        {developerUsers.map(u => (
                          <div
                            key={u.id}
                            onClick={() => setNewTeam({ ...newTeam, leaderId: u.id })}
                            className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${newTeam.leaderId === u.id ? 'bg-[#00b4d8]/20 border-[#00b4d8] shadow-[0_0_15px_rgba(0,180,216,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0 bg-blue-500/20 border-blue-500/50 text-blue-400">
                              <Code className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{u.name || u.email?.split('@')[0]}</p>
                              <p className="text-[9px] text-white/40 uppercase tracking-widest truncate">{u.role}</p>
                            </div>
                            {newTeam.leaderId === u.id && <CheckCircle2 className="w-4 h-4 text-[#00b4d8] shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Members — type filter + search */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Add Squad Members (Optional)</label>

                      {/* Type Toggle */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setMemberTypeFilter('developer')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${memberTypeFilter === 'developer' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                        >
                          <Code className="w-3 h-3" /> Developers ({developerUsers.filter(u => u.id !== newTeam.leaderId).length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMemberTypeFilter('mentor')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${memberTypeFilter === 'mentor' ? 'bg-sky-500/20 border-sky-500/40 text-sky-300' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                        >
                          <Star className="w-3 h-3" /> Mentors ({mentorUsers.filter(u => u.id !== newTeam.leaderId).length})
                        </button>
                      </div>

                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                        <input
                          type="text"
                          placeholder={`Search ${memberTypeFilter}s...`}
                          value={memberSearch}
                          onChange={e => setMemberSearch(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00b4d8] transition-all"
                        />
                      </div>

                      {/* User Chips List */}
                      <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                        {filteredMembersForCreate.length === 0 ? (
                          <p className="text-[10px] text-white/30 italic text-center py-4">No {memberTypeFilter}s found</p>
                        ) : filteredMembersForCreate.map(u => (
                          <div
                            key={u.id}
                            onClick={() => toggleMemberSelection(u.id)}
                            className={`px-3 py-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${newTeam.memberIds.includes(u.id) ? 'bg-[#00b4d8]/10 border-[#00b4d8]/40 text-white' : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-white/70'}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${memberTypeFilter === 'mentor' ? 'bg-sky-500/20 text-sky-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                {(u.name || '?').charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate">{u.name || u.email?.split('@')[0]}</p>
                                <p className="text-[9px] text-white/30 truncate">{u.email}</p>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${newTeam.memberIds.includes(u.id) ? 'bg-[#00b4d8] border-[#00b4d8]' : 'border-white/20'}`}>
                              {newTeam.memberIds.includes(u.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>

                      {newTeam.memberIds.length > 0 && (
                        <p className="text-[10px] text-[#00b4d8] font-bold">{newTeam.memberIds.length} member(s) selected</p>
                      )}
                    </div>

                    {/* Unassigned Project Selection */}
                    {unassignedProjects.length > 0 && (
                      <div className="space-y-3 pt-2 border-t border-white/10">
                        <div>
                           <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Assign to Unlinked Project (Optional)</label>
                           <p className="text-[9px] text-white/30 ml-1 mt-1">These projects currently have no team assigned.</p>
                        </div>
                        <div className="space-y-1.5 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                          {/* None option */}
                          <div
                            onClick={() => setNewTeam({ ...newTeam, projectId: '' })}
                            className={`px-3 py-2 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${!newTeam.projectId ? 'bg-white/10 border-white/30' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                          >
                            <X className="w-3.5 h-3.5 text-white/40" />
                            <span className="text-xs font-bold text-white/40">No Project (Assign Later)</span>
                          </div>
                          {unassignedProjects.map(p => (
                            <div
                              key={p.id}
                              onClick={() => setNewTeam({ ...newTeam, projectId: p.id })}
                              className={`px-3 py-2 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${newTeam.projectId === p.id ? 'bg-[#00b4d8]/10 border-[#00b4d8]/40 text-white' : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-white/70'}`}
                            >
                              <FolderKanban className={`w-3.5 h-3.5 shrink-0 ${newTeam.projectId === p.id ? 'text-[#00b4d8]' : 'text-white/30'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{p.name}</p>
                                <p className="text-[9px] text-white/30 uppercase tracking-wider">{p.type} · {p.status}</p>
                              </div>
                              {newTeam.projectId === p.id && <CheckCircle2 className="w-4 h-4 text-[#00b4d8] shrink-0" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider"
                    >Cancel</button>
                    <button
                      type="button"
                      onClick={handleProceedToConfirm}
                      className="px-6 py-2.5 rounded-xl bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2"
                    >
                      Review & Confirm →
                    </button>
                  </div>
                </>
              ) : (
                /* ---- STEP 2: CONFIRMATION ---- */
                <>
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
                    <div className="p-4 rounded-2xl bg-[#00b4d8]/5 border border-[#00b4d8]/20 space-y-4">
                      <p className="text-[10px] font-black text-[#00b4d8] uppercase tracking-widest">Review before initializing:</p>

                      <div className="flex items-center gap-3">
                        <Network className="w-4 h-4 text-white/50 shrink-0" />
                        <div>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest">Team Name</p>
                          <p className="text-sm font-black text-white">{newTeam.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-white/50 shrink-0" />
                        <div>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest">Team Leader</p>
                          <p className="text-sm font-black text-white">{selectedLeader?.name || '—'} <span className="text-[#00b4d8] font-bold text-xs">({selectedLeader?.role})</span></p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest">Members ({newTeam.memberIds.length})</p>
                          {newTeam.memberIds.length === 0 ? (
                            <p className="text-xs text-white/30 italic">None — can add later</p>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {newTeam.memberIds.map(id => {
                                const u = users.find(x => x.id === id);
                                return u ? (
                                  <span key={id} className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-bold">{u.name?.split(' ')[0]}</span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <FolderKanban className="w-4 h-4 text-white/50 shrink-0" />
                        <div>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest">Project Assignment</p>
                          <p className="text-sm font-black text-white">{selectedProject ? selectedProject.name : <span className="text-white/30 italic font-normal text-xs">No project selected</span>}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-white/40 text-center">Once confirmed, the team will be initialized in the system. You can still edit it afterwards.</p>
                  </div>

                  <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowConfirm(false)}
                      className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider"
                    >← Back</button>
                    <button
                      type="button"
                      onClick={handleConfirmCreate}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Initializing...' : '✓ Initialize Team'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== EDIT TEAM MODAL ========== */}
      <AnimatePresence>
        {editingTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditingTeam(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#00b4d8]/20 to-transparent relative overflow-hidden shrink-0">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/20 flex items-center justify-center border border-[#00b4d8]/30"><Edit2 className="w-5 h-5 text-[#00b4d8]" /></div>
                    <h2 className="text-xl font-black text-white tracking-widest uppercase">Edit Team Configuration</h2>
                  </div>
                  <button onClick={() => setEditingTeam(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                <form id="edit-team-form" onSubmit={handleEditTeam} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Team Name</label>
                    <input type="text" required value={editTeamData.name} onChange={e => setEditTeamData({ ...editTeamData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] transition-all font-medium text-sm" />
                  </div>

                  {/* Leader */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Assign Team Leader (TL) *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                      {developerUsers.map(u => (
                        <div
                          key={u.id}
                          onClick={() => setEditTeamData({ ...editTeamData, leaderId: u.id })}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${editTeamData.leaderId === u.id ? 'bg-[#00b4d8]/20 border-[#00b4d8] shadow-[0_0_15px_rgba(0,180,216,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0 bg-blue-500/20 border-blue-500/50 text-blue-400">
                            <Code className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{u.name || u.email?.split('@')[0]}</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest truncate">{u.role}</p>
                          </div>
                          {editTeamData.leaderId === u.id && <CheckCircle2 className="w-4 h-4 text-[#00b4d8] shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mentors Selection */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <label className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Star className="w-3 h-3"/> Select Mentors</label>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                      {availableUsers.filter(u => u.id !== editTeamData.leaderId && u.role === 'mentor').map(u => (
                        <div
                          key={u.id}
                          onClick={() => toggleEditMemberSelection(u.id)}
                          className={`px-3 py-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${editTeamData.memberIds.includes(u.id) ? 'bg-amber-500/10 border-amber-500/40 text-white' : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-white/70'}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 bg-sky-500/20 text-sky-300">
                              {(u.name || '?').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{u.name || u.email?.split('@')[0]}</p>
                              <p className="text-[9px] text-white/30 uppercase tracking-widest">Mentor</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${editTeamData.memberIds.includes(u.id) ? 'bg-amber-500 border-amber-500' : 'border-white/20'}`}>
                            {editTeamData.memberIds.includes(u.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Developers Selection */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <label className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Code className="w-3 h-3"/> Select Developers</label>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                      {availableUsers.filter(u => u.id !== editTeamData.leaderId && u.role !== 'mentor').map(u => (
                        <div
                          key={u.id}
                          onClick={() => toggleEditMemberSelection(u.id)}
                          className={`px-3 py-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${editTeamData.memberIds.includes(u.id) ? 'bg-[#00b4d8]/10 border-[#00b4d8]/40 text-white' : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-white/70'}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 bg-blue-500/20 text-blue-300">
                              {(u.name || '?').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{u.name || u.email?.split('@')[0]}</p>
                              <p className="text-[9px] text-white/30 uppercase tracking-widest">Developer</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${editTeamData.memberIds.includes(u.id) ? 'bg-[#00b4d8] border-[#00b4d8]' : 'border-white/20'}`}>
                            {editTeamData.memberIds.includes(u.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      ))}
                    </div>
                    {editTeamData.memberIds.length > 0 && (
                      <p className={`text-[10px] font-bold ${1 + editTeamData.memberIds.length > 5 ? 'text-red-400' : 'text-[#00b4d8]'}`}>{editTeamData.memberIds.length} member(s) selected (Total: {1 + editTeamData.memberIds.length}/5)</p>
                    )}
                  </div>

                  {/* Project Assignment */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Change / Assign Project</label>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                      <div
                        onClick={() => setEditTeamData({ ...editTeamData, projectId: '' })}
                        className={`px-3 py-2 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${!editTeamData.projectId ? 'bg-[#00b4d8]/10 border-[#00b4d8]/40' : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-white/70'}`}
                      >
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-bold">Unassigned (No Project)</span>
                        {!editTeamData.projectId && <CheckCircle2 className="w-4 h-4 text-[#00b4d8] ml-auto shrink-0" />}
                      </div>
                      {projects.filter(p => !p.team_id || p.team_id === editingTeam.id).map(p => (
                        <div
                          key={p.id}
                          onClick={() => setEditTeamData({ ...editTeamData, projectId: p.id })}
                          className={`px-3 py-2 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${editTeamData.projectId === p.id ? 'bg-[#00b4d8]/10 border-[#00b4d8]/40 text-white' : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-white/70'}`}
                        >
                          <FolderKanban className={`w-3.5 h-3.5 shrink-0 ${editTeamData.projectId === p.id ? 'text-[#00b4d8]' : 'text-white/30'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{p.name}</p>
                            <p className="text-[9px] text-white/30 uppercase tracking-wider">{p.type}</p>
                          </div>
                          {editTeamData.projectId === p.id && <CheckCircle2 className="w-4 h-4 text-[#00b4d8] shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-5 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setEditingTeam(null)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider">Cancel</button>
                <button form="edit-team-form" type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] transition-all text-sm font-black uppercase tracking-widest disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== DELETE CONFIRMATION MODAL ========== */}
      <AnimatePresence>
        {deletingTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setDeletingTeam(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-[#0f172a] border border-red-500/30 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
              <h2 className="text-xl font-black text-white tracking-widest uppercase mb-2">Delete Team?</h2>
              <p className="text-sm text-white/60 mb-6">Are you sure you want to delete <span className="text-white font-bold">{deletingTeam.name}</span>? This cannot be undone. Associated projects will lose their team assignment.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeletingTeam(null)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider flex-1">Cancel</button>
                <button onClick={handleDeleteTeam} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all text-sm font-black uppercase tracking-widest flex-1 disabled:opacity-50">{isSubmitting ? 'Deleting...' : 'Delete Team'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== ADD MEMBER TO EXISTING TEAM MODAL ========== */}
      <AnimatePresence>
        {addMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setAddMemberModalOpen(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#00b4d8]/20 to-transparent relative overflow-hidden shrink-0">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/20 flex items-center justify-center border border-[#00b4d8]/30"><UserPlus className="w-5 h-5 text-[#00b4d8]" /></div>
                    <h2 className="text-lg font-black text-white tracking-widest uppercase">Assign Member</h2>
                  </div>
                  <button onClick={() => setAddMemberModalOpen(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <form id="add-member-form" onSubmit={handleAddMember} className="space-y-4">

                  {/* Type Toggle */}
                  <div>
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1 block mb-2">Member Type</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setAddMemberTypeFilter('developer'); setAddMemberData({ ...addMemberData, user_id: '' }); setAddMemberSearch(''); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${addMemberTypeFilter === 'developer' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
                        <Code className="w-3 h-3" /> Developer
                      </button>
                      <button type="button" onClick={() => { setAddMemberTypeFilter('mentor'); setAddMemberData({ ...addMemberData, user_id: '' }); setAddMemberSearch(''); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${addMemberTypeFilter === 'mentor' ? 'bg-sky-500/20 border-sky-500/40 text-sky-300' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
                        <Star className="w-3 h-3" /> Mentor
                      </button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input
                      type="text"
                      placeholder={`Search ${addMemberTypeFilter}s...`}
                      value={addMemberSearch}
                      onChange={e => setAddMemberSearch(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00b4d8] transition-all"
                    />
                  </div>

                  {/* User List */}
                  <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                    {filteredUsersForAdd.length === 0 ? (
                      <p className="text-[10px] text-white/30 italic text-center py-6">No {addMemberTypeFilter}s available to add</p>
                    ) : filteredUsersForAdd.map(u => (
                      <div
                        key={u.id}
                        onClick={() => setAddMemberData({ ...addMemberData, user_id: u.id })}
                        className={`px-3 py-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${addMemberData.user_id === u.id ? 'bg-[#00b4d8]/10 border-[#00b4d8]/40' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${addMemberTypeFilter === 'mentor' ? 'bg-sky-500/20 text-sky-300' : 'bg-blue-500/20 text-blue-300'}`}>
                          {(u.name || '?').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{u.name || u.email?.split('@')[0]}</p>
                          <p className="text-[9px] text-white/30 truncate">{u.email}</p>
                        </div>
                        {addMemberData.user_id === u.id && <CheckCircle2 className="w-4 h-4 text-[#00b4d8] shrink-0" />}
                      </div>
                    ))}
                  </div>

                  {/* Designation */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Designation *</label>
                    <input
                      type="text" required
                      placeholder="e.g. Frontend Developer, UI Designer"
                      value={addMemberData.designation}
                      onChange={e => setAddMemberData({ ...addMemberData, designation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] transition-all font-medium text-sm"
                    />
                  </div>

                </form>
              </div>

              <div className="p-5 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setAddMemberModalOpen(null)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider">Cancel</button>
                <button form="add-member-form" type="submit" disabled={isSubmitting || !addMemberData.user_id} className="px-5 py-2.5 rounded-xl bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] transition-all text-sm font-black uppercase tracking-widest disabled:opacity-50">{isSubmitting ? 'Adding...' : 'Add Member'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(0,180,216,0.4)}`}</style>
    </div>
  );
}