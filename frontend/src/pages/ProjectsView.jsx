import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Target, Calendar, CheckCircle2, Clock, Package, Zap, Plus, X, Link, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI, teamsAPI } from '../api/services';

const formatDate = (dateString) => {
  if (!dateString) return 'No Date';
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const PROJECT_TYPES = ["Web Application", "Mobile App", "AI/ML Model", "Cybersecurity", "Blockchain", "Hardware/IoT", "Other"];
const STATUS_COLORS = {
  'DRAFT': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'PENDING_SRS': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'LIVE': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'COMPLETED': 'bg-sky-500/20 text-sky-400 border-sky-500/30'
};

const MOCK_TEAMS = [
  { id: 'mock-t1', name: 'Alpha Strike' },
  { id: 'mock-t2', name: 'Omega Web' },
  { id: 'mock-t3', name: 'Phantom AI' },
];

const MOCK_PROJECTS = [
  { id: 'mock-p1', name: 'SDC Portal v2', type: 'Web Application', status: 'LIVE', deadline: '2025-12-31', teamId: 'mock-t1', srsLink: 'https://docs.google.com', description: 'A centralized portal for SDC management.' },
  { id: 'mock-p2', name: 'Campus Connect', type: 'Mobile App', status: 'PENDING_SRS', deadline: '2025-10-15', teamId: 'mock-t2', srsLink: '', description: 'Cross-platform mobile app for campus events.' },
  { id: 'mock-p3', name: 'AI Attendance', type: 'AI/ML Model', status: 'DRAFT', deadline: '2026-03-01', teamId: 'mock-t3', srsLink: '', description: 'Face recognition attendance system.' },
  { id: 'mock-p4', name: 'Cybersec Dashboard', type: 'Cybersecurity', status: 'COMPLETED', deadline: '2025-08-20', teamId: 'mock-t1', srsLink: 'https://docs.google.com', description: 'Real-time security monitoring dashboard.' },
  { id: 'mock-p5', name: 'Alumni Connect', type: 'Web Application', status: 'LIVE', deadline: '2026-01-10', teamId: 'mock-t2', srsLink: '', description: 'Alumni networking portal.' },
  { id: 'mock-p6', name: 'Smart Library', type: 'Hardware/IoT', status: 'DRAFT', deadline: '2026-05-15', teamId: '', srsLink: '', description: 'IoT based smart library management.' },
];

export default function ProjectsView() {
  const { role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'Web Application',
    deadline: '',
    teamId: '',
    srsLink: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pData, tData] = await Promise.all([
        projectsAPI.getAll().catch(() => []),
        teamsAPI.getAll().catch(() => [])
      ]);
      setProjects(pData?.length ? pData : MOCK_PROJECTS);
      setTeams(tData?.length ? tData : MOCK_TEAMS);
    } catch (e) {
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
      const created = await projectsAPI.create(newProject);
      setProjects([...projects, created]);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '', type: 'Web Application', deadline: '', teamId: '', srsLink: '' });
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

  const filteblueProjects = useMemo(() => {
    return projects.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [projects, searchQuery]);

  const getTeamName = (teamId) => {
    const t = teams.find(team => team.id === teamId);
    return t ? t.name : 'Unassigned';
  };

  return (
    <div className="h-full flex flex-col font-sans text-white pb-6 relative z-10 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
              <Target className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-sky-400 uppercase">Project Tracker</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase drop-shadow-md">Active Operations</h1>
          <p className="text-sm text-white/40 mt-1 font-medium">Manage projects, track SRS links, and monitor development statuses.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all placeholder:text-white/30 shadow-inner"
            />
          </div>
          {role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 border border-white/10 uppercase tracking-wider shrink-0"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {filteblueProjects.length === 0 ? (
          <div className="h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/30 p-8">
            <Package className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-xl font-bold text-white/50 tracking-widest uppercase mb-1">No Projects Found</p>
            <p className="text-sm opacity-50">Create a new project to start tracking development.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteblueProjects.map((project, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  key={project.id}
                  className="bg-[#1c222b] border border-white/5 hover:border-white/15 rounded-[2rem] p-6 relative overflow-hidden group hover:bg-white/[0.03] transition-all shadow-xl hover:shadow-2xl flex flex-col"
                >
                  {/* Ambient Background Glow based on status */}
                  {project.status === 'COMPLETED' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-[50px] pointer-events-none rounded-full"></div>
                  )}
                  {project.status === 'LIVE' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none rounded-full"></div>
                  )}

                  {/* Top Bar */}
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${STATUS_COLORS[project.status || 'DRAFT'] || STATUS_COLORS['DRAFT']}`}>
                      {project.status?.replace('_', ' ') || 'DRAFT'}
                    </span>
                    
                    {/* Status Update Dropdown for Admins */}
                    {role === 'admin' && (
                       <select 
                         value={project.status || 'DRAFT'}
                         onChange={(e) => handleUpdateStatus(project.id, e.target.value)}
                         className="bg-transparent text-[10px] uppercase font-bold text-white/40 cursor-pointer focus:outline-none hover:text-white"
                       >
                         <option value="DRAFT" className="bg-[#1c222b]">Draft</option>
                         <option value="PENDING_SRS" className="bg-[#1c222b]">Pending SRS</option>
                         <option value="LIVE" className="bg-[#1c222b]">Live (Coding)</option>
                         <option value="COMPLETED" className="bg-[#1c222b]">Completed</option>
                       </select>
                    )}
                  </div>

                  {/* Project Name & Type */}
                  <div className="mb-6 relative z-10">
                    <h3 className="text-xl font-black text-white group-hover:text-sky-400 transition-colors leading-tight mb-1 truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{project.type || 'General Project'}</p>
                  </div>
                  
                  {/* Team Assignment */}
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl mb-4">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Assigned Team</p>
                    <p className="text-sm font-bold text-white/80 flex items-center gap-2">
                       {project.teamId ? <Users className="w-3.5 h-3.5 text-blue-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />}
                       {getTeamName(project.teamId)}
                    </p>
                  </div>

                  {/* SRS Link & Deadline */}
                  <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">SRS Document</div>
                      {project.srsLink ? (
                        <a href={project.srsLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          <Link className="w-3 h-3" /> View SRS
                        </a>
                      ) : (
                        <span className="text-xs font-medium text-white/30">Not uploaded</span>
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Deadline</div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white/70">
                        <Calendar className="w-3.5 h-3.5 text-sky-500/50" />
                        {formatDate(project.deadline)}
                      </div>
                    </div>
                  </div>

                </motion.div>
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
              className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-sky-900/20 to-transparent relative overflow-hidden shrink-0">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[50px] -mr-20 -mt-20"></div>
                 <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                       <Package className="w-5 h-5 text-sky-400" />
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
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold text-center">
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
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-500 focus:bg-white/10 transition-all font-medium"
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
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-500 focus:bg-white/10 transition-all font-medium custom-scrollbar"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Project Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Category</label>
                      <select 
                        value={newProject.type}
                        onChange={e => setNewProject({...newProject, type: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#1c222b] border border-white/10 text-white focus:outline-none focus:border-sky-500 transition-all font-medium cursor-pointer"
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
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-500 focus:bg-white/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Team Assignment */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Assign to Team</label>
                    <select 
                        value={newProject.teamId}
                        onChange={e => setNewProject({...newProject, teamId: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#1c222b] border border-white/10 text-white focus:outline-none focus:border-sky-500 transition-all font-medium cursor-pointer"
                      >
                        <option value="">-- Leave Unassigned --</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>

                  {/* SRS Link */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">SRS Document URL (Optional)</label>
                    <div className="relative">
                       <Link className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                       <input 
                         type="url" 
                         placeholder="https://docs.google.com/..."
                         value={newProject.srsLink}
                         onChange={e => setNewProject({...newProject, srsLink: e.target.value})}
                         className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-500 focus:bg-white/10 transition-all font-medium"
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
                  className="px-6 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-400 transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Create Project'}
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
