/* cspell:disable */
import { useState, useMemo } from 'react';
import { 
  Star, Plus, Send, User as UserIcon, 
  Box, Github, Cpu, Edit3, Globe, Clock 
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- INTERFACES ---
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
  description?: string; 
  team: Member[];
  roadmap: string[];
  initialTasks: Task[];
  techStack?: string[];
  githubUrl?: string; 
  websiteUrl?: string;
  deadline?: string;
}

interface MatrixProps {
  currentUserId: string;
  projectData: ProjectData;
  addNotification: (msg: string, type: string) => void;
}

export const ProjectMatrix = ({ 
  currentUserId, 
  projectData, 
  addNotification 
}: MatrixProps) => {
  // --- 1. DYNAMIC FETCHING FROM ADMIN (LocalStorage) ---
  const syncedData = useMemo(() => {
    try {
      const allProjects = JSON.parse(localStorage.getItem('sdc_projects') || '[]');
      const currentProject = allProjects.find((p: { id: string | number }) => p.id.toString() === projectData.id.toString());
      
      const allTeams = JSON.parse(localStorage.getItem('sdc_teams') || '[]');
      const teamDetails = allTeams.find((t: { project: string; name: string }) => t.project === projectData.projectName || t.name === projectData.id);

      return {
        deadline: currentProject?.deadline || "NOT_SET",
        techStack: currentProject?.stack ? currentProject.stack.split(',') : (projectData.techStack || []),
        description: currentProject?.desc || projectData.description,
        adminTeam: teamDetails?.members || null 
      };
    } catch {
      return { deadline: "SYNC_ERROR", techStack: projectData.techStack || [], description: projectData.description, adminTeam: null };
    }
  }, [projectData.id, projectData.projectName, projectData.description, projectData.techStack]);

  const [tasks, setTasks] = useState<Task[]>(projectData.initialTasks);
  const [roadmap, setRoadmap] = useState<string[]>(projectData.roadmap);
  const [techStack, setTechStack] = useState<string[]>(syncedData.techStack);
  const [description, setDescription] = useState(syncedData.description || '');
  
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [newTech, setNewTech] = useState('');
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

  const handleAddTech = () => {
    if (!newTech || techStack.includes(newTech)) return;
    setTechStack([...techStack, newTech]);
    setNewTech('');
    addNotification(`Stack Updated: ${newTech}`, "FORGE");
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
    addNotification(`Directive Transmitted`, "FORGE");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-full text-left">
      
      {/* --- HUD HEADER --- */}
      <div className="bg-zinc-900/40 border border-white/5 p-6 md:p-8 rounded-sm space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter wrap-break-word">
                  {projectData.projectName}
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm">
                  <Clock size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{syncedData.deadline}</span>
                </div>
              </div>
              
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tight mb-6 leading-relaxed border-l-2 border-sky-500/30 pl-4 italic wrap-break-word max-w-2xl text-left">
                {description || "NO_MISSION_BRIEFING_SYNCED"}
              </p>

              <div className="flex flex-wrap gap-3">
                {projectData.githubUrl && (
                  <a href={projectData.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-white/10 text-zinc-500 hover:text-white text-[9px] font-black tracking-widest uppercase transition-all">
                    <Github size={12} /> Repo_Source
                  </a>
                )}

                {projectData.websiteUrl && (
                  <a href={projectData.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-sky-500 text-black text-[9px] font-black tracking-widest uppercase hover:bg-white transition-all">
                    <Globe size={12} /> Live_Uplink
                  </a>
                )}

                {isLeader && (
                  <button onClick={() => setIsEditingMeta(!isEditingMeta)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/10 text-[9px] font-black text-zinc-400 hover:text-white transition-all uppercase">
                    <Edit3 size={12} /> {isEditingMeta ? 'Close_Config' : 'Project_Config'}
                  </button>
                )}
              </div>
          </div>

          {/* ROADMAP SECTION */}
          <div className="w-full lg:w-72 shrink-0 text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4 uppercase tracking-widest">
                <p className="text-[9px] font-black text-sky-500">Roadmap_Nodes</p>
                {isLeader && (
                  <button onClick={() => setIsAddingMod(!isAddingMod)} className="text-[8px] font-black text-zinc-600 hover:text-white">
                    {isAddingMod ? '[X]' : '+ New_Mod'}
                  </button>
                )}
            </div>
            {isAddingMod && (
              <div className="flex gap-2 mb-4 animate-in slide-in-from-right-2">
                 <input autoFocus value={newModName} onChange={e => setNewModName(e.target.value)} placeholder="MOD_ID" className="flex-1 bg-black border border-sky-500/30 p-2 text-[10px] text-white outline-none" />
                 <button onClick={handleAddModule} className="bg-sky-500 text-black px-2 text-[8px] font-black uppercase">Add</button>
              </div>
            )}
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {roadmap.map(mod => (
                <div key={mod} className="text-[9px] font-black uppercase text-zinc-400 bg-zinc-950/50 p-2 border border-white/5 flex items-center gap-2">
                   <Box size={10} className="text-sky-500/40" /> {mod}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONFIGURATION PANEL (LEADER ONLY) */}
        <AnimatePresence>
          {isLeader && isEditingMeta && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5 pt-6 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2 text-left">
                    <label className="text-[8px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-2">Mission_Briefing</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="PROJECT DESCRIPTION..." className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-sky-500 transition-all resize-none h-20" />
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-[8px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-2">Add_Tech_Node</label>
                  <div className="flex gap-2">
                    <input value={newTech} onChange={e => setNewTech(e.target.value)} placeholder="E.G. TAILWIND" className="flex-1 bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-sky-500 font-mono" />
                    <button onClick={handleAddTech} className="bg-sky-500 text-black px-4 hover:bg-white transition-all"><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TECH STACK */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2 text-left"><Cpu size={10}/> Tech_Stack</p>
          <div className="flex flex-wrap gap-2">
            {techStack.map(tech => (
              <span key={tech} className="px-2 py-1 bg-sky-500/5 border border-sky-500/20 text-[8px] font-black text-sky-400 uppercase tracking-tighter">
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- ADMIN TEAM INTEL --- */}
      {syncedData.adminTeam && (
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-sm text-left">
          <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2"><UserIcon size={10}/> Admin_Assigned_Operatives</p>
          <p className="text-[10px] text-zinc-400 font-mono">{syncedData.adminTeam}</p>
        </div>
      )}

      {/* --- COMMANDER FORGE --- */}
      {isLeader && (
        <section className="bg-sky-500/5 border-l-4 border-sky-500 p-6 space-y-6 rounded-sm text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2"><Plus size={12} /> Commander_Forge</h3>
            <button onClick={() => setIsAssigning(!isAssigning)} className="px-4 py-1.5 bg-sky-500 text-black text-[9px] font-black uppercase hover:bg-white transition-all">
              {isAssigning ? 'Abort' : 'Create_Directive'}
            </button>
          </div>
          <AnimatePresence>
            {isAssigning && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-zinc-600 uppercase ml-1">Module_Nexus</p>
                    <div className="flex flex-wrap gap-2">
                       {roadmap.map(mod => (
                         <button key={mod} onClick={() => setSelectedModule(mod)} className={`px-3 py-1.5 text-[8px] font-black uppercase border transition-all ${selectedModule === mod ? 'bg-sky-500 text-black border-sky-500' : 'border-white/10 text-zinc-500'}`}>{mod}</button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-zinc-600 uppercase ml-1">Assign_Operative</p>
                    <div className="flex flex-wrap gap-2">
                      {projectData.team.map((m: Member) => (
                        <button key={m.id} onClick={() => setAssigneeId(m.id)} className={`px-3 py-1.5 text-[8px] font-black uppercase border transition-all ${assigneeId === m.id ? 'bg-sky-500 text-black border-sky-500' : 'border-white/10 text-zinc-500'}`}>{m.name}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="DIRECTIVE_TITLE..." className="w-full bg-black border border-white/10 p-4 text-[10px] text-white outline-none focus:border-sky-500" />
                <button onClick={handleAssign} className="w-full py-4 bg-white text-black font-black text-[9px] uppercase flex items-center justify-center gap-3 hover:bg-sky-400 transition-all shadow-lg">
                  <Send size={14} /> Transmit_Directive
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* TEAM MATRIX LISTING */}
      <div className="space-y-3">
        {projectData.team.map((dev: Member) => {
          const devTasks = tasks.filter((t: Task) => t.assignedTo === dev.id);
          const isExpanded = expandedDev === dev.id;
          return (
            <div key={dev.id} className={`bg-zinc-900/20 border transition-all ${dev.id === currentUserId ? 'border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.05)]' : 'border-white/5'} rounded-sm overflow-hidden text-left`}>
              <button onClick={() => setExpandedDev(isExpanded ? null : dev.id)} className="w-full flex items-center justify-between p-4 hover:bg-white/2 transition-all text-left">
                <div className="flex items-center gap-4 min-w-0">
                  <UserIcon size={14} className={dev.id === currentUserId ? 'text-sky-400' : 'text-zinc-700'} />
                  <p className={`text-[9px] font-black uppercase tracking-widest truncate ${dev.id === currentUserId ? 'text-white' : 'text-zinc-500'}`}>{dev.name} {dev.id === currentUserId && '(YOU)'}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {dev.isLeader && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
                  <span className="text-[7px] font-black text-zinc-800 bg-zinc-950 px-2 py-0.5 border border-white/5 uppercase tracking-tighter">{dev.role}</span>
                </div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/5 bg-black/20 p-4 space-y-2 overflow-hidden text-left">
                    {devTasks.length === 0 && <p className="text-[8px] text-zinc-800 uppercase p-4 italic text-center">No active protocols.</p>}
                    {devTasks.map((t: Task) => (
                      <div key={t.id} className="flex items-start justify-between p-3 bg-zinc-950/50 border border-white/5 hover:border-sky-500/20 transition-all group text-left">
                        <div className="min-w-0 flex-1 pr-4">
                           <p className="text-[7px] font-black text-sky-500 uppercase tracking-tighter mb-1">{t.moduleName}</p>
                           <p className={`text-[9px] font-black uppercase wrap-break-word leading-relaxed ${t.status === 'COMPLETED' ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>{t.title}</p>
                        </div>
                        <span className={`text-[7px] font-black px-2 py-1 border shrink-0 mt-1 ${t.status === 'COMPLETED' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-zinc-800 text-zinc-700'}`}>{t.status}</span>
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