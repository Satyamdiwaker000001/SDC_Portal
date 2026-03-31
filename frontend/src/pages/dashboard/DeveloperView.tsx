/* cspell:disable */
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Briefcase, Settings, 
  LogOut, Terminal as TerminalIcon, X,
  Bell, Activity, Target, Cpu, Zap, GitBranch,
  ChevronRight // FIXED: Added missing icon import
} from "lucide-react"; 
import { useAuth } from "../../context/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import SdcLogo from "../../assets/SDC.png";
import { ProjectMatrix } from "../../components/dashboard/Forge/Dev/ProjectMatrix";
import DevSettings from "../../components/dashboard/Forge/Dev/Settings";

// --- TYPES ---
type DevViewType = 'nexus' | 'matrix' | 'settings';

interface ProjectData {
  id: string;
  projectName: string;
  squadName: string;
  status: string;
  type: string;
  roadmap: string[];
  team: Array<{ id: string; name: string; role: string; isLeader: boolean }>;
  initialTasks: Array<{ 
    id: string; 
    moduleName: string; 
    title: string; 
    assignedTo: string; 
    status: 'PENDING' | 'AWAITING_APPROVAL' | 'COMPLETED' 
  }>;
}

export default function DeveloperView({ userName }: { userName: string }) {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState<DevViewType>('nexus');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  
  const currentUserId = userName === "Satyam Leader" ? "dev-01" : "dev-member"; 

  const [notifications, setNotifications] = useState([
    { id: 1, msg: "Nexus_Home uplink established.", type: "SYSTEM", time: "Now", color: "text-sky-500" },
    { id: 2, msg: "New security handshake initiated.", type: "AUTH", time: "2m", color: "text-emerald-500" }
  ]);

  const addNotification = (msg: string, type: string, color: string) => {
    setNotifications(prev => [{ id: Date.now(), msg, type, time: "Now", color }, ...prev].slice(0, 10));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const projectHistory: ProjectData[] = [
    { 
      id: "SDC-PRJ-2026-04", 
      projectName: "PhishGuard_AI_Engine", 
      squadName: "NEBULA_STRIKE", 
      status: "LIVE", 
      type: "Main", 
      roadmap: ["Auth", "ML_Model"],
      team: [
        { id: 'dev-01', name: 'Satyam Leader', role: 'Leader', isLeader: true }, 
        { id: 'dev-member', name: 'Member', role: 'Dev', isLeader: false }
      ],
      initialTasks: [
        { id: 't1', moduleName: 'Auth', title: 'Setup JWT', assignedTo: 'dev-01', status: 'COMPLETED' }
      ]
    }
  ];

  const executeCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.toLowerCase().trim();
      if (cmd === 'nexus') setActiveView('nexus');
      else if (cmd === 'projects') setActiveView('matrix');
      else if (cmd === 'clear') setNotifications([]);
      else if (cmd === 'exit') logout();
      setTerminalInput('');
    }
  };

  const STATS = [
    { label: "Integrity", value: "98%", icon: <Activity size={18}/>, color: "text-white", glow: "shadow-white/5" },
    { label: "Power", value: "1420", icon: <Zap size={18}/>, color: "text-sky-400", glow: "shadow-sky-500/20" },
    { label: "Commit_Rank", value: "A+", icon: <GitBranch size={18}/>, color: "text-emerald-400", glow: "shadow-emerald-500/20" },
    { label: "Active_Tasks", value: currentUserId === "dev-01" ? "05" : "02", icon: <Cpu size={18}/>, color: "text-blue-400", glow: "shadow-blue-500/20" },
  ];

  const projectsDB = [
    {
      id: "SDC-PRJ-2026-04",
      projectName: "PhishGuard_AI_Engine",
      squadName: "NEBULA_STRIKE",
      progress: 68,
      team: [
        { id: 'dev-01', name: 'Satyam Leader', role: 'Full Stack', isLeader: true },
        { id: 'dev-member', name: 'Satyam Member', role: 'Frontend', isLeader: false },
      ],
      initialTasks: [
        { id: 't1', title: 'DB Schema Design', desc: 'Create relational model', assignedTo: 'dev-01', status: 'COMPLETED' as const },
        { id: 't2', title: 'UI Implementation', desc: 'React context setup', assignedTo: 'dev-member', status: 'PENDING' as const },
      ]
    }
  ];

  const activeProjectData = projectsDB.find(p => p.id === selectedProjectId);

  return (
    <div className="flex h-screen overflow-hidden bg-[#020203] text-zinc-300 font-sans selection:bg-sky-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-sky-500/20 bg-black flex flex-col z-50 shrink-0 relative">
        <div className="absolute top-0 right-0 w-0.5 h-full bg-linear-to-b from-sky-500 via-sky-500/20 to-transparent shadow-[0_0_15px_#0ea5e988]" />
        <div className="p-6 border-b border-white/5 flex justify-center">
          <img src={SdcLogo} alt="SDC" className="w-40 h-auto brightness-125" />
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <button onClick={() => { setActiveView('nexus'); setSelectedProjectId(null); }} className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeView === 'nexus' ? 'text-white bg-sky-500/10 border-l-2 border-sky-500' : 'text-zinc-500 hover:text-sky-400'}`}>
            <LayoutDashboard size={18} /> Nexus_Home
          </button>
          <button onClick={() => setActiveView('matrix')} className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeView === 'matrix' ? 'text-white bg-sky-500/10 border-l-2 border-sky-500' : 'text-zinc-500 hover:text-sky-400'}`}>
            <Briefcase size={18} /> My_Projects
          </button>
          <button onClick={() => setActiveView('settings')} className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeView === 'settings' ? 'text-white bg-sky-500/10 border-l-2 border-sky-500' : 'text-zinc-500 hover:text-sky-400'}`}>
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-all group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> System_Exit
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#020203] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
             style={{ backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

        {/* HEADER */}
        <header className="h-16 w-full border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-3">
            <Activity size={16} className="text-sky-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Operative_Uplink: ACTIVE</span>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-[10px] font-black uppercase text-white leading-none tracking-widest">{userName}</p>
              <p className="text-[8px] font-black text-sky-500 uppercase mt-1 italic tracking-tighter">
                {currentUserId === "dev-01" ? "Commander_Level_01" : "Field_Operative"}
              </p>
            </div>
            <div className="w-10 h-10 border border-sky-500/40 p-0.5 rotate-45 overflow-hidden shadow-[0_0_10px_#0ea5e944]">
              <div className="w-full h-full bg-zinc-900 -rotate-45 flex items-center justify-center font-black text-[10px] text-sky-400 uppercase">
                {userName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

        {/* VIEWPORT */}
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {activeView === 'nexus' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                  <div key={i} className={`bg-zinc-900/40 border border-white/5 border-l-4 border-l-sky-500 p-6 shadow-xl ${stat.glow}`} 
                       style={{ clipPath: 'polygon(0 0, 96% 0, 100% 20%, 100% 100%, 0 100%)' }}>
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                      <div className="text-sky-500/30">{stat.icon}</div>
                    </div>
                    <h3 className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-10 items-start">
                <div className="col-span-12 lg:col-span-7">
                  <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[10px] font-black uppercase text-white flex items-center gap-2"><Target size={14} className="text-sky-500" /> Active_Missions</h3>
                      <button onClick={() => setActiveView('matrix')} className="text-[9px] font-black text-sky-500 hover:text-white uppercase italic underline underline-offset-4 decoration-sky-500/30">View_Matrix</button>
                    </div>
                    <div className="space-y-3">
                      {projectHistory.map((proj) => (
                        <div key={proj.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 hover:border-sky-500/30 transition-all group cursor-default">
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">{proj.projectName}</p>
                            <p className="text-[8px] font-mono text-zinc-600 uppercase mt-1">Squad: {proj.squadName}</p>
                          </div>
                          <span className="text-[8px] font-black px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400">{proj.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-5">
                  <div className="bg-zinc-900/20 border border-white/5 p-6 rounded-sm">
                    <h3 className="text-[10px] font-black uppercase text-white mb-6 flex items-center gap-2"><Bell size={14} className="text-sky-500" /> Tactical_Intel</h3>
                    <div className="h-80 overflow-y-auto custom-scrollbar pr-3 space-y-6">
                      {notifications.map((n) => (
                        <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={n.id} className="relative pl-4 border-l-2 border-sky-500/30">
                          <div className="flex justify-between items-center mb-1 text-[8px] font-black uppercase">
                            <span className={n.color}>{n.type}</span>
                            <span className="font-mono text-zinc-700">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-relaxed font-bold">{n.msg}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'matrix' && (
            <div className="animate-in fade-in duration-500">
              {!selectedProjectId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectHistory.map((proj) => (
                    <div key={proj.id} onClick={() => setSelectedProjectId(proj.id)} className="group bg-zinc-900/30 border border-white/5 border-l-4 border-l-sky-500 p-10 cursor-pointer hover:border-sky-500/50 transition-all">
                      <p className="text-[9px] font-black text-zinc-600 uppercase mb-4 tracking-widest">{proj.id}</p>
                      <h3 className="text-3xl font-black italic text-white uppercase mb-8 group-hover:text-sky-400 transition-colors">{proj.projectName}</h3>
                      <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest flex items-center gap-2 italic">Initialize_Matrix_Protocol <ChevronRight size={14}/></p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <button onClick={() => setSelectedProjectId(null)} className="text-[10px] font-black text-zinc-500 uppercase hover:text-white mb-4 flex items-center gap-2 transition-colors">
                    <X size={14}/> Back_To_Projects
                  </button>
                  <ProjectMatrix currentUserId={currentUserId} projectData={projectHistory.find(p => p.id === selectedProjectId)!} onToggleTerminal={() => setIsTerminalOpen(true)} addNotification={addNotification} />
                </div>
              )}
            </div>
          )}

          {activeView === 'settings' && <div className="w-full animate-in zoom-in-95 duration-500"><DevSettings /></div>}
        </div>

        {/* FLOATING TERMINAL (FIXED CLASSES) */}
        <AnimatePresence>
          {isTerminalOpen && (
            <motion.div 
              initial={{ y: 500, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 500, opacity: 0 }} 
              className="absolute bottom-6 right-6 w-125 h-75 bg-black border border-sky-500/30 z-100 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-white/5">
                <span className="text-[9px] font-black text-white uppercase flex items-center gap-2"><TerminalIcon size={12} className="text-sky-500" /> Global_Terminal_V2</span>
                <button onClick={() => setIsTerminalOpen(false)} className="text-zinc-600 hover:text-white"><X size={14} /></button>
              </div>
              <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto text-emerald-500 bg-black/80">
                <p className="opacity-50">// SDC Secure Shell. Latency: 0.002ms</p>
                <p className="mt-2 text-sky-400 tracking-tighter font-black">Commands: nexus, projects, clear, exit</p>
                <div className="flex gap-2 mt-4">
                  <span className="text-sky-500 font-black">root@sdc:~$</span>
                  <input value={terminalInput} onChange={e => setTerminalInput(e.target.value)} onKeyDown={executeCommand} autoFocus className="bg-transparent border-none outline-none text-zinc-200 w-full" placeholder="awaiting command..." />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
      `}</style>
    </div>
  );
}