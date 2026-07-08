import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Package, CheckCircle2, Zap, AlertTriangle, 
  Search, ChevronDown, ChevronUp, User, Clock, Flag, 
  Bell, Trophy, X, FileText, Folder
} from 'lucide-react';
import { tasksAPI, projectsAPI, usersAPI, teamsAPI } from '../api/services';

const getProgressColor = (progress) => {
  if (progress === 100) return '#10b981'; // Emerald
  if (progress >= 50)  return '#f59e0b'; // Amber
  return '#ef4444'; // Red
};

export default function TelemetryView() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState('overall'); // 'overall' or 'projects'
  
  const [moduleFilter, setModuleFilter] = useState('ALL'); // ALL, DONE, ACTIVE, PENDING
  const [moduleSearch, setModuleSearch] = useState('');
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projData, taskData, userData, teamData] = await Promise.all([
        projectsAPI.getAll().catch(() => []),
        tasksAPI.getAll().catch(() => []),
        usersAPI.getAll().catch(() => []),
        teamsAPI.getAll().catch(() => [])
      ]);
      setProjects(projData || []);
      setTasks(taskData || []);
      setUsers(userData || []);
      setTeams(teamData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'No Team Assigned';
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter(t => t.project_id === projectId);
  };

  // Derived Stats
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
  const activeTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'REVIEW').length;
  const totalTasks = tasks.length;
  const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Overall Leaderboard
  const leaderboard = users.map(user => {
    const userTasks = tasks.filter(t => t.assigned_to === user.id);
    const completed = userTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
    return { ...user, completedTasks: completed, totalTasks: userTasks.length };
  }).sort((a, b) => b.completedTasks - a.completedTasks).filter(u => u.completedTasks > 0);

  // Project Leaderboard
  const projectLeaderboard = projects.map(p => {
    const pTasks = getProjectTasks(p.id);
    const pDone = pTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
    const pTotal = pTasks.length;
    const progress = pTotal === 0 ? 0 : Math.round((pDone / pTotal) * 100);
    
    // Calculate health score dynamically based on progress and overdue tasks (real data)
    const overdueTasks = pTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'COMPLETED' && t.status !== 'DONE').length;
    let score = progress;
    if (overdueTasks > 0) {
      score = Math.max(0, progress - overdueTasks * 10);
    }

    const teamMembers = users.filter(u => pTasks.some(t => t.assigned_to === u.id)).map(u => {
      const uTasks = pTasks.filter(t => t.assigned_to === u.id);
      const uDone = uTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
      return {
        ...u,
        progress: uTasks.length === 0 ? 0 : Math.round((uDone / uTasks.length) * 100)
      };
    }).sort((a,b) => b.progress - a.progress);

    return { ...p, progress, score, pDone, pTotal, teamMembers };
  }).sort((a,b) => b.progress - a.progress);

  const getHealthBadge = (score) => {
    if (score >= 70) return { label: 'Healthy', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (score >= 40) return { label: 'At Risk', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    return { label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  const renderLeaderboard = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1c222b] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Student Leaderboard</h2>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Live rankings · Academic Year 2025–26</p>
            </div>
            <button onClick={() => setShowLeaderboard(false)} className="text-white/40 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setLeaderboardTab('overall')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${leaderboardTab === 'overall' ? 'bg-[#00b4d8] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              Overall
            </button>
            <button 
              onClick={() => setLeaderboardTab('projects')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${leaderboardTab === 'projects' ? 'bg-[#00b4d8] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              Projects
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-black/20">
          {leaderboardTab === 'overall' && (
            <div className="space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-white/40 font-medium">No tasks completed yet.</div>
              ) : (
                leaderboard.map((user, idx) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-white/50 border border-white/10">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{user.name}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{user.completedTasks} Modules Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {idx === 0 && <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded text-[10px] font-black uppercase">Top</span>}
                      {idx === 1 && <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 rounded text-[10px] font-black uppercase">Perfect</span>}
                      {idx === 2 && <span className="px-2 py-1 bg-blue-400/20 text-blue-400 border border-blue-400/30 rounded text-[10px] font-black uppercase">Fast</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {leaderboardTab === 'projects' && (
            <div className="space-y-4">
              {projectLeaderboard.length === 0 ? (
                <div className="text-center py-8 text-white/40 font-medium">No projects available.</div>
              ) : (
                projectLeaderboard.map((project, idx) => {
                  const health = getHealthBadge(project.score);
                  return (
                    <div key={project.id} className="bg-[#1c222b] border border-white/10 rounded-2xl p-5 hover:border-[#00b4d8]/30 transition-colors">
                      {/* Top Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 font-bold text-white/70">
                            {idx === 0 ? '1st' : idx === 1 ? '2nd' : idx === 2 ? '3rd' : <Folder className="w-5 h-5 text-white/40" />}
                          </div>
                          <div>
                            <h4 className="font-black text-white">{project.name}</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">{getTeamName(project.team_id)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-black text-white">{project.score}</span>
                          <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${health.color}`}>
                            {health.label}
                          </span>
                        </div>
                      </div>

                      {/* Second Row */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.02] p-4 rounded-xl border border-white/5 mb-4">
                        <div className="flex-1 w-full">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Progress</span>
                            <span className="text-xs font-black text-white">{project.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${project.progress}%`, backgroundColor: getProgressColor(project.progress) }}></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <div>
                            <div className="text-xs font-black text-white">{project.pTotal} Modules</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest">{project.pDone} Done</div>
                          </div>
                          <div className="h-8 w-px bg-white/10"></div>
                          <div className="text-right">
                            <div className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">Overdue</div>
                          </div>
                        </div>
                      </div>

                      {/* Team Rankings Nested Section */}
                      {project.teamMembers.length > 0 && (
                        <div>
                          <h5 className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-3 pl-2">Team Rankings</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {project.teamMembers.map((member, mIdx) => (
                              <div key={member.id} className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <span className="text-[10px] font-black text-white/30">#{mIdx + 1}</span>
                                  <span className="text-xs font-bold text-white/80 truncate">{member.name}</span>
                                </div>
                                <span className="text-[10px] font-black" style={{ color: getProgressColor(member.progress) }}>
                                  {member.progress}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Rankings update in real-time</span>
          <div className="flex gap-2">
            <span className="text-[10px]">Top</span>
            <span className="text-[10px]">Perfect</span>
            <span className="text-[10px]">Fast</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="h-full flex flex-col font-sans text-white pb-6 relative z-10 overflow-hidden">
      
      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Student Project Tracker</h1>
          <p className="text-white/40 mt-1 text-xs font-bold tracking-widest uppercase">Academic Year 2025-26</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-yellow-400/20 transition-colors"
          >
            <Trophy className="w-4 h-4" /> Leaderboard
          </button>
        </div>
      </div>

      {/* OVERALL STATISTICS PANEL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 shrink-0">
        <div className="bg-[#1c222b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{overallProgress}%</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Overall Progress</div>
          </div>
        </div>
        <div className="bg-[#1c222b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <Package className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalTasks}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Total Modules</div>
          </div>
        </div>
        <div className="bg-[#1c222b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{completedTasks}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Completed</div>
          </div>
        </div>
        <div className="bg-[#1c222b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{activeTasks}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">In Progress</div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: PROJECTS OR MODULE DETAILS */}
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          <motion.div 
            key="project-list"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto custom-scrollbar pb-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => {
                const pTasks = getProjectTasks(project.id);
                const pDone = pTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
                const pTotal = pTasks.length;
                const pProgress = pTotal === 0 ? 0 : Math.round((pDone / pTotal) * 100);
                const isOverdue = project.deadline ? new Date(project.deadline) < new Date() && project.status !== 'COMPLETED' : false;

                return (
                  <div 
                    key={project.id} 
                    onClick={() => setSelectedProject(project)}
                    className="bg-[#1c222b] border border-white/10 rounded-2xl p-6 hover:border-[#00b4d8]/50 cursor-pointer transition-all group hover:shadow-[0_10px_30px_rgba(0,180,216,0.1)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#00b4d8]/10 transition-colors pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-black text-white tracking-tight">{project.name}</h3>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-1 bg-white/5 inline-block px-2 py-0.5 rounded border border-white/5">{getTeamName(project.team_id)}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${isOverdue ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                        {isOverdue ? 'Overdue!' : 'In Track'}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Progress</span>
                        <span className="text-xs font-black text-white">{pDone}/{pTotal} Done</span>
                      </div>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pProgress}%`, backgroundColor: getProgressColor(pProgress) }}></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" /> Deadline: {project.deadline || '2026-12-31'}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="module-details"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col h-full bg-[#1c222b] border border-white/10 rounded-[2rem] overflow-hidden"
          >
            {/* Details Header */}
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-white/70 rotate-90" />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{selectedProject.name}</h2>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">{getTeamName(selectedProject.team_id)}</p>
                </div>
              </div>
              
              {/* Circular Gauge */}
              <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-[#00b4d8]" strokeDasharray={`${(getProjectTasks(selectedProject.id).filter(t=>t.status==='COMPLETED'||t.status==='DONE').length / (getProjectTasks(selectedProject.id).length || 1)) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                  <div className="absolute text-[10px] font-black text-white">
                    {Math.round((getProjectTasks(selectedProject.id).filter(t=>t.status==='COMPLETED'||t.status==='DONE').length / (getProjectTasks(selectedProject.id).length || 1)) * 100)}%
                  </div>
                </div>
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Complete</div>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'DONE', 'ACTIVE', 'PENDING'].map(f => (
                  <button 
                    key={f} onClick={() => setModuleFilter(f)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap ${moduleFilter === f ? 'bg-[#00b4d8] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" placeholder="Search modules..."
                  value={moduleSearch} onChange={e => setModuleSearch(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[#00b4d8]/50 transition-colors placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Modules Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                <div className="col-span-5">Module Name & Member</div>
                <div className="col-span-2 text-center">Progress</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Deadline</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              {getProjectTasks(selectedProject.id)
                .filter(t => {
                  if (moduleFilter === 'DONE') return t.status === 'COMPLETED' || t.status === 'DONE';
                  if (moduleFilter === 'ACTIVE') return t.status === 'IN_PROGRESS' || t.status === 'REVIEW';
                  if (moduleFilter === 'PENDING') return t.status === 'TODO';
                  return true;
                })
                .filter(t => t.title.toLowerCase().includes(moduleSearch.toLowerCase()) || getUserName(t.assigned_to).toLowerCase().includes(moduleSearch.toLowerCase()))
                .map(t => {
                  const isDone = t.status === 'COMPLETED' || t.status === 'DONE';
                  const isActive = t.status === 'IN_PROGRESS' || t.status === 'REVIEW';
                  const isExpanded = expandedModule === t.id;
                  const progressValue = isDone ? 100 : isActive ? 50 : 0;

                  return (
                    <div key={t.id} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-white/[0.02] transition-colors">
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <User className="w-4 h-4 text-white/60" />
                          </div>
                          <div className="truncate">
                            <h4 className="text-sm font-bold text-white truncate" title={t.title}>{t.title}</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest truncate">{getUserName(t.assigned_to)}</p>
                          </div>
                        </div>
                        
                        <div className="col-span-2 flex items-center justify-center">
                          <div className="w-full max-w-[80px] h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${progressValue}%`, backgroundColor: getProgressColor(progressValue) }}></div>
                          </div>
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border flex items-center gap-1
                            ${isDone ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              isActive ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                              'bg-white/5 text-white/40 border-white/10'}`}
                          >
                            {isDone ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                          </span>
                        </div>

                        <div className="col-span-2 flex justify-end">
                          <span className="text-[10px] font-bold text-white/50 font-mono">2026-06-15</span>
                        </div>

                        <div className="col-span-1 flex justify-center">
                          <button 
                            onClick={() => setExpandedModule(isExpanded ? null : t.id)}
                            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-white/50 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 bg-black/20"
                          >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> What's Done
                                </h5>
                                <ul className="text-xs font-medium text-white/60 space-y-1 list-disc pl-4">
                                  <li>Initial scaffolding completed</li>
                                  <li>Database schema finalized</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5" /> Going On Now
                                </h5>
                                <ul className="text-xs font-medium text-white/60 space-y-1 list-disc pl-4">
                                  <li>{t.description || 'Integrating frontend components'}</li>
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5" /> Faculty Remarks
                                </h5>
                                <div className="text-xs font-medium text-white/60 italic bg-white/5 p-3 rounded-lg border border-white/10">
                                  "Good progress. Ensure the APIs are well documented before final submission."
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLeaderboard && renderLeaderboard()}
      </AnimatePresence>
    </div>
  );
}
