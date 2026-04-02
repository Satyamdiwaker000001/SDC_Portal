/* cspell:disable */
import { useState, useMemo, useEffect } from "react";
import { 
  LayoutDashboard, Briefcase, Settings, 
  LogOut, X, Activity, Target, ChevronRight,
  Zap, ShieldCheck, Megaphone
} from "lucide-react"; 
import type { LucideIcon } from "lucide-react"; 
import { useAuth } from "../../context/useAuth";
import SdcLogo from "../../assets/SDC.png";
import { ProjectMatrix } from "../../components/dashboard/Forge/Dev/ProjectMatrix";
import DevSettings from "../../components/dashboard/Forge/Dev/Settings";

interface Announcement {
  title: string;
  body: string;
  date: string;
}

type DevViewType = 'nexus' | 'matrix' | 'settings';

interface SidebarProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function DeveloperView({ userName }: { userName: string }) {
  const { logout, user } = useAuth();
  const [activeView, setActiveView] = useState<DevViewType>('nexus');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // --- ADMIN MANAGED DATA (Fetch Personnel ID) ---
  const personnelId = useMemo(() => localStorage.getItem("SDC_USER_ID") || "SDC-2026-OP-01", []);

  const [intelAnnouncements, setIntelAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchIntel = () => {
      const stored = localStorage.getItem("sdc_announcements");
      if (stored) {
        try {
          setIntelAnnouncements(JSON.parse(stored).slice(0, 5)); 
        } catch (error) {
          console.error("Intel fetch failed", error);
        }
      }
    };
    fetchIntel();
    window.addEventListener("storage", fetchIntel);
    return () => window.removeEventListener("storage", fetchIntel);
  }, []);

  const [profile, setProfile] = useState({
    alias: user?.name || userName || "SATYAM_LEADER",
    designation: "Full Stack Developer",
    github: "github.com/satyam-diwaker",
    linkedin: "linkedin.com/in/satyam-diwaker",
    portfolio: "https://sdc-portfolio.vercel.app",
    bio: "Core system operative specializing in threat detection ecosystem.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Satyam" 
  });

  const currentUserId = useMemo(() => 
    profile.alias.includes("Leader") ? "dev-01" : "dev-member", 
  [profile.alias]);

  const STATS = [
    { label: "SYSTEM_INTEGRITY", value: "98%", icon: <ShieldCheck size={14}/> },
    { label: "PROJECT_PROGRESS", value: "85%", icon: <Activity size={14}/> },
    { label: "COMPLETED_PROJECTS", value: "12", icon: <Target size={14}/> },
    { label: "EFFICIENCY", value: "92%", icon: <Zap size={14}/> },
  ];

  const projectHistory = useMemo(() => [
    { 
      id: "SDC-PRJ-2026-04", 
      projectName: "PHISHGUARD_AI_ENGINE", 
      status: "LIVE", 
      team: [{ id: 'dev-01', name: profile.alias, role: 'Leader', isLeader: true }],
      roadmap: ["Auth_Core", "Database_Nexus"],
      initialTasks: [{ id: 't1', moduleName: 'AUTH_CORE', title: 'Init JWT Protocol', assignedTo: 'dev-01', status: 'COMPLETED' as const }]
    }
  ], [profile.alias]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 't') {
        console.log("Terminal Signal Triggered via:", event.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#020203] text-zinc-300 font-sans selection:bg-sky-500/30 text-[11px]">
      
      <aside className="w-64 border-r border-sky-500/10 bg-black flex flex-col z-50 shrink-0 relative">
        <div className="absolute top-0 right-0 w-0.5 h-full bg-linear-to-b from-sky-500 via-sky-500/20 to-transparent shadow-[0_0_15px_#0ea5e988]" />
        <div className="p-6 border-b border-white/5 flex justify-center text-left">
          <img src={SdcLogo} alt="SDC" className="w-40 h-auto brightness-125" />
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar text-left">
          <SidebarLink icon={LayoutDashboard} label="Overview" active={activeView === 'nexus'} onClick={() => { setActiveView('nexus'); setSelectedProjectId(null); }} />
          <SidebarLink icon={Briefcase} label="My_Projects" active={activeView === 'matrix'} onClick={() => { setActiveView('matrix'); setSelectedProjectId(null); }} />
          <div className="h-px bg-white/5 my-6 mx-4" />
          <SidebarLink icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
        </nav>

        <div className="p-6 border-t border-white/5 text-left">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 font-black uppercase text-zinc-600 hover:text-sky-400 transition-all group">
            <LogOut size={18} /> System_Exit
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#020203] relative text-left">
        {/* --- TOP BAR SYNCED WITH ADMIN RULES --- */}
        <header className="h-20 w-full border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 border border-emerald-500/50 text-emerald-500 bg-emerald-500/5 font-black uppercase rounded-sm flex items-center gap-2">
              <Activity size={14} className="animate-pulse" /> Uplink_Active
            </div>
            <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-6 h-6">
              <ShieldCheck size={14} className="text-sky-500" />
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">SEC_VERIFIED: <span className="text-sky-500">AUTH_OP</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-right">
            <div className="flex flex-col justify-center">
              {/* WHITE TEXT ALIAS | BLUE ITALIC PERSONNEL ID */}
              <p className="font-black uppercase text-white tracking-widest leading-none mb-1">{profile.alias}</p>
              <p className="text-[8px] font-black text-sky-500 uppercase italic tracking-widest opacity-100 leading-none">ID: {personnelId}</p>
            </div>
            <div className="w-10 h-10 border-2 border-sky-500/40 p-0.5 rotate-45 bg-zinc-900 overflow-hidden flex items-center justify-center shadow-[0_0_15px_#0ea5e933] shrink-0">
              <img src={profile.avatar} className="-rotate-45 w-[140%] h-[140%] object-cover" alt="OP" />
            </div>
          </div>
        </header>

        <div className="p-10 flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          {activeView === 'nexus' && (
            <div className="space-y-10 animate-in fade-in duration-700 text-left">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full text-left">
                {STATS.map((stat, i) => (
                  <div key={i} className="relative group cursor-default text-left">
                    <div className="absolute -left-px top-0 w-0.5 h-full bg-sky-500 shadow-[0_0_15px_#0ea5e9] z-10" />
                    <div className="bg-zinc-900/40 p-6 border border-white/5 transition-all duration-500 shadow-xl"
                         style={{ clipPath: 'polygon(0 0, 92% 0, 100% 25%, 100% 100%, 0 100%)' }}>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">{stat.label}</p>
                      <div className="flex justify-between items-end">
                        <h3 className="text-3xl font-black italic text-white">{stat.value}</h3>
                        <div className="text-sky-500/20">{stat.icon}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-8 text-left">
                <div className="col-span-12 lg:col-span-8 bg-zinc-950/50 border border-white/5 p-8 rounded-sm">
                   <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-6 tracking-[0.3em] flex items-center gap-2 italic border-b border-white/5 pb-4">
                     <Target size={14} className="text-sky-500" /> Active_Missions_Log
                   </h3>
                   <div className="space-y-4">
                      {projectHistory.map(proj => (
                        <div key={proj.id} onClick={() => { setActiveView('matrix'); setSelectedProjectId(proj.id); }} className="p-6 bg-black/40 border-l-2 border-sky-500 flex justify-between items-center hover:bg-sky-500/5 transition-all cursor-pointer group">
                           <div className="min-w-0 flex-1 text-left">
                             <p className="text-[12px] font-black text-zinc-200 uppercase tracking-widest group-hover:text-sky-400 transition-colors truncate">{proj.projectName}</p>
                             <p className="text-[8px] font-mono text-zinc-600 mt-1 uppercase italic">ID: {proj.id} // LIVE</p>
                           </div>
                           <ChevronRight className="text-zinc-700 group-hover:text-white transition-all ml-4 shrink-0" />
                        </div>
                      ))}
                   </div>
                </div>

                <div className="col-span-12 lg:col-span-4 bg-zinc-950/50 border border-white/5 p-8 rounded-sm">
                   <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-6 tracking-[0.3em] flex items-center gap-2 italic border-b border-white/5 pb-4">
                      <Megaphone size={14} className="text-sky-500" /> Tactical_Intel
                   </h3>
                   <div className="space-y-6 text-left">
                      {intelAnnouncements.length > 0 ? (
                        intelAnnouncements.map((n, i) => (
                          <div key={i} className="border-l border-sky-500/30 pl-4 py-1 text-left">
                             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">{n.title}</p>
                             <p className="text-[8px] text-zinc-600 line-clamp-1 mt-1 italic">"{n.body}"</p>
                             <span className="text-[7px] text-zinc-700 font-mono italic mt-1 block">{n.date}</span>
                          </div>
                        ))
                      ) : (
                        <div className="border-l border-sky-500/30 pl-4 py-1 text-left opacity-30">
                           <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">No incoming signals...</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'matrix' && (
             <div className="animate-in fade-in duration-500 text-left">
               {selectedProjectId ? (
                  <div className="space-y-6 text-left">
                    <button onClick={() => setSelectedProjectId(null)} className="text-[10px] font-black text-zinc-500 uppercase hover:text-white mb-4 flex items-center gap-2 border border-white/5 px-4 py-2 hover:bg-white/5 transition-all"><X size={14}/> Close_Matrix</button>
                    <ProjectMatrix currentUserId={currentUserId} projectData={projectHistory[0]} addNotification={() => {}} />
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {projectHistory.map(proj => (
                      <div key={proj.id} className="relative group cursor-pointer text-left" onClick={() => setSelectedProjectId(proj.id)}>
                        <div className="absolute -left-px top-0 w-0.5 h-full bg-sky-500 shadow-[0_0_15px_#0ea5e9] z-10" />
                        <div 
                          className="bg-[#0a0a0a] border border-white/5 p-8 transition-all duration-500 group-hover:bg-[#0f0f0f] h-full flex flex-col justify-between"
                          style={{ clipPath: 'polygon(0 0, 96% 0, 100% 12%, 100% 100%, 0 100%)' }}
                        >
                          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter transition-all group-hover:text-sky-400 wrap-break-word whitespace-normal leading-tight">
                            {proj.projectName}
                          </h3>
                          <div className="mt-8 flex items-center gap-2 text-sky-500">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] italic">INITIALIZE_PROTOCOL</p>
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               )}
             </div>
          )}

          {activeView === 'settings' && <DevSettings profile={profile} setProfile={setProfile} />}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active, onClick }: SidebarProps) {
  return (
    <button onClick={onClick} className={`w-full group relative flex items-center gap-4 px-4 py-3 font-black uppercase tracking-[0.2em] transition-all duration-300 ${active ? 'text-white' : 'text-zinc-500 hover:text-sky-400'}`}>
      {active && (
        <div className="absolute inset-0 bg-sky-500 shadow-[0_0_20px_#0ea5e966] -skew-x-12 z-0" />
      )}
      <Icon size={18} className="relative z-10" /> <span className="relative z-10">{label}</span>
    </button>
  );
}