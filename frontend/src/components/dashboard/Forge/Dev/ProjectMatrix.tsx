/* cspell:disable */
import { useState, useMemo } from 'react';
import { 
  Star, ChevronDown, ChevronUp, Layout, 
  Terminal as TerminalIcon, Plus, Send, 
  User as UserIcon, ShieldCheck, 
  XCircle, Box, Activity 
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

type TaskStatus = 'PENDING' | 'AWAITING_APPROVAL' | 'COMPLETED';

interface Task {
  id: string;
  moduleName: string;
  title: string;
  assignedTo: string;
  status: TaskStatus;
}

interface Member { id: string; name: string; role: string; isLeader: boolean; }

interface ProjectData {
  id: string;
  projectName: string;
  team: Member[];
  roadmap: string[];
  initialTasks: Task[];
}

export const ProjectMatrix = ({ 
  currentUserId, 
  projectData,
  onToggleTerminal,
  addNotification 
}: { 
  currentUserId: string, 
  projectData: ProjectData,
  onToggleTerminal: () => void,
  addNotification: (msg: string, type: string, color: string) => void
}) => {
  const [tasks, setTasks] = useState<Task[]>(projectData.initialTasks);
  const [roadmap, setRoadmap] = useState<string[]>(projectData.roadmap);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [selectedModule, setSelectedModule] = useState(roadmap[0] || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [expandedDev, setExpandedDev] = useState<string | null>(currentUserId);

  const isLeader = projectData.team.find(m => m.id === currentUserId)?.isLeader;

  const handleAddModule = () => {
    if (!newModuleName || roadmap.includes(newModuleName)) return;
    setRoadmap(prev => [...prev, newModuleName]);
    addNotification(`Module [${newModuleName}] Deployed`, "SYSTEM", "text-sky-500");
    setNewModuleName('');
    setIsAddingModule(false);
  };

  const handleApproval = (taskId: string, approve: boolean, title: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: approve ? 'COMPLETED' : 'PENDING' } : t));
    addNotification(approve ? `Approved: ${title}` : `Rejected: ${title}`, approve ? "SUCCESS" : "ALERT", approve ? "text-emerald-500" : "text-red-500");
  };

  const handleRequestReview = (taskId: string, title: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'AWAITING_APPROVAL' } : t));
    addNotification(`Review Requested: ${title}`, "ACTION", "text-yellow-500");
  };

  const handleAssign = () => {
    if (!taskTitle || !assigneeId) return;
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      moduleName: selectedModule,
      title: taskTitle,
      assignedTo: assigneeId,
      status: 'PENDING',
    };
    setTasks([...tasks, newTask]);
    addNotification(`Assigned: ${taskTitle}`, "FORGE", "text-sky-400");
    setTaskTitle(''); 
    setIsAssigning(false);
  };

  const projectProgress = useMemo(() => {
    const completed = roadmap.filter(mod => {
      const modTasks = tasks.filter(t => t.moduleName === mod);
      return modTasks.length > 0 && modTasks.every(t => t.status === 'COMPLETED');
    }).length;
    return roadmap.length > 0 ? Math.round((completed / roadmap.length) * 100) : 0;
  }, [tasks, roadmap]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 text-sky-500">
              <Layout size={16} /><p className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic_Unit</p>
            </div>
            <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-6">{projectData.projectName}</h2>
            <div className="flex items-center gap-4 mt-6">
               <button onClick={onToggleTerminal} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-white/5 text-[9px] font-black text-zinc-500 hover:text-sky-400 hover:border-sky-500/30 transition-all uppercase tracking-widest group">
                 <TerminalIcon size={12} className="group-hover:animate-pulse" /> Open_Terminal
               </button>
            </div>
            <div className="w-full md:w-80 space-y-3 mt-8">
               <div className="flex justify-between text-[9px] font-black uppercase text-zinc-600">
                  <span>Actual_Sync_Progress</span><span className="text-sky-400">{projectProgress}%</span>
               </div>
               <div className="h-1.5 w-full bg-zinc-950 border border-white/5 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${projectProgress}%` }} className="h-full bg-sky-500 shadow-[0_0_15px_#0ea5e9]" />
               </div>
            </div>
          </div>

          <div className="lg:w-80 space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
               <p className="text-[9px] font-black text-sky-500 uppercase tracking-widest">Project_Roadmap</p>
               {isLeader && <button onClick={() => setIsAddingModule(!isAddingModule)} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase transition-colors">+ Add_Mod</button>}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
               {isAddingModule && (
                 <div className="flex gap-2 mb-4 animate-in slide-in-from-top-1">
                    <input autoFocus value={newModuleName} onChange={e => setNewModuleName(e.target.value)} placeholder="NAME" className="flex-1 bg-black border border-sky-500/30 p-2 text-[10px] text-white outline-none focus:border-sky-400" />
                    <button onClick={handleAddModule} className="bg-sky-500 text-black px-2 text-[8px] font-black uppercase hover:bg-white transition-colors">Deploy</button>
                 </div>
               )}
               {roadmap.map((mod) => {
                 const isDone = tasks.filter(t => t.moduleName === mod).length > 0 && tasks.filter(t => t.moduleName === mod).every(t => t.status === 'COMPLETED');
                 return (
                   <div key={mod} className="flex items-center gap-3 bg-black/40 p-2.5 border border-white/5 group hover:border-sky-500/20 transition-all">
                      {isDone ? <ShieldCheck size={12} className="text-emerald-500" /> : <Activity size={12} className="text-zinc-800 animate-pulse" />}
                      <span className={`text-[10px] font-black uppercase ${isDone ? 'text-zinc-500 line-through' : 'text-zinc-400'}`}>{mod}</span>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      </div>

      {isLeader && (
        <section className="bg-sky-500/5 border border-sky-500/20 p-6 rounded-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-sky-400 uppercase tracking-[0.3em] flex items-center gap-2"><Plus size={14} /> Assign_Directive</h3>
            <button onClick={() => setIsAssigning(!isAssigning)} className="px-4 py-1.5 bg-sky-500 text-black text-[9px] font-black uppercase hover:bg-white transition-all">{isAssigning ? 'Abort' : 'Create'}</button>
          </div>
          <AnimatePresence>
            {isAssigning && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                <div className="flex flex-wrap gap-2">
                   {roadmap.map(mod => (
                     <button key={mod} onClick={() => setSelectedModule(mod)} className={`px-3 py-1.5 text-[9px] font-black uppercase border transition-all ${selectedModule === mod ? 'bg-sky-500 text-black border-sky-500' : 'border-white/10 text-zinc-500 hover:border-zinc-700'}`}>{mod}</button>
                   ))}
                </div>
                <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="PROTOCOL_TITLE" className="w-full bg-black border border-white/10 p-3 text-[11px] text-white outline-none focus:border-sky-500/50" />
                <div className="flex gap-2">
                  {projectData.team.map(m => (
                    <button key={m.id} onClick={() => setAssigneeId(m.id)} className={`px-3 py-2 text-[9px] font-black uppercase border transition-all ${assigneeId === m.id ? 'bg-sky-500 text-black' : 'border-white/10 text-zinc-500 hover:border-zinc-700'}`}>{m.name}</button>
                  ))}
                </div>
                <button onClick={handleAssign} className="w-full py-4 bg-white text-black font-black text-[10px] uppercase flex items-center justify-center gap-3 hover:bg-sky-400 transition-all">
                  <Send size={14} /> Transmit_Command
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      <div className="space-y-4">
        {projectData.team.map(dev => {
          const devTasks = tasks.filter(t => t.assignedTo === dev.id);
          const isExpanded = expandedDev === dev.id;
          return (
            <div key={dev.id} className={`bg-zinc-900/20 border rounded-sm overflow-hidden transition-all ${dev.id === currentUserId ? 'border-sky-500/30' : 'border-white/5'}`}>
              <button onClick={() => setExpandedDev(isExpanded ? null : dev.id)} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4 text-left">
                  <UserIcon size={16} className={dev.id === currentUserId ? 'text-sky-400' : 'text-zinc-700'} />
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${dev.id === currentUserId ? 'text-white' : 'text-zinc-500'}`}>{dev.name} {dev.id === currentUserId && '(YOU)'}</p>
                    <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">Load: {devTasks.length} Systems</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {dev.isLeader && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                       <Star size={12} className="text-yellow-500 fill-yellow-500 animate-pulse" />
                       <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">Commander</span>
                    </div>
                  )}
                  {isExpanded ? <ChevronUp size={16} className="text-zinc-600" /> : <ChevronDown size={16} className="text-zinc-600" />}
                </div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/5 bg-black/20 p-4 space-y-2">
                    {devTasks.length === 0 && <p className="text-[8px] text-zinc-800 uppercase p-4 italic text-center tracking-widest">No active protocols assigned.</p>}
                    {devTasks.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-zinc-950/50 border border-white/5 rounded-sm group hover:border-sky-500/30 transition-all">
                        <div className="flex items-center gap-4">
                           <Box size={14} className="text-sky-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                           <div>
                              <p className="text-[7px] font-black text-sky-500 uppercase tracking-tighter mb-1">{t.moduleName}</p>
                              <p className={`text-[10px] font-black uppercase ${t.status === 'COMPLETED' ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>{t.title}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {t.assignedTo === currentUserId && t.status === 'PENDING' && (
                             <button onClick={() => handleRequestReview(t.id, t.title)} className="text-[8px] font-black text-sky-500 uppercase border border-sky-500/30 px-2 py-1 hover:bg-sky-500 hover:text-black transition-all">Submit_Review</button>
                          )}
                          {isLeader && t.status === 'AWAITING_APPROVAL' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApproval(t.id, true, t.title)} className="p-1 bg-emerald-500 text-black rounded-sm hover:bg-white transition-colors"><ShieldCheck size={12} /></button>
                              <button onClick={() => handleApproval(t.id, false, t.title)} className="p-1 bg-red-500 text-white rounded-sm hover:bg-white hover:text-black transition-colors"><XCircle size={12} /></button>
                            </div>
                          )}
                          <span className={`text-[7px] font-black px-2 py-0.5 border ${t.status === 'COMPLETED' ? 'border-emerald-500/30 text-emerald-500' : t.status === 'AWAITING_APPROVAL' ? 'border-yellow-500/30 text-yellow-500' : 'border-zinc-800 text-zinc-700'}`}>{t.status}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};