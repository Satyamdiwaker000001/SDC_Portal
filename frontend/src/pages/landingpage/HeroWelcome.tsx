import { forwardRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react"; 
import { HackyText } from "../../components/shared/HackyText";
import { soundManager } from "../../utils/SoundManager";

const HeroWelcome = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="relative h-screen w-full flex flex-col items-center justify-center pt-20 overflow-hidden bg-white">
      
      {/* Structural Grid Elements */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-slate-grey-200/50" />
      <div className="absolute top-0 left-1/3 w-px h-full bg-slate-grey-200/50" />
      
      {/* Markers */}
      <div className="kpr-marker left-1/3 top-1/4" />
      <div className="kpr-marker right-12 top-40" />
      <div className="kpr-marker left-20 bottom-40" />

      {/* Premium Glassmorphic Geometry */}
      <div className="absolute top-[-5%] right-[-5%] w-[800px] h-[800px] bg-sky-100/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      {/* --- Main Content --- */}
      <div className="text-left w-full max-w-7xl px-8 relative z-10 welcome-content flex flex-col items-start pt-10 pl-6 md:pl-32">
        
        <div className="mb-10 inline-flex items-center gap-4 px-6 py-3 bg-white border-2 border-slate-grey-200 shadow-sm rounded-r-full border-l-8 border-l-sky-500">
            <Sparkles size={18} className="text-sky-500" />
            <HackyText text="SDC INNOVATION NEXUS" className="kpr-mono text-carbon-black-DEFAULT" />
        </div>
        
        <div className="relative mb-12">
            <h1 className="text-[120px] md:text-[180px] font-black leading-[0.8] text-carbon-black-DEFAULT tracking-[-0.06em] uppercase">
              Engineering<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-300 italic ml-4 md:ml-12 drop-shadow-sm">
                The Future
              </span>
            </h1>
            <div className="absolute -top-6 -right-12 kpr-mono opacity-20 rotate-90 origin-left">
               COORD_SYS // 40.7128N_74.0060W
            </div>
        </div>
        
        <div className="relative max-w-2xl ml-4 md:ml-12">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-sky-500" />
            <p className="text-xl md:text-2xl text-slate-grey-600 font-bold leading-relaxed mb-12 bg-white/50 backdrop-blur-sm p-8 rounded-tr-3xl border-r-2 border-b-2 border-slate-grey-100 shadow-sm">
                Developing next-generation, premium code and solutions for the global digital ecosystem. <span className="text-sky-500 font-mono text-sm underline ml-2 cursor-pointer hover:text-sky-600">LATEST_INTEL &rarr;</span>
            </p>
        </div>

        <div className="flex gap-8 flex-col sm:flex-row ml-4 md:ml-12">
            <button 
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playConfirm()}
              className="px-12 py-6 bg-carbon-black-DEFAULT text-white kpr-mono kpr-btn hover:bg-sky-500 flex items-center justify-center gap-4 group transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95"
            >
               Enter Workspace
               <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              className="px-12 py-6 bg-white text-carbon-black-DEFAULT kpr-mono border-2 border-slate-grey-200 rounded-none hover:bg-slate-grey-50 hover:border-sky-500 transition-all shadow-sm active:scale-95"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 80% 100%, 0 100%)' }}
            >
               Learn More
            </button>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 kpr-mono opacity-40 text-right">
         <p>REF // SDC-001</p>
         <p>UPLINK_STABLE // 99.9%</p>
      </div>
    </section>
  );
});

HeroWelcome.displayName = "HeroWelcome";
export default HeroWelcome;