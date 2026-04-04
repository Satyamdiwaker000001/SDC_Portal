import React, { useState, useMemo } from "react";
import { 
  Zap, Shield, ChevronRight, HardDrive, 
  Loader2, Cpu, Network, Eye, EyeOff 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth"; 
import { soundManager } from "../../utils/SoundManager";
import { motion } from "framer-motion";

const PROTOCOLS = [
  "FORGE_PRIMARY_UPLINK::OK",
  "NEURAL_SYNAPSE::STABLE",
  "SECTOR_7_GATEWAY::ACTIVE",
  "ENCRYPTION_HASH::SHA-512",
  "OPERATIVE_DATA::SYNCED",
  "SYSTEM_HEALTH::OPTIMAL",
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playConfirm();
    setIsAccessing(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      
      if (cleanEmail === "admin@sdc.com") {
        login("Satyam Admin", "admin");
        navigate("/dashboard/admin");
      } 
      else if (cleanEmail === "leader@sdc.com") {
        login("Satyam Leader", "developer"); 
        navigate("/dashboard/developer");
      } 
      else {
        login("SDC Member", "developer");
        navigate("/dashboard/developer");
      }
      setIsAccessing(false);
    }, 1500);
  };

  const sessionRef = useMemo(() => Math.random().toString(36).substring(7).toUpperCase(), []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Side Status HUD */}
      <div className="absolute top-24 left-24 z-20 hidden xl:block space-y-12">
        <div className="space-y-4">
           <span className="kpr-mono-label">UPLINK_STATUS</span>
           <div className="flex items-center gap-3 p-4 bg-white border border-white/10 shadow-2xl">
               <Network size={14} className="text-kpr-green" />
               <span className="kpr-mono-value text-white">SECURE_CHANNEL_O1</span>
           </div>
        </div>
        <div className="space-y-3">
          {PROTOCOLS.map((p, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.05 }}
               className="flex justify-between gap-12 border-l-2 border-white/10 pl-4 py-1"
            >
               <span className="kpr-mono-label text-white/40">{p}</span>
               <span className="kpr-mono-value text-kpr-green">READY</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-20 w-full max-w-lg"> 
        <div className="kpr-panel p-12 md:p-16 bg-white shadow-2xl relative overflow-hidden">
          
          <div className="kpr-crosshair left-4 top-4" />
          <div className="kpr-crosshair right-4 bottom-4" />

          <div className="mb-14 relative group">
            <div className="flex items-center gap-3 text-kpr-black/40 kpr-mono-label mb-6">
              <Shield size={14} /> SECURITY_CLEARANCE_B
            </div>
            <div className="kpr-reveal-vertical active">
               <motion.h1 
                 initial={{ y: '100%' }}
                 animate={{ y: 0 }}
                 transition={{ duration: 0.8 }}
                 className="kpr-title-large text-kpr-black"
               >
                 SYSTEM<br />
                 <span className="text-kpr-green">UPLINK</span>
               </motion.h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2 group">
              <label className="kpr-mono-label ml-1">Operator_Identity</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ID@SDC_SYSTEM"
                  className="w-full bg-kpr-white border-b-2 border-kpr-grey p-5 pl-14 text-kpr-black placeholder:text-kpr-black/20 focus:border-kpr-green outline-none transition-all font-black text-xs"
                  required
                />
                <HardDrive size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-kpr-black/20 group-focus-within:text-kpr-green transition-colors" />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="kpr-mono-label ml-1">Access_Code</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-kpr-white border-b-2 border-kpr-grey p-5 pl-14 pr-14 text-kpr-black placeholder:text-kpr-black/20 focus:border-kpr-green outline-none transition-all font-black text-xs"
                  required
                />
                <Zap size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-kpr-black/20 group-focus-within:text-kpr-green transition-colors" />
                
                <button 
                  type="button"
                  onMouseEnter={() => soundManager.playHover()}
                  onClick={() => { soundManager.playClick(); setShowPassword(!showPassword); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-kpr-black/20 hover:text-kpr-green transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isAccessing}
              onMouseEnter={() => soundManager.playHover()}
              className="w-full mt-10 kpr-btn-notched flex items-center justify-center gap-4 disabled:bg-kpr-grey disabled:text-kpr-black/20"
            >
              {isAccessing ? (
                <>AUTHORIZING... <Loader2 size={18} className="animate-spin" /></>
              ) : (
                <>INITIATE_UPLINK <ChevronRight size={18} className="group-hover:translate-x-1" /></>
              )}
            </button>
          </form>
          
          <div className="mt-12 flex justify-between items-center bg-black p-4 border border-white/10">
             <div className="flex gap-1 items-center">
                <span className="kpr-mono-value text-white">LOC: AGRA_NORTH_NODE</span>
             </div>
             <Cpu size={14} className="text-white/20" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 right-24 text-right hidden lg:block">
         <p className="kpr-mono-label mb-2">SESSION_REF</p>
         <p className="kpr-mono-value">#{sessionRef}</p>
      </div>
    </div>
  );
}