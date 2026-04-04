/* cspell:disable */
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Cpu } from 'lucide-react';

const MISSION_ITEMS = [
  { icon: Shield, title: "SECURITY", desc: "SYSTEM_INTEGRITY_IS_PARALEL_PROTOCOL_A." },
  { icon: Zap, title: "VELOCITY", desc: "RAPID_DEPLOYMENT_CORE_SYNAPSE_INIT." },
  { icon: Globe, title: "WORLD", desc: "GLOBAL_SYSTEM_ARCHITECTURE_DEPLOY." },
  { icon: Cpu, title: "FORGE", desc: "DIGITAL_ASSET_CREATION_REGISTRY_V4." },
];

const MissionTechnical: React.FC = () => {
  return (
    <div className="w-full relative z-10 px-12 md:px-24">
      {/* Section Header */}
      <div className="mb-32 flex flex-col items-center text-center gap-6">
        <span className="kpr-mono-label opacity-40">SECTION_03 // CORE_MISSION</span>
        <h2 className="kpr-title-large text-kpr-green">THE_SDC_<br />MISSION</h2>
        <div className="w-24 h-[1px] bg-kpr-green" />
      </div>

      {/* Full-width Technical Grid Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-white/20">
         {MISSION_ITEMS.map((item, i) => (
           <motion.div
             key={item.title}
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: i * 0.1 }}
             className="p-16 border-r border-white/20 last:border-r-0 group hover:bg-white/5 transition-all cursor-pointer"
           >
              <div className="mb-12 flex justify-between items-start">
                 <item.icon size={32} className="text-kpr-green" />
                 <span className="kpr-mono-label text-white/20 group-hover:text-kpr-green transition-colors">00{i+1}</span>
              </div>
              <h3 className="text-3xl font-black italic mb-6 group-hover:translate-x-2 transition-transform">{item.title}</h3>
              <p className="kpr-mono-label text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                 {item.desc}
              </p>
           </motion.div>
         ))}
      </div>

      {/* Decorative Technical Overlay */}
      <div className="mt-48 flex flex-col md:flex-row justify-between items-start gap-24">
         <div className="flex flex-col gap-6 max-w-xl">
            <h4 className="text-2xl font-black italic">SDC_SYSTEM_LOGS</h4>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="flex gap-6 items-center border-b border-white/10 pb-4">
                    <span className="kpr-mono-label text-kpr-green">#{i}</span>
                    <span className="kpr-mono-label opacity-40">INIT_UPLINK_SUCCESS // LATENCY_STABLE_0{i}</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="p-12 border-2 border-kpr-green bg-kpr-green text-kpr-black kpr-panel">
            <p className="kpr-mono-label font-black mb-4 leading-relaxed">
               WE DO NOT JUST WRITE CODE; WE ENGINEER THE FUTURE OF THE DIGITAL ECOSYSTEM.
            </p>
            <div className="flex justify-between items-center">
               <span className="kpr-mono-label">PGE-003_MISSION</span>
               <div className="w-12 h-12 border-b-4 border-r-4 border-kpr-black" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default MissionTechnical;
