import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Target, Calendar, CheckCircle2, Clock, Package,
  Zap, Plus, X, Link as LinkIcon, AlertTriangle, Users,
  FileText, Globe, Image as ImageIcon, Check, Edit3, Trash2
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

const isOverdue = (deadline, status) => {
  if (!deadline || status === 'COMPLETED') return false;
  return new Date(deadline) < new Date();
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

const MOCK_TEAMS = [
  { id: 'mock-t1', name: 'Alpha Strike' },
  { id: 'mock-t2', name: 'Omega Web' },
  { id: 'mock-t3', name: 'Phantom AI' },
];

const MOCK_PROJECTS = [
  { id: 'mock-p1', name: 'SDC Portal v2', type: 'Web Application', status: 'LIVE', deadline: '2025-12-31', teamId: 'mock-t1', srsLink: 'https://docs.google.com', description: 'A centralized portal for SDC management.', live_url: '', image_url: '' },
  { id: 'mock-p2', name: 'Campus Connect', type: 'Mobile App', status: 'PENDING_SRS', deadline: '2025-10-15', teamId: 'mock-t2', srsLink: '', description: 'Cross-platform mobile app for campus events.', live_url: '', image_url: '' },
  { id: 'mock-p3', name: 'AI Attendance', type: 'AI/ML Model', status: 'DRAFT', deadline: '2026-03-01', teamId: 'mock-t3', srsLink: '', description: 'Face recognition attendance system.', live_url: '', image_url: '' },
  { id: 'mock-p4', name: 'Cybersec Dashboard', type: 'Cybersecurity', status: 'COMPLETED', deadline: '2025-08-20', teamId: 'mock-t1', srsLink: 'https://docs.google.com', description: 'Real-time security monitoring dashboard.', live_url: 'https://github.com', image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80' },
];

// ==========================================
// FOLDER COMPONENT (THE MAIN UI STAR)
// ==========================================
// ==========================================
// FOLDER COMPONENT (THE MAIN UI STAR)
// ==========================================
function ProjectFolder({ project, teams, allUsers, onUpdateStatus, onUpdateProject, onDeleteProject, role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFile, setActiveFile] = useState('report'); // report | team | srs
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '' });
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Quick edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: project.name,
    description: project.description || '',
    live_url: project.live_url || '',
    image_url: project.image_url || '',
    github_repo: project.github_repo || '',
    srsLink: project.srsLink || '',
    status: project.status
  });

  const statusCfg = STATUS_COLORS[project.status || 'DRAFT'] || STATUS_COLORS['DRAFT'];

  // Fetch team members when opening the team file tab
  useEffect(() => {
    if (isOpen && activeFile === 'team' && project.teamId) {
      const fetchMembers = async () => {
        setIsLoadingMembers(true);
        try {
          const membersList = await teamsAPI.getMembers(project.teamId).catch(() => []);
          // Map membersList user_ids to allUsers details
          const enriched = membersList.map(m => {
            const userDetail = allUsers.find(u => u.id === m.user_id);
            return {
              id: m.id,
              name: userDetail ? userDetail.name : `Operator ${m.user_id.substring(0, 4)}`,
              email: userDetail ? userDetail.email : '',
              role: userDetail ? userDetail.role : '',
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
      fetchMembers();
    }
  }, [isOpen, activeFile, project.teamId, allUsers]);

  // Fetch tasks when opening the tasks file tab
  useEffect(() => {
    if (isOpen && activeFile === 'tasks') {
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
      fetchTasks();
    }
  }, [isOpen, activeFile, project.id]);

  // Fetch comments when opening the feedback tab
  useEffect(() => {
    if (isOpen && activeFile === 'feedback') {
      const fetchComments = async () => {
        try {
          const cList = await interactionsAPI.getAll('project', project.id).catch(() => []);
          const enriched = cList.map(c => {
            const userDetail = allUsers.find(u => u.id === c.user_id);
            return { ...c, user_name: userDetail ? userDetail.name : 'Unknown User' };
          });
          setComments(enriched);
        } catch {
          setComments([]);
        }
      };
      fetchComments();
    }
  }, [isOpen, activeFile, project.id, allUsers]);

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
      const userDetail = allUsers.find(u => u.id === created.user_id);
      created.user_name = userDetail ? userDetail.name : 'You';
      setComments(prev => [...prev, created]);
      setNewComment('');
    } catch (err) {
      alert("Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    setIsSubmittingTask(true);
    try {
      const created = await tasksAPI.create({ ...newTask, project_id: project.id });
      setTasks(prev => [...prev, created]);
      setNewTask({ title: '', description: '', assigned_to: '' });
    } catch (err) {
      alert("Failed to create task");
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleTaskStatus = async (taskId, status) => {
    try {
      await tasksAPI.updateStatus(taskId, status);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: status } : t));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await projectsAPI.update(project.id, {
        name: editData.name,
        description: editData.description,
        live_url: editData.live_url,
        image_url: editData.image_url,
        github_repo: editData.github_repo,
        srsLink: editData.srsLink,
        status: editData.status
      });
      onUpdateProject(updated);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update project details.");
    }
  };

  const getTeamName = (teamId) => {
    const t = teams.find(team => team.id === teamId);
    return t ? t.name : 'Unassigned';
  };

  const folderTags = [project.type ? project.type.replace('_', ' ') : "Web App"];

  return (
    <>
      {/* 📁 macOS Style Folder Icon (SVG) */}
      <motion.div 
        layoutId={`folder-container-${project.id}`}
        className="relative w-36 h-28 cursor-pointer mt-6 mx-auto group"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Back flap (darker blue) */}
          <path d="M5,10 L35,10 L45,20 L115,20 C117.76,20 120,22.24 120,25 L120,85 C120,87.76 117.76,90 115,90 L5,90 C2.24,90 0,87.76 0,85 L0,15 C0,12.24 2.24,10 5,10 Z" fill="#0284c7"/>
          {/* Front flap (lighter blue) */}
          <path d="M5,22 L115,22 C117.76,22 120,24.24 120,27 L120,85 C120,87.76 117.76,90 115,90 L5,90 C2.24,90 0,87.76 0,85 L0,27 C0,24.24 2.24,22 5,22 Z" fill="#38bdf8"/>
          {/* Subtle gradient overlay for realism */}
          <path d="M5,22 L115,22 C117.76,22 120,24.24 120,27 L120,40 L0,40 L0,27 C0,24.24 2.24,22 5,22 Z" fill="white" fillOpacity="0.15"/>
        </svg>

        {/* Content overlaid on the folder */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-4 pointer-events-none">
          <div className="absolute top-7 right-4">
             <div className={`w-2.5 h-2.5 rounded-full shadow-sm animate-pulse ${project.status === 'LIVE' ? 'bg-cyan-300' : project.status === 'COMPLETED' ? 'bg-emerald-300' : 'bg-amber-300'}`}></div>
          </div>
          <div className="w-full text-center px-2">
             <h4 className="text-[11px] font-black text-white truncate drop-shadow-md">{project.name}</h4>
             <p className="text-[8px] text-sky-100 font-mono uppercase tracking-widest truncate mt-0.5">{project.type}</p>
          </div>
        </div>
      </motion.div>

      {/* 📄 Full Size Modal File Viewer (macOS Launchpad / Window Style) */}
      <AnimatePresence>
        {isOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
              {/* Blurred Background Overlay */}
              <motion.div 
                 initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
                 animate={{ opacity: 1, backdropFilter: "blur(12px)" }} 
                 exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                 transition={{ duration: 0.3 }}
                 className="absolute inset-0 bg-black/40 cursor-pointer"
                 onClick={() => setIsOpen(false)}
              />
              
              {/* Modal Window */}
              <motion.div 
                 layoutId={`folder-container-${project.id}`}
                 initial={{ opacity: 0, scale: 0.8, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.8, y: 20 }}
                 transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.8 }}
                 className="relative w-full max-w-4xl max-h-[85vh] bg-[#f8f9fa]/95 backdrop-blur-xl rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden border border-white/20"
              >
                {/* Close Button Top Right */}
                <button 
                   onClick={() => setIsOpen(false)}
                   className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors z-50 shadow-sm"
                >
                   <X className="w-4 h-4" />
                </button>

                {/* --- FILE TAB NAVIGATION --- */}
                <div className="flex justify-center gap-2 p-3 bg-white border-b border-gray-200 shrink-0 shadow-sm relative z-40 overflow-x-auto">
                  {['report', 'tasks', 'team', 'srs', 'feedback'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveFile(tab)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                        activeFile === tab
                          ? 'bg-[#00b4d8] text-white border-[#00b4d8] font-black shadow-md shadow-[#00b4d8]/20'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {tab === 'report' ? '📋 Project Report' : tab === 'tasks' ? '✅ Tasks' : tab === 'team' ? '👥 Team Roster' : tab === 'srs' ? '📄 SRS Specs' : '💬 Feedback'}
                    </button>
                  ))}
                </div>

                {/* --- FILE CONTAINER (Paper Sheet) --- */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar text-slate-800 relative bg-white">
                  
                  {/* --- 1. PROJECT REPORT TAB --- */}
                  {activeFile === 'report' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                      {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-4">
                          <div className="space-y-3">
                            <input 
                              type="text" required
                              value={editData.name}
                              onChange={e => setEditData({ ...editData, name: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-[#00b4d8] shadow-sm"
                              placeholder="Project Codename"
                            />
                            <textarea 
                              rows="3"
                              value={editData.description}
                              onChange={e => setEditData({ ...editData, description: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:border-[#00b4d8] shadow-sm resize-none"
                              placeholder="Project Description..."
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <input 
                                type="url" 
                                value={editData.live_url}
                                onChange={e => setEditData({ ...editData, live_url: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#00b4d8]"
                                placeholder="Hosted/Live URL"
                              />
                              <input 
                                type="url"
                                value={editData.image_url}
                                onChange={e => setEditData({ ...editData, image_url: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#00b4d8]"
                                placeholder="Preview Image URL"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <input 
                                type="url" 
                                value={editData.github_repo}
                                onChange={e => setEditData({ ...editData, github_repo: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#00b4d8]"
                                placeholder="GitHub Repo URL"
                              />
                              <select
                                value={editData.status}
                                onChange={e => setEditData({ ...editData, status: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#00b4d8] cursor-pointer"
                              >
                                <option value="DRAFT">Draft</option>
                                <option value="PENDING_SRS">Pending SRS</option>
                                <option value="LIVE">Live</option>
                                <option value="COMPLETED">Completed</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                            <button 
                              type="button" onClick={() => setIsEditing(false)}
                              className="px-6 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="px-6 py-2.5 rounded-lg bg-[#00b4d8] text-white text-sm font-bold shadow-lg shadow-[#00b4d8]/20 hover:bg-[#0096c7] transition-colors"
                            >
                              Save Updates
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          {/* Header / Badges */}
                          <div className="flex items-center justify-between border-b border-black/10 pb-4">
                            <span className="text-[10px] font-mono font-bold text-red-600 border border-red-300 px-3 py-1 uppercase tracking-widest bg-red-50 rounded shadow-sm">
                              Official Project Dossier
                            </span>
                            <span className="text-xs font-mono text-slate-400">ID: #{project.id.substring(0, 8)}</span>
                          </div>

                          {/* Titles */}
                          <div>
                            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                              {project.name}
                            </h2>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              {project.description || 'No objective or descriptions specified for this deployment.'}
                            </p>
                          </div>

                          {/* Image preview box if completed/image uploaded */}
                          {project.image_url && (
                            <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-200 shadow-md">
                              <img src={project.image_url} alt="Deployment Preview" className="h-full w-full object-cover" />
                              <div className="absolute top-3 left-3 bg-[#020617]/70 text-xs text-white font-mono uppercase tracking-widest px-3 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-md">
                                <ImageIcon className="w-4 h-4" /> Preview Thumbnail
                              </div>
                            </div>
                          )}

                          {/* Links Row */}
                          <div className="grid grid-cols-2 gap-4">
                            {project.live_url ? (
                              <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-emerald-700 text-xs font-black uppercase tracking-wider transition-colors border border-emerald-200 shadow-sm">
                                <Globe className="w-5 h-5" /> Live Build Deployment
                              </a>
                            ) : (
                              <div className="flex items-center gap-2 p-4 bg-slate-100 rounded-xl text-slate-400 text-xs font-bold uppercase tracking-wider border border-slate-200/50">
                                <Globe className="w-5 h-5" /> Undeployed
                              </div>
                            )}

                            {project.github_repo ? (
                              <a href={project.github_repo} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 text-xs font-black uppercase tracking-wider transition-colors border border-slate-300 shadow-sm">
                                <Github className="w-5 h-5" /> Code Repository
                              </a>
                            ) : (
                              <div className="flex items-center gap-2 p-4 bg-slate-100 rounded-xl text-slate-400 text-xs font-bold uppercase tracking-wider border border-slate-200/50">
                                <Github className="w-5 h-5" /> Private Repository
                              </div>
                            )}
                          </div>

                          {/* Status Footer */}
                          <div className="border-t border-black/10 pt-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Target Delivery Date</span>
                              <span className="text-sm font-black text-slate-800">{formatDate(project.deadline)}</span>
                            </div>
                            {(role === 'admin' || role === 'mentor') && (
                               <div className="flex gap-2">
                                 <button
                                   onClick={() => {
                                     setEditData({
                                       name: project.name,
                                       description: project.description || '',
                                       live_url: project.live_url || '',
                                       image_url: project.image_url || '',
                                       github_repo: project.github_repo || '',
                                       srsLink: project.srsLink || '',
                                       status: project.status
                                     });
                                     setIsEditing(true);
                                   }}
                                   className="px-5 py-2.5 rounded-lg border-2 border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 flex items-center gap-2 transition-all shadow-sm"
                                 >
                                   <Edit3 className="w-4 h-4" /> Edit Dossier
                                 </button>
                                 <button
                                   onClick={() => onDeleteProject(project)}
                                   className="px-5 py-2.5 rounded-lg border-2 border-red-200 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center gap-2 transition-all shadow-sm"
                                 >
                                   <Trash2 className="w-4 h-4" /> Delete Dossier
                                 </button>
                               </div>
                             )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- 2. TEAM MEMBERS TAB --- */}
                  {activeFile === 'team' && (
                    <div className="max-w-2xl mx-auto">
                      <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                          <Users className="w-5 h-5 text-slate-500" /> Assigned Personnel
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                          Team: {getTeamName(project.teamId)}
                        </span>
                      </div>

                      {project.teamId ? (
                        isLoadingMembers ? (
                          <div className="py-12 text-center text-sm font-bold text-slate-400 animate-pulse">Loading team roster...</div>
                        ) : teamMembers.length === 0 ? (
                          <div className="py-12 text-center text-sm font-bold text-slate-400">No members assigned to this squad yet.</div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teamMembers.map(m => (
                              <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">{m.name}</h4>
                                  <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]" title={m.email}>{m.email}</p>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/20 shrink-0">
                                  {m.designation}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        <div className="py-16 text-center flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                          <AlertTriangle className="w-12 h-12 text-amber-500 opacity-80 mb-4" />
                          <p className="text-lg font-black text-slate-700 mb-1">No Team Assigned</p>
                          <p className="text-xs font-medium">Assign a team inside the project details section.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- NEW TASKS TAB --- */}
                  {activeFile === 'tasks' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                      <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-slate-500" /> Action Items
                        </span>
                      </div>

                      {/* Project Report File Section */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-[#00b4d8]" />
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">Project Report Document</h4>
                              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">Final Submission File</p>
                            </div>
                          </div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-300 rounded-lg px-4 py-2 bg-white">
                            Pending Upload
                          </div>
                        </div>
                      </div>

                      {/* Note: Task Assignment has been moved to Team Leader Dashboard */}

                      {/* Task List */}
                      {isLoadingTasks ? (
                         <div className="py-8 text-center text-sm font-bold text-slate-400 animate-pulse">Loading tasks...</div>
                      ) : tasks.length === 0 ? (
                         <div className="py-8 text-center text-sm font-bold text-slate-400">No tasks pending for this project.</div>
                      ) : (
                        <div className="space-y-3">
                          {tasks.map(t => (
                            <div key={t.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <h4 className={`text-sm font-bold ${t.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{t.title}</h4>
                                {t.description && <p className="text-xs text-slate-500 mt-1">{t.description}</p>}
                              </div>
                              <select 
                                value={t.status}
                                onChange={e => handleTaskStatus(t.id, e.target.value)}
                                disabled={role !== 'admin' && role !== 'mentor'}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest outline-none border ${t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : t.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- 3. SRS LINK TAB --- */}
                  {activeFile === 'srs' && (
                    <div className="max-w-2xl mx-auto">
                      <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                          <FileText className="w-5 h-5 text-slate-500" /> Specs & Guidelines
                        </span>
                      </div>

                      <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col items-center text-center shadow-sm">
                        <FileText className="w-16 h-16 text-blue-500 mb-4 opacity-80" />
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-2">Software Requirement Spec</h4>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-md mb-8 font-medium">
                          The comprehensive documentation detailing layout design guidelines, system endpoints, user stories, and schemas.
                        </p>

                        {project.srsLink ? (
                          <a 
                            href={project.srsLink} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                          >
                            <LinkIcon className="w-4 h-4" /> Read Full SRS Document
                          </a>
                        ) : (
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-300 rounded-xl py-4 px-8 bg-white">
                            No Document Uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- 5. FEEDBACK / COMMENTS TAB --- */}
                  {activeFile === 'feedback' && (
                    <div className="max-w-2xl mx-auto flex flex-col h-full min-h-[400px]">
                      <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                           Discussion & Feedback
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                        {comments.length === 0 ? (
                           <div className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No comments yet. Start the discussion.</div>
                        ) : (
                           comments.map(c => (
                             <div key={c.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                               <div className="flex items-center justify-between mb-2">
                                 <span className="text-xs font-black text-slate-800">{c.user_name}</span>
                                 <span className="text-[9px] font-mono text-slate-400">{new Date(c.created_at).toLocaleString()}</span>
                               </div>
                               <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap">{c.content}</p>
                             </div>
                           ))
                        )}
                      </div>

                      <form onSubmit={handleCreateComment} className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-200">
                         <textarea
                           value={newComment}
                           onChange={e => setNewComment(e.target.value)}
                           className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-[#00b4d8] resize-none"
                           placeholder="Type your comment..."
                           rows="3"
                         />
                         <button
                           type="submit" disabled={isSubmittingComment}
                           className="self-end bg-[#00b4d8] text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#0096c7] transition-colors disabled:opacity-50 shadow-sm"
                         >
                           {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                         </button>
                      </form>
                    </div>
                  )}

                </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ProjectsView() {
  const { role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'Web Application',
    deadline: '',
    teamId: '',
    srsLink: '',
    live_url: '',
    image_url: '',
    github_repo: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pData, tData, uData] = await Promise.all([
        projectsAPI.getAll().catch(() => []),
        teamsAPI.getAll().catch(() => []),
        usersAPI.getAll().catch(() => [])
      ]);
      setProjects(pData?.length ? pData : MOCK_PROJECTS);
      setTeams(tData?.length ? tData : MOCK_TEAMS);
      setAllUsers(uData?.length ? uData : []);
    } catch {
      setProjects(MOCK_PROJECTS);
      setTeams(MOCK_TEAMS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const created = await projectsAPI.create({
        ...newProject,
        type: newProject.type.replace(/\s+/g, '_') // backend compatible type
      });
      setProjects([...projects, created]);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '', type: 'Web Application', deadline: '', teamId: '', srsLink: '', live_url: '', image_url: '', github_repo: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (projectId, newStatus) => {
    try {
      await projectsAPI.updateStatus(projectId, newStatus);
      setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  const handleUpdateProject = (updatedProj) => {
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
  };

  const handleDeleteProject = async () => {
    setIsSubmitting(true);
    try {
      await projectsAPI.delete(deletingProject.id);
      setProjects(prev => prev.filter(p => p.id !== deletingProject.id));
      setDeletingProject(null);
    } catch (err) {
      alert("Failed to delete project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [projects, searchQuery]);

  return (
    <div className="h-full flex flex-col font-sans text-white pb-6 relative z-10 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center">
              <Target className="w-3 h-3 text-[#00b4d8]" />
            </div>
            <span className="text-xs font-bold tracking-widest text-[#00b4d8] uppercase">Project Tracker</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-md">Active Operations</h1>
          <p className="text-xs text-white/40 mt-0.5 font-medium">Click folder to explore project records and extract files.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all placeholder:text-white/30 shadow-inner"
            />
          </div>
          {role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00b4d8]/10 border border-[#00b4d8]/30 text-[#00b4d8] text-sm font-black hover:bg-[#00b4d8]/20 hover:shadow-[0_0_20px_rgba(0,180,216,0.25)] transition-all hover:-translate-y-0.5 border border-white/10 uppercase tracking-widest shrink-0"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {filteredProjects.length === 0 ? (
          <div className="h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/30 p-8">
            <Package className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-xl font-bold text-white/50 tracking-widest uppercase mb-1">No Projects Found</p>
            <p className="text-sm opacity-50">Create a new project to start tracking development.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 pt-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectFolder
                  key={project.id}
                  project={project}
                  teams={teams}
                  allUsers={allUsers}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={() => setDeletingProject(project)}
                  role={role}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Project Modal */}
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
              className="relative w-full max-w-xl bg-[#020617] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-sky-900/20 to-transparent relative overflow-hidden shrink-0">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4d8]/10 rounded-full blur-[50px] -mr-20 -mt-20"></div>
                 <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/10 flex items-center justify-center border border-[#00b4d8]/30">
                       <Package className="w-5 h-5 text-[#00b4d8]" />
                     </div>
                     <h2 className="text-xl font-black text-white tracking-widest uppercase">Initialize Project</h2>
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
                <form id="project-form" onSubmit={handleCreateProject} className="space-y-5">
                  
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center">
                      {error}
                    </div>
                  )}

                  {/* Project Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Project Codename</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Project Phoenix"
                      value={newProject.name}
                      onChange={e => setNewProject({...newProject, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Objective / Description</label>
                    <textarea 
                      rows="2"
                      placeholder="Brief description of the project..."
                      value={newProject.description}
                      onChange={e => setNewProject({...newProject, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium custom-scrollbar resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Project Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Category</label>
                      <select 
                        value={newProject.type}
                        onChange={e => setNewProject({...newProject, type: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#1c222b] border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] transition-all font-medium cursor-pointer"
                      >
                        {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    {/* Deadline */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Deadline</label>
                      <input 
                        type="date" 
                        required
                        value={newProject.deadline}
                        onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Team Assignment */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Assign to Team</label>
                    <select 
                        value={newProject.teamId}
                        onChange={e => setNewProject({...newProject, teamId: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#1c222b] border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] transition-all font-medium cursor-pointer"
                      >
                        <option value="">-- Leave Unassigned --</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>

                  {/* Extra Links (Hosted URL & Image & Github) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Hosted/Live URL</label>
                      <input 
                        type="url" 
                        placeholder="https://..."
                        value={newProject.live_url}
                        onChange={e => setNewProject({...newProject, live_url: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Preview Image URL</label>
                      <input 
                        type="url" 
                        placeholder="https://images.unsplash.com/..."
                        value={newProject.image_url}
                        onChange={e => setNewProject({...newProject, image_url: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">GitHub Repository URL</label>
                      <input 
                        type="url" 
                        placeholder="https://github.com/..."
                        value={newProject.github_repo}
                        onChange={e => setNewProject({...newProject, github_repo: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">SRS Document URL (Optional)</label>
                      <input 
                        type="url" 
                        placeholder="https://docs.google.com/..."
                        value={newProject.srsLink}
                        onChange={e => setNewProject({...newProject, srsLink: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-xs"
                      />
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
                  form="project-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Create Project'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Project Confirmation Modal */}
      <AnimatePresence>
        {deletingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setDeletingProject(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#0f172a] border border-red-500/30 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-black text-white tracking-widest uppercase mb-2">Delete Project?</h2>
              <p className="text-sm text-white/60 mb-6">
                Are you sure you want to delete <span className="text-white font-bold">{deletingProject.name}</span>? This action cannot be undone and will delete all associated tasks.
              </p>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setDeletingProject(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider flex-1"
                >Cancel</button>
                <button 
                  onClick={handleDeleteProject} disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all text-sm font-black uppercase tracking-widest flex-1 disabled:opacity-50"
                >{isSubmitting ? 'Deleting...' : 'Delete Project'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 180, 216, 0.4); }
      `}} />
    </div>
  );
}
