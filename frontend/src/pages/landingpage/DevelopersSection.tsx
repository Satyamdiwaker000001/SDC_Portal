import { useState, forwardRef } from "react";
import { Zap, X, Terminal, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HackyText } from "../../components/shared/HackyText";
import { soundManager } from "../../utils/SoundManager";

interface Operative {
  id: string;
  name: string;
  role: string;
  status: string;
  level: string;
  tech: string[];
  image: string;
}

const DevelopersSection = forwardRef<HTMLElement>((_, ref) => {
  const [selectedOp, setSelectedOp] = useState<Operative | null>(null);
  const [activeTab, setActiveTab ] = useState<'ACTIVE' | 'ARCHIVE'>('ACTIVE');
  const [holdingId, setHoldingId] = useState<string | null>(null);

  const OPERATIVES: Operative[] = [
    { 
      id: "SDC-OP-001", 
      name: "Alpha_One", 
      role: "Frontend Specialist", 
      status: "Active", 
      level: "Senior", 
      tech: ["React", "GLSL", "GSAP"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop&grayscale=1"
    },
    { 
      id: "SDC-OP-002", 
      name: "Zeta_Zero", 
      role: "Backend Architect", 
      status: "Active", 
      level: "Senior", 
      tech: ["Node", "Go", "Redis"],
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop&grayscale=1"
    },
    { 
      id: "SDC-OP-003", 
      name: "Apex_Dev", 
      role: "UI Designer", 
      status: "Active", 
      level: "Mid", 
      tech: ["Figma", "Tailwind", "Motion"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop&grayscale=1"
    },
    { 
      id: "SDC-OP-004", 
      name: "Cyber_Script", 
      role: "Fullstack Engineer", 
      status: "Active", 
      level: "Junior", 
      tech: ["TS", "Next.js", "SQL"],
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&h=256&auto=format&fit=crop&grayscale=1"
    },
    { 
      id: "SDC-OLD-092", 
      name: "Ghost_Node", 
      role: "Legacy Architect", 
      status: "Former", 
      level: "Ex-Lead", 
      tech: ["C++", "Python", "Docker"],
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=256&h=256&auto=format&fit=crop&grayscale=1"
    },
    { 
      id: "SDC-OLD-071", 
      name: "Void_Dev", 
      role: "Former Frontend", 
      status: "Former", 
      level: "Senior", 
      tech: ["Vue", "D3.js", "PHP"],
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop&grayscale=1"
    },
  ];

  const filteredOps = OPERATIVES.filter(op => 
    activeTab === 'ACTIVE' ? op.status === 'Active' : op.status === 'Former'
  );

  return (
    <section ref={ref} className="relative w-full py-48 px-6 bg-[#fdfdfd]">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Header & Filter Control */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
               <div className="w-16 h-px bg-kpr-green" />
               <HackyText text="PERSONNEL_REGISTRY" className="kpr-mono text-black font-black uppercase text-[10px] tracking-widest" />
            </div>
            <h2 className="text-6xl md:text-8xl font-black italic text-black tracking-tighter uppercase leading-none">THE_OPERATIVES</h2>
          </div>

          <div className="flex bg-black p-1">
             {(['ACTIVE', 'ARCHIVE'] as const).map(tab => (
               <button
                 key={tab}
                 onClick={() => { soundManager.playSlide(); setActiveTab(tab); }}
                 className={`px-10 py-4 kpr-mono text-[10px] font-black tracking-widest transition-all ${
                   activeTab === tab ? 'bg-kpr-green text-black' : 'text-white/40 hover:text-white'
                 }`}
               >
                 {tab}
               </button>
             ))}
          </div>
        </div>

        {/* Grid Array */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredOps.map((op) => (
            <motion.div 
              key={op.id}
              onMouseDown={() => { setHoldingId(op.id); soundManager.playHover(); }}
              onMouseUp={() => { if(holdingId === op.id) { soundManager.playConfirm(); setSelectedOp(op); } setHoldingId(null); }}
              onMouseLeave={() => setHoldingId(null)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`kpr-panel p-10 cursor-pointer group transition-all bg-white relative overflow-hidden ${
                holdingId === op.id ? 'border-kpr-green shadow-[0_0_30px_rgba(0,0,0,0.1)]' : 'border-black/5 hover:border-black/20'
              }`}
            >
              {/* Charge Bar for Hold */}
              {holdingId === op.id && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-0 left-0 h-1 bg-kpr-green z-20"
                />
              )}

              <div className="flex justify-between items-start mb-12">
                 <div className="w-16 h-16 bg-black relative p-0.5 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
                    <img 
                      src={op.image} 
                      alt={op.name}
                      className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 border border-white/10" />
                 </div>
                 <div className="flex flex-col items-end opacity-20 group-hover:opacity-100 transition-opacity">
                    <span className="kpr-mono text-[8px] font-black">ID_REF</span>
                    <span className="kpr-mono text-[9px] font-black">{op.id}</span>
                 </div>
              </div>

              <HackyText 
                text={op.name} 
                className="text-3xl font-black text-black block mb-2 group-hover:text-kpr-green transition-colors leading-none tracking-tighter" 
              />
              <p className="kpr-mono text-black opacity-40 text-[10px] tracking-widest mb-10 uppercase font-black">{op.role}</p>
              
              <div className="flex items-center justify-between pt-8 border-t border-black/5">
                 <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${op.status === 'Active' ? 'bg-kpr-green animate-pulse' : 'bg-black/20'}`} />
                    <span className="kpr-mono text-[10px] font-black uppercase text-black/60 tracking-widest">
                       {op.status === 'Active' ? 'DEPLOYED' : 'DECOMMISSIONED'}
                    </span>
                 </div>
                 <Cpu size={18} className="text-black/10 group-hover:text-kpr-green transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Dossier */}
      <AnimatePresence>
        {selectedOp && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl" 
              onClick={() => setSelectedOp(null)} 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="kpr-panel w-full max-w-4xl bg-white relative z-10 p-0 overflow-hidden border-white/10"
            >
              {/* Modal Header */}
              <div className="bg-black text-white p-10 flex justify-between items-center border-b border-white/5">
                 <div className="flex items-center gap-6">
                    <div className="w-10 h-10 border border-kpr-green flex items-center justify-center text-kpr-green animate-pulse">
                      <Terminal size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="kpr-mono text-[10px] font-black tracking-widest text-kpr-green uppercase leading-none mb-1">OPERATIVE_DOSSIER // ACCESS_GRANTED</span>
                      <span className="kpr-mono text-[12px] font-black text-white/40 tracking-[0.3em]">{selectedOp.id}</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => { soundManager.playClick(); setSelectedOp(null); }} 
                  className="w-12 h-12 bg-white/5 hover:bg-kpr-green hover:text-black flex items-center justify-center text-white transition-all duration-300"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
                 >
                    <X size={24} />
                 </button>
              </div>

              <div className="p-12 md:p-20 grid grid-cols-1 md:grid-cols-5 gap-20 bg-[#fdfdfd]">
                 <div className="md:col-span-2 space-y-12">
                    <div className="w-full aspect-square bg-black relative group overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 48px 100%, 0 calc(100% - 48px))' }}>
                       <img 
                          src={selectedOp.image} 
                          alt={selectedOp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                       />
                       <div className="absolute inset-0 bg-kpr-green/10 mix-blend-overlay" />
                       <div className="absolute top-6 left-6 p-2 bg-black text-kpr-green kpr-mono text-[8px] font-black">STABLE_UPLINK</div>
                    </div>
                    
                    <div>
                      <h3 className="text-6xl font-black text-black mb-4 leading-none italic tracking-tighter uppercase">{selectedOp.name}</h3>
                      <p className="kpr-mono text-kpr-green font-black tracking-[0.25em] text-[12px] uppercase">{selectedOp.role}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-6 bg-black flex flex-col gap-2">
                          <span className="kpr-mono text-[8px] font-black text-white/30 tracking-widest">CLEARANCE</span>
                          <span className="kpr-mono text-[11px] font-black text-white tracking-widest">{selectedOp.level}</span>
                       </div>
                       <div className="p-6 bg-black flex flex-col gap-2">
                          <span className="kpr-mono text-[8px] font-black text-white/30 tracking-widest">ENCRYPTION</span>
                          <span className="kpr-mono text-[11px] font-black text-kpr-green tracking-widest">AES_256</span>
                       </div>
                    </div>
                 </div>

                 <div className="md:col-span-3 space-y-16">
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                         <div className="w-12 h-1 bg-black" />
                         <span className="kpr-mono text-[11px] font-black text-black tracking-[0.4em] uppercase">TECHNICAL_LOADOUT</span>
                      </div>
                      <div className="flex flex-wrap gap-4">
                         {selectedOp.tech.map((t: string) => (
                            <span key={t} className="px-6 py-3 bg-black text-white kpr-mono text-[10px] font-black tracking-[0.2em] uppercase">
                               {t}
                            </span>
                         ))}
                      </div>
                    </div>
                    
                    <div className="p-10 border-l-8 border-kpr-green bg-white shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rotate-45 translate-x-16 -translate-y-16" />
                       <div className="flex items-center gap-4 mb-6">
                          <Zap size={20} className="text-kpr-green animate-pulse" />
                          <span className="kpr-mono text-black text-[12px] font-black tracking-widest uppercase">BIO_METRICS</span>
                       </div>
                       <p className="kpr-mono text-[13px] leading-relaxed text-black/60 font-medium">
                          ELITE_OPERATOR_ENGAGED_IN_HIGH_FIDELITY_SYSTEM_ARCHITECTURE. 
                          MAINTAINS_MAXIMUM_UPTIME_AND_CODE_PURITY_ACROSS_ALL_AGRA_NODES.
                          CORE_MEMETIC_LOAD_STABLE. 
                       </p>
                    </div>

                    <div className="pt-8 grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setSelectedOp(null)} 
                        className="py-6 bg-black text-white hover:bg-kpr-green hover:text-black font-black uppercase text-[11px] tracking-[0.4em] transition-all"
                      >
                        DISMISS
                      </button>
                      <button className="py-6 border-4 border-black text-black hover:bg-black hover:text-white font-black uppercase text-[11px] tracking-[0.4em] transition-all">
                        UPLINK
                      </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
});

DevelopersSection.displayName = "DevelopersSection";
export default DevelopersSection;