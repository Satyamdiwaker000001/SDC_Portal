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
    name: 'NEBULA STRIKE',
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
    name: 'CYBER SENTINELS',
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
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20 text-carbon-black-DEFAULT text-left font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-grey-200/50 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center border-2 border-emerald-200 shadow-sm">
              <Users className="text-emerald-600" size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-carbon-black-DEFAULT tracking-tight uppercase leading-none">Active Battalions</h2>
               <p className="text-[10px] text-slate-grey-500 font-bold tracking-widest uppercase mt-2">Fleet Management & Deployment Overview</p>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right bg-white border-2 border-slate-grey-200 px-6 py-4 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest mb-1">Total Units</p>
            <p className="text-3xl font-black text-sky-600 leading-none">{teams.length.toString().padStart(2, '0')}</p>
        </div>
      </div>

      {/* TEAM LIST */}
      <div className="space-y-6">
        {teams.map((team) => (
          <div key={team.id} className="crystal-card overflow-hidden">
            <div onClick={() => toggleTeam(team.id)} className="flex flex-col md:flex-row items-center gap-6 p-6 cursor-pointer group relative bg-white hover:bg-sky-50/50 transition-colors">
              <div className={`absolute left-0 top-0 h-full w-2 transition-all ${expandedTeam === team.id ? 'bg-emerald-500' : 'bg-slate-grey-200'}`} />
              
              <div className="flex-1 space-y-2 w-full text-left pl-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-grey-500 bg-slate-grey-100 px-2 py-1 rounded-md">{team.id}</span>
                  <h3 className="text-xl font-black text-carbon-black-DEFAULT tracking-tight uppercase group-hover:text-sky-600 transition-colors">{team.name}</h3>
                </div>
                <div className="flex items-center gap-4 border-t-2 border-slate-grey-100 pt-2 w-max">
                  <div className="flex items-center gap-2"><Target size={14} className="text-slate-grey-400" /><span className="text-xs font-bold uppercase text-slate-grey-600 tracking-wide">{team.project}</span></div>
                  <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /><span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{team.status}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={(e) => handleEditClick(team, e)} className="p-3 bg-white border-2 border-slate-grey-200 rounded-xl text-slate-grey-500 hover:text-sky-600 hover:border-sky-300 transition-all shadow-sm"><Edit3 size={16} /></button>
                <button onClick={(e) => handleDeleteTeam(team.id, e)} className="p-3 bg-white border-2 border-slate-grey-200 rounded-xl text-slate-grey-500 hover:text-red-500 hover:border-red-300 transition-all shadow-sm"><Trash2 size={16} /></button>
                <div className={`p-3 border-2 rounded-xl transition-all shadow-sm ${expandedTeam === team.id ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-grey-100 text-slate-grey-500 border-slate-grey-200 group-hover:text-sky-600 group-hover:bg-sky-50 group-hover:border-sky-200'}`}>
                  {expandedTeam === team.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>

            {/* ROSTER PREVIEW */}
            <AnimatePresence>
              {expandedTeam === team.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t-2 border-slate-grey-200 bg-slate-grey-50 overflow-hidden shadow-inner">
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
                    <div className="lg:col-span-4 space-y-4">
                        <p className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest border-b-2 border-slate-grey-200 pb-2">Commanding Officer</p>
                        <div className="flex items-center gap-4 bg-white border-2 border-emerald-200 p-5 rounded-2xl shadow-sm">
                            <div className="w-14 h-14 rounded-xl border-4 border-emerald-100 flex items-center justify-center bg-emerald-50 overflow-hidden shrink-0">
                                <span className="text-xl font-black text-emerald-600 uppercase">{team.leader.name[0]}</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-carbon-black-DEFAULT uppercase">{team.leader.name}</h4>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">{team.leader.role}</p>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-8 space-y-4">
                        <p className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest border-b-2 border-slate-grey-200 pb-2">Assigned Operatives</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {team.members.map((m, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white border-2 border-slate-grey-200 p-4 rounded-xl shadow-sm hover:border-sky-300 transition-colors">
                                    <div className="w-10 h-10 rounded-lg border-2 border-sky-100 flex items-center justify-center bg-sky-50 shrink-0">
                                        <span className="text-sm font-black text-sky-600 uppercase">{m.name[0]}</span>
                                    </div>
                                    <div>
                                       <p className="text-xs font-bold text-carbon-black-DEFAULT uppercase tracking-tight">{m.name}</p>
                                       <p className="text-[9px] font-bold text-slate-grey-500 uppercase mt-0.5">{m.role}</p>
                                    </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="crystal-card p-10 max-w-4xl w-full relative border-t-4 border-t-sky-400 shadow-2xl">
              <button onClick={() => setEditingTeam(null)} className="absolute top-6 right-6 text-slate-grey-400 hover:text-carbon-black-DEFAULT bg-slate-grey-100 hover:bg-slate-grey-200 p-2 rounded-full transition-all"><X size={20}/></button>
              <h3 className="text-2xl font-black text-carbon-black-DEFAULT uppercase tracking-tight mb-8 flex items-center gap-3 border-b-2 border-slate-grey-200/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center"><Edit3 className="text-sky-600" size={20}/></div>
                Battalion Reconfiguration
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
                {/* 1. Core Info */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-1 rounded inline-block">Core Override</p>
                  <input className="w-full bg-white border-2 border-slate-grey-200 p-4 rounded-xl text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" value={editingTeam.name} onChange={e => setEditingTeam({...editingTeam, name: e.target.value.toUpperCase()})} placeholder="Team Designation" />
                  <input className="w-full bg-white border-2 border-slate-grey-200 p-4 rounded-xl text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" value={editingTeam.project} onChange={e => setEditingTeam({...editingTeam, project: e.target.value.toUpperCase()})} placeholder="Active Project Node" />
                </div>

                {/* 2. Add Operative */}
                <div className="space-y-4 lg:border-l-2 lg:border-slate-grey-100 lg:pl-10">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded inline-block">Deploy New Operative</p>
                  <input className="w-full bg-white border-2 border-slate-grey-200 p-3 rounded-xl text-[11px] font-bold text-carbon-black-DEFAULT outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-grey-400" placeholder="Identity Name" value={newOp.name} onChange={e => setNewOp({...newOp, name: e.target.value})} />
                  <input className="w-full bg-white border-2 border-slate-grey-200 p-3 rounded-xl text-[11px] font-bold text-carbon-black-DEFAULT outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-grey-400" placeholder="Role (e.g. Backend)" value={newOp.role} onChange={e => setNewOp({...newOp, role: e.target.value})} />
                  <input className="w-full bg-white border-2 border-slate-grey-200 p-3 rounded-xl text-[11px] font-bold text-carbon-black-DEFAULT outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-grey-400" placeholder="Personnel ID (SDC-XXXX)" value={newOp.uid} onChange={e => setNewOp({...newOp, uid: e.target.value})} />
                  <button onClick={addOperative} className="w-full py-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"><UserPlus size={16}/> Authorize Recruit</button>
                </div>

                {/* 3. Manage List */}
                <div className="space-y-4 lg:border-l-2 lg:border-slate-grey-100 lg:pl-10">
                   <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded inline-block">Active Operatives</p>
                   <div className="max-h-[220px] overflow-y-auto pr-3 custom-scrollbar space-y-3">
                      {editingTeam.members.map((m) => (
                        <div key={m.uid} className="flex items-center justify-between bg-slate-grey-50 border border-slate-grey-200 p-3 rounded-xl shadow-sm">
                          <div>
                             <p className="text-[11px] font-bold text-carbon-black-DEFAULT uppercase tracking-tight">{m.name}</p>
                             <p className="text-[9px] text-slate-grey-500 font-bold uppercase mt-0.5">{m.role}</p>
                          </div>
                          <button onClick={() => removeMemberFromEdit(m.uid)} className="p-2 text-slate-grey-400 hover:text-red-500 bg-white border border-slate-grey-200 hover:border-red-300 rounded-lg transition-all"><UserMinus size={14} /></button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="flex gap-4 mt-12 pt-6 border-t-2 border-slate-grey-100">
                <button onClick={saveTeamEdit} className="flex-1 py-4 bg-sky-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-md hover:bg-sky-600 transition-all flex items-center justify-center gap-2 gaming-clip-btn"><CheckCircle size={16} /> Commit Changes</button>
                <button onClick={() => setEditingTeam(null)} className="flex-1 py-4 bg-slate-grey-100 text-slate-grey-600 font-bold uppercase tracking-widest text-xs border border-slate-grey-200 rounded-xl hover:bg-slate-grey-200 transition-all">Abort</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};