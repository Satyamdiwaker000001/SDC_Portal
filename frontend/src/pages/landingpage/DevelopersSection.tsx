/* cspell:disable */
import { useState, useEffect } from "react";
import { Users, Cpu, Zap, Fingerprint, Activity, History } from "lucide-react"; 
import { forwardRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const DevelopersSection = forwardRef<HTMLElement>((_, ref) => {
  const DEVS = [
    { 
      id: "SDC-2026-01", 
      name: "SATYAM DIWAKER", 
      role: "SYSTEM_LEAD", 
      status: "ACTIVE",
      tech: ["NESTJS", "TS", "PYTHON"],
      stats: { hp: 95, mp: 88, lvl: 42 }
    },
    { 
      id: "SDC-2026-02", 
      name: "CODE_REAPER", 
      role: "BACKEND_WARRIOR", 
      status: "ACTIVE",
      tech: ["GO", "DOCKER", "REDIS"],
      stats: { hp: 82, mp: 94, lvl: 38 }
    },
    { 
      id: "SDC-HIST-01", 
      name: "LEGACY_OPERATIVE", 
      role: "ARCHITECT_EMERITUS", 
      status: "FORMER",
      tech: ["C++", "ASSEMBLY", "KUBERNETES"],
      stats: { hp: 100, mp: 100, lvl: 99 }
    },
  ];

  const [activeTab, setActiveTab] = useState<"ACTIVE" | "FORMER">("ACTIVE");
  const [inspectedDev, setInspectedDev] = useState<string | null>(null);

  const filteredDevs = DEVS.filter(dev => dev.status === activeTab);

  useEffect(() => {
    const release = () => setInspectedDev(null);
    window.addEventListener("mouseup", release);
    window.addEventListener("touchend", release);
    return () => {
      window.removeEventListener("mouseup", release);
      window.removeEventListener("touchend", release);
    };
  }, []);

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, x: "-50%", y: "-40%", left: "50%", top: "50%" },
    visible: { 
      opacity: 1, scale: 1, x: "-50%", y: "-50%", left: "50%", top: "50%",
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.8, x: "-50%", y: "-40%", transition: { duration: 0.2 } }
  };

  return (
    <section 
      ref={ref} 
      className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-start py-32 px-8 overflow-hidden border-t border-orange-500/10 select-none touch-none z-40"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#f97316 1px, transparent 1px)`, backgroundSize: '30px 30px' }} 
      />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <Fingerprint size={14} className="animate-pulse" /> SDC_Registry_Access
          </div>
          <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter leading-none">
            THE <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">DEVELOPERS</span>
          </h2>
        </div>

        <div className="flex justify-center mb-20 gap-4">
          <button 
            onClick={() => setActiveTab("ACTIVE")}
            className={`flex items-center gap-3 px-8 py-3 font-black text-[10px] uppercase tracking-[0.3em] transition-all border ${activeTab === 'ACTIVE' ? 'bg-orange-500 text-black border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-orange-500/50 hover:text-orange-500'}`}
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
          >
            <Activity size={14} /> Active_Operatives
          </button>
          <button 
            onClick={() => setActiveTab("FORMER")}
            className={`flex items-center gap-3 px-8 py-3 font-black text-[10px] uppercase tracking-[0.3em] transition-all border ${activeTab === 'FORMER' ? 'bg-orange-500 text-black border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-orange-500/50 hover:text-orange-500'}`}
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
          >
            <History size={14} /> Former_Legends
          </button>
        </div>

        <motion.div 
          layout
          className={`grid grid-cols-1 md:grid-cols-3 gap-10 transition-all duration-500 ${inspectedDev ? 'blur-xl opacity-20' : 'blur-0 opacity-100'}`}
        >
          <AnimatePresence mode="popLayout">
            {filteredDevs.map((dev) => (
              <motion.div 
                key={dev.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group active:scale-95 transition-transform cursor-crosshair"
                onMouseDown={(e) => { e.preventDefault(); setInspectedDev(dev.id); }}
                onTouchStart={(e) => { e.preventDefault(); setInspectedDev(dev.id); }}
              >
                <div className="bg-zinc-900 border-2 border-zinc-800 p-1 relative overflow-hidden"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}>
                  <div className="bg-black p-6 border border-zinc-800 flex flex-col items-center">
                    <div className="w-32 h-40 bg-zinc-900 border-2 border-orange-500/20 flex items-center justify-center mb-6 relative group-hover:border-orange-500 transition-colors">
                        <Users size={60} strokeWidth={0.5} className="text-zinc-700 group-hover:text-orange-500" />
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
                    </div>
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">{dev.name}</h3>
                    <p className="text-[9px] font-mono text-orange-500 uppercase tracking-widest mt-1">{dev.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {inspectedDev && (() => {
          const devData = DEVS.find(d => d.id === inspectedDev);
          return devData && (
            <>
              <motion.div className="fixed inset-0 z-2000 bg-black/80 backdrop-blur-md" variants={overlayVariants} initial="hidden" animate="visible" exit="hidden" />
              <motion.div 
                className="fixed z-2001 w-[95%] max-w-2xl bg-[#0a0a0a] border-2 border-orange-500 shadow-[0_0_100px_rgba(249,115,22,0.4)] overflow-hidden"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)' }}
                variants={cardVariants} initial="hidden" animate="visible" exit="exit"
              >
                <div className={`px-6 py-2 bg-orange-500 text-black flex justify-between items-center`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">PERSONNEL_IDENTITY_VERIFIED</span>
                  <Cpu size={14} />
                </div>
                {/* Modal content details yahan same rahenge */}
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-60 bg-black border-2 border-orange-500 flex items-center justify-center relative">
                        <Users size={100} strokeWidth={0.5} className="text-orange-950" />
                        <motion.div 
                          className="absolute top-0 left-0 w-full h-1 bg-orange-500 shadow-[0_0_15px_orange]"
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <div className="font-mono text-[10px] text-orange-500 bg-orange-500/10 px-3 py-1 border border-orange-500/20 uppercase font-black">
                      ID: {devData.id}
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-4xl font-black italic text-white uppercase leading-none">{devData.name}</h3>
                      <p className="text-orange-500 font-mono text-xs uppercase tracking-[0.3em] mt-2">{devData.role}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-6">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Integrity</span>
                        <div className="h-1.5 bg-zinc-900 overflow-hidden"><motion.div className="h-full bg-orange-600" initial={{width: 0}} animate={{width: `${devData.stats.hp}%`}} /></div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Power_Level</span>
                        <div className="h-1.5 bg-zinc-900 overflow-hidden"><motion.div className="h-full bg-orange-400" initial={{width: 0}} animate={{width: `${devData.stats.mp}%`}} /></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block italic">Authorized_Stack</span>
                      <div className="flex flex-wrap gap-2">
                        {devData.tech.map(t => (
                          <span key={t} className="text-[9px] border border-orange-500/30 px-3 py-1 text-white font-mono uppercase bg-orange-500/5 font-black">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 border-t border-zinc-800 flex justify-between items-end opacity-40">
                       <span className="text-[8px] font-mono text-zinc-600 uppercase italic tracking-widest">Access_Granted // SDC_Core</span>
                       <Zap size={20} className="text-orange-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </section>
  );
});

DevelopersSection.displayName = "DevelopersSection";

// FIXED: Added Default Export to resolve Error 2613
export default DevelopersSection;