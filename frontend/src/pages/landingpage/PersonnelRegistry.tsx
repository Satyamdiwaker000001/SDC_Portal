/* cspell:disable */
import React from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../../utils/SoundManager';

const OPERATIVES = [
  { id: "01", name: "SATYAM_ADMIN", role: "SYSTEM_ARCHITECT", status: "ONLINE", image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=admin" },
  { id: "02", name: "OPERATIVE_K", role: "SECURITY_PROTOCOL", status: "STABLE", image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=k" },
  { id: "03", name: "DEV_ZERO", role: "FORGE_DEVELOPER", status: "BUSY", image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=zero" },
  { id: "04", name: "ARCHIVIST", role: "DATA_LORE", status: "ONLINE", image: "https://api.dicebear.com/7.x/pixel-art/svg?seed=archive" },
];

const PersonnelRegistry: React.FC = () => {
  return (
    <div className="w-full relative px-12 md:px-24">
      {/* Section Header */}
      <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-kpr-grey pb-12">
        <div className="space-y-4">
          <span className="kpr-mono-label mb-2 block">SECTION_02</span>
          <h2 className="kpr-title-large">PERSONNEL_<br />REGISTRY</h2>
        </div>
        <p className="max-w-md kpr-mono-label leading-relaxed opacity-60">
           VERIFIED OPERATIVES OF THE SOFTWARE DEVELOPMENT CELL. ALL IDENTITIES SECURED WITHIN THE FORGE.
        </p>
      </div>

      {/* Registry Horizontal Scroll */}
      <div className="flex flex-col md:flex-row gap-12 overflow-x-visible">
        {OPERATIVES.map((op, i) => (
          <motion.div
            key={op.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onMouseEnter={() => soundManager.playHover()}
            className="group relative w-full md:w-[350px] aspect-[4/5] overflow-hidden kpr-panel cursor-pointer hover:border-kpr-green transition-colors"
          >
            {/* Background Image / Placeholder */}
            <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700 bg-slate-grey-50">
               <img src={op.image} alt={op.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-kpr-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-1 z-10 transition-transform duration-500 group-hover:-translate-y-4">
               <div className="flex justify-between items-center mb-4">
                  <span className="kpr-badge-neon opacity-0 group-hover:opacity-100 transition-opacity">
                    {op.status}
                  </span>
                  <span className="kpr-mono-label text-white/40 group-hover:text-kpr-green">#{op.id}</span>
               </div>
               <h3 className="text-2xl font-black italic text-white group-hover:text-kpr-green transition-colors">{op.name}</h3>
               <p className="kpr-mono-label text-white/50">{op.role}</p>
            </div>

            {/* Geometric Detail */}
            <div className="absolute top-6 right-6 flex flex-col gap-1 opacity-20">
               <div className="w-8 h-[1px] bg-kpr-black" />
               <div className="w-4 h-[1px] bg-kpr-black" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Technical Annotation */}
      <div className="mt-24 flex justify-end">
         <div className="flex items-center gap-6">
            <span className="kpr-mono-label">PGE-002_PERSONNEL_INDEX</span>
            <div className="w-12 h-[1px] bg-kpr-black opacity-20" />
         </div>
      </div>
    </div>
  );
};

export default PersonnelRegistry;
