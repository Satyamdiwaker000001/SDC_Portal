// cSpell:ignore Satyam Diwaker Vedant Sharma Rahul Telemetry Logs SCANLINE
import { useState, useMemo, useEffect } from "react";
import { useStore } from "../store/useStore";
import {
  LayoutGrid, Hammer, Radio, LogOut, Users, Archive, 
  BarChart3, Plus, Target, ChevronRight, Layout, Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { CrosshairCursor } from "../components/shared/CrosshairCursor";
import { BackgroundEngine } from "../components/shared/BackgroundEngine";
import { RecruitmentForm } from "../components/dashboard/Forge/RecruitmentForm";
import { ProfileFrame } from "../components/shared/ProfileFrame";
import { GlobalOverview } from "../components/views/GlobalOverview";
import { MemberRegistry } from "../components/views/MemberRegistry";
import { FormerArchive } from "../components/views/FormerArchive";
import { TeamsView } from "../components/views/TeamsView";
import { ProjectsView } from "../components/views/ProjectsView";
import { TeamCreator } from "../components/views/TeamCreator";

// Assets
import type { Member, Team, Project } from "../types";
import Logo from "../assets/logo2.png";

// --- LOCAL AUDIO IMPORTS (From src/sounds/) ---
import clickSfx from "../sounds/click.mp3"; 
import typeSfx from "../sounds/typing.mp3";

const INITIAL_MEMBERS: Member[] = [
  { id: "OP-01", name: "Alpha_Lead", email: "alpha@sdc.portal", spec: "SYSTEM_ARCHITECT", joinDate: "2023-01-01", retirementDate: "2028-12-31", status: "ONLINE", image: "https://i.pravatar.cc/150?u=alpha" },
  { id: "OP-02", name: "Bravo_Sec", email: "bravo@sdc.portal", spec: "SEC_SPECIALIST", joinDate: "2024-02-15", retirementDate: "2027-06-30", status: "ONLINE", image: "https://i.pravatar.cc/150?u=bravo" },
  { id: "OP-03", name: "Charlie_Dev", email: "charlie@sdc.portal", spec: "CORE_DEV", joinDate: "2022-01-01", retirementDate: "2024-12-31", status: "OFFLINE", image: "https://i.pravatar.cc/150?u=charlie" },
];

export default function Dashboard() {
  const { setUser, isInterviewLive, toggleInterview, user, teams, projects } = useStore();

  type Tab = "MONITOR" | "MEMBERS" | "ARCHIVE" | "TEAMS" | "PROJECTS";
  const [activeTab, setActiveTab] = useState<Tab>("MONITOR");
  const [showForge, setShowForge] = useState(false);
  const [showTeamCreator, setShowTeamCreator] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // --- AUDIO LOGIC ---
  const playClick = () => {
    const audio = new Audio(clickSfx);
    audio.volume = 0.3;
    audio.play().catch(() => {}); 
  };

  const playType = () => {
    const audio = new Audio(typeSfx);
    audio.volume = 0.15;
    audio.play().catch(() => {});
  };

  // Typing sound listener for inputs and global feel
  useEffect(() => {
    const handleKeyDown = () => playType();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const stats = useMemo(() => {
    const today = new Date();
    const activeMembers = INITIAL_MEMBERS.filter((m) => new Date(m.retirementDate) > today);
    const assignedIds = new Set(teams.flatMap((t: Team) => t.memberIds));
    const busyOps = activeMembers.filter((m) => assignedIds.has(m.id)).length;
    return {
      total: activeMembers.length, busy: busyOps, free: activeMembers.length - busyOps,
      archive: INITIAL_MEMBERS.length - activeMembers.length,
    };
  }, [teams]);

  // Wrapper for all tactical actions
  const handleAction = (callback: () => void) => {
    playClick();
    callback();
  };

  return (
    <div className="relative h-screen w-full bg-[#020617] text-slate-200 flex flex-col overflow-hidden font-sans">
      <CrosshairCursor />
      <BackgroundEngine />

      <div className="absolute inset-0 pointer-events-none z-100 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />

      <header className="h-28 px-10 flex items-center justify-between z-50 border-b-2 border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-10">
          {/* LOGO HUD: SDC Branding */}
          <div className="cursor-none flex flex-col items-center" onClick={() => handleAction(() => setActiveTab("MONITOR"))}>
            <div className="w-72 h-16 relative flex items-center justify-center">
              <div className="absolute inset-0 z-10 pointer-events-none bg-linear-to-b from-transparent via-cyan-500/5 to-transparent animate-scan" />
              <img src={Logo} alt="SDC" className="w-full h-full object-contain scale-110" />
            </div>
          </div>

          {/* TELEMETRY HUD: Real-time Stats */}
          <div className="hidden lg:flex items-center gap-6 pl-10 border-l border-white/10 h-16">
            <div className="flex flex-col"><span className="text-[7px] font-black text-slate-500 uppercase italic">Units</span><span className="text-xs font-black text-cyan-400">0{stats.total}</span></div>
            <div className="flex flex-col"><span className="text-[7px] font-black text-slate-500 uppercase italic">Deployed</span><span className="text-xs font-black text-emerald-500">0{stats.busy}</span></div>
            <div className="flex flex-col"><span className="text-[7px] font-black text-slate-500 uppercase italic">Bench</span><span className="text-xs font-black text-amber-500">0{stats.free}</span></div>
          </div>
        </div>

        {/* PROFILE HUD */}
        <div className="flex items-center gap-6 h-10">
          <div className="text-right hidden md:block">
            <div className="flex items-center justify-end gap-2 mb-0.5">
               <Activity size={10} className="text-cyan-500 animate-pulse" />
               <div className="text-[10px] font-black text-white italic tracking-widest uppercase">{user?.name || "DEMO_OPERATIVE"}</div>
            </div>
            <div className="text-[7px] font-black text-cyan-500/60 text-right uppercase italic tracking-widest">{user?.role || "ACCESS_LEVEL_01"}</div>
          </div>
          <ProfileFrame imageUrl={user?.image || "https://i.pravatar.cc/150?u=alpha"} size="md" status="ONLINE" onClick={() => playClick()} />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden xl:block w-16 border-r border-white/5 bg-slate-950/20" />

        <main className="flex-1 p-10 z-10 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <div className="max-w-7xl mx-auto">
              {activeTab === "MONITOR" && <GlobalOverview key="mon" activeCount={stats.total} archiveCount={stats.archive} />}
              {activeTab === "MEMBERS" && (
                <MemberRegistry 
                  key="mem" 
                  members={INITIAL_MEMBERS.filter(m => new Date(m.retirementDate) > new Date())} 
                  highlightId={highlightId} 
                />
              )}
              {activeTab === "ARCHIVE" && <FormerArchive key="arc" members={INITIAL_MEMBERS.filter(m => new Date(m.retirementDate) <= new Date())} />}
              {activeTab === "TEAMS" && <TeamsView key="teams" onJump={(id) => handleAction(() => { setActiveTab("MEMBERS"); setHighlightId(id); })} />}
              {activeTab === "PROJECTS" && <ProjectsView key="projects" onJump={(id) => handleAction(() => { setActiveTab("MEMBERS"); setHighlightId(id); })} />}
            </div>
          </AnimatePresence>
        </main>

        {/* RIGHT SIDE: Dynamic Project Matrix */}
        <aside className="hidden 2xl:flex w-80 border-l border-white/5 bg-slate-950/40 backdrop-blur-md flex-col p-6 z-40 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-cyan-500">
              <Target size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live_Matrix</span>
            </div>
            <BarChart3 size={14} className="text-slate-600" />
          </div>

          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project: Project) => (
                <div key={project.id} onClick={() => handleAction(() => setActiveTab("TEAMS"))} className="p-4 bg-white/2 border border-white/5 -skew-x-6 hover:bg-cyan-500/5 hover:border-cyan-500/40 transition-all cursor-none group">
                  <div className="skew-x-6 text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-white uppercase italic group-hover:text-cyan-400">{project.name}</span>
                      <ChevronRight size={12} className="text-slate-800 group-hover:text-cyan-500" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-slate-900 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} className="h-full bg-cyan-500 shadow-glow" /></div>
                      <span className="text-[9px] font-mono font-black text-cyan-400">{project.progress}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-white/5 opacity-20">
                <Layout size={24} className="mx-auto text-slate-500 mb-2" />
                <p className="text-[8px] font-black text-slate-600 uppercase italic">No_Active_Nodes</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* TACTICAL BOTTOM DOCK */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 flex items-center gap-4 p-2 bg-slate-950/90 border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {[
          { icon: <LayoutGrid size={22} />, id: "MONITOR" as const, label: "Monitor" },
          { icon: <Users size={22} />, id: "MEMBERS" as const, label: "Personnel" },
          { icon: <Archive size={22} />, id: "ARCHIVE" as const, label: "Archives" },
          ...(user?.role === "ADMIN" ? [
            { icon: <Users size={22} />, id: "TEAMS" as const, label: "Squads" },
            { icon: <BarChart3 size={22} />, id: "PROJECTS" as const, label: "Matrix" },
            { icon: <Plus size={22} />, id: "CREATE_TEAM" as const, label: "Assign" },
          ] : []),
          { icon: <Hammer size={22} />, id: "FORGE" as const, label: "Forge" },
          { icon: <Radio size={22} />, id: "INTERVIEW" as const, label: "Recruit" },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleAction(() => {
              const tabIds = ["MONITOR", "MEMBERS", "ARCHIVE", "TEAMS", "PROJECTS"] as const;
              if (tabIds.some((id) => id === btn.id)) setActiveTab(btn.id as Tab);
              if (btn.id === "CREATE_TEAM") setShowTeamCreator(true);
              if (btn.id === "FORGE") setShowForge(true);
              if (btn.id === "INTERVIEW") toggleInterview();
            })}
            className={`p-4 transition-all cursor-none border-2 group relative ${activeTab === btn.id || (btn.id === "FORGE" && showForge) || (btn.id === "INTERVIEW" && isInterviewLive) ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]" : "border-white/5 text-slate-500 hover:text-cyan-400"}`}
          >
            {btn.icon}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-cyan-500 text-black text-[7px] font-black uppercase opacity-0 group-hover:opacity-100 pointer-events-none italic transition-opacity tracking-widest whitespace-nowrap">{btn.label}</span>
          </button>
        ))}
        <div className="w-px h-8 bg-white/10 mx-1" />
        <button onClick={() => handleAction(() => setUser(null))} className="p-4 text-slate-500 hover:text-red-500 border-2 border-white/5 transition-all cursor-none hover:border-red-500/20">
          <LogOut size={22} />
        </button>
      </div>

      <AnimatePresence>
        {showForge && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-110 bg-black/95 backdrop-blur-md flex items-center justify-center p-10 cursor-none">
            <RecruitmentForm onClose={() => { playClick(); setShowForge(false); }} />
          </motion.div>
        )}
        {showTeamCreator && user?.role === "ADMIN" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-110 bg-black/95 backdrop-blur-md flex items-center justify-center p-10 cursor-none">
            <TeamCreator onClose={() => { playClick(); setShowTeamCreator(false); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}