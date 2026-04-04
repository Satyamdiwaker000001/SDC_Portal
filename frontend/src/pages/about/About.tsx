import { ShieldCheck, Cpu, Zap, Layers, Globe } from "lucide-react"; 
import { motion } from "framer-motion";
import { soundManager } from "../../utils/SoundManager";
import { HackyText } from "../../components/shared/HackyText";

export default function About() {
  const CORE_VALUES = [
    { icon: ShieldCheck, title: "SECURITY", desc: "Building robust architectures." },
    { icon: Cpu, title: "INNOVATION", desc: "Pushing the digital frontier." },
    { icon: Zap, title: "SPEED", desc: "Rapid deployment and execution." },
    { icon: Layers, title: "SCALABILITY", desc: "Systems designed for the future." }
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black selection:bg-kpr-green font-sans relative overflow-x-hidden pt-32">
      
      {/* Background Component */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#fdfdfd]" />
      </div>


      <main className="pt-48 pb-32 px-6 md:px-12 max-w-5xl mx-auto relative z-10">
        <section className="mb-32 text-left relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="kpr-mono text-black text-[10px] mb-4 opacity-40 font-black tracking-widest uppercase">Operational_Origins</p>
            <HackyText 
              text="SYSTEM_GENESIS" 
              className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-10 leading-none text-black" 
            />
            <p className="max-w-xl kpr-mono text-[11px] leading-relaxed text-black border-l-4 border-black pl-8 py-4 opacity-60">
              THE SOFTWARE DEVELOPMENT CELL IS A PRIVILEGED OPERATIONAL NODE DEDICATED TO ARCHITECTING THE NEXT GENERATION OF DIGITAL SYSTEMS. WE DO NOT JUST WRITE CODE; WE ENGINEER UNBREAKABLE FUTURES.
            </p>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {CORE_VALUES.map((val, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => soundManager.playHover()}
              className="group flex flex-col gap-8 p-12 kpr-panel bg-white border-black/5 hover:border-kpr-green transition-all relative"
            >
              <div className="shrink-0 w-20 h-20 bg-black flex items-center justify-center text-white group-hover:bg-kpr-green group-hover:text-black transition-colors duration-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}>
                <val.icon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-4 italic italic">{val.title}</h3>
                <p className="text-black opacity-40 kpr-mono text-[10px] uppercase leading-relaxed tracking-widest">{val.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Area with Globe */}
        <footer className="mt-48 p-20 border-t border-black/5 text-center relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="inline-block opacity-10"
          >
            <Globe className="text-black" size={64} strokeWidth={1} />
          </motion.div>
          <p className="kpr-mono text-[10px] text-black tracking-[1em] font-black uppercase mt-12 opacity-20">SDC_CORE_SYSTEM // ARCHITECT_NULL</p>
        </footer>
      </main>
    </div>
  );
}