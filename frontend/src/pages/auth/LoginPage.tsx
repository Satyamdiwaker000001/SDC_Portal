/* cspell:disable */
import { useState } from "react";
import { 
  Zap, Shield, ChevronRight, HardDrive, 
  Loader2, Cpu, Network, Eye, EyeOff 
} from "lucide-react"; // TerminalIcon removed as it was unused
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth"; 

const PROTOCOLS = [
  "Forge_Protocol_v4.5::INITIALIZING",
  "Neural_Net::CONNECTING...",
  "Sector_7_Auth::AWAITING_HANDSHAKE",
  "Encryption::AES-256_ACTIVE",
  "Operative_Dossier::LOADING",
  "System_Integrity::OPTIMAL",
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);
  // isTerminalOpen state removed as it was unused

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen w-full bg-[#020203] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased selection:bg-sky-500/30">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* Side Status HUD */}
      <div className="absolute top-10 left-10 z-10 opacity-30 pointer-events-none hidden xl:block font-mono text-[8px] text-sky-400 space-y-2 uppercase tracking-widest">
        <div className="flex items-center gap-2 mb-4 border-b border-sky-500/20 pb-2">
            <Network size={12} /> UPLINK_ESTABLISHED
        </div>
        {PROTOCOLS.map((p, i) => (
          <div key={i} className="flex justify-between gap-10">
            <span>{p}</span>
            <span className="text-zinc-700">READY</span>
          </div>
        ))}
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/5 -skew-x-20 translate-x-32 z-0 pointer-events-none blur-[100px]" />

      {/* LOGIN CARD */}
      <div className="relative z-20 w-full max-w-lg"> 
        <div className="bg-zinc-900/20 backdrop-blur-2xl p-px shadow-2xl border border-sky-500/20" 
             style={{ clipPath: 'polygon(0 0, 96% 0, 100% 4%, 100% 100%, 4% 100%, 0 96%)' }}>
          
          <div className="bg-[#020203]/95 p-10 md:p-14 relative overflow-hidden" 
               style={{ clipPath: 'polygon(0 0, 96% 0, 100% 4%, 100% 100%, 4% 100%, 0 96%)' }}>
            
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-sky-500/50" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-sky-500/50" />

            <div className="mb-14">
              <div className="flex items-center gap-3 text-sky-500/60 font-black italic text-[9px] mb-6 uppercase tracking-[0.5em]">
                <Shield size={14} className="animate-pulse" /> SECURITY_LEVEL_A
              </div>
              <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
                SDC <br /> <span className="text-sky-500 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]">PORTAL</span>
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2 group">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">Operator_Identity</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ADMIN@SDC.COM"
                    className="w-full bg-zinc-950/50 border-l-2 border-zinc-800 p-4 pl-14 text-white placeholder:text-zinc-900 focus:border-sky-500 focus:bg-sky-500/5 focus:outline-none transition-all font-bold text-sm"
                    required
                  />
                  <HardDrive size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-sky-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">Access_Code</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/50 border-l-2 border-zinc-800 p-4 pl-14 pr-12 text-white placeholder:text-zinc-900 focus:border-sky-500 focus:bg-sky-500/5 focus:outline-none transition-all font-bold text-sm"
                    required
                  />
                  <Zap size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-sky-500 transition-colors" />
                  
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-sky-400 transition-colors focus:outline-none"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isAccessing}
                className="w-full mt-10 group bg-sky-500 hover:bg-white disabled:bg-zinc-900 text-black font-black uppercase py-6 text-[10px] tracking-[0.5em] transition-all flex items-center justify-center gap-4 relative overflow-hidden"
                style={{ clipPath: 'polygon(0 0, 94% 0, 100% 20%, 100% 100%, 6% 100%, 0 80%)' }}
              >
                {isAccessing ? (
                  <>AUTHORIZING... <Loader2 size={18} className="animate-spin" /></>
                ) : (
                  <>INITIALIZE_SESSION <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
            
            <div className="mt-12 flex justify-between items-center opacity-30">
               <div className="flex gap-1 items-center">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-sky-400">Node:agra_01_core</span>
               </div>
               <Cpu size={14} className="text-sky-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}