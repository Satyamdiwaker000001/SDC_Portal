import { useState, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { playClick } from '../utils/click';
import { playType } from '../utils/typing';

export default function Login() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  
  const idRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const togglePassword = () => {
    playClick(); // Sound on eye click
    setShowPassword(!showPassword);
    setTimeout(() => {
      passRef.current?.focus();
    }, 0);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#020617] flex items-center justify-center overflow-hidden cursor-crosshair font-sans"
    >
      {/* Dynamic Spotlight Layer */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.15), transparent 80%)`
        }}
      />

      {/* VFX Textures */}
      <div className="absolute inset-0 vignette z-10 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-20" />

      {/* THE LOGIN CARD */}
      <div className="relative z-30 group/card w-full max-w-110 px-4">
        
        {/* Animated Border Beam */}
        <div className="absolute -inset-px rounded-4xl bg-linear-to-r from-blue-500/40 via-cyan-400/40 to-indigo-500/40 blur-sm opacity-20 group-hover/card:opacity-100 transition-opacity duration-700" />

        <div className="relative bg-[#050505]/90 backdrop-blur-[120px] border border-white/10 rounded-[35px] p-12 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 glass-reflection pointer-events-none" />

          <div className="relative mb-14 text-center">
             <h1 className="text-5xl font-black text-white tracking-tighter italic">
                LOGIN<span className="text-blue-500">.</span>
             </h1>
             <p className="text-slate-300 text-[9px] mt-4 font-mono tracking-[0.5em] uppercase animate-pulse">
                Software Development Cell
             </p>
          </div>

          <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
            {/* Input 1: Operator ID */}
            <div className="relative group/input" onMouseEnter={() => idRef.current?.focus()}>
              <input 
                ref={idRef}
                type="text" 
                required
                onKeyDown={() => playType()} // Typing Sound
                onClick={() => playClick()}   // Click Sound
                className="peer w-full bg-transparent border-b border-white/10 py-3 text-white text-lg outline-none focus:border-blue-500 transition-all font-light tracking-widest placeholder-transparent"
                id="op_id"
                autoComplete="off"
              />
              <label htmlFor="op_id" className="absolute left-0 top-3 text-slate-500 text-sm transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-blue-400 peer-focus:font-bold peer-valid:-top-6 peer-valid:text-[10px]">
                USER_IDENTIFICATION
              </label>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 peer-focus:w-full transition-all duration-500 shadow-[0_0_15px_#3b82f6]" />
            </div>

            {/* Input 2: Access Code */}
            <div className="relative group/input" onMouseEnter={() => passRef.current?.focus()}>
              <input 
                ref={passRef}
                type={showPassword ? "text" : "password"} 
                required
                onKeyDown={() => playType()} // Typing Sound
                onClick={() => playClick()}   // Click Sound
                className="peer w-full bg-transparent border-b border-white/10 py-3 text-white text-lg outline-none focus:border-blue-500 transition-all font-light tracking-widest placeholder-transparent"
                id="acc_key"
              />
              <label htmlFor="acc_key" className="absolute left-0 top-3 text-slate-500 text-sm transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-blue-400 peer-focus:font-bold peer-valid:-top-6 peer-valid:text-[10px]">
                USER_PASSWORD
              </label>
              
              <button 
                type="button"
                onClick={togglePassword}
                className="absolute right-0 top-3 text-slate-500 hover:text-blue-400 transition-colors z-40 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 peer-focus:w-full transition-all duration-500 shadow-[0_0_15px_#3b82f6]" />
            </div>

            <button 
              type="submit"
              onClick={() => playClick()} // Click Sound on main button
              className="group/btn relative w-full h-16 bg-white text-black font-black rounded-2xl overflow-hidden transition-all active:scale-[0.98]"
            >
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300 tracking-[0.4em] text-[10px]">
                  GET_ACCESS
                </span>
            </button>
          </form>

          <div className="mt-16 flex justify-between items-end opacity-20 font-mono text-[7px] text-white">
            <div>CORE_TEMP: OPTIMAL <br /> UPLINK: READY</div>
            <div className="text-right">RBMI_SDC <br /> v1.0.</div>
          </div>
        </div>
      </div>
    </div>
  );
}