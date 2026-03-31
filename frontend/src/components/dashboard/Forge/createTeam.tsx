/* cspell:disable */
import { useState, useRef } from 'react';
import { 
  Cpu, Trash2, Info, CheckCircle2, Search, UserPlus, Zap, UploadCloud, FileJson, X, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CreateTeam = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');
  const [teamName, setTeamName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [leaderId, setLeaderId] = useState<string | null>(null); // New state for Team Leader
  const [manualMembers, setManualMembers] = useState([{ userId: '', role: '' }]);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectName = projectId.length > 3 ? "ALPHA_NET_SECURITY" : "";

  const addMemberField = () => {
    if (manualMembers.length < 4) {
      setManualMembers([...manualMembers, { userId: '', role: '' }]);
    }
  };

  const removeMemberField = (index: number) => {
    if (manualMembers.length > 1) {
      const memberToRemove = manualMembers[index].userId;
      if (leaderId === memberToRemove) setLeaderId(null); // Reset leader if removed
      setManualMembers(manualMembers.filter((_, i) => i !== index));
    }
  };

  const updateMemberData = (index: number, field: 'userId' | 'role', value: string) => {
    const updated = [...manualMembers];
    updated[index][field] = value;
    setManualMembers(updated);
  };

  // Appoint/Toggle Leader
  const toggleLeader = (uId: string) => {
    if (!uId) return;
    setLeaderId(prev => prev === uId ? null : uId);
  };

  const isManualDisabled = !teamName || !projectId || manualMembers.some(m => !m.userId) || !leaderId;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/20">
            <Cpu className="text-sky-400" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic leading-none">Team_Forge_Protocol</h2>
            <p className="text-[8px] text-zinc-500 font-bold tracking-[0.3em] uppercase mt-1">Status: Initializing_Assembly</p>
          </div>
        </div>

        <div className="flex bg-black p-1 border border-white/10 rounded-sm shadow-2xl">
          <button onClick={() => setActiveTab('manual')} className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>MANUAL_ASSEMBLY</button>
          <button onClick={() => setActiveTab('bulk')} className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'bulk' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>BULK_INJECTION</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'manual' ? (
          <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <div className="bg-zinc-900/50 border border-white/5 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-sky-500 shadow-[0_0_10px_#0ea5e9]" />
              <div className="flex items-start gap-3">
                <Info className="text-sky-400 shrink-0 mt-0.5" size={16} />
                <p className="text-[9px] text-zinc-500 font-medium leading-relaxed uppercase tracking-tight">
                  Action Required: Designate one member as **Team Leader** by clicking the star icon. Valid squad size: 2-4.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* CONFIG LEFT */}
              <div className="lg:col-span-4 space-y-4 bg-zinc-900/20 p-5 border border-white/5 rounded-sm">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-400 uppercase tracking-widest ml-1">Squad_Designation</label>
                  <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="ENTER_NAME" className="w-full bg-black border border-white/10 py-3 px-4 text-xs font-bold text-white outline-none focus:border-sky-500/50 transition-all placeholder:text-zinc-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-sky-400 uppercase tracking-widest ml-1">Linked_Project_ID</label>
                  <div className="relative group">
                    <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="PROJ_UUID" className="w-full bg-black border border-white/10 py-3 px-4 text-xs font-bold text-white outline-none focus:border-sky-500/50 transition-all placeholder:text-zinc-800" />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-sky-400 transition-colors" size={14} />
                  </div>
                  {projectName && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-emerald-500/5 border border-emerald-500/20">
                      <Zap size={10} className="text-emerald-400 fill-emerald-400" />
                      <span className="text-[8px] font-black text-emerald-400 uppercase italic tracking-tighter">Linked: {projectName}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* ROSTER RIGHT */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-black/40 border border-white/5 p-5 space-y-4 rounded-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Operative_Roster ({manualMembers.length}/4)</span>
                    <button onClick={addMemberField} disabled={manualMembers.length >= 4} className="flex items-center gap-2 px-4 py-2 bg-white text-black text-[9px] font-black hover:bg-sky-400 transition-all disabled:opacity-20 uppercase shadow-lg">
                      <UserPlus size={12} /> Add_Member
                    </button>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {manualMembers.map((member, index) => (
                        <motion.div 
                          key={index} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                          className={`flex gap-3 items-center p-3 border transition-all ${leaderId === member.userId && member.userId !== '' ? 'bg-sky-500/5 border-sky-500/50' : 'bg-zinc-950 border-white/5'}`}
                        >
                          {/* LEADER APPOINTMENT BUTTON */}
                          <button 
                            onClick={() => toggleLeader(member.userId)}
                            className={`p-2 transition-colors ${leaderId === member.userId && member.userId !== '' ? 'text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'text-zinc-800 hover:text-zinc-400'}`}
                            title="Appoint as Team Leader"
                          >
                            <Star size={16} fill={leaderId === member.userId && member.userId !== '' ? "currentColor" : "none"} />
                          </button>

                          <div className="w-8 h-8 bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-700">0{index + 1}</div>
                          <input type="text" value={member.userId} onChange={(e) => updateMemberData(index, 'userId', e.target.value)} placeholder="USER_UID" className="flex-1 bg-black border border-white/10 py-2 px-3 text-[10px] font-bold text-white outline-none focus:border-sky-500/30" />
                          <input type="text" value={member.role} onChange={(e) => updateMemberData(index, 'role', e.target.value)} placeholder="ROLE" className="flex-1 bg-black border border-white/10 py-2 px-3 text-[10px] font-bold text-white outline-none focus:border-sky-500/30" />
                          
                          {manualMembers.length > 1 && (
                            <button onClick={() => removeMemberField(index)} className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <button 
                  className="w-full py-4 bg-white text-black font-black text-[10px] uppercase shadow-2xl hover:bg-sky-400 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-30"
                  disabled={isManualDisabled}
                >
                  <CheckCircle2 size={18} /> Execute_Deployment_Protocol
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- BULK SECTION --- */
          <motion.div key="bulk" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
            <div className="bg-zinc-900/50 border border-white/5 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
              <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-tight">
                Packet Requirement: CSV must include TEAM_NAME, PROJECT_ID, USER_ID, ROLE, and IS_LEADER (1/0) columns.
              </p>
            </div>

            <div key="dropzone" className="w-full flex flex-col items-center justify-center h-80 border-2 border-dashed border-white/5 bg-zinc-900/10 p-12 space-y-6 group hover:border-sky-500/30 transition-all cursor-pointer relative" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} hidden accept=".csv" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
              <div className="relative">
                <div className="p-8 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
                  <UploadCloud size={40} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-sky-500 p-2 border-4 border-black">
                  <FileJson size={16} className="text-black" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{fileName || 'Inject_Data_Packet'}</h3>
                <p className="text-[9px] text-zinc-600 font-bold uppercase underline decoration-sky-500/20 tracking-widest leading-relaxed italic">Click to browse local directory</p>
              </div>
              {fileName && (
                <button onClick={(e) => { e.stopPropagation(); setFileName(null); }} className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase border border-red-500/20 hover:bg-red-500 transition-all"><X size={10} /> Discard</button>
              )}
            </div>

            <button className="w-full py-5 bg-white text-black font-black text-[11px] uppercase shadow-2xl hover:bg-sky-400 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-30" disabled={!fileName}>
              <CheckCircle2 size={18} /> Execute_Deployment_Protocol
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};