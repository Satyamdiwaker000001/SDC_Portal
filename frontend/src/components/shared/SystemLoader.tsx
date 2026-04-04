import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../../utils/SoundManager';

const TERMINAL_LOGS = [
  "INITIALIZING_UPLINK",
  "SCANNING_CORE_MODULES",
  "ESTABLISHING_ENCRYPTED_HANDSHAKE",
  "SDC_PORTAL_V2.0_LOADED",
  "MAPPING_NEURAL_NETWORK",
  "AUTHENTICATING_USER_IDENTITY",
  "BYPASSING_RESTRICTED_PROTOCOL",
  "UPLINK_SUCCESS_DATA_SYNC_START"
];

const DIRECTORIES = [
  "KPRVERSE/SYSTEM/CORE/",
  "SDC/PORTAL/ARCHIVE/",
  "MODULE/UPLINK/SYNC/",
  "SYSTEM/UI/ZENITH/",
  "ACCESS/DENIED/",
  "CORE/NETWORK/GATEWAY/"
];

export const SystemLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(TERMINAL_LOGS[0]);
  const [currentDir, setCurrentDir] = useState(DIRECTORIES[0]);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Fix: Move Math.random() out of render path
  const randomSuffix = React.useMemo(() => Math.random().toString(36).substring(2, 15), []);

  useEffect(() => {
    if (hasStarted) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.random() * 5;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(onComplete, 500);
            return 100;
          }
          return next;
        });

        setCurrentLog(TERMINAL_LOGS[Math.floor(Math.random() * TERMINAL_LOGS.length)]);
        setCurrentDir(DIRECTORIES[Math.floor(Math.random() * DIRECTORIES.length)]);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [hasStarted, onComplete]);

  const handleStart = () => {
    soundManager.init();
    soundManager.playConfirm();
    setHasStarted(true);
  };

  const roundedProgress = Math.round(progress);

  return (
    <div className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center font-mono">
      {!hasStarted ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-12"
        >
           <div className="w-32 h-32 border border-black/10 flex items-center justify-center p-3 rounded-full relative">
              <div className="w-full h-full bg-black rounded-full animate-ping opacity-10 absolute" />
              <div className="w-full h-full bg-black rounded-full relative z-10" />
           </div>
           <button 
             onClick={handleStart}
             className="px-16 py-5 bg-black text-white font-black uppercase tracking-[0.4em] text-[11px] hover:bg-kpr-green hover:text-black transition-all"
             style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
           >
              Initialize_System
           </button>
           <p className="kpr-mono text-black font-black opacity-30 text-[9px] uppercase tracking-widest mt-4">Enable Sound for Full Experience</p>
        </motion.div>
      ) : (
        <div className="w-full h-full flex flex-col p-8 md:p-32 relative bg-[#fdfdfd]">
           {/* Terminal Output */}
           <div className="flex-1 flex flex-col justify-end gap-2 mb-24 overflow-hidden">
              <div className="flex items-center gap-4">
                 <span className="w-2 h-2 bg-kpr-green animate-pulse" />
                 <p className="kpr-mono text-black font-black text-[12px] tracking-widest">
                   [{roundedProgress}%] <span className="opacity-40">{currentLog}</span>
                 </p>
              </div>
              <p className="kpr-mono text-[9px] opacity-20 truncate ml-6">{currentDir} {randomSuffix}</p>
              
              <div className="h-[2px] w-full bg-black/5 mt-8 relative">
                 <motion.div 
                   className="absolute left-0 top-0 h-full bg-black"
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                 />
              </div>
           </div>

           {/* Layout Info */}
           <div className="absolute top-24 right-24 text-right opacity-30 pointer-events-none hidden md:block">
              <p className="kpr-mono text-[10px] font-black tracking-widest text-black">V.2.04 // SDC_SYS</p>
              <p className="kpr-mono text-[10px] font-black tracking-widest text-black">PORTAL_UPLINK_009</p>
           </div>
        </div>
      )}
    </div>
  );
};
