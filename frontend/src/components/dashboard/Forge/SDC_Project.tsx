/* cspell:disable */
import { useState, useMemo } from 'react';
import { 
  Briefcase, Plus, Clock, 
  CheckSquare, Square, Trash2, 
  Layers, Activity, Users, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../../store/useStore';

// --- MOCK DATA ---
const INITIAL_PROJECTS = [
  { id: 'P-001', name: 'PhishGuard_AI', status: 'LIVE', type: 'Cybersecurity', date: '2026-03-01', team: 'Team Alpha', progress: 100 },
  { id: 'P-002', name: 'Nexus_VCS', status: 'PENDING', type: 'DevTools', date: '2026-04-15', team: 'Team Beta', progress: 45 },
  { id: 'P-003', name: 'Jolt_Notes', status: 'COMPLETED', type: 'Utility', date: '2025-12-20', team: 'Team Alpha', progress: 100 },
  { id: 'P-004', name: 'SDC_Portal_v2', status: 'LIVE', type: 'Web_App', date: '2026-05-10', team: 'Team Delta', progress: 85 },
];

export const SDC_Project = () => {
  const { teams } = useStore();
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [view, setView] = useState<'list' | 'add'>('list');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', type: '', team: '', deadline: '' });

  const stats = useMemo(() => ({
    total: projects.length,
    live: projects.filter(p => p.status === 'LIVE').length,
    pending: projects.filter(p => p.status === 'PENDING').length
  }), [projects]);

  const sortedProjects = useMemo(() => {
    const statusOrder = { 'LIVE': 1, 'PENDING': 2, 'COMPLETED': 3 };
    return [...projects].sort((a, b) => 
      (statusOrder[a.status as keyof typeof statusOrder] || 99) - 
      (statusOrder[b.status as keyof typeof statusOrder] || 99)
    );
  }, [projects]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteProject = (id: string) => {
    if(window.confirm("Terminate Project Data?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj = {
      id: `P-00${projects.length + 1}`,
      name: formData.name,
      type: formData.type,
      status: 'PENDING',
      date: formData.deadline,
      team: formData.team,
      progress: 0
    };
    setProjects([newProj, ...projects]);
    setView('list');
    setFormData({ name: '', type: '', team: '', deadline: '' });
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20 text-zinc-300 text-left">
      
      {/* --- TOP HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total_Projects", val: stats.total, icon: Layers, color: "text-white" },
          { label: "Live_Deployments", val: stats.live, icon: Activity, color: "text-emerald-400" },
          { label: "Awaiting_Handshake", val: stats.pending, icon: Clock, color: "text-orange-400" },
        ].map((s, i) => (
          <div key={i} className="bg-zinc-900/30 border border-white/5 p-4 flex items-center justify-between rounded-sm text-left">
            <div>
              <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">{s.label}</p>
              <p className={`text-xl font-black italic tracking-tighter ${s.color}`}>{s.val.toString().padStart(2, '0')}</p>
            </div>
            <s.icon size={20} className="text-zinc-800" />
          </div>
        ))}
      </div>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-6 gap-4">
        <div className="flex items-center gap-3 w-full">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rotate-45">
            <Briefcase className="text-sky-400 -rotate-45" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic leading-none text-left">Nexus_Project_Core</h2>
            <p className="text-[8px] text-zinc-600 font-bold tracking-[0.3em] uppercase mt-1 text-left">Operational_Registry</p>
          </div>
        </div>

        <button 
          onClick={() => setView(view === 'list' ? 'add' : 'list')}
          className={`px-6 py-2.5 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all rounded-sm border shrink-0 ${view === 'add' ? 'bg-white text-black border-white' : 'bg-black text-white border-white/10 hover:border-sky-500/50'}`}
        >
          {view === 'list' ? <><Plus size={14} /> New_Forge</> : <><Clock size={14} /> View_Matrix</>}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="bg-black border border-white/5 overflow-hidden rounded-sm relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                    <th className="p-4 w-12 text-center">Sel</th>
                    <th className="p-4">Ident / Title</th>
                    <th className="p-4">Assigned_Team</th>
                    <th className="p-4">Integrity</th>
                    <th className="p-4 text-center">Target_Date</th> {/* DEADLINE HEADER */}
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedProjects.map((project) => (
                    <tr key={project.id} className="group hover:bg-white/2 transition-all"> 
                      <td className="p-4 text-center">
                        <button onClick={() => toggleSelect(project.id)} className="text-zinc-700 hover:text-sky-400 transition-colors">
                          {selectedIds.includes(project.id) ? <CheckSquare size={16} className="text-sky-400" /> : <Square size={16} />}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] font-mono text-zinc-600 mb-1">{project.id} // {project.type}</span>
                          <span className="text-xs font-black text-white group-hover:text-sky-400 transition-colors uppercase italic">{project.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Users size={12} className="text-zinc-600" />
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{project.team}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-32">
                          <div className="flex justify-between text-[7px] font-black uppercase mb-1">
                            <span className="text-zinc-500 font-mono tracking-widest">Sync</span>
                            <span className="text-sky-500">{project.progress}%</span>
                          </div>
                          <div className="h-1 bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} animate={{ width: `${project.progress}%` }}
                              className={`h-full ${project.progress === 100 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-sky-500'}`} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center"> {/* DEADLINE COLUMN */}
                        <div className="flex flex-col items-center gap-1">
                           <Calendar size={12} className="text-zinc-600" />
                           <span className="text-[10px] font-mono font-bold text-zinc-400">{project.date}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[8px] font-black uppercase px-2 py-1 border ${project.status === 'LIVE' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-orange-500/30 text-orange-400 bg-orange-500/5'}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteProject(project.id)} className="p-2 text-zinc-800 hover:text-red-500 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div key="add" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto text-left">
            <div className="bg-zinc-900/20 border border-white/5 p-10 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Project_Identity</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder="E.G. NEXUS_CORE" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-emerald-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Domain_Sector</label>
                    <input required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} type="text" placeholder="E.G. WEB_APP" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-emerald-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Assign_Team</label>
                    <select required value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-emerald-500/50 scheme-dark">
                      <option value="">SELECT_TEAM</option>
                      {teams.map(t => <option key={t.id} value={t.name}>{t.name.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Target_Deadline</label>
                    <input required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} type="date" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-emerald-500/50 scheme-dark" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-400 transition-all shadow-2xl">Initialize_Forge_Protocol</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};