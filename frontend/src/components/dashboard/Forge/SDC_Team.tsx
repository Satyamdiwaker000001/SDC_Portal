/* cspell:disable */
import { useState } from 'react';
import { 
  Users, ChevronDown, ChevronUp, 
  Target, ShieldCheck, Edit3, Trash2, X, CheckCircle, UserMinus, UserPlus 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface TeamMember {
  name: string;
  role: string;
  avatar: string | null;
  uid: string;
}

interface Team {
  id: string;
  name: string;
  project: string;
  progress: number;
  status: string;
  leader: TeamMember;
  members: TeamMember[];
}

const INITIAL_TEAMS: Team[] = [
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
    ]
  }
];

export const SDC_Team = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  
  // New Operative State
  const [newOp, setNewOp] = useState({ name: '', role: '', uid: '' });

  const toggleTeam = (id: string) => setExpandedTeam(expandedTeam === id ? null : id);

  const handleDeleteTeam = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("CRITICAL: Terminate this entire battalion?")) {
      setTeams(teams.filter(t => t.id !== id));
      if (expandedTeam === id) setExpandedTeam(null);
    }
  };

  const handleEditClick = (team: Team, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTeam(JSON.parse(JSON.stringify(team)));
  };

  // Add Member Logic
  const addOperative = () => {
    if (!editingTeam || !newOp.name || !newOp.uid) return;
    setEditingTeam({
      ...editingTeam,
      members: [...editingTeam.members, { ...newOp, avatar: null }]
    });
    setNewOp({ name: '', role: '', uid: '' });
  };

  const removeMemberFromEdit = (uid: string) => {
    if (!editingTeam) return;
    setEditingTeam({
      ...editingTeam,
      members: editingTeam.members.filter(m => m.uid !== uid)
    });
  };

  const saveTeamEdit = () => {
    if (!editingTeam) return;
    setTeams(teams.map(t => t.id === editingTeam.id ? editingTeam : t));
    setEditingTeam(null);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 pb-20 text-left">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
              <Users className="text-emerald-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Active_Battalions</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase mt-2 ml-1">Fleet Management & Deployment Overview</p>
        </div>
        <div className="text-right">
            <p className="text-[8px] font-black text-zinc-600 uppercase">Total_Units</p>
            <p className="text-lg font-black text-white leading-none">{teams.length}</p>
        </div>
      </div>

      {/* TEAM LIST */}
      <div className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="border border-white/5 bg-zinc-900/20 overflow-hidden transition-all hover:border-emerald-500/30 rounded-sm">
            <div onClick={() => toggleTeam(team.id)} className="flex flex-col md:flex-row items-center gap-6 p-6 cursor-pointer group relative">
              <div className={`absolute left-0 top-0 h-full w-1 transition-all ${expandedTeam === team.id ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-zinc-800'}`} />
              
              <div className="flex-1 space-y-1 w-full text-left">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-emerald-500/50 font-bold">{team.id}</span>
                  <h3 className="text-lg font-black text-white tracking-tighter uppercase group-hover:text-emerald-400 transition-colors">{team.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                  <div className="flex items-center gap-1.5"><Target size={12}/><span className="text-[10px] font-black uppercase tracking-widest">{team.project}</span></div>
                  <div className="flex items-center gap-1.5"><ShieldCheck size={12}/><span className="text-[10px] font-black uppercase text-emerald-500/60">{team.status}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={(e) => handleEditClick(team, e)} className="p-2 bg-zinc-950 border border-white/5 rounded-sm text-zinc-500 hover:text-sky-400 transition-all"><Edit3 size={14} /></button>
                <button onClick={(e) => handleDeleteTeam(team.id, e)} className="p-2 bg-zinc-950 border border-white/5 rounded-sm text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                <div className="p-2 bg-black border border-white/10 rounded-sm text-zinc-500 group-hover:text-emerald-400 transition-all">
                  {expandedTeam === team.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>
            </div>

            {/* ROSTER PREVIEW */}
            <AnimatePresence>
              {expandedTeam === team.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 bg-black/40 overflow-hidden">
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                    <div className="lg:col-span-4 space-y-4">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Commanding_Officer</p>
                        <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm">
                            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-zinc-800 overflow-hidden">
                                <span className="text-xs font-black text-emerald-400">{team.leader.name[0]}</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white uppercase">{team.leader.name}</h4>
                                <p className="text-[9px] font-bold text-emerald-500/80 uppercase">{team.leader.role}</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-8 space-y-4">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Assigned_Operatives</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {team.members.map((m, i) => (
                                <div key={i} className="flex items-center gap-3 bg-zinc-900/50 border border-white/5 p-3 rounded-sm">
                                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-black shrink-0">
                                        <span className="text-[10px] font-black text-zinc-600">{m.name[0]}</span>
                                    </div>
                                    <div><p className="text-[10px] font-bold text-zinc-300 uppercase">{m.name}</p><p className="text-[8px] font-black text-zinc-600 uppercase">{m.role}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* --- EDIT MODAL (RECONFIGURED) --- */}
      <AnimatePresence>
        {editingTeam && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-950 border border-sky-500/30 p-8 max-w-4xl w-full relative rounded-sm shadow-[0_0_50px_rgba(14,165,233,0.1)]">
              <button onClick={() => setEditingTeam(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20}/></button>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                <Edit3 className="text-sky-400" size={22}/> Battalion_Reconfiguration
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                {/* 1. Core Info */}
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-sky-500/60 uppercase tracking-widest">Core_Override</p>
                  <input className="w-full bg-black border border-white/10 p-3 text-[12px] text-white outline-none focus:border-sky-500" value={editingTeam.name} onChange={e => setEditingTeam({...editingTeam, name: e.target.value.toUpperCase()})} placeholder="Team Designation" />
                  <input className="w-full bg-black border border-white/10 p-3 text-[12px] text-white outline-none focus:border-sky-500" value={editingTeam.project} onChange={e => setEditingTeam({...editingTeam, project: e.target.value.toUpperCase()})} placeholder="Active Project Node" />
                </div>

                {/* 2. Add Operative */}
                <div className="space-y-4 border-l border-white/5 pl-8">
                  <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Deploy_New_Operative</p>
                  <input className="w-full bg-black border border-white/10 p-2 text-[11px] text-white outline-none focus:border-emerald-500" placeholder="Identity Name" value={newOp.name} onChange={e => setNewOp({...newOp, name: e.target.value})} />
                  <input className="w-full bg-black border border-white/10 p-2 text-[11px] text-white outline-none focus:border-emerald-500" placeholder="Role (e.g. Backend)" value={newOp.role} onChange={e => setNewOp({...newOp, role: e.target.value})} />
                  <input className="w-full bg-black border border-white/10 p-2 text-[11px] text-white outline-none focus:border-emerald-500" placeholder="Personnel ID (SDC-XXXX)" value={newOp.uid} onChange={e => setNewOp({...newOp, uid: e.target.value})} />
                  <button onClick={addOperative} className="w-full py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-black uppercase text-[10px] hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2"><UserPlus size={14}/> Authorize_Recruit</button>
                </div>

                {/* 3. Manage List */}
                <div className="space-y-4 border-l border-white/5 pl-8">
                   <p className="text-[9px] font-black text-red-500/60 uppercase tracking-widest">Active_Operatives</p>
                   <div className="max-h-[180px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                      {editingTeam.members.map((m) => (
                        <div key={m.uid} className="flex items-center justify-between bg-black border border-white/5 p-2 rounded-sm">
                          <div><p className="text-[10px] font-bold text-zinc-300 uppercase">{m.name}</p><p className="text-[7px] text-zinc-600 font-black uppercase">{m.role}</p></div>
                          <button onClick={() => removeMemberFromEdit(m.uid)} className="p-1 text-zinc-600 hover:text-red-500 transition-all"><UserMinus size={14} /></button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={saveTeamEdit} className="flex-1 py-3 bg-sky-500 text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"><CheckCircle size={14} /> Commit_Changes</button>
                <button onClick={() => setEditingTeam(null)} className="flex-1 py-3 bg-zinc-900 text-zinc-500 font-black uppercase text-[10px] border border-white/5 hover:text-white transition-all">Abort</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};