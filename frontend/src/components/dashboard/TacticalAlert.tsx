
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface TacticalAlertProps {
  title: string;
  message: string;
  type: 'order' | 'general';
}

export default function TacticalAlert({ title, message, type }: TacticalAlertProps) {
  const isOrder = type === 'order';

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative p-4 rounded uppercase tracking-wide overflow-hidden border",
        isOrder 
          ? "bg-carbon-black-900 border-yellow-500/50 text-platinum-100" 
          : "bg-carbon-black-800 border-slate-grey-500/30 text-pale-slate-700"
      )}
    >
      {/* High-Priority Scanning Border */}
      {isOrder && (
        <>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-[scrollX_2s_linear_infinite]" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-[scrollX_2s_linear_infinite_reverse]" />
          <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-[scrollX_2s_linear_infinite]" />
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-[scrollX_2s_linear_infinite_reverse]" />
          
          <div className="absolute top-0 left-0 w-full h-full bg-yellow-900/10 mix-blend-overlay animate-pulse pointer-events-none" />
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          {isOrder && <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />}
          <h4 className={cn("text-xs font-bold font-mono tracking-widest", isOrder ? "text-yellow-500" : "text-mist-grey-400")}>
            {isOrder ? "CRITICAL ORDER" : "GENERAL UPDATE"}
          </h4>
        </div>
        <h3 className="text-sm font-semibold mb-2">{title}</h3>
        <p className={cn("text-xs leading-relaxed", isOrder ? "text-bright-snow-300" : "text-slate-grey-400")}>{message}</p>
      </div>
    </motion.div>
  );
}
