/* cspell:disable */
import { forwardRef } from "react";
import { Cpu } from "lucide-react"; // Removed unused Activity and Shield

const HeroWelcome = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#020203] text-white">
      
      {/* --- LAYER 1: Deep Radial Glow --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0ea5e908,transparent_70%)] pointer-events-none" />

      {/* --- LAYER 2: The Blue Tilt (Fixed: -skew-x-12) --- */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-sky-500/2 -skew-x-12 translate-x-20 z-0 border-l border-sky-500/10 backdrop-blur-[1px]" />

      {/* --- Tactical HUD Decor (Top Left) --- */}
      <div className="absolute top-32 left-10 hidden lg:block opacity-50 z-20">
        <div className="flex items-center gap-3 text-sky-400 mb-2 font-mono">
          <Cpu size={16} className="animate-pulse" /> 
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Core_System: ONLINE</span>
        </div>
        <div className="h-0.5 w-64 bg-sky-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-sky-500 w-3/4 shadow-[0_0_10px_#0ea5e9]" />
          <div className="h-full w-20 bg-white/20 absolute animate-[shimmer_2s_infinite]" />
        </div>
        <div className="mt-2 text-[8px] font-mono text-sky-500/40 uppercase tracking-widest flex justify-between w-64">
          <span>Buffer: 84%</span>
          <span>Latency: 0.02ms</span>
        </div>
      </div>

      {/* --- Authorization Access Cell (Bottom Right) --- */}
      <div className="absolute bottom-10 right-10 hidden md:block text-right opacity-50 z-20">
          <p className="text-[9px] font-bold text-sky-500/40 uppercase tracking-[0.2em] italic mb-2">
             Auth_Node_SDC // Access_Level: 01
          </p>
          <div className="flex gap-2 justify-end">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-8 h-1 bg-sky-500/20 hover:bg-sky-500 transition-all duration-500" />
            ))}
          </div>
      </div>

      {/* --- Main Content --- */}
      <div className="text-center w-full max-w-5xl px-8 relative z-10 welcome-content">
        <div className="inline-flex items-center gap-3 px-5 py-2 border border-sky-500/30 bg-sky-500/5 text-sky-400 text-[10px] font-mono uppercase tracking-[0.5em] mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-sky-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            SDC_CORE_PROTOCOL // OPERATOR_GREETINGS
        </div>
        
        <h1 className="text-7xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-[0.85] mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          ENGINEERING THE <span className="text-sky-500 drop-shadow-[0_0_20px_rgba(14,165,233,0.5)]">FUTURE</span><br/> OF TECHNOLOGY
        </h1>
        
        <p className="font-sans text-sm md:text-base text-zinc-500 max-w-2xl mx-auto uppercase tracking-[0.2em] font-black leading-relaxed">
            Welcome to the Software Development Cell. <span className="text-white">Nexus of innovation</span>, developing next-generation solutions for the digital ecosystem.
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </section>
  );
});

HeroWelcome.displayName = "HeroWelcome";
export default HeroWelcome;