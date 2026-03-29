/* cspell:disable */
import { Code2, GitBranch, Terminal, Zap, Activity, LogOut } from "lucide-react";
import { useAuth } from "../../context/useAuth";

export default function DeveloperView({ userName }: { userName: string }) {
  const { logout } = useAuth();

  const DEV_STATS = [
    { label: "Active_Tickets", value: "07", icon: <Activity size={20} />, color: "text-red-600" },
    { label: "Code_Pushes", value: "24", icon: <GitBranch size={20} />, color: "text-blue-500" },
    { label: "XP_Level", value: "Lvl 12", icon: <Zap size={20} />, color: "text-green-500" },
    { label: "System_Integrity", value: "Optimal", icon: <Zap size={20} />, color: "text-white" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r-2 border-red-600/20 bg-black flex flex-col p-6 z-50">
        <div className="mb-10 text-red-600 font-black italic text-xl uppercase tracking-tighter">
          <Zap fill="currentColor" size={24} className="inline mr-2" /> DEV_CELL
        </div>
        <nav className="flex-1 space-y-4">
          <button className="w-full text-left p-4 bg-red-600 text-black font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0_white]"
                  style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)' }}>
            <Code2 size={16} className="inline mr-3" /> Workspace
          </button>
          <button className="w-full text-left p-4 text-zinc-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
            <GitBranch size={16} className="inline mr-3" /> Repositories
          </button>
        </nav>
        <div className="mt-auto pt-4 border-t border-zinc-900">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-600 hover:text-white transition-all">
            <LogOut size={18} /> Disconnect
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 p-10 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent">
        <header className="flex justify-between items-center mb-12 border-b border-zinc-900 pb-6 sticky top-0 bg-black/50 backdrop-blur-md z-40">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Operator_Status: <span className="text-red-600">{userName}</span>
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase mt-2 tracking-widest">
              [ Developer_Terminal_V4 ] // System_Mode: ACTIVE
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {DEV_STATS.map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 p-6 border-l-4 border-red-600 group hover:bg-zinc-800/80 transition-all cursor-default" 
                 style={{ clipPath: 'polygon(0 0, 95% 0, 100% 20%, 100% 100%, 0 100%)' }}>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Task Console */}
        <div className="bg-zinc-900/20 border border-zinc-800 p-8">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-black uppercase italic mb-6 flex items-center gap-3">
                <Terminal size={18} className="text-red-600" /> Current_Sprint_Tasks
              </h2>
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest animate-pulse">Live_Sync_Ready</span>
           </div>
           
           <div className="space-y-4">
              <div className="p-4 bg-black border border-zinc-800 flex justify-between items-center group hover:border-red-600 transition-colors cursor-pointer">
                <span className="font-mono text-xs text-zinc-300">Update_Nexus_AI_Compiler_V2</span>
                <span className="text-[9px] bg-red-600 text-black px-2 py-0.5 font-black uppercase tracking-tighter">In_Progress</span>
              </div>
              <div className="p-4 bg-black border border-zinc-800 flex justify-between items-center group hover:border-red-600 transition-colors cursor-pointer">
                <span className="font-mono text-xs text-zinc-300">Bug_Fix: PhishGuard_Handshake_Timeout</span>
                <span className="text-[9px] bg-zinc-800 text-zinc-500 px-2 py-0.5 font-black uppercase tracking-tighter">Pending</span>
              </div>
              <div className="p-4 bg-black border border-zinc-800 flex justify-between items-center group hover:border-red-600 transition-colors cursor-pointer">
                <span className="font-mono text-xs text-zinc-300">Optimization: NestJS_Middleware_Refactor</span>
                <span className="text-[9px] bg-green-950 text-green-500 px-2 py-0.5 font-black uppercase tracking-tighter border border-green-500/20">Review_Requested</span>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}