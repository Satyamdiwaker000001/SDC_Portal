/* cspell:disable */
import { useState, useMemo } from 'react';
import { 
  Star, ChevronDown, ChevronUp, Layout, 
  Terminal as TerminalIcon, Plus, Send, 
  User as UserIcon, Circle, ShieldCheck, 
  XCircle, Clock 
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
type TaskStatus = 'PENDING' | 'AWAITING_APPROVAL' | 'COMPLETED';

interface Task {
  id: string;
  title: string;
  desc: string;
  assignedTo: string;
  status: TaskStatus;
}

interface Member {
  id: string;
  name: string;
  role: string;
  isLeader: boolean;
}

interface ProjectData {
  id: string;
  projectName: string;
  squadName: string;
  team: Member[];
  initialTasks: Task[];
}

export const ProjectMatrix = ({ 
  currentUserId, 
  projectData,
  onToggleTerminal 
}: { 
  currentUserId: string, 
  projectData: ProjectData,
  onToggleTerminal: () => void 
}) => {
  // --- STATES ---
  const [tasks, setTasks] = useState<Task[]>(projectData.initialTasks);
  const [isAssigning, setIsAssigning] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [expandedDev, setExpandedDev] = useState<string | null>(currentUserId);

  // --- LOGIC: PERMISSIONS ---
  const currentUserInTeam = projectData.team.find(m => m.id === currentUserId);
  const isLeader = currentUserInTeam?.isLeader;

  // --- LOGIC: TASK ACTIONS ---
  const requestApproval = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'AWAITING_APPROVAL' } : t));
  };

  const handleApproval = (taskId: string, approve: boolean) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: approve ? 'COMPLETED' : 'PENDING' } : t
    ));
  };

  const handleAssign = () => {
    if (!taskTitle || !assigneeId) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: taskTitle,
      desc: taskDesc,
      assignedTo: assigneeId,
      status: 'PENDING',
    };
    setTasks([...tasks, newTask]);
    setTaskTitle(''); setTaskDesc(''); setAssigneeId(''); setIsAssigning(false);
  };

  // --- LOGIC: DATA SORTING & PROGRESS ---
  const sortedTeam = useMemo(() => {
    return [...projectData.team].sort((a, b) => {
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;
      return a.isLeader ? -1 : 1;
    });
  }, [projectData.team, currentUserId]);

  const progress = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    return tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  }, [tasks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* 1. PROJECT HUB SECTION */}
      <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Layout size={16} className="text-sky-500" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Project_Instance</p>
            </div>
            <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">{projectData.projectName}</h2>
            
            <div className="flex items-center gap-4 mt-6">
               <button 
                onClick={onToggleTerminal}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-white/5 text-[9px] font-black text-zinc-500 hover:text-sky-400 hover:border-sky-500/30 transition-all uppercase tracking-widest"
               >
                 <TerminalIcon size={12} /> Open_Terminal
               </button>
               <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-tighter italic">Shortcut: Alt + T</span>
            </div>

            <div className="w-full md:w-80 space-y-3 mt-8">
               <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  <span>Verification_Progress</span>
                  <span className="text-sky-400">{progress}%</span>
               </div>
               <div className="h-1.5 w-full bg-zinc-950 border border-white/5 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${progress}%` }} className="h-full bg-sky-500 shadow-[0_0_15px_#0ea5e9]" />
               </div>
            </div>
          </div>

          <div className="lg:w-80 space-y-3">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest border-b border-white/5 pb-2">Unit_Hierarchy</p>
            {sortedTeam.map((m) => (
              <div key={m.id} className={`flex items-center justify-between p-3 border ${m.id === currentUserId ? 'bg-sky-500/10 border-sky-500/30' : 'bg-black/40 border-white/5'}`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${m.id === currentUserId ? 'bg-sky-400' : 'bg-zinc-800'}`} />
                    {m.isLeader && <Star size={8} className="absolute -top-2 -right-2 text-yellow-500 fill-yellow-500 animate-pulse" />}
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase ${m.id === currentUserId ? 'text-white' : 'text-zinc-500'}`}>{m.name}</p>
                    <p className="text-[7px] font-bold text-zinc-700 uppercase">{m.role} {m.isLeader && '// COMMANDER'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. LEADER'S FORGE (TASK ASSIGNMENT) */}
      {isLeader ? (
        <section className="bg-sky-500/5 border border-sky-500/20 p-6 rounded-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-sky-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <Plus size={14} /> Task_Assignment_Forge
            </h3>
            <button onClick={() => setIsAssigning(!isAssigning)} className="px-4 py-1.5 bg-sky-500 text-black text-[9px] font-black uppercase hover:bg-white transition-all">
              {isAssigning ? 'Abort_Command' : 'Create_Directive'}
            </button>
          </div>
          <AnimatePresence>
            {isAssigning && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="DIRECTIVE_TITLE" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500/50" />
                <textarea value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder="PROTOCOL_DESCRIPTION..." className="w-full bg-black border border-white/10 p-3 h-20 text-[11px] font-bold text-white outline-none focus:border-sky-500/50" />
                <div className="flex flex-wrap gap-2">
                  {projectData.team.map(m => (
                    <button key={m.id} onClick={() => setAssigneeId(m.id)} className={`px-3 py-2 text-[9px] font-black uppercase border transition-all ${assigneeId === m.id ? 'bg-sky-500 border-sky-500 text-black' : 'bg-transparent border-white/10 text-zinc-600'}`}>
                      {m.name}
                    </button>
                  ))}
                </div>
                <button onClick={handleAssign} className="w-full py-4 bg-white text-black font-black text-[10px] uppercase flex items-center justify-center gap-3 hover:bg-sky-400">
                  <Send size={14} /> Transmit_Directive
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      ) : (
        <div className="p-4 border border-zinc-800 bg-zinc-900/10 rounded-sm italic text-[9px] text-zinc-700 uppercase tracking-widest">
          // Commander_Privileges_Required_For_Task_Forge
        </div>
      )}

      {/* 3. TASK REGISTRY SYNC (ACCORDION STYLE) */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2">Realtime_Task_Registry</p>
        {sortedTeam.map(dev => {
          const devTasks = tasks.filter(t => t.assignedTo === dev.id);
          const isExpanded = expandedDev === dev.id;

          return (
            <div key={dev.id} className={`bg-zinc-900/20 border rounded-sm overflow-hidden transition-all ${dev.id === currentUserId ? 'border-sky-500/30' : 'border-white/5'}`}>
              <button onClick={() => setExpandedDev(isExpanded ? null : dev.id)} className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${dev.id === currentUserId ? 'bg-sky-500/20 text-sky-400' : 'bg-zinc-800 text-zinc-600'}`}>
                    <UserIcon size={14} />
                  </div>
                  <div className="text-left">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${dev.id === currentUserId ? 'text-white' : 'text-zinc-500'}`}>{dev.name} {dev.id === currentUserId && '(YOU)'}</p>
                    <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">Load: {devTasks.length} Operations_Synced</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-zinc-700" /> : <ChevronDown size={16} className="text-zinc-700" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/5 bg-black/40">
                    <div className="p-4 space-y-2">
                      {devTasks.length === 0 && <p className="text-[8px] text-zinc-800 uppercase p-4 italic text-center">No active protocols assigned.</p>}
                      {devTasks.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-4 border border-white/5 bg-zinc-950/50 relative overflow-hidden group/task">
                          <div className="flex items-center gap-4 relative z-10">
                            {t.status === 'COMPLETED' ? <ShieldCheck size={18} className="text-emerald-500" /> : 
                             t.status === 'AWAITING_APPROVAL' ? <Clock size={18} className="text-yellow-500 animate-pulse" /> : 
                             <Circle size={18} className="text-zinc-800" />}
                            <div>
                              <p className={`text-[11px] font-black uppercase tracking-tighter ${t.status === 'COMPLETED' ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>{t.title}</p>
                              <p className="text-[9px] text-zinc-700 italic">{t.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 relative z-10">
                            {/* Actions for User's own tasks */}
                            {t.assignedTo === currentUserId && t.status === 'PENDING' && (
                              <button onClick={() => requestApproval(t.id)} className="px-3 py-1.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[8px] font-black uppercase hover:bg-sky-500 hover:text-black transition-all">Submit_For_Review</button>
                            )}

                            {/* Actions for Leader to approve */}
                            {isLeader && t.status === 'AWAITING_APPROVAL' && (
                              <div className="flex gap-2">
                                <button onClick={() => handleApproval(t.id, true)} className="p-1.5 bg-emerald-500 text-black rounded-sm hover:bg-white transition-colors" title="Approve"><ShieldCheck size={14} /></button>
                                <button onClick={() => handleApproval(t.id, false)} className="p-1.5 bg-red-500 text-white rounded-sm hover:bg-white hover:text-black transition-colors" title="Reject"><XCircle size={14} /></button>
                              </div>
                            )}

                            <span className={`text-[7px] font-black px-2 py-0.5 border ${t.status === 'COMPLETED' ? 'border-emerald-500/30 text-emerald-500' : t.status === 'AWAITING_APPROVAL' ? 'border-yellow-500/30 text-yellow-500' : 'border-zinc-800 text-zinc-700'}`}>
                              {t.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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