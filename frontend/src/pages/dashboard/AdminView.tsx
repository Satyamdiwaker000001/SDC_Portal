/* cspell:disable */
import { useState } from "react";
import { 
  LayoutDashboard, Users, Terminal, Zap, Search, LogOut, Globe, Layers 
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { RecruitmentForm } from '../../components/dashboard/Forge/RecruitmentForm';

type ViewType = 'overview' | 'registry' | 'teams' | 'config';

export default function AdminView({ userName }: { userName: string }) {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');

  const STATS = [
    { label: "Total_Users", value: "42", icon: <Users size={20} />, color: "text-white" },
    { label: "Projects_Pending", value: "14", icon: <Terminal size={20} />, color: "text-orange-500" },
    { label: "Live_Projects", value: "08", icon: <Globe size={20} />, color: "text-green-500" },
    { label: "Active_Teams", value: "05 / 12", icon: <Layers size={20} />, color: "text-blue-500" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      
      {/* --- SIDEBAR (Orange Accents) --- */}
      <aside className="w-64 border-r-2 border-orange-500/20 bg-black flex flex-col z-50">
        <div className="p-8 border-b-2 border-orange-500/10">
          <div className="flex items-center gap-3 text-orange-500 font-black italic tracking-tighter text-xl uppercase">
            <Zap fill="currentColor" size={24} /> SDC_CORE
          </div>
          <p className="text-[9px] font-bold text-zinc-500 mt-2 tracking-[0.3em]">ADMIN_COMMAND_V4</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveView('overview')}
            className={`w-full flex items-center gap-4 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${
              activeView === 'overview' ? 'bg-orange-500 text-black shadow-[4px_4px_0_white]' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
            }`}
            style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)' }}
          >
            <LayoutDashboard size={18} /> Overview
          </button>

          <button 
            onClick={() => setActiveView('registry')}
            className={`w-full flex items-center gap-4 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${
              activeView === 'registry' ? 'bg-orange-500 text-black shadow-[4px_4px_0_white]' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
            }`}
            style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)' }}
          >
            <Users size={18} /> User_Registry
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-900">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-orange-500 hover:bg-orange-500 hover:text-black transition-all">
            <LogOut size={18} /> System_Exit
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT (Subtle Orange Glow) --- */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent">
        
        <header className="h-20 border-b border-zinc-900 px-10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-lg">
            <Search size={16} className="text-zinc-500" />
            <input type="text" placeholder="Search_Protocols..." className="bg-transparent text-xs font-mono outline-none w-64 text-white" />
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-white tracking-widest">{userName}</p>
              <p className="text-[9px] font-bold text-orange-500 uppercase italic">Head_Admin</p>
            </div>
            <div className="w-10 h-10 border-2 border-orange-500 p-0.5 rotate-45 overflow-hidden">
               <div className="w-full h-full bg-zinc-800 -rotate-45 flex items-center justify-center font-black text-xs">AD</div>
            </div>
          </div>
        </header>

        <div className="p-10 flex-1">
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-zinc-900 border-l-4 border-orange-500 p-6 relative group" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 20%, 100% 100%, 0 100%)' }}>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h3>
                </div>
              ))}
            </div>
          )}

          {activeView === 'registry' && (
            <div className="animate-in fade-in duration-500">
               <RecruitmentForm onClose={() => setActiveView('overview')} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}