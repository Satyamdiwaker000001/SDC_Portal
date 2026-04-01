/* cspell:disable */
import { ShieldCheck, Cpu, Zap, Layers, Globe } from "lucide-react"; // Globe add kar diya
import { motion } from "framer-motion";
import Navbar from "../landingpage/Navbar";

export default function About() {
  const CORE_VALUES = [
    { icon: ShieldCheck, title: "SECURITY", desc: "Building robust architectures." },
    { icon: Cpu, title: "INNOVATION", desc: "Pushing the digital frontier." },
    { icon: Zap, title: "SPEED", desc: "Rapid deployment and execution." },
    { icon: Layers, title: "SCALABILITY", desc: "Systems designed for the future." }
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-sky-500/30 font-sans">
      <Navbar />

      <main className="pt-32 pb-20 px-10 max-w-5xl mx-auto relative z-10">
        <section className="mb-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6"
          >
            WHO WE <span className="text-sky-500 drop-shadow-[0_0_15px_#0ea5e966]">ARE</span>
          </motion.h1>
          <p className="max-w-2xl mx-auto text-zinc-500 text-[11px] font-black uppercase tracking-[0.4em] leading-loose">
            The Software Development Cell is a nexus of engineering minds dedicated to architecting the digital ecosystem. We don't just write code; we engineer future-proof solutions.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CORE_VALUES.map((val, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 10 }}
              className="flex gap-6 p-8 border border-white/5 bg-zinc-950/30 hover:border-sky-500/30 transition-all"
            >
              <div className="shrink-0 w-12 h-12 bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 shadow-[0_0_15px_#0ea5e922]">
                <val.icon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2 italic">{val.title}</h3>
                <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-wider leading-relaxed">{val.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Area with Globe */}
        <footer className="mt-32 p-12 border-t border-white/5 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Globe className="text-sky-500/20 mb-6" size={40} />
          </motion.div>
          <p className="text-[9px] font-black uppercase tracking-[0.8em] text-zinc-800">SDC_CORE_SYSTEM // EST. 2024</p>
        </footer>
      </main>
    </div>
  );
}