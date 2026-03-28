import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface MainHUDProps {
  children: ReactNode;
  title?: string;
  status?: string;
}

export const MainHUD = ({ 
  children, 
  title = "SDC_COMMAND", 
  status = "SYSTEM_READY_V4.5" 
}: MainHUDProps) => {
  return (
    <div className="relative h-screen w-full bg-[#020617] text-slate-200 flex flex-col overflow-hidden font-sans">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-linear-to-b from-slate-900 to-[#020617]" />
        <div className="absolute inset-0 bg-size-[4rem_4rem] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] opacity-10" />
      </div>

      {/* HUD Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-16 px-10 flex items-center justify-between z-50 border-b-2 border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl"
      >
        <div className="flex items-center gap-5 cursor-none">
          <div className="w-10 h-10 bg-cyan-500 text-black -skew-x-12 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <div className="skew-x-12 text-xl font-black">⚡</div>
          </div>
          <div>
            <h1 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none">{title}</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap size={8} className="text-cyan-400 animate-pulse" />
              <span className="text-[7px] font-black text-cyan-500/40 tracking-[0.4em]">{status}</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 p-10 z-10 overflow-y-auto custom-scrollbar"
      >
        {children}
      </motion.main>
    </div>
  );
};
