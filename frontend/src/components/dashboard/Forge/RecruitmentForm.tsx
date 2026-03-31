/* cspell:disable */
import { useState, useRef } from 'react'; 
import { 
  Mail, X, Calendar, User, RefreshCw, ChevronDown, FileSpreadsheet, Cpu, UploadCloud, Zap 
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

interface FormProps { onClose: () => void; }

export const RecruitmentForm = ({ onClose }: FormProps) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');
  const [password, setPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [roles, setRoles] = useState(['WEB_DEV', 'SOC_L1', 'APP_DEV', 'DATA_SEC']);
  const [newRole, setNewRole] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const generateSecurePass = () => {
    const charset = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0; i < 16; ++i) retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    setPassword(retVal);
  };

  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.toUpperCase())) {
      setRoles(prev => [...prev, newRole.toUpperCase()]);
      setNewRole('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#050505] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
      style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}
    >
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-zinc-900/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-sky-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-tighter">FORGE_CORE_v4.5</h2>
          </div>
          
          <div className="flex bg-black p-1 border border-white/10 rounded-sm">
            <button 
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              MANUAL_AGENT
            </button>
            <button 
              onClick={() => setActiveTab('bulk')}
              className={`px-6 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'bulk' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              BULK_PACKET
            </button>
          </div>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="px-10 py-10 min-h-125"> 
        <AnimatePresence mode="wait">
          {activeTab === 'manual' ? (
            <motion.div 
              key="manual" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
            >
              {/* LEFT SIDE */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-sky-400 uppercase tracking-widest ml-1">Operative_Ident</label>
                    <div className="relative border-b border-white/10 focus-within:border-sky-500 transition-colors">
                      <User className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input type="text" className="w-full bg-transparent py-3 pl-8 text-xs font-bold text-white outline-none placeholder:text-zinc-800" placeholder="ENTER FULL NAME" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-sky-400 uppercase tracking-widest ml-1">Network_Mail</label>
                    <div className="relative border-b border-white/10 focus-within:border-sky-500 transition-colors">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input type="email" className="w-full bg-transparent py-3 pl-8 text-xs font-bold text-white outline-none placeholder:text-zinc-800" placeholder="OPERATIVE@SDC.COM" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-sky-400 uppercase tracking-widest ml-1">Deployment_Date</label>
                    <div className="relative border-b border-white/10 focus-within:border-sky-500 transition-colors">
                      <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input type="date" className="w-full bg-transparent py-3 pl-8 text-[10px] font-bold text-zinc-500 outline-none scheme-dark uppercase" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-sky-500/5 border-l-2 border-sky-400 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Access_Key_Gen</label>
                    <button onClick={generateSecurePass} className="flex items-center gap-2 text-[8px] font-black text-sky-400 hover:text-white transition-colors">
                      <RefreshCw size={10} /> REGENERATE
                    </button>
                  </div>
                  <div className="text-lg font-mono font-black text-white tracking-[0.4em] uppercase">
                    {password || <span className="text-zinc-800">awaiting_key...</span>}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[9px] font-black text-sky-400 uppercase tracking-widest ml-1">Sector_Role_Registry</label>
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="QUICK_ADD_ROLE..."
                      className="flex-1 bg-zinc-950 border border-white/5 px-4 py-3 text-[10px] font-bold text-sky-400 outline-none focus:border-sky-500/30"
                    />
                    <button onClick={handleAddRole} className="px-5 bg-sky-500 text-black font-black text-sm hover:bg-white transition-all">+</button>
                  </div>

                  <div className="relative">
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                      className="w-full bg-zinc-900/50 border border-white/5 py-4 px-5 text-[10px] font-bold flex justify-between items-center cursor-pointer text-white hover:bg-zinc-800 transition-all"
                    >
                      <span className="tracking-widest">{selectedRole || 'SELECT_ASSIGNED_ROLE'}</span>
                      <ChevronDown size={16} className={`text-sky-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }} 
                          className="overflow-hidden bg-zinc-950 border-x border-b border-white/10"
                        >
                          <div className="max-h-32 overflow-y-auto custom-scrollbar">
                            {roles.map((role) => (
                              <div key={role} onClick={() => { setSelectedRole(role); setIsDropdownOpen(false); }} className="px-5 py-3 text-[9px] text-zinc-400 hover:bg-white hover:text-black font-black cursor-pointer transition-all border-b border-white/5 last:border-0">{role}</div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-6 bg-white text-black font-black text-xs uppercase shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-sky-400 transition-all active:scale-95">
                    Finalize_Deployment_Protocol
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="bulk" 
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col items-center justify-center space-y-8 h-full min-h-105"
            >
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Bulk_Data_Forge</h3>
                <p className="text-[10px] text-zinc-500 tracking-[0.3em] font-bold uppercase">Upload Operative list in .CSV or .XLSX format</p>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xl h-56 border border-dashed border-white/10 bg-zinc-900/20 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group relative"
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
                <div className="p-6 bg-white text-black rounded-full group-hover:scale-110 transition-transform shadow-xl">
                  <UploadCloud size={32} />
                </div>
                <div className="text-center px-4">
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em] block">
                    {fileName || 'Drop_Data_Packet_Here'}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-sky-500 transition-all duration-500" style={{ width: fileName ? '100%' : '0%' }} />
              </div>

              <button className="w-full max-w-sm py-5 bg-white text-black font-black text-xs uppercase shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-sky-400 transition-all flex items-center justify-center gap-3">
                <FileSpreadsheet size={16} /> Initialise_Batch_Upload
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none -z-10">
        <Zap size={400} className="text-white" />
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #38bdf8; }`}</style>
    </motion.div>
  );
};