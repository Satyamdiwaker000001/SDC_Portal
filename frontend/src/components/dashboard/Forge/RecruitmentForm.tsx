/* cspell:disable */
import { useState } from 'react'; // Fixed: Removed unused useEffect
import { 
  UserPlus, Key, Mail, X, 
  User, RefreshCw, Zap, Plus, Trash2, ChevronDown 
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

interface FormProps { onClose: () => void; }

export const RecruitmentForm = ({ onClose }: FormProps) => {
  const [password, setPassword] = useState('');
  
  // Role Management Logic
  const [roles, setRoles] = useState(['WEB_DEV', 'SOC_L1', 'APP_DEV']);
  const [newRole, setNewRole] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const generateSecurePass = () => {
    const charset = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0; i < 16; ++i) retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    setPassword(retVal);
  };

  const addRole = () => {
    if (newRole && !roles.includes(newRole.toUpperCase())) {
      setRoles([...roles, newRole.toUpperCase()]);
      setNewRole('');
    }
  };

  const deleteRole = (e: React.MouseEvent, roleToDelete: string) => {
    e.stopPropagation(); 
    setRoles(roles.filter(r => r !== roleToDelete));
    if (selectedRole === roleToDelete) setSelectedRole('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#0a0a0a] border-2 border-orange-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
      style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}
    >
      {/* HUD Header */}
      <div className="flex justify-between items-center px-8 py-5 border-b-2 border-orange-500/10 bg-linear-to-r from-orange-500/5 to-transparent font-sans">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-orange-500 text-black skew-x-12">
            <UserPlus size={20} className="-skew-x-12" />
          </div>
          <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">Forge_Protocol_v4.5</h2>
        </div>
        <button onClick={onClose} className="p-1 text-zinc-500 hover:text-orange-500 transition-all border border-zinc-800 hover:border-orange-500/40">
          <X size={24} />
        </button>
      </div>

      <div className="px-8 py-10 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* LEFT COLUMN: IDENT & ROLE */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-orange-500/60 uppercase tracking-[0.3em] ml-1 italic font-mono">Operative_Ident</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500" size={16} />
                <input type="text" className="w-full bg-zinc-950 border border-zinc-800 py-3.5 pl-12 text-xs font-black text-white outline-none focus:border-orange-500 placeholder:text-zinc-800" placeholder="NAME" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-orange-500/60 uppercase tracking-[0.3em] ml-1 italic font-mono">Network_Mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500" size={16} />
                <input type="email" className="w-full bg-zinc-950 border border-zinc-800 py-3.5 pl-12 text-xs font-black text-white outline-none focus:border-orange-500 placeholder:text-zinc-800" placeholder="EMAIL" />
              </div>
            </div>

            {/* --- TACTICAL DROPDOWN SECTOR --- */}
            <div className="space-y-1 relative">
              <label className="text-[8px] font-black text-orange-500/60 uppercase tracking-[0.3em] ml-1 italic font-mono">Sector_Role_Registry</label>
              
              <div className="flex gap-1 mb-2">
                <input 
                  type="text" 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="CREATE_NEW_ROLE..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-2 text-[10px] font-black text-orange-500 outline-none focus:border-orange-500/40 placeholder:text-zinc-700 font-mono"
                />
                <button onClick={addRole} className="px-4 bg-orange-500 text-black hover:bg-white transition-all">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-zinc-950 border border-zinc-800 py-3.5 px-4 text-xs font-black flex justify-between items-center cursor-pointer transition-all font-mono ${selectedRole ? 'text-orange-500 border-orange-500/30' : 'text-zinc-600'}`}
              >
                <span className="tracking-widest">{selectedRole || 'SELECT_ASSIGNED_ROLE'}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-orange-500' : ''}`} />
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-zinc-900 border border-orange-500/30 shadow-2xl max-h-48 overflow-y-auto scrollbar-none font-mono"
                  >
                    {roles.map((role) => (
                      <div 
                        key={role}
                        onClick={() => { setSelectedRole(role); setIsDropdownOpen(false); }}
                        className="flex justify-between items-center px-4 py-3 hover:bg-orange-500 group cursor-pointer border-b border-zinc-800/50 last:border-0"
                      >
                        <span className="text-[10px] font-black tracking-widest text-zinc-400 group-hover:text-black">{role}</span>
                        <button 
                          onClick={(e) => deleteRole(e, role)}
                          className="p-1 text-zinc-700 hover:text-red-500 group-hover:text-black/60 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: SECURITY */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="p-6 bg-orange-500/5 border-l-4 border-orange-500 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic font-mono">Access_Key</label>
                <button onClick={generateSecurePass} className="text-[8px] font-black text-orange-500 hover:text-white uppercase border border-orange-500/20 px-3 py-1 bg-black font-mono">
                  <RefreshCw size={10} className="inline mr-1" /> REGENERATE
                </button>
              </div>
              <div className="relative">
                <Key className="absolute left-0 top-1/2 -translate-y-1/2 text-orange-500/40" size={14} />
                <input type="text" value={password} readOnly className="w-full bg-transparent border-b border-zinc-800 py-2 pl-6 text-xs font-black text-orange-500 tracking-widest font-mono" placeholder="GENERATING_KEY..." />
              </div>
            </div>

            <div className="space-y-4">
               <div className="p-4 border border-zinc-800 bg-black/40 text-[8px] font-mono text-zinc-600 uppercase tracking-tighter leading-relaxed">
                  [ AUTH_ALERT ]: Deployment syncs operative data to SDC_LIVE_REGISTRY.
               </div>
               <button className="w-full py-5 bg-orange-500 text-black font-black text-[11px] uppercase skew-x-12 hover:bg-white transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] group active:scale-95">
                  <span className="-skew-x-12 block tracking-[0.4em]">Finalize_Deployment</span>
               </button>
            </div>
          </div>

        </div>
      </div>
      <Zap size={80} className="absolute -bottom-4 -right-4 opacity-5 text-orange-500 pointer-events-none rotate-12" />
    </motion.div>
  );
};