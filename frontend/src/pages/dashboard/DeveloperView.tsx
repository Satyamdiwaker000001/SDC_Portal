/* cspell:disable */
import { useState, useMemo, useEffect } from "react";
import { 
  LayoutDashboard, Briefcase, Settings, 
  LogOut, X, Activity, Target, ChevronRight,
  Bell, Zap, Cpu, GitBranch, Terminal as TerminalIcon
} from "lucide-react"; 
import { useAuth } from "../../context/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import SdcLogo from "../../assets/SDC.png";
import { ProjectMatrix } from "../../components/dashboard/Forge/Dev/ProjectMatrix";
import DevSettings from "../../components/dashboard/Forge/Dev/Settings";

type DevViewType = 'nexus' | 'matrix' | 'settings';

export default function DeveloperView({ userName }: { userName: string }) {
  const { logout, user } = useAuth();
  const [activeView, setActiveView] = useState<DevViewType>('nexus');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');

  const currentUserId = useMemo(() => {
    const activeName = user?.name || userName;
    if (activeName === "Satyam Leader") return "dev-01"; 
    return "dev-member";
  }, [user, userName]);

  const [notifications, setNotifications] = useState([
    { id: 1, msg: "Nexus_Uplink established in Agra_Sector_01", type: "SYSTEM", time: "Now", color: "text-sky-500" },
    { id: 2, msg: "New directive received from Commander", type: "FORGE", time: "2m", color: "text-emerald-500" },
  ]);

  const addNotification = (msg: string, type: string) => {
    const newNote = { id: Date.now(), msg, type, time: "Now", color: "text-sky-400" };
    setNotifications(prev => [newNote, ...prev].slice(0, 5));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 't') setIsTerminalOpen(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const projectHistory = [
    { 
      id: "SDC-PRJ-2026-04", 
      projectName: "PhishGuard_AI_Engine", 
      squadName: "NEBULA_STRIKE", 
      status: "LIVE", 
      team: [
        { id: 'dev-01', name: 'Satyam Leader', role: 'Leader', isLeader: true }, 
        { id: 'dev-member', name: 'SDC Member', role: 'Dev', isLeader: false }
      ],
      roadmap: ["Auth_Core", "Database_Nexus", "API_Relay"],
      initialTasks: [
        { id: 't1', moduleName: 'Auth_Core', title: 'Initialize JWT Protocol', assignedTo: 'dev-01', status: 'COMPLETED' as const }
      ]
    }
  ];

  const STATS = [
    { label: "System_Integrity", value: "98%", icon: <Activity size={14}/>, color: "text-white" },
    { label: "Power_Level", value: "1.2kW", icon: <Zap size={14}/>, color: "text-sky-400" },
    { label: "Operative_Rank", value: currentUserId === "dev-01" ? "A+" : "B", icon: <GitBranch size={14}/>, color: "text-emerald-400" },
    { label: "Active_Threads", value: "12", icon: <Cpu size={14}/>, color: "text-blue-400" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#020203] text-zinc-300 font-sans selection:bg-sky-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-sky-500/20 bg-black flex flex-col z-50 shrink-0 relative">
        <div className="absolute top-0 right-0 w-0.5 h-full bg-linear-to-b from-sky-500 via-sky-500/20 to-transparent shadow-[0_0_15px_#0ea5e988]" />
        <div className="p-6 border-b border-white/5 flex justify-center">
          <img src={SdcLogo} alt="SDC" className="w-40 h-auto brightness-125 transition-all duration-500" />
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <button onClick={() => { setActiveView('nexus'); setSelectedProjectId(null); }} className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'nexus' ? 'text-white bg-sky-500/10 border-l-2 border-sky-500 shadow-[0_0_20px_#0ea5e911]' : 'text-zinc-500 hover:text-sky-400'}`}>
            <LayoutDashboard size={18} /> Nexus_Home
          </button>
          <button onClick={() => setActiveView('matrix')} className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'matrix' ? 'text-white bg-sky-500/10 border-l-2 border-sky-500 shadow-[0_0_20px_#0ea5e911]' : 'text-zinc-500 hover:text-sky-400'}`}>
            <Briefcase size={18} /> My_Projects
          </button>
          <button onClick={() => setActiveView('settings')} className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'settings' ? 'text-white bg-sky-500/10 border-l-2 border-sky-500 shadow-[0_0_20px_#0ea5e911]' : 'text-zinc-500 hover:text-sky-400'}`}>
            <Settings size={18} /> Settings
          </button>
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase text-zinc-600 hover:text-red-500 transition-all group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> System_Exit
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#020203] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
             style={{ backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

        {/* HEADER */}
        <header className="h-16 w-full border-b border-white/5 px-10 flex items-center justify-between bg-black/80 backdrop-blur-xl z-40 sticky top-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
                <Activity size={16} className="text-sky-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Node_Uplink: Active</span>
            </div>
            <button onClick={() => setIsTerminalOpen(true)} className="px-3 py-1 border border-sky-500/20 text-[9px] font-black text-sky-500 hover:bg-sky-500 hover:text-black transition-all rounded-full uppercase tracking-widest">
                Terminal [Alt+T]
            </button>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">{user?.name || userName}</p>
            <p className="text-[8px] font-black text-sky-500 uppercase italic tracking-tighter mt-1">
              {currentUserId === "dev-01" ? "Commander_Unit" : "Field_Operative"}
            </p>
          </div>
        </header>

        {/* VIEWPORT */}
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar relative z-10">
          {activeView === 'nexus' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {STATS.map((s, i) => (
                  <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-sm border-l-2 border-l-sky-500 shadow-xl">
                    <div className="flex justify-between items-center mb-3">
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{s.label}</p>
                       <div className="text-sky-500 opacity-40">{s.icon}</div>
                    </div>
                    <h3 className={`text-3xl font-black italic tracking-tighter ${s.color}`}>{s.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 lg:col-span-7">
                   <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-sm">
                      <h3 className="text-[10px] font-black uppercase text-white mb-8 flex items-center gap-3"><Target size={14} className="text-sky-500" /> Active_Missions_Log</h3>
                      {projectHistory.map(proj => (
                        <div key={proj.id} className="p-6 bg-black/40 border border-white/5 flex justify-between items-center hover:border-sky-500/30 transition-all">
                           <div>
                              <p className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">{proj.projectName}</p>
                              <p className="text-[8px] font-mono text-zinc-600 mt-1">ID: {proj.id}</p>
                           </div>
                           <span className="text-[8px] px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 font-black tracking-widest">LIVE_NODE</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="col-span-12 lg:col-span-5">
                   <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-sm h-full">
                      <h3 className="text-[10px] font-black uppercase text-white mb-8 flex items-center gap-3"><Bell size={14} className="text-sky-500" /> Tactical_Intel_Feed</h3>
                      <div className="space-y-6">
                        {notifications.map(n => (
                          <div key={n.id} className="border-l-2 border-sky-500/30 pl-4 py-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className={`text-[8px] font-black uppercase ${n.color}`}>{n.type}</span>
                                <span className="text-[8px] font-mono text-zinc-700">{n.time}</span>
                             </div>
                             <p className="text-[10px] text-zinc-400 font-bold leading-relaxed">{n.msg}</p>
                          </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projectHistory.map(proj => (
                    <div key={proj.id} onClick={() => setSelectedProjectId(proj.id)} className="group bg-zinc-900/30 border-l-4 border-sky-500 p-12 cursor-pointer hover:bg-sky-500/5 transition-all shadow-2xl relative overflow-hidden">
                      <h3 className="text-4xl font-black italic text-white uppercase group-hover:text-sky-400 transition-colors">{proj.projectName}</h3>
                      <p className="text-[10px] text-sky-500 mt-10 font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                        Initialize_Matrix_Protocol <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform"/>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <button onClick={() => setSelectedProjectId(null)} className="text-[10px] font-black text-zinc-500 uppercase hover:text-white mb-4 flex items-center gap-2 transition-colors border border-white/5 px-4 py-2 hover:bg-white/5"><X size={14}/> Close_Matrix</button>
                  <ProjectMatrix 
                    currentUserId={currentUserId} 
                    projectData={projectHistory.find(p => p.id === selectedProjectId)!} 
                    onToggleTerminal={() => setIsTerminalOpen(true)} 
                    addNotification={addNotification} 
                  />
                </div>
              )}
            </div>
          )}
          {activeView === 'settings' && <DevSettings />}
        </div>

        {/* FLOATING TERMINAL OVERLAY - FIXED CLASSES */}
        <AnimatePresence>
          {isTerminalOpen && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed bottom-10 right-10 w-125 h-87.5 bg-[#050505] border border-sky-500/30 z-100 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden rounded-sm"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-white/5">
                <span className="text-[9px] font-black text-white uppercase flex items-center gap-2">
                    <TerminalIcon size={12} className="text-sky-500" /> Secure_Shell_v4.0
                </span>
                <button onClick={() => setIsTerminalOpen(false)} className="text-zinc-600 hover:text-white"><X size={14} /></button>
              </div>
              <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto text-emerald-500 bg-[#020203]">
                <p className="opacity-50 line-clamp-1">// SDC Secure Shell. Auth Verified as {currentUserId}.</p>
                {/* FIXED CSS CONFLICT BELOW: Removed tracking-tighter */}
                <p className="mt-2 text-sky-400 font-bold text-[9px] uppercase tracking-widest">Type 'help' for available directives.</p>
                <div className="mt-4 flex gap-2">
                  <span className="text-sky-500 font-black">root@sdc:~$</span>
                  <input 
                    autoFocus 
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="bg-transparent border-none outline-none text-zinc-200 w-full"
                    placeholder="awaiting directive..."
                  />
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