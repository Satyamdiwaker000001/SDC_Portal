// cSpell:ignore barik RBMI SCANLINE
import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, User, Activity } from 'lucide-react';

// Local Sound Assets
import clickSfx from "../sounds/click.mp3";
import typeSfx from "../sounds/type.mp3";

// Logo Asset
import Logo from "../assets/logo2.png";

export default function Login() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  
  const idRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  // --- AUDIO ENGINE ---
  const playClick = () => {
    const audio = new Audio(clickSfx);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const playType = () => {
    const audio = new Audio(typeSfx);
    audio.volume = 0.15;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const handleKeyDown = () => playType();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const togglePassword = () => {
    playClick();
    setShowPassword(!showPassword);
    setTimeout(() => passRef.current?.focus(), 0);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#020617] flex items-center justify-center overflow-hidden cursor-none font-sans"
    >
      {/* 1. CYBER GRID BACKGROUND - Updated bg-size */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[40px_40px]" />
      
      {/* 2. SCANLINE EFFECT - Updated bg-size */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />

      {/* 3. MOUSE SPOTLIGHT */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.1), transparent 80%)`
        }}
      />

      {/* 4. LOGIN CONTENT - Updated max-w */}
      <div className="relative z-30 group/card w-full max-w-112.5 px-6">
        
        {/* Glowing Decorative Corners */}
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-500/30" />
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-500/30" />

        {/* The Card */}
        <div className="relative bg-slate-950/80 backdrop-blur-2xl border-t-2 border-white/5 p-10 shadow-2xl -skew-x-2">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-12 skew-x-2">
            <div className="w-48 h-12 mb-4 relative flex items-center justify-center">
               <img src={Logo} alt="SDC" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-3">
               <div className="h-px w-8 bg-cyan-500/30" />
               <span className="text-[9px] font-black text-cyan-400 tracking-[0.5em] uppercase italic drop-shadow-[0_0_8px_#22d3ee]">
                  Secure_Uplink
               </span>
               <div className="h-px w-8 bg-cyan-500/30" />
            </div>
          </div>

          <form className="space-y-10 skew-x-2" onSubmit={(e) => { e.preventDefault(); playClick(); }}>
            
            {/* Operator ID Input */}
            <div className="relative group/input">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-cyan-500 transition-colors">
                 <User size={16} />
              </div>
              <input 
                ref={idRef}
                type="text" 
                required
                onClick={playClick}
                className="peer w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white text-sm outline-none focus:border-cyan-500 transition-all font-bold tracking-widest placeholder-transparent"
                id="op_id"
                autoComplete="off"
              />
              <label htmlFor="op_id" className="absolute left-8 top-3 text-slate-500 text-[10px] uppercase font-black tracking-widest transition-all peer-focus:-top-6 peer-focus:left-0 peer-focus:text-cyan-400 peer-valid:-top-6 peer-valid:left-0">
                Operator_Identification
              </label>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-cyan-500 peer-focus:w-full transition-all duration-700 shadow-[0_0_15px_#22d3ee]" />
            </div>

            {/* Access Key Input */}
            <div className="relative group/input">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-cyan-500 transition-colors">
                 <Lock size={16} />
              </div>
              <input 
                ref={passRef}
                type={showPassword ? "text" : "password"} 
                required
                onClick={playClick}
                className="peer w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white text-sm outline-none focus:border-cyan-500 transition-all font-bold tracking-widest placeholder-transparent"
                id="acc_key"
              />
              <label htmlFor="acc_key" className="absolute left-8 top-3 text-slate-500 text-[10px] uppercase font-black tracking-widest transition-all peer-focus:-top-6 peer-focus:left-0 peer-focus:text-cyan-400 peer-valid:-top-6 peer-valid:left-0">
                Access_Protocol_Key
              </label>
              
              <button 
                type="button"
                onClick={togglePassword}
                className="absolute right-0 top-3 text-slate-600 hover:text-cyan-400 transition-colors z-40"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

              <div className="absolute bottom-0 left-0 h-px w-0 bg-cyan-500 peer-focus:w-full transition-all duration-700 shadow-[0_0_15px_#22d3ee]" />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="group/btn relative w-full h-14 bg-white text-black font-black overflow-hidden transition-all active:scale-[0.98] -skew-x-12"
            >
                <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-3 group-hover/btn:text-black transition-colors duration-300 tracking-[0.3em] text-[11px] skew-x-12">
                  INITIATE_AUTH <ShieldCheck size={16} />
                </span>
            </button>
          </form>

          {/* Footer Metadata */}
          <div className="mt-12 flex justify-between items-end opacity-20 font-mono text-[7px] text-white skew-x-2">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <Activity size={8} className="text-cyan-400 animate-pulse" />
                  <span>ENCRYPTION: AES_256_SDC</span>
               </div>
               <div>UPLINK: ACTIVE_NODE_RBMI</div>
            </div>
            <div className="text-right">
               PROPERTY_OF_SDC <br /> 
               AUTHORIZED_ONLY.v1
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM CROSSHAIR - Updated z-index */}
      <div 
        className="fixed w-8 h-8 pointer-events-none z-1000 mix-blend-difference"
        style={{ left: mousePos.x - 16, top: mousePos.y - 16 }}
      >
        <div className="absolute inset-0 border border-cyan-500/50 rounded-full animate-ping" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-500/50" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-500/50" />
      </div>
    </div>
  );
}