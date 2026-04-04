/* cspell:disable */
import React from 'react';
import { motion } from 'framer-motion';

const HeroDiscover: React.FC = () => {
  return (
    <div className="relative z-10 w-full px-12 md:px-24">
      {/* Visual Annotation */}
      <div className="mb-12 flex items-center gap-6">
        <div className="w-12 h-[1px] bg-kpr-black" />
        <span className="kpr-mono-label">INIT_UPLINK // SDC_CORE</span>
      </div>

      <div className="flex flex-col gap-0">
        <div className="kpr-reveal-vertical active">
          <motion.h1 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="kpr-title-massive"
          >
            SYSTEM
          </motion.h1>
        </div>
        
        <div className="kpr-reveal-vertical active -mt-4">
          <motion.h1 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="kpr-title-massive text-kpr-green"
          >
            PORTAL
          </motion.h1>
        </div>

        <div className="max-w-xl mt-12 space-y-6">
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.5 }}
             className="kpr-mono-label leading-relaxed text-kpr-black/60"
           >
             THE SOFTWARE DEVELOPMENT CELL IS AN ADVANCED OPERATIONAL NODE FOR DIGITAL ARCHITECTURE. PROTECT THE DATA. REIMAGINE THE FORGE.
           </motion.p>
           
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.8 }}
           >
              <button className="kpr-btn-notched">
                 ACCESS_REGISTRY
              </button>
           </motion.div>
        </div>
      </div>

      {/* Decorative Technical Widget */}
      <div className="absolute right-12 bottom-0 hidden lg:block">
         <div className="p-8 border border-kpr-grey bg-white/50 backdrop-blur-sm">
            <div className="kpr-mono-label mb-2">SYSTEM_CLOCK</div>
            <div className="text-2xl font-black italic mb-4">120.441.MS</div>
            <div className="flex gap-2">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-1 h-4 ${i < 4 ? 'bg-kpr-green' : 'bg-kpr-grey'}`} />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default HeroDiscover;
