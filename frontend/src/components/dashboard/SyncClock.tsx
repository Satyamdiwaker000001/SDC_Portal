import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { cn } from '../../utils/cn';

interface SyncClockProps {
  retireDate: Date;
}

export default function SyncClock({ retireDate }: SyncClockProps) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number }>({ d: 0, h: 0, m: 0, s: 0 });
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const totalSeconds = differenceInSeconds(retireDate, new Date());
      
      if (totalSeconds <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        setIsCritical(true);
        clearInterval(timer);
        return;
      }

      if (totalSeconds <= 86400) {
        setIsCritical(true);
      }

      const d = Math.floor(totalSeconds / (3600 * 24));
      const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = Math.floor(totalSeconds % 60);

      setTimeLeft({ d, h, m, s });
    }, 1000);

    return () => clearInterval(timer);
  }, [retireDate]);

  const pad = (num: number) => num.toString().padStart(2, '0');

  // We could implement Framer Motion rolling logic here, but for now CSS transitions on numbers might be overkill for a React hook unless using a specific library. 
  // Given user asked for "Rolling Digital Odometer", we will simulate the style using monospace styling and vertical slide wrappers.



  return (
    <div className={cn(
      "flex flex-col items-end gap-1 p-3 rounded backdrop-blur-md transition-colors duration-1000",
      isCritical ? "bg-red-900/20 text-red-400 border border-red-500/30 animate-pulse" : "bg-carbon-black-800/40 text-slate-grey-300 border border-carbon-black-500/30"
    )}>
      <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">Ascension Timer</div>
      <div className="flex items-center text-xl font-mono opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
        {timeLeft.d}D : {pad(timeLeft.h)} : {pad(timeLeft.m)} : {pad(timeLeft.s)}
      </div>
    </div>
  );
}
