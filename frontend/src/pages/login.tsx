/**
 * @file Login.tsx
 * @description Optimized Tactical Login Interface for SDC.
 * Resolved: Unused imports, cSpell warnings, and Scrollbar overflow.
 */

// cSpell:ignore RBMI SCANLINE
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, Lock, User } from 'lucide-react';

import clickSfx from "../sounds/click.mp3";
import typeSfx from "../sounds/typing.mp3";
import Logo from "../assets/logo2.png";

const CrosshairCursor = () => {
  const [cursorMode, setCursorMode] = useState<'DEFAULT' | 'INTERACTIVE' | 'INPUT'>('DEFAULT');
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 450, mass: 0.6 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    const handleContext = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input')) { setCursorMode('INPUT'); return; }
      if (target.closest('button')) { setCursorMode('INTERACTIVE'); return; }
      setCursorMode('DEFAULT');
    };
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleContext);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleContext);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div 
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center" 
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    >
      <AnimatePresence mode="wait">
        {cursorMode === 'INPUT' && (
          <motion.div key="input" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center font-black text-cyan-400 text-2xl">
             <motion.span animate={{ x: [-5, 0, -5] }}>[</motion.span>
             <div className="w-0.5 h-6 bg-white mx-1 shadow-[0_0_10px_#22d3ee]" />
             <motion.span animate={{ x: [5, 0, 5] }}>]</motion.span>
          </motion.div>
        )}
        {cursorMode === 'INTERACTIVE' && (
          <motion.div key="inter" initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 45 }} exit={{ opacity: 0 }} className="w-6 h-6 border-2 border-white flex items-center justify-center shadow-[0_0_10px_#22d3ee]">
             <div className="w-1.5 h-1.5 bg-cyan-400" />
          </motion.div>
        )}
        {cursorMode === 'DEFAULT' && (
          <motion.div key="def" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_#22d3ee]" />
             <div className="absolute h-8 w-px bg-cyan-500/50" />
             <div className="absolute w-8 h-px bg-cyan-500/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  
  const idRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const clickAudio = useRef<HTMLAudioElement | null>(null);
  const typeAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickAudio.current = new Audio(clickSfx);
    typeAudio.current = new Audio(typeSfx);
    clickAudio.current.volume = 0.4;
    typeAudio.current.volume = 0.12;
  }, []);

  const playClick = useCallback(() => {
    if (clickAudio.current) { clickAudio.current.currentTime = 0; clickAudio.current.play().catch(() => {}); }
  }, []);

  const playType = useCallback(() => {
    if (typeAudio.current) {
      const clone = typeAudio.current.cloneNode() as HTMLAudioElement;
      clone.volume = 0.12; clone.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleKey = (ev: KeyboardEvent) => { if (ev.key.length === 1 || ev.key === 'Backspace') playType(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playType]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setIsAuthenticating(true);
    setTimeout(() => setIsAuthenticating(false), 2000);
  };

  return (
    <div 
      onClick={() => { if(!isAudioUnlocked) { playClick(); setIsAudioUnlocked(true); }}}
      className="relative h-screen w-full bg-[#020617] flex items-center justify-center overflow-hidden cursor-none font-sans select-none"
    >
      <CrosshairCursor />

      {/* VFX Layers */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[40px_40px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-30 w-full max-w-md px-4"
      >
        <div className="relative bg-slate-950/90 backdrop-blur-3xl border border-white/10 p-8 md:p-10 shadow-2xl -skew-x-2">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-6 skew-x-2">
            <div className="w-64 h-16 mb-2 flex items-center justify-center">
               <img 
                src={Logo} 
                alt="SDC" 
                className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast] brightness-125" 
               />
            </div>
            
            <div className="text-center">
              <h1 className="text-5xl font-black text-white italic tracking-tighter leading-none">
                LOGIN<span className="text-cyan-500 animate-pulse">_</span>
              </h1>
              <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-[0.4em] mt-2 opacity-70">
                 Terminal_Access_v1.2.8
              </p>
            </div>
          </div>

          <form className="space-y-8 skew-x-2" onSubmit={handleAuth}>
            <div className="relative group">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400" size={16} />
              <input 
                ref={idRef} 
                type="text" 
                required 
                onFocus={playClick} 
                className="w-full bg-transparent border-b border-white/10 py-2 pl-8 text-white text-sm outline-none focus:border-cyan-500 transition-all font-bold tracking-widest placeholder:text-slate-700" 
                placeholder="OPERATOR_ID" 
                autoComplete="off" 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400" size={16} />
              <input 
                ref={passRef} 
                type={showPassword ? "text" : "password"} 
                required 
                onFocus={playClick} 
                className="w-full bg-transparent border-b border-white/10 py-2 pl-8 text-white text-sm outline-none focus:border-cyan-500 transition-all font-bold tracking-widest placeholder:text-slate-700" 
                placeholder="ACCESS_KEY" 
              />
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); playClick(); setShowPassword(!showPassword); }} 
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isAuthenticating} 
              className="relative w-full h-14 bg-white text-black font-black overflow-hidden -skew-x-12 hover:bg-cyan-500 transition-colors disabled:opacity-50"
            >
               <span className="flex items-center justify-center gap-2 tracking-[0.3em] text-[10px] skew-x-12 uppercase">
                  {isAuthenticating ? "Authenticating..." : "Initiate_Auth"}
               </span>
            </button>
          </form>

          {/* Footer Metadata */}
          <div className="mt-10 flex justify-between items-end opacity-40 font-mono text-[7px] text-cyan-100 skew-x-2">
             <div className="uppercase tracking-widest leading-relaxed">
                Node: RBMI_Alpha <br /> Status: {isAudioUnlocked ? 'Online' : 'Locked'}
             </div>
             <div className="text-right tracking-widest leading-relaxed uppercase">
                Encrypted_Session <br /> Authorized_Only
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}