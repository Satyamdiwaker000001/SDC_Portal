import { useState } from 'react';
import { motion } from 'framer-motion';

export const BackgroundEngine = () => {
  const [particles] = useState(() => 
    [...Array(20)].map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      moveY: Math.random() * 100 - 50,
      delay: Math.random() * 5
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-black">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-cyan-500/10 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.1)]"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%` }}
          animate={{ opacity: [0, 0.4, 0], y: [0, p.moveY] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
};