import { useState, useEffect } from "react";
import {
  LayoutDashboard, LogOut, Layers, Briefcase, Settings, UserCheck,
  Globe, Menu, Download, UserPlus, Megaphone,
  Cpu, Activity, Database
} from "lucide-react"; 
import type { LucideIcon } from "lucide-react"; 
import { useAuth } from "../../context/useAuth";
import { motion } from 'framer-motion';
import { soundManager } from "../../utils/SoundManager";

// --- COMPONENTS ---
import { RecruitmentForm } from '../../components/dashboard/Forge/RecruitmentForm';
import { SDC_User } from "../../components/views/SDC_User"; 
import { SDC_Team } from "../../components/dashboard/Forge/SDC_Team";
import { SDC_Project } from "../../components/dashboard/Forge/SDC_Project";
import AdminSettings from "../../components/dashboard/Forge/AdminSettings"; 

type ViewType = 'overview' | 'recruitment' | 'registry' | 'members' | 'teams' | 'projects' | 'config' | 'announce' | 'deadlines';

export default function AdminView({ userName }: { userName?: string }) {
  const { logout, user } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // --- SETTINGS SYNC ---
  const [adminProfile, setAdminProfile] = useState({
    name: localStorage.getItem("SDC_ADMIN_NAME") || user?.name || userName || "ADMIN_ROOT",
    avatar: localStorage.getItem("SDC_ADMIN_AVATAR") || ""
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    const syncProfile = () => {
      setAdminProfile({
        name: localStorage.getItem("SDC_ADMIN_NAME") || "ADMIN_ROOT",
        avatar: localStorage.getItem("SDC_ADMIN_AVATAR") || ""
      });
    };
    window.addEventListener("admin_settings_updated", syncProfile);
    return () => {
      clearInterval(timer);
      window.removeEventListener("admin_settings_updated", syncProfile);
    };
  }, []);

  const [isRecruitmentLive, setIsRecruitmentLive] = useState(() => localStorage.getItem("SDC_RECRUITMENT_STATUS") === "LIVE");

  const toggleRecruitment = () => {
    soundManager.playConfirm();
    const newStatus = !isRecruitmentLive;
    setIsRecruitmentLive(newStatus);
    localStorage.setItem("SDC_RECRUITMENT_STATUS", newStatus ? "LIVE" : "OFFLINE");
    window.dispatchEvent(new Event("storage"));
  };

  const STATS = [
    { label: "Total_Users", value: "42", ref: "USR-01" },
    { label: "Live_Projects", value: "08", ref: "PRJ-01" },
    { label: "Active_Teams", value: "05", ref: "TEAM-01" },
    { label: "Applicants", value: "12", ref: "APP-01" },
  ];

  const ViewTitleMap: Record<string, string> = {
    overview: 'COMMAND_OVERVIEW',
    recruitment: 'ASPIRANT_REGISTRY',
    registry: 'ADD_MEMBER',
    members: 'TEAM_ROSTER',
    teams: 'SQUAD_MGNT',
    projects: 'PROJECT_OVERVIEW',
    announce: 'BROADCAST_NET',
    config: 'SYS_CONFIG'
  };

  return (
    <div className="flex h-screen overflow-hidden bg-kpr-white text-kpr-black relative">
      
      {/* PERSISTENT SIDEBAR [MECHANICAL] */}
      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-500 ease-in-out w-72 bg-white border-r border-kpr-grey flex flex-col z-[60] shadow-2xl`}>
        <div className="p-8 border-b border-kpr-grey flex flex-col items-start relative overflow-hidden bg-white">
           <div className="kpr-grid-main opacity-10 pointer-events-none" />
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-kpr-black flex items-center justify-center text-white font-black italic text-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}>
                S
              </div>
              <div className="flex flex-col">
                 <span className="kpr-mono-label mb-1">SDC_ROOT</span>
                 <span className="kpr-mono-value">V4.02_STABLE</span>
              </div>
           </div>
           <h2 className="text-3xl font-black italic tracking-tighter line-clamp-1">{ViewTitleMap[activeView]}</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar relative z-10 bg-white">
          <SidebarNavBtn icon={LayoutDashboard} label="Overview" refCode="D-01" active={activeView === 'overview'} onClick={() => setActiveView('overview')} />
          <SidebarNavBtn icon={Globe} label="Recruitment" refCode="D-02" active={activeView === 'recruitment'} onClick={() => setActiveView('recruitment')} />
          <div className="h-[1px] bg-kpr-grey my-4 mx-4 opacity-50" />
          <SidebarNavBtn icon={UserPlus} label="Add Member" refCode="M-01" active={activeView === 'registry'} onClick={() => setActiveView('registry')} />
          <SidebarNavBtn icon={UserCheck} label="Members" refCode="M-02" active={activeView === 'members'} onClick={() => setActiveView('members')} />
          <SidebarNavBtn icon={Layers} label="Teams" refCode="T-01" active={activeView === 'teams'} onClick={() => setActiveView('teams')} />
          <SidebarNavBtn icon={Briefcase} label="Projects" refCode="P-01" active={activeView === 'projects'} onClick={() => setActiveView('projects')} />
          <div className="h-[1px] bg-kpr-grey my-4 mx-4 opacity-50" />
          <SidebarNavBtn icon={Megaphone} label="Announce" refCode="B-01" active={activeView === 'announce'} onClick={() => setActiveView('announce')} />
          <SidebarNavBtn icon={Settings} label="Settings" refCode="S-01" active={activeView === 'config'} onClick={() => setActiveView('config')} />
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
        <header className="h-24 w-full border-b border-kpr-grey px-8 lg:px-12 flex items-center justify-between bg-white relative z-50">
          <div className="flex items-center gap-8">
            <button onClick={() => { soundManager.playSlide(); setIsSidebarOpen(!isSidebarOpen); }} className="lg:hidden p-3 bg-kpr-black text-white"><Menu size={20} /></button>
            
            <div className="hidden md:flex flex-col">
               <span className="kpr-mono-label opacity-40">SYSTEM_NODE</span>
               <span className="kpr-mono-value">AGRA_CENTRAL_01</span>
            </div>

            <button 
              onClick={toggleRecruitment} 
              onMouseEnter={() => soundManager.playHover()} 
              className={`flex items-center gap-3 px-4 py-2 bg-kpr-white border border-kpr-grey hover:border-kpr-green transition-all group`}
              style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
            >
              <div className={`w-2 h-2 rounded-full ${isRecruitmentLive ? 'bg-kpr-green animate-pulse' : 'bg-kpr-grey'}`} />
              <span className="kpr-mono-value">{isRecruitmentLive ? "RECRUITMENT_LIVE" : "RECRUITMENT_OFF"}</span>
            </button>
          </div>

          <div className="flex items-center gap-12">
            <div className="hidden sm:flex flex-col items-end pr-12 border-r border-kpr-grey">
              <span className="text-xl font-black italic text-kpr-black tracking-tighter">{currentTime}</span>
              <span className="kpr-mono-label">SDC_SYSTEM_CLOCK</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-black italic text-lg leading-none mb-1 text-kpr-black">{adminProfile.name}</p>
                <p className="kpr-mono-label text-kpr-green">ROOT_STATUS_ACTIVE</p>
              </div>
              <div className="w-12 h-12 bg-kpr-white border-2 border-kpr-grey flex items-center justify-center overflow-hidden" 
                   style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}>
                {adminProfile.avatar ? (
                  <img src={adminProfile.avatar} alt="AD" className="w-full h-full object-cover" />
                ) : (
                  <Database size={20} className="text-kpr-green" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* HUD CONTENT [GRID_LOCKED] */}
        <div className="p-8 lg:p-12 flex-1 overflow-y-auto custom-scrollbar z-10 w-full max-w-[1600px] mx-auto">
          {activeView === 'overview' && (
            <div className="space-y-12">
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
                    <div className="absolute right-4 bottom-4 w-4 h-4 text-kpr-grey border-b border-r" />
                  </motion.div>
                ))}
              </div>
              
              {/* SNAPSHOT_MODULES */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="kpr-panel p-10">
                   <div className="flex justify-between items-end mb-12 border-b border-kpr-grey pb-8">
                      <div>
                         <span className="kpr-mono-label opacity-40 mb-2 block">MODULE_ROSTER</span>
                         <h3 className="text-3xl font-black italic">SQUAD_SNAPSHOT</h3>
                      </div>
                      <button onClick={() => setActiveView('teams')} className="kpr-badge-neon hover:scale-105 transition-transform">MANAGE_ALL</button>
                   </div>
                   <div className="space-y-6">
                      {["ALPHA_UNIT", "BRAVO_CORE", "GIGA_DRIVE"].map((t, idx) => (
                        <div key={idx} className="flex justify-between items-center p-6 bg-kpr-white border border-kpr-grey group hover:translate-x-2 transition-transform cursor-pointer">
                           <div className="flex items-center gap-6">
                              <span className="kpr-mono-label text-kpr-green">00{idx+1}</span>
                              <span className="font-black italic text-xl">{t}</span>
                           </div>
                           <span className="kpr-mono-label opacity-40 group-hover:text-kpr-green">ACTIVE_SYNC</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="kpr-panel p-10">
                   <div className="flex justify-between items-end mb-12 border-b border-kpr-grey pb-8">
                      <div>
                         <span className="kpr-mono-label opacity-40 mb-2 block">MODULE_MISSION</span>
                         <h3 className="text-3xl font-black italic">FORGE_PROGRESS</h3>
                      </div>
                      <button onClick={() => setActiveView('projects')} className="kpr-badge-neon hover:scale-105 transition-transform">VIEW_INDEX</button>
                   </div>
                   <div className="space-y-10">
                      {[
                        { n: "CAMPUS_CORE", p: 88 },
                        { n: "SYSTEM_REACH", p: 42 }
                      ].map((p, idx) => (
                        <div key={idx} className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="font-black italic text-xl">{p.n}</span>
                              <span className="kpr-mono-value text-kpr-green">{p.p}%_SYNC</span>
                           </div>
                           <div className="w-full h-1 bg-kpr-grey relative overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${p.p}%` }} 
                                className="absolute inset-y-0 left-0 bg-kpr-green" 
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'recruitment' && (
             <div className="animate-in fade-in duration-700">
                <RecruitmentDashboardHeader onExport={() => alert("SIGNAL_EXPORTED")} />
                <div className="kpr-panel mt-8 overflow-hidden bg-white">
                   <RecruitmentTable />
                </div>
             </div>
          )}

          {/* Integration Views */}
          {activeView === 'registry' && <RecruitmentForm onClose={() => setActiveView('overview')} />}
          {activeView === 'members' && <SDC_User onAddTeam={() => setActiveView('teams')} />}
          {activeView === 'teams' && <SDC_Team />}
          {activeView === 'projects' && <SDC_Project />}
          {activeView === 'config' && <div className="max-w-4xl mx-auto"><AdminSettings /></div>}
          {activeView === 'announce' && <BroadcastInterface />}

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

