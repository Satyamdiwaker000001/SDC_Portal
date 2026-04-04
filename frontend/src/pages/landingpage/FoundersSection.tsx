import { Users, Linkedin, ExternalLink } from "lucide-react";
import { forwardRef } from "react";
import { HackyText } from "../../components/shared/HackyText";
import { soundManager } from "../../utils/SoundManager";

const FoundersSection = forwardRef<HTMLElement>((_, ref) => {
  const TEAM = [
    { id: "01", name: "Founder Name", role: "Lead Strategist" },
    { id: "02", name: "Backend Lead", role: "System Architect" },
    { id: "03", name: "Satyam Diwaker", role: "Lead Developer" },
  ];
  
  return (
    <section 
      ref={ref} 
      className="relative w-full flex flex-col items-center justify-start pt-32 pb-32 px-6 bg-white"
    >
      <div className="w-full max-w-7xl">
          <div className="mb-24 flex items-center gap-6">
             <div className="w-16 h-px bg-kpr-green" />
             <HackyText text="CORE_FOUNDERS" className="kpr-mono text-kpr-black font-black" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {TEAM.map((member) => (
              <div 
                key={member.id} 
                className="group relative"
                onMouseEnter={() => soundManager.playHover()}
              >
                <div className="kpr-panel p-0 transition-all duration-500 bg-white border-black/10 hover:border-kpr-green hover:shadow-[0_40px_100px_rgba(0,0,0,0.05)]">
                  
                  {/* High-Contrast Avatar Slot */}
                  <div className="w-full aspect-square bg-black relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-40" />
                      <div className="absolute inset-0 flex items-center justify-center text-white/5">
                          <Users size={160} strokeWidth={0.2} />
                      </div>
                      
                      <div className="absolute top-6 left-6 z-20 kpr-mono text-[9px] bg-white text-black px-3 py-1 font-black">
                         REF_ID // 00{member.id}
                      </div>

                      <div className="absolute bottom-6 right-6 z-20 w-4 h-4 border-b-2 border-r-2 border-kpr-green" />
                  </div>
                  
                  <div className="p-10">
                    <HackyText 
                      text={member.name} 
                      className="text-3xl font-black text-black block mb-2" 
                    />
                    <p className="kpr-mono text-kpr-black opacity-40 mb-10 text-[10px] tracking-widest">{member.role}</p>
                    
                    <div className="flex gap-6">
                      <button 
                        onClick={() => soundManager.playClick()}
                        className="p-4 bg-black text-white hover:bg-kpr-green hover:text-black transition-all"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                      >
                         <Linkedin size={20} />
                      </button>
                      <button 
                        onClick={() => soundManager.playConfirm()}
                        className="flex-1 py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-kpr-green hover:text-black transition-all flex items-center justify-center gap-3"
                        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                      >
                        DATA_NODE <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
});

FoundersSection.displayName = "FoundersSection";
export default FoundersSection;