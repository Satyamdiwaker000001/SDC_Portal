/* cspell:disable */
import { forwardRef } from "react";
import { Cpu, Zap } from "lucide-react";

const HeroWelcome = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a] text-white">
      
      {/* Tactical HUD Decor */}
      <div className="absolute top-32 left-10 hidden lg:block opacity-30">
        <div className="flex items-center gap-3 text-orange-500 mb-2 font-mono">
          <Cpu size={16} /> <span className="text-[10px] font-black tracking-[0.3em] uppercase">Core_System: ONLINE</span>
        </div>
        <div className="h-0.5 w-64 bg-orange-500/20"><div className="h-full bg-orange-500 w-3/4 animate-pulse" /></div>
      </div>

      <div className="absolute bottom-10 right-10 hidden md:block text-right opacity-30">
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] italic mb-1">Authorization_Access_Cell</p>
          <div className="flex gap-1 justify-end">
            {[...Array(5)].map((_, i) => <div key={i} className="w-6 h-6 border border-white/20 flex items-center justify-center"><Zap size={10} className="text-orange-500" /></div>)}
          </div>
      </div>

      {/* Main Professional Welcome Message */}
      <div className="text-center w-full max-w-5xl px-8 relative z-10 welcome-content">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[10px] font-mono uppercase tracking-[0.4em] mb-8 animate-pulse">
            SDC_CORE_PROTOCOL // OPERATOR_GREETINGS
        </div>
        
        <h1 className="text-7xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-8">
          ENGINEERING THE <span className="text-orange-500">FUTURE</span><br/> OF TECHNOLOGY
        </h1>
        
        <p className="font-sans text-sm md:text-base text-slate-400 max-w-2xl mx-auto uppercase tracking-wider font-bold">
            Welcome to the Software Development Cell. nexus of innovation, developing next-generation solutions for the digital ecosystem.
        </p>
      </div>

      {/* Outer Slanted Overlay */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/5 skew-x-[-15deg] translate-x-20 z-0" />
    </section>
  );
});

HeroWelcome.displayName = "HeroWelcome";
export default HeroWelcome;