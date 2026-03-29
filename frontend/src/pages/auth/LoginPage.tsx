/* cspell:disable */
import { useState } from "react";
import { Zap, Shield, ChevronRight, HardDrive, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth"; 

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAccessing, setIsAccessing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAccessing(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();

      if (cleanEmail === "admin@sdc.com") {
        login("Satyam Admin", "admin");
      } else {
        login("Satyam Dev", "developer");
      }

      setIsAccessing(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased">
      
      {/* Background Decor (Orange Accent) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/[0.03] skew-x-[-20deg] translate-x-32 z-0 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none z-0" 
           style={{ backgroundImage: `radial-gradient(#f97316 0.8px, transparent 0.8px)`, backgroundSize: '40px 40px' }} />

      {/* LOGIN FRAME - Restored to max-w-125 */}
      <div className="relative z-10 w-full max-w-[500px]"> 
        <div className="bg-zinc-900/40 backdrop-blur-xl p-[1px] shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/5" 
             style={{ clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' }}>
          
          <div className="bg-black p-10 md:p-14" 
               style={{ clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' }}>
            
            <div className="mb-14">
              <div className="flex items-center gap-3 text-orange-500 font-black italic text-[10px] mb-6 uppercase tracking-[0.5em]">
                <Shield size={16} className="drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" /> Auth_Protocol_v4
              </div>
              <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.85]">
                SYSTEM <br /> <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]">ACCESS</span>
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-1">Operator_Handle</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sdc.com / dev@sdc.com"
                    className="w-full bg-zinc-900/30 border-l-2 border-zinc-800 p-4 pl-14 text-white placeholder:text-zinc-700 focus:border-orange-500 focus:bg-orange-500/5 focus:outline-none transition-all font-bold text-sm"
                    required
                  />
                  <HardDrive size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-orange-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-1">Access_Code</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/30 border-l-2 border-zinc-800 p-4 pl-14 text-white placeholder:text-zinc-700 focus:border-orange-500 focus:bg-orange-500/5 focus:outline-none transition-all font-bold text-sm"
                    required
                  />
                  <Zap size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-orange-500 transition-colors" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isAccessing}
                className="w-full mt-10 group bg-orange-500 hover:bg-white disabled:bg-zinc-900 text-black font-black uppercase py-6 text-xs tracking-[0.5em] transition-all flex items-center justify-center gap-4 relative overflow-hidden active:scale-[0.98]"
                style={{ clipPath: 'polygon(0 0, 92% 0, 100% 25%, 100% 100%, 8% 100%, 0 75%)' }}
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isAccessing ? (
                  <>AUTHORIZING... <Loader2 size={18} className="animate-spin text-black" /></>
                ) : (
                  <>INITIALIZE_BOOT <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}