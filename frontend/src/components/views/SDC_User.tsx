/* cspell:disable */
import { useState, useMemo } from 'react';
import { 
  Search, UserPlus, Edit2, Trash2, GraduationCap, 
  CheckSquare, Square, ChevronLeft, Key, X, RefreshCw, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CreateTeam } from '../dashboard/Forge/createTeam';

// --- TYPES ---
interface Operative {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  avatar: string | null;
}

const MOCK_MEMBERS: Operative[] = [
  { id: '001', uid: 'SDC-2026-X01', name: 'Satyam Diwaker', email: 'satyam@sdc.com', role: 'SOC_L1', joined: '2025-01-10', avatar: null },
  { id: '002', uid: 'SDC-2026-A02', name: 'Aditya Raj', email: 'aditya@sdc.com', role: 'WEB_DEV', joined: '2024-11-20', avatar: null },
  { id: '003', uid: 'SDC-2026-I03', name: 'Ishita Sharma', email: 'ishita@sdc.com', role: 'APP_DEV', joined: '2025-02-05', avatar: null },
  { id: '004', uid: 'SDC-2026-R04', name: 'Rahul Verma', email: 'rahul@sdc.com', role: 'DATA_SEC', joined: '2024-09-15', avatar: null },
];

interface SDCUserProps {
  onAddTeam?: () => void;
}

export const SDC_User = ({ onAddTeam }: SDCUserProps) => {
  const [view, setView] = useState<'registry' | 'forge'>('registry');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'role'>('name');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // --- PASSWORD RESET STATE (Fixed: No more 'any') ---
  const [resetTarget, setResetTarget] = useState<Operative | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const filteredMembers = useMemo(() => {
    return MOCK_MEMBERS.filter(member => {
      const target = searchType === 'name' ? member.name : member.role;
      return target.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, searchType]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length) setSelectedIds([]);
    else setSelectedIds(filteredMembers.map(m => m.id));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleForgeSwitch = () => {
    if (onAddTeam) onAddTeam();
    else setView('forge');
  };

  const generatePass = () => {
    const pass = Math.random().toString(36).slice(-8).toUpperCase() + "@" + Math.floor(100 + Math.random() * 900);
    setNewPassword(pass);
  };

  if (view === 'forge') {
    return (
      <div className="space-y-4 animate-in slide-in-from-right duration-500">
        <button onClick={() => setView('registry')} className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-sky-400 uppercase tracking-widest transition-colors mb-4 group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return_to_Operative_Registry
        </button>
        <CreateTeam />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 pb-10 relative">
      
      {/* --- PASSWORD RESET MODAL (Fixed: z-100) --- */}
      <AnimatePresence>
        {resetTarget && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#080808] border border-sky-500/30 p-8 shadow-[0_0_50px_rgba(14,165,233,0.15)] relative"
              style={{ clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' }}>
              
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                   <Key size={20} className="text-sky-400" />
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">Override_Access_Code</h3>
                </div>
                <button onClick={() => { setResetTarget(null); setNewPassword(''); }} className="text-zinc-500 hover:text-white"><X size={20} /></button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-orange-500/5 border-l-2 border-orange-500 flex gap-4">
                  <ShieldAlert size={20} className="text-orange-500 shrink-0" />
                  <p className="text-[9px] text-orange-200/50 uppercase leading-relaxed font-bold">Warning: Manual reset will terminate all existing active sessions for operative: {resetTarget.name}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-sky-500 uppercase tracking-widest ml-1">New_Security_Key</label>
                  <div className="flex gap-2">
                    <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="flex-1 bg-black border border-white/10 p-3 text-xs font-mono font-bold text-white outline-none focus:border-sky-500 transition-all" placeholder="ENTER_NEW_SECRET" />
                    <button onClick={generatePass} className="p-3 bg-zinc-900 border border-white/10 text-sky-400 hover:bg-white hover:text-black transition-all" title="Auto-Generate"><RefreshCw size={16} /></button>
                  </div>
                </div>

                <button onClick={() => { console.log(`Resetting ${resetTarget.id} to ${newPassword}`); setResetTarget(null); }}
                  className="w-full py-4 bg-sky-500 text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                  Execute_Reset_Protocol
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/30 p-6 border border-white/5 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
        <div className="flex items-center gap-3 w-full md:w-2/3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-sky-400 transition-colors" size={18} />
            <input type="text" placeholder={`SEARCH_BY_${searchType.toUpperCase()}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 py-3 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-sky-500/50 transition-all placeholder:text-zinc-800" />
          </div>
          <div className="flex bg-black border border-white/10 p-1 rounded-sm shrink-0">
            {['name', 'role'].map((type) => (
              <button key={type} onClick={() => setSearchType(type as 'name' | 'role')} 
                className={`px-4 py-2 text-[9px] font-black uppercase tracking-tighter transition-all ${searchType === type ? 'bg-sky-500 text-black' : 'text-zinc-500 hover:text-white'}`}>{type}</button>
            ))}
          </div>
        </div>
        <button onClick={handleForgeSwitch} className="flex items-center gap-3 px-8 py-3.5 font-black text-[10px] uppercase tracking-widest bg-white text-black hover:bg-sky-400 transition-all shadow-xl active:scale-95 shrink-0 group">
          <UserPlus size={16} className="group-hover:scale-110 transition-transform" /> Create_Team_Protocol
        </button>
      </div>

      <div className="bg-black/40 border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-zinc-900/50 font-black text-[10px] text-zinc-500 uppercase tracking-widest">
              <th className="p-5 w-12 text-center">
                <button onClick={toggleSelectAll} className="text-sky-400">{selectedIds.length === filteredMembers.length ? <CheckSquare size={18} /> : <Square size={18} />}</button>
              </th>
              <th className="p-5">Operative_Ident / ID</th>
              <th className="p-5">Sector_Role</th>
              <th className="p-5 text-center">Deployment_Date</th>
              <th className="p-5 text-right">Actions_Override</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member) => (
                <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`group transition-colors ${selectedIds.includes(member.id) ? 'bg-sky-500/5' : 'hover:bg-white/2'}`}>
                  <td className="p-5 text-center">
                    <button onClick={() => toggleSelectOne(member.id)} className="text-zinc-700">{selectedIds.includes(member.id) ? <CheckSquare size={18} className="text-sky-400" /> : <Square size={18} />}</button>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-sky-500/50 transition-all shadow-inner">
                        <span className="text-[10px] font-black text-sky-400">{member.name.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors uppercase tracking-tight">{member.name}</p>
                        <p className="text-[8px] text-sky-500/60 font-mono font-bold tracking-widest">{member.uid}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5"><span className="px-3 py-1 bg-zinc-900 border border-white/5 text-[9px] font-black text-sky-400 uppercase tracking-widest">{member.role}</span></td>
                  <td className="p-5 text-[10px] font-mono text-zinc-500 text-center">{member.joined}</td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-1 text-zinc-500">
                      <button onClick={() => setResetTarget(member)} className="p-2 hover:text-sky-400 transition-colors" title="Reset Access Key"><Key size={14} /></button>
                      <button className="p-2 hover:text-white transition-colors"><Edit2 size={14} /></button>
                      <button className="p-2 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      <button className="p-2 hover:text-sky-400 ml-2 border border-transparent hover:border-sky-500/30 transition-all"><GraduationCap size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};