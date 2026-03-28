import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

// cSpell:ignore Krpverse
type CursorMode = 'DEFAULT' | 'INTERACTIVE' | 'INPUT';

export const CrosshairCursor = () => {
  const [cursorMode, setCursorMode] = useState<CursorMode>('DEFAULT');
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 450, mass: 0.6 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleContext = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select')) {
        setCursorMode('INPUT');
        return;
      }
      if (target.closest('button, a, [role="button"]')) {
        setCursorMode('INTERACTIVE');
        return;
      }
      setCursorMode('DEFAULT');
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleContext);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleContext);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-999999 flex items-center justify-center filter drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    >
      <AnimatePresence mode="wait">
        {cursorMode === 'INPUT' && (
          <motion.div key="input" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center">
             <motion.div animate={{ x: [-10, -7, -10] }} transition={{ repeat: Infinity, duration: 1 }} className="text-cyan-400 font-mono text-2xl font-black">[</motion.div>
             <div className="w-0.5 h-7 bg-white shadow-[0_0_10px_#22d3ee] rounded-full mx-1" />
             <motion.div animate={{ x: [10, 7, 10] }} transition={{ repeat: Infinity, duration: 1 }} className="text-cyan-400 font-mono text-2xl font-black">]</motion.div>
          </motion.div>
        )}

        {cursorMode === 'INTERACTIVE' && (
          <motion.div key="inter" initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 45 }} exit={{ opacity: 0 }} className="w-8 h-8 border-2 border-white rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
             <div className="w-2 h-2 bg-cyan-400 rounded-sm" />
          </motion.div>
        )}

        {cursorMode === 'DEFAULT' && (
          <motion.div key="def" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-white rounded-full border border-black/50 shadow-[0_0_8px_#22d3ee]" />
             <div className="absolute flex flex-col justify-between h-10 w-px">
                <div className="w-full h-2.5 bg-cyan-400" />
                <div className="w-full h-2.5 bg-cyan-400" />
             </div>
             <div className="absolute flex justify-between w-10 h-px">
                <div className="h-full w-2.5 bg-cyan-400" />
                <div className="h-full w-2.5 bg-cyan-400" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};