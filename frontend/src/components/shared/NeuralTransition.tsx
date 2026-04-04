import { motion, type Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const contentVariants: Variants = {
  initial: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
  enter: { 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    filter: 'blur(5px)',
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
  }
};

const swipeVariants: Variants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: { duration: 0.6, ease: 'easeInOut' }
  }
};

export default function NeuralTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    // Play a subtle high-frequency click sound if there's an audio file available in future
  }, [location.pathname]);

  return (
    <div className="relative w-full h-full">
      <motion.div
        key={location.pathname + "scan"}
        className="neural-swipe-overlay bg-bright-snow-DEFAULT w-1 opacity-50 shadow-[0_0_20px_4px_theme(colors.bright-snow.DEFAULT)]"
        variants={swipeVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div
        key={location.pathname}
        variants={contentVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
