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
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20 text-carbon-black-DEFAULT text-left font-sans">
      
      {/* --- TOP HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Projects", val: stats.total, icon: Layers, bg: "bg-sky-50 border-sky-100", color: "text-sky-600", iconColor: "text-sky-400" },
          { label: "Live Deployments", val: stats.live, icon: Activity, bg: "bg-emerald-50 border-emerald-100", color: "text-emerald-600", iconColor: "text-emerald-400" },
          { label: "Awaiting Handshake", val: stats.pending, icon: Clock, bg: "bg-orange-50 border-orange-100", color: "text-orange-600", iconColor: "text-orange-400" },
        ].map((s, i) => (
          <div key={i} className={`border-2 p-6 flex flex-col justify-between rounded-2xl shadow-sm relative overflow-hidden ${s.bg}`}>
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs font-black text-slate-grey-500 uppercase tracking-widest">{s.label}</p>
               </div>
               <s.icon size={24} className={s.iconColor} />
            </div>
            <p className={`text-4xl font-black italic tracking-tight ${s.color}`}>{s.val.toString().padStart(2, '0')}</p>
          </div>
        ))}
      </div>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b-2 border-slate-grey-200/50 pb-6 gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center border-2 border-sky-200 shadow-sm">
            <Briefcase className="text-sky-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-carbon-black-DEFAULT tracking-tight uppercase leading-none text-left">Nexus Project Core</h2>
            <p className="text-[10px] text-slate-grey-500 font-bold tracking-widest uppercase mt-2 text-left">Operational Registry</p>
          </div>
        </div>

        <button 
          onClick={() => setView(view === 'list' ? 'add' : 'list')}
          className={`px-8 py-3 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all rounded-xl border-2 shrink-0 shadow-sm gaming-clip-btn ${view === 'add' ? 'bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100' : 'bg-carbon-black-DEFAULT text-white border-carbon-black-DEFAULT hover:bg-carbon-black-600 hover:border-carbon-black-600'}`}
        >
          {view === 'list' ? <><Plus size={16} /> New Forge</> : <><Clock size={16} /> View Matrix</>}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="crystal-card overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-grey-50 border-b-2 border-slate-grey-200 text-[10px] font-black text-slate-grey-500 uppercase tracking-widest">
                    <th className="p-5 w-16 text-center">Sel</th>
                    <th className="p-5">Ident / Title</th>
                    <th className="p-5">Assigned Team</th>
                    <th className="p-5">Integrity</th>
                    <th className="p-5 text-center">Target Date</th>
                    <th className="p-5 text-center">Status</th>
                    <th className="p-5 text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-grey-100">
                  {sortedProjects.map((project) => (
                    <tr key={project.id} className="group hover:bg-sky-50/50 transition-colors bg-white"> 
                      <td className="p-5 text-center">
                        <button onClick={() => toggleSelect(project.id)} className="text-slate-grey-400 hover:text-sky-500 transition-colors">
                          {selectedIds.includes(project.id) ? <CheckSquare size={20} className="text-sky-500" /> : <Square size={20} />}
                        </button>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] font-bold text-slate-grey-500 mb-1">{project.id} <span className="text-slate-grey-300 mx-1">/</span> {project.type}</span>
                          <span className="text-sm font-black text-carbon-black-DEFAULT group-hover:text-sky-600 transition-colors uppercase pr-4">{project.name}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-slate-grey-100 flex items-center justify-center">
                             <Users size={12} className="text-slate-grey-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-grey-600 uppercase tracking-tight">{project.team}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="w-40">
                          <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                            <span className="text-slate-grey-500 tracking-widest">Sync</span>
                            <span className="text-sky-600">{project.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-grey-100 rounded-full overflow-hidden border border-slate-grey-200">
                            <motion.div 
                              initial={{ width: 0 }} animate={{ width: `${project.progress}%` }}
                              className={`h-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-sky-500'}`} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                           <Calendar size={14} className="text-slate-grey-400 group-hover:text-sky-500 transition-colors" />
                           <span className="text-[10px] font-bold text-slate-grey-600">{project.date}</span>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border ${project.status === 'LIVE' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : project.status === 'COMPLETED' ? 'border-sky-200 text-sky-700 bg-sky-50' : 'border-orange-200 text-orange-700 bg-orange-50'}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button onClick={() => deleteProject(project.id)} className="p-2 text-slate-grey-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all inline-flex items-center justify-center">
                          <Trash2 size={16} />
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
            <div className="crystal-card p-10 relative overflow-hidden border-t-4 border-t-sky-400">
              <form onSubmit={handleManualSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest ml-1">Project Identity</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g. Nexus Core" className="w-full bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest ml-1">Domain Sector</label>
                    <input required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} type="text" placeholder="e.g. Web App" className="w-full bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest ml-1">Assign Team</label>
                    <select required value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})} className="w-full bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors appearance-none">
                      <option value="" disabled className="text-slate-grey-400">Select Team</option>
                      {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest ml-1">Target Deadline</label>
                    <input required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} type="date" className="w-full bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-slate-grey-500 outline-none focus:border-sky-500 transition-colors" />
                  </div>
                </div>
                <div className="pt-4 border-t-2 border-slate-grey-100">
                    <button type="submit" className="w-full py-5 bg-sky-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-sky-600 transition-all shadow-md gaming-clip-btn">Initialize Forge Protocol</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};