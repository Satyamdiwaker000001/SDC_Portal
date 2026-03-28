import { useState } from 'react';
import { 
  UserPlus, Key, Mail, X, FileSpreadsheet, Calendar, 
  User, Code2, RefreshCw, CheckCircle2, AlertTriangle, ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// cSpell:ignore Satyam Diwaker ABCDEFGHJKMNPQRSTUVWXYZ
type EntryMode = 'MANUAL' | 'BULK';

interface FormProps { onClose: () => void; }

export const RecruitmentForm = ({ onClose }: FormProps) => {
  const [tab, setTab] = useState<EntryMode>('MANUAL');
  const [password, setPassword] = useState('');
  
  const generateSecurePass = () => {
    const charset = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0; i < 16; ++i) retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    setPassword(retVal);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-4xl bg-slate-950/95 border-2 border-cyan-500/30 backdrop-blur-3xl rounded-none shadow-[0_0_100px_rgba(0,0,0,1)]"
    >
      {/* HUD Header */}
      <div className="flex justify-between items-center px-8 py-5 border-b-2 border-cyan-500/10 bg-linear-to-r from-cyan-500/10 to-transparent">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-500 text-black skew-x-12 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <UserPlus size={20} className="-skew-x-12" />
          </div>
          <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">Forge_Protocol_v4.5</h2>
        </div>
        <button onClick={onClose} className="p-1 text-slate-500 hover:text-cyan-400 transition-all cursor-none border border-white/5 hover:border-cyan-500/40">
          <X size={28} />
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex p-6">
        <div className="flex bg-slate-900 border border-white/5 p-1">
          {(['MANUAL', 'BULK'] as EntryMode[]).map((m) => (
            <button key={m} onClick={() => setTab(m)} className={`px-6 py-2 text-[9px] font-black tracking-widest transition-all cursor-none ${tab === m ? 'bg-cyan-500 text-black shadow-glow' : 'text-slate-500 hover:text-white'}`}>
              {m === 'MANUAL' ? 'SINGLE_LINK' : 'DATA_INJECTION'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 pb-8">
        <AnimatePresence mode="wait">
          {tab === 'MANUAL' ? (
            <motion.div key="manual" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-cyan-500/60 uppercase tracking-[0.3em] ml-1 italic">Operative_Ident</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500" size={16} />
                    <input type="text" className="w-full bg-slate-950 border border-white/10 rounded-none py-3 pl-12 text-xs font-black text-white outline-none focus:border-cyan-500 focus:bg-cyan-500/2" placeholder="NAME" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-cyan-500/60 uppercase tracking-[0.3em] ml-1 italic">Network_Mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500" size={16} />
                    <input type="email" className="w-full bg-slate-950 border border-white/10 rounded-none py-3 pl-12 text-xs font-black text-white outline-none focus:border-cyan-500" placeholder="EMAIL" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black text-cyan-500/60 uppercase tracking-[0.3em] ml-1 italic">Specialization</label>
                  <div className="relative group">
                    <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <select className="w-full bg-slate-950 border border-white/10 py-3 pl-12 text-[10px] font-black text-white outline-none appearance-none cursor-none uppercase tracking-widest focus:border-cyan-500">
                      <option>Web_Developer</option>
                      <option>App_Developer</option>
                      <option>Cyber_Security</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                    <input type="date" className="w-full bg-slate-950 border border-white/10 py-3 pl-8 pr-2 text-[9px] font-black text-white outline-none focus:border-emerald-500" />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                    <input type="date" className="w-full bg-slate-950 border border-white/10 py-3 pl-8 pr-2 text-[9px] font-black text-white outline-none focus:border-red-500" />
                  </div>
                </div>

                <div className="p-6 bg-white/2 border-l-4 border-cyan-500 space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pass_Key</label>
                    <button onClick={generateSecurePass} className="text-[8px] font-black text-cyan-500 hover:text-white uppercase cursor-none border border-cyan-500/20 px-2 py-1">
                      <RefreshCw size={10} className="inline mr-1" /> GENERATE
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-0 top-1/2 -translate-y-1/2 text-cyan-500/40" size={14} />
                    <input type="text" value={password} readOnly className="w-full bg-slate-950 border-b border-white/10 py-2 pl-6 text-xs font-black text-cyan-400 placeholder:text-slate-800" placeholder="AWAITING_INPUT" />
                  </div>
                </div>

                <button className="w-full py-4 bg-cyan-500 text-black font-black text-[10px] uppercase cursor-none skew-x-12 hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                   <span className="-skew-x-12 block tracking-[0.2em]">Finalize_Deployment</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="bulk" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="border-2 border-dashed border-cyan-500/20 bg-white/1 p-10 flex flex-col items-center justify-center gap-4 group hover:border-cyan-500/50 transition-all cursor-none">
                <FileSpreadsheet size={40} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <h3 className="text-sm font-black text-white italic tracking-widest uppercase">Master_Sync</h3>
                  <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">Accepting .XLSX / .CSV only</p>
                </div>
                <button className="px-8 py-3 bg-white text-black text-[9px] font-black uppercase cursor-none hover:bg-cyan-500 transition-all skew-x-12">
                  <span className="-skew-x-12 block">Upload_Files</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/2 border border-white/5 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={16} />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Integrity_Check_Active</span>
                </div>
                <div className="p-4 bg-white/2 border border-white/5 flex items-center gap-3">
                  <AlertTriangle className="text-amber-500" size={16} />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Col_Map_Verification</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};