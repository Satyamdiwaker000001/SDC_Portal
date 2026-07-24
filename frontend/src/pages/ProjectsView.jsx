import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Target, Calendar, CheckCircle2, Clock, Package, 
  Zap, Plus, X, Link as LinkIcon, AlertTriangle, Users, 
  FileText, Globe, Image as ImageIcon, Check, Edit3, Trash2,
  Lock, Unlock, ArrowRight, Upload, Download, Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI, teamsAPI, usersAPI, tasksAPI, interactionsAPI } from '../api/services';

const Github = (props) => (
  <svg className={props.className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={props.style}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return 'No Date';
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const PROJECT_TYPES = ["Web Application", "Mobile App", "AI/ML Model", "Cybersecurity", "Blockchain", "Hardware/IoT", "Other"];

const STATUS_COLORS = {
  'DRAFT': {
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    folderBg: 'from-sky-950/80 to-[#1e293b]/90',
    tabBg: 'bg-sky-600',
    line: 'bg-sky-500'
  },
  'PENDING_SRS': {
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    folderBg: 'from-blue-950/80 to-[#1e293b]/90',
    tabBg: 'bg-blue-600',
    line: 'bg-blue-500'
  },
  'LIVE': {
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    folderBg: 'from-cyan-950/80 to-[#1e293b]/90',
    tabBg: 'bg-cyan-600',
    line: 'bg-[#00b4d8]'
  },
  'COMPLETED': {
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    folderBg: 'from-emerald-950/80 to-[#1e293b]/90',
    tabBg: 'bg-emerald-600',
    line: 'bg-emerald-500'
  }
};

// ==========================================
// FOLDER COMPONENT (THE MAIN UI STAR)
// ==========================================
function ProjectFolder({ project, teams, allUsers, onUpdateProject, onDeleteProject, onRefreshData, role, isInline = false, onClose, onSelect, isHighlighted = false }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFile, setActiveFile] = useState('report'); // report | sdlc | documents | team | feedback

  // Team change state (admin only)
  const [isChangingTeam, setIsChangingTeam] = useState(false);
  const [newTeamId, setNewTeamId] = useState(project.team_id || '');
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false);

  const handleChangeTeam = async () => {
    setIsSubmittingTeam(true);
    try {
      const updated = await projectsAPI.update(project.id, { team_id: newTeamId || null });
      onUpdateProject(updated);
      setIsChangingTeam(false);
      // Refresh members after team change
      if (newTeamId) fetchMembers();
      else setTeamMembers([]);
    } catch (err) {
      alert('Failed to update team assignment');
    } finally {
      setIsSubmittingTeam(false);
    }
  };

  // Internal helper to get team name from teams prop
  const getTeamName = (teamId) => {
    const t = teams.find(team => team.id === teamId);
    return t ? t.name : 'Unassigned';
  };
  
  // States for sub-data
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  
  const [phases, setPhases] = useState([]);
  const [isLoadingPhases, setIsLoadingPhases] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '', due_date: '' });
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Quick edit state for project report details
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: project.name,
    short_description: project.short_description || '',
    full_description: project.full_description || '',
    live_url: project.live_url || '',
    image_url: project.image_url || '',
    github_repo: project.github_repo || '',
    status: project.status
  });

  // Check if current user is Team Leader of this project's team
  const isTeamLeader = useMemo(() => {
    if (!project.team_id || !user) return false;
    const member = teamMembers.find(m => m.user_id === user.id);
    return member && member.designation === 'lead';
  }, [teamMembers, project.team_id, user]);

  // Load team roster
  const fetchMembers = async () => {
    if (!project.team_id) return;
    setIsLoadingMembers(true);
    try {
      const membersList = await teamsAPI.getMembers(project.team_id).catch(() => []);
      const enriched = membersList.map(m => {
        const uDetail = allUsers.find(u => u.id === m.user_id);
        return {
          id: m.id,
          user_id: m.user_id,
          name: uDetail ? uDetail.name : `Operator ${m.user_id.substring(0, 4)}`,
          email: uDetail ? uDetail.email : '',
          role: uDetail ? uDetail.role : '',
          designation: m.designation
        };
      });
      setTeamMembers(enriched);
    } catch {
      setTeamMembers([]);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Load phases
  const fetchPhases = async () => {
    setIsLoadingPhases(true);
    try {
      const pList = await projectsAPI.getPhases(project.id).catch(() => []);
      setPhases(pList);
      if (pList.length > 0) {
        // default select the first unlocked/active phase
        const active = pList.find(p => p.is_unlocked && !p.is_completed) || pList[0];
        setSelectedPhase(active);
      }
    } catch {
      setPhases([]);
    } finally {
      setIsLoadingPhases(false);
    }
  };

  // Load documents repository
  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const dList = await projectsAPI.getDocuments(project.id).catch(() => []);
      setDocuments(dList);
    } catch {
      setDocuments([]);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  // Load tasks
  const fetchTasks = async () => {
    setIsLoadingTasks(true);
    try {
      const tList = await tasksAPI.getAll(project.id).catch(() => []);
      setTasks(tList);
    } catch {
      setTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Load feedback comments
  const fetchComments = async () => {
    try {
      const cList = await interactionsAPI.getAll('project', project.id).catch(() => []);
      const enriched = cList.map(c => {
        const uDetail = allUsers.find(u => u.id === c.user_id);
        return { ...c, user_name: uDetail ? uDetail.name : 'Unknown User' };
      });
      setComments(enriched);
    } catch {
      setComments([]);
    }
  };

  // Triggers when folder opens
  useEffect(() => {
    if (isOpen || isInline) {
      fetchMembers();
      fetchPhases();
      fetchDocuments();
      fetchTasks();
      fetchComments();
    }
  }, [isOpen, isInline, project.id, project.team_id]);

  // Handle manual unlock of phase (Admin override)
  const handleUnlockPhase = async (phaseId) => {
    try {
      await projectsAPI.unlockPhase(project.id, phaseId);
      fetchPhases();
    } catch (e) {
      alert("Failed to unlock phase");
    }
  };

  // Handle document upload
  const handleDocUpload = async (docId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await projectsAPI.uploadDocument(project.id, docId, formData);
      fetchDocuments();
    } catch (e) {
      alert("Failed to upload document file");
    }
  };

  // Handle creating tasks (TL only)
  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assigned_to) return;
    setIsSubmittingTask(true);
    try {
      await tasksAPI.create({
        project_id: project.id,
        phase_id: selectedPhase.id,
        assigned_to: newTask.assigned_to,
        title: newTask.title,
        description: newTask.description || null,
        due_date: newTask.due_date || null
      });
      setNewTask({ title: '', description: '', assigned_to: '', due_date: '' });
      setShowAddTaskModal(false);
      fetchTasks();
      fetchPhases(); // refresh progresses
      onRefreshData?.(); // refresh project overall progress
    } catch (err) {
      alert("Failed to create task inside phase");
    } finally {
      setIsSubmittingTask(false);
    }
  };

  // Handle posting comments
  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const created = await interactionsAPI.create({
        entity_type: 'project',
        entity_id: project.id,
        interaction_type: 'comment',
        content: newComment
      });
      const uDetail = allUsers.find(u => u.id === created.user_id);
      created.user_name = uDetail ? uDetail.name : 'You';
      setComments(prev => [...prev, created]);
      setNewComment('');
    } catch (err) {
      alert("Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle project dossier update
  const handleSaveProjectDetails = async (e) => {
    e.preventDefault();
    try {
      const updated = await projectsAPI.update(project.id, editData);
      onUpdateProject(updated);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to save dossier updates");
    }
  };

  // Filter developers for task assignments dropdown
  const teamDevelopers = useMemo(() => {
    return teamMembers.filter(m => m.designation !== 'mentor');
  }, [teamMembers]);

  // Tasks belonging to currently selected phase
  const phaseTasks = useMemo(() => {
    if (!selectedPhase) return [];
    return tasks.filter(t => t.phase_id === selectedPhase.id);
  }, [tasks, selectedPhase]);

  const statusCfg = STATUS_COLORS[project.status || 'DRAFT'] || STATUS_COLORS['DRAFT'];

  const renderDetailsContent = () => (
    <>
      {/* Header controls */}
      <button 
         onClick={isInline ? onClose : () => setIsOpen(false)}
         className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors z-50 border border-white/5"
      >
         <X className="w-4 h-4" />
      </button>

      {/* File tab bars */}
      <div className="flex gap-2 p-3 bg-[#0a0f1d] border-b border-white/10 shrink-0 relative z-40 overflow-x-auto">
        {[
          { id: 'report', title: '📋 Project Dossier' },
          { id: 'sdlc', title: '⚙️ SDLC Phases' },
          { id: 'documents', title: '📂 Doc Repository' },
          { id: 'team', title: '👥 Team Roster' },
          { id: 'feedback', title: '💬 Feedback' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFile(tab.id)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
              activeFile === tab.id
                ? 'bg-[#00b4d8] text-black border-[#00b4d8] shadow-md shadow-[#00b4d8]/20'
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Paper sheet content box */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar text-white relative bg-[#0f172a]">
        
        {/* === 1. PROJECT DOSSIER TAB === */}
        {activeFile === 'report' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {isEditing ? (
              <form onSubmit={handleSaveProjectDetails} className="space-y-4">
                <input 
                  type="text" required
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-[#00b4d8]"
                />
                <input 
                  type="text"
                  placeholder="Short summary..."
                  value={editData.short_description}
                  onChange={e => setEditData({ ...editData, short_description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00b4d8]"
                />
                <textarea 
                  rows="4"
                  value={editData.full_description}
                  onChange={e => setEditData({ ...editData, full_description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00b4d8] resize-none"
                  placeholder="Detailed description..."
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="url" 
                    placeholder="Deployment Build URL"
                    value={editData.live_url}
                    onChange={e => setEditData({ ...editData, live_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00b4d8]"
                  />
                  <input 
                    type="url"
                    placeholder="GitHub Repository URL"
                    value={editData.github_repo}
                    onChange={e => setEditData({ ...editData, github_repo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00b4d8]"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button 
                    type="button" onClick={() => setIsEditing(false)}
                    className="px-5 py-2 rounded-lg border border-white/10 text-xs font-bold text-white/60 hover:bg-white/5"
                  >Cancel</button>
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#00b4d8] text-black text-xs font-bold hover:bg-[#00c8f0]"
                  >Save Updates</button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono font-bold text-red-400 border border-red-500/20 px-3 py-1 bg-red-500/10 rounded">OFFICIAL PROJECT RECORD</span>
                  <span className="text-xs text-white/40">STATUS: <strong className="text-white">{project.status}</strong></span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white leading-tight uppercase">{project.name}</h2>
                  <p className="text-xs font-bold text-[#00b4d8] uppercase tracking-wider mt-1">{project.short_description || 'No summary registered.'}</p>
                  <p className="text-xs text-white/70 mt-4 leading-relaxed whitespace-pre-wrap">{project.full_description || 'No detailed documentation specified.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {project.live_url ? (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold uppercase border border-emerald-500/20">
                      <Globe className="w-4 h-4" /> Hosted Build URL
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl text-white/30 text-xs font-bold uppercase border border-white/5">
                      <Globe className="w-4 h-4" /> Undeployed
                    </div>
                  )}

                  {project.github_repo ? (
                    <a href={project.github_repo} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-xs font-bold uppercase border border-white/10">
                      <Github className="w-4 h-4" /> GitHub Repository
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl text-white/30 text-xs font-bold uppercase border border-white/5">
                      <Github className="w-4 h-4" /> Private Repo
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block">Project Progress</span>
                    <span className="text-2xl font-black text-white">{project.progress}% Complete</span>
                  </div>
                  
                  {(role === 'admin' || role === 'developer') && (
                    <div className="flex gap-2">
                      {(role === 'admin' || isTeamLeader) && (
                        <>
                          {project.status !== 'COMPLETED' && (
                            <button 
                              type="button"
                              onClick={async () => {
                                try {
                                  const updated = await projectsAPI.updateStatus(project.id, 'COMPLETED');
                                  onUpdateProject(updated);
                                } catch {
                                  alert("Failed to update status to COMPLETED");
                                }
                              }}
                              className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                            >
                              Mark Completed
                            </button>
                          )}
                          {project.status !== 'LIVE' && (
                            <button 
                              type="button"
                              onClick={async () => {
                                try {
                                  const updated = await projectsAPI.updateStatus(project.id, 'LIVE');
                                  onUpdateProject(updated);
                                } catch {
                                  alert("Failed to update status to LIVE");
                                }
                              }}
                              className="px-4 py-2 bg-[#00b4d8]/10 border border-[#00b4d8]/20 text-[#00b4d8] hover:bg-[#00b4d8] hover:text-black rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                            >
                              Mark Live
                            </button>
                          )}
                        </>
                      )}
                      <button 
                        onClick={() => {
                          setEditData({
                            name: project.name,
                            short_description: project.short_description || '',
                            full_description: project.full_description || '',
                            live_url: project.live_url || '',
                            image_url: project.image_url || '',
                            github_repo: project.github_repo || '',
                            status: project.status
                          });
                          setIsEditing(true);
                        }}
                        className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit dossier
                      </button>
                      {role === 'admin' && (
                        <button 
                          onClick={() => onDeleteProject(project)}
                          className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete project
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === 2. SDLC PHASES TIMELINE & TASKS === */}
        {activeFile === 'sdlc' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
              <span className="text-xs font-black text-white/70 uppercase tracking-widest">Predefined SDLC Phases Workflow</span>
              <span className="text-[10px] text-white/40 font-bold">SEQUENTIAL PROGRESSION</span>
            </div>

            {isLoadingPhases ? (
              <div className="py-12 text-center text-sm font-bold text-white/40">Loading SDLC phases...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Panel: Phase Timeline */}
                <div className="md:col-span-1 space-y-3 border-r border-white/5 pr-4">
                  {phases.map(phase => {
                    const isSelected = selectedPhase && selectedPhase.id === phase.id;
                    return (
                      <div 
                        key={phase.id}
                        onClick={() => phase.is_unlocked && setSelectedPhase(phase)}
                        className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between gap-2 relative overflow-hidden ${
                          phase.is_unlocked 
                            ? 'cursor-pointer border-white/10 bg-white/5 hover:border-[#00b4d8]'
                            : 'bg-white/[0.01] border-white/5 opacity-60'
                        } ${isSelected ? 'border-[#00b4d8] bg-white/10 shadow-md shadow-[#00b4d8]/10' : ''}`}
                      >
                        {isSelected && <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#00b4d8]" />}
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Phase {phase.sequence}</span>
                          {phase.is_completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : phase.is_unlocked ? (
                            <Unlock className="w-3.5 h-3.5 text-cyan-500" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-white/30" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase leading-none">{phase.name}</h4>
                          <span className="text-[10px] text-white/40 mt-1 block font-mono">{phase.progress}% Complete</span>
                        </div>
                        
                        {/* Admin override unlock button */}
                        {!phase.is_unlocked && role === 'admin' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlockPhase(phase.id);
                            }}
                            className="mt-2 w-full py-1 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white rounded-md text-[8px] font-black uppercase tracking-widest"
                          >
                            Manual Unlock Override
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right Panel: Selected Phase Details & Tasks */}
                <div className="md:col-span-2 space-y-4">
                  {selectedPhase ? (
                    <div className="space-y-4">
                      <div className="bg-white/5 p-4 border border-white/10 rounded-2xl flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-wide">Phase {selectedPhase.sequence}: {selectedPhase.name}</h3>
                          <p className="text-[10px] text-white/50 mt-0.5 uppercase tracking-widest font-bold">Tasks in this phase contribute to phase completion</p>
                        </div>
                        {isTeamLeader && selectedPhase.is_unlocked && (
                          <button 
                            onClick={() => setShowAddTaskModal(true)}
                            className="px-3.5 py-2 bg-[#00b4d8] text-black hover:bg-[#00c8f0] rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-[#00b4d8]/20"
                          >
                            <Plus className="w-3.5 h-3.5" /> Assign Task
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {phaseTasks.length === 0 ? (
                          <div className="py-12 text-center text-white/40 font-mono text-xs">No tasks registered in this phase.</div>
                        ) : (
                          phaseTasks.map(t => {
                            const assignee = allUsers.find(u => u.id === t.assigned_to);
                            return (
                              <div key={t.id} className="p-4 bg-white/[0.02] border border-white/10 rounded-xl shadow-sm hover:border-[#00b4d8]/30 transition-all flex justify-between items-center gap-3">
                                <div>
                                  <h4 className="text-xs font-black text-white uppercase leading-snug">{t.title}</h4>
                                  <p className="text-[11px] text-white/50 line-clamp-1">{t.description}</p>
                                  <div className="flex gap-4 pt-1.5 text-[9px] font-bold text-white/40 uppercase">
                                    <span>Assignee: <strong className="text-white/70">{assignee ? assignee.name : 'Unassigned'}</strong></span>
                                    {t.due_date && <span>Due: <strong className="text-white/70">{t.due_date}</strong></span>}
                                  </div>
                                </div>
                                <div className="shrink-0">
                                  {t.status === 'COMPLETED' && (
                                    <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-[8px] font-black uppercase tracking-widest text-emerald-400">Completed</span>
                                  )}
                                  {t.status === 'PENDING_VERIFICATION' && (
                                    <span className="px-2.5 py-1 bg-[#00b4d8]/15 border border-[#00b4d8]/30 rounded-lg text-[8px] font-black uppercase tracking-widest text-[#00b4d8]">Pending Review</span>
                                  )}
                                  {t.status === 'IN_PROGRESS' && (
                                    <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded-lg text-[8px] font-black uppercase tracking-widest text-amber-400">In Progress</span>
                                  )}
                                  {t.status === 'PENDING' && (
                                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-white/40">Todo</span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-white/40 text-xs">Unlock preceding phases to unlock dashboard features.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === 3. MANDATORY DOCUMENT REPOSITORY === */}
        {activeFile === 'documents' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
              <div>
                <span className="text-xs font-black text-white/70 uppercase tracking-widest">Mandatory Software Engineering Documentation</span>
                <p className="text-[9px] text-white/40 mt-0.5 uppercase font-bold">16 Required Documents + Centralized GitHub Link</p>
              </div>
              <span className="text-[10px] text-white/50 font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                TL Privilege Uploads
              </span>
            </div>

            {isLoadingDocs ? (
              <div className="py-12 text-center text-sm font-bold text-white/40">Syncing repository...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <FileText className={`w-8 h-8 ${doc.file_id ? 'text-[#00b4d8]' : 'text-white/30'}`} />
                      <div>
                        <h4 className="text-xs font-black text-white uppercase leading-none mb-1">{doc.document_type}</h4>
                        {doc.file_name ? (
                          <span className="text-[10px] text-white/50 truncate max-w-[180px] block" title={doc.file_name}>
                            File: {doc.file_name}
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Missing Document</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-[8px] text-white/40 font-mono">
                        Updated: {doc.file_id ? formatDate(doc.updated_at) : 'N/A'}
                      </span>
                      <div className="flex items-center gap-2">
                        {doc.file_id && doc.file_url && (
                          <a 
                            href={doc.file_url} 
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                            title="Download document file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {(isTeamLeader || role === 'admin') && (
                          <label className="p-1.5 bg-white/5 border border-[#00b4d8]/30 hover:bg-[#00b4d8]/20 rounded-lg text-[#00b4d8] cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleDocUpload(doc.id, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === 4. TEAM ROSTER TAB === */}
        {activeFile === 'team' && (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Header with team name + admin change-team control */}
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white/70 uppercase tracking-widest">Assigned Personnel</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/50 font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                    Team: {getTeamName(project.team_id)}
                  </span>
                  {role === 'admin' && !isChangingTeam && (
                    <button
                      onClick={() => { setIsChangingTeam(true); setNewTeamId(project.team_id || ''); }}
                      className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Change Team
                    </button>
                  )}
                </div>
              </div>

              {/* Admin inline team-change panel */}
              {role === 'admin' && isChangingTeam && (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <select
                    value={newTeamId}
                    onChange={e => setNewTeamId(e.target.value)}
                    className="flex-1 border border-white/10 rounded-lg px-3 py-2 text-xs text-white bg-[#1c222b] focus:outline-none focus:border-[#00b4d8]"
                  >
                    <option value="">-- Unassign Team --</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleChangeTeam}
                    disabled={isSubmittingTeam}
                    className="px-4 py-2 bg-[#00b4d8] text-black rounded-lg text-[9px] font-black uppercase tracking-widest disabled:opacity-50 hover:bg-[#00c8f0]"
                  >
                    {isSubmittingTeam ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsChangingTeam(false)}
                    className="px-3 py-2 bg-white/5 text-white/50 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {project.team_id ? (
              isLoadingMembers ? (
                <div className="py-12 text-center text-sm font-bold text-white/40">Loading team roster...</div>
              ) : teamMembers.length === 0 ? (
                <div className="py-12 text-center text-sm font-bold text-white/40">No members assigned to this squad yet.</div>
              ) : (
                <div className="space-y-3">
                  {/* Leader first */}
                  {teamMembers.filter(m => m.designation === 'lead').map(m => (
                    <div key={m.id} className="flex items-center justify-between p-4 bg-[#00b4d8]/10 border border-[#00b4d8]/20 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00b4d8] to-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                          {(m.name || '?').charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#00b4d8] uppercase leading-none mb-0.5">{m.name}</h4>
                          <p className="text-[10px] text-[#00b4d8]/70">{m.email}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#00b4d8] text-black shadow-sm shrink-0">
                        👑 Team Leader
                      </span>
                    </div>
                  ))}
                  {/* Mentors */}
                  {teamMembers.filter(m => m.designation === 'mentor').map(m => (
                    <div key={m.id} className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                          {(m.name || '?').charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-amber-400 uppercase leading-none mb-0.5">{m.name}</h4>
                          <p className="text-[10px] text-amber-400/70">{m.email}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-black shadow-sm shrink-0">
                        ⭐ Mentor
                      </span>
                    </div>
                  ))}
                  {/* Regular members */}
                  {teamMembers.filter(m => m.designation !== 'lead' && m.designation !== 'mentor').map(m => (
                    <div key={m.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center text-xs font-black shrink-0">
                          {(m.name || '?').charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white uppercase leading-none mb-0.5">{m.name}</h4>
                          <p className="text-[10px] text-white/50">{m.email}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 shadow-sm shrink-0">
                        {m.designation}
                      </span>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="py-16 text-center flex flex-col items-center justify-center text-white/40 bg-white/[0.02] rounded-2xl border-2 border-dashed border-white/10">
                <AlertTriangle className="w-12 h-12 text-amber-500 opacity-80 mb-4" />
                <p className="text-sm font-black text-white mb-1">No Team Assigned</p>
                {role === 'admin' ? (
                  <p className="text-[10px] font-medium">Use the <strong>Change Team</strong> button above to assign a team.</p>
                ) : (
                  <p className="text-[10px] font-medium">Coordinate with Administrator to assign a team to this project.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* === 5. FEEDBACK COMMENTS TAB === */}
        {activeFile === 'feedback' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
              <span className="text-xs font-black text-white/70 uppercase tracking-widest">Feedback & Discussion Board</span>
              <span className="text-[10px] text-white/40 font-bold">PROJECT CHANNEL</span>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {comments.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40 font-mono">No discussions posted yet. start the handshake.</div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold text-white/40 uppercase">
                      <span>{c.user_name}</span>
                      <span>{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-xs text-white/90 leading-normal">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCreateComment} className="flex gap-2">
              <input 
                type="text" required
                placeholder="Compose project notification comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#00b4d8]"
              />
              <button 
                type="submit" 
                disabled={isSubmittingComment}
                className="px-5 py-2.5 bg-[#00b4d8] hover:bg-[#00c8f0] text-black font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        )}

      </div>
    </>
  );

  if (isInline) {
    return (
      <motion.div 
         layoutId={`folder-container-${project.id}`}
         className="relative w-full bg-[#1c222b]/30 border border-white/5 rounded-[2rem] flex flex-col overflow-hidden backdrop-blur-md min-h-[75vh]"
      >
        {renderDetailsContent()}
      </motion.div>
    );
  }

  return (
    <>
      {/* 📁 macOS Style Folder Icon */}
      <motion.div 
        layoutId={`folder-container-${project.id}`}
        id={`project-card-${project.id}`}
        className={`flex flex-col items-center cursor-pointer mt-6 mx-auto group w-36 p-2 rounded-2xl transition-all duration-500 ${
          isHighlighted
            ? 'ring-4 ring-[#00b4d8] shadow-[0_0_35px_rgba(0,180,216,0.6)] scale-[1.05] bg-[#00b4d8]/10'
            : ''
        }`}
        onClick={() => onSelect && onSelect(project.id)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-28 h-20">
          <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
            <path d="M5,10 L35,10 L45,20 L115,20 C117.76,20 120,22.24 120,25 L120,85 C120,87.76 117.76,90 115,90 L5,90 C2.24,90 0,87.76 0,85 L0,15 C0,12.24 2.24,10 5,10 Z" fill="#0284c7"/>
            <path d="M5,22 L115,22 C117.76,22 120,24.24 120,27 L120,85 C120,87.76 117.76,90 115,90 L5,90 C2.24,90 0,87.76 0,85 L0,27 C0,24.24 2.24,22 5,22 Z" fill="#38bdf8"/>
            <path d="M5,22 L115,22 C117.76,22 120,24.24 120,27 L120,40 L0,40 L0,27 C0,24.24 2.24,22 5,22 Z" fill="white" fillOpacity="0.15"/>
          </svg>
          <div className="absolute top-5 right-3">
             <div className={`w-2 h-2 rounded-full shadow-sm animate-pulse ${project.status === 'LIVE' ? 'bg-cyan-300' : project.status === 'COMPLETED' ? 'bg-emerald-300' : 'bg-amber-300'}`}></div>
          </div>
        </div>
        <div className="w-full text-center mt-2 px-1">
           <h4 className="text-[12px] font-bold text-white truncate drop-shadow-md">{project.name}</h4>
           <p className="text-[9px] text-white/50 uppercase tracking-wider truncate mt-0.5">{project.type}</p>
        </div>
      </motion.div>

      {/* 📄 Paper Sheet Window Dialog (only when not inline) */}
      <AnimatePresence>
        {isOpen && !isInline && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
              <motion.div 
                 initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
                 animate={{ opacity: 1, backdropFilter: "blur(12px)" }} 
                 exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                 className="absolute inset-0 bg-black/60 cursor-pointer"
                 onClick={() => setIsOpen(false)}
              />
              
              <motion.div 
                 layoutId={`folder-container-${project.id}`}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="relative w-full max-w-5xl h-[85vh] bg-[#0f172a] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
              >
                {renderDetailsContent()}
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Team Leader Add Task Modal Dialog */}
      {showAddTaskModal && selectedPhase && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 z-[120]">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0f172a] rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl text-white border border-white/10">
            <div>
              <span className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Phase {selectedPhase.sequence} Deployment</span>
              <h3 className="text-base font-black text-white uppercase mt-1">Assign Task: {selectedPhase.name}</h3>
              <p className="text-[11px] text-white/50">Assign a work package to team personnel.</p>
            </div>
            
            <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/50 uppercase tracking-wider block">Task Title *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Implement routing"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00b4d8]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-white/50 uppercase tracking-wider block">Description / Action Items</label>
                <textarea 
                  rows="2"
                  placeholder="Details regarding outputs..."
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00b4d8] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/50 uppercase tracking-wider block">Assign Developer *</label>
                  <select 
                    required
                    value={newTask.assigned_to}
                    onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
                    className="w-full bg-[#1c222b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00b4d8] cursor-pointer"
                  >
                    <option value="" className="bg-[#0f172a]">-- Choose member --</option>
                    {teamDevelopers.map(d => (
                      <option key={d.user_id} value={d.user_id} className="bg-[#0f172a]">{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-white/50 uppercase tracking-wider block">Due Date</label>
                  <input 
                    type="date"
                    value={newTask.due_date}
                    onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00b4d8]"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider text-white/50 hover:bg-white/5"
                >Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSubmittingTask}
                  className="px-5 py-2 bg-[#00b4d8] hover:bg-[#00c8f0] text-black font-black text-[10px] uppercase tracking-wider rounded-xl disabled:opacity-50"
                >
                  {isSubmittingTask ? 'Processing...' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}

// ==========================================
// PROJECTS VIEW CONTAINER
// ==========================================
export default function ProjectsView() {
  const { role, user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedProjectId, setHighlightedProjectId] = useState(null);

  // Modal open for adding project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', type: 'Web Application', deadline: '', teamId: '', live_url: '', github_repo: '', image_url: '', srsLink: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Delete project confirmation
  const [deletingProject, setDeletingProject] = useState(null);

  // Selected project for inline details view
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Search filter
  const [search, setSearch] = useState('');

  const fetchGlobalData = async () => {
    setLoading(true);
    try {
      const [pList, tList, uList] = await Promise.all([
        projectsAPI.getAll().catch(() => []),
        teamsAPI.getAll().catch(() => []),
        usersAPI.getAll().catch(() => [])
      ]);
      
      const teamMembersList = await Promise.all(
        tList.map(team => 
          teamsAPI.getMembers(team.id)
            .then(members => ({ teamId: team.id, members }))
            .catch(() => ({ teamId: team.id, members: [] }))
        )
      );
      setUserTeams(teamMembersList);
      setProjects(pList);
      setTeams(tList);
      setAllUsers(uList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await projectsAPI.create({
        name: newProject.name,
        short_description: newProject.description,
        full_description: newProject.description,
        type: newProject.type,
        deadline: newProject.deadline,
        team_id: newProject.teamId || null,
        live_url: newProject.live_url || null,
        github_repo: newProject.github_repo || null,
        image_url: newProject.image_url || null
      });
      setProjects(prev => [...prev, data]);
      setNewProject({ name: '', description: '', type: 'Web Application', deadline: '', teamId: '', live_url: '', github_repo: '', image_url: '', srsLink: '' });
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to initialize project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = (updated) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;
    setIsSubmitting(true);
    try {
      await projectsAPI.delete(deletingProject.id);
      setProjects(prev => prev.filter(p => p.id !== deletingProject.id));
      setDeletingProject(null);
      setSelectedProjectId(null);
    } catch (err) {
      alert("Failed to delete project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const myTeamIds = useMemo(() => {
    if (role === 'admin') return [];
    return userTeams.filter(ut => ut.members.some(m => m.user_id === currentUser?.id)).map(ut => ut.teamId);
  }, [userTeams, currentUser, role]);

  const filteredProjects = useMemo(() => {
    let list = projects;
    if (role !== 'admin') {
      list = list.filter(p => myTeamIds.includes(p.team_id) || p.created_by === currentUser?.id);
    }
    return list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search, myTeamIds, role, currentUser]);

  const activeProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);

  const filteredTeams = useMemo(() => {
    if (role === 'admin') return teams;
    return teams.filter(t => myTeamIds.includes(t.id));
  }, [teams, myTeamIds, role]);

  const getTeamName = (teamId) => {
    const t = teams.find(team => team.id === teamId);
    return t ? t.name : 'Unassigned';
  };

  const targetProjectId = searchParams.get('id');

  // Deep-link handling: scroll, highlight, and auto-open matching project details
  useEffect(() => {
    if (!loading && targetProjectId && Array.isArray(projects) && projects.length > 0) {
      const target = projects.find(p => p && String(p.id) === String(targetProjectId));
      if (target) {
        setSelectedProjectId(target.id);
        setHighlightedProjectId(target.id);
        const timer = setTimeout(() => {
          setHighlightedProjectId(null);
        }, 4000);

        setTimeout(() => {
          const el = document.getElementById(`project-card-${target.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, targetProjectId, projects, searchParams]);

  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* Search and control Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] backdrop-blur-md shrink-0">
        <div className="relative flex items-center w-full sm:w-80">
          <Search className="absolute left-4 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Filter projects by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00b4d8]"
          />
        </div>

        {(role === 'admin' || role === 'developer') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 py-3 bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] transition-all rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,180,216,0.15)]"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      {/* Folders grid / Inline folder details */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {loading ? (
          <div className="text-center py-16 text-white/40 text-xs font-mono">Syncing repositories...</div>
        ) : activeProject ? (
          <ProjectFolder
            project={activeProject}
            teams={teams}
            allUsers={allUsers}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={setDeletingProject}
            onRefreshData={fetchGlobalData}
            role={role}
            isInline={true}
            onClose={() => setSelectedProjectId(null)}
          />
        ) : filteredProjects.length === 0 ? (
          <div className="h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/30 p-8">
            <Package className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-base font-bold text-white/50 tracking-widest uppercase mb-1">No Projects Found</p>
            <p className="text-xs opacity-50">Create a new project to start tracking development.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 pt-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectFolder
                  key={project.id}
                  project={project}
                  teams={teams}
                  allUsers={allUsers}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={setDeletingProject}
                  onRefreshData={fetchGlobalData}
                  role={role}
                  onSelect={setSelectedProjectId}
                  isHighlighted={String(project.id) === String(highlightedProjectId)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Project Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#020617] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
            >
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-sky-900/20 to-transparent flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#00b4d8]" />
                  <h2 className="text-base font-black tracking-widest uppercase">Initialize Project</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50"><X className="w-4 h-4" /></button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
                <form id="project-form" onSubmit={handleCreateProject} className="space-y-4">
                  {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">{error}</div>}

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Project Name *</label>
                    <input 
                      type="text" required placeholder="Codename"
                      value={newProject.name}
                      onChange={e => setNewProject({...newProject, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Summary / Description</label>
                    <textarea 
                      rows="2" placeholder="Describe project deployment objectives..."
                      value={newProject.description}
                      onChange={e => setNewProject({...newProject, description: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] text-xs font-medium resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Category</label>
                      <select 
                        value={newProject.type}
                        onChange={e => setNewProject({...newProject, type: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#1c222b] border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] text-xs"
                      >
                        {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Target Deadline *</label>
                      <input 
                        type="date" required
                        value={newProject.deadline}
                        onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Assign team</label>
                    <select 
                      value={newProject.teamId}
                      onChange={e => setNewProject({...newProject, teamId: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1c222b] border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] text-xs cursor-pointer"
                    >
                      <option value="">-- Leave Unassigned --</option>
                      {filteredTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Hosted Build URL</label>
                      <input 
                        type="url" placeholder="https://..."
                        value={newProject.live_url}
                        onChange={e => setNewProject({...newProject, live_url: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">GitHub Repository URL</label>
                      <input 
                        type="url" placeholder="https://github.com/..."
                        value={newProject.github_repo}
                        onChange={e => setNewProject({...newProject, github_repo: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] text-xs"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border rounded-xl hover:bg-white/5 text-xs font-bold uppercase">Cancel</button>
                <button form="project-form" type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#00b4d8] text-black hover:bg-[#00c8f0] text-xs font-black uppercase rounded-xl">{isSubmitting ? 'Syncing...' : 'Deploy Project'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deletingProject && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setDeletingProject(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#0f172a] border border-red-500/30 rounded-3xl p-6 text-center text-white"
            >
              <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-lg font-black uppercase mb-2">Delete Project Dossier?</h2>
              <p className="text-xs text-white/60 mb-6">Are you sure you want to delete {deletingProject.name}? This will remove all associated database references.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeletingProject(null)} className="px-5 py-2.5 border rounded-xl hover:bg-white/5 text-xs font-bold uppercase flex-1">Cancel</button>
                <button onClick={handleDeleteProject} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-xs font-black uppercase flex-1">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
