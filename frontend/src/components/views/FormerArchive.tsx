// cSpell:ignore Dossier Operative Telemetry Roster Archive
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, Search, X, ShieldAlert, 
  Star, ExternalLink, Calendar, Milestone 
} from 'lucide-react';
import { ProfileFrame } from '../shared/ProfileFrame';
import { useStore } from '../../store/useStore';
import type { Member, Project, Team } from '../../types';

interface Props { members: Member[] }

export const FormerArchive = ({ members }: Props) => {
  const { projects, teams } = useStore();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Archive Search Logic
  const filteredArchive = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  // 2. Fetch Past Service Data
  const getServiceData = (memberId: string) => {
    const memberTeams = teams.filter((t: Team) => t.memberIds.includes(memberId));
    const teamIds = memberTeams.map(t => t.id);
    const pastProjects = projects.filter((p: Project) => teamIds.includes(p.teamId));
    return pastProjects;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      
      {/* ARCHIVE HUD HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <History size={16} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Classified_Archives</span>
          </div>
          <h2 className="text-5xl font-black italic text-slate-400 uppercase tracking-tighter leading-none">Retired_Personnel</h2>
        </div>

        {/* SEARCH BAR (Amber Accent for Archive) */}
        <div className="relative w-full xl:max-w-md group -skew-x-12">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-500/50 transition-colors skew-x-12" />
            <input 
                type="text"
                placeholder="SEARCH_ARCHIVE_RECORDS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 p-4 pl-14 text-xs font-black text-slate-400 uppercase tracking-widest outline-none focus:border-amber-500/30 transition-all cursor-none"
            />
        </div>
      </div>

      {/* 3-COLUMN ARCHIVE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArchive.map((m) => (
          <motion.div 
            key={m.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedMember(m)}
            className="group relative bg-slate-900/30 border-t-2 border-slate-800 p-6 transition-all cursor-none hover:bg-slate-900/80 hover:border-amber-500/30 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 duration-500"
          >
            <div className="flex items-center gap-5">
              <ProfileFrame imageUrl={m.image} size="md" status="OFFLINE" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-slate-300 uppercase italic truncate group-hover:text-white transition-colors">
                  {m.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                   <Star size={10} className="text-amber-500/40" />
                   <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest truncate">Term_End: {m.retirementDate}</div>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                 <Milestone size={16} className="text-slate-700" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- RETIRED DOSSIER OVERLAY --- */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-1000 bg-black/98 backdrop-blur-xl flex items-center justify-center p-6 cursor-none"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0a0a0a] border-2 border-slate-800 overflow-hidden"
            >
              {/* Archive Banner */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-500/20 to-transparent" />

              <div className="p-10 border-b border-white/5 flex justify-between items-start">
                 <div className="flex gap-8 items-center">
                    <ProfileFrame imageUrl={selectedMember.image} size="lg" status="OFFLINE" />
                    <div>
                       <h2 className="text-5xl font-black italic text-slate-200 uppercase tracking-tighter">{selectedMember.name}</h2>
                       <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-3 py-1 -skew-x-12 uppercase">
                             <span className="skew-x-12 block">Honorable_Discharge</span>
                          </span>
                          <span className="text-[10px] text-slate-600 font-mono">RETIRED_NODE_{selectedMember.id}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedMember(null)} className="p-2 text-slate-600 hover:text-white transition-all cursor-none"><X size={32}/></button>
              </div>

              <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                 {/* History Stats */}
                 <div className="space-y-8">
                    <div className="p-6 bg-white/1 border border-white/5 -skew-x-2">
                        <div className="skew-x-2 space-y-4">
                            <div className="flex items-center gap-3 text-amber-500/60 font-black text-xs uppercase"><ShieldAlert size={16}/> Service_Memorandum:</div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase italic">
                                Operative has completed the tenure and is currently in the SDC_Archive. 
                                Access to active repositories is revoked. Final Rank: S-Tier Senior Dev.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/2 border border-white/5">
                            <div className="text-[7px] text-slate-600 font-black uppercase mb-1 flex items-center gap-2"><Calendar size={10}/> Commission</div>
                            <div className="text-sm font-black text-slate-300 italic">{selectedMember.joinDate}</div>
                        </div>
                        <div className="p-4 bg-white/2 border border-white/5">
                            <div className="text-[7px] text-slate-600 font-black uppercase mb-1 flex items-center gap-2"><Milestone size={10}/> Retirement</div>
                            <div className="text-sm font-black text-slate-300 italic">{selectedMember.retirementDate}</div>
                        </div>
                    </div>
                 </div>

                 {/* Past Contributions */}
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] italic">Legacy_Projects</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                       {getServiceData(selectedMember.id).map(p => (
                         <div key={p.id} className="p-4 bg-white/1 border-l-2 border-slate-700 flex justify-between items-center opacity-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-tighter">{p.name}</span>
                            <span className="text-[8px] font-black text-slate-600">ARCHIVED</span>
                         </div>
                       ))}
                    </div>
                    <button className="w-full mt-10 py-4 border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all -skew-x-12 cursor-none">
                       <span className="skew-x-12 flex items-center justify-center gap-2">REQUEST_SERVICE_RECORDS <ExternalLink size={14}/></span>
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