/* cspell:disable */
import { useState, useMemo } from 'react';
import { 
  Star, Terminal as TerminalIcon, Plus, Send, 
  User as UserIcon, Box 
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- STRICT INTERFACES ---
type TaskStatus = 'PENDING' | 'AWAITING_APPROVAL' | 'COMPLETED';

interface Task {
  id: string;
  moduleName: string;
  title: string;
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
  team: Member[];
  roadmap: string[];
  initialTasks: Task[];
}

interface MatrixProps {
  currentUserId: string;
  projectData: ProjectData;
  onToggleTerminal: () => void;
  addNotification: (msg: string, type: string) => void;
}

export const ProjectMatrix = ({ 
  currentUserId, 
  projectData, 
  onToggleTerminal, 
  addNotification 
}: MatrixProps) => {
  const [tasks, setTasks] = useState<Task[]>(projectData.initialTasks);
  const [roadmap, setRoadmap] = useState<string[]>(projectData.roadmap);
  
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAddingMod, setIsAddingMod] = useState(false);
  
  const [newModName, setNewModName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedModule, setSelectedModule] = useState(roadmap[0] || '');
  const [assigneeId, setAssigneeId] = useState('');
  const [expandedDev, setExpandedDev] = useState<string | null>(currentUserId);

  const isLeader = useMemo(() => {
    return projectData.team.find((m: Member) => m.id === currentUserId)?.isLeader || false;
  }, [currentUserId, projectData.team]);

  const handleAddModule = () => {
    if (!newModName || roadmap.includes(newModName)) return;
    setRoadmap([...roadmap, newModName]);
    setNewModName('');
    setIsAddingMod(false);
    addNotification(`Module [${newModName}] Deployed`, "SYSTEM");
  };

  const handleAssign = () => {
    if (!taskTitle || !assigneeId || !selectedModule) return;
    const newTask: Task = { 
      id: Date.now().toString(), 
      moduleName: selectedModule, 
      title: taskTitle, 
      assignedTo: assigneeId, 
      status: 'PENDING' 
    };
    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setIsAssigning(false);
    addNotification(`Directive Transmitted to ${assigneeId}`, "FORGE");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HUD Header */}
      <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-sm flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1">
           <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-4">{projectData.projectName}</h2>
           <button onClick={onToggleTerminal} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-white/5 text-[9px] font-black text-zinc-500 hover:text-sky-400 tracking-widest uppercase">
             <TerminalIcon size={12} /> Sync_Terminal
           </button>
        </div>
        
        <div className="w-full lg:w-72 space-y-2">
          <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
             <p className="text-[9px] font-black text-sky-500 uppercase tracking-widest">Roadmap</p>
             {isLeader && (
               <button onClick={() => setIsAddingMod(!isAddingMod)} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase">
                 {isAddingMod ? '[X]' : '+ Add_Module'}
               </button>
             )}
          </div>
          
          {isAddingMod && (
            <div className="flex gap-2 mb-4">
               <input autoFocus value={newModName} onChange={e => setNewModName(e.target.value)} placeholder="MOD_ID" className="flex-1 bg-black border border-sky-500/30 p-2 text-[10px] text-white outline-none" />
               <button onClick={handleAddModule} className="bg-sky-500 text-black px-2 text-[8px] font-black uppercase">Deploy</button>
            </div>
          )}

          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {roadmap.map(mod => (
              <div key={mod} className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-950/50 p-3 border border-white/5 flex items-center gap-3">
                 <Box size={12} className="text-sky-500/40" /> {mod}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leader Assignment Panel */}
      {isLeader && (
        <section className="bg-sky-500/5 border-l-4 border-sky-500 p-6 rounded-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest flex items-center gap-2"><Plus size={14} /> COMMANDER_FORGE</h3>
            <button onClick={() => setIsAssigning(!isAssigning)} className="px-4 py-1.5 bg-sky-500 text-black text-[9px] font-black uppercase hover:bg-white transition-all">
              {isAssigning ? 'Abort' : 'Create_Directive'}
            </button>
          </div>
          
          <AnimatePresence>
            {isAssigning && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-zinc-600 uppercase ml-1">Select_Module</p>
                    <div className="flex flex-wrap gap-2">
                       {roadmap.map(mod => (
                         <button key={mod} onClick={() => setSelectedModule(mod)} className={`px-3 py-1.5 text-[9px] font-black uppercase border transition-all ${selectedModule === mod ? 'bg-sky-500 text-black border-sky-500' : 'border-white/10 text-zinc-500'}`}>{mod}</button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-zinc-600 uppercase ml-1">Select_Operative</p>
                    <div className="flex flex-wrap gap-2">
                      {projectData.team.map((m: Member) => (
                        <button key={m.id} onClick={() => setAssigneeId(m.id)} className={`px-3 py-2 text-[9px] font-black uppercase border transition-all ${assigneeId === m.id ? 'bg-sky-500 text-black' : 'border-white/10 text-zinc-500'}`}>{m.name}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="DIRECTIVE_TITLE..." className="w-full bg-black border border-white/10 p-4 text-[11px] text-white outline-none focus:border-sky-500" />
                <button onClick={handleAssign} className="w-full py-4 bg-white text-black font-black text-[10px] uppercase flex items-center justify-center gap-3 hover:bg-sky-400">
                  <Send size={14} /> Transmit_Command
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Team Matrix */}
      <div className="space-y-4">
        {projectData.team.map((dev: Member) => {
          const devTasks = tasks.filter((t: Task) => t.assignedTo === dev.id);
          const isExpanded = expandedDev === dev.id;
          return (
            <div key={dev.id} className={`bg-zinc-900/20 border transition-all ${dev.id === currentUserId ? 'border-sky-500/30' : 'border-white/5'} rounded-sm overflow-hidden`}>
              <button onClick={() => setExpandedDev(isExpanded ? null : dev.id)} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <UserIcon size={16} className={dev.id === currentUserId ? 'text-sky-400' : 'text-zinc-700'} />
                  <p className={`text-[10px] font-black uppercase tracking-widest ${dev.id === currentUserId ? 'text-white' : 'text-zinc-500'}`}>{dev.name} {dev.id === currentUserId && '(YOU)'}</p>
                </div>
                {dev.isLeader && <Star size={12} className="text-yellow-500 fill-yellow-500 animate-pulse" />}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/5 bg-black/20 p-4 space-y-2">
                    {devTasks.length === 0 && <p className="text-[8px] text-zinc-800 uppercase p-4 italic text-center">No active protocols.</p>}
                    {devTasks.map((t: Task) => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-zinc-950/50 border border-white/5 hover:border-sky-500/30 transition-all group">
                        <div>
                           <p className="text-[7px] font-black text-sky-500 uppercase tracking-tighter mb-1">{t.moduleName}</p>
                           <p className={`text-[10px] font-black uppercase ${t.status === 'COMPLETED' ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>{t.title}</p>
                        </div>
                        <span className={`text-[7px] font-black px-2 py-1 border ${t.status === 'COMPLETED' ? 'border-emerald-500/30 text-emerald-500' : 'border-zinc-800 text-zinc-700'}`}>{t.status}</span>
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