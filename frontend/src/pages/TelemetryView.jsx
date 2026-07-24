import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Package, CheckCircle2, Zap, AlertTriangle, 
  Search, ChevronDown, ChevronUp, User, Clock, Flag, 
  Trophy, X, FileText, Folder, Plus, Send, ExternalLink,
  ShieldAlert, UserCheck, Layers, Filter, CheckSquare, RefreshCw, AlertCircle
} from 'lucide-react';
import { tasksAPI, projectsAPI, usersAPI, teamsAPI } from '../api/services';
import { useAuth } from '../contexts/AuthContext';

const getProgressColor = (progress) => {
  if (progress === 100) return '#10b981'; // Emerald
  if (progress >= 50)  return '#f59e0b'; // Amber
  return '#ef4444'; // Red
};

export default function TelemetryView() {
  const { user, role } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState('overall'); // 'overall' or 'projects'
  
  const [moduleFilter, setModuleFilter] = useState('ALL'); // ALL, DONE, IN_PROGRESS, PENDING_VERIFICATION, PENDING
  const [selectedDevFilter, setSelectedDevFilter] = useState('ALL');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('ALL');
  const [moduleSearch, setModuleSearch] = useState('');
  const [expandedModule, setExpandedModule] = useState(null);

  // Phase & Team Member breakdown for selected project
  const [selectedProjectPhases, setSelectedProjectPhases] = useState([]);
  const [selectedProjectTeamMembers, setSelectedProjectTeamMembers] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Modal states for module creation & progress update
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const [createModuleData, setCreateModuleData] = useState({
    phase_id: '',
    assigned_to: '',
    title: '',
    description: '',
    due_date: ''
  });
  const [isSubmittingModule, setIsSubmittingModule] = useState(false);

  const [submitTaskModal, setSubmitTaskModal] = useState(null);
  const [submissionUrls, setSubmissionUrls] = useState({ url: '', demo: '' });
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

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

  useEffect(() => {
    if (selectedProject) {
      setIsLoadingDetails(true);
      setSelectedPhaseFilter('ALL');
      setSelectedDevFilter('ALL');

      Promise.all([
        projectsAPI.getPhases(selectedProject.id).catch(() => []),
        selectedProject.team_id ? teamsAPI.getMembers(selectedProject.team_id).catch(() => []) : Promise.resolve([])
      ]).then(([phases, members]) => {
        setSelectedProjectPhases(phases || []);
        
        // Enrich members with user details
        const enrichedMembers = (members || []).map(m => {
          const uDetail = users.find(u => u.id === m.user_id);
          return {
            ...m,
            name: uDetail ? uDetail.name : `User ${m.user_id.substring(0, 4)}`,
            email: uDetail ? uDetail.email : '',
            role: uDetail ? uDetail.role : 'developer'
          };
        });
        setSelectedProjectTeamMembers(enrichedMembers);
      }).finally(() => setIsLoadingDetails(false));
    } else {
      setSelectedProjectPhases([]);
      setSelectedProjectTeamMembers([]);
      setSelectedDevFilter('ALL');
      setSelectedPhaseFilter('ALL');
    }
  }, [selectedProject, users]);

  const getUserName = (userId) => {
    const u = users.find(x => x.id === userId);
    return u ? u.name : 'Unassigned';
  };

  const getTeamName = (teamId) => {
    const t = teams.find(x => x.id === teamId);
    return t ? t.name : 'No Team Assigned';
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter(t => t.project_id === projectId);
  };

  // Check if current user is Team Leader of selected project's team
  const isTeamLeader = useMemo(() => {
    if (!selectedProject || !selectedProject.team_id || !user) return false;
    const member = selectedProjectTeamMembers.find(m => m.user_id === user.id);
    return member && member.designation === 'lead';
  }, [selectedProject, selectedProjectTeamMembers, user]);

  const canCreateModule = role === 'admin' || role === 'mentor' || isTeamLeader;

  // Handler to create & assign a module
  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!selectedProject || !createModuleData.phase_id || !createModuleData.assigned_to || !createModuleData.title) return;
    setIsSubmittingModule(true);
    try {
      await tasksAPI.create({
        project_id: selectedProject.id,
        phase_id: createModuleData.phase_id,
        assigned_to: createModuleData.assigned_to,
        title: createModuleData.title,
        description: createModuleData.description || null,
        due_date: createModuleData.due_date || null
      });
      setCreateModuleData({ phase_id: '', assigned_to: '', title: '', description: '', due_date: '' });
      setShowCreateModuleModal(false);
      
      // Refresh tasks and phases
      const updatedTasks = await tasksAPI.getAll().catch(() => []);
      setTasks(updatedTasks);
      const updatedPhases = await projectsAPI.getPhases(selectedProject.id).catch(() => []);
      setSelectedProjectPhases(updatedPhases);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create module");
    } finally {
      setIsSubmittingModule(false);
    }
  };

  // Developer action: Start assigned module
  const handleStartModule = async (taskId) => {
    try {
      await tasksAPI.updateStatus(taskId, 'IN_PROGRESS');
      const updatedTasks = await tasksAPI.getAll().catch(() => []);
      setTasks(updatedTasks);
      if (selectedProject) {
        const updatedPhases = await projectsAPI.getPhases(selectedProject.id).catch(() => []);
        setSelectedProjectPhases(updatedPhases);
      }
    } catch (err) {
      alert("Failed to start module");
    }
  };

  // Developer action: Submit code output for review
  const handleSubmitModuleCode = async (e) => {
    e.preventDefault();
    if (!submitTaskModal || !submissionUrls.url) return;
    setIsSubmittingCode(true);
    try {
      await tasksAPI.submit(submitTaskModal.id, {
        submission_url: submissionUrls.url,
        submission_demo_url: submissionUrls.demo || null
      });
      setSubmitTaskModal(null);
      setSubmissionUrls({ url: '', demo: '' });

      const updatedTasks = await tasksAPI.getAll().catch(() => []);
      setTasks(updatedTasks);
      if (selectedProject) {
        const updatedPhases = await projectsAPI.getPhases(selectedProject.id).catch(() => []);
        setSelectedProjectPhases(updatedPhases);
      }
    } catch (err) {
      alert("Failed to submit module output");
    } finally {
      setIsSubmittingCode(false);
    }
  };

  // Stats calculations
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
  const activeTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const reviewTasks = tasks.filter(t => t.status === 'PENDING_VERIFICATION').length;
  const totalTasks = tasks.length;
  const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Leaderboard data
  const leaderboard = users.map(u => {
    const userTasks = tasks.filter(t => t.assigned_to === u.id);
    const completed = userTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
    return { ...u, completedTasks: completed, totalTasks: userTasks.length };
  }).sort((a, b) => b.completedTasks - a.completedTasks).filter(u => u.completedTasks > 0);

  const projectLeaderboard = projects.map(p => {
    const pTasks = getProjectTasks(p.id);
    const pDone = pTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
    const pTotal = pTasks.length;
    const progress = pTotal === 0 ? 0 : Math.round((pDone / pTotal) * 100);
    
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

  const renderLeaderboardModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1c222b] border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Student Leaderboard</h2>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Live rankings · Real-time Module Tracker</p>
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
              Overall Members
            </button>
            <button 
              onClick={() => setLeaderboardTab('projects')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${leaderboardTab === 'projects' ? 'bg-[#00b4d8] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              Projects Standings
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-black/20">
          {leaderboardTab === 'overall' && (
            <div className="space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-white/40 font-medium">No verified completed tasks recorded yet.</div>
              ) : (
                leaderboard.map((u, idx) => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-white/50 border border-white/10">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{u.name}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{u.completedTasks} Modules Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#00b4d8] mr-2">{u.performance_score || 0} PTS</span>
                      {idx === 0 && <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded text-[10px] font-black uppercase">Top</span>}
                      {idx === 1 && <span className="px-2 py-1 bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 rounded text-[10px] font-black uppercase">Star</span>}
                      {idx === 2 && <span className="px-2 py-1 bg-blue-400/20 text-blue-400 border border-blue-400/30 rounded text-[10px] font-black uppercase">Active</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {leaderboardTab === 'projects' && (
            <div className="space-y-4 pt-2">
              {projectLeaderboard.length === 0 ? (
                <div className="text-center py-8 text-white/40 font-medium">No active projects found.</div>
              ) : (
                projectLeaderboard.map((p, idx) => {
                  const health = getHealthBadge(p.score);
                  return (
                    <div key={p.id} className="bg-[#1c222b] border border-white/10 rounded-2xl p-5 hover:border-[#00b4d8]/30 transition-colors space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 font-bold text-white/70">
                            #{idx + 1}
                          </div>
                          <div>
                            <h4 className="font-black text-white">{p.name}</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">{getTeamName(p.team_id)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-black text-white">{p.score} PTS</span>
                          <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${health.color}`}>
                            {health.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        <div className="flex-1 w-full">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Project Completion</span>
                            <span className="text-xs font-black text-white">{p.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: getProgressColor(p.progress) }}></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <div>
                            <div className="text-xs font-black text-white">{p.pTotal} Modules</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest">{p.pDone} Verified</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col font-sans text-white pb-12 relative z-10 overflow-y-auto custom-scrollbar pr-1">
      
      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#00b4d8]/10 border border-[#00b4d8]/20 rounded-full mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse"></div>
            <span className="text-[#00b4d8] text-[9px] uppercase tracking-widest font-bold">Live System Telemetry</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Student Project Tracker & Telemetry</h1>
          <p className="text-white/40 mt-1 text-xs font-bold tracking-widest uppercase">Per-Developer Progress & SDLC Module Tracker</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Refresh Telemetry Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-yellow-400/20 transition-colors shadow-lg shadow-yellow-400/10"
          >
            <Trophy className="w-4 h-4" /> Leaderboard & Rankings
          </button>
        </div>
      </div>

      {/* OVERALL STATISTICS PANEL */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 shrink-0">
        <div className="bg-[#1c222b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shrink-0">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{overallProgress}%</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Overall Progress</div>
          </div>
        </div>
        
        <div className="bg-[#1c222b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
            <Package className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalTasks}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Total Modules</div>
          </div>
        </div>

        <div className="bg-[#1c222b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{completedTasks}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Verified Done</div>
          </div>
        </div>

        <div className="bg-[#1c222b] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{activeTasks}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">In Progress</div>
          </div>
        </div>

        <div className="bg-[#1c222b] p-5 rounded-2xl border border-white/10 flex items-center gap-4 col-span-2 md:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{reviewTasks}</div>
            <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Awaiting Review</div>
          </div>
        </div>
      </div>

      {/* MAIN VIEW: PROJECT LIST OR SELECTED DETAILED VIEW */}
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          <motion.div 
            key="project-list"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex-1 pb-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => {
                const pTasks = getProjectTasks(project.id);
                const pDone = pTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
                const pTotal = pTasks.length;
                const pProgress = pTotal === 0 ? 0 : Math.round((pDone / pTotal) * 100);
                const isOverdue = project.deadline ? new Date(project.deadline) < new Date() && project.status !== 'COMPLETED' : false;

                // Unique developers assigned in this project
                const assignedDevIds = Array.from(new Set(pTasks.map(t => t.assigned_to).filter(Boolean)));

                return (
                  <div 
                    key={project.id} 
                    onClick={() => setSelectedProject(project)}
                    className="bg-[#1c222b] border border-white/10 rounded-3xl p-6 hover:border-[#00b4d8]/50 cursor-pointer transition-all group hover:shadow-[0_10px_30px_rgba(0,180,216,0.15)] relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#00b4d8]/10 transition-colors pointer-events-none"></div>
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-[#00b4d8] mb-1.5 inline-block">{project.type || 'Project'}</span>
                          <h3 className="text-lg font-black text-white tracking-tight leading-snug">{project.name}</h3>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-1 bg-white/5 inline-block px-2.5 py-0.5 rounded border border-white/5">{getTeamName(project.team_id)}</p>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${isOverdue ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                          {isOverdue ? 'Overdue!' : 'Active'}
                        </div>
                      </div>

                      <div className="mb-6 bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Progress</span>
                          <span className="text-xs font-black text-white font-mono">{pDone}/{pTotal} Modules ({pProgress}%)</span>
                        </div>
                        <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pProgress}%`, backgroundColor: getProgressColor(pProgress) }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#00b4d8]" /> {assignedDevIds.length} Developers
                      </div>
                      <div className="flex items-center gap-1.5 text-white/50">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> {project.deadline || '2026-12-31'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* SELECTED PROJECT DETAILED TELEMETRY VIEW                  */
          /* ========================================================= */
          <motion.div 
            key="module-details"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-[#1c222b] border border-white/10 rounded-[2.5rem] overflow-visible shadow-2xl"
          >
            {/* Details Header */}
            <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  title="Back to Projects List"
                >
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#00b4d8] uppercase tracking-widest bg-[#00b4d8]/10 px-2 py-0.5 rounded border border-[#00b4d8]/20">{selectedProject.type || 'Project'}</span>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{getTeamName(selectedProject.team_id)}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase mt-0.5">{selectedProject.name}</h2>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                {canCreateModule && (
                  <button 
                    onClick={() => {
                      if (selectedProjectPhases.length > 0) {
                        const unlockedPhase = selectedProjectPhases.find(p => p.is_unlocked && !p.is_completed) || selectedProjectPhases[0];
                        setCreateModuleData(prev => ({ ...prev, phase_id: unlockedPhase ? unlockedPhase.id : '' }));
                      }
                      setShowCreateModuleModal(true);
                    }}
                    className="px-4 py-2.5 bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-lg shadow-[#00b4d8]/20 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Create & Assign Module
                  </button>
                )}

                {/* Circular Gauge */}
                <div className="flex items-center gap-3 bg-black/30 px-4 py-2.5 rounded-2xl border border-white/5">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-[#00b4d8]" strokeDasharray={`${(getProjectTasks(selectedProject.id).filter(t=>t.status==='COMPLETED'||t.status==='DONE').length / (getProjectTasks(selectedProject.id).length || 1)) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <div className="absolute text-[9px] font-black text-white font-mono">
                      {Math.round((getProjectTasks(selectedProject.id).filter(t=>t.status==='COMPLETED'||t.status==='DONE').length / (getProjectTasks(selectedProject.id).length || 1)) * 100)}%
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-white font-black uppercase tracking-wider">Overall Completion</div>
                    <div className="text-[9px] text-white/40 font-mono">
                      {getProjectTasks(selectedProject.id).filter(t=>t.status==='COMPLETED'||t.status==='DONE').length} / {getProjectTasks(selectedProject.id).length} Modules
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== EVERY DEVELOPER'S PROGRESS BREAKDOWN PANEL ===== */}
            <div className="px-6 py-5 border-b border-white/5 bg-black/20">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] font-black text-[#00b4d8] uppercase tracking-[0.2em] flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> Team Developers Performance & Individual Progress
                </p>
                {selectedDevFilter !== 'ALL' && (
                  <button 
                    onClick={() => setSelectedDevFilter('ALL')}
                    className="text-[9px] font-bold text-white/40 hover:text-white uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded border border-white/10"
                  >
                    Clear Developer Filter
                  </button>
                )}
              </div>

              {selectedProjectTeamMembers.length === 0 ? (
                <div className="text-xs text-white/40 py-2">No team members assigned to this project team yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {selectedProjectTeamMembers.map(dev => {
                    const devTasks = getProjectTasks(selectedProject.id).filter(t => t.assigned_to === dev.user_id);
                    const devDone = devTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
                    const devActive = devTasks.filter(t => t.status === 'IN_PROGRESS').length;
                    const devTotal = devTasks.length;
                    const devProgress = devTotal === 0 ? 0 : Math.round((devDone / devTotal) * 100);
                    const isSelectedDev = selectedDevFilter === dev.user_id;

                    return (
                      <div 
                        key={dev.id} 
                        onClick={() => setSelectedDevFilter(isSelectedDev ? 'ALL' : dev.user_id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelectedDev 
                            ? 'bg-[#00b4d8]/20 border-[#00b4d8] shadow-lg shadow-[#00b4d8]/10 ring-2 ring-[#00b4d8]/30' 
                            : 'bg-black/30 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white/80 shrink-0 border border-white/10">
                              {dev.name.charAt(0)}
                            </div>
                            <div className="truncate">
                              <h4 className="text-xs font-black text-white truncate">{dev.name}</h4>
                              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block">{dev.designation === 'lead' ? 'Team Leader' : 'Developer'}</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-black text-white shrink-0">{devProgress}%</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-2">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${devProgress}%`, backgroundColor: getProgressColor(devProgress) }}></div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-mono text-white/40 pt-1 border-t border-white/5">
                          <span>Modules: <strong className="text-white">{devTotal}</strong></span>
                          <span className="text-emerald-400">{devDone} Done</span>
                          <span className="text-amber-400">{devActive} Active</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ===== INTERACTIVE SDLC PHASE BREAKDOWN PIPELINE ===== */}
            {selectedProjectPhases.length > 0 && (
              <div className="px-6 py-4 border-b border-white/5 bg-black/10">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#00b4d8]" /> SDLC Phase Pipeline (Click phase to filter modules)
                  </p>
                  {selectedPhaseFilter !== 'ALL' && (
                    <button 
                      onClick={() => setSelectedPhaseFilter('ALL')}
                      className="text-[9px] font-bold text-[#00b4d8] hover:underline uppercase tracking-widest bg-[#00b4d8]/10 px-2 py-0.5 rounded border border-[#00b4d8]/20"
                    >
                      Clear Phase Filter (Showing All)
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                  {selectedProjectPhases.map(phase => {
                    const phaseTasks = tasks.filter(t => t.phase_id === phase.id && t.project_id === selectedProject.id);
                    const phaseDone = phaseTasks.filter(t => t.status === 'COMPLETED' || t.status === 'DONE').length;
                    const phaseTotal = phaseTasks.length;
                    const phaseProgress = phaseTotal === 0 ? (phase.progress || 0) : Math.round((phaseDone / phaseTotal) * 100);
                    const isSelectedPhase = selectedPhaseFilter === phase.id;

                    return (
                      <div 
                        key={phase.id} 
                        onClick={() => setSelectedPhaseFilter(isSelectedPhase ? 'ALL' : phase.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelectedPhase
                            ? 'bg-[#00b4d8]/20 border-[#00b4d8] shadow-lg shadow-[#00b4d8]/10 ring-2 ring-[#00b4d8]/30'
                            : phase.is_completed
                            ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50'
                            : phase.is_unlocked
                            ? 'bg-[#00b4d8]/5 border-[#00b4d8]/20 hover:border-[#00b4d8]/50'
                            : 'bg-white/[0.01] border-white/5 opacity-50 hover:opacity-80'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">P{phase.sequence}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${
                            phase.is_completed
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : phase.is_unlocked
                              ? 'bg-[#00b4d8]/20 text-[#00b4d8] border-[#00b4d8]/30'
                              : 'bg-white/5 text-white/20 border-white/10'
                          }`}>
                            {phase.is_completed ? 'Done' : phase.is_unlocked ? 'Unlocked' : 'Locked'}
                          </span>
                        </div>
                        <h5 className="text-[11px] font-black text-white truncate" title={phase.name}>{phase.name}</h5>
                        <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden my-1.5">
                          <div className="h-full rounded-full" style={{ width: `${phaseProgress}%`, backgroundColor: getProgressColor(phaseProgress) }} />
                        </div>
                        <div className="flex justify-between items-center text-[8px] text-white/30 font-mono">
                          <span>{phaseProgress}%</span>
                          <span>{phaseDone}/{phaseTotal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== MODULES LIST CONTROLS & SEARCH ===== */}
            <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between bg-black/10">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider mr-1">Status:</span>
                {['ALL', 'DONE', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'PENDING'].map(f => (
                  <button 
                    key={f} onClick={() => setModuleFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors whitespace-nowrap ${moduleFilter === f ? 'bg-[#00b4d8] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                  >
                    {f === 'PENDING_VERIFICATION' ? 'Review Queue' : f}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" placeholder="Filter modules or developer..."
                  value={moduleSearch} onChange={e => setModuleSearch(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg pl-8 pr-4 py-1.5 text-xs text-white outline-none focus:border-[#00b4d8]/50 transition-colors placeholder:text-white/30"
                />
              </div>
            </div>

            {/* ===== MODULES TABLE ===== */}
            <div className="p-4 space-y-2">
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                <div className="col-span-4">Module Name & Assigned Developer</div>
                <div className="col-span-2 text-center">Phase</div>
                <div className="col-span-2 text-center">Progress %</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Action / Update</div>
              </div>

              {getProjectTasks(selectedProject.id)
                .filter(t => {
                  if (selectedPhaseFilter !== 'ALL' && t.phase_id !== selectedPhaseFilter) return false;
                  if (selectedDevFilter !== 'ALL' && t.assigned_to !== selectedDevFilter) return false;
                  if (moduleFilter === 'DONE') return t.status === 'COMPLETED' || t.status === 'DONE';
                  if (moduleFilter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
                  if (moduleFilter === 'PENDING_VERIFICATION') return t.status === 'PENDING_VERIFICATION';
                  if (moduleFilter === 'PENDING') return t.status === 'PENDING';
                  return true;
                })
                .filter(t => t.title.toLowerCase().includes(moduleSearch.toLowerCase()) || getUserName(t.assigned_to).toLowerCase().includes(moduleSearch.toLowerCase()))
                .map(t => {
                  const isDone = t.status === 'COMPLETED' || t.status === 'DONE';
                  const isInProgress = t.status === 'IN_PROGRESS';
                  const isPendingReview = t.status === 'PENDING_VERIFICATION';
                  const isRejected = t.status === 'REJECTED';
                  const isExpanded = expandedModule === t.id;
                  
                  const isAssignedDev = user && user.id === t.assigned_to;
                  const phaseObj = selectedProjectPhases.find(p => p.id === t.phase_id);

                  const progressValue = isDone ? 100 : isPendingReview ? 75 : isInProgress ? 50 : 0;

                  return (
                    <div key={t.id} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 items-start md:items-center">
                        {/* Module & Developer */}
                        <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-white font-bold text-xs">
                            {getUserName(t.assigned_to).charAt(0)}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-black text-white truncate" title={t.title}>{t.title}</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest truncate">Assigned to: <strong className="text-white/80">{getUserName(t.assigned_to)}</strong></p>
                          </div>
                        </div>

                        {/* Phase */}
                        <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-white/50 uppercase tracking-widest truncate">
                            {phaseObj ? `Phase ${phaseObj.sequence}: ${phaseObj.name}` : 'SDLC Module'}
                          </span>
                        </div>
                        
                        {/* Progress */}
                        <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                          <div className="w-full max-w-[100px] space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-mono text-white/50">
                              <span>{progressValue}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${progressValue}%`, backgroundColor: getProgressColor(progressValue) }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                          <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border flex items-center gap-1
                            ${isDone ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              isPendingReview ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                              isInProgress ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              isRejected ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                'bg-white/5 text-white/40 border-white/10'}`}
                          >
                            {isDone ? 'Verified Done' : isPendingReview ? 'Awaiting Review' : isInProgress ? 'In Progress' : isRejected ? 'Returned' : 'Pending'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2">
                          {/* Developer Update Progress Actions */}
                          {isAssignedDev && t.status === 'PENDING' && (
                            <button 
                              onClick={() => handleStartModule(t.id)}
                              className="px-3 py-1.5 bg-[#00b4d8]/10 hover:bg-[#00b4d8]/20 border border-[#00b4d8]/30 rounded-lg text-[9px] font-black uppercase tracking-wider text-[#00b4d8]"
                            >
                              Start Module
                            </button>
                          )}

                          {isAssignedDev && (isInProgress || isRejected) && (
                            <button 
                              onClick={() => setSubmitTaskModal(t)}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[9px] font-black uppercase tracking-wider text-emerald-400"
                            >
                              Submit Code
                            </button>
                          )}

                          <button 
                            onClick={() => setExpandedModule(isExpanded ? null : t.id)}
                            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/50 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Module Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 bg-black/20"
                          >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                              <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-[#00b4d8] mb-2 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5" /> Module Instructions & Scope
                                </h5>
                                <p className="text-white/60 font-medium leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                                  {t.description || 'No detailed instructions provided.'}
                                </p>
                              </div>

                              <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">
                                  <ExternalLink className="w-3.5 h-3.5" /> Submissions & Outputs
                                </h5>
                                <div className="space-y-2">
                                  {t.submission_url ? (
                                    <a href={t.submission_url} target="_blank" rel="noreferrer" className="block text-[11px] font-bold text-[#00b4d8] hover:underline truncate">
                                      🔗 Output PR / Code: {t.submission_url}
                                    </a>
                                  ) : (
                                    <p className="text-white/40 italic">No output link submitted yet.</p>
                                  )}

                                  {t.submission_demo_url && (
                                    <a href={t.submission_demo_url} target="_blank" rel="noreferrer" className="block text-[11px] font-bold text-emerald-400 hover:underline truncate">
                                      🚀 Live Demo: {t.submission_demo_url}
                                    </a>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" /> Module Telemetry Meta
                                </h5>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1 text-[10px] text-white/50">
                                  <div>Due Date: <strong className="text-white">{t.due_date || 'No deadline set'}</strong></div>
                                  {t.submitted_at && <div>Submitted At: <strong className="text-white">{new Date(t.submitted_at).toLocaleString()}</strong></div>}
                                  {t.verified_at && <div>Verified At: <strong className="text-emerald-400">{new Date(t.verified_at).toLocaleString()}</strong></div>}
                                  {t.rejection_remarks && (
                                    <div className="text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/50 mt-2 font-mono">
                                      <strong>Rejection Reason:</strong> {t.rejection_remarks}
                                    </div>
                                  )}
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

      {/* ===== CREATE & ASSIGN MODULE MODAL (TL / MENTOR / ADMIN) ===== */}
      {showCreateModuleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#1c222b] border border-white/10 rounded-[2rem] p-8 w-full max-w-xl space-y-6 shadow-2xl">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#00b4d8] tracking-widest">Team Operations</span>
              <h3 className="text-xl font-black text-white uppercase mt-1">Create & Assign Project Module</h3>
              <p className="text-xs text-white/40 mt-1">Assign new SDLC task/module to developer in <strong>{selectedProject?.name}</strong></p>
            </div>
            
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">SDLC Phase *</label>
                  <select 
                    required
                    value={createModuleData.phase_id}
                    onChange={e => setCreateModuleData({ ...createModuleData, phase_id: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00b4d8]"
                  >
                    <option value="">Select Phase</option>
                    {selectedProjectPhases.map(p => (
                      <option key={p.id} value={p.id} disabled={!p.is_unlocked}>
                        Phase {p.sequence}: {p.name} {!p.is_unlocked ? '(Locked)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Assign Developer *</label>
                  <select 
                    required
                    value={createModuleData.assigned_to}
                    onChange={e => setCreateModuleData({ ...createModuleData, assigned_to: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00b4d8]"
                  >
                    <option value="">Select Team Developer</option>
                    {selectedProjectTeamMembers.map(m => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.name} ({m.designation === 'lead' ? 'Team Lead' : 'Developer'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Module Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Implement User Authentication & JWT"
                  value={createModuleData.title}
                  onChange={e => setCreateModuleData({ ...createModuleData, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00b4d8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Module Description / Scope</label>
                <textarea 
                  rows={3}
                  placeholder="Provide scope, specs, and deliverables..."
                  value={createModuleData.description}
                  onChange={e => setCreateModuleData({ ...createModuleData, description: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00b4d8] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Completion Due Date</label>
                <input 
                  type="date"
                  value={createModuleData.due_date}
                  onChange={e => setCreateModuleData({ ...createModuleData, due_date: e.target.value })}
                  onClick={e => e.target.showPicker && e.target.showPicker()}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00b4d8] cursor-pointer"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModuleModal(false)}
                  className="px-5 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingModule}
                  className="px-6 py-2.5 bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] font-black text-xs uppercase tracking-wider rounded-xl disabled:opacity-50"
                >
                  {isSubmittingModule ? 'Creating...' : 'Assign Module'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ===== SUBMIT CODE MODAL (DEVELOPER PROGRESS UPDATE) ===== */}
      {submitTaskModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#1c222b] border border-white/10 rounded-[2rem] p-8 w-full max-w-lg space-y-6 shadow-2xl">
            <div>
              <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-widest">Developer Progress Update</span>
              <h3 className="text-xl font-black text-white uppercase mt-1">Submit Module Output</h3>
              <p className="text-xs text-white/40 mt-1">Deliver production link & demonstration resources for: <strong>{submitTaskModal.title}</strong></p>
            </div>
            
            <form onSubmit={handleSubmitModuleCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">GitHub PR / Code Repository Link *</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://github.com/..."
                  value={submissionUrls.url}
                  onChange={e => setSubmissionUrls({ ...submissionUrls, url: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#00b4d8]"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Hosted Demo / Live Deployment URL (Optional)</label>
                <input 
                  type="url"
                  placeholder="https://sdc-portal.com"
                  value={submissionUrls.demo}
                  onChange={e => setSubmissionUrls({ ...submissionUrls, demo: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#00b4d8]"
                />
              </div>
              
              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setSubmitTaskModal(null)}
                  className="px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingCode}
                  className="px-5 py-2 bg-emerald-500 text-black hover:bg-emerald-400 font-black text-xs uppercase tracking-wider rounded-xl disabled:opacity-50"
                >
                  {isSubmittingCode ? 'Submitting...' : 'Submit Output'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* LEADERBOARD MODAL */}
      <AnimatePresence>
        {showLeaderboard && renderLeaderboardModal()}
      </AnimatePresence>
    </div>
  );
}
