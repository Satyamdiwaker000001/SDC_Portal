/* cspell:disable */
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Briefcase, Settings, 
  LogOut, Terminal as TerminalIcon, X 
} from "lucide-react"; 
import { useAuth } from "../../context/useAuth";
import { motion, AnimatePresence } from "framer-motion";

// Components & Assets
import SdcLogo from "../../assets/SDC.png";
import { ProjectMatrix } from "../../components/dashboard/Forge/Dev/ProjectMatrix";
import DevSettings from "../../components/dashboard/Forge/Dev/Settings";

type DevViewType = 'nexus' | 'matrix' | 'settings';

export default function DeveloperView({ userName }: { userName: string }) {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState<DevViewType>('nexus');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // --- DYNAMIC USER ID ASSIGNMENT ---
  // LoginPage ke logic se sync kiya: Agar name "Satyam Leader" hai toh leader ID do
  const currentUserId = userName === "Satyam Leader" ? "dev-01" : "dev-member"; 

  // --- GLOBAL KEYBOARD SHORTCUT: Alt + T ---
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

  const STATS = [
    { label: "Integrity_Rating", value: "98%", color: "text-white", glow: "shadow-white/5" },
    { label: "Power_Level", value: "1420", color: "text-sky-400", glow: "shadow-sky-500/20" },
    { label: "Uptime_Status", value: "100%", color: "text-emerald-400", glow: "shadow-emerald-500/20" },
    { label: "Active_Tasks", value: currentUserId === "dev-01" ? "05" : "02", color: "text-blue-400", glow: "shadow-blue-500/20" },
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
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-sky-500/20 bg-black flex flex-col z-50 shrink-0 relative">
        <div className="absolute top-0 right-0 w-0.5 h-full bg-linear-to-b from-sky-500 via-sky-500/20 to-transparent shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
        <div className="p-6 border-b border-white/5 flex justify-center">
          <img src={SdcLogo} alt="SDC LOGO" className="w-40 h-auto block" />
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4 mb-4">Unit_Operations</p>
          
          <button onClick={() => { setActiveView('nexus'); setSelectedProjectId(null); }} className={`w-full group relative flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeView === 'nexus' ? 'text-white' : 'text-zinc-500 hover:text-sky-400'}`}>
            {activeView === 'nexus' && <div className="absolute inset-0 bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.6)] -skew-x-12 z-0" />}
            <LayoutDashboard size={18} className="relative z-10" /> <span className="relative z-10">Nexus_Home</span>
          </button>

          <button onClick={() => setActiveView('matrix')} className={`w-full group relative flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeView === 'matrix' ? 'text-white' : 'text-zinc-500 hover:text-sky-400'}`}>
            {activeView === 'matrix' && <div className="absolute inset-0 bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.6)] -skew-x-12 z-0" />}
            <Briefcase size={18} className="relative z-10" /> <span className="relative z-10">My_Projects</span>
          </button>

          <button onClick={() => setActiveView('settings')} className={`w-full group relative flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeView === 'settings' ? 'text-white' : 'text-zinc-500 hover:text-sky-400'}`}>
            {activeView === 'settings' && <div className="absolute inset-0 bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.6)] -skew-x-12 z-0" />}
            <Settings size={18} className="relative z-10" /> <span className="relative z-10">Settings</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-all group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> System_Exit
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#020203] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

        {/* HEADER */}
        <header className="h-16 w-full border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4 bg-zinc-950 border border-white/5 px-4 py-2 rounded-sm focus-within:border-sky-500/50 transition-all">
            <div className="w-4 h-4 rounded-full border-2 border-zinc-800" /> 
            <input type="text" placeholder="SEARCH_PROTOCOLS..." className="bg-transparent text-[10px] font-mono outline-none w-64 text-white placeholder:text-zinc-800" />
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">{userName}</p>
              <p className="text-[8px] font-black text-sky-500 uppercase italic tracking-tighter mt-1">
                {currentUserId === "dev-01" ? "Team_Leader" : "Core_Operative"}
              </p>
            </div>
            <div className="w-10 h-10 border border-sky-500/40 p-0.5 rotate-45 overflow-hidden relative bg-black shadow-[0_0_10px_rgba(14,165,233,0.2)]">
              <div className="w-full h-full bg-zinc-900 -rotate-45 flex items-center justify-center font-black text-[10px] text-sky-400 uppercase">
                {userName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* VIEWPORT AREA */}
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar relative z-10">
          
          {/* NEXUS HOME */}
          {activeView === 'nexus' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full animate-in fade-in duration-500">
              {STATS.map((stat, i) => (
                <div key={i} className={`bg-zinc-900/40 border border-white/5 border-l-4 border-l-sky-500 p-6 relative shadow-xl ${stat.glow}`} style={{ clipPath: 'polygon(0 0, 96% 0, 100% 20%, 100% 100%, 0 100%)' }}>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                  <h3 className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h3>
                </div>
              ))}
            </div>
          )}

          {/* MY PROJECTS & MATRIX */}
          {activeView === 'matrix' && (
            <div className="animate-in fade-in duration-500">
              {!selectedProjectId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectsDB.map((proj) => (
                    <div key={proj.id} onClick={() => setSelectedProjectId(proj.id)} className="bg-zinc-900/40 border border-white/5 border-l-4 border-l-sky-500 p-8 cursor-pointer hover:border-sky-500/40 transition-all relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 96% 0, 100% 10%, 100% 100%, 0 100%)' }}>
                      <h3 className="text-2xl font-black italic text-white uppercase mb-6">{proj.projectName}</h3>
                      <p className="text-[10px] text-sky-400 font-black uppercase tracking-widest underline underline-offset-4 tracking-widest">Initialize_Matrix →</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <button onClick={() => setSelectedProjectId(null)} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white mb-4 flex items-center gap-2 transition-colors">← Back_To_Roster</button>
                  {activeProjectData && (
                    <ProjectMatrix 
                      currentUserId={currentUserId} 
                      projectData={activeProjectData} 
                      onToggleTerminal={() => setIsTerminalOpen(true)} 
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeView === 'settings' && (
            <div className="w-full animate-in fade-in zoom-in-95 duration-500">
               <DevSettings />
            </div>
          )}
        </div>

        {/* --- GLOBAL FLOATING TERMINAL --- */}
        <AnimatePresence>
          {isTerminalOpen && (
            <motion.div 
              initial={{ y: 500, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 500, opacity: 0 }}
              className="absolute bottom-6 right-6 w-125 h-75 bg-black border border-sky-500/30 z-100 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <TerminalIcon size={12} className="text-sky-500" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Global_Terminal_v1.0</span>
                </div>
                <button onClick={() => setIsTerminalOpen(false)} className="text-zinc-600 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto custom-scrollbar">
                <p className="text-emerald-500">// Handshake Protocol: Secure</p>
                <p className="text-zinc-600 italic mt-1">Awaiting Global Directives...</p>
                <div className="flex gap-2 mt-4">
                  <span className="text-sky-500 font-bold">root@sdc:~$</span>
                  <input type="text" autoFocus className="bg-transparent border-none outline-none text-zinc-300 w-full" placeholder="..." />
                </div>
              </div>
              <div className="px-4 py-1.5 bg-zinc-950 text-[7px] text-zinc-800 font-black uppercase tracking-widest flex justify-between border-t border-white/5">
                <span>Link_Active</span>
                <span>Node: Global_Overlay</span>
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