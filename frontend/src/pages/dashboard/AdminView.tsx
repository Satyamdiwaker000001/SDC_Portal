/* cspell:disable */
import { useState } from "react";
import {
  LayoutDashboard, LogOut, Layers, 
  UserPlus, Briefcase, Settings, UserCheck, Search,
} from "lucide-react"; 
// FIXED: Type-only import to satisfy 'verbatimModuleSyntax'
import type { LucideIcon } from "lucide-react"; 

import { useAuth } from "../../context/useAuth";

// --- COMPONENTS IMPORT ---
import { RecruitmentForm } from '../../components/dashboard/Forge/RecruitmentForm';
import { SDC_User } from "../../components/views/SDC_User"; 
import { SDC_Team } from "../../components/dashboard/Forge/SDC_Team";
import { CreateTeam } from "../../components/dashboard/Forge/createTeam";
import { SDC_Project } from "../../components/dashboard/Forge/SDC_Project";
import AdminSettings from "../../components/dashboard/Forge/AdminSettings"; 

import SdcLogo from "../../assets/SDC.png";

// Views matching the sidebar navigation
type ViewType = 'overview' | 'registry' | 'members' | 'teams' | 'projects' | 'config' | 'forge';

// --- INTERFACE: Strict Props for Sidebar ---
interface SidebarProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  color?: "sky" | "emerald";
}

export default function AdminView() {
  const { logout, user } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');

  // Dynamic Name from Auth Context
  const adminName = user?.name || "OPERATOR_ROOT";

  const STATS = [
    { label: "Total_Users", value: "42", color: "text-white", glow: "shadow-white/5" },
    { label: "Projects_Pending", value: "14", color: "text-sky-400", glow: "shadow-sky-500/20" },
    { label: "Live_Projects", value: "08", color: "text-emerald-400", glow: "shadow-emerald-500/20" },
    { label: "Active_Teams", value: "05 / 12", color: "text-blue-400", glow: "shadow-blue-500/20" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#020203] text-zinc-300 font-sans selection:bg-sky-500/30">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-sky-500/20 bg-black flex flex-col z-50 relative shrink-0">
        {/* Vertical Glow Accent */}
        <div className="absolute top-0 right-0 w-0.5 h-full bg-linear-to-b from-sky-500 via-sky-500/20 to-transparent shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
        
        <div className="p-6 border-b border-white/5 flex justify-center">
          <img src={SdcLogo} alt="SDC LOGO" className="w-40 h-auto block brightness-125 transition-all hover:scale-105 duration-500" />
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4 mb-4">Core_Systems</p>
          
          <SidebarLink icon={LayoutDashboard} label="Overview" active={activeView === 'overview'} onClick={() => setActiveView('overview')} />
          <SidebarLink icon={UserPlus} label="Add_Member" active={activeView === 'registry'} onClick={() => setActiveView('registry')} />
          <SidebarLink icon={UserCheck} label="All_Members" active={activeView === 'members'} onClick={() => setActiveView('members')} />
          
          <div className="h-px bg-white/5 my-6 mx-4" />
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4 mb-4">Operations</p>
          
          <SidebarLink icon={Layers} label="All_Teams" active={activeView === 'teams'} onClick={() => setActiveView('teams')} color="emerald" />
          <SidebarLink icon={Briefcase} label="Projects" active={activeView === 'projects'} onClick={() => setActiveView('projects')} />
          
          <div className="h-px bg-white/5 my-6 mx-4" />
          <SidebarLink icon={Settings} label="Settings" active={activeView === 'config'} onClick={() => setActiveView('config')} />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-all group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> System_Exit
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#020203] relative">
        {/* Industrial Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
             style={{ backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

        {/* --- HEADER --- */}
        <header className="h-16 w-full border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4 bg-zinc-950 border border-white/5 px-4 py-2 rounded-sm focus-within:border-sky-500/50 transition-all">
            {/* Note: Header uses a local search input, not the lucide-react Search icon */}
            <div className="w-4 h-4 rounded-full border-2 border-zinc-800" /> 
            <input type="text" placeholder="SEARCH_PROTOCOLS..." className="bg-transparent text-[10px] font-mono outline-none w-64 text-white placeholder:text-zinc-800" />
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">{adminName}</p>
              <p className="text-[8px] font-black text-sky-500 uppercase italic tracking-tighter mt-1">Root_Operator</p>
            </div>
            {/* Hexagonal/Diamond Avatar Box */}
            <div className="w-10 h-10 border border-sky-500/40 p-0.5 rotate-45 overflow-hidden relative bg-black shadow-[0_0_10px_rgba(14,165,233,0.2)]">
              <div className="w-full h-full bg-zinc-900 -rotate-45 flex items-center justify-center font-black text-[10px] text-sky-400 uppercase">
                {adminName.substring(0, 2)}
              </div>
            </div>
          </div>
        </header>

        {/* --- VIEWPORT (Content Display) --- */}
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar relative z-10">
          
          {/* Overview Section */}
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full animate-in fade-in duration-500">
              {STATS.map((stat, i) => (
                <div key={i} className={`bg-zinc-900/40 border border-white/5 border-l-4 border-l-sky-500 p-6 relative shadow-xl ${stat.glow}`} 
                     style={{ clipPath: 'polygon(0 0, 96% 0, 100% 20%, 100% 100%, 0 100%)' }}>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                  <h3 className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h3>
                </div>
              ))}
            </div>
          )}

          {/* Module Loader Logic */}
          {activeView === 'registry' && <div className="w-full animate-in slide-in-from-top-4 duration-500"><RecruitmentForm onClose={() => setActiveView('overview')} /></div>}
          {activeView === 'members' && <div className="w-full animate-in slide-in-from-top-4 duration-500"><SDC_User onAddTeam={() => setActiveView('forge')} /></div>}
          {activeView === 'forge' && <div className="w-full animate-in slide-in-from-top-4 duration-500"><CreateTeam /></div>}
          {activeView === 'teams' && <div className="w-full animate-in slide-in-from-top-4 duration-500"><SDC_Team /></div>}
          {activeView === 'projects' && <div className="w-full animate-in slide-in-from-top-4 duration-500"><SDC_Project /></div>}
          
          {/* Fallback for Config */}
          {activeView === 'config' && (
             <div className="w-full h-96 flex flex-col items-center justify-center opacity-20 border border-dashed border-white/10">
                <Settings size={60} strokeWidth={0.5} className="animate-spin-slow" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-8 text-white">Config_Module_Under_Maintenance</p>
             </div>
          )}
          
        </div>
      </main>

      {/* Internal Custom CSS for Scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0ea5e922; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0ea5e9; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENT: Typed SidebarLink ---
function SidebarLink({ icon: Icon, label, active, onClick, color = "sky" }: SidebarProps) {
  const activeStyles = color === "emerald" 
    ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
    : "bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.6)]";

  return (
    <button 
      onClick={onClick} 
      className={`w-full group relative flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${active ? 'text-white' : 'text-zinc-500 hover:text-sky-400'}`}
    >
      {active && <div className={`absolute inset-0 -skew-x-12 z-0 ${activeStyles}`} />}
      <Icon size={18} className="relative z-10" /> 
      <span className="relative z-10">{label}</span>
    </button>
  );
}