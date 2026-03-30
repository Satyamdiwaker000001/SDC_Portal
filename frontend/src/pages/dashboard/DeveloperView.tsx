/* cspell:disable */
import { Code2, GitBranch, Terminal, Zap, Activity, LogOut, Layout, Cpu } from "lucide-react";
import { useAuth } from "../../context/useAuth";

export default function DeveloperView({ userName }: { userName: string }) {
  const { logout } = useAuth();

  const DEV_STATS = [
    { label: "Active_Tickets", value: "07", icon: <Activity size={20} />, color: "text-sky-400" },
    { label: "Code_Pushes", value: "24", icon: <GitBranch size={20} />, color: "text-cyan-400" },
    { label: "XP_Level", value: "Lvl 12", icon: <Zap size={20} />, color: "text-sky-300" },
    { label: "System_Integrity", value: "Optimal", icon: <Cpu size={20} />, color: "text-white" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-zinc-300 font-sans antialiased">
      
      {/* --- SIDEBAR (Neon Border) --- */}
      <aside className="w-64 border-r border-sky-500/20 bg-black flex flex-col p-6 z-50">
        <div className="mb-10 text-sky-500 font-black italic text-xl uppercase tracking-tighter flex items-center gap-2">
          <div className="p-1 bg-sky-500/10 rounded-sm shadow-[0_0_10px_rgba(14,165,233,0.3)]">
            <Zap fill="currentColor" size={20} />
          </div>
          DEV_CELL
        </div>
        
        <nav className="flex-1 space-y-3">
          <button className="w-full text-left p-4 bg-sky-500 text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-[4px_4px_0_rgba(255,255,255,0.9)] hover:shadow-none hover:translate-x-1 transition-all"
                  style={{ clipPath: 'polygon(0 0, 92% 0, 100% 25%, 100% 100%, 8% 100%, 0 75%)' }}>
            <Layout size={16} className="inline mr-3" /> Workspace
          </button>
          <button className="w-full text-left p-4 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-sky-400 hover:bg-sky-500/5 transition-all">
            <Code2 size={16} className="inline mr-3" /> Repositories
          </button>
          <button className="w-full text-left p-4 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-sky-400 hover:bg-sky-500/5 transition-all">
            <Terminal size={16} className="inline mr-3" /> Terminal_Logs
          </button>
        </nav>

        <div className="mt-auto pt-4 border-t border-sky-500/10">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-sky-600 hover:text-white hover:bg-sky-900/20 transition-all border border-transparent hover:border-sky-500/30">
            <LogOut size={18} /> Disconnect_Session
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 p-10 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-sky-900/10 via-transparent to-transparent relative">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 blur-[120px] pointer-events-none" />

        <header className="flex justify-between items-center mb-12 border-b border-sky-500/10 pb-8 sticky top-0 bg-black/60 backdrop-blur-md z-40">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Operator_Status: <span className="text-sky-500 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]">{userName}</span>
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase mt-2 tracking-[0.4em] flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
              [ Secure_Terminal_Established ] // Mode: Tactical_Dev
            </p>
          </div>
        </header>

        {/* Stats Grid (Neon Sky Blue Highlights) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {DEV_STATS.map((stat, i) => (
            <div key={i} className="bg-zinc-900/30 p-6 border-l-2 border-sky-500 group hover:bg-sky-500/5 transition-all cursor-default border border-zinc-800/50" 
                 style={{ clipPath: 'polygon(0 0, 95% 0, 100% 20%, 100% 100%, 0 100%)' }}>
              <div className="flex justify-between items-start mb-3">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <span className="text-sky-500 opacity-50 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
              </div>
              <h3 className={`text-3xl font-black italic tracking-tighter ${stat.color} drop-shadow-[0_0_5px_rgba(14,165,233,0.2)]`}>
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Task Console (Gaming Hub Feel) */}
        <div className="bg-zinc-900/20 border border-sky-500/10 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
               <Terminal size={100} />
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-sm font-black uppercase italic flex items-center gap-3 text-white tracking-widest">
                <Terminal size={18} className="text-sky-500 shadow-sky-500 shadow-sm" /> Current_System_Tasks
              </h2>
              <span className="text-[9px] font-mono text-sky-500/60 uppercase tracking-widest flex items-center gap-2 italic">
                <span className="animate-ping w-1 h-1 bg-sky-500 rounded-full" /> Live_Syncing_Core...
              </span>
            </div>
            
            <div className="space-y-3">
              {[
                { task: "Update_Nexus_AI_Compiler_V2", status: "In_Progress", active: true },
                { task: "Bug_Fix: PhishGuard_Handshake_Timeout", status: "Pending", active: false },
                { task: "Optimization: NestJS_Middleware_Refactor", status: "Review", active: false }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-black/40 border border-zinc-800 flex justify-between items-center group hover:border-sky-500/50 hover:bg-sky-500/5 transition-all cursor-pointer">
                  <span className="font-mono text-[11px] text-zinc-400 group-hover:text-white transition-colors uppercase tracking-tight">
                    {item.task}
                  </span>
                  <span className={`text-[9px] px-3 py-1 font-black uppercase tracking-tighter border ${
                    item.active ? 'bg-sky-500 text-black border-sky-500' : 'bg-zinc-800/50 text-zinc-600 border-zinc-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}