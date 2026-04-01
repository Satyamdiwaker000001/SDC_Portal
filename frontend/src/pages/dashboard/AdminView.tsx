/* cspell:disable */
import { useState, useEffect } from "react";
import {
  LayoutDashboard, LogOut, Layers, Briefcase, Settings, UserCheck,
  Globe, Radio, Megaphone, Send, Menu, User, ShieldCheck, Download, UserPlus
} from "lucide-react"; 
import type { LucideIcon } from "lucide-react"; 
import { useAuth } from "../../context/useAuth";
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTS ---
import { RecruitmentForm } from '../../components/dashboard/Forge/RecruitmentForm';
import { SDC_User } from "../../components/views/SDC_User"; 
import { SDC_Team } from "../../components/dashboard/Forge/SDC_Team";
import { SDC_Project } from "../../components/dashboard/Forge/SDC_Project";
import AdminSettings from "../../components/dashboard/Forge/AdminSettings"; 
import SdcLogo from "../../assets/SDC.png";

type ViewType = 'overview' | 'recruitment' | 'registry' | 'members' | 'teams' | 'projects' | 'config' | 'announce' | 'deadlines';

export default function AdminView({ userName }: { userName: string }) {
  const { logout, user } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isPosting, setIsPosting] = useState(false);

  // --- SETTINGS SYNC ---
  const [adminProfile, setAdminProfile] = useState({
    name: localStorage.getItem("SDC_ADMIN_NAME") || user?.name || userName || "ADMIN",
    avatar: localStorage.getItem("SDC_ADMIN_AVATAR") || ""
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    const syncProfile = () => {
      setAdminProfile({
        name: localStorage.getItem("SDC_ADMIN_NAME") || "ADMIN",
        avatar: localStorage.getItem("SDC_ADMIN_AVATAR") || ""
      });
    };
    window.addEventListener("admin_settings_updated", syncProfile);
    return () => {
      clearInterval(timer);
      window.removeEventListener("admin_settings_updated", syncProfile);
    };
  }, []);

  // --- DATA STATES ---
  const announcements = [
    { id: 1, title: 'Recruitment Open!', body: 'Applications for SDC 2026 batch are now open.', priority: 'Important', date: '01/04/2026' },
  ];
  const [newAnn, setNewAnn] = useState({ title: '', body: '', priority: 'Normal' });

  const teamsData = [{ name: 'Team Alpha', focus: 'Web Dev', mentor: 'Arjun', members: '3' }];
  const projectsData = [{ name: 'Campus Connect', team: 'Team Alpha', deadline: '15/04/2026', progress: 78, status: 'Active' }];
  const applicants = [{ id: "001", name: "Rahul Singh", email: "rahul@gmail.com", status: "Interested", class: "B.Tech 3rd" }];

  // --- LOGIC HANDLERS ---
  const [isRecruitmentLive, setIsRecruitmentLive] = useState(() => localStorage.getItem("SDC_RECRUITMENT_STATUS") === "LIVE");

  const toggleRecruitment = () => {
    const newStatus = !isRecruitmentLive;
    setIsRecruitmentLive(newStatus);
    localStorage.setItem("SDC_RECRUITMENT_STATUS", newStatus ? "LIVE" : "OFFLINE");
    window.dispatchEvent(new Event("storage"));
  };

  const handlePostAnn = () => {
    if(!newAnn.title || !newAnn.body) return;
    alert("Broadcasting Signal...");
    setIsPosting(false);
  };

  const STATS = [
    { label: "Total_Users", value: "42", color: "border-l-sky-500" },
    { label: "Live_Projects", value: "08", color: "border-l-emerald-500" },
    { label: "Active_Teams", value: "05", color: "border-l-yellow-500" },
    { label: "Applicants", value: applicants.length.toString(), color: "border-l-purple-500" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#020203] text-zinc-300 font-sans selection:bg-sky-500/30 text-[11px]">
      
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden" />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-52 border-r border-sky-500/10 bg-black flex flex-col z-60 shrink-0 text-left`}>
        <div className="p-4 border-b border-white/5 flex justify-center">
          <img src={SdcLogo} alt="SDC" className="w-28 h-auto brightness-125" />
        </div>
        <nav className="flex-1 p-2 space-y-0.5 mt-2 overflow-y-auto custom-scrollbar">
          <SidebarLink icon={LayoutDashboard} label="Overview" active={activeView === 'overview'} onClick={() => { setActiveView('overview'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={Globe} label="Recruitment" active={activeView === 'recruitment'} onClick={() => { setActiveView('recruitment'); setIsSidebarOpen(false); }} />
          <div className="h-px bg-white/5 my-2 mx-3" />
          <SidebarLink icon={UserPlus} label="Add Member" active={activeView === 'registry'} onClick={() => { setActiveView('registry'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={UserCheck} label="Members" active={activeView === 'members'} onClick={() => { setActiveView('members'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={Layers} label="Teams" active={activeView === 'teams'} onClick={() => { setActiveView('teams'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={Briefcase} label="Projects" active={activeView === 'projects'} onClick={() => { setActiveView('projects'); setIsSidebarOpen(false); }} />
          <div className="h-px bg-white/5 my-2 mx-3" />
          <SidebarLink icon={Megaphone} label="Announce" active={activeView === 'announce'} onClick={() => { setActiveView('announce'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={Settings} label="Settings" active={activeView === 'config'} onClick={() => { setActiveView('config'); setIsSidebarOpen(false); }} />
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 font-black uppercase text-zinc-600 hover:text-red-500 transition-all group text-left"><LogOut size={16} /> <span className="text-[9px]">Exit</span></button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#020203] relative text-left w-full">
        <header className="h-14 w-full border-b border-white/5 px-4 lg:px-8 flex items-center justify-between bg-black/60 backdrop-blur-md z-40 sticky top-0">
          <div className="flex items-center gap-4 text-left">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-sky-500 rounded-sm hover:bg-sky-500/10"><Menu size={20} /></button>
            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4 text-left">
              <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /><span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">SEC: <span className="text-emerald-500">ACTIVE</span></span></div>
            </div>
            <button onClick={toggleRecruitment} className={`flex items-center gap-2 px-3 py-1 border font-black uppercase transition-all rounded-sm text-[8px] ${isRecruitmentLive ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/5" : "border-white/10 text-zinc-600"}`}>
              <Radio size={10} className={isRecruitmentLive ? "animate-pulse" : ""} /> {isRecruitmentLive ? "LIVE_UPLINK" : "UPLINK_OFF"}
            </button>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden sm:flex flex-col items-end pr-4 border-r border-white/10 text-right">
              <span className="text-[10px] font-mono font-black text-white tracking-widest">{currentTime}</span>
              <span className="text-[7px] text-zinc-600 uppercase font-black tracking-widest">System_Clock</span>
            </div>
            
            <div className="flex items-center gap-3 text-right">
              <div className="text-right flex flex-col justify-center">
                {/* --- HEADER FIX: White Text = ADMIN | Blue Text = OPERATOR_ROOT --- */}
                <p className="font-black uppercase text-white leading-none tracking-widest text-[11px] mb-1">{adminProfile.name}</p>
                <p className="text-[8px] font-black text-sky-500 uppercase italic tracking-widest opacity-100 leading-none">OPERATOR_ROOT</p>
              </div>
              <div className="w-9 h-9 border-2 border-sky-500/40 p-0.5 rotate-45 bg-zinc-900 flex items-center justify-center text-sky-400 font-black overflow-hidden shadow-[0_0_15px_rgba(14,165,233,0.3)] shrink-0">
                {adminProfile.avatar ? (
                  <img src={adminProfile.avatar} alt="AD" className="-rotate-45 w-[140%] h-[140%] object-cover" />
                ) : (
                  <span className="-rotate-45 text-[10px]">{adminProfile.name.substring(0,2).toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 flex-1 overflow-y-auto custom-scrollbar relative z-10 text-left">
          {activeView === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500 text-left">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                  <div key={i} className={`bg-zinc-900/40 border border-white/5 border-l-2 ${stat.color} p-5 shadow-lg relative`}>
                    <p className="font-black text-zinc-500 uppercase tracking-widest mb-3 text-[9px] opacity-70 text-left">{stat.label}</p>
                    <h3 className="text-2xl font-black italic text-white text-left">{stat.value}</h3>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-950/40 border border-white/5 p-5 rounded-sm">
                  <p className="text-[9px] font-black text-yellow-500 mb-4 uppercase border-b border-white/5 pb-2 flex justify-between items-center text-left">Teams Snapshot <button onClick={() => setActiveView('teams')} className="text-[7px] text-zinc-600 hover:text-white transition-colors">MANAGE</button></p>
                  {teamsData.map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white/2 border-l border-yellow-500/30 mb-2 last:mb-0">
                      <div className="text-left"><p className="text-zinc-200 font-black uppercase text-[10px] text-left">{t.name}</p><p className="text-zinc-600 text-[8px] text-left">Focus: {t.focus}</p></div>
                      <span className="text-yellow-500 text-[8px] font-black">{t.members} MBRS</span>
                    </div>
                  ))}
                </div>
                <div className="bg-zinc-950/40 border border-white/5 p-5 rounded-sm text-left">
                  <p className="text-[9px] font-black text-emerald-500 mb-4 uppercase border-b border-white/5 pb-2 flex justify-between items-center text-left">Mission Progress <button onClick={() => setActiveView('projects')} className="text-[7px] text-zinc-600 hover:text-white transition-colors">VIEW ALL</button></p>
                  {projectsData.map((p, idx) => (
                    <div key={idx} className="p-3 bg-white/2 border-l border-emerald-500/30 mb-2 last:mb-0 text-left">
                      <div className="flex justify-between items-center mb-1 text-left"><p className="text-zinc-200 font-black uppercase text-[10px] text-left">{p.name}</p><span className="text-emerald-500 font-black text-[9px] text-right">{p.progress}%</span></div>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" style={{ width: `${p.progress}%` }}></div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'recruitment' && (
            <div className="space-y-6 animate-in fade-in duration-500 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 text-left">
                <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter text-left">Aspirant_Registry</h2>
                <button className="flex items-center gap-2 bg-white text-black px-4 py-1.5 font-black uppercase rounded-sm text-[9px] hover:bg-sky-500 transition-colors"><Download size={12} /> Export_Data</button>
              </div>
              <div className="bg-zinc-950 border border-white/5 rounded-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-125">
                  <thead>
                    <tr className="bg-white/5 font-black uppercase text-zinc-500 text-[9px] border-b border-white/10 text-left">
                      <th className="p-4">Ident/Name</th><th className="p-4">Contact</th><th className="p-4">Class</th><th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map(app => (
                      <tr key={app.id} className="border-b border-white/5 hover:bg-sky-500/5 transition-colors text-left text-zinc-300">
                        <td className="p-4 text-white uppercase font-black tracking-tight text-left"><User size={12} className="inline mr-2 text-sky-500" /> {app.name}</td>
                        <td className="p-4 text-zinc-400 font-mono text-left">{app.email}</td>
                        <td className="p-4 text-zinc-500 text-left">{app.class}</td>
                        <td className="p-4 text-right text-emerald-500 italic font-black uppercase">{app.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'registry' && <RecruitmentForm onClose={() => setActiveView('overview')} />}
          {activeView === 'members' && <SDC_User onAddTeam={() => setActiveView('teams')} />}
          {activeView === 'teams' && <SDC_Team />}
          {activeView === 'projects' && <SDC_Project />}
          {activeView === 'config' && <AdminSettings />}

          {activeView === 'announce' && (
            <div className="space-y-6 animate-in fade-in duration-500 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 text-left">
                <h2 className="text-2xl lg:text-3xl font-black italic text-white uppercase tracking-tighter text-left">Broadcasting</h2>
                <button onClick={() => setIsPosting(!isPosting)} className="px-4 py-2 bg-sky-500 text-black font-black uppercase rounded-sm text-[9px] font-bold">{isPosting ? 'Abort' : 'Post_New'}</button>
              </div>
              <AnimatePresence>
                {isPosting && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-zinc-900/60 border border-sky-500/30 p-6 space-y-4 mb-8 text-left text-zinc-300">
                    <input value={newAnn.title} onChange={e => setNewAnn({...newAnn, title: e.target.value})} placeholder="SIGNAL_TITLE..." className="w-full bg-black border border-white/10 p-3 text-[10px] text-white outline-none focus:border-sky-500" />
                    <textarea value={newAnn.body} onChange={e => setNewAnn({...newAnn, body: e.target.value})} placeholder="MESSAGE..." className="w-full bg-black border border-white/10 p-3 h-24 text-[10px] text-white outline-none focus:border-sky-500 resize-none" />
                    <button onClick={handlePostAnn} className="w-full py-3 bg-white text-black font-black uppercase flex items-center justify-center gap-2 text-[10px] transition-colors hover:bg-sky-400"><Send size={14}/> Transmit</button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="grid grid-cols-1 gap-4 pb-10 text-left">
                {announcements.map(ann => (
                  <div key={ann.id} className="bg-zinc-900/40 border border-white/5 p-5 text-left group hover:border-sky-500/30 transition-all text-zinc-300">
                    <div className="flex justify-between items-center mb-3 text-left">
                      <div className="flex items-center gap-4 text-left"><span className={`px-2 py-0.5 text-[8px] font-black uppercase border ${ann.priority === 'Urgent' ? 'border-red-500 text-red-500' : 'border-sky-500 text-sky-500'}`}>{ann.priority}</span><h3 className="text-lg font-black text-white uppercase italic text-left">{ann.title}</h3></div>
                      <span className="text-zinc-600 font-mono text-[9px] text-right">{ann.date}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed border-l border-white/10 pl-5 italic text-left">"{ann.body}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active, onClick }: { icon: LucideIcon, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full group relative flex items-center gap-3 px-3 py-2 font-black uppercase tracking-widest transition-all duration-300 ${active ? 'text-white' : 'text-zinc-500 hover:text-sky-400'}`}>
      {active && <div className="absolute inset-0 bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.3)] -skew-x-12 z-0 text-left" />}
      <Icon size={16} className="relative z-10 text-left" /> <span className="relative z-10 text-[9px] text-left">{label}</span>
    </button>
  );
}