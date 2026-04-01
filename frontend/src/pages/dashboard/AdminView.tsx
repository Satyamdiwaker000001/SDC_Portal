/* cspell:disable */
import { useState } from "react";
import {
  LayoutDashboard, LogOut, Layers, Search,
  UserPlus, Briefcase, Settings, UserCheck,
  Globe, Download, User, Radio
} from "lucide-react"; 
import type { LucideIcon } from "lucide-react"; 
import { useAuth } from "../../context/useAuth";

// --- COMPONENTS ---
import { RecruitmentForm } from '../../components/dashboard/Forge/RecruitmentForm';
import { SDC_User } from "../../components/views/SDC_User"; 
import { SDC_Team } from "../../components/dashboard/Forge/SDC_Team";
import { CreateTeam } from "../../components/dashboard/Forge/createTeam";
import { SDC_Project } from "../../components/dashboard/Forge/SDC_Project";
import AdminSettings from "../../components/dashboard/Forge/AdminSettings"; 
import SdcLogo from "../../assets/SDC.png";

type ViewType = 'overview' | 'recruitment' | 'registry' | 'members' | 'teams' | 'projects' | 'config' | 'forge';

interface SidebarProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

// --- FIXED: Added Interface for Props ---
interface AdminViewProps {
  userName: string;
}

