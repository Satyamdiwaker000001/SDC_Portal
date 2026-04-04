
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface LiquidProgressBarProps {
  totalModules: number;
  completedModules: number;
  justVerified?: boolean;
}

export default function LiquidProgressBar({ totalModules, completedModules, justVerified }: LiquidProgressBarProps) {
  const percentage = totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);
  
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between text-xs font-mono tracking-widest text-mist-grey-300 uppercase">
        <span>Systems Sync</span>
        <span className={cn(percentage === 100 ? "text-platinum-100 font-bold" : "")}>{percentage}%</span>
      </div>
      
      <div className="relative w-full h-3 bg-iron-grey-500 rounded-full overflow-hidden flex gap-[2px] p-[2px]">
        {/* Floating Liquid Bubbles background effect */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpIiAvPgo8L3N2Zz4=')] opacity-20 animate-[floatBubble_3s_ease-in-out_infinite] mix-blend-overlay pointer-events-none z-10" />
        
        {/* Segments */}
        {Array.from({ length: totalModules }).map((_, index) => {
          const isCompleted = index < completedModules;
          const isLastVerified = justVerified && index === completedModules - 1;
          
          return (
            <motion.div
              key={index}
              initial={isLastVerified ? { scale: 0.8, filter: 'brightness(2)' } : {}}
              animate={isLastVerified ? { 
                scale: 1, 
                filter: 'brightness(1)',
                boxShadow: ['0px 0px 0px rgba(0,0,0,0)', '0px 0px 15px 4px var(--color-platinum-100)', '0px 0px 0px rgba(0,0,0,0)']
              } : {}}
              transition={{ duration: 0.5 }}
              className={cn(
                "h-full flex-1 rounded-sm relative z-0 transition-all duration-300",
                isCompleted ? "bg-platinum-100" : "bg-carbon-black-600/50"
              )}
            >
              {isCompleted && (
                 <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-sm" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