// --- SUB_COMPONENTS [REFACTORED_FOR_KPR] ---

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

function RecruitmentDashboardHeader({ onExport }: { onExport: () => void }) {
  return (
    <div className="flex justify-between items-end border-b border-kpr-grey pb-8">
      <div>
        <span className="kpr-mono-label opacity-40 mb-2 block">MODULE_ASPIRANTS</span>
        <h3 className="text-3xl font-black italic">ASPIRANT_REGISTRY</h3>
      </div>
      <button 
        onClick={() => { soundManager.playConfirm(); onExport(); }}
        onMouseEnter={() => soundManager.playHover()}
        className="kpr-btn-notched flex items-center gap-3 bg-kpr-black"
      >
        <Download size={16} /> EXPORT_SIGNAL
      </button>
    </div>
  );
}

function RecruitmentTable() {
  const applicants = [{ id: "001", name: "Rahul Singh", email: "rahul@gmail.com", status: "INTERESTED", class: "B.TECH_3RD" }];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-kpr-grey bg-kpr-white">
            <th className="p-6 kpr-mono-label opacity-40">OPERATIVE_ID</th>
            <th className="p-6 kpr-mono-label opacity-40">UPLINK_IDENTITY</th>
            <th className="p-6 kpr-mono-label opacity-40">CONTACT_REF</th>
            <th className="p-6 kpr-mono-label opacity-40 text-right">PROTOCOL_STATUS</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map(app => (
            <tr key={app.id} className="border-b border-kpr-grey hover:bg-kpr-white transition-colors">
              <td className="p-6 kpr-mono-value">#{app.id}</td>
              <td className="p-6 font-black italic text-lg">{app.name}</td>
              <td className="p-6 kpr-mono-label">{app.email}</td>
              <td className="p-6 text-right">
                <span className="kpr-badge-neon">{app.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BroadcastInterface() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
       <div className="flex justify-between items-end border-b border-kpr-grey pb-8">
          <div>
            <span className="kpr-mono-label opacity-40 mb-2 block">MODULE_BROADCAST</span>
            <h3 className="text-3xl font-black italic">NETWORK_TRANSMISSIONS</h3>
          </div>
          <button className="kpr-btn-notched bg-kpr-black">NEW_SIGNAL</button>
       </div>
       <div className="space-y-6">
          {[1].map(i => (
            <div key={i} className="kpr-panel p-8 group border-l-4 border-l-kpr-green">
               <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-black italic">RECRUITMENT_PHASE_01_LIVE</h4>
                  <span className="kpr-mono-label opacity-40">01/04/2026</span>
               </div>
               <p className="kpr-mono-label mb-8 leading-relaxed">APPLICATIONS FOR THE 2026 SDC BATCH ARE NOW BEING PROCESSED THROUGH SECTOR_7 GATEWAY.</p>
               <div className="flex gap-4">
                  <span className="kpr-badge-neon">PRIORITY_HIGH</span>
                  <span className="kpr-badge-neon bg-kpr-black text-white">B_SIGNAL</span>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}