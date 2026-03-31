/* cspell:disable */
import { Users, Linkedin, ExternalLink, Shield, Zap } from "lucide-react";
import { forwardRef } from "react";

const FoundersSection = forwardRef<HTMLElement>((_, ref) => {
  const TEAM = [
    { id: "01", name: "FOUNDER_NAME", role: "Lead Strategist" },
    { id: "02", name: "BACKEND_LEAD", role: "System Architect" },
    { id: "03", name: "SATYAM DIWAKER", role: "Lead Developer" },
  ];
  
  return (
    <section 
      ref={ref} 
      className="relative w-full min-h-screen bg-[#020203] flex flex-col items-center justify-center pt-20 pb-24 px-8 overflow-hidden"
    >
      {/* LAYER 1: Deep Radial Depth - Lightened for better performance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0ea5e904,transparent_75%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl">
        
        {/* TACTICAL HEADER - Simplified Shadows */}
        <div className="text-center mb-24 founders-header">
          <div className="inline-flex items-center gap-3 px-6 py-2 border border-sky-500/30 bg-sky-500/5 text-sky-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 shadow-sm">
             <Shield size={14} fill="currentColor" /> Architectural_Core
          </div>
          <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
            THE <span className="text-sky-500">ARCHITECTS</span>
          </h2>
          <p className="font-mono text-zinc-600 uppercase tracking-[0.4em] text-[10px] mt-6 opacity-60">
            [ Founders_Protocol: <span className="text-sky-400">ACTIVE</span> ] // Sector_Level: 01
          </p>
        </div>

        {/* FOUNDER CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TEAM.map((member) => (
            <div 
              key={member.id} 
              className="founder-card group will-change-transform transform-gpu transition-transform duration-500 hover:-translate-y-2"
            >
              {/* REMOVED: clip-path from outer div to stop rendering lag */}
              <div className="bg-[#0c0c0e] border border-white/5 p-2 group-hover:border-sky-500/30 transition-colors duration-500 rounded-sm">
                
                {/* Avatar Area */}
                <div className="aspect-[3/4] bg-[#050505] border border-white/5 flex items-center justify-center text-zinc-800 group-hover:text-sky-900 transition-colors relative overflow-hidden">
                    <Users size={80} strokeWidth={0.5} />
                    {/* Subtle hover overlay instead of heavy filters */}
                    <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent group-hover:border-sky-500/40 transition-colors duration-500" />
                </div>
                
                {/* Info Area */}
                <div className="p-8 text-center bg-black/20">
                  <h3 className="text-2xl font-black uppercase italic text-white leading-none tracking-tight group-hover:text-sky-500 transition-colors duration-500">
                    {member.name}
                  </h3>
                  <p className="text-[10px] font-bold text-sky-500/60 uppercase tracking-[0.3em] mt-3 italic">
                    {member.role}
                  </p>
                  
                  {/* Buttons */}
                  <div className="flex justify-center items-center gap-4 mt-10 pt-8 border-t border-white/5">
                    <button className="p-3 bg-white/5 text-zinc-500 hover:bg-sky-500 hover:text-black transition-colors duration-300">
                      <Linkedin size={18} />
                    </button>
                    {/* Button with simple rounded corners instead of clip-path */}
                    <button 
                      className="px-8 py-3 bg-sky-500 text-black text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:bg-white active:scale-95 rounded-sm"
                    >
                      <span className="flex items-center gap-2 italic">PROFILE <ExternalLink size={14} /></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BACKGROUND DECOR - Static with minimal opacity */}
      <div className="absolute -bottom-20 -left-20 opacity-[0.01] pointer-events-none">
        <Zap size={400} className="text-sky-500 rotate-12" strokeWidth={1} />
      </div>
      
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-sky-500/5 blur-[120px] pointer-events-none" />
    </section>
  );
});

FoundersSection.displayName = "FoundersSection";
export default FoundersSection;