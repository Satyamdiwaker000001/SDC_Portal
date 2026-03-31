/* cspell:disable */
import { useState, useMemo, useRef } from 'react';
import { 
  Briefcase, Plus, UploadCloud, CheckCircle2, 
  Clock, Play, CheckSquare, Square, Trash2, 
  Layers, Activity, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const INITIAL_PROJECTS = [
  { id: 'P-001', name: 'PhishGuard_AI', status: 'LIVE', type: 'Cybersecurity', date: '2026-03-01' },
  { id: 'P-002', name: 'Nexus_VCS', status: 'PENDING', type: 'DevTools', date: '2026-03-15' },
  { id: 'P-003', name: 'Jolt_Notes', status: 'COMPLETED', type: 'Utility', date: '2025-12-20' },
  { id: 'P-004', name: 'SDC_Portal_v2', status: 'LIVE', type: 'Web_App', date: '2026-01-10' },
];

export const SDC_Project = () => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [view, setView] = useState<'list' | 'add'>('list');
  const [addMode, setAddMode] = useState<'manual' | 'bulk'>('manual');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATS CALCULATION ---
  const stats = useMemo(() => ({
    total: projects.length,
    live: projects.filter(p => p.status === 'LIVE').length,
    pending: projects.filter(p => p.status === 'PENDING').length
  }), [projects]);

  // --- SORTING LOGIC (LIVE > PENDING > COMPLETED) ---
  const sortedProjects = useMemo(() => {
    const statusOrder = { 'LIVE': 1, 'PENDING': 2, 'COMPLETED': 3 };
    return [...projects].sort((a, b) => 
      (statusOrder[a.status as keyof typeof statusOrder] || 99) - 
      (statusOrder[b.status as keyof typeof statusOrder] || 99)
    );
  }, [projects]);

  // --- ACTIONS ---
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const makeLiveSelected = () => {
    setProjects(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'LIVE' } : p));
    setSelectedIds([]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20 text-zinc-300">
      
      {/* --- TOP HUD: MINI STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total_Projects", val: stats.total, icon: Layers, color: "text-white" },
          { label: "Live_Deployments", val: stats.live, icon: Activity, color: "text-emerald-400" },
          { label: "Awaiting_Handshake", val: stats.pending, icon: Clock, color: "text-orange-400" },
        ].map((s, i) => (
          <div key={i} className="bg-zinc-900/30 border border-white/5 p-4 flex items-center justify-between rounded-sm">
            <div>
              <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">{s.label}</p>
              <p className={`text-xl font-black italic tracking-tighter ${s.color}`}>{s.val.toString().padStart(2, '0')}</p>
            </div>
            <s.icon size={20} className="text-zinc-800" />
          </div>
        ))}
      </div>

      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rotate-45">
            <Briefcase className="text-sky-400 -rotate-45" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic leading-none">Nexus_Project_Core</h2>
            <p className="text-[8px] text-zinc-600 font-bold tracking-[0.3em] uppercase mt-1">Status: Operational_Registry</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.button 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                onClick={makeLiveSelected}
                className="px-6 py-2.5 bg-emerald-500 text-black font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 transition-all"
              >
                <Play size={12} fill="currentColor" /> Deploy_({selectedIds.length})
              </motion.button>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setView(view === 'list' ? 'add' : 'list')}
            className={`px-6 py-2.5 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all rounded-sm border ${view === 'add' ? 'bg-white text-black border-white' : 'bg-black text-white border-white/10 hover:border-sky-500/50'}`}
          >
            {view === 'list' ? <><Plus size={14} /> New_Project</> : <><Clock size={14} /> View_List</>}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="bg-black border border-white/5 overflow-hidden rounded-sm relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                    <th className="p-4 w-12 text-center">Sel</th>
                    <th className="p-4">Ident / Project_Title</th>
                    <th className="p-4">Sector</th>
                    <th className="p-4">Protocol_Status</th>
                    <th className="p-4 text-right">Actions_Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedProjects.map((project) => (
                    <tr key={project.id} className={`group transition-all ${project.status === 'LIVE' ? 'bg-emerald-500/2' : 'hover:bg-white/2'}`}>
                      <td className="p-4 text-center">
                        {project.status === 'PENDING' ? (
                          <button onClick={() => toggleSelect(project.id)} className="text-zinc-700 hover:text-sky-400 transition-colors">
                            {selectedIds.includes(project.id) ? <CheckSquare size={16} className="text-sky-400" /> : <Square size={16} />}
                          </button>
                        ) : (
                          <div className="flex justify-center">
                            {project.status === 'LIVE' ? <CheckCircle size={14} className="text-emerald-500" /> : <CheckCircle2 size={14} className="text-zinc-800" />}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-zinc-600 leading-none mb-1">{project.id}</span>
                          <span className="text-xs font-black text-white group-hover:text-sky-400 transition-colors uppercase italic">{project.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[9px] font-black text-zinc-500 bg-zinc-900 px-2 py-1 border border-white/5 uppercase tracking-tighter">{project.type}</span>
                      </td>
                      <td className="p-4">
                        <div className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${
                          project.status === 'LIVE' ? 'text-emerald-400' : 
                          project.status === 'PENDING' ? 'text-orange-400' : 'text-zinc-600'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${project.status === 'LIVE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : project.status === 'PENDING' ? 'bg-orange-500 animate-pulse' : 'bg-zinc-700'}`} />
                          {project.status}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <div className="text-right">
                            <p className="text-[7px] font-black text-zinc-700 uppercase">Stamp</p>
                            <p className="text-[9px] font-mono text-zinc-500">{project.date}</p>
                          </div>
                          <button onClick={() => deleteProject(project.id)} className="p-2 text-zinc-800 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-sm">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div key="add" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-3xl mx-auto space-y-6">
            <div className="flex bg-black border border-white/10 p-1 w-fit rounded-sm self-center mx-auto">
              <button onClick={() => setAddMode('manual')} className={`px-8 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${addMode === 'manual' ? 'bg-white text-black' : 'text-zinc-600 hover:text-white'}`}>SINGLE_INPUT</button>
              <button onClick={() => setAddMode('bulk')} className={`px-8 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${addMode === 'bulk' ? 'bg-white text-black' : 'text-zinc-600 hover:text-white'}`}>BATCH_PACKET</button>
            </div>

            {addMode === 'manual' ? (
              <div className="bg-zinc-900/20 border border-white/5 p-10 space-y-8 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-sky-500 shadow-[0_0_15px_#0ea5e9]" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-sky-400 uppercase tracking-[0.2em] ml-1">Project_Designation</label>
                    <input type="text" placeholder="E.G. ALPHA_UNIT_V1" className="w-full bg-black border border-white/10 p-4 text-[11px] font-bold text-white outline-none focus:border-sky-500/50 transition-all placeholder:text-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-sky-400 uppercase tracking-[0.2em] ml-1">Sector_Category</label>
                    <input type="text" placeholder="E.G. DATA_ENCRYPTION" className="w-full bg-black border border-white/10 p-4 text-[11px] font-bold text-white outline-none focus:border-sky-500/50 transition-all placeholder:text-zinc-800" />
                  </div>
                </div>
                <button className="w-full py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] hover:bg-sky-400 transition-all shadow-2xl active:scale-[0.98]">Initialize_Registration</button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-80 border-2 border-dashed border-white/5 bg-zinc-900/10 flex flex-col items-center justify-center space-y-6 group cursor-pointer hover:border-sky-500/30 transition-all relative rounded-sm"
              >
                <input type="file" ref={fileInputRef} hidden accept=".csv" />
                <div className="relative">
                  <div className="p-8 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
                    <UploadCloud size={40} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Inject_Batch_Packet</p>
                  <p className="text-[8px] text-zinc-600 font-bold uppercase mt-2 tracking-widest italic underline decoration-sky-500/20">Supported: .CSV / Format: name, type, date</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};