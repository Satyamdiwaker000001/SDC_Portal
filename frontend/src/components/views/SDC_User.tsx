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
  
  // --- PASSWORD RESET STATE ---
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
        <button onClick={() => setView('registry')} className="flex items-center gap-2 text-xs font-bold text-slate-grey-500 hover:text-sky-600 uppercase tracking-widest transition-colors mb-4 group px-4 py-2 bg-white border-2 border-slate-grey-200 rounded-xl shadow-sm">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to Operative Registry
        </button>
        <CreateTeam />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 pb-10 relative font-sans text-left text-carbon-black-DEFAULT">
      
      {/* --- PASSWORD RESET MODAL --- */}
      <AnimatePresence>
        {resetTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md crystal-card p-10 shadow-2xl relative border-t-4 border-t-sky-400">
              
              <div className="flex justify-between items-center mb-8 border-b-2 border-slate-grey-100 pb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                     <Key size={20} className="text-sky-600" />
                   </div>
                   <h3 className="text-lg font-black text-carbon-black-DEFAULT uppercase tracking-tight">Override Access Code</h3>
                </div>
                <button onClick={() => { setResetTarget(null); setNewPassword(''); }} className="text-slate-grey-400 hover:text-carbon-black-DEFAULT bg-slate-grey-100 hover:bg-slate-grey-200 p-2 rounded-full transition-all"><X size={20} /></button>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl rounded-l-sm flex gap-4">
                  <ShieldAlert size={24} className="text-orange-500 shrink-0" />
                  <p className="text-xs text-orange-700 uppercase leading-relaxed font-bold tracking-tight mt-0.5">Warning: Manual reset will terminate all existing active sessions for operative: {resetTarget.name}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-1 rounded inline-block">New Security Key</p>
                  <div className="flex gap-2">
                    <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="flex-1 bg-white border-2 border-slate-grey-200 p-4 rounded-xl text-sm font-mono font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-all placeholder:text-slate-grey-400" placeholder="Enter New Secret" />
                    <button onClick={generatePass} className="p-4 bg-slate-grey-100 border-2 border-slate-grey-200 text-slate-grey-600 rounded-xl hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all shadow-sm" title="Auto-Generate"><RefreshCw size={18} /></button>
                  </div>
                </div>

                <button onClick={() => { console.log(`Resetting ${resetTarget.id} to ${newPassword}`); setResetTarget(null); }}
                  className="w-full py-5 bg-sky-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-sky-600 transition-all shadow-md gaming-clip-btn">
                  Execute Reset Protocol
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between crystal-card p-6 border-l-4 border-l-sky-500">
        <div className="flex items-center gap-4 w-full md:w-2/3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-sky-500 transition-colors" size={20} />
            <input type="text" placeholder={`Search by ${searchType}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-grey-200 py-3.5 pl-12 pr-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-all placeholder:text-slate-grey-400 rounded-xl shadow-sm" />
          </div>
          <div className="flex bg-slate-grey-100 border-2 border-slate-grey-200 p-1 rounded-xl shrink-0 shadow-sm">
            {['name', 'role'].map((type) => (
              <button key={type} onClick={() => setSearchType(type as 'name' | 'role')} 
                className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${searchType === type ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-grey-500 hover:text-carbon-black-DEFAULT hover:bg-slate-grey-200/50'}`}>{type}</button>
            ))}
          </div>
        </div>
        <button onClick={handleForgeSwitch} className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 font-black text-xs uppercase tracking-widest bg-carbon-black-DEFAULT text-white hover:bg-carbon-black-600 transition-all shadow-md rounded-xl shrink-0 group">
          <UserPlus size={18} className="group-hover:scale-110 transition-transform text-sky-400" /> Create Team Protocol
        </button>
      </div>

      <div className="crystal-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-grey-50 border-b-2 border-slate-grey-200 font-bold text-[10px] text-slate-grey-500 uppercase tracking-widest">
              <th className="p-5 w-16 text-center">
                <button onClick={toggleSelectAll} className="text-slate-grey-400 hover:text-sky-500 transition-colors">
                   {selectedIds.length === filteredMembers.length ? <CheckSquare size={20} className="text-sky-500" /> : <Square size={20} />}
                </button>
              </th>
              <th className="p-5">Operative Ident / ID</th>
              <th className="p-5">Sector Role</th>
              <th className="p-5 text-center">Deployment Date</th>
              <th className="p-5 text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-grey-100">
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member) => (
                <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`group transition-colors bg-white hover:bg-sky-50/50 ${selectedIds.includes(member.id) ? 'bg-sky-50/80 shadow-[inset_4px_0_0_#0ea5e9]' : ''}`}>
                  <td className="p-5 text-center">
                    <button onClick={() => toggleSelectOne(member.id)} className="text-slate-grey-400 hover:text-sky-500 transition-colors">
                      {selectedIds.includes(member.id) ? <CheckSquare size={20} className="text-sky-500" /> : <Square size={20} />}
                    </button>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 border-2 border-sky-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-sky-300 transition-all shadow-sm">
                        <span className="text-sm font-black text-sky-600">{member.name.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-carbon-black-DEFAULT group-hover:text-sky-600 transition-colors uppercase tracking-tight">{member.name}</p>
                        <p className="text-[10px] text-slate-grey-500 font-mono font-bold tracking-widest mt-0.5">{member.uid}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                     <span className="px-3 py-1.5 bg-slate-grey-50 border-2 border-slate-grey-100 rounded-lg text-[10px] font-black text-slate-grey-600 uppercase tracking-widest group-hover:border-slate-grey-200 transition-all">{member.role}</span>
                  </td>
                  <td className="p-5 text-xs font-bold text-slate-grey-500 text-center">{member.joined}</td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-grey-400">
                      <button onClick={() => setResetTarget(member)} className="p-2 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-200 shadow-none hover:shadow-sm" title="Reset Access Key"><Key size={16} /></button>
                      <button className="p-2 hover:text-carbon-black-DEFAULT hover:bg-slate-grey-100 rounded-lg transition-colors border border-transparent hover:border-slate-grey-200 shadow-none hover:shadow-sm"><Edit2 size={16} /></button>
                      <button className="p-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 shadow-none hover:shadow-sm"><Trash2 size={16} /></button>
                      <button className="p-2 hover:text-emerald-600 hover:bg-emerald-50 ml-1 rounded-lg transition-colors border border-transparent hover:border-emerald-200 shadow-none hover:shadow-sm"><GraduationCap size={18} /></button>
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