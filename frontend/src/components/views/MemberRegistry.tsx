// cSpell:ignore Dossier Operative Telemetry Roster
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Shield, Zap, X, Cpu, 
  Search, Users, ExternalLink 
} from 'lucide-react';
import { ProfileFrame } from '../shared/ProfileFrame';
import { useStore } from '../../store/useStore';
import type { Member, Project, Team } from '../../types';

interface Props { 
  members: Member[]; 
  highlightId: string | null; 
}

export const MemberRegistry = ({ members, highlightId }: Props) => {
  const { projects, teams } = useStore();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Tactical Search Logic
  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.spec.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  // 2. Data Retrieval for Dossier
  const getMemberData = (memberId: string) => {
    const memberTeams = teams.filter((t: Team) => t.memberIds.includes(memberId));
    const teamIds = memberTeams.map(t => t.id);
    const memberProjects = projects.filter((p: Project) => teamIds.includes(p.teamId));
    
    return {
      active: memberProjects.filter(p => p.progress < 100),
      finished: memberProjects.filter(p => p.progress === 100)
    };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      
      {/* HUD HEADER & SEARCH */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Users size={16} className="text-cyan-500/50" />
            <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.5em]">Command_Roster</span>
          </div>
          <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">Operative_Registry</h2>
        </div>

        <div className="relative w-full xl:max-w-md group -skew-x-12">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500 transition-colors skew-x-12" />
            <input 
                type="text"
                placeholder="SEARCH_OPERATIVE_ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 p-4 pl-14 text-xs font-black text-white uppercase tracking-widest outline-none focus:border-cyan-500 transition-all cursor-none"
            />
        </div>
      </div>

      {/* 3-COLUMN TACTICAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((m) => (
          <motion.div 
            key={m.id}
            id={`member-${m.id}`}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedMember(m)}
            className={`group relative bg-slate-900/50 border-t-2 border-white/5 p-6 transition-all cursor-none
              ${highlightId === m.id ? 'border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-cyan-500/5' : 'hover:border-cyan-500/40 hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-5">
              <ProfileFrame imageUrl={m.image} size="md" status={m.status} isHighlighted={highlightId === m.id} />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-white uppercase italic truncate group-hover:text-cyan-400 transition-colors">
                  {m.name}
                </h3>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{m.spec}</div>
              </div>
              <ChevronRightIcon />
            </div>
            
            <div className="absolute bottom-2 right-4 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
               <div className="w-1 h-1 bg-cyan-500" />
               <div className="w-1 h-1 bg-cyan-500/40" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- DOSSIER OVERLAY --- */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-1000 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 cursor-none"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-slate-950 border-2 border-cyan-500/30 overflow-hidden"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-start">
                 <div className="flex gap-8 items-center">
                    <ProfileFrame imageUrl={selectedMember.image} size="lg" status={selectedMember.status} />
                    <div>
                       <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">{selectedMember.name}</h2>
                       <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] font-black text-cyan-500 bg-cyan-500/10 px-3 py-1 -skew-x-12 uppercase">
                             <span className="skew-x-12 block">{selectedMember.spec}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">Node_ID: {selectedMember.id}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedMember(null)} className="p-2 text-slate-500 hover:text-white transition-all cursor-none border border-transparent hover:bg-white/5"><X size={32}/></button>
              </div>

              <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { label: 'VELOCITY', val: '9.82', icon: <Zap size={14}/> },
                         { label: 'STABILITY', val: '94%', icon: <Shield size={14}/> },
                         { label: 'UPTIME', val: '99.9%', icon: <Cpu size={14}/> },
                         { label: 'RANK', val: 'S-TIER', icon: <Target size={14}/> }
                       ].map((s, i) => (
                         <div key={i} className="p-4 bg-white/2 border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">{s.icon} <span className="text-[7px] font-black tracking-widest">{s.label}</span></div>
                            <div className="text-xl font-black italic text-white uppercase">{s.val}</div>
                         </div>
                       ))}
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] italic flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-cyan-500 animate-pulse" /> Active_Deployments
                       </h4>
                       {getMemberData(selectedMember.id).active.map(p => (
                         <div key={p.id} className="p-4 bg-white/1 border border-white/5">
                            <div className="flex justify-between text-[10px] font-black text-white mb-2 uppercase italic tracking-tight"><span>{p.name}</span> <span>{p.progress}%</span></div>
                            <div className="h-0.5 bg-slate-800 w-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" /></div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Mission_History</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                       {getMemberData(selectedMember.id).finished.map(p => (
                         <div key={p.id} className="p-4 bg-white/1 border-l-2 border-emerald-500/40 flex justify-between items-center opacity-60">
                            <span className="text-[10px] font-black text-white uppercase italic">{p.name}</span>
                            <span className="text-[8px] font-black text-emerald-500">SUCCESS</span>
                         </div>
                       ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all -skew-x-12 cursor-none">
                       <span className="skew-x-12 flex items-center justify-center gap-2">EXPORT_FULL_DOSSIER <ExternalLink size={14}/></span>
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ChevronRightIcon = () => (
  <div className="flex flex-col gap-0.5 opacity-20 group-hover:opacity-100 transition-opacity">
    <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-500" />
    <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-500 ml-1" />
  </div>
);