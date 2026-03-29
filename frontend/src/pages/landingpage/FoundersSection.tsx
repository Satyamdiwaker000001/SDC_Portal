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
      className="relative w-full min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center pt-48 pb-24 px-8 overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-6xl">
        
        {/* --- TACTICAL HEADER (Orange) --- */}
        <div className="text-center mb-24 founders-header">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6"
               style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}>
            <Shield size={14} fill="currentColor" /> Architectural_Core
          </div>
          <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
            THE <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">ARCHITECTS</span>
          </h2>
          <p className="font-mono text-zinc-500 uppercase tracking-[0.4em] text-[10px] mt-6 opacity-60">
            [ Founders_Protocol: <span className="text-orange-500">ACTIVE</span> ] // Sector_Level: 01
          </p>
        </div>

        {/* --- FOUNDER CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TEAM.map((member) => (
            <div 
              key={member.id} 
              className="founder-card group transition-transform duration-500 hover:-translate-y-2"
              style={{ clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' }}
            >
              <div className="bg-zinc-900/50 border border-zinc-800 p-2 group-hover:border-orange-500/50 transition-all duration-500 shadow-[20px_20px_60px_rgba(0,0,0,0.8)]">
                
                {/* Avatar Area */}
                <div className="aspect-[3/4] bg-black border border-zinc-800 flex items-center justify-center text-zinc-800 group-hover:text-orange-900 transition-colors relative overflow-hidden">
                    <Users size={80} strokeWidth={0.5} />
                    <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500/0 group-hover:border-orange-500/40 transition-all" />
                </div>
                
                {/* Info Area */}
                <div className="p-8 text-center bg-black/40">
                  <h3 className="text-2xl font-black uppercase italic text-white leading-none tracking-tight group-hover:text-orange-500 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[10px] font-bold text-orange-500/60 uppercase tracking-[0.3em] mt-3 italic">
                    {member.role}
                  </p>
                  
                  {/* Buttons */}
                  <div className="flex justify-center items-center gap-4 mt-10 pt-8 border-t border-zinc-800/50">
                    <button className="p-3 bg-zinc-800 text-zinc-500 hover:bg-orange-500 hover:text-black transition-all">
                      <Linkedin size={18} />
                    </button>
                    <button 
                      className="px-8 py-3 bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white active:scale-95 shadow-[0_5px_15px_rgba(249,115,22,0.2)]"
                      style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)' }}
                    >
                      <span className="flex items-center gap-2">PROFILE <ExternalLink size={14} /></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BACKGROUND DECOR (Orange Ghost Zap) --- */}
      <div className="absolute -bottom-20 -left-20 opacity-5 pointer-events-none">
        <Zap size={400} className="text-orange-500 rotate-12" strokeWidth={1} />
      </div>
      
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-orange-500/5 blur-[120px] pointer-events-none" />
    </section>
  );
});

FoundersSection.displayName = "FoundersSection";
export default FoundersSection;