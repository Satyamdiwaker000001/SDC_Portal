import { useState, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { playClick } from '../utils/click';
import { playType } from '../utils/typing';
import LOGO from '../assets/SDC1.png';

export default function Login() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  
  const idRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Spotlight moving with mouse
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
      className="relative h-screen w-full bg-[#020617] flex items-center justify-center overflow-hidden font-sans select-none"
    >
      {/* --- TAILWIND PROCEDURAL BACKGROUND START --- */}
      
      {/* 1. The Cyber Grid - Har 40px par ek barik line */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* 2. Floating Ambient Orbs (Static for stability) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />

      {/* 3. Interactive Mouse Spotlight */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.12), transparent 80%)`
        }}
      />

      {/* 4. Vignette for Focus */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle,transparent_20%,#020617_100%)]" />

      {/* --- TAILWIND PROCEDURAL BACKGROUND END --- */}

      {/* THE LOGIN CARD */}
      <div className="relative z-30 group/card w-full max-w-[420px] px-6">
        
        {/* Animated Border Beam */}
        <div className="absolute -inset-px rounded-3xl bg-linear-to-r from-blue-500/40 via-cyan-400/40 to-indigo-500/40 blur-sm opacity-20 group-hover/card:opacity-100 transition-opacity duration-700" />

        <div className="relative bg-[#050505]/90 backdrop-blur-[100px] border border-white/10 rounded-3xl p-8 md:p-10 overflow-hidden shadow-2xl">
          
          {/* Header Section */}
          <div className="relative mb-8 text-center">
             <div className="flex justify-center">
                {/* Logo size increased to h-44 (176px) */}
                <img 
                  src={LOGO} 
                  alt="SDC Logo" 
                  className="h-44 w-auto object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                />
             </div>
             <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">
                LOGIN<span className="text-blue-500">.</span>
             </h1>
             <p className="text-slate-500 text-[8px] mt-1 font-mono tracking-[0.5em] uppercase opacity-70">
                Software Development Cell
             </p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Input 1: User ID */}
            <div className="relative group/input" onMouseEnter={() => idRef.current?.focus()}>
              <input 
                ref={idRef}
                type="text" 
                required
                onKeyDown={() => playType()}
                onClick={() => playClick()}
                className="peer w-full bg-transparent border-b border-white/10 py-2.5 text-white text-lg outline-none focus:border-blue-500 transition-all font-light tracking-widest placeholder-transparent"
                id="op_id"
                autoComplete="off"
              />
              <label htmlFor="op_id" className="absolute left-0 top-2.5 text-slate-500 text-sm transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-blue-400 peer-focus:font-bold peer-valid:-top-6 peer-valid:text-[10px]">
                USER_IDENTIFICATION
              </label>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 peer-focus:w-full transition-all duration-500 shadow-[0_0_15px_#3b82f6]" />
            </div>

            {/* Input 2: Password */}
            <div className="relative group/input" onMouseEnter={() => passRef.current?.focus()}>
              <input 
                ref={passRef}
                type={showPassword ? "text" : "password"} 
                required
                onKeyDown={() => playType()}
                onClick={() => playClick()}
                className="peer w-full bg-transparent border-b border-white/10 py-2.5 text-white text-lg outline-none focus:border-blue-500 transition-all font-light tracking-widest placeholder-transparent"
                id="acc_key"
              />
              <label htmlFor="acc_key" className="absolute left-0 top-2.5 text-slate-500 text-sm transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-blue-400 peer-focus:font-bold peer-valid:-top-6 peer-valid:text-[10px]">
                USER_PASSWORD
              </label>
              
              <button 
                type="button"
                onClick={togglePassword}
                className="absolute right-0 top-2.5 text-slate-500 hover:text-blue-400 transition-colors z-40 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 peer-focus:w-full transition-all duration-500 shadow-[0_0_15px_#3b82f6]" />
            </div>

            <button 
              type="submit"
              onClick={() => playClick()}
              className="group/btn relative w-full h-12 bg-white text-black font-black rounded-xl overflow-hidden active:scale-[0.98] transition-all"
            >
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300 tracking-[0.4em] text-[10px]">
                  GET_ACCESS
                </span>
            </button>
          </form>

          {/* Footer Metadata */}
          <div className="mt-8 flex justify-between items-end opacity-20 font-mono text-[7px] text-white">
            <div className="uppercase leading-tight">Status: Ready <br /> Core: Stable</div>
            <div className="text-right uppercase leading-tight">RBMI_SDC_X <br /> v1.5.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}