export default function AdminView({ userName }: AdminViewProps) {
  const { logout, user } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');
  
  // FIXED: Using userName prop directly
  const adminName = user?.name || userName || "OPERATOR_ROOT";

  // --- RECRUITMENT TOGGLE LOGIC ---
  const [isRecruitmentLive, setIsRecruitmentLive] = useState(() => {
    return localStorage.getItem("SDC_RECRUITMENT_STATUS") === "LIVE";
  });

  const toggleRecruitment = () => {
    const newStatus = !isRecruitmentLive;
    setIsRecruitmentLive(newStatus);
    localStorage.setItem("SDC_RECRUITMENT_STATUS", newStatus ? "LIVE" : "OFFLINE");
    window.dispatchEvent(new Event("storage"));
  };

  // Recruitment Data
  const applicants = [
    { id: "001", name: "Rahul Singh", email: "rahul@gmail.com", phone: "9876543210", class: "B.Tech 3rd", status: "Interested" },
    { id: "002", name: "Ishita Roy", email: "ishita@sdc.com", phone: "8877665544", class: "B.Tech 2nd", status: "Interested" },
  ];

  const downloadCSV = () => {
    const headers = "ID,Name,Email,Phone,Class,Interest\n";
    const rows = applicants.map(app => `${app.id},${app.name},${app.email},${app.phone},${app.class},${app.status}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SDC_Recruitment_List.csv`;
    a.click();
  };

  const STATS = [
    { label: "Total_Users", value: "42" },
    { label: "Projects_Pending", value: "14" },
    { label: "Live_Projects", value: "08" },
    { label: "Active_Teams", value: "05" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#020203] text-zinc-300 font-sans selection:bg-sky-500/30 text-[11px]">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-sky-500/10 bg-black flex flex-col z-50 shrink-0 relative">
        <div className="absolute top-0 right-0 w-px h-full bg-linear-to-b from-sky-500 via-sky-500/20 to-transparent shadow-[0_0_15px_#0ea5e988]" />
        <div className="p-6 border-b border-white/5 flex justify-center">
          <img src={SdcLogo} alt="SDC" className="w-40 h-auto brightness-125" />
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          <SidebarLink icon={LayoutDashboard} label="Overview" active={activeView === 'overview'} onClick={() => setActiveView('overview')} />
          <SidebarLink icon={Globe} label="Recruitment_List" active={activeView === 'recruitment'} onClick={() => setActiveView('recruitment')} />
          <div className="h-px bg-white/5 my-6 mx-4" />
          <SidebarLink icon={UserPlus} label="Add_Member" active={activeView === 'registry'} onClick={() => setActiveView('registry')} />
          <SidebarLink icon={UserCheck} label="All_Members" active={activeView === 'members'} onClick={() => setActiveView('members')} />
          <SidebarLink icon={Layers} label="All_Teams" active={activeView === 'teams'} onClick={() => setActiveView('teams')} />
          <SidebarLink icon={Briefcase} label="Projects" active={activeView === 'projects'} onClick={() => setActiveView('projects')} />
          <div className="h-px bg-white/5 my-6 mx-4" />
          <SidebarLink icon={Settings} label="Settings" active={activeView === 'config'} onClick={() => setActiveView('config')} />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 font-black uppercase text-zinc-600 hover:text-sky-400 transition-all group">
            <LogOut size={18} /> System_Exit
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#020203] relative">
        {/* HEADER */}
        <header className="h-20 w-full border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 bg-zinc-950 border border-white/5 px-4 py-2 rounded-sm text-[10px]">
              <Search size={14} className="text-zinc-600" />
              <input type="text" placeholder="SEARCH_NODE..." className="bg-transparent outline-none w-48 text-white placeholder:text-zinc-800" />
            </div>
            
            <button 
              onClick={toggleRecruitment}
              className={`flex items-center gap-2 px-4 py-2 border font-black uppercase transition-all rounded-sm text-[9px] ${
                isRecruitmentLive 
                ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/5" 
                : "border-white/10 text-zinc-500 hover:border-sky-500/50"
              }`}
            >
              <Radio size={14} className={isRecruitmentLive ? "animate-pulse" : ""} />
              {isRecruitmentLive ? "Recruitment: LIVE" : "Recruitment: OFF"}
            </button>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="font-black uppercase text-white tracking-widest leading-none">{adminName}</p>
              <p className="text-[9px] font-black text-sky-500 uppercase mt-2 italic tracking-widest">Root_Operator</p>
            </div>
            <div className="w-10 h-10 border border-sky-500/40 p-0.5 rotate-45 bg-zinc-900 flex items-center justify-center text-sky-400 font-black shadow-[0_0_15px_rgba(14,165,233,0.2)]">
              <span className="-rotate-45">{adminName.substring(0,2).toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* VIEWPORT */}
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar relative z-10">
          
          {activeView === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                {STATS.map((stat, i) => (
                  <div key={i} className="bg-zinc-900/40 border border-white/5 border-l-2 border-l-sky-500 p-6 shadow-xl relative overflow-hidden group hover:bg-zinc-900/60 transition-all" style={{ clipPath: 'polygon(0 0, 96% 0, 100% 20%, 100% 100%, 0 100%)' }}>
                    <p className="font-black text-zinc-500 uppercase tracking-widest mb-4 text-[9px] opacity-70">{stat.label}</p>
                    <h3 className="text-3xl font-black italic text-white group-hover:text-sky-400 transition-colors">{stat.value}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'recruitment' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Aspirant_Registry</h2>
                <button 
                  onClick={downloadCSV}
                  className="flex items-center gap-2 bg-white text-black px-5 py-2 font-black uppercase hover:bg-sky-500 transition-all rounded-sm text-[10px]"
                >
                  <Download size={14} /> Export_Data.csv
                </button>
              </div>

              <div className="bg-zinc-950/50 border border-white/5 rounded-sm overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 font-black uppercase text-zinc-500 tracking-widest border-b border-white/10 text-[9px]">
                      <th className="p-5">ID</th>
                      <th className="p-5">Name_Identity</th>
                      <th className="p-5">Email_Link</th>
                      <th className="p-5">Class</th>
                      <th className="p-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold text-[10px]">
                    {applicants.map((app) => (
                      <tr key={app.id} className="border-b border-white/5 hover:bg-sky-500/5 transition-colors group">
                        <td className="p-5 text-zinc-600">#{app.id}</td>
                        <td className="p-5 text-white flex items-center gap-3 font-black uppercase"><User size={12} className="text-sky-500" /> {app.name}</td>
                        <td className="p-5 text-zinc-400 font-mono">{app.email}</td>
                        <td className="p-5 text-zinc-500">{app.class}</td>
                        <td className="p-5 text-right text-emerald-500 uppercase italic font-black">
                          <span className="px-2 py-1 bg-emerald-500/5 border border-emerald-500/20">{app.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'registry' && <RecruitmentForm onClose={() => setActiveView('overview')} />}
          {activeView === 'members' && <SDC_User onAddTeam={() => setActiveView('forge')} />}
          {activeView === 'forge' && <CreateTeam />}
          {activeView === 'teams' && <SDC_Team />}
          {activeView === 'projects' && <SDC_Project />}
          {activeView === 'config' && <AdminSettings />}
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
      {active && <div className="absolute inset-0 bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.3)] -skew-x-12 z-0" />}
      <Icon size={18} className="relative z-10" /> <span className="relative z-10">{label}</span>
    </button>
  );
}