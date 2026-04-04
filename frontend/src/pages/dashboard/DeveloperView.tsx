import { useState, useMemo, useEffect } from "react";
import { 
  LayoutDashboard, Briefcase, Settings, 
  LogOut, X, Activity, ChevronRight,
  Cpu, Network, Database, ShieldCheck
} from "lucide-react"; 
import type { LucideIcon } from "lucide-react"; 
import { useAuth } from "../../context/useAuth";
import { soundManager } from "../../utils/SoundManager";
import { ProjectMatrix } from "../../components/dashboard/Forge/Dev/ProjectMatrix";
import DevSettings from "../../components/dashboard/Forge/Dev/Settings";
import { motion } from 'framer-motion';

interface Announcement {
  title: string;
  body: string;
  date: string;
}

type DevViewType = 'nexus' | 'matrix' | 'settings';

export default function DeveloperView({ userName }: { userName?: string }) {
  const { logout, user } = useAuth();
  const [activeView, setActiveView] = useState<DevViewType>('nexus');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const personnelId = useMemo(() => localStorage.getItem("SDC_USER_ID") || "SDC-2026-OP-01", []);
  const [intelAnnouncements, setIntelAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
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
    return () => clearInterval(timer);
  }, []);

  const [profile, setProfile] = useState({
    alias: user?.name || userName || "SDC_OPERATIVE",
    designation: "Developer",
    github: "github.com/",
    linkedin: "linkedin.com/",
    portfolio: "",
    bio: "Core system operative.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Op" 
  });

  const currentUserId = profile.alias.includes("Leader") ? "dev-01" : "dev-member";

  const STATS = [
    { label: "Integrity", value: "98%", ref: "INT-01" },
    { label: "Progress", value: "85%", ref: "PRG-01" },
    { label: "Tasks", value: "12", ref: "TSK-01" },
    { label: "Efficiency", value: "92%", ref: "EFF-01" },
  ];

  const projectHistory = useMemo(() => [
    { 
      id: "SDC-PRJ-2026-04", 
      projectName: "NEXUS_CORE", 
      status: "LIVE", 
      team: [{ id: 'dev-01', name: profile.alias, role: 'Leader', isLeader: true }],
      roadmap: ["Auth_Core", "Database_Nexus"],
      initialTasks: [{ id: 't1', moduleName: 'AUTH_CORE', title: 'Init JWT Protocol', assignedTo: 'dev-01', status: 'COMPLETED' as const }]
    }
  ], [profile.alias]);

  return (
    <div className="flex h-screen overflow-hidden bg-kpr-white text-kpr-black relative">
      
      {/* PERSISTENT SIDEBAR [MECHANICAL] */}
      <aside className="w-72 bg-white border-r border-kpr-grey flex flex-col z-[60] shadow-2xl shrink-0">
        <div className="p-8 border-b border-kpr-grey flex flex-col items-start relative overflow-hidden bg-white">
           <div className="kpr-grid-main opacity-10 pointer-events-none" />
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-kpr-black flex items-center justify-center text-white font-black italic text-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}>
                O
              </div>
              <div className="flex flex-col">
                 <span className="kpr-mono-label mb-1">OPERATIVE_ID</span>
                 <span className="kpr-mono-value">{personnelId}</span>
              </div>
           </div>
           <h2 className="text-3xl font-black italic tracking-tighter line-clamp-1">PORTAL_INT</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar relative z-10 bg-white">
          <SidebarNavBtn icon={LayoutDashboard} label="Nexus Center" refCode="D-01" active={activeView === 'nexus'} onClick={() => { setActiveView('nexus'); setSelectedProjectId(null); }} />
          <SidebarNavBtn icon={Briefcase} label="Project Matrix" refCode="M-01" active={activeView === 'matrix'} onClick={() => { setActiveView('matrix'); setSelectedProjectId(null); }} />
          <div className="h-[1px] bg-kpr-grey my-4 mx-4 opacity-50" />
          <SidebarNavBtn icon={Settings} label="Settings" refCode="S-01" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
        </nav>
        
        <div className="p-4 border-t border-kpr-grey bg-white relative z-10">
           <div className="mb-4 flex items-center justify-between px-4">
              <span className="kpr-mono-label">UPLINK_STABLE</span>
              <Activity size={12} className="text-kpr-green animate-pulse" />
           </div>
           <button 
             onClick={() => { soundManager.playClick(); logout(); }}
             onMouseEnter={() => soundManager.playHover()}
             className="w-full kpr-btn-notched flex items-center justify-center gap-3 bg-kpr-black hover:bg-red-500"
           >
             <LogOut size={16} /> SECURE_EXIT
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA [HUD_MODE] */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* TOP HUD BAR */}
        <header className="h-24 w-full border-b border-kpr-grey px-12 flex items-center justify-between bg-white relative z-50">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
               <span className="kpr-mono-label opacity-40">SYSTEM_NODE</span>
               <span className="kpr-mono-value">OPERATIVE_TERM_01</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-kpr-white border border-kpr-grey" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
               <Network size={14} className="text-kpr-green" />
               <span className="kpr-mono-value">SECURE_SYNC_ENABLE</span>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <div className="hidden sm:flex flex-col items-end pr-12 border-r border-kpr-grey">
              <span className="text-xl font-black italic text-kpr-black tracking-tighter">{currentTime}</span>
              <span className="kpr-mono-label">SDC_SYSTEM_CLOCK</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-black italic text-lg leading-none mb-1 text-kpr-black">{profile.alias}</p>
                <p className="kpr-mono-label text-kpr-green">{profile.designation.toUpperCase()}</p>
              </div>
              <div className="w-12 h-12 bg-kpr-white border-2 border-kpr-grey flex items-center justify-center overflow-hidden" 
                   style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}>
                <img src={profile.avatar} className="w-full h-full object-cover" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* HUD CONTENT [GRID_LOCKED] */}
        <div className="p-12 flex-1 overflow-y-auto custom-scrollbar z-10 w-full max-w-[1600px] mx-auto">
          {activeView === 'nexus' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* STATS_MODULE */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {STATS.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="kpr-panel p-8 group hover:border-kpr-green transition-colors"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-1">
                         <span className="kpr-mono-label opacity-40 block">{stat.ref}</span>
                         <span className="kpr-mono-value opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</span>
                      </div>
                      <Cpu size={16} className="text-kpr-black/10 group-hover:text-kpr-green transition-colors" />
                    </div>
                    <h3 className="text-6xl font-black italic text-kpr-black tracking-tighter">{stat.value}</h3>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-12">
                
                {/* ACTIVE OPERATIONS BLOCK */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                   <div className="flex justify-between items-end border-b border-kpr-grey pb-8">
                      <div>
                         <span className="kpr-mono-label opacity-40 mb-2 block">MODULE_OPERATIONS</span>
                         <h3 className="text-3xl font-black italic text-kpr-green">ACTIVE_FORGE</h3>
                      </div>
                      <button onClick={() => setActiveView('matrix')} className="kpr-badge-neon hover:scale-105 transition-transform">EXPAND_MATRIX</button>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-6">
                      {projectHistory.map((proj) => (
                        <div key={proj.id} onClick={() => setSelectedProjectId(proj.id)} className="kpr-panel p-8 group hover:border-kpr-green cursor-pointer transition-all flex justify-between items-center bg-white/50">
                           <div className="flex items-center gap-10">
                              <div className="w-16 h-16 bg-kpr-black/5 flex items-center justify-center text-kpr-green border border-kpr-grey group-hover:border-kpr-green active:scale-95 transition-all">
                                 <Database size={24} />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-2xl font-black italic tracking-tighter">{proj.projectName}</p>
                                 <div className="flex items-center gap-6">
                                    <span className="kpr-mono-label text-kpr-green">#{proj.id}</span>
                                    <span className="kpr-mono-label opacity-40">STATUS_LIVE</span>
                                 </div>
                              </div>
                           </div>
                           <ChevronRight size={24} className="text-kpr-black/20 group-hover:text-kpr-green translate-x-4 group-hover:translate-x-6 transition-all" />
                        </div>
                      ))}
                   </div>
                </div>

                {/* INTEL FEED BLOCK */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                   <div className="flex justify-between items-end border-b border-kpr-grey pb-8">
                      <div>
                         <span className="kpr-mono-label opacity-40 mb-2 block">MODULE_INTEL</span>
                         <h3 className="text-3xl font-black italic">SIGNAL_FEED</h3>
                      </div>
                   </div>
                   <div className="space-y-6">
                      {intelAnnouncements.length > 0 ? (
                        intelAnnouncements.map((n: Announcement, i: number) => (
                          <div key={i} className="kpr-panel p-6 border-l-4 border-l-kpr-green group bg-white/50">
                             <h4 className="text-xl font-black italic mb-2 group-hover:translate-x-1 transition-transform">{n.title}</h4>
                             <p className="kpr-mono-label opacity-60 leading-relaxed">{n.body}</p>
                          </div>
                        ))
                      ) : (
                        <div className="kpr-panel p-12 text-center border-dashed border-2">
                           <ShieldCheck size={40} className="mx-auto mb-4 text-kpr-grey" />
                           <p className="kpr-mono-label opacity-40 uppercase">AWAITING_SIGNAL...</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'matrix' && (
             <div className="animate-in fade-in duration-700">
               {selectedProjectId ? (
                  <div className="space-y-8">
                    <button onClick={() => setSelectedProjectId(null)} className="kpr-badge-neon hover:bg-kpr-black hover:text-white transition-colors flex items-center gap-3">
                       <X size={12}/> RETURN_TO_MATRIX
                    </button>
                    <div className="kpr-panel p-2 bg-white">
                       <ProjectMatrix currentUserId={currentUserId} projectData={projectHistory[0]} addNotification={() => {}} />
                    </div>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectHistory.map((proj) => (
                      <div key={proj.id} onClick={() => setSelectedProjectId(proj.id)} className="kpr-panel p-10 group hover:border-kpr-green cursor-pointer transition-all flex flex-col justify-between aspect-square">
                        <div>
                           <span className="kpr-mono-label opacity-40 mb-2 block">PROJECT_NODE</span>
                           <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-6 group-hover:text-kpr-green">{proj.projectName}</h3>
                           <div className="flex gap-4">
                              <span className="kpr-badge-neon">SYNC_LIVE</span>
                              <span className="kpr-badge-neon bg-kpr-black text-white">V1.0</span>
                           </div>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="kpr-mono-label opacity-20">REF_{proj.id}</span>
                           <ChevronRight size={32} className="text-kpr-grey group-hover:text-kpr-green transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
               )}
             </div>
          )}

          {activeView === 'settings' && <div className="max-w-4xl mx-auto"><DevSettings profile={profile} setProfile={setProfile} /></div>}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--kpr-grey); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--kpr-green); }
      `}</style>
    </div>
  );
}

function SidebarNavBtn({ icon: Icon, label, refCode, active, onClick }: { icon: LucideIcon, label: string, refCode: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={() => { soundManager.playChirp(); onClick(); }}
      onMouseEnter={() => soundManager.playHover()}
      className={`w-full group relative flex items-center justify-between px-6 py-4 text-xs font-bold uppercase transition-all duration-300 ${active ? 'bg-kpr-black text-white' : 'text-kpr-black/60 hover:bg-kpr-grey/20 hover:text-kpr-black'}`}
      style={{ clipPath: active ? 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' : 'none' }}
    >
      <div className="flex items-center gap-4">
        <Icon size={16} className={active ? "text-kpr-green" : "group-hover:text-kpr-green transition-colors"} /> 
        <span>{label}</span>
      </div>
      <span className={`kpr-mono-label opacity-30 group-hover:opacity-100 transition-opacity ${active ? 'text-kpr-green' : ''}`}>{refCode}</span>
    </button>
  );
}