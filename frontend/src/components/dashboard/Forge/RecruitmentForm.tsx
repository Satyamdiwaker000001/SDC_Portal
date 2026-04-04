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
  
  const [roles, setRoles] = useState(['WEB DEV', 'SOC L1', 'APP DEV', 'DATA SEC']);
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
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="w-full crystal-card relative overflow-hidden"
    >
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center px-8 py-6 border-b-2 border-slate-grey-200/50 bg-white/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
              <Cpu size={18} className="text-sky-600" />
            </div>
            <h2 className="text-lg font-black text-carbon-black-DEFAULT uppercase tracking-tight">Forge Core v4.5</h2>
          </div>
          
          <div className="flex bg-slate-grey-100 p-1 rounded-xl shadow-sm border border-slate-grey-200">
            <button 
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${activeTab === 'manual' ? 'bg-white text-sky-600 shadow-sm border border-slate-grey-200' : 'text-slate-grey-500 hover:text-carbon-black-DEFAULT'}`}
            >
              Manual Registration
            </button>
            <button 
              onClick={() => setActiveTab('bulk')}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${activeTab === 'bulk' ? 'bg-white text-sky-600 shadow-sm border border-slate-grey-200' : 'text-slate-grey-500 hover:text-carbon-black-DEFAULT'}`}
            >
              Bulk Import
            </button>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-grey-100 text-slate-grey-500 flex items-center justify-center hover:bg-slate-grey-200 hover:text-carbon-black-DEFAULT transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="px-10 py-10 min-h-[500px]"> 
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
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest">Aspirant Name</label>
                    <div className="relative focus-within:text-sky-500 transition-colors">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-sky-500" size={18} />
                      <input type="text" className="w-full bg-slate-grey-50 border-2 border-slate-grey-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" placeholder="Enter Full Name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest">Contact Email</label>
                    <div className="relative focus-within:text-sky-500 transition-colors">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-sky-500" size={18} />
                      <input type="email" className="w-full bg-slate-grey-50 border-2 border-slate-grey-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" placeholder="operative@sdc.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest">Deployment Date</label>
                    <div className="relative focus-within:text-sky-500 transition-colors">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-sky-500" size={18} />
                      <input type="date" className="w-full bg-slate-grey-50 border-2 border-slate-grey-200 rounded-xl py-4 pl-12 pr-4 text-xs font-bold text-slate-grey-600 outline-none focus:border-sky-500 transition-colors uppercase" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-sky-50 rounded-xl border-l-4 border-sky-500 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest">Security Access Key</label>
                    <button onClick={generateSecurePass} className="flex items-center gap-2 text-[10px] font-bold text-sky-600 hover:text-sky-700 transition-colors bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200">
                      <RefreshCw size={12} /> REGENERATE
                    </button>
                  </div>
                  <div className="text-xl font-mono font-black text-carbon-black-DEFAULT tracking-wider">
                    {password || <span className="text-slate-grey-400">awaiting_key...</span>}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest">Assigned Sector Role</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Custom role..."
                      className="flex-1 bg-white border-2 border-slate-grey-200 rounded-xl px-4 py-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400"
                    />
                    <button onClick={handleAddRole} className="w-14 bg-sky-100 text-sky-600 font-black text-xl hover:bg-sky-500 hover:text-white transition-all rounded-xl border border-sky-200">+</button>
                  </div>

                  <div className="relative">
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                      className="w-full bg-white border-2 border-slate-grey-200 rounded-xl py-4 px-5 text-xs font-bold flex justify-between items-center cursor-pointer text-carbon-black-DEFAULT hover:border-sky-300 transition-all shadow-sm"
                    >
                      <span className="tracking-wide uppercase">{selectedRole || 'Select Registry Role'}</span>
                      <ChevronDown size={18} className={`text-slate-grey-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-sky-500' : ''}`} />
                    </div>
                    
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }} 
                          className="overflow-hidden bg-white border-x-2 border-b-2 border-slate-grey-200 rounded-b-xl shadow-lg absolute w-full z-20 mt-[-4px]"
                        >
                          <div className="max-h-48 overflow-y-auto custom-scrollbar">
                            {roles.map((role) => (
                              <div key={role} onClick={() => { setSelectedRole(role); setIsDropdownOpen(false); }} className="px-5 py-4 text-xs text-slate-grey-600 hover:bg-sky-50 hover:text-sky-600 font-bold cursor-pointer transition-all border-b border-slate-grey-100 last:border-0 uppercase tracking-wide">{role}</div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-8">
                  <button className="w-full py-5 bg-sky-500 text-white font-black text-xs tracking-widest uppercase rounded-xl shadow-md hover:bg-sky-600 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 gaming-clip-btn">
                    Finalize Deployment
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
              className="flex flex-col items-center justify-center space-y-8 h-full min-h-[400px]"
            >
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-black text-carbon-black-DEFAULT italic tracking-tight uppercase">Bulk Data Forge</h3>
                <p className="text-xs text-slate-grey-500 tracking-widest font-bold uppercase">Upload Operative list in .CSV or .XLSX format</p>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xl p-10 bg-slate-grey-50 border-2 border-dashed border-sky-300 rounded-2xl flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all group"
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
                <div className="w-20 h-20 bg-white text-sky-500 rounded-2xl border-4 border-sky-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-md">
                  <UploadCloud size={36} />
                </div>
                <div className="text-center px-4">
                  <span className="text-sm font-black text-carbon-black-DEFAULT uppercase tracking-wide block mb-2">
                    {fileName ? fileName : 'Drop Data Packet Here'}
                  </span>
                  {!fileName && <span className="text-xs font-bold text-slate-grey-400">or click to browse local files</span>}
                </div>
              </div>

              <button className="w-full max-w-sm py-4 bg-carbon-black-DEFAULT text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-sky-500 transition-all flex items-center justify-center gap-3 gaming-clip-btn">
                <FileSpreadsheet size={16} /> Initialise Batch Upload
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none -z-10">
        <Zap size={400} className="text-sky-500" />
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </motion.div>
  );
};