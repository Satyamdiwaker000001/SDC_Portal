/* cspell:disable */
import { useState } from 'react';
import { 
  Users, ChevronDown, ChevronUp, ExternalLink, 
  Target, ShieldCheck, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const MOCK_TEAMS = [
  {
    id: 'T-9901',
    name: 'NEBULA_STRIKE',
    project: 'PhishGuard_AI',
    progress: 75,
    status: 'ACTIVE',
    leader: { name: 'Satyam Diwaker', role: 'Team Lead', avatar: null, uid: 'SDC-2026-X01' },
    members: [
      { name: 'Aditya Raj', role: 'Backend Dev', avatar: null, uid: 'SDC-2026-A02' },
      { name: 'Ishita Sharma', role: 'UI Designer', avatar: null, uid: 'SDC-2026-I03' },
    ]
  },
  {
    id: 'T-9902',
    name: 'CYBER_SENTINELS',
    project: 'Nexus_VCS',
    progress: 40,
    status: 'OPERATIONAL',
    leader: { name: 'Rahul Verma', role: 'Lead Architect', avatar: null, uid: 'SDC-2026-R04' },
    members: [
      { name: 'Amit Singh', role: 'Security Analyst', avatar: null, uid: 'SDC-2026-S05' },
      { name: 'Priya Das', role: 'Frontend Dev', avatar: null, uid: 'SDC-2026-P06' },
      { name: 'Karan Mehra', role: 'QA Tester', avatar: null, uid: 'SDC-2026-K07' },
    ]
  }
];

export const SDC_Team = () => {
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  const toggleTeam = (id: string) => {
    setExpandedTeam(expandedTeam === id ? null : id);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20">
              <Users className="text-emerald-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Active_Battalions</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase mt-2 ml-1">Fleet Management & Deployment Overview</p>
        </div>
        <div className="flex gap-4">
            <div className="text-right">
                <p className="text-[8px] font-black text-zinc-600 uppercase">Total_Units</p>
                <p className="text-lg font-black text-white leading-none">{MOCK_TEAMS.length}</p>
            </div>
        </div>
      </div>

      {/* TEAM LISTING */}
      <div className="space-y-4">
        {MOCK_TEAMS.map((team) => (
          <div key={team.id} className="border border-white/5 bg-zinc-900/20 overflow-hidden transition-all hover:border-emerald-500/30 rounded-sm">
            
            {/* TEAM HEADER CARD (Clickable) */}
            <div 
              onClick={() => toggleTeam(team.id)}
              className="flex flex-col md:flex-row items-center gap-6 p-6 cursor-pointer group relative"
            >
              <div className={`absolute left-0 top-0 h-full w-1 transition-all ${expandedTeam === team.id ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`} />
              
              <div className="flex-1 space-y-1 w-full">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-emerald-500/50 font-bold tracking-widest">{team.id}</span>
                  <h3 className="text-lg font-black text-white tracking-tighter uppercase group-hover:text-emerald-400 transition-colors">{team.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Target size={12} className="text-zinc-700" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{team.project}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-zinc-700" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">{team.status}</span>
                  </div>
                </div>
              </div>

              {/* PROGRESS SECTION - Fixed Tailwind Suggestion */}
              <div className="w-full md:w-64 space-y-2">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                  <span className="text-zinc-500">Project_Progress</span>
                  <span className="text-emerald-400">{team.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${team.progress}%` }} 
                    className="h-full bg-linear-to-r from-emerald-600 to-emerald-400" 
                  />
                </div>
              </div>

              <div className="p-2 bg-black border border-white/10 rounded-sm group-hover:border-emerald-500/50 transition-all">
                {expandedTeam === team.id ? <ChevronUp size={16} className="text-emerald-400" /> : <ChevronDown size={16} className="text-zinc-500" />}
              </div>
            </div>

            {/* EXPANDABLE ROSTER SECTION */}
            <AnimatePresence>
              {expandedTeam === team.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5 bg-black/40 overflow-hidden"
                >
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-4">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Commanding_Officer</p>
                        <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm">
                            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-zinc-800 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                {team.leader.avatar ? <img src={team.leader.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-xs font-black text-emerald-400">{team.leader.name.charAt(0)}</span>}
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white uppercase">{team.leader.name}</h4>
                                <p className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">{team.leader.role}</p>
                                <p className="text-[7px] font-mono text-zinc-600 mt-1">{team.leader.uid}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Assigned_Operatives</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {team.members.map((member, i) => (
                                <div key={i} className="flex items-center gap-3 bg-zinc-900/50 border border-white/5 p-3 hover:border-white/10 transition-all group/member">
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black overflow-hidden group-hover/member:border-sky-500/50 transition-all">
                                        {member.avatar ? <img src={member.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-[10px] font-black text-zinc-600">{member.name.charAt(0)}</span>}
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-zinc-300 uppercase group-hover/member:text-white transition-colors">{member.name}</h4>
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>

                  <div className="px-8 py-4 bg-zinc-950/50 flex justify-end gap-4 border-t border-white/5">
                      <button className="flex items-center gap-2 text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-all">
                        <Clock size={12} /> View_Timeline
                      </button>
                      <button className="flex items-center gap-2 text-[9px] font-black text-sky-400 hover:text-white uppercase tracking-widest transition-all">
                        <ExternalLink size={12} /> Project_Control_Panel
                      </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

    </div>
  );
